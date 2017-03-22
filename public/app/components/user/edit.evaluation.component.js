(function() {
    "use strict";

    var module = angular.module("p1");
    
    function controller(p1API, Upload, authentication, socket, Eval, helper, ngToast, $window, $interval, $timeout) {
        var vm = this;
        vm.files = [];
        vm.files_aleady_uploaded = [];

        //declarations
        vm.currentPageIndex         = Eval.currentPageIndex;
        vm.NUM_OF_PAGES             = Eval.NUM_OF_PAGES;
        vm.current_user             = authentication.currentUser();
        //vm.disabled                 = undefined;
        vm.headers                  = ['Supporting Documents', 'Vendor Information', 'Vendor Information', 'Vendor Work History', 'Vendor\'s Rating', 'Written Recommendation', 'Detailed Information', 'Endorsers Detail'];
        vm.progress_bar             = (1 / vm.NUM_OF_PAGES) * 100;
        vm.disable                  = true;
        vm.eval_saved               = false;
        vm.files_saved              = false;
        vm.determinateValue         = 0;
        vm.collaborative_doc        = false;
        vm.eval_locked              = false;

        //functions
        vm.addVendorWorkHistoryItem     = helper.addItem;
        vm.removeVendorWorkHistoryItem  = helper.removeItem;
        vm.addStrength                  = helper.addItem;
        vm.removeStrength               = helper.removeItem;
        vm.addWeakness                  = helper.addItem;
        vm.removeWeakness               = helper.removeItem;
        vm.addEndorserDetail            = helper.addItem;
        vm.removeEndorserDetail         = helper.removeItem;

        //TODO: check if collaborative eval first
        socket.on('locked_evals_update', function(data) {
            if(vm.collaborative_doc){
              checkIfUserCanModifyEval();  
            } 
        });

        vm.$routerOnActivate = function(next, previous) {
            vm.id = next.params.id;
            
            p1API.evaluation.get({id:vm.id},
                                function() {console.log("Success retrieving item.");},
                                function() {console.log("Error retrieving item.");}
                            )
                            .$promise
                            .then( function(evaluation) {
                                vm.vendor_name                = evaluation.vendor_name;
                                vm.name                       = evaluation.name;
                                vm.phone                      = evaluation.phone;
                                vm.company                    = evaluation.company;
                                vm.position                   = evaluation.position;
                                vm.vendor_name                = evaluation.vendor_name;
                                vm.sub_direction              = evaluation.sub_direction;
                                vm.manager                    = evaluation.manager;
                                vm.nominating_manager         = evaluation.nominating_manager;
                                vm.vendor_title               = evaluation.vendor_title;
                                vm.vendor_age                 = evaluation.vendor_age;
                                vm.years_in_market            = evaluation.years_in_market;
                                vm.years_in_industry          = evaluation.years_in_industry;
                                vm.features                   = evaluation.features;
                                vm.team_size                  = evaluation.team_size;
                                vm.total_competitors          = evaluation.total_competitors;
                                vm.location                   = evaluation.location;
                                vm.history_list               = evaluation.history_list;
                                vm.last_4_year_rating         = evaluation.last_4_year_rating;
                                vm.last_3_year_rating         = evaluation.last_3_year_rating;
                                vm.last_2_year_rating         = evaluation.last_2_year_rating;
                                vm.last_1_year_rating         = evaluation.last_1_year_rating;
                                vm.current_scope_of_works     = evaluation.current_scope_of_works;
                                vm.proposed_work_mapping      = evaluation.proposed_work_mapping;
                                vm.key_factors                = evaluation.key_factors;
                                vm.best_clients               = evaluation.best_clients;
                                vm.differentiating_factors    = evaluation.differentiating_factors;
                                vm.endorsers_comments         = evaluation.endorsers_comments;
                                vm.endorsers_detail_list      = evaluation.endorsers_detail_list;
                                vm.strengths                  = evaluation.strengths;
                                vm.weaknesses                 = evaluation.weaknesses;
                                vm.file_list                  = evaluation.file_list;
                                
                                if(evaluation.user == "Collaborative Document"){
                                    console.log("This is a collaborative Document");
                                    vm.collaborative_doc        = true;
                                    //Check if evaluation is not locked 
                                    socket.emit('check_locked_evals');
                                    checkIfUserCanModifyEval();
                                }
                                
                            });                        
        };

        function checkIfUserCanModifyEval() {
            //Send socket message
            var data = Eval.isEvalLocked(vm.id);

            //console.log(JSON.stringify(Eval.locked_evals));
            //console.log("Admin------result: " + data.result + " , user: " + data.user);
            
            if(data.result && data.user != vm.current_user.email) {
                ngToast.dismiss();
                ngToast.create({
                  className: 'danger',          //say who the current evaluator is?
                  content: 'This evaluation is Locked. Please wait until ' + data.user +' is finished making changes.',
                  dismissOnTimeout: false,
                  dismissOnClick: false
                });
                vm.eval_locked = true;
            }
            else {
                socket.emit('eval_opened', { eval: vm.id, user: vm.current_user.email});
                ngToast.dismiss();
                ngToast.create({
                  className: 'success',          //say who the current evaluator is?
                  content: 'Evaluation is open for edits.',
                  dismissOnTimeout: true,
                  dismissOnClick: true
                });
                vm.eval_locked = false;
            }
        };
        
        vm.updatePageToNext = function () {
            vm.currentPageIndex = (vm.currentPageIndex + 1 <= vm.NUM_OF_PAGES ) ? vm.currentPageIndex + 1 : vm.NUM_OF_PAGES;
            vm.progress_bar = (vm.currentPageIndex / vm.NUM_OF_PAGES) * 100;
        };
        
        vm.updatePageToPrevious = function () {
            vm.currentPageIndex = (vm.currentPageIndex - 1 > 0) ? vm.currentPageIndex - 1 : 1; 
            vm.progress_bar = (vm.currentPageIndex / vm.NUM_OF_PAGES) * 100;
        };
        
        vm.showPage = function(currentPage) {
            return (currentPage == vm.currentPageIndex)
        };

        vm.saveChanges = function () {
            if(vm.eval_locked){
                alert("Eval is locked, please wait until it is available.");
            }
            else{
                vm.disable = false;
                vm.eval_submitted = false;
                vm.status = "In Progress";
                vm.updateAndSendEvalToDb();

                //only upload unique files no already uploaded
                vm.files_not_uploaded = getFilesNotUploaded(vm.files, vm.files_aleady_uploaded);
                p1API.saveFiles(vm, vm.files_not_uploaded, vm.vendor_name, vm.id, vm.current_user.email);

                $timeout( function() {
                    ngToast.dismiss();
                    ngToast.create({
                      className: 'success',
                      content: 'Evaluation has just been saved',
                      dismissOnTimeout: true,
                      dismissOnClick: true
                    });

                    //Update saved files and clear files so they dont save again on next save 
                    vm.files_aleady_uploaded = vm.files;
                    vm.files_not_uploaded = [];
                }, 800);
            }
            
        };

        function getFilesNotUploaded(allFiles, aleadyUploaded){
            var unique = [];
            var length_up = aleadyUploaded.length; 
            var length_all = allFiles.length;
            var upload_file = true;

            for(var i = 0; i < length_all; i++){
                for(var j = 0; j < length_up; j++){
                    if(aleadyUploaded[j].name == allFiles[i].name){ //what prop to compare??
                        upload_file = false;
                    }
                }
                if(upload_file == true){
                    unique.push(allFiles[i])
                }
                upload_file = true;
            }

            return unique;
        };

        vm.submit = function () {
            if(vm.eval_locked){
                alert("Eval is locked, please wait until it is available.");
            }
            else{
                var response = confirm("Are you sure you want to submit final version of Evaluation?");

                if(response){
                    vm.disable = false;
                    vm.eval_submitted = true;
                    vm.status = "Complete";
                    vm.updateAndSendEvalToDb();
                    p1API.saveFiles(vm, vm.files, vm.vendor_name, vm.id, vm.current_user, vm.files_saved);
                    $window.open('/user', '_self');
                }
            }
        };
        
        vm.tagTransform = function (newTag) {
            var item = {
                email: newTag
            };
            return item;
        };

        vm.enable = function() {
            vm.disabled = false;
        };

        vm.disable = function() {
            vm.disabled = true;
        };

        vm.updateAndSendEvalToDb = function() {
            //TODO: validate form fields and file upload are correct.
            p1API.updateEval(vm);
        };

        //get files for vendor function
        vm.getFile = function (file_id) {
            var query_params = '?file_id=' + file_id;
            p1API.getFile(query_params);
        }
    };

    function isAdmin(authentication) {
        return !authentication.isAdmin();
    }
    
    module.component("userEvaluationEdit", {
        templateUrl: "/app/components/evaluation/evaluation.component.html",
        controllerAs: "vm",
        controller: ["p1API", "Upload", "authentication", "socket", "Eval", "helper", "ngToast", '$window', '$interval', '$timeout', controller],
        bindings: {
            "$router": "<"
        },
        $canActivate: ["authentication", isAdmin]
    });
}());
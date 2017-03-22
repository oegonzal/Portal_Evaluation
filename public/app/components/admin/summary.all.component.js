(function() {
    "use strict";
    
    var module = angular.module("p1");
    
    function controller(p1API, $window, ngToast) {
        var vm = this;
        vm.management_emails = [];
        vm.available_management_emails = [];

        $(document).on('focus', '#email_form', function(){
            console.log("ID is: " + $(this).attr('id'));
            
            $('label[for=' + $(this).attr('id')+']').addClass('email_label_active').addClass('email_label_active_color');
            $(this).addClass('focused_input');
        });

        $(document).on('blur', '#email_form',function(){
            $(this).removeClass('focused_input');

            if(vm.management_emails.length > 0){
                console.log("There is emails, now change color of label");
                $('label[for='+$(this).attr('id')+']').removeClass('email_label_active_color').css({"color": "rgba(0,0,0,0.54)"});
            }
            else{
                $('label[for='+$(this).attr('id')+']').removeClass('email_label_active').removeClass('email_label_active_color').css({"color": "rgba(0,0,0,0.26)"});
            }
        });

        vm.$routerOnActivate = function(next, previous) {
            vm.id = next.params.id;
            vm.isFullReport = true;
            vm.isSingleReport = false;
            vm.bundle = [];
            p1API.bundle.get({id:vm.id})
                                .$promise
                                .then( function(bundle) {
                                    vm.vendor_name_in_bundle = bundle.vendor_name;
                                    vm.bundle = getEvalsFromBundleIntoArray(bundle);
                                    //console.log(JSON.stringify(bundle));
                                });
        };

        function formater(array){
            var newArray = [];
            for(var i = 0; i < array.length; i++){
                newArray.push(array[i][0]);
            }
            return newArray;
        }

        vm.sendUserAMessage = function(){
            vm.$router.navigate(["Message", {id: vm.id}]);
        };

        function getEvalsFromBundleIntoArray(bundle){
            var length = bundle.evaluations.length;
            var evals = [];
            vm.all_files = [];
            for(var i = 0; i < length; i++){
                var evaluation = bundle.evaluations[i].eval_doc;
                evaluation.strengths  = formater(evaluation.strengths);
                evaluation.weaknesses = formater(evaluation.weaknesses);
                evals.push(evaluation);
                if(evaluation.file_list.length > 0)
                {
                    vm.all_files.push(evaluation.file_list); 
                }
            }
            return evals;
        }
        
        vm.generateBundlePackageInBackend = function() {
            var html = angular.element(document.querySelector('#html_to_pdf')).html();
            var data = {html: html, vendor_name: vm.vendor_name_in_bundle, management_emails: vm.management_emails, files: vm.all_files}
            p1API.sendDataToGenerateBundle(data);
            ngToast.dismiss();
            ngToast.create({
              className: 'success',
              content: 'Email has been sent.',
              dismissOnTimeout: true,
              dismissOnClick: true
            });
        }

        //for email input to work
        vm.tagTransform = function (newTag) {
            var item = {
                email: newTag
            };
            return item;
        };
        
        //get files for vendor function
        vm.getFiles = function (file_list) {
            var query_params = '?file_id=' + file_list[0].file_id;
            p1API.getFile(query_params);
        }
    };

    function isAdmin(authentication) {
        return authentication.isAdmin();
    }
    
    module.component("summaryAllPage", {
        templateUrl: "/app/components/admin/summary.component.html",
        controllerAs: "vm",
        controller: ["p1API", "$window", "ngToast", controller],
        bindings: {
            "$router": "<"
        },
        $canActivate: ["authentication", isAdmin]
    })
}());
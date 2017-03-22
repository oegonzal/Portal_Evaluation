(function() {
    "use strict";
    
    var module = angular.module("p1");
    
    function controller(p1API, $window) {
        var vm = this;

        vm.$routerOnActivate = function(next, previous) {
            vm.id = next.params.id;
            vm.isFullReport = false;
            vm.isSingleReport = true;
            vm.bundle = [];
            p1API.evaluation.get({id:vm.id})
                                .$promise
                                .then( function(evaluation) {
                                    evaluation.strengths  = formater(evaluation.strengths);
                                    evaluation.weaknesses = formater(evaluation.weaknesses);
                                    vm.evaluation = evaluation;  
                                    vm.bundle.push(evaluation);
                                });
        };

        vm.generateBundlePackageInBackend = function() {
            var html = angular.element(document.querySelector('#html_to_pdf')).html();
            var file_list = [];
            var data = {html: html, files: file_list}
            p1API.sendDataToGenerateBundle(data);
        }

        vm.sendUserAMessage = function(){
            vm.$router.navigate(["Message", {id: vm.id}]);
        };
        
        function formater(array){
            var newArray = [];
            for(var i = 0; i < array.length; i++){
                newArray.push(array[i][0]);
            }
            return newArray;
        }

        //get files for vendor function
        vm.getFiles = function (file_list) {
            var query_params = '?file_id=' + file_list[0].file_id;
            p1API.getFile(query_params);
        }
    };

    function isAdmin(authentication) {
        return authentication.isAdmin();
    }
    
    module.component("summaryPage", {
        templateUrl: "/app/components/admin/summary.component.html",
        controllerAs: "vm",
        controller: ["p1API", "$window", controller],
        bindings: {
            "$router": "<"
        },
        $canActivate: ["authentication", isAdmin]
    })
}());
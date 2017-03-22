(function() {
    "use strict";
    
    var module = angular.module("p1");
    
    function controller(p1API, $window) {
        var vm = this;
        
        vm.bundles          = [];
        vm.card_row_stack   = 3;

        vm.test_pic         = 'assets/img/cards/150618_02_0100_72dpi.jpg';
        vm.picture_paths    = [
                                'assets/img/cards/150618_02_0100_72dpi.jpg',
                                'assets/img/cards/150618_04_0009_72dpi.jpg',
                                'assets/img/cards/152109_CK_Visa_13_069_72dpi.jpg',
                                'assets/img/cards/4A3X3115_HR_72dpi.jpg',
                                'assets/img/cards/4A3X5778_HR_72dpi.jpg',
                                'assets/img/cards/72_0208_OVERHEAD_DEV_2484-V02.jpg',
                                'assets/img/cards/Credit_VendCU_72dpi.jpg',
                                'assets/img/cards/Gas_Samsung_72dpi.jpg'

                              ];

        vm.$routerOnActivate = function(next, previous) {

            //get bundles
            p1API.getBundles(vm)
                .then( function(response) {
                    vm.bundles = response.data;

                    //Format bundles into groups of vm.card_row_stack for Material Design Layout
                    vm.bundle_groups = [];
                    var index = 0;
                    for(var i = 0; i < vm.bundles.length; i++) {
                        if( (i != 0) && (i % vm.card_row_stack == 0) ) index++;
                        if(i % vm.card_row_stack == 0) vm.bundle_groups.push([]);
                        vm.bundles[i].img_id = i % vm.picture_paths.length;
                        vm.bundle_groups[index].push(vm.bundles[i]); 
                    }
                });
        };
        
        vm.sendEvaluations = function (id) {
            vm.$router.navigate(["EmailListEdit", {id: id}]);  
        };

        vm.sendMessage = function (id) {
            vm.$router.navigate(["Message", {id: id}]);
        };

        vm.goToBundle = function (id) {
            vm.$router.navigate(["Bundle", {id: id}]);  
        };

        vm.goToConfig = function (id) {
            console.log("Going to config");
            vm.$router.navigate(["Config", {id: id}]);  
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
    
    module.component("vendorPage", {
        templateUrl: "/app/components/admin/dashboard.component.html",
        controllerAs: "vm",
        controller: ["p1API", "$window", controller],
        bindings: {
            "$router": "<"
        },
        $canActivate: ["authentication", isAdmin]
    })
}());
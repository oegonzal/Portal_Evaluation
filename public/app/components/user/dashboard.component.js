(function () {
	"use strict";

	var module = angular.module("p1");

	function controller(p1API, authentication, Eval, helper) {
		var vm = this;

		vm.evaluations = [];
        vm.card_row_stack = 3;

        vm.picture_paths = [
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
			p1API.getUserProfile().then( function(response) {
                console.log("----userData: here: " + JSON.stringify(response));
				vm.evaluations = response.data.evaluations;
				

				//Format evals into groups of vm.card_row_stack for Material Design Layout
                vm.eval_groups = [];
                var index = 0;
                for(var i = 0; i < vm.evaluations.length; i++) {
                    if( (i != 0) && (i % vm.card_row_stack == 0) ) index++;
                    if(i % vm.card_row_stack == 0) vm.eval_groups.push([]);
                    vm.evaluations[i].img_id = i % vm.picture_paths.length;
                    vm.eval_groups[index].push(vm.evaluations[i]); 
                }
			});
		}

		vm.editEvaluation = function(id) {
			vm.$router.navigate(["UserEvaluationEdit", {id: id}]);
		};
	};

	function isAdmin(authentication) {
		return !authentication.isAdmin();
	}

	module.component("userPage", {
		templateUrl: "/app/components/user/dashboard.component.html",
        controllerAs: "vm",
        controller: ["p1API", "authentication", "Eval", "helper", controller],
        bindings: {
            "$router": "<"
        },
        $canActivate: ["authentication", isAdmin]
	});
})();
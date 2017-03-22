(function () {
	"use strict";

	var module = angular.module("p1");

	function isAdmin(authentication) {
		return authentication.isAdmin();
	}

	module.component("configPage", {
		templateUrl: "/app/components/config/config.component.html",
        controllerAs: "vm",
        controller: ["p1API", "authentication", "Eval", controller],
        bindings: {
            "$router": "<"
        },
        $canActivate: ["authentication", isAdmin]
	});

	function controller(p1API, authentication, Eval) {
		var vm = this;

		vm.$routerOnActivate = function(next, previous) {
			vm.id = next.params.id;

			vm.data = {
			    cb1: false,
			    cb2: false
			};
		}

		vm.archiveBundle = function() {
			var response = confirm("Are you sure you want to archive this Bundle?");

			if(response){
				vm.archived = true;
				p1API.updateBundle(vm);
			}
		};
	};
}());
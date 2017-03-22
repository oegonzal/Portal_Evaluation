(function () {
	"use strict";

	var module = angular.module("p1");

	function controller(p1API, authentication, Eval, helper,$window) {
		var vm = this;

		vm.$routerOnActivate = function(next, previous) {
            vm.id = next.params.id;

            //get evals and files of this bundle
            p1API.bundle.get({id: vm.id})
                .$promise
                .then(function(bundle) {
                    vm.bundle = bundle;
                });

			vm.imagePathForDownload = 'assets/img/download.blue.jpg';
            vm.imagePathForEval = 'assets/img/ic_format_align_justify_black_24px.svg';
		};

        vm.goToConfig = function() {
            console.log("Go to Config");
            vm.$router.navigate(["Config", {id: vm.id}]);
        };

        //get files for vendor function
        vm.getFile = function (file_id) {
            var query_params = '?file_id=' + file_id;
            p1API.getFile(query_params);
        }

        vm.goToEvaluation = function (id) {
            vm.$router.navigate(["Summary", {id: id}]);  
        };

        vm.bundlePackages = function () {
            vm.$router.navigate(["SummaryAll", {id: vm.id}]);  
        };

        vm.tagTransform = function (newTag) {
            var item = {
                email: newTag
            };
            return item;
        };
	};

	function isAdmin(authentication) {
		return authentication.isAdmin();
	}

	module.component("bundlePage", {
		templateUrl: "/app/components/bundle/bundle.component.html",
        controllerAs: "vm",
        controller: ["p1API", "authentication", "Eval", "helper", "$window", controller],
        bindings: {
            "$router": "<"
        },
        $canActivate: ["authentication", isAdmin]
	});
})();
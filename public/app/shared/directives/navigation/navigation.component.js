(function () {
  "use strict";

  var module = angular.module("p1");

  module.component('navigation', {
    templateUrl: "/app/shared/directives/navigation/navigation.template.html",
        controllerAs: "vm",
        controller: ["authentication", "$window", controller],
        bindings: {
            "$router": "<"
        }
  });

  function controller(authentication, $window) {
    var vm = this;

    vm.isLoggedIn   = authentication.isLoggedIn();
    vm.currentUser  = authentication.currentUser();
    vm.isAdmin      = authentication.isAdmin();

    if(!vm.isAdmin) {
      var archive = angular.element(document.querySelector('#archive_nav'));
      archive.addClass('no_display');

      var create = angular.element(document.querySelector('#create_nav'));
      create.addClass('no_display');
    }
    
    vm.logout = function () {
      authentication.logout();
      $window.open('/login', '_self');
    };

    vm.goToEvalPage = function () {
      if(vm.isAdmin){
        $window.open('/vendor', '_self');
      }
      else{
        $window.open('/user', '_self')
      }
    };
  };

}());
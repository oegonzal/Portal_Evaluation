(function () {

    angular
    .module('p1')
    .component('registerPage', {
        templateUrl: "/app/components/auth/register/register.component.html",
        controllerAs: "vm",
        controller: ["$location", "authentication", registerCtrl],
        bindings: {
                "$router": "<"
            }
        });

  function registerCtrl($location, authentication) {
    var vm = this;

    vm.credentials = {
      username: "",
      email : "",
      password : ""
    };

    vm.onSubmit = function () {
      console.log('Submitting registration');
      authentication
        .register(vm.credentials)
        .error(function(err){
          alert(err);
        })
        .then(function(){
          $location.path('profile');
        });
    };

  }

}());
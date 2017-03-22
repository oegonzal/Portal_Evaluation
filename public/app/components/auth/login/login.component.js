(function () {

  angular
  .module('p1')
  .component('loginPage', {
      templateUrl: "/app/components/auth/login/login.component.html",
      controllerAs: "vm",
      controller: ["authentication", loginCtrl],
      bindings: {
            "$router": "<"
      }
  });

  function loginCtrl(authentication) {
    var vm = this;
    console.log("Login Page");

    vm.credentials = {
      username : "",
      password : ""
    };

    vm.$routerOnActivate = function(next, previous) {
      if(authentication.isLoggedIn()) {
          if(authentication.isAdmin()) {
            vm.$router.navigate(['Vendor']);
          }
          else {
            vm.$router.navigate(['User']);
          }
      }
    };

    vm.onSubmit = function () {
      console.log("Login pressed.");
      authentication
        .login(vm.credentials)
        .error(function(err){
          console.log("There was an error logging in: " + JSON.stringify(err));
        })
        .then(function(){
          //if valid user go to vendor page
            if(authentication.isAdmin()) {
              vm.$router.navigate(['Vendor']);
            }
            else {
              vm.$router.navigate(['User']);
            }
            
          //else, show unauthorized page
        });
    };

  };

}());
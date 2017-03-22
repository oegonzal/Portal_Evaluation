(function () {

  angular
    .module('p1')
    .service('authentication', authentication);

  authentication.$inject = ['$http', '$window', 'socket'];
  function authentication ($http, $window, socket) {
      
    var saveToken = function (token) {
      $window.localStorage['mean-token'] = token;
    };

    var getToken = function () {
      return $window.localStorage['mean-token'];
    };

    //Checks for token to see if logged in
    var isLoggedIn = function() {
      var token = getToken();
      var payload;

      if(token){
        payload = token.split('.')[1];
        payload = $window.atob(payload); //decode
        payload = JSON.parse(payload);

        return payload.exp > Date.now() / 1000;
      } else {
        return false;
      }
    };

    var isAdmin = function() {
      if(isLoggedIn()){
        var token = getToken();
        var payload = token.split('.')[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);
        return (payload.permission === 'admin');
      }
    }

    //Returns current information
    var currentUser = function() {
      if(isLoggedIn()){
        var token = getToken();
        var payload = token.split('.')[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);

        return {
          id :  payload._id,
          email : payload.email,
          username : payload.username
        };
      }
    };

    //Sends request to register user
    register = function(user) {
      return $http.post('/register', user).success(function(data){
        saveToken(data.token);
      });
    };

    //Sends request to login user
    login = function(user) {
      return $http.post('/login', user).success(function(data) {
        saveToken(data.token);
      });
    };

    //deletes user's session
    logout = function() {
      (function () {
        socket.emit('user_logout', { user: currentUser().id });
      }());
      
      $window.localStorage.removeItem('mean-token');
    };

    return {
      currentUser : currentUser,
      saveToken : saveToken,
      getToken : getToken,
      isLoggedIn : isLoggedIn,
      register : register,
      login : login,
      logout : logout,
      isAdmin: isAdmin
    };
  }


})();
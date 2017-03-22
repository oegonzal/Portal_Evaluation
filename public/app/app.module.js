(function() {
    "use strict";
    
    var module = 
         angular.module("p1", ["ngComponentRouter", "ngResource", "ngFileUpload", "ui.select", "ngMaterial", "ngAnimate", "ngSanitize", "ngToast", "ui.bootstrap", "ui.grid", 'md.data.table'])
                .config(["$locationProvider", "$resourceProvider", config])
                .run(['socket', 'Eval', run])
                .value("$routerRootComponent", "originPage");

    function config($locationProvider, $resourceProvider){
        $locationProvider.html5Mode(true);
        $resourceProvider.defaults.stripTrailingSlashes = false;
    };

	function run(socket, Eval) {
        /* */ //No longer needed
        socket.on('locked_evals_update', function (data) {
            console.log(data);
            Eval.locked_evals = data.locked_evals;
        });
        
	};
    
}());
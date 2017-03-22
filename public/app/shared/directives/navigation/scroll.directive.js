(function (angular) {
    'use strict';
    
    //This directive is placed in <ul> tag that forms side-bar
    angular
    .module('p1')
    .directive('ngScrollRowTwo', ['$timeout', function ($timeout) {
        var directive = {
            restrict: 'A',
            link: function(scope, el, atts) {
                console.log("Row two element: " + JSON.stringify(el));
                $timeout(function() {
                    angular.element(el).sticky( {topSpacing:0} );
                }, 0);
            }
        };
        
        return directive;
    }]);
}(angular));
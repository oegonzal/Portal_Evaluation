(function() {
    "use strict";
    
    var module = angular.module("p1");

    module.component("archivePage", {
        templateUrl: "/app/components/admin/archive.component.html",
        controllerAs: "vm",
        controller: ["p1API", "$window", "ngToast","uiGridConstants", "$scope", controller],
        bindings: {
            "$router": "<"
        },
        $canActivate: ["authentication", isAdmin]
    });
    
    function controller(p1API, $window, ngToast, uiGridConstants, $scope) {
        var vm = this,
            bookmark;
        
        vm.viewBundle = function(){
            if($scope.selected.length > 0){
                vm.$router.navigate(["Bundle", {id: $scope.selected[0]._id}]);
                //console.log(JSON.stringify($scope.selected));
            }
        };

        $scope.selected = [];
          
        $scope.filter = {
            options: {
              debounce: 500
            }
        };

        $scope.query = {
            filter: '',
            limit: '5',
            order: 'nameToLower',
            page: 1,
            count: 100,
            listings_per_page_options: [10, 25, 50, 100]
        };
          
        $scope.removeFilter = function () {
            $scope.filter.show = false;
            $scope.query.filter = '';
            
            if($scope.filter.form.$dirty) {
              $scope.filter.form.$setPristine();
            }
        };

        vm.type = 'archived';
        p1API.getBundles(vm).then(function(response){
            //vm.gridOptions.data = response.data;
            $scope.desserts = response.data;
        });
          
        $scope.$watch('query.filter', function (newValue, oldValue) {
            if(!oldValue) {
              bookmark = $scope.query.page;
            }
            
            if(newValue !== oldValue) {
              $scope.query.page = 1;
            }
            
            if(!newValue) {
              $scope.query.page = bookmark;
            }
            
            //$scope.getDesserts();
        });

        
        /*
        vm.selected = [];
        
        vm.query = {
            order: 'name',
            limit: 5,
            page: 1
        };

        vm.response = {"count":2724,"data":[{"_id":"57581b95dd0b1b03004c658e","name":"testing","nameToLower":" ","__v":0,"iron":{"value":1,"unit":"%"},"calcium":{"value":0,"unit":"%"},"sodium":{"value":1,"unit":"mg"},"protein":{"value":1,"unit":"g"},"carbs":{"value":1,"unit":"g"},"fat":{"value":1,"unit":"g"},"calories":{"value":1,"unit":"Cal"},"serving":"100g"},{"_id":"5790f7408292da030095ccbd","name":" testing 2","nameToLower":"  ","__v":0,"iron":{"value":5,"unit":"%"},"calcium":{"value":5,"unit":"%"},"sodium":{"value":5,"unit":"mg"},"protein":{"value":5,"unit":"g"},"carbs":{"value":5,"unit":"g"},"fat":{"value":5,"unit":"g"},"calories":{"value":5,"unit":"Cal"},"serving":"100g"},{"_id":"57711529ceee76030039ac3a","name":"                 a","nameToLower":"                 a","__v":0,"iron":{"value":12,"unit":"%"},"calcium":{"value":12,"unit":"%"},"sodium":{"value":12,"unit":"mg"},"protein":{"value":1,"unit":"g"},"carbs":{"value":11,"unit":"g"},"fat":{"value":1,"unit":"g"},"calories":{"value":17,"unit":"Cal"},"serving":"100g"},{"_id":"57be9d2418ae760300600729","name":"              Better","nameToLower":"              better","__v":0,"iron":{"value":8,"unit":"%"},"calcium":{"value":7,"unit":"%"},"sodium":{"value":6,"unit":"mg"},"protein":{"value":5,"unit":"g"},"carbs":{"value":4,"unit":"g"},"fat":{"value":3,"unit":"g"},"calories":{"value":2,"unit":"Cal"},"serving":"100g"},{"_id":"57b32d81a2d1c60300866ffe","name":"          Poop","nameToLower":"          poop","__v":0,"iron":{"value":99,"unit":"%"},"calcium":{"value":99,"unit":"%"},"sodium":{"value":9001,"unit":"mg"},"protein":{"value":99,"unit":"g"},"carbs":{"value":99,"unit":"g"},"fat":{"value":99,"unit":"g"},"calories":{"value":99,"unit":"Cal"},"serving":"100g"}]};

        vm.gridOptions = {
            enableSorting: true,
            enableFiltering: true,
            enableColumnMenus: false,
            columnDefs: [
              { 
                field: 'vendor_name',
                cellTemplate: '<a style="margin-left: 5px; color: #337ab7;" href="/bundle/{{row.entity._id}}"> {{row.entity.vendor_name}} </a>' 
              },
              {
                field: 'Delete',
                enableFiltering: false,
                cellTemplate: '<button>Delete</button>'
              }
            ],
            data: []//[{Bundle: 'Chase', Bundle_id: "57abb9e40d3c346242f65f44"}, {Bundle: 'Wells Fargo', Bundle_id: "57abb9e40d3c346242f65f44"}, {Bundle: 'Testing3', Bundle_id: "57abb9e40d3c346242f65f44"}, {Bundle: 'Testing4', Bundle_id: "57abb9e40d3c346242f65f44"}]
            , enableHorizontalScrollbar : uiGridConstants.scrollbars.NEVER
        };

        vm.type = 'archived';
        p1API.getBundles(vm).then(function(response){
            vm.gridOptions.data = response.data;
        });
        */
        
    };

    function isAdmin(authentication) {
        return authentication.isAdmin();
    };

}());
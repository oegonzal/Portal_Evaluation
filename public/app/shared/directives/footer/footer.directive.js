(function () {

  angular
    .module('p1')
    .directive('visaFooter', navigation);

  function navigation () {
    return {
      restrict: 'EA',
      templateUrl: '/app/shared/directives/footer/footer.template.html'
    };
  }

})();
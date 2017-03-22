(function() {
	'use strict';

	angular.module('p1')
		.factory('Eval', [Eval]);

	function Eval() {

		var Eval = {
      		currentPageIndex: 	     1,
              	NUM_OF_PAGES: 		     8,
                  locked_evals:               [],

                  //functions
                  isEvalLocked:               isEvalLocked
		};

            function isEvalLocked(evalId) {
                  //console.log(JSON.stringify(Eval));

                  for(var i = 0; i < Eval.locked_evals.length; i++){
                        if( Eval.locked_evals[i].eval == evalId ){
                              return {
                                    result: true,
                                    user: Eval.locked_evals[i].user
                              }
                        }
                  };

                  //not locked
                  return {
                        result: false,
                        user: ""
                  };
            };

		return Eval;
	}
})();
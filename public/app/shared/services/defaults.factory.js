(function() {
	'use strict';

	angular.module('p1')
		.factory('Default', ['Eval', Default]);

	function Default(Eval) {

		var Default = {
      		setDefaults: setDefaults
		};

            function setDefaults() {
                  console.log("Defaults called");
                  Eval.currentPageIndex=            1,
                  Eval.NUM_OF_PAGES=                8,
                  Eval.user=                       '',
                  Eval.name=                       '',
                  Eval.phone=                      '',
                  Eval.company=                    '',
                  Eval.position=                   '',
                  Eval.history=                    [],
                  Eval.email_list=                 [],
                  Eval.file_list=                  [],
                  Eval.vendor_name=                '',
                  Eval.sub_direction=              '',
                  Eval.manager=                    '',
                  Eval.nominating_manager=         '',
                  Eval.vendor_title=               '',
                  Eval.vendor_age=                 '',
                  Eval.years_in_market=            '',
                  Eval.years_in_industry=          '',
                  Eval.features=                   '',
                  Eval.team_size=                  '',
                  Eval.total_competitors=          '',
                  Eval.location=                   '',
                  Eval.history_list=               [],
                  Eval.last_4_year_rating=         '',
                  Eval.last_3_year_rating=         '',
                  Eval.last_2_year_rating=         '',
                  Eval.last_1_year_rating=         '',
                  Eval.current_scope_of_works=     '',
                  Eval.proposed_work_mapping=      '',
                  Eval.key_factors=                '',
                  Eval.best_clients=               '',
                  Eval.differentiating_factors=    '',
                  Eval.endorsers_comments=         '',
                  Eval.strengths=                  [],
                  Eval.weaknesses=                 [],
                  Eval.endorsers_detail_list=      [],
                  Eval.locked_evals=               []
            }

		return Default;
	}
})();
(function () {
	'use strict';
	angular.module('p1')
		.factory('helper', ['Eval', HelperService]);

	function HelperService (Eval) {
		var helper = {};

		//make a common evaluation page
		helper.addItem = function (list) {
            var obj = {}
            list.push(obj);
        };

        helper.removeItem = function (index, list) {
            list.splice(index, 1);
        };

        helper.updatePageToNext = function (currentPage, maxPage) {
            currentPage = (currentPage + 1 <= maxPage ) ? currentPage + 1 : maxPage;
        };
        
        helper.updatePageToPrevious = function (currentPage) {
            currentPage= (currentPage - 1 > 0) ? currentPage - 1 : 1; 
        };
        
        helper.showPage = function(currentPage, pageIndex) {
            return (currentPage == pageIndex)
        };

        helper.saveEvalInStructure = function(evaluation, vm) {
            Eval.vendor_name                = evaluation.vendor_name;
            Eval.name                       = evaluation.name;
            Eval.phone                      = evaluation.phone;
            Eval.company                    = evaluation.company;
            Eval.position                   = evaluation.position;
            Eval.vendor_name                = evaluation.vendor_name;
            Eval.sub_direction              = evaluation.sub_direction;
            Eval.manager                    = evaluation.manager;
            Eval.nominating_manager         = evaluation.nominating_manager;
            Eval.vendor_title               = evaluation.vendor_title;
            Eval.vendor_age                 = evaluation.vendor_age;
            Eval.years_in_market            = evaluation.years_in_market;
            Eval.years_in_industry          = evaluation.years_in_industry;
            Eval.features                   = evaluation.features;
            Eval.team_size                  = evaluation.team_size;
            Eval.total_competitors          = evaluation.total_competitors;
            Eval.location                   = evaluation.location;
            Eval.history_list               = evaluation.history_list;
            Eval.last_4_year_rating         = evaluation.last_4_year_rating;
            Eval.last_3_year_rating         = evaluation.last_3_year_rating;
            Eval.last_2_year_rating         = evaluation.last_2_year_rating;
            Eval.last_1_year_rating         = evaluation.last_1_year_rating;
            Eval.current_scope_of_works     = evaluation.current_scope_of_works;
            Eval.proposed_work_mapping      = evaluation.proposed_work_mapping;
            Eval.key_factors                = evaluation.key_factors;
            Eval.best_clients               = evaluation.best_clients;
            Eval.differentiating_factors    = evaluation.differentiating_factors;
            Eval.endorsers_comments         = evaluation.endorsers_comments;
            Eval.endorsers_detail_list      = evaluation.endorsers_detail_list;
            Eval.file_list                  = evaluation.file_list;

            if(typeof evaluation.strengths_weaknesses[0] != "undefined"){
                Eval.strengths              = evaluation.strengths_weaknesses[0].strengths;
                Eval.weaknesses             = evaluation.strengths_weaknesses[0].weaknesses;
            }

            vm.vendor_name                = evaluation.vendor_name;

            if(typeof evaluation.email_list[0] != "undefined") {
                Eval.email_list           = [{
                                                 "evaluator":    evaluation.evaluator_emails,
                                                 "finance":      evaluation.finance_emails
                                            }];
                vm.evaluator_emails             = evaluation.email_list[0].evaluator;
                vm.finance_emails               = evaluation.email_list[0].finance;
            }
        };

		return helper;
	};
})();
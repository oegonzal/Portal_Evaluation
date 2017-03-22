(function() {
	'use strict';

	var module = angular.module('p1');

	function controller(p1API, authentication, Eval, $window){
		var vm = this;
        vm.evaluator_emails = [];

        $(document).on('focus', '#email_form', function(){
            $('label[for=' + $(this).attr('id')+']').addClass('email_label_active').addClass('email_label_active_color');
            $(this).addClass('focused_input');
        });

        $(document).on('blur', '#email_form',function(){
            $(this).removeClass('focused_input');

            if(vm.evaluator_emails.length > 0){
                console.log("There is emails, now change color of label");
                $('label[for='+$(this).attr('id')+']').removeClass('email_label_active_color').css({"color": "rgba(0,0,0,0.54)"});
            }
            else{
                $('label[for='+$(this).attr('id')+']').removeClass('email_label_active').removeClass('email_label_active_color').css({"color": "rgba(0,0,0,0.26)"});
            }
        });
        

        vm.goToEvaluation = function () {
            vm.$router.navigate(["Vendor"]);  
        };

        vm.sendEvaluations = function() {
            vm.email_list     =   [{
                                        "evaluator":    vm.evaluator_emails,
                                        "finance":      vm.finance_emails
                                    }];
            vm.user = authentication.currentUser().email;
            console.log("evaluation_type: " + vm.evaluation_type);
            p1API.createBundle(vm);
            $window.open('/vendor', '_self');
        };
        
        vm.tagTransform = function (newTag) {
            var item = {
                email: newTag
            };
            return item;
        };
	};

	function isAdmin(authentication) {
        return authentication.isAdmin();
    }

	module.component("emailListCreate", {
        templateUrl: "/app/components/evaluation/create.evaluations.component.html",
        controllerAs: "vm",
        controller: ["p1API", "authentication", "Eval", '$window', controller],
        bindings: {
            "$router": "<"
        },
        $canActivate: ["authentication", isAdmin]
    });
}());
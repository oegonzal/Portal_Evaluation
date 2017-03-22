(function() {
    "use strict";
    
    var module = angular.module("p1");
    
    function controller(p1API, $window, ngToast) {
        var vm = this;
        vm.evaluator_emails = [];//[{email: 'oscgonza@visa.com'}, {email: 'mark@visa.com'}];
        vm.available_evaluator_emails = [{email: 'Everyone'}]; //[{email: 'Everyone'}, {email: 'oscgonza@visa.com'}, {email: 'mark@visa.com'}, {email: 'jason@visa.com'}];

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

        vm.$routerOnActivate = function(next, previous) {
            vm.id = next.params.id;
            //get evals and files of this bundle
            p1API.bundle.get({id: vm.id})
                .$promise
                .then(function(bundle) {
                    angular.forEach(bundle.users, function(value, key) {
                        vm.available_evaluator_emails.push({email: value});
                    });
                });
        };

        vm.tagTransform = function (newTag) {
            var item = {
                email: newTag
            };
            return item;
        };

        vm.sendMessage = function(){
            ngToast.dismiss();
            ngToast.create({
              className: 'success',
              content: 'Email has been sent.',
              dismissOnTimeout: true,
              dismissOnClick: true
            });
            var data = {bundle_id: vm.id, email_body: vm.email_body, email_subject: vm.email_subject}
            p1API.sendMessage(data);
        };
    };

    function isAdmin(authentication) {
        return authentication.isAdmin();
    };
    
    module.component("messagePage", {
        templateUrl: "/app/components/admin/send.email.component.html",
        controllerAs: "vm",
        controller: ["p1API", "$window", "ngToast", controller],
        bindings: {
            "$router": "<"
        },
        $canActivate: ["authentication", isAdmin]
    })
}());
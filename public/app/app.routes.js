(function() {
    "use strict";
    
    var module = angular.module("p1");
    
    module.component("originPage", {
        template:   '<ng-outlet></ng-outlet>',
        $routeConfig: [
            //Unused
            //{ path: "/register",        component: "registerPage",  name: "Register"                          },
            //{ path: "/emails/:id",      component: "emailList",name: "EmailListEdit"                          },
            //{ path: "/evaluation/create",  component: "evaluationCreate",name: "EvaluationCreate"             },
            //{ path: "/evaluation/edit/:id", component: "evaluationEdit",name: "EvaluationEdit"                },
            
            //user
            { path: "/login",           component: "loginPage",     name: "Login"                               },
            { path: "/user",            component: "userPage",      name: "User"                                },
            { path: "/evaluation/:id", component: "userEvaluationEdit",name: "UserEvaluationEdit"               },

            //admin
            { path: "/vendor",          component: "vendorPage",    name: "Vendor"                              },
            { path: "/emails",          component: "emailListCreate",name: "EmailListCreate"                    },
            { path: "/message/:id",          component: "messagePage",name: "Message"                           },      
            { path: "/bundle/:id",        component: "bundlePage",  name: "Bundle"                              },
            { path: "/evaluation-report/:id",        component: "summaryPage",  name: "Summary"                 },
            { path: "/full-report/:id",        component: "summaryAllPage",  name: "SummaryAll"                 },
            { path: "/config/:id",        component: "configPage",  name: "Config"                              },
            { path: "/archive",        component: "archivePage",  name: "Archive"                              },

            //all
            { path: "/**",                                                               redirectTo: ["Login"]  }
        ]
    });
}());
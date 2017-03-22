(function() {
   "use strict";
    
    var module = angular.module("p1");
    
    module.factory('p1API', ['$resource','$http', 'Upload', 'authentication', '$timeout', function ($resource, $http, Upload, authentication, $timeout) {

            var authorization = 'Bearer ' + authentication.getToken();

            var API = {
                evaluation:     getBasicResource('/evaluations/:id'),
                createEval:     createAndSendEvalToDb,
                getUserProfile: getUserProfile,
                getFile:        getFile,
                updateEval:     updateEvalInDb,
                createBundle:  createBundle,
                bundle:     getBasicResource('/eval-bundle/:id'),
                sendDataToGenerateBundle: sendDataToGenerateBundle,
                sendMessage:    sendMessage,
                saveFiles:      saveFiles,
                updateBundle:   updateBundle,
                getBundles:     getBundles
            };

            function sendMessage(data) {
                return $http(
                    {
                        method: 'POST', 
                        url: '/message',
                        data: data
                    });
            };

            function sendDataToGenerateBundle(data) {
                return $http(
                    {
                        method: 'POST', 
                        url: '/generate-bundle', 
                        headers: {
                          'Authorization': 'Bearer ' + authentication.getToken()
                        },
                        data: data
                    });
            };

            function updateBundle(vm){
                Upload.upload({
                    url:    '/eval-bundle/' + vm.id,
                    headers:{
                                'Authorization': 'Bearer ' + authentication.getToken()
                            },
                    data:   { archived: vm.archived },
                    method: 'PUT'
                });
            };

            function getBundles(vm){
                return $http(
                    {
                        url:    '/eval-bundle?type=' + vm.type,
                        headers:{
                                    'Authorization': 'Bearer ' + authentication.getToken()
                                },
                        method: 'GET'
                    });
            };

            function createBundle(vm) {
                return $http(
                    {
                        method: 'POST', 
                        url: '/eval-bundle', 
                        headers: {
                          'Authorization': 'Bearer ' + authentication.getToken()
                        },
                        data: {
                            vendor_name:    vm.vendor_name,
                            email_list:     [{
                                                "evaluator":    vm.evaluator_emails,
                                                "finance":      []//vm.finance_emails
                                            }],
                            finance_emails: vm.finance_emails,
                            evaluator_emails: vm.evaluator_emails,
                            email_subject:  vm.email_subject,
                            email_body:     vm.email_body,
                            creator:        vm.user,
                            evaluation_type:            vm.evaluation_type
                        }
                    });
            };
            
            function getBasicResource(path) {
                return $resource(path, { id: '@id'}, {
                            query   : { method: "GET",
                                        isArray: true,
                                        headers: { Authorization: authorization } 
                                      },
                            get     : { method: "GET",
                                        headers: { Authorization: authorization } 
                                      },
                            create  : { method: "POST",
                                        headers: { Authorization: authorization }
                                      },
                            save    : { method: "POST",
                                        headers: { Authorization: authorization }
                                      },
                            delete  : { method: "DELETE",
                                        headers: { Authorization: authorization }
                                      },
                            remove  : { method: "DELETE",
                                        headers: { Authorization: authorization }
                                      },
                            update  : { method: "PUT",
                                        headers: { Authorization: authorization } 
                                      }
                });
            };

            function updateEvalInDb(vm, cb) {
                var evalId = "/" + vm.id;
                uploadToDb(vm, cb, 'PUT', evalId);
            };

            function createAndSendEvalToDb(vm, cb) {
                uploadToDb(vm, cb, 'POST', '');
            };

            function uploadToDb(vm, cb, requestType, eval_id) {
                Upload.upload({
                    url:    '/evaluations' + eval_id,
                    headers:{
                                'Authorization': 'Bearer ' + authentication.getToken()
                            },
                    data:   {
                                user:                       vm.current_user.email,
                                name:                       vm.name,
                                vendor_name:                vm.vendor_name,
                                //phone:                      vm.phone,
                                //company:                    vm.company,
                                //position:                   vm.position,
                                history:                    [{
                                                                "date": new Date(),
                                                                "user": vm.current_user.email
                                                            }],
                                email_list:                 [{
                                                                "evaluator":    vm.evaluator_emails,
                                                                "finance":      [] //vm.finance_emails
                                                            }],
                                file_list:                  [{
                                                                "uploaded_by": vm.current_user.email
                                                            }],
                                sub_direction:              vm.sub_direction,
                                manager:                    vm.manager,
                                nominating_manager:         vm.nominating_manager,
                                vendor_title:               vm.vendor_title,
                                vendor_age:                 vm.vendor_age,
                                years_in_market:            vm.years_in_market,
                                years_in_industry:          vm.years_in_industry,
                                features:                   vm.features,
                                team_size:                  vm.team_size,
                                total_competitors:          vm.total_competitors,
                                location:                   vm.location,
                                history_list:               vm.history_list,
                                last_4_year_rating:         vm.last_4_year_rating,
                                last_3_year_rating:         vm.last_3_year_rating,
                                last_2_year_rating:         vm.last_2_year_rating,
                                last_1_year_rating:         vm.last_1_year_rating,
                                current_scope_of_works:     vm.current_scope_of_works,
                                proposed_work_mapping:      vm.proposed_work_mapping,
                                key_factors:                vm.key_factors,
                                best_clients:               vm.best_clients,
                                differentiating_factors:    vm.differentiating_factors,
                                endorsers_comments:         vm.endorsers_comments,
                                strengths:                  vm.strengths,
                                weaknesses:                 vm.weaknesses,
                                endorsers_detail_list:      vm.endorsers_detail_list,
                                eval_submitted:             vm.eval_submitted,
                                status:                     vm.status
                            },
                    //file:   vm.files,
                    method: requestType
                }).then(checkUploadDetails, error, progress);
                
                // Helper functions
                function error (resp) {
                    console.log('Error status: ' + resp.status);
                }
                
                function progress (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    if(typeof resp != "undefined" && resp.config.data.file){
                        console.log('progress: ' + progressPercentage + '% ' /*+ evt.config.data.file.name */);
                    }
                }
                
                function checkUploadDetails(resp) {
                    $timeout(function(){
                        vm.disable  = true;
                        vm.eval_saved = true;
                    }, 600);
                    
                    if(resp.config.data.file){
                        console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                    }
                    
                    if(cb) {
                        cb();
                    }
                }
            };

            function getUserProfile() {
                return $http.get('/user-profile', {
                    headers: {
                      Authorization: authorization
                    }
                })
                .success(function(data) {
                    return {data: data};
                })
                .error(function(err) {
                    return {error: err};
                });
            };

            function saveFiles(vm, files, vendor_name, eval_id, current_user, files_saved){
                if(typeof files != "undefined"){
                    for(var i = 0; i < files.length; i++){
                        (function(i){
                            Upload.upload({
                                url:    '/files',
                                headers:{
                                            'Authorization': 'Bearer ' + authentication.getToken()
                                        },
                                file: files[i],
                                data: {vendor_name: vendor_name, eval_id: eval_id, new_file: {"uploaded_by": current_user, "browser_uploaded_date:": 'Date()'} },
                                method: "POST"
                            }).then(checkUploadDetails, error, progress);
                
                            // Helper functions
                            function error (resp) {
                                console.log('Error status: ' + resp.status);
                            }
                            
                            function progress (evt) {
                                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                            }
                            
                            function checkUploadDetails(resp) {
                                if(resp.config.data.file){
                                    console.log('Success ' + resp.config.data.file.name + ' uploaded. Response: ' + resp.data);
                                }
                                //vm.file_list = resp.files;
                            };
                        }(i));
                    }
                    files_saved = true;
                }      
            };
            
            function getFile(query_params) {
                return $http.get('/files' + query_params, 
                    { 
                      params: query_params,
                      responseType: 'arraybuffer',
                      headers: {
                          Authorization: authorization
                        }
                    })
                    .success(function(data, status, headers, config) {
                            
                        var headerObj = headers();
                        var content_type = headerObj['content-type'];
                        var str = headerObj['content-disposition'];
                        var file_name = str.split('=')[1];
                
                        var file = new Blob([data], { type: content_type });
                        saveAs(file, file_name);
                    })
                    .error(function(data, status, headers, config) {
                        console.log('Error with GET request');
                    });
            };
            
            return API;
        }]);
}());
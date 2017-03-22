var helper = require('./helper/helper.methods.js')(),
    Bundle = require('../models/bundle.model.js'),
    email_client = require('../emailClient/email.client.js'),
    fs = require('fs');

var evaluationController = function(User, Evaluation, db) {
    
    var get = function (req, res) {
        Evaluation.find( function(err, evaluations) {
            if(err) {
                res.status(500);
                res.send(err);
            } 
            else {
                res.json(evaluations);    
            }
        });
    };
    
    var findById = function (req, res, next) {
        Evaluation.findById(req.params.id, function(err, evaluation) {
           if(err)
            {
                res.status(500);
                console.log("Error querying for evaluation id.")
                res.send(err);
            }
            else if(evaluation)
            {
                req.evaluation = evaluation;
                next();
            }
            else
            {
                res.status(404);
                res.send('No evaluation found.');
            }
        });
    };
    
    var getById = function (req, res) {
        res.json(req.evaluation);
    };
    
    var putById = function (req, res) {
        var email_list = req.body.email_list;
        if(typeof email_list != "undefined" ){
            helper.removeEmailPropertieThatCausesBug(email_list[0]);
        }

        //req.evaluation.vendor_name                 = req.body.vendor_name;
        req.evaluation.name                        = req.body.name;
        req.evaluation.phone                       = req.body.phone;
        req.evaluation.company                     = req.body.company;
        req.evaluation.position                    = req.body.position;
        req.evaluation.history                     = req.body.history;
        req.evaluation.email_list                  = req.body.email_list;
        req.evaluation.sub_direction               = req.body.sub_direction;
        req.evaluation.manager                     = req.body.manager;
        req.evaluation.nominating_manager          = req.body.nominating_manager;
        req.evaluation.vendor_title                = req.body.vendor_title;
        req.evaluation.vendor_age                  = req.body.vendor_age;
        req.evaluation.years_in_market             = req.body.years_in_market;
        req.evaluation.years_in_industry           = req.body.years_in_industry;
        req.evaluation.features                    = req.body.features;
        req.evaluation.team_size                   = req.body.team_size;
        req.evaluation.total_competitors           = req.body.total_competitors;
        req.evaluation.location                    = req.body.location;
        req.evaluation.history_list                = req.body.history_list;
        req.evaluation.last_4_year_rating          = req.body.last_4_year_rating;
        req.evaluation.last_3_year_rating          = req.body.last_3_year_rating;
        req.evaluation.last_2_year_rating          = req.body.last_2_year_rating;
        req.evaluation.last_1_year_rating          = req.body.last_1_year_rating;
        req.evaluation.current_scope_of_works      = req.body.current_scope_of_works;
        req.evaluation.proposed_work_mapping       = req.body.proposed_work_mapping;
        req.evaluation.key_factors                 = req.body.key_factors;
        req.evaluation.best_clients                = req.body.best_clients;
        req.evaluation.differentiating_factors     = req.body.differentiating_factors;
        req.evaluation.endorsers_comments          = req.body.endorsers_comments;
        req.evaluation.strengths                   = req.body.strengths;
        req.evaluation.weaknesses                  = req.body.weaknesses;
        req.evaluation.endorsers_detail_list       = req.body.endorsers_detail_list;
        req.evaluation.status                      = req.body.status;
        

        if(!isEvalLocked(req.evaluation.id, req.body.user)) {
            req.evaluation.save(function (err) {
                if(err) {
                    res.status(500);
                    res.send(err);
                }
                else
                {
                    res.json(req.evaluation);    
                }
            });

            //TODO: save new emails and save files
            if(req.body.eval_submitted == "true") {
                //Send notification to admin
                var bundle_id = req.evaluation.bundle_id;
                if(typeof bundle_id != "undefined"){
                    Bundle.findById(req.evaluation.bundle_id, function(err, bundle) {
                        if(err) {
                            console.log("Error getting bundle to send admin email update of complete evaluation.");
                        }
                        else {
                            var dir = '/data/VDP/app/temp/generated_bundles/' + req.evaluation.vendor_name;
                            if (!fs.existsSync(dir)){
                              fs.mkdirSync(dir);
                            }
                            dir = '/data/VDP/app/temp/generated_bundles/' + req.evaluation.vendor_name + '/temp.html';
                            var stream = fs.createWriteStream(dir);

                            stream.once('open', function(fd) {
                                var html = helper.buildHtml(req.body);
                                stream.end(html);

                                //send emial
                                var admin_email = bundle.creator;
                                var subject = "Evaluation Complete";
                                var body = "An Evaluation for " + req.evaluation.vendor_name + " has just been submitted by " + req.evaluation.user;
                                            // + "<br><br> <a href=\"http://sl73vlporapd001.visa.com:8443/temp/generated_bundles/" + req.evaluation.vendor_name + "\"> Click here to view</a>";
                                var attachments = [];
                                email_client.SendMail(admin_email, subject, body, attachments);
                            });
                        }
                    });
                } 
            } // - if for if eval was submitted
        } // - if for if eval is locked

        else {
            res.status(423);
            res.send({error: "Evalution cannot be updated because it is locked."});
            console.log("Evalution " + req.evaluation.id + " cannot be update because it is locked.");
        }
    };
    
    var deleteById = function (req, res) {
        req.evaluation.remove(function (err) {
            if(err)
            {
                res.status(500);
                res.send(err);
            }
            else
            {
                res.status(204);
                res.send("Removed");
            }
        })
    };

    function isEvalLocked(id, user) {
        for(var i = 0; i < global.locked_evals.length; i++) {
            if(global.locked_evals[i].eval == id && global.locked_evals[i].user != user ){
              return true;
            }
        }
        return false;
    }
    
    return {
        get: get,
        findById: findById,
        getById: getById,
        putById: putById,
        deleteById: deleteById
    };
}; 

module.exports = evaluationController;
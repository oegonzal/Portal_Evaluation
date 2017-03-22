var helper = require('./helper/helper.methods.js')(),
    Evaluation = require('../models/evaluation.model.js'),
    email_client = require('../emailClient/email.client.js'),
    fs = require('fs');

var bundleController = function(Bundle) {

  //for Admin Dashboard
  var get = function(req, res) {

    if(req.query.type == 'archived'){
      Bundle.find({archived: "true"})
            .exec(callback);
    }
    else{
      Bundle.find({archived: "false"})
            .exec(callback);
    }

    function callback(err, bundles) {
        if(err) {
            res.status(500);
            res.send(err);
        }
        else {
            res.json(bundles);    
        }
    };
  };

  var post = function(req, res) {

    var email_list = req.body.email_list;
    var lowerCaseEmails = {};
    var allEmailsArray = [];

    //Validate emails
    if(typeof email_list != 'undefined'){
      helper.removeEmailPropertieThatCausesBug(email_list[0]);
      lowerCaseEmails = helper.emailsToLowercase(email_list[0]);
      allEmailsArray = helper.eliminateDuplicates((lowerCaseEmails.evaluators).concat(lowerCaseEmails.finance));
    }
    
    var bundle;
    var current_email;
    var evaluation;
    var length = allEmailsArray.length;
    var eval_array = [];

    //Create bundle 
    if(length > 0) {
      //Save bundle and get Id
      bundle = new Bundle({vendor_name: req.body.vendor_name, users: allEmailsArray, creator: req.body.creator, evaluation_type: req.body.evaluation_type, archived: "false"});
      bundle.save(function(err) {
        if(err){
          console.log("Error saving bundle.");
        }
      });

      //Make an evaluation for each user/ one for all users (collaborative)
      if(bundle.evaluation_type == "single"){
        console.log("---Single selected");
        var user = "Collaborative Document";

        evaluation = new Evaluation({ bundle_id: bundle._id, vendor_name: bundle.vendor_name, status: "Evaluation Sent", user: user, evaluator_emails: allEmailsArray});
        
        evaluation.save(function(err, evaluation){
            if(err) {
                console.log("Bundle Error: Error saving evaluation: " + err)
            }
            else{
              //add evaluation to specific user with email
              for(var i = 0; i < length; i++){
                current_email = allEmailsArray[i];
                (function(current_email) {
                  helper.addEvalToEmail(current_email, evaluation);

                  //Send notification
                  var attachments = [];
                  email_client.SendMail(current_email, req.body.email_subject, req.body.email_body, attachments);
                }(current_email));
              }
            }
        });

        //add evaluation to array of evals that will be stored in bundle
        if(typeof evaluation._id != "undefined") {
          eval_array.push({ eval: evaluation._id, user: user});
        }

      } //-end of if stmt
      else{
        for(var i = 0; i < length; i++){
          current_email = allEmailsArray[i];

          //http://metaduck.com/01-asynchronous-iteration-patterns.html
          (function(current_email) {
            evaluation = new Evaluation({ bundle_id: bundle._id, vendor_name: bundle.vendor_name, status: "Evaluation Sent", user: current_email });
            
            evaluation.save(function(err, evaluation){
                if(err) {
                    console.log("Bundle Error: Error saving evaluation: " + err)
                }
                else{
                  //add evaluation to specific user with email
                  helper.addEvalToEmail(current_email, evaluation);

                  //send notification email to user
                  console.log("Sending email to: " + current_email);
                  var attachments = [];
                  email_client.SendMail(current_email, req.body.email_subject, req.body.email_body, attachments);
                }
            });

            if(typeof evaluation._id != "undefined") {
              eval_array.push({ eval: evaluation._id, user: current_email});
            }
          }(current_email));
        }
      } // -end of else stmt

      //Save created evaluations to the bundle
      bundle.evaluations = eval_array;
      bundle.save(function(err) {
        if(err){
          console.log("Error saving bundle.");
        }
      });
    }


    //Generate path for storing bundle files
    var dir = '/data/VDP/app/temp/generated_bundles/' + req.body.vendor_name;
    
    //checks if directory exists, if doesnt then create it
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
  };

  var findById = function (req, res, next) {
    console.log("Inside findById function for bundle");
    Bundle.findById(req.params.id, function(err, bundle) {
        if(err)
        {
            res.status(500);
            console.log("Error querying for bundle id.")
            res.send(err);
        }
        else if(bundle)
        {   
            var length = bundle.evaluations.length;
            var dbQueried = 0;
            req.bundle = bundle;
            
            //Return all evals inside bundles and files that go with each eval
            if(length > 0){
              for(var i = 0; i < length; i++){
                //anonymous function to run in sync
                (function(i) {
                  Evaluation.findById(bundle.evaluations[i].eval, function(err, evaluation){
                    if(err){
                      console.log("Error obtaining one of the evaluations for the bundle.");
                    }
                    else{
                      req.bundle.evaluations[i].file_list = evaluation.file_list;
                      req.bundle.evaluations[i].status = evaluation.status;
                      req.bundle.evaluations[i].eval_doc = evaluation;
                    }
                    if(++dbQueried == length){
                      next();
                    }
                  });
                }(i));

              }
            }
        }
        else
        {
            res.status(404);
            res.send('No bundle found.');
        }
    });
  };

  var getById = function(req, res) {
    res.json(req.bundle);
  }

  var putById = function (req, res) {
    console.log("Bundle ctrl putById function");
    req.bundle.archived    = req.body.archived;
    req.bundle.save(function (err) {
        if(err) {
            res.status(500);
            res.send(err);
        }
        else
        {
            res.json(req.bundle);    
        }
    });
  };

  //TODO: take care of all corner cases
  var deleteById = function (req, res) {
        req.bundle.remove(function (err) {
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

  return {
    get: get,
    post: post,
    findById: findById,
    getById: getById,
    putById: putById
  };
};

module.exports = bundleController;
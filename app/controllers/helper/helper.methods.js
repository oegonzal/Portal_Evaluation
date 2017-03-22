var User = require('../../models/user.model.js'),
    email_client = require('../../emailClient/email.client.js');

var helper = function() {

    function emailsToLowercase(email_list) {
            var evaluators  = [];
            var finance     = [];

            for(var i = 0; i < email_list.evaluator.length; i++){
                evaluators.push( (email_list.evaluator[i].email).toLowerCase() );
            };

            for(var i = 0; i < email_list.finance.length; i++){
                finance.push( (email_list.finance[i].email).toLowerCase() );
            };

            return {
                evaluators: evaluators,
                finance:    finance
            };
        };

    function eliminateDuplicates(arr) {
        var i,
          len=arr.length,
          out=[],
          obj={};

         for (i=0;i<len;i++) {
         obj[arr[i]]=0;
         }
         for (i in obj) {
         out.push(i);
         }
         return out;
    };

    //Needed to remove property not valid for mongodb
    function removeEmailPropertieThatCausesBug(email_list) {
        for(var i = 0; i < email_list.evaluator.length; i++){
            delete email_list.evaluator[i].$hashKey;
        };

        for(var i = 0; i < email_list.finance.length; i++){
            delete email_list.finance[i].$hashKey;
        };
    };

    //Add evals to emails that dont have it yet
    function saveOrUpdateEvalToEmails(emailArray, evaluation) {

        for(var i = 0; i < emailArray.length; i++) {
            var email = emailArray[i];
            addEvalToEmail(email, evaluation);
        }  
    };


    function addEvalToEmail(email, evaluation) {
        (function (email) {
            User.findOne({ email: email }, function(err, user) {
                if(err){
                    console.log("Error adding finding email: " + email);
                }
                else if(user){
                    //check if user has the evaluation already
                    var hasEval = false;
                    for(var i = 0; i < user.evaluations.length; i++) {
                        if(user.evaluations[i].id.toString() == evaluation._id.toString()) {
                            hasEval = true;
                        } 
                    }

                    //If not and user is found, update evaluations list for user
                    if(!hasEval) {
                        user.evaluations.push({id: evaluation._id, vendor: evaluation.vendor_name});
                        user.save(function(err) {
                            if(err){
                                console.log("Error updating users email list.")
                            }
                        });
                    }
                }
                else {
                    //No user found, add user
                    var username = email.split('@')[0];
                    var user = new User({
                        username: username,
                        email:    email,
                        permission_level: 'user',
                        evaluations: [{id: evaluation._id, vendor: evaluation.vendor_name}] //Works only on save/create
                    });

                    user.save(function(err) {
                        if(err){
                            console.log("Error adding evaluator email");
                        }
                    });
                    
                }
            });
        }(email));
    };

    function sendMessageToEmails(array_of_emails, subject, body, attachments) {
        for(var i = 0; i < array_of_emails.length; i++) {
            email_client.SendMail(array_of_emails[i], subject, body, attachments);
        }
    };

    function buildHtml(data) {
        var css = '.summary_container {height: 90%; width: 90%; margin: 40px;}.summary_table tr th, .summary_table_no_margin tr th{    background-color: #E4E4E4;     padding: 13px;}table tr td {    padding: 8px;}.summary_table {    margin-top: 0px;    margin-left: 25px;    margin-right: 25px;    width: 80%;    border: #8D8A8A solid 1px;    margin-left: auto;    margin-right: auto;}.summary_table_header {    margin-top: 0px;    margin-left: 25px;    margin-right: 25px;    width: 80%;    border: #8D8A8A solid 1px;    margin-left: auto;    margin-right: auto;}.summary_table_header_font {    font-weight: bold;    font-size: 22px;}.summary_table_no_margin {    width: 80%;    margin-left: auto;    margin-right: auto;    border-left-color: #8D8A8A;    border-left-style: solid;    border-right-color: #8D8A8A;    border-right-style: solid;    border-bottom-color: #8D8A8A;    border-bottom-style: solid;   border-width: 1px;    border-top-style: none;}.summary_container h3 {    margin-top: 40px;    text-align: center;}.top_border {    border-bottom-color: white;    border-left-color: #8D8A8A;    border-right-color: #8D8A8A;    border-top-color: #8D8A8A;    border-style: solid;    border-width: 1px;}.summary_fields td {    font-weight: bold;}.top_space {    margin-top: 40px;}'; //' .summary_container {height: 90%; width: 90%; margin: 40px;} table tr th {background-color: #CBCBCB; padding: 13px;} table tr td { padding: 8px;} .summary_table { margin-top: 0px; margin-left: 25px; margin-right: 25px; width: 80%;border: #8D8A8A solid 1px; margin-left: auto; margin-right: auto;}.summary_table_no_margin {width: 80%; margin-left: auto; margin-right: auto; border-left-color: #8D8A8A;border-left-style: solid;border-right-color: #8D8A8A; border-right-style: solid; border-bottom-color: #8D8A8A; border-bottom-style: solid; border-width: 1px; border-top-style: none;} .summary_container h3 {float: center; margin-top: 40px; margin-right: auto; margin-left: auto; text-align: center;}.top_border {border-bottom-color: white; border-left-color: #8D8A8A; border-right-color: #8D8A8A; border-top-color: #8D8A8A; border-style: solid; border-width: 1px;} .summary_fields td {font-weight: bold;}; .top_space {   margin-top: 40px;';
        var header = '<style>' + css + '</style>'; 
        var body = data.html;

        return '<!DOCTYPE html>'
             + '<html><header>' + header + '</header><body>' + body + 
             '</body></html>';
    };

    return {
        emailsToLowercase:                  emailsToLowercase,
        eliminateDuplicates:                eliminateDuplicates,
        removeEmailPropertieThatCausesBug:  removeEmailPropertieThatCausesBug,
        saveOrUpdateEvalToEmails:           saveOrUpdateEvalToEmails,
        addEvalToEmail:                     addEvalToEmail,
        buildHtml:                          buildHtml,
        sendMessageToEmails:                sendMessageToEmails
    };
};

module.exports = helper;
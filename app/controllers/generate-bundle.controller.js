var fs = require('fs'),
    pdf = require('html-pdf'),
    Evalation = require('../models/evaluation.model.js'),
    helper = require('./helper/helper.methods.js')(),
    filesDb = require('../../config/database.js'),
    email_client = require('../emailClient/email.client.js');

var generateController = function() {

  var post = function (req, res) {
    //http://stackoverflow.com/questions/21617468/node-js-generate-html

    //---NOTE: if in local host REMOVE "/data/VDP/" 
    var dir = '/data/VDP/app/temp/generated_bundles/' + req.body.vendor_name;

    //checks if directory exists, if doesnt then create it
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
    var html_file_path = '/data/VDP/app/temp/generated_bundles/' + req.body.vendor_name + '/temp.html';
    
    //specify where to store html file
    var stream = fs.createWriteStream(html_file_path);

    stream.once('open', function(fd) {
      //make html file in path
      var html = helper.buildHtml(req.body);
      stream.end(html);

      //Get all files from evaluations into an array
      var files = req.body.files;
      var emails = req.body.management_emails;
      if(typeof emails == "undefined"){
        res.send(500, {Error: "Must enter atleast one email to send bundle to."});
        return;
      }
      
      //console.log("Html is : " + html);
      //console.log("Here is the filelist: " + JSON.stringify(files));
      //console.log("management_emails: " + JSON.stringify(emails));

      //Make a body, subject, and attach the pdf and files into the email
      var email_subject     = req.body.vendor_name + " Evaluation";
      var email_body        = "Evaluation for " + req.body.vendor_name + " is now complete. <br> Supporting files and report have been attached to email.";
      var email_attachments = [
                                {
                                  filename: 'temp.html', 
                                  path: "/data/VDP/app/temp/generated_bundles/" + req.body.vendor_name + "/temp.html"
                                }
                              ];
      //Get attachments
      for(var user = 0; user < files.length; user++){
        if(typeof files[user] != "undefined"){
          for(var i = 0; i < files[user].length; i++){
            email_attachments.push({filename: files[user][i].file_name, path: dir + "/" + files[user][i].file_name}); //path: dir + "/" + files[0].file_name_on_disk
          } 
        }
      }
    
      for(var i = 0; i < emails.length; i++){
        email_client.SendMail(emails[i].email, email_subject, email_body, email_attachments);
      }

      /*
      //read content from html file
      var html_file = fs.readFileSync(html_file_path, 'utf8');
      //make options to create pdf
      var options = { 
                      border: {
                        "top": ".5in",          
                        "right": ".5in",
                        "bottom": ".5in",
                        "left": ".5in"
                      }
                    };
      console.log("This is the path to html: " + html_file_path);
      console.log("------This is the path: " + dir + '/generated.pdf');
      //create the pdf        
      pdf.create(html_file, options).toFile(dir + '/generated.pdf', function(err, res) {
        if (err){
          console.log("-----Inside Error statement");
          return console.log(err);
        } 
        console.log(res); // { filename: '/app/businesscard.pdf' } 
      });
      */
    });

  };

  return {
    post: post
  };
};

module.exports = generateController;
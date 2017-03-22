/**
 * **This module is responsible for sending emails (such as test results) using SMTP.
 * The host used is *inetmail.visa.com.* **
 */

/** @ignore */
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var loginLink = "http://sl73vlporapd001.visa.com:8443/login";

/**
 * The class that is responsible for setting the properties of the email and sending it.
 * @constructor Email
 */
var Email = function() {
    /** @ignore */
    var mailOptions;
    var transporter = nodemailer.createTransport(smtpTransport({
    host: 'inetmail.visa.com',
    tls: {
        rejectUnauthorized: false
    },
    port: 25,
    }));

    /** @ignore */
    // Sets the sender and receiver mail address, the subject and body of the email
    var __setMailOptions__ = function(toAddress, subject, body, attachments) {
        
        if(typeof attachments == "undefined"){
          var attachments = [];
        }
        mailOptions = {
            from: 'Tools Evaluation Portal  <visasplunk@visa.com>', // sender address
            to: toAddress, // list of receivers
            subject: subject, // Subject line
            html: body + "<br><br>Please go to <a src=\""+ loginLink +"\">"+ loginLink +"</a> to login to the portal."
            ,
            attachments: attachments
            /*
            [
              {
                filename: 'temp.html',
                path: '/data/VDP/app/temp/generated_bundles/temp.html'
              }
            ]
            */
            

        };
    };

    /**
     * The method that sends the mail to the specified recipient.
     * @param {string} toAddress The email address of the recipient
     * @param {string} subject The subject of the email
     * @param {string} body The body of the email. This can be a HTML string
     */
    this.SendMail = function(toAddress, subject, body, attachments) {
        __setMailOptions__(toAddress, subject, body, attachments);
        if(mailOptions) {
            return transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    //An error has occurred while sending the email
                    console.log("Error: " + error);
                    return;
                }
                else {
                    //The email was sent successfully
                    console.log('Message sent: ' + info.response);
                    return;
                }
            });
        }
    }
};


//email= new Email();
//email.SendMail();
/** @ignore */
module.exports = new Email(); //Email;








/*  //Firewall request has been made.
    //Once accepted, deploy code to dev server
    //And test the nodemailer functionality there
var transporter = nodemailer.createTransport(smtpTransport ({
  host: 'sl73selapp02',
  port: 25,
  secure: true,
  auth: {
  }
}));


var mailOptions = {
      from: 'visasplunk@visa.com',
      to: 'enfav8@gmail.com',
      subject: 'DONOTREPLY-SplunkAlert-$name$.',
      text: 'Hello world ',
      html: '<b>Hello world </b>'
    };
transporter.sendMail(mailOptions, function(error, info){
    if(error){
       console.log(error);
    }else{
    console.log('Message sent: ' + info.response); 
    }
});
*/
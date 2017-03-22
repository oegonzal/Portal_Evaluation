var passport = require('passport'),
    mongoose = require('mongoose'),
    ldap = require('ldapjs');
var User = mongoose.model('Users');


module.exports.register = function(req, res) {

  if(!req.body.username || !req.body.email || !req.body.password) {
     sendJSONresponse(res, 400, {
       "message": "All fields required"
     });
     return;
  }

  var user = new User();

  user.name = req.body.name;
  user.username = req.body.username;
  user.email = req.body.email;
  //permission_level = 'admin';

  user.save( function(err) {
    console.log('error: ' + JSON.stringify(err))
    var token = user.generateJwt();
    res.status(200);
    res.json({
      "token" : token
    });
  });

};

//should move the authenticate visa password and user to the passport.js file
module.exports.login = function(req, res){
    console.log("loging log for remote server worked.");
    var username = req.body.username;
    var password = req.body.password;

    if(!username || !password) {
       sendJSONresponse(res, 400, {
         "message": "All fields required"
       });
       return;
    }

    //REMOVE THIS
    portalAuthenticate(req, res);
    /*
    //Make sure user is a visa employee VISA\\
    var client = ldap.createClient({
      url: 'ldap://10.55.32.211'
    });

    var visaUsername = "VISA\\" + username;
    client.bind(visaUsername, password, function(err) {
        if(err) {
            res.status(401).json(err);
            console.log("Error: " + err);
            console.log("Not Visa authenticated: " + username);
        } 
        else 
        {
            portalAuthenticate(req, res);
            console.log('Visa authenticated.');
        }
        client.unbind();
    });
    */
};

//Check that the user is registered in the portal
function portalAuthenticate(req, res) {
  passport.authenticate('local', function(err, user, info){
    var token;
    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      console.log("There was an error.");
      return;
    }

    // If a user is found
    if(user){
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token
      });
    } else {
      // If user is not found
      res.status(401).json(info);
      console.log("User not found error. Passport;");
    }
  })(req, res);
};

/* //Learn to return true/false from asychronous functions that have inner callbacks
function visaAuthenticate(username, password, req, res) {
  var client = ldap.createClient({
      url: 'ldap://10.55.32.211'
    });

    var visaUsername = "VISA\\" + username;
    client.bind(visaUsername, password, function(err) {
        if(err) {
            res.status(401).json(err);
            console.log("Error: " + err);
            console.log("Not Visa authenticated: " + username);
        } 
        else 
        {
            portalAuthenticate(req, res);
            console.log('Visa authenticated.');
        }
        client.unbind();
    });
};
*/

//sends response back to client
var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

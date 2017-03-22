var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    jwt = require('jsonwebtoken')
    ldap = require('ldapjs');

//Should only stores last 2
var evals_history = {
        date:           { type: Date, default: Date.now },
        evaluation_id:  { type: String }
    };

var user = new Schema({
    username:           {
                            type: String,
                            required: true,
                            unique: true   
                        },
    date_created:       { 
                            type: Date, 
                            default: Date.now 
                        },
                    
    email:              {
                            type: String,
                            unique: true
                        },
    evals_modified:     [evals_history], 
    evaluations:        { type: Array },
    permission_level:   String
}); 

//Secret token to keep user authenticated
user.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 1); //set to one day from login

  return jwt.sign({
    _id: this._id,
    email: this.email,          //remove
    username: this.username,
    permission: this.permission_level,
    exp: parseInt(expiry.getTime() / 1000),
  }, "MY_SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

module.exports = mongoose.model('Users', user);
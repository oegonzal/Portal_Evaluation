'use strict';

module.exports = function(app, db) {
    var path = require('path'),
        jwt = require('express-jwt');
    
    var auth = jwt({
      secret: 'MY_SECRET', //TODO: make an env variable for this
      userProperty: 'payload'
    });

    //API calls
    app.use(require('./home.route.js'));

    app.use('/files', auth, require('./file')(db).router);
    app.use('/evaluations', auth, require('./evaluation')(db).router);
    app.use('/eval-bundle', auth, require('./bundle'));
    app.use('/user-profile', auth, require('./user'));
    app.use('/login', require('./authentication'));
    app.use('/generate-bundle', auth, require('./generate-bundle'));

    var ctrl = require('../controllers/email.controller.js')();
    app.post('/message', ctrl.sendMessage)
    

    
    //Catch unauthorised errors
    app.use(function (err, req, res, next) {
      if (err.name === 'UnauthorizedError') {
        res.status(401);
        res.json({"message" : err.name + ": " + err.message});
      }
    });
}






//controllers
//var ctrlAuth = require('../controllers/authentication.controller.js');
//post to register a user
//app.post('/register', ctrlAuth.register);
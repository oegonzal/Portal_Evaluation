var express = require('express'),
    app = express(),
    multer = require('multer'),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    bodyParser = require('body-parser'),
    //favicon = require('serve-favicon'),
    morgan = require('morgan'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    passport = require('passport');

var port = process.env.PORT || 8443;
var db = require('./config/database.js');
db.init(app);

//Environment variables
require('./config/env/vars.js');
//Bring in the data model
require('./app/models/group/models.js');
//Bring in the Passport config after model is defined
require('./config/passport.js');

//Define middleware...
app.use(express.static(path.resolve(__dirname + '/public')));
app.use(express.static(path.resolve(__dirname + '/app')));  
//app.use(''); 
app.use(bodyParser.urlencoded({ extended:true }));    //if form, parse body and add to request
app.use(bodyParser.json());                           //if json, parse body and add to request
app.use(cookieParser());
app.use(morgan('dev'));                               //log every request to the console

/*
app.use(function(req, res, next) {                    //headers for socket.io
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Headers", "Content-Type");
        res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
        next();
    });
*/



//File upload...
//require('./app/multer/multer.js');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try{
        var vendor_name = req.body.vendor_name;
        if(typeof vendor_name == "undefined") throw "No vendor name was provided and OS could not figure out directory location to store vendor files.";
        cb(null, __dirname + '/app/temp/generated_bundles/' + req.body.vendor_name);
    }
    catch(err){
        console.log("Error: " + err);
    }
  },
  filename: function (req, file, cb) {
    try{
        var file_name = file.originalname;
        if(typeof file_name == "undefined") throw "No file name provided for file. Cannot save file."
        cb(null, file.originalname);
    }
    catch(err){
        console.log("Error: " + err);
    }
  }
});
var upload = multer({ storage: storage });
var upload_type = upload.single('file');
app.use(upload_type);


//Initialise Passport before using the route middleware
app.use(passport.initialize());

//Routes
require('./app/routes/main.route.js')(app, db);

//Set up web socket communication with browsers
require('./app/socket/socket.js')(io);

//Message to display when connecting to localhost...
server.listen(port, function(err){
    console.log('running server on port ' + port);
})

module.exports = app;
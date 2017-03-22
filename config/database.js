var mongoose = require('mongoose'),
    Grid = require('gridfs-stream'),
    fs = require('fs'),
    conn = mongoose.connection;

var gracefulShutdown;
var uri = 'mongodb://localhost/p1';
if (process.env.NODE_ENV === 'production') {
  uri = process.env.MONGOLAB_URI;
}

module.exports.init = function(app) {
    Grid.mongo = mongoose.mongo;
    mongoose.connect(uri);
    
    conn.once('open', function() {
        var gfs = Grid(conn.db);
        app.set('gridfs', gfs);
        //console.log('connection open and the mongo db URI is: ' + uri);
        
    });
    
    // CONNECTION EVENTS
    mongoose.connection.on('connected', function() {
        console.log('Mongoose connected to ' + uri);
    });
    mongoose.connection.on('error', function(err) {
        console.log('Mongoose connection error: ' + err);
    });
    mongoose.connection.on('disconnected', function() {
        console.log('Mongoose disconnected');
    });
    
    // CAPTURE APP TERMINATION / RESTART EVENTS
    // To be called when process is restarted or terminated
    gracefulShutdown = function(msg, callback) {
        mongoose.connection.close(function() {
            console.log('Mongoose disconnected through ' + msg);
            callback();
        });
    };
    // For nodemon restarts
    process.once('SIGUSR2', function() {
        gracefulShutdown('nodemon restart', function() {
            process.kill(process.pid, 'SIGUSR2');
        });
    });
    // For app termination
    process.on('SIGINT', function() {
        gracefulShutdown('app termination', function() {
            process.exit(0);
        });
    });
};

module.exports.uploadFile = function(file, req, res) {
    var gfs = Grid(conn.db);
    console.log("----file: " + JSON.stringify(file));

    var file_name = file.originalname;
    console.log("-----file_name" + file_name); 
    var path = file.path;
    console.log("-----path for file: " + file.path); //  /data/VDP/app/temp/uploads/file-1470777643601
    var errors = [];
    
    var write_stream = gfs.createWriteStream({
        //options to store:
        filename: file_name,
        mode: "w",
        content_type: file.mimetype,
        metadata: {}
    }); 
    
    var read_stream = fs.createReadStream(path);
    read_stream.pipe(write_stream);
    
    /*
    write_stream.on('close', function (file) {
        //delete file from temp folder
        fs.unlink(path, function(err) {
            if(err) 
            { 
                console.error("Error: " + err);
                errors.push(err);
            }
            console.log('Successfully deleted: ' + path )
        });
    });
    */

    return  {
                object_id:      write_stream.id,
                filename:       write_stream.name,
                errors:         errors
            };
};

module.exports.getFileByIdInNonRequest = function(file_id, file_path) {
    var gfs = Grid(conn.db);
    var docId = mongoose.Types.ObjectId(file_id);
    var file = {};

    console.log("----in db function: " + file_path);

    gfs.files.find( { _id : docId } ).toArray(function (err, files) {
        if (err) {
            console.log("Error getting file: " + file_id);
        }
        if (files.length > 0) {
            var filename = files[0].filename;
            var read_stream = gfs.createReadStream({ filename: filename });

            read_stream.on('error', function (err) {
                console.log('Readstream error: ' + JSON.stringify(err));
            });

            //read_stream.pipe(file);
            return file;
        } 
        else {
            console.log('File Not Found: ' + file_id);
        }
    }); 

};

module.exports.getFileById = function(req, res) {
    var gfs = Grid(conn.db);
    var file_id = req.query.file_id;
    console.log("backend-----" + file_id);
    var docId = mongoose.Types.ObjectId(req.query.file_id);
    
    gfs.files.find( { _id : docId } ).toArray(function (err, files) {
        if (err) {
            res.json(err);
        }
        if (files.length > 0) {
            var mime = files[0].contentType;
            var filename = files[0].filename;
            res.set('Content-Type', mime);
            res.set('Content-Disposition', "attachment; filename=" + filename);
            res.set('Content-Length', files[0].length);
            
            var read_stream = gfs.createReadStream({ filename: filename });
          
            req.on('error', function(err) {
                console.log('Req error.');
                res.send(500, err);
            });
            read_stream.on('error', function (err) {
                console.log('Readstream error.');
                res.send(500, err);
            });
            
            res.mime = mime;
            read_stream.pipe(res);
        } 
        else {
            res.json('File Not Found');
        }
    }); 
    
};

var readProperties = function(obj) {
    for (var property in obj) {
            if (obj.hasOwnProperty(property)) {
                // do stuff
                console.log("property: " + property);
                console.log(obj[property]);
            }
        }
}
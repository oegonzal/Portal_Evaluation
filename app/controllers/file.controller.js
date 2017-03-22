var Evaluation = require('../models/evaluation.model.js');

var fileController = function (db) {
    
    var get = function (req, res) {
        db.getFileById(req, res);
    };
    
    var post = function (req, res) {
        //upload file to gridfs tables
        if(typeof req.file != "undefined") {
            try {
                var fileDetails = db.uploadFile(req.file, req, res);
                var file = req.body.new_file;

                file['file_id'] = fileDetails.object_id;
                file['file_name'] = fileDetails.filename;

                //update evaluation file list
                Evaluation.findById(req.body.eval_id, function(err, evaluation){
                    if(err){
                        res.status(500);
                        res.send(err);
                        console.log(err);
                    }
                    else if(evaluation){
                        evaluation.file_list.push(file);
                        //save eval now
                        evaluation.save(function(err){
                            if(err) console.log("Error saving eval file id.");
                        });

                        res.status(200);
                        res.send({message: "File " + req.file.originalname + " added to evaluation.", files: evaluation.file_list});
                    }
                    else{
                        res.status(304);
                        res.send('No evaluation found.');
                        console.log("Evaluation not found. Failed to add file " + req.file.originalname + " to evaluation list.");
                    }
                });  
            }

            catch(err) {
                console.log(err);
                res.status(500);
                res.send(err);
            }
        }
    };
    
    return {
        post: post,
        get: get
    }
}; 

module.exports = fileController;
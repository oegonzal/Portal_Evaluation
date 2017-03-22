var multer = require('multer');

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
        if(typeof filename == "undefined") throw "No file name provided for file. Cannot save file."
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
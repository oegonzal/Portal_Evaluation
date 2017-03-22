var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var bundle = new Schema({
    evaluations: 		{ type: Array },
    vendor_name: 		String,
    users: 		 		Array,
    creator: 			String,
    evaluation_type:	String,
    archived: 			String
});

module.exports = mongoose.model('Bundles', bundle);
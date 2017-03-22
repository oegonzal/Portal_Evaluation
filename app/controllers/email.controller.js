var Bundle = require('../models/bundle.model.js'),
	helper = require('./helper/helper.methods.js')();

var emailCtrl = function() {

	var sendMessage = function(req, res) {
		Bundle.findById(req.body.bundle_id, function(err, bundle){
			if(err){
				console.log(err);
			}
			else if(bundle) {
				var emails = bundle.users;
				var attachments = [];
				helper.sendMessageToEmails(emails, req.body.email_subject, req.body.email_body, attachments);
			}
		});
	};

	return {
		sendMessage: sendMessage
	}
};

module.exports = emailCtrl;

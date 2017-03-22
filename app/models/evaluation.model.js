var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    encrypt = require('mongoose-encryption');

//Saves last 2 edit histories
var edit_history = {
    date: { type: Date, default: Date.now },
    user: { type: String }
};

var file_details = {
    file_name:      String,
    file_id:        String,
    uploaded_by:    String,
    uploaded_date:  { type: Date, default: Date.now }
};

var evaluationDetails = new Schema({
    bundle_id:              String,
    vendor_name:            String,
    user:                   String,
    name:                   String,
    //phone:                  String,
    //company:                String,
    //position:               String,
    history:                [edit_history],
    email_list:             Array,
    file_list:              [file_details],
    sub_direction:          String,
    manager:                String,
    nominating_manager:     String,
    vendor_title:           String,
    vendor_age:             String,
    years_in_market:        String,
    years_in_industry:      String,
    features:               String,
    team_size:              String,
    total_competitors:      String,
    location:               String,
    history_list:           Array,
    last_4_year_rating:     String,
    last_3_year_rating:     String,
    last_2_year_rating:     String,
    last_1_year_rating:     String,
    current_scope_of_works: String,
    proposed_work_mapping:  String,
    key_factors:            String,
    best_clients:           String,
    differentiating_factors:String,
    endorsers_comments:     String,
    strengths:              Array,
    weaknesses:             Array,
    endorsers_detail_list:  Array,
    finance_emails:         Array,
    evaluator_emails:       Array,
    status:                 String
});

var encKey =  process.env.SOME_32BYTE_BASE64_STRING;
var sigKey =  process.env.SOME_64BYTE_BASE64_STRING;

//evaluationDetails.plugin(encrypt, { encryptionKey: encKey, signingKey: sigKey, encryptedFields: ['last_1_year_rating'] });

module.exports = mongoose.model('EvaluationDetails', evaluationDetails);
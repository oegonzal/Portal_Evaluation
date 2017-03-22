'use strict';

var express = require('express');
var router = express.Router();

var bundleCtrl = require('../../controllers/generate-bundle.controller.js')();

//default route...
router.route('/')
    .post(bundleCtrl.post);
    
module.exports = router;
'use strict';

var express = require('express');
var router = express.Router();
var ctrlAuth = require('../../controllers/authentication.controller.js');

//default route...
router.route('/')
    .post(ctrlAuth.login);

module.exports = router;
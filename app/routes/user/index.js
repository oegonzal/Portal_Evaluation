'use strict';

var express = require('express');
var router = express.Router();

var User = require('../../models/user.model.js');
var userCtrl = require('../../controllers/user.controller.js')(User);

//default route...
router.route('/')
    .get(userCtrl.profileRead);

module.exports = router;
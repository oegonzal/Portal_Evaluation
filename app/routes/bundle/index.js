'use strict';

var express = require('express');
var router = express.Router();

var Bundle = require('../../models/bundle.model.js');
var bundleCtrl = require('../../controllers/bundle.controller.js')(Bundle);

//default route...
router.route('/')
    .get(bundleCtrl.get)
    .post(bundleCtrl.post);

//Middleware... (prevents repeat code)
router.use('/:id', bundleCtrl.findById);

//Evaluation id route...
router.route('/:id')
    .get(bundleCtrl.getById)
    .put(bundleCtrl.putById);

module.exports = router;
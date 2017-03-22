'use strict';

var routerObj = function (db) {
    var express = require('express');
    var router = express.Router();

    var User = require('../../models/user.model.js');
    var Evaluation = require('../../models/evaluation.model.js');
    var evaluationCtrl = require('../../controllers/evaluation.controller.js')(User, Evaluation, db);

    //default route...
    router.route('/')
        .get(evaluationCtrl.get);

    //Middleware... (prevents repeat code)
    router.use('/:id', evaluationCtrl.findById);

    //Evaluation id route...
    router.route('/:id')
        .get(evaluationCtrl.getById)
        .put(evaluationCtrl.putById)
        .delete(evaluationCtrl.deleteById);
    
    return {
        router: router
    };
};


module.exports = routerObj;
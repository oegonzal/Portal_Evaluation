'use strict';

var routerObj = function (db) {
    var express = require('express');
    var router = express.Router();

    var fileCtrl = require('../../controllers/file.controller.js')(db);

    //default route...
    router.route('/')
        .post(fileCtrl.post)
        .get(fileCtrl.get);
    
    return {
        router: router
    };
};

module.exports = routerObj;
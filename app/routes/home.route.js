'use strict';

/*  This module is strictly meant for one route. This route
 *  is responsible for rendering our angular app home page.
 */    
var express = require('express'),
    path = require('path'),
    router = express.Router();

var pathname = path.join(__dirname.replace(/\s+/g, ''), '/../../public/index.html');
/**
 *  GET /
 *  Render out angular app.
 */

//all
router.get('/', function(req, res) {
    res.sendFile(pathname);
});

//user
router.get('/login', function(req, res) {
    res.sendFile(pathname);
});

router.get('/user', function(req, res) {
    res.sendFile(pathname);
});

router.get('/evaluation/:id', function(req, res) {
    res.sendFile(pathname);
});

//admin
router.get('/vendor', function(req, res) {
    res.sendFile(pathname);
});

router.get('/emails', function(req, res) {
    res.sendFile(pathname);
});

router.get('/message/:id', function(req, res) {
    res.sendFile(pathname);
});

router.get('/bundle/:id', function(req, res) {
    res.sendFile(pathname);
});

router.get('/evaluation-report/:id', function(req, res) {
    res.sendFile(pathname);
});

router.get('/full-report/:id', function(req, res) {
    res.sendFile(pathname);
});

router.get('/config/:id', function(req, res) {
    res.sendFile(pathname);
});

router.get('/archive', function(req, res) {
    res.sendFile(pathname);
});

module.exports = router;
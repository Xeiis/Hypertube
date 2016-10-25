var express = require('express');
var router = express.Router();
var index = require('../private/index.js');
var video = require('../private/video.js');
var torrent = require('../private/torrent.js');
var test = require('../private/test.js');

/* GET */

router.get('/', function(req, res) {
    console.log("/");
    index.renderIndex(req, res);
});

router.get('/video', function(req, res){
    console.log('/video');
    video.renderVideo(req, res);
});

router.get('/torrent', function(req, res){
    console.log('/torrent');
    torrent.getTorrent(req, res);
});

router.get('/test', function(req, res) {
    console.log("/test");
    test.renderTest(req, res);
});

module.exports = router;
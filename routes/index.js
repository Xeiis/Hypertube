var express = require('express');
var router = express.Router();
var index = require('../private/index.js');
var video = require('../private/video.js');
var torrent = require('../private/torrent.js');
var test = require('../private/test.js');

/* GET */

router.get('/', function(req, res) {
    index.renderIndex(req, res);
});

router.get('/video', function(req, res){
    video.renderVideo(req, res);
});

router.get('/torrent', function(req, res){
    torrent.getTorrent(req, res);
});

router.get('/test', function(req, res) {
    test.renderTest(req, res);
});

/* POST */

router.get('/Top100PirateBay', function(req, res){
    torrent.Top100PirateBay(req, res);
});

router.get('/recentTorrent', function(req, res){
    torrent.recentTorrent(req, res);
});

router.get('/getCateroy', function(req, res){
    torrent.getCateroy(req, res);
});

module.exports = router;
var express = require('express');
var router = express.Router();
var test = require('../private/test.js');
var index = require('../private/index.js');
var video = require('../private/video.js');
var torrent = require('../private/torrent.js');
var parse_torrent = require('../private/parse_torrent.js');
var bibliotheque = require('../private/bibliotheque.js');
var sign_up = require('../private/sign_up.js');
var sign_in = require('../private/sign_in.js');
var reset_pass = require('../private/reset_pass.js');
var check_user = require('../private/check_user.js');

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

router.get('/bibliotheque', function(req, res){
   bibliotheque.renderBibliotheque(req, res);
});

router.get('/get_list_torrent', function(req, res){
    parse_torrent.parseTorrentYts(req, res);
});

/* POST */
router.post('/check_user', function(req, res){
    check_user.connect(req, res);
});

router.post('/reset_pass', function(req, res){
    reset_pass.connect(req, res);
});

router.post('/load_more_bibliotheque', function(req, res){
    bibliotheque.load_more(req, res);
});

router.post('/sign_in', function(req, res){
    sign_in.connect(req, res);
});
router.post('/sign_in_ft', function(req, res){
    sign_in.ft_connect(req, res);
});
router.post('/sign_in_fb', function(req, res){
    sign_in.fb_connect(req, res);
});
router.post('/sign_up', function(req, res){
    sign_up.inscription(req, res);
});

router.get('/Top100PirateBay', function(req, res){
    torrent.Top100PirateBay(req, res);
});

router.get('/recentTorrent', function(req, res){
    torrent.recentTorrent(req, res);
});

router.get('/getCateroy', function(req, res){
    torrent.getCateroy(req, res);
});

router.post("/download_torrent", function(req, res){
    torrent.downloadTorrent(req, res);
});


module.exports = router;
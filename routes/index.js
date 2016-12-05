/**
 * Created by dchristo on 10/25/16.
 */

var express        = require('express');
var router         = express.Router();
var fs             = require("fs");
var db             = require('../private/dbconn.js');
var index          = require('../private/index.js');
var video          = require('../private/video.js');
var parse_torrent  = require('../private/parse_torrent.js');
var bibliotheque   = require('../private/bibliotheque.js');
var sign_up        = require('../private/sign_up.js');
var sign_in        = require('../private/sign_in.js');
var reset_pass     = require('../private/reset_pass.js');
var check_user     = require('../private/check_user.js');
var no_access      = require('../private/no_access.js');
var logout         = require('../private/logout.js');

var conn = db.connexion();

function get_langue(req, res, callback) {
    var translation = JSON.parse(fs.readFileSync(__dirname + "/../public/translation/translate.json", "UTF-8"));
    translation = translation.Translation;
    if (req.session.login)
    {
        conn.query('select u_lang from users where u_name = ? and u_from = ?', [req.session.login, req.session.from], function(err, rows){
           if (rows[0] && rows[0].u_lang == 'FR')
               callback(req, res, translation.FR, "FR");
           else
               callback(req, res, translation.EN, "EN");
        });
    }
    else if (req.session.langue == "FR") {
        callback(req, res, translation.FR, "FR");
    }
    else
        callback(req, res, translation.EN, "EN");
}

/* GET */

router.get('/null', function(req, res){
    get_langue(req, res, index.renderIndex);
});

router.get('/', function(req, res) {
    get_langue(req, res , index.renderIndex);
});

router.get('/video', function(req, res) {
    get_langue(req, res, video.renderVideo);
});

router.get('/bibliotheque', function(req, res) {
    get_langue(req, res, bibliotheque.renderBibliotheque);
});

router.get('/get_list_torrent', function(req, res) {
    parse_torrent.parseTorrentYts(req, res);
});

router.get('/no_access', function(req, res) {
    no_access.renderNoaccess(req, res);
});
router.get('/sign_in_ft', function(req, res) {
    sign_in.ft_connect(req, res);
});

router.get('/torrent', function(req, res) {
    torrent.delete_old_movies(req, res);
});

/* POST */

router.post('/change_langue', function(req, res){
    get_langue(req, res, check_user.change_langue);
});

router.post('/logout', function(req, res) {
    get_langue(req, res, logout.logout);
});

router.post('/upload_picture', function(req, res){
    get_langue(req, res, check_user.upload_picture);
});

router.post('/update_profile', function(req, res){
    get_langue(req, res, check_user.update_profile);
});

router.post('/get_user_data', function(req, res){
    get_langue(req, res, check_user.get_user_data);
});

router.post('/find_movie', function(req, res) {
    get_langue(req, res, bibliotheque.find_movie);
});

router.post('/check_user', function(req, res) {
    get_langue(req, res, check_user.connect);
});

router.post('/reset_pass', function(req, res) {
    get_langue(req, res, reset_pass.connect);
});

router.post('/sign_in', function(req, res) {
    get_langue(req, res, sign_in.connect);
});

router.post('/sign_up', function(req, res) {
    get_langue(req, res, sign_up.inscription);

});

router.post('/save_comm', function(req, res){
    get_langue(req, res, video.save_comm);
});

router.post('/edit_info', function(req, res) {
    reset_pass.edit_info(req, res);
});

router.post('/load_more_bibliotheque', function(req, res) {
    get_langue(req, res, bibliotheque.load_more);
});

router.post('/find_movie_autocompletion', function(req, res) {
    bibliotheque.find_movie_autocompletion(req, res);
});

router.post('/download_end', function(req, res) {
   video.download_end(req, res);
});
router.post('/is_15pc', function(req, res){
    video.is_15pc(req, res);
});

router.post('/is_15pc', function(req, res){
    video.customstream(req, res);
});

router.post('/video_exist', function(req, res) {
    video.exist(req, res);
});

router.post('/sign_in_fb', function(req, res) {
    get_langue(req, res, sign_in.fb_connect);
});



/**
 * NOT USED
**/

router.get('/test', function(req, res) {
    test.renderTest(req, res);
});

router.get('/torrent', function(req, res) {
    torrent.getTorrent(req, res);
});

router.get('/Top100PirateBay', function(req, res) {
    torrent.Top100PirateBay(req, res);
});

router.get('/recentTorrent', function(req, res) {
    torrent.recentTorrent(req, res);
});

router.get('/getCateroy', function(req, res) {
    torrent.getCateroy(req, res);
});

router.post("/download_torrent", function(req, res) {
    torrent.downloadTorrent(req, res);
});

router.get('/test', function(req, res) {
    test.renderTest(req, res);
});

module.exports = router;
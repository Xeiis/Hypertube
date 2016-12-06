/**
 * Created by dchristo on 10/28/16.
 */

var shortid = require('shortid');
var http = require('http');
var db = require('./dbconn.js');
var glob = require("glob");
var fse = require('fs.extra');
var path = require("path");

/*const OS = require('opensubtitles-api');
 const OpenSubtitles = new OS({
 useragent:'OSTestUserAgentTemp',
 username: 'Hypertube',
 password: 'dotef',
 ssl: true
 });
 */

var conn = db.connexion();

exports.renderVideo = function(req, res, translation, langue) {

    var quality = which_quality(req.query.quality);
    if (req.session.login) {
        /*if (req.query.cle) {
            conn.query('select m.imdb_code, m.background_image_original, t.path, m.summary, m.language, m.m_id, m.trailer from torrent as t left join movies as m on t.id = ' + quality + ' where cle = ?', [req.query.cle], function (err, rows) {
                /*
                OpenSubtitles.search({
                    sublanguageid: ['fre', 'eng'],       // Can be an array.join, 'all', or be omitted.
                    hash: rows[0].hash,   // Size + 64bit checksum of the first and last 64k
                    path: rows[0].path,        // Complete path to the video file, it allows
                    //   to automatically calculate 'hash'.
                    filename: rows[0].path.substring(rows[0].path.lastIndexOf("/" + 1)),        // The video file name. Better if extension
                    extensions: ['srt', 'vtt'], // Accepted extensions, defaults to 'srt'.
                    limit: '3',                 // Can be 'best', 'all' or an
                    // arbitrary nb. Defaults to 'best'
                    imdbid: rows[0].imdb_code   // Text-based query, this is not recommended.
                }).then(subtitles => {

                    // parse le site imdb pour récupérer des infos :
                    // http://www.imdb.com/title/imdb_code
                    // voir au dessus
                    r
                });
                */
                /*conn.query("INSERT INTO seen(u_id, m_id) VALUES(?, ?)", [req.session.user_id, rows[0].m_id], function (err, row) {
                    if (err) throw err;
                });
                var today = new Date();

                conn.query("UPDATE movies as m SET last_view = ? WHERE "+quality+" = (SELECT id FROM torrent where cle = ?)", [today, req.query.cle], function(err, row){
                    if (err) throw err;
                });
                get_movies_details(rows[0].imdb_code, req, res, rows, translation, langue, 1);
            });
        }
        else */if (req.query.id) {
            conn.query('select m.imdb_code, m.background_image_original, t.path, m.summary, m.language, m.m_id, m.trailer, m.id from movies as m left join torrent as t on ' + quality + ' = t.id where m.id = ?', [req.query.id], function (err, rows) {
                conn.query("INSERT INTO seen(u_id, m_id) VALUES(?, ?)", [req.session.user_id, rows[0].m_id], function (err, row) {
                    if (err) throw err;
                });
                var today = new Date();
                conn.query("UPDATE movies SET last_view = ? WHERE id = ?", [today, rows[0].id], function(err, rows){
                    if (err) throw err;
                });
                if (rows[0].trailer !== null)
                    get_movies_details(rows[0].imdb_code, req, res, rows, translation, langue, 2);
                else
                    res.render('video', {res: 'Video not found', translation: translation, langue: langue, quality: quality, id : req.query.id});
            });
        }
    }
    else
        res.render('no_access', {translation: translation, langue: langue});
};

exports.exist = function(req, res) {
    var quality = which_quality(req.body.quality);
    conn.query('select t.path, m.trailer, t.cle from movies as m left join torrent as t on '+quality+' = t.id where m.id = ?',[req.body.id], function (err, rows) {
        if (err) throw err;
        if (rows[0].cle) {
            res.send({cle: rows[0].cle, quality: req.body.quality});
            res.end();
        }
        else if (rows[0].trailer)
        {
            res.send({id: req.body.id, quality: req.body.quality});
            res.end();
        }
        else {
            res.send({res: 'fail'});
            res.end();
        }
    });
};

exports.download_end = function(req, res) {
    var quality = which_quality(req.body.quality);
    conn.query('select t.cle, t.quality, t.download_end from movies as m left join torrent as t on '+quality+' = t.id where m.id = ?', [req.body.id], function (err, rows) {
        if (rows[0].download_end == 1) {
            res.send({res: "yes", cle: rows[0].cle, quality: rows[0].quality});
        }
        else {
            res.send({res: "no"});
        }
    });
};

var escape_space = function(string){
    return (string.replace(" ", "+"));
};

var which_quality = function(input){
    var quality = '';
    if (input == '720p')
        quality = 'm.torrent_720_id';
    else if (input == '1080p')
        quality = 'm.torrent_1080_id';
    else if (input == '3D')
        quality = 'm.torrent_3D_id';
    return quality;
};

exports.is_15pc = function(req, res){
    var quality = which_quality(req.body.quality);
    conn.query("select t.cle, t.quality, t.download_end, t.path from movies as m left join torrent as t on "+quality+" = t.id where m.id = ?", [req.body.id], function(err, rows){
        if (err) throw err;
        if (rows[0].path)
            res.send({res: "yes", cle: rows[0].cle, quality: rows[0].quality});
        else
            res.send("no");
    });

};

var get_comment = function (req, res, rows, translation, langue, m_details, which) {
    var quality = which_quality(req.query.quality);
    var m_cle = req.query.cle;
    if (which == 2)
    {
        conn.query("select c.content, c.u_id, c.m_id, c.time, u.u_name from movies as m left join torrent as t on " + quality + " = t.id left join comm as c on c.m_id = m.id left join users as u on u.u_id = c.u_id where m.id = ?", [req.query.id], function(err, row){
            if (err) throw err;
            if (row[0].content)
                res.render('video', {
                    info: rows[0]/*, subtitles: subtitles*/,
                    trailer: rows[0].trailer,
                    comm: row,
                    login: true,
                    name: req.session.login,
                    translation: translation,
                    langue: langue,
                    details: m_details,
                    quality: quality,
                    id: req.query.id
                });
            else
                res.render('video', {
                    info: rows[0]/*, subtitles: subtitles*/,
                    trailer: rows[0].trailer,
                    login: true,
                    name: req.session.login,
                    translation: translation,
                    langue: langue,
                    details: m_details,
                    quality: quality,
                    id: req.query.id
                });
        });
    }
    else {
        conn.query("SELECT c.content, c.u_id, c.m_id, c.time, u.u_name FROM movies as m left join torrent as t on  " + quality + " = t.id left join comm as c on c.m_id = m.id left join users as u on u.u_id = c.u_id WHERE t.cle = ?", [m_cle], function (err, row) {
            if (err) throw err;
            if (row[0].content)
                res.render('video', {
                    info: rows[0]/*, subtitles: subtitles*/,
                    trailer: rows[0].trailer,
                    comm: row,
                    login: true,
                    name: req.session.login,
                    translation: translation,
                    langue: langue,
                    details: m_details,
                    quality: quality,
                    id: req.query.id
                });
            else
                res.render('video', {
                    info: rows[0]/*, subtitles: subtitles*/,
                    trailer: rows[0].trailer,
                    login: true,
                    name: req.session.login,
                    translation: translation,
                    langue: langue,
                    details: m_details,
                    quality: quality,
                    id: req.query.id
                });
        });
    }
};

exports.save_comm = function (req, res){
        var data = {
            u_id : req.session.user_id,
            m_id : req.body.id,
            content : req.body.content
        };
        conn.query("SELECT u_pic from users where u_id = ?", [req.session.user_id], function(err, row){
            var u_pic = row[0].u_pic;
            conn.query("INSERT INTO comm SET ?", data, function(err, rows){
                if (err) throw err;
                var result = {
                    content : data.content,
                    u_name : req.session.login,
                    time : new Date(),
                    u_pic : u_pic
                };
                res.send(result);
                res.end();
            });
        });
};

var get_movies_details = function(imdbcode, req, res, rows, translation, langue, which) {

    var buff = '';
    http.get('http://www.imdb.com/title/' + imdbcode + '/', function (ress) {
        ress.on('data', function (data) {
            buff += data;
        });
        ress.on('end', function () {
            var end = buff.substring(buff.search("<div class=\"credit_summary_item\">"), buff.search(">See full cast & crew</a>"));
            var director = end.substring(end.search("<h4 class=\"inline\">Director:</h4>"), end.search("</div>"));
            end = end.substring(end.search("<h4 class=\"inline\">Writers:</h4>"));
            var writers = end.substring(end.search("<h4 class=\"inline\">Writers:</h4>"), end.search("</div>"));
            end = end.substring(end.search("<h4 class=\"inline\">Stars:</h4>"));
            var stars = end;
            var reg = /<span class="itemprop" itemprop="name">(.*?)<\/span><\/a>/g;
            var matches = director.match(reg);
            director = clean_match(matches);
            matches = writers.match(reg);
            writers = clean_match(matches);
            matches = stars.match(reg);
            stars = clean_match(matches);
            get_comment(req, res, rows, translation, langue, {director: director, writers : writers, stars : stars}, which);
        });
    });
};


function clean_match(matches){
    var i = 0;
    if (matches) {
        while (matches[i]) {
            matches[i] = matches[i].substring(39, matches[i].length - 13);
            i++;
            if (i > 3)
                break;
        }
    }
    return matches;
}

var remove_old_movies = function(req, res){
    conn.query("SELECT title, torrent_720_id, torrent_1080_id, torrent_3D_id FROM movies WHERE (((last_view) < Now()-30)) AND last_view != 0;", function(err, rows){
        var i = 0;
        while(rows[i]) {
            var filepath = 'public/movie/' + rows[i].title + "*";
            glob(filepath, function (er, files) {
                if (files[0] && !er) {
                    fse.rmrf(files[0], function (err) {
                        if (err) {
                            console.error(err);
                        }
                    });
                }
            });
            conn.query("UPDATE torrent SET path = null, cle=null WHERE id = ? OR id = ? OR id = ?", rows[i].torrent_3D_id, rows[i].torrent_1080_id, rows[i].torrent_720_id, function (er, row) {
                if (err) throw err;
            });
            i++;
        }
    });

};

setTimeout(remove_old_movies, 86400000);

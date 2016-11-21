
var torrentStream = require('torrent-stream');
var shortid = require('shortid');
var http = require('http');
var Throttle = require('throttle');
var db = require('./dbconn.js');
var fs = require("fs");
var glob = require("glob");
var fse = require('fs.extra');

var url = require("url"),
    path = require("path");

exports.customstream = function (req, res) {
    var range = req.headers.range;
    if (!range) {
        // 416 Wrong range
        return res.sendStatus(416);
    }
    var positions = range.replace(/bytes=/, "").split("-");
    var start = parseInt(positions[0], 10);
    var total = stats.size;
    var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
    var chunksize = (end - start) + 1;

    res.writeHead(206, {
        "Content-Range": "bytes " + start + "-" + end + "/" + total,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4"
    });

    var stream = fs.createReadStream(file, { start: start, end: end })
        .on("open", function() {
            stream.pipe(res);
        }).on("error", function(err) {
            res.end(err);
        });
};
/*const OS = require('opensubtitles-api');
 const OpenSubtitles = new OS({
 useragent:'OSTestUserAgentTemp',
 username: 'Hypertube',
 password: 'dotef',
 ssl: true
 });
 */

/*
 var buff = '';
 http.get('http://www.imdb.com/title/tt1703957/', function (ress) {
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
 console.log(director);
 matches = writers.match(reg);
 writers = clean_match(matches);
 console.log(writers);
 matches = stars.match(reg);
 stars = clean_match(matches);
 console.log(stars);
 });
 });
 */
// A utiliser pour récupérer les infos imdb a intégré en dessous

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

var conn = db.connexion();

var magnet = '';
exports.renderVideo = function(req, res)
{
    var quality = which_quality(req.query.quality);
    if (req.session.login) {
        if (req.query.cle) {
            conn.query('select m.background_image_original, t.path, m.summary, m.language from torrent as t left join movies as m on t.id = ' + quality + ' where cle = ?', [req.query.cle], function (err, rows) {
                console.log("le film est deja dans la db" + rows);
                /*OpenSubtitles.search({
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
                 });*/
                conn.query("INSERT INTO seen(u_id, m_id) VALUES(?, ?)", [req.session.user_id, rows[0].id], function (err, rows) {
                    if (err) throw err;
                });
                var today = new Date();

                conn.query("UPDATE movies as m SET last_view = ? WHERE "+quality+" = (SELECT id FROM torrent where cle = ?)", [today, req.query.cle], function(err, row){
                    console.log("test: " + row);
                    if (err) throw err;
                });
                get_comment(req, res, rows);
            });
        }
        else if (req.query.id) {
            conn.query('select * from movies as m left join torrent as t on ' + quality + ' = t.id where m.id = ?', [req.query.id], function (err, rows) {
                conn.query("INSERT INTO seen(u_id, m_id) VALUES(?, ?)", [req.session.user_id, rows[0].id], function (err, rows) {
                    if (err) throw err;
                });
                var today = new Date();
                conn.query("UPDATE movies  SET last_view = ? WHERE id = ?", [today, rows[0].id], function(err, rows){
                    if (err) throw err;
                    console.log("2");

                });
                if (rows[0].trailer !== null) {
                    downloadTorrent(req, res);
                    res.render('video', {trailer: rows[0].trailer, login: true, name: req.session.login});
                }
                else
                    res.render('video', {res: 'Video not found'});
            });
        }
    }
    else
        res.render('no_access');
};

exports.exist = function(req, res) {
    /*if (!req.session.login) {
     res.send({res: 'no acess'});
     }*/

    var quality = which_quality(req.body.quality);
    conn.query('select t.path, m.trailer, t.cle from movies as m left join torrent as t on '+quality+' = t.id where m.id = ?',[req.body.id], function (err, rows) {
        if (err) throw err;
        if (rows[0].cle) {
            console.log("cle:" +rows[0].cle);
            res.send({cle: rows[0].cle, quality: req.body.quality});
            res.end();
        }
        else if (rows[0].trailer)
        {
            console.log("trailer: " +rows[0].trailer);
            res.send({id: req.body.id, quality: req.body.quality});
            res.end();
        }
        else {
            console.log(rows[0]);
            res.send({res: 'fail'});
            res.end();
        }
    });
};

var downloadTorrent = function(req, res) {
    console.log("downloading the torrent");
    var quality = which_quality(req.query.quality);
    conn.query('select * from movies as m left join torrent as t on '+quality+' = t.id where m.id = ?', [req.query.id], function (err, rows) {
        if (err) throw err;
        magnet = "magnet:?xt=urn:btih:" + rows[0].hash + "&dn=" + escape_space(rows[0].title) + "&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fzer0day.ch%3A1337&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969";
        console.log(quality, req.query.id);
        download(rows);
    });
    var download = function(rows) {
        conn.query('UPDATE torrent SET download_end = ? WHERE id = ?', [false, rows[0].id]);
        var i = 0;
        var verified = 0;
        var engine = torrentStream(magnet, {path: 'public/movie/'});
        engine.on('ready', function () {
            engine.files.forEach(function (file) {
                /*
                 if (i == 0) {
                 var cle_create = shortid.generate();
                 conn.query('UPDATE torrent SET path = ?, cle = ? WHERE id = ?', [file.path, cle_create, rows[0].id]);
                 i++;
                 }
                 console.log(file.name.match(/.*(\..+?)$/));
                 var extension = file.name.match(/.*(\..+?)$/);
                 if (extension !== null && extension.length === 2) {
                 console.log('Downloading item');
                 file.select(); // downloads without attaching filestream
                 engine.on('idle', function(){
                 console.log("le telechargement est fini");
                 // on pourra aussi vérifier l'extension du fichier pour le convertir.
                 conn.query('UPDATE torrent SET download_end = ? WHERE id = ?', [true, rows[0].id]);
                 });
                 }
                 else {
                 console.log('Skipping item');
                 }
                 // var stream = file.createReadStream();
                 // stream is readable stream to containing the file content
                 */
                console.log('filename:', file.name);
                if (file.name.substr(file.name.length - 3) == 'mkv' || file.name.substr(file.name.length - 3) == 'mp4') {
                    var stream = file.createReadStream({flags: "r", start: 0, end: file.length - 1});
                    engine.on('download', function(){
                        // stream = stream.pipe(new Throttle(100 * 1024)); //
                        // stream.pipe(res); //
                        console.log(engine.swarm.downloaded / file.length * 100 + "%");
                        if (parseInt(engine.swarm.downloaded / file.length * 100) >= 2 && i == 0) {
                            i++;
                            var cle_create = shortid.generate();
                            conn.query('UPDATE torrent SET path = ?, cle = ? WHERE id = ?', [file.path, cle_create, rows[0].id]);
                            console.log("video?cle="+cle_create+"&quality="+req.query.quality);

                        }
                    });
                    engine.on('idle', function () {
                        console.log("le telechargement est fini");
                    });
                }
                else {
                    console.log('error file.name : '+file.name);
                }
            });
        });
    }
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

var get_comment = function (req, res, rows) {
    var quality = which_quality(req.query.quality);
    var m_cle = req.query.cle;
    conn.query("SELECT c.content, c.u_id, c.m_id, c.time, u.u_name FROM movies as m left join torrent as t on  "+quality+" = t.id left join comm as c on c.m_id = m.id left join users as u on u.u_id = c.u_id WHERE t.cle = ?", [m_cle], function(err, row){
        if (err) throw err;
        if (row[0].content)
            res.render('video', {bk: rows[0].background_image_original, path: rows[0].path, summary: rows[0].summary, language: rows[0].language/*, subtitles: subtitles*/, comm : row, login: true, name: req.session.login});
        else
            res.render('video', {bk: rows[0].background_image_original, path: rows[0].path, summary: rows[0].summary, language: rows[0].language/*, subtitles: subtitles*/, login: true, name: req.session.login});
        });
};

exports.save_comm = function (req, res){
    var quality = which_quality(req.body.quality);
    conn.query("SELECT m.id from movies as m left join torrent as t on t.id = "+quality+" where t.cle = ?", [req.body.cle], function(err, rows){
        if (err) throw err;

        var data = {
            u_id : req.session.user_id,
            m_id : rows[0].id,
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
                res.end;
            });
        });
    });
};

var remove_old_movies = function(req, res){
    conn.query("SELECT title FROM movies WHERE (((last_view) < Now()-30)) AND last_view != 0;", function(err, rows){
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
            i++;
        }
    });
};

setTimeout(remove_old_movies, 2592000);
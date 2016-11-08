var torrentStream = require('torrent-stream');
var shortid = require('shortid');
var http = require('http');
var db = require('./dbconn.js');
const OS = require('opensubtitles-api');
const OpenSubtitles = new OS({
    useragent:'OSTestUserAgentTemp',
    username: 'Hypertube',
    password: 'dotef',
    ssl: true
});

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
    if (req.query.cle) {
        conn.query('select m.background_image_original, t.path, m.summary, m.language from torrent as t left join movies as m on t.id = '+quality+' where cle = ?', [req.query.cle], function (err, rows) {
            console.log(rows);
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
                    // $(".plot_summary").text(); avec un petit parse ça devrais le faire
                    res.render('video', {bk: rows[0].background_image_original, path: rows[0].path, summary: rows[0].summary, language: rows[0].language, subtitles: subtitles});
            });
        });
    }
    else if (req.query.id) {
        conn.query('select * from movies as m left join torrent as t on '+quality+' = t.id where m.id = ?',[req.query.id], function (err, rows) {
            if (rows[0].trailer !== null) {
                downloadTorrent(req);
                res.render('video', {trailer: rows[0].trailer})
            }
            else
                res.render('video', {res: 'Video not found'});
        });
    }
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

var downloadTorrent = function(req) {
    console.log("downloading the torrent");
    var quality = which_quality(req.query.quality);
    conn.query('select * from movies as m left join torrent as t on '+quality+' = t.id where m.id = ?', [req.query.id], function (err, rows) {
        if (err) throw err;
        magnet = "magnet:?xt=urn:btih:" + rows[0].hash + "&dn=" + escape_space(rows[0].title) + "&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fzer0day.ch%3A1337&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969";
        download(rows);
    });
    var download = function(rows) {
        conn.query('UPDATE torrent SET download_end = ? WHERE id = ?', [false, rows[0].id]);
        var i = 0;
        var engine = torrentStream(magnet, {path: 'public/movie/'});
        engine.on('ready', function () {
            engine.files.forEach(function (file) {
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
        else
        {
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


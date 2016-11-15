var fs = require('fs');
var db = require('./dbconn.js');
var conn = db.connexion();
var torrentStream = require('torrent-stream');
var path = require("path");
var Throttle = require('throttle');

exports.renderTest = function(req, res) {
    var quality = which_quality(req.query.quality);
    conn.query('select * from movies as m left join torrent as t on '+quality+' = t.id where m.id = ?', [req.query.id], function (err, rows) {
        if (err) throw err;
        magnet = "magnet:?xt=urn:btih:" + rows[0].hash + "&dn=" + escape_space(rows[0].title) + "&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fzer0day.ch%3A1337&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969";
        console.log(quality, req.query.id);
        console.log('toi');
        download(rows);
    });
    var download = function(rows) {
        conn.query('UPDATE torrent SET download_end = ? WHERE id = ?', [false, rows[0].id]);
        var i = 0;
        var verified = 0;
        var engine = torrentStream(magnet, {path: 'public/movie/'});
        engine.on('ready', function () {
            engine.files.forEach(function (file) {
                if (file.name.substr(file.name.length - 3) == 'mkv' || file.name.substr(file.name.length - 3) == 'mp4') {
                    var header_range = req.headers.range;
                    var info = {};
                    if(header_range && (range = header_range.match(/bytes=(.+)-(.+)?/)) !== null) {
                        info.start = isNumber(range[1]) && range[1] >= 0 && range[1] < info.end ? range[1] - 0 : info.start;
                        info.end = isNumber(range[2]) && range[2] > info.start && range[2] <= info.end ? range[2] - 0 : info.end;
                        info.range = true
                    }
                    else if (req.query.start || req.query.end) {
                        // This is a range request, but doesn't get range headers. So there.
                        info.start = isNumber(req.query.start) && req.query.start >= 0 && req.query.start < info.end ? req.query.start - 0 : info.start;
                        info.end = isNumber(req.query.end) && req.query.end > info.start && req.query.end <= info.end ? req.query.end - 0 : info.end;
                    }
                    info.length = info.end - info.start + 1;
                    info.size = file.length;
                    info.file = file.filename;
                    info.mime = 'video/mp4'; // a voir plus tard, pour l'instant ça marche là plupart du temps.
                    console.info("header info : "+info);
                    downloadHeader(res, info);
                    var file_path = '/Users/dchristo/http/MyWebSite/Hypertube/public/movie/'+file.path;
                    try {
                        var stream = fs.createReadStream(file_path, {start: info.start, end: info.end});
                        stream = stream.pipe(new Throttle(10000 * 1024));
                        console.log('piping stream');
                        stream.pipe(res);
                        console.log('stream piped');
                    }
                    catch(exception) {
                        console.log('Error: '.red, exception);
                    }
                }
            });
        });
    }
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

var escape_space = function(string){
    return (string.replace(" ", "%20"));
};

var isNumber = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

var downloadHeader = function(res, info) {
    var code = 200;
    var header;

    header = {
        "Cache-Control": "public; max-age=" + 3600,
        Connection: "keep-alive",
        "Content-Type": info.mime,
        "Content-Disposition": "inline; filename=" + info.file + ";",
        "Accept-Ranges": "bytes"
    };
    // si il y a une range
    if (info.range) {
        // Partial http response
        code = 206;
        header.Status = "206 Partial Content";
        header["Content-Range"] = "bytes " + info.start + "-" + info.end + "/" + info.size;
    }

    header.Pragma = "public";
    header["Content-Transfer-Encoding"] = "binary";
    header["Content-Length"] = info.length;
    header.Server = 'Hypertube/1.0.0';

    res.writeHead(code, header);
};
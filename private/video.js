var torrentStream = require('torrent-stream');
var shortid = require('shortid');
var db = require('./dbconn.js');
var conn = db.connexion();

var magnet = '';
exports.renderVideo = function(req, res)
{
    var sql = '';
    if (req.query.quality == '720p')
        sql = 'select * from movies as m left join torrent as t on m.torrent_720_id = t.id where m.id = ' + req.query.id;
    else if (req.query.quality == '1080p')
        sql = 'select * from movies as m left join torrent as t on m.torrent_1080_id = t.id where m.id = ' + req.query.id;
    else if (req.query.quality == '3D')
        sql = 'select * from movies as m left join torrent as t on m.torrent_3D_id = t.id where m.id = ' + req.query.id;
    conn.query(sql, function (err, rows) {
        if (err) throw err;
        //console.log(rows);
        /*if (!req.session.login)
        {
            res.render('no access');
        }
        else*/ if (rows[0].path !== null)
        {
            res.render('video', {bk: rows[0].background_image_original, path: rows[0].path})
        }
        else if (rows[0].trailer !== null)
        {
            downloadTorrent(sql);
            res.render('video', {trailer: rows[0].trailer})
        }
        else
            res.render('video_not_found');
    });
};

var downloadTorrent = function(sql) {
    console.log("downloading the torrent");
    conn.query(sql, function (err, rows) {
        if (err) throw err;
        //console.log(rows);
        magnet = "magnet:?xt=urn:btih:" + rows[0].hash + "&dn=" + escape_space(rows[0].title) + "&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fzer0day.ch%3A1337&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969";
        download(rows);
    });
    var download = function(rows) {
        console.log("download");
        var i = 0;
        var engine = torrentStream(magnet, {path: 'public/movie/'});
        engine.on('ready', function () {
            engine.files.forEach(function (file) {
                if (i == 0) {
                    var cle_create = shortid.generate();
                    console.log('filename:', file.path);
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

var escape_space = function(string){
    return (string.replace(" ", "+"));
};
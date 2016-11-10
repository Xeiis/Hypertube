const PirateBay = require('thepiratebay');

/*

exports.downloadTorrent = function(req, res) {
    console.log("in");
    var sql = '';
    if (req.body.quality == '720p')
        sql = 'select * from movies as m left join torrent as t on m.torrent_720_id = t.id where m.id = ' + req.body.id;
    else if (req.body.quality == '1080p')
        sql = 'select * from movies as m left join torrent as t on m.torrent_1080_id = t.id where m.id = ' + req.body.id;
    else if (req.body.quality == '3D')
        sql = 'select * from movies as m left join torrent as t on m.torrent_3D_id = t.id where m.id = ' + req.body.id;
    conn.query(sql, function (err, rows) {
        if (err) throw err;
        //console.log(rows);
        if (rows[0].path !== null)
        {
            console.log("redirect");
            res.send('http://localhost:3000/video?clef='+rows[0].cle);
            res.end();
        }
        else {
            magnet = "magnet:?xt=urn:btih:" + rows[0].hash + "&dn=" + escape_space(rows[0].title) + "&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fzer0day.ch%3A1337&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969";
            download(rows);
        }
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
                    res.send("http://localhost:3000/video?clef="+cle_create);
                    res.end();
                } else {
                    console.log('Skipping item');
                }
                // var stream = file.createReadStream();
                // stream is readable stream to containing the file content
            });
        });
    }
};
*/

/*
 pirate bay
 $("#searchResult tbody tr").map(function(index, torrent) {
 $(torrent).attr('id');
 var elem = $(torrent);
 console.log(elem.find('a[title="Download this torrent using magnet"]').attr('href'));
 });
 */

exports.getTorrentPirateBay = function(req, res) {
    PirateBay.search('Game of Thrones', {
        category: 'video',  // default - 'all' | 'all', 'audio', 'video', 'xxx',
                            //                   'applications', 'games', 'other'
                            //
                            // You can also use the category number:
                            // `/search/0/99/{category_number}`
        filter: {
            verified: false    // default - false | Filter all VIP or trusted torrents
        },
        page: 0,            // default - 0 - 99
        orderBy: 'date', // default - name, date, size, seeds, leeches
        sortBy: 'desc'      // default - desc, asc
    })
    .then(results => {
        console.log(results)
    })
    .catch(err => {
        console.log(err)
    })
};

exports.Top100PirateBay = function(req, res) {
    PirateBay.topTorrents(/*category*/)
    .then(results => {
        console.log(results)
    })
    .catch(err => {
        console.log(err)
    })
    res.end();
};
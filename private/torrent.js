const PirateBay = require('thepiratebay');
var torrentz = require('node-torrentz');
var Client = require('node-torrent');
var torrentStream = require('torrent-stream');
var shortid = require('shortid');
/*
 pirate bay
 $("#searchResult tbody tr").map(function(index, torrent) {
$(torrent).attr('id');
var elem = $(torrent);
console.log(elem.find('a[title="Download this torrent using magnet"]').attr('href'));
});
*/
var magnet = '';

exports.downloadTorrent = function(req, res) {
    var sql = '';
    if (req.body.quality == '720p')
        sql = 'select * from movies as m where m.id = ' + req.body.id + ' left join torrent as t on m.torrent_720_id = t.id';
    else if (req.body.quality == '1080p')
        sql = 'select * from movies as m where m.id = ' + req.body.id + ' left join torrent as t on m.torrent_1080_id = t.id';
    else if (req.body.quality == '3D')
        sql = 'select * from movies as m where m.id = ' + req.body.id + ' left join torrent as t on m.torrent_3D_id = t.id';
    conn.query(sql, function (err, rows) {
        if (err) throw err;
        if (rows.path !== null)
        {
            res.redirect('localhost:3000/video?clef='+rows.cle);
        }
        else {
            magnet = "magnet:?xt=urn:btih:" + rows.hash + "&dn=" + escape_space(rows.title) + "&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fzer0day.ch%3A1337&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969";
            download(rows);
        }
    });
    var download = function(rows) {
        var engine = torrentStream(magnet, {path: 'public/movie/'});
        engine.on('ready', function () {
            engine.files.forEach(function (file) {
                var cle_create = shortid.generate();
                connection.query('UPDATE torrent SET path = :path, cle = :clef WHERE id = :id', {id: rows.id, path: filename, clef: cle_create});
                console.log('filename:', file.name);
                console.log(file.name.match(/.*(\..+?)$/));
                var extension = file.name.match(/.*(\..+?)$/);
                if (extension !== null && extension.length === 2) {
                    console.log('Downloading item');
                    file.select(); // downloads without attaching filestream
                } else {
                    console.log('Skipping item');
                }
                // var stream = file.createReadStream();
                // stream is readable stream to containing the file content
            });
        });
    }
};

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


exports.recentTorrent = function(req, res) {
    PirateBay.recentTorrents()
    .then(results => {
        console.log(results)
    })
    .catch(err => {
        console.log(err)
    })
    res.end();
};

exports.getCateroy = function (req, res){
    PirateBay.getCategories()
    .then(results => {
        console.info(results);
        res.send(results);
        res.end();
    })
    .catch(err => {
        console.log(err);
        res.end();
    })

};

exports.getTorrentz = function (req, res){
    /*
    {
        pagecount: 200,
            page: 1,
            torrents: [
            { title: 'Linux',
                categories: [ 'applications', 'linux' ]
                hash: '...',
                date: Date Object,
                size: '700 MB',
                seeds: 100,
                peers: 99
            },
            ....
        ]
    }
        */
    torrentz.search('Game of Thrones')
        .then(function(results) {
            for(var i in results.torrents) {
                console.log(results.torrents[i].title);
            }
        })
        .catch(console.error);
};

exports.getMoreDetailFromTorrent = function(req, res) {
    /*
     {
         sources: [
             {
                 link: 'http://...',
                 title: '1337x.to'
             },
             ...
          ],
          trackers: [
              {
                  tracker: 'udp://.../announce',
                  seeds: 12,
                  peers: 0,
                  last_scrape: Date Object
              },
              ...
          ],
          files: [
             {
                  filename: 'Cover.jpg',
                  size: '1 MB'
             },
             {
                  folder: 'doc',
                  files: [
                    {
                         filename: 'manual.html',
                        size: '1 KB'
                    },
                    ...
                  ]
             },
             ...
         ]
     }
     */

    torrentz.detailed('info_hash...') // hash
        .then(function(info) {
            console.log(info.trackers);
            console.log(info.sources);
            console.log(info.files);
        })
        .catch(console.error);
};

var escape_space = function(string){
    return (string.replace(" ", "+"));
};

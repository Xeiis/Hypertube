const PirateBay = require('thepiratebay');
var torrentz = require('node-torrentz');
var Client = require('node-torrent');

exports.downloadTorrent = function(req, res) {
    var client = new Client({logLevel: 'DEBUG'});
    var torrent = client.addTorrent('https:\/\/yts.ag\/torrent\/download\/BDC7DD18E04DC2DDC48C63742AFAF83942B7FA26.torrent');
    // when the torrent completes, move it's files to another area
    torrent.on('complete', function() {
        console.log('complete!');
        torrent.files.forEach(function(file) {
            var newPath = '/movie/torrent/' + file.path;
            fs.rename(file.path, newPath);
            // while still seeding need to make sure file.path points to the right place
            file.path = newPath;
            res.end();
        });
    });
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
        console.info(results)
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

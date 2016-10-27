/**
 * Created by dchristo on 10/26/16.
 */
var https       = require('https');
var fs          = require('fs');
var util        = require('util');
var buff        = '';

exports.parseTorrentYts = function(req, res) {
    var getData = function(i) {
        https.get('https://yts.ag/api/v2/list_movies.json?limit=50&page=' + i, function (ress) {
            ress.on('data', function (data) {
                buff += data;
            });
            ress.on('end', function () {
                var copy = JSON.parse(buff.toString('UTF-8'));
                console.log(copy);
                var j = 0;
                while (copy.movies[j])
                {
                    var torrent_3D;
                    var torrent_720;
                    var torrent_1080;
                    if (copy.movies[j].torrent[0].quality == "3D") {
                        torrent_3D = {
                            torrents_url:          copy.movies[j].torrent[0].torrents_url,
                            hash:                  copy.movies[j].torrent[0].hash,
                            quality:               copy.movies[j].torrent[0].quality,
                            seeds:                 copy.movies[j].torrent[0].seeds,
                            peers:                 copy.movies[j].torrent[0].peers,
                            size:                  copy.movies[j].torrent[0].size,
                            date_uploaded:         copy.movies[j].torrent[0].date_uploaded
                        };
                        torrent_720 = {
                            torrents_url:          copy.movies[j].torrent[1].torrents_url,
                            hash:                  copy.movies[j].torrent[1].hash,
                            quality:               copy.movies[j].torrent[1].quality,
                            seeds:                 copy.movies[j].torrent[1].seeds,
                            peers:                 copy.movies[j].torrent[1].peers,
                            size:                  copy.movies[j].torrent[1].size,
                            date_uploaded:         copy.movies[j].torrent[1].date_uploaded
                        };
                        torrent_1080 = {
                            torrents_url:          copy.movies[j].torrent[2].torrents_url,
                            hash:                  copy.movies[j].torrent[2].hash,
                            quality:               copy.movies[j].torrent[2].quality,
                            seeds:                 copy.movies[j].torrent[2].seeds,
                            peers:                 copy.movies[j].torrent[2].peers,
                            size:                  copy.movies[j].torrent[2].size,
                            date_uploaded:         copy.movies[j].torrent[2].date_uploaded
                        };
                    }
                    if (copy.movies[j].torrent[0].quality == "720p") {
                        torrent_720 = {
                            torrents_url:          copy.movies[j].torrent[0].torrents_url,
                            hash:                  copy.movies[j].torrent[0].hash,
                            quality:               copy.movies[j].torrent[0].quality,
                            seeds:                 copy.movies[j].torrent[0].seeds,
                            peers:                 copy.movies[j].torrent[0].peers,
                            size:                  copy.movies[j].torrent[0].size,
                            date_uploaded:         copy.movies[j].torrent[0].date_uploaded
                        };
                        torrent_1080 = {
                            torrents_url:          copy.movies[j].torrent[1].torrents_url,
                            hash:                  copy.movies[j].torrent[1].hash,
                            quality:               copy.movies[j].torrent[1].quality,
                            seeds:                 copy.movies[j].torrent[1].seeds,
                            peers:                 copy.movies[j].torrent[1].peers,
                            size:                  copy.movies[j].torrent[1].size,
                            date_uploaded:         copy.movies[j].torrent[1].date_uploaded
                        };
                    }
                    if (torrent_3D)
                    {
                        var torrent_3D_id = '';
                        con.query('INSERT INTO torrent SET ?', torrent_3D, function(err,resss){
                            if(err) throw err;
                            torrent_3D_id = resss.insertId;
                        });
                    }
                    var torrent_720_id = '';
                    var torrent_1080_id = '';
                    con.query('INSERT INTO torrent SET ?', torrent_720, function(err,resss){
                        if(err) throw err;
                        torrent_720_id = resss.insertId;
                    });
                    con.query('INSERT INTO torrent SET ?', torrent_1080, function(err,resss){
                        if(err) throw err;
                        torrent_1080_id = resss.insertId;
                    });
                    var movies = {
                        url:                        copy.movies[j].url,
                        imdb_code:                  copy.movies[j].imdb_code,
                        title:                      copy.movies[j].title,
                        year:                       copy.movies[j].year,
                        rating:                     copy.movies[j].rating,
                        summary:                    copy.movies[j].summary,
                        language:                   copy.movies[j].language,
                        mpa_rating:                 copy.movies[j].mpa_rating,
                        background_image:           copy.movies[j].background_image,
                        background_image_original:  copy.movies[j].background_image_original,
                        medium_cover_image:         copy.movies[j].medium_cover_image,
                        torrent_3D_id:              torrent_3D_id || '',
                        torrent_720_id:             torrent_720_id,
                        torrent_1080_id:            torrent_1080_id
                    };
                    con.query('INSERT INTO movies SET ?', movies, function(err){
                        if(err) throw err;
                        buff = '';
                        if (i != 118) {
                            getData(i + 1);
                        }
                        else {
                            res.send('done');
                            res.end();
                        }
                    });
                }
                
            });
            ress.on('error', function (e) {
                console.log(e);
            });
        });
    };
    getData(1);

};


// enregistrer dans la db copy contient toute la page en json il n'y a plus qu'a récupérer les infos dans copy.movies[j].id/url/idmb_code etc..
/*
 example
 {
 "id":6147,
 "url":"https:\/\/yts.ag\/movie\/lost-wilderness-2015",
 "imdb_code":"tt3803664",
 "title":"Lost Wilderness",
 "title_english":"Lost Wilderness",
 "title_long":"Lost Wilderness (2015)",
 "slug":"lost-wilderness-2015",
 "year":2015,
 "rating":3.8,
 "runtime":101,
 "genres":[
 "Family"
 ],
 "summary":"Four would-be siblings on an outdoor vacation are encouraged to bond by their parents. The four adventurers journey out of bounds into the wild on their ATV's in search of a family relic. They soon find themselves lost in the woods and ill equipped to deal with not only the rugged terrain but each other. This is a story of hope and overcoming, full of humor and fun. Its a coming of age tale not only for kids but for parents as well.",
 "description_full":"Four would-be siblings on an outdoor vacation are encouraged to bond by their parents. The four adventurers journey out of bounds into the wild on their ATV's in search of a family relic. They soon find themselves lost in the woods and ill equipped to deal with not only the rugged terrain but each other. This is a story of hope and overcoming, full of humor and fun. Its a coming of age tale not only for kids but for parents as well.",
 "synopsis":"Four would-be siblings on an outdoor vacation are encouraged to bond by their parents. The four adventurers journey out of bounds into the wild on their ATV's in search of a family relic. They soon find themselves lost in the woods and ill equipped to deal with not only the rugged terrain but each other. This is a story of hope and overcoming, full of humor and fun. Its a coming of age tale not only for kids but for parents as well.",
 "yt_trailer_code":"I0qDA6O2BVg", https://www.youtube.com/watch?v= yt_trailer_code
 "language":"English",
 "mpa_rating":"NR",
 "background_image":"https:\/\/yts.ag\/assets\/images\/movies\/lost_wilderness_2015\/background.jpg",
 "background_image_original":"https:\/\/yts.ag\/assets\/images\/movies\/lost_wilderness_2015\/background.jpg",
 "small_cover_image":"https:\/\/yts.ag\/assets\/images\/movies\/lost_wilderness_2015\/small-cover.jpg",
 "medium_cover_image":"https:\/\/yts.ag\/assets\/images\/movies\/lost_wilderness_2015\/medium-cover.jpg",
 "large_cover_image":"https:\/\/yts.ag\/assets\/images\/movies\/lost_wilderness_2015\/large-cover.jpg",
 "state":"ok",
 "torrents":[
 {
 "url":"https:\/\/yts.ag\/torrent\/download\/56DFB8D531C7DC04CCCFADE877B859534B03B08E.torrent",
 "hash":"56DFB8D531C7DC04CCCFADE877B859534B03B08E",
 "quality":"720p",
 "seeds":700,
 "peers":239,
 "size":"756.51 MB",
 "size_bytes":793258230,
 "date_uploaded":"2016-10-23 13:34:28",
 "date_uploaded_unix":1477244068
 },
 {
 "url":"https:\/\/yts.ag\/torrent\/download\/DE594C77BA54C03CB946340D59F13937784261E4.torrent",
 "hash":"DE594C77BA54C03CB946340D59F13937784261E4",
 "quality":"1080p",
 "seeds":529,
 "peers":156,
 "size":"1.55 GB",
 "size_bytes":1664299827,
 "date_uploaded":"2016-10-23 16:39:42",
 "date_uploaded_unix":1477255182
 }
 ],
 "date_uploaded":"2016-10-23 13:34:28",
 "date_uploaded_unix":1477244068
 },

 */
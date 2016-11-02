var db = require('./dbconn.js');
// connexion a la db
var conn = db.connexion();

exports.renderBibliotheque = function(req, res)
{
/*
    if (req.session.login)
    {
*/
    conn.query('select m.title, m.year, m.rating, m.medium_cover_image, m.id from movies as m left join torrent as t on m.torrent_720_id = t.id left join torrent as t2 on m.torrent_1080_id = t2.id order by m.rating desc ,t2.seeds desc ,t.seeds desc limit 0, 21', function(err, rows, fields) {
        if (err) throw err;
        res.render('bibliotheque', {data : rows});
        /*for (var i in rows) {
            console.log('Post Titles: ', rows[i].post_title);*/
    });
/*
    }
    else
        res.render('no_acess');
*/
};

exports.load_more = function(req, res){
    console.log(req.body.result);
    conn.query('select m.title, m.year, m.rating, m.medium_cover_image, m.id from movies as m left join torrent as t on m.torrent_720_id = t.id left join torrent as t2 on m.torrent_1080_id = t2.id order by m.rating desc ,t2.seeds desc ,t.seeds desc limit '+req.body.result+', 21', function(err, rows, fields) {
        if (err) throw err;
        //console.log(rows);
        res.send(rows);
        res.end();
        /*for (var i in rows) {
         console.log('Post Titles: ', rows[i].post_title);*/
    });

};
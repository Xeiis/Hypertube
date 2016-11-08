var db = require('./dbconn.js');
// connexion a la db
var conn = db.connexion();



exports.renderBibliotheque = function(req, res)
{
    if (req.session.login) {
        conn.query('select m.title, m.year, m.rating, m.medium_cover_image, m.id,\ ' +
            'CASE WHEN s.u_id is not null\ ' +
            'THEN \'Visionné\' \ ' +
            'END as vision\ ' +
            'from movies as m\ ' +
            'left join torrent as t on m.torrent_720_id = t.id\ ' +
            'left join torrent as t2 on m.torrent_1080_id = t2.id\ ' +
            'left join seen as s on m.m_id = s.m_id and s.u_id = ?\ ' +
            'order by m.rating desc ,t2.seeds desc ,t.seeds desc limit 0, 21', [req.session.id], function (err, rows, fields) {
            if (err) throw err;
            res.render('bibliotheque', {data: rows});
        });
    }
    else
        res.render('no_access');
};

exports.load_more = function(req, res){
    conn.query('select m.title, m.year, m.rating, m.medium_cover_image, m.id,\ ' +
        'CASE WHEN s.u_id is not null\ ' +
        'THEN \'Visionné\' \ ' +
        'END as vision\ ' +
        'from movies as m\ ' +
        'left join torrent as t on m.torrent_720_id = t.id\ ' +
        'left join torrent as t2 on m.torrent_1080_id = t2.id\ ' +
        'left join seen as s on m.m_id = s.m_id and s.u_id = ?\ ' +
        'order by m.rating desc ,t2.seeds desc ,t.seeds desc limit '+req.body.result+', 21', [req.session.id], function(err, rows, fields) {
        if (err) throw err;
        res.send(rows);
        res.end();
    });
};
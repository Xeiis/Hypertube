var db = require('./dbconn.js');
var conn = db.connexion();

exports.renderBibliotheque = function(req, res, translation, langue)
{
    if (req.session.login) {
        conn.query('select distinct m.title, m.year, m.rating, m.medium_cover_image, m.id, m.torrent_720_id, m.torrent_1080_id, m.torrent_3D_id, \ ' +
            'CASE WHEN s.u_id is not null\ ' +
            'THEN \'Visionné\' \ ' +
            'END as vision\ ' +
            'from movies as m\ ' +
            'left join torrent as t on m.torrent_720_id = t.id\ ' +
            'left join torrent as t2 on m.torrent_1080_id = t2.id\ ' +
            'left join seen as s on m.id = s.m_id and s.u_id = ?\ ' +
            'order by m.rating desc ,t2.seeds desc ,t.seeds desc limit 0, 21', [req.session.user_id], function (err, rows, fields) {
            if (err) throw err;
            res.render('bibliotheque', {data: rows, login: true, name: req.session.login, translation: translation, langue: langue});
        });
    }
    else
        res.render('no_access',{translation: translation, langue: langue});
};

exports.load_more = function(req, res) {

    var sql = 'select distinct m.title, m.year, m.rating, m.medium_cover_image, m.id, m.torrent_720_id, m.torrent_1080_id, m.torrent_3D_id, ';
    sql += ' CASE WHEN s.u_id is not null';
    sql +=' THEN \'Visionné\'';
    sql +=' END as vision';
    sql +=' from movies as m';
    sql +=' left join torrent as t on m.torrent_720_id = t.id';
    sql +=' left join torrent as t2 on m.torrent_1080_id = t2.id';
    sql +=' left join seen as s on m.id = s.m_id and s.u_id = ' + conn.escape(req.session.user_id);
    sql +=' where 1 = 1';
    if (req.body.search)
        sql += ' and m.title like ' + conn.escape('%'+req.body.search+'%');
    if (req.body.year_min)
        sql += ' and m.year >= ' + conn.escape(req.body.year_min) + ' and m.year <= ' + conn.escape(req.body.year_max);
    if (req.body.note_min)
        sql += ' and m.rating >= ' + conn.escape(req.body.note_min) + ' and m.rating <= ' + conn.escape(req.body.note_max);
    if (req.body.order == 'note')
        sql += ' order by m.rating desc';
    else if (req.body.order == 'year')
        sql += ' order by m.year desc';
    else if (req.body.order == 'name')
        sql += ' order by m.title';
    else if (req.body.search || req.body.year_min || req.body.note_min)
        sql += ' order by m.title';
    else
        sql +=' order by m.rating desc ,t2.seeds desc ,t.seeds desc';
    sql += ' limit '+req.body.result+', 21';
    console.log(sql);
    conn.query(sql, function(err, rows, fields) {
        if (err) throw err;
        res.send(rows);
        res.end();
    });
};

exports.find_movie_autocompletion = function(req, res){
    conn.query('select m.title, m.year, m.medium_cover_image from movies as m where m.title like '+ conn.escape('%'+req.body.search+'%'), function(err, rows, fields){
      if (err) throw err;
      res.send({content: rows});
      res.end();
    })
};

exports.find_movie = function(req, res, translation, langue){
    var sql = 'select distinct m.title, m.year, m.rating, m.medium_cover_image, m.id, m.id, m.torrent_720_id, m.torrent_1080_id, m.torrent_3D_id,';
    sql += ' CASE WHEN s.u_id is not null';
    sql +=' THEN \'Visionné\'';
    sql +=' END as vision';
    sql +=' from movies as m';
    sql +=' left join torrent as t on m.torrent_720_id = t.id';
    sql +=' left join torrent as t2 on m.torrent_1080_id = t2.id';
    sql +=' left join seen as s on m.id = s.m_id and s.u_id = ' + conn.escape(req.session.user_id);
    sql +=' where 1 = 1';
    if (req.body.search)
        sql += ' and m.title like ' + conn.escape('%'+req.body.search+'%');
    if (req.body.year_min)
        sql += ' and m.year >= ' + conn.escape(req.body.year_min) + ' and m.year <= ' + conn.escape(req.body.year_max);
    if (req.body.note_min)
        sql += ' and m.rating >= ' + conn.escape(parseInt(req.body.note_min)) + ' and m.rating <= ' + conn.escape(parseInt(req.body.note_max));
    if (req.body.order == 'note')
        sql += ' order by m.rating desc';
    else if (req.body.order == 'year')
        sql += ' order by m.year desc';
    else if (req.body.order == 'name')
        sql += ' order by m.title';
    else
        sql += ' order by m.title';
    sql += ' limit 0, 21';
    conn.query(sql, function(err, rows, fields){
        if (err) throw err;
        res.send({content: rows, translation: translation});
        res.end();
    })
};
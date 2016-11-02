var db = require('./dbconn.js');
// connexion a la db
var conn = db.connexion();

exports.renderBibliotheque = function(req, res)
{
    conn.query('select * from movies order by rating desc limit 0, 20', function(err, rows, fields) {
        if (err) throw err;
        res.render('bibliotheque', {data : rows});
        /*for (var i in rows) {
            console.log('Post Titles: ', rows[i].post_title);*/
    });
};
/**
 * Created by aliandie on 10/27/16.
 */

var db = require('./dbconn.js');
var conn = db.connexion();
var passwordHash = require('password-hash');

exports.inscription = function(req, res, translation, langue) {
    req.body.u_pass = passwordHash.generate(req.body.u_pass);
    req.body.u_pic = '/img/profile.jpg';
    var result = "";
    conn.query("SELECT u_mail FROM users WHERE u_mail = ?", [req.body.u_mail], function(err, rows){
        if(err) throw err;
        if (rows[0] != undefined)
        {
            result = "This mail is already used";
        }
        else
        {
            conn.query('INSERT INTO users SET ?', req.body, function(err){
                if(err) throw err;
            });
            result = "OK";
        }
        res.send({res: result, translation: translation});
        res.end();
    });

};
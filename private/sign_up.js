/**
 * Created by aliandie on 10/27/16.
 */

var db = require('./dbconn.js');
var conn = db.connexion();
var passwordHash = require('password-hash');

exports.inscription = function(req, res) {

    req.body.u_pass = passwordHash.generate(req.body.u_pass);
    req.body.u_pic = '/img/profile.jpg';
    conn.query('INSERT INTO users SET ?', req.body, function(err){
        if(err) throw err;
    });
    res.send('ok');
    res.end();
};
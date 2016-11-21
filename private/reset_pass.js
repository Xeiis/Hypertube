/**
 * Created by aliandie on 10/28/16.
 */

var db = require('./dbconn.js');
var passwordHash = require('password-hash');
var conn = db.connexion();

exports.connect = function(req, res) {
    var  user_name = req.body.u_name;
    var  user_pass = passwordHash.generate(req.body.u_pass);
    var  user_cle  = req.body.u_cle;
    conn.query("UPDATE users SET u_pass = ?, u_restore_key = NULL WHERE u_name= ? AND u_restore_key = ?", [user_pass, user_name, user_cle], function(err, rows){
        var result;
        if(err) throw err;
        if(rows.changedRows !== 0) {
            result = 'OK';
        }
        else
            result = 'KO';
        res.send({res: result, translation: translation});
        res.end();
    });
}

exports.edit_infos = function(req, res){
    var cur_user = session.login;

    if (req.body.pass)
        req.body.pass = passwordHash.generate(req.body.u_pass);
    conn.query("UPDATE users SET ? WHERE user_name = ?", [cur_user], function(err, rows) {
        var result;
        if(err) throw err;
        if(rows.changedRows !== 0) {
            result = 'OK';
        }
        else
            result = 'KO';
        res.send({res: result, translation: translation});
        res.end();
    });
}
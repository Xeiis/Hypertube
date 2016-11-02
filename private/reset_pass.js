/**
 * Created by aliandie on 10/28/16.
 */

var db = require('./dbconn.js');
var passwordHash = require('password-hash');
var conn = db.connexion();

exports.connect = function(req, res) {
    var user_name = req.body.u_name;
    var  user_pass = passwordHash.generate(req.body.u_pass);
    conn.query("UPDATE users SET u_pass = ? WHERE u_name= ?", [user_pass, user_name], function(err, rows){
        var result;
        if(err) throw err;
        if(rows.changedRows !== 0) {
            result = 'OK';
        }
        else
            result = 'KO';
        console.log(rows.changedRows);
        res.send(result);
        res.end();
    });
}
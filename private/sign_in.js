/**
 * Created by aliandie on 10/27/16.
 */

var db = require('./dbconn.js');
var passwordHash = require('password-hash');
var conn = db.connexion();

exports.connect = function(req, res) {
    user_name = req.body.u_name;
    conn.query("SELECT * FROM users WHERE u_name= ?", [user_name], function(err, rows){
        var result;
        if(err) throw err;
        if(typeof rows[0] !== 'undefined') {
            if (rows[0].u_name == user_name) {
                if (passwordHash.verify(req.body.u_pass, rows[0].u_pass)) {
                    req.session.login = data.login;
                    result = 'OK';
                }
                else
                    result = 'Wrong password';
            }
            else
                result = 'Wrong details';
        }
        else
            result = 'Wrong details';
    res.send(result);
    res.end();
    });
}
/**
 * Created by aliandie on 10/28/16.
 */

var db = require('./dbconn.js');
var conn = db.connexion();

exports.connect = function(req, res) {
    user_name = req.body.u_name;
    user_mail = req.body.u_mail;
    conn.query("SELECT * FROM users WHERE u_name= ? AND u_mail= ?", [user_name, user_mail], function(err, rows){
        var result;
        if(err) throw err;
        if(typeof rows[0] !== 'undefined') {
            if (rows[0].u_name == user_name && rows[0].u_mail == user_mail) {
                result = 'OK';
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
/**
 * Created by aliandie on 10/27/16.
 */

var db = require('./dbconn.js');
var conn = db.connexion();

exports.connect = function(req, res) {
    user_name = req.body.u_name;
    conn.query("SELECT * FROM users WHERE u_name= ?", [user_name], function(err,rows){
        if(err){
            console.log("Error connecting DB" + err.stack);
        return;
        }
        console.log('connected as id ' + conn.threadId);});
}
/**
 * Created by aliandie on 10/28/16.
 */

var db = require('./dbconn.js');
var conn = db.connexion();
var nodemailer = require('nodemailer');
var urlencode = require('urlencode');
var shortid = require('shortid');

exports.connect = function(req, res) {
var  user_name = req.body.u_name;
var user_mail = req.body.u_mail;
var cle = shortid.generate();
conn.query("UPDATE users SET u_restore_key = ? WHERE u_name = ? AND u_mail = ?", [cle, user_name, user_mail], function(err, rows){
    var result;
    var num = rows.affectedRows;
    if(err) throw err;
    if(num > 0) {
        var transporter = nodemailer.createTransport();
        var mailOptions = {
            from: "Hypertube@hypertube.fr",
            to: user_mail,
            subject: "Reset your hypertube password",
            html: "<b>Hello! <b> To reset you're password, please follow this link : <a  href='http://localhost:3000/?log=" + urlencode(user_name)+ "&cle=" + urlencode(cle) +"'>Recuperation du mot de passe</a><br><br></b>"
        };
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }
        });
        result = 'OK';
    }
    else
        result = 'Wrong details';
res.send(result);
res.end();
});}

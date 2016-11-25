/**
 * Created by aliandie on 10/27/16.
 */

var db = require('./dbconn.js');
var passwordHash = require('password-hash');
var conn = db.connexion();
var axios = require('axios');

exports.connect = function(req, res, translation) {
    user_name = req.body.u_name;
    conn.query("SELECT * FROM users WHERE u_name= ?", [user_name], function(err, rows){
        var result;
        if(err) throw err;
        if(typeof rows[0] !== 'undefined') {
            if (rows[0].u_name == user_name) {
                if (passwordHash.verify(req.body.u_pass, rows[0].u_pass)) {
                    req.session.login = req.body.u_name;
                    req.session.user_id = rows[0].u_id;
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
    res.send({res: result, translation: translation});
    res.end();
    });
};

exports.ft_connect = function(req, res) {
    var user_code = req.query.code;

    axios.post('https://api.intra.42.fr/oauth/token', {
        grant_type    : 'authorization_code',
        client_id     : 'ad3235caccb1f5d591b4136a695284080b9a7db99ba6f0e13da1b0bb7a592c53',
        client_secret : 'e50a5d4c329067eb74be150be69de04136631af5f6a0b4d164a10db0d6886a58',
        code          : user_code,
        redirect_uri  : 'http://localhost:3000/sign_in_ft'
    }).then(function (response) {
        axios.get('https://api.intra.42.fr/v2/me', {
            headers: {'Authorization': response.data.token_type + ' ' + response.data.access_token}
        }).then(function (user) {
            var user_data = {
                u_name   : user.data.login,
                u_fname  : user.data.first_name,
                u_lname  : user.data.last_name,
                u_mail   : user.data.email
            };
            conn.query("INSERT IGNORE INTO users SET ?", [user_data], function(err, rows){
                 if(err) throw err;
                conn.query("SELECT * FROM users WHERE u_name = ? AND u_mail = ?", [user.data.login, user.data.email], function(err, rows){
                    if(err) throw err;
                    req.session.user_id = rows[0].u_id;
                    req.session.login = user.data.login;
                    res.redirect('http://localhost:3000/bibliotheque');
                });
             });
            })
        });
    };


exports.fb_connect = function(req, res){
    conn.query("INSERT IGNORE INTO users SET ?", [req.body], function(err, rows){
        if(err) throw err;
        conn.query("SELECT * FROM users WHERE u_name = ?"/* AND u_mail = ?"*/, [req.body.u_name/*, req.body.u_mail*/], function(err, rows){
            if(err) throw err;
            req.session.user_id = rows[0].u_id;
            req.session.login = req.body.u_name;
            res.send('OK');
            res.end();
        });
    });
};
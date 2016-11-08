/**
 * Created by aliandie on 10/27/16.
 */

var db = require('./dbconn.js');
var passwordHash = require('password-hash');
var conn = db.connexion();
var request = require('request');

exports.connect = function(req, res) {
    user_name = req.body.u_name;
    conn.query("SELECT * FROM users WHERE u_name= ?", [user_name], function(err, rows){
        var result;
        if(err) throw err;
        if(typeof rows[0] !== 'undefined') {
            if (rows[0].u_name == user_name) {
                if (passwordHash.verify(req.body.u_pass, rows[0].u_pass)) {
                    req.session.login = req.body.u_name;
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

exports.ft_connect = function(req, res){
    var user_code = req.body.code;

    request.post('https://api.intra.42.fr/oauth/token', {
        form:{
            grant_type    : 'authorization_code',
            client_id     : 'c59bbebe4f1b9f264be1ab9353677b5dbfc5651238fa38d8ab3d8b12eee5d58a',
            client_secret : '380bb5710c0353f2af63207137eae3950c3bfaa3f3eb2ebbf4fc43fec4269037',
            code          : user_code,
            redirect_uri  : 'http://localhost:3000/'
        }
    })
        .on('response', function(response) {
            console.log(response);
            console.log(response.statusCode);
            console.log(response.headers['content-type']);
        })
    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            console.log(info.stargazers_count + " Stars");
            console.log(info.forks_count + " Forks");
        }
    }
    var options = {
        url: 'https://api.intra.42.fr/v2/me',
        headers: {
            'Authorization:': user_code
        }

    };
    request(options, callback);
}

exports.fb_connect = function(req, res){
    console.log(req.body);
    conn.query("INSERT IGNORE INTO users SET ?", [req.body], function(err, rows){
        if(err) throw err;
        req.session.login = req.body.u_name;
        result = 'OK';
        res.send(result);
        res.end();
    });
}
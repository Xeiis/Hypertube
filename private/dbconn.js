var mysql = require('mysql');



exports.connexion = function(){
    var conn = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'root02',
        port     : '3307',
        database : 'hypertube'
    });

    conn.connect(function (err) {
        if(err){
            console.log("Error connecting DB" + err.stack);
            return;
        }
        console.log('connected as id ' + conn.threadId);
    });
    return (conn);
};
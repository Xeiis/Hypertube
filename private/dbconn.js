var mysql = require('mysql');



exports.connexion = function(){
    var conn = mysql.createConnection({
        host     : 'sql7.freemysqlhosting.net',
        user     : 'sql7141783',
        password : 'NUIGWmWkXM',
        port     : '3306',
        database : 'sql7141783'
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
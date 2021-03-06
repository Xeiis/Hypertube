var db = require('./dbconn.js');

var conn = db.connexion();
conn.query('DROP TABLE IF EXISTS comm');
conn.query('DROP TABLE IF EXISTS seen');
conn.query('DROP TABLE IF EXISTS movies');
conn.query('DROP TABLE IF EXISTS torrent');
conn.query('DROP TABLE IF EXISTS users');


conn.query('CREATE TABLE users(u_id INT( 11 ) NOT NULL AUTO_INCREMENT PRIMARY KEY,\
                               u_name VARCHAR(255) NOT NULL,\
                               u_mail VARCHAR(255) NOT NULL,\
                               u_pic VARCHAR(255),\
                               u_fname VARCHAR(255) NOT NULL,\
                               u_lname VARCHAR(255) NOT NULL,\
                               u_pass VARCHAR(255) NOT NULL,\
                               u_lang VARCHAR(2) NOT NULL,\
                               u_restore_key VARCHAR(255),\
                               u_from INT(11))' , function(err){
    if(err) throw err;
    console.log('users table created\n');
});
conn.query('CREATE TABLE torrent(id INT( 11 ) NOT NULL AUTO_INCREMENT PRIMARY KEY,\
                                 path VARCHAR(255),\
                                 cle VARCHAR(255),\
                                 url VARCHAR(255),\
                                 hash VARCHAR(255),\
                                 download_end BOOLEAN DEFAULT FALSE,\
                                 download_started BOOLEAN DEFAULT FALSE,\
                                 quality VARCHAR(255),\
                                 seeds INT(11),\
                                 peers INT(11),\
                                 size VARCHAR(255),\
                                 date_uploaded DATE)', function(err){
    if(err) throw err;
    console.log('torrent table created\n');
});
conn.query('CREATE TABLE movies(m_id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,\
                                id INT(11) NOT NULL,\
                                url VARCHAR(255) NOT NULL,\
                                imdb_code VARCHAR (255) NOT NULL,\
                                title VARCHAR(255) NOT NULL,\
                                year INT(11) NOT NULL,\
                                rating varchar(3),\
                                trailer VARCHAR(255),\
                                summary TEXT,\
                                language VARCHAR(25),\
                                mpa_rating VARCHAR(255),\
                                background_image VARCHAR(255),\
                                background_image_original VARCHAR(255),\
                                medium_cover_image VARCHAR(255),\
                                torrent_720_id INT(11),\
                                torrent_1080_id INT(11),\
                                torrent_3D_id INT(11),\
                                last_view  DATE,\
                                FOREIGN KEY (torrent_720_id) REFERENCES torrent(id) ON DELETE SET NULL ON UPDATE CASCADE,\
                                FOREIGN KEY (torrent_1080_id) REFERENCES torrent(id) ON DELETE SET NULL ON UPDATE CASCADE,\
                                FOREIGN KEY (torrent_3D_id) REFERENCES torrent(id) ON DELETE SET NULL ON UPDATE CASCADE)' ,function(err){
    if(err) throw err;
    console.log('users movies created\n');
});
conn.query('CREATE TABLE seen(id INT( 11 ) NOT NULL AUTO_INCREMENT PRIMARY KEY,\
                               u_id INT(11),\
                               m_id INT(11),\
                               FOREIGN KEY (u_id) REFERENCES users(u_id) ON DELETE SET NULL ON UPDATE CASCADE,\
                               FOREIGN KEY (m_id) REFERENCES movies(m_id) ON DELETE SET NULL ON UPDATE CASCADE)', function(err){
    if(err) throw err;
    console.log('seen table created\n');
});
conn.query('CREATE TABLE comm(id INT( 11 ) NOT NULL AUTO_INCREMENT PRIMARY KEY,\
                              u_id INT(11),\
                              m_id INT(11),\
                              content VARCHAR(255),\
                              time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
                              FOREIGN KEY (u_id) REFERENCES users(u_id) ON DELETE SET NULL ON UPDATE CASCADE,\
                              FOREIGN KEY (m_id) REFERENCES movies(m_id) ON DELETE SET NULL ON UPDATE CASCADE)', function(err){
    if(err) throw err;
    console.log('comm table created\n');
});

conn.end(function(err) {
    // The connection is terminated gracefully
    // Ensures all previously enqueued queries are still
    // before sending a COM_QUIT packet to the MySQL server.
});
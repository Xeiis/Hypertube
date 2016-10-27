/**
 * Created by aliandie on 10/26/16.
 */

var db = require('./dbconn.js');

var conn = db.connexion();
conn.query('DROP TABLE IF EXISTS comm');
conn.query('DROP TABLE IF EXISTS seen');
conn.query('DROP TABLE IF EXISTS movies');
conn.query('DROP TABLE IF EXISTS torrent');
conn.query('DROP TABLE IF EXISTS users');


conn.query('CREATE TABLE users(u_id INT( 11 ) NOT NULL AUTO_INCREMENT PRIMARY KEY,\
                               u_name VARCHAR(255) UNIQUE NOT NULL,\
                               u_mail VARCHAR(255) UNIQUE NOT NULL,\
                               u_pic VARCHAR(255),\
                               u_fname VARCHAR(255) NOT NULL,\
                               u_lname VARCHAR(255) NOT NULL,\
                               u_pass VARCHAR(255) NOT NULL,\
                               u_restore_key VARCHAR(255))' , function(err){
    if(err) throw err;
    console.log('users table created\n');
});
conn.query('CREATE TABLE torrent(id INT( 11 ) NOT NULL AUTO_INCREMENT PRIMARY KEY,\
                                 url VARCHAR(255),\
                                 hash VARCHAR(255),\
                                 quality VARCHAR(255),\
                                 seeds INT(11),\
                                 peers INT(11),\
                                 size VARCHAR(255),\
                                 date_uploaded DATE)', function(err){
    if(err) throw err;
    console.log('torrent table created\n');
});
conn.query('CREATE TABLE movies(m_id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,\
                                url VARCHAR(255) NOT NULL,\
                                path VARCHAR(255),\
                                imdb_code VARCHAR (255) NOT NULL,\
                                title VARCHAR(255) NOT NULL,\
                                year INT(11) NOT NULL,\
                                rating DECIMAL,\
                                summary TEXT,\
                                language VARCHAR(25),\
                                mpa_rating VARCHAR(255),\
                                background_image VARCHAR(255),\
                                background_image_original VARCHAR(255),\
                                medium_cover_image VARCHAR(255),\
                                torrent_720_id INT(11),\
                                torrent_1080_id INT(11),\
                                FOREIGN KEY (torrent_720_id) REFERENCES torrent(id) ON DELETE SET NULL ON UPDATE CASCADE,\
                                FOREIGN KEY (torrent_720_id) REFERENCES torrent(id) ON DELETE SET NULL ON UPDATE CASCADE,\
                                FOREIGN KEY (torrent_1080_id) REFERENCES torrent(id) ON DELETE SET NULL ON UPDATE CASCADE)' ,function(err){
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
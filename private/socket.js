/*var index = require('../private/socket_index.js');

module.exports = function(io) {
    io.on('connection', function (socket) {
        if(socket.handshake.session.login)
            socket.emit('youare_logged', socket.handshake.session.login);
        else
            socket.emit('youare_not_logged');
        socket.on('inscription', function (data) {
            index.inscription(data, inscription_ok);
        });
        socket.on('whoami', function () {
            socket.emit('youare', socket.handshake.session.login);
        });
        socket.on('logout', function() {
            socket.handshake.session.login = '';
        });
        socket.on('login', function(data) {
            socket.handshake.session.login = data;
        });
    });
};*/
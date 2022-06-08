export function roomManager(server) {
    const io = require('socket.io')(server);

    io.of("/multiplayer").on("connection", function (socket) {
        console.log('a user connected');
    
    });


    return io;
}

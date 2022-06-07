const io = require('socket.io')(server);

const roomNames = new Set();
const roomsWaiting = [];
const roomsFull = [];

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
    socket.on('room', (create) => {
        if (create === true) {
            socket.join(roomNames.size + 1);
        }
    });
});


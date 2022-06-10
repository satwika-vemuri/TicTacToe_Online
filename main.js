const express = require('express');
const port = 3000;
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

if (cluster.isMaster) {
  console.log(`Number of CPUs is ${numCPUs}`);
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log("New worker forked");
    cluster.fork();
  });
} else {
  const app = express();
  var path = require('path');
  const http = require('http');
  const server = http.createServer(app);
  server.listen(port);

  app.set('views', path.join(__dirname, '/public/views'));
  app.set('view engine', 'hbs');


  app.use(express.static('public'));

  var indexRouter = require('./routes/index');
  app.use('/', indexRouter);

  const io = require('socket.io')(server);
  const mult = io.of("/multiplayer");


  var socketsWaiting = [];

  mult.on("connection", (socket) => {
    console.log("User " + socket.id + " has connected!");

    socket.on("disconnect", () => {
      // If socket was waiting for opponent, remove from list
      let index = socketsWaiting.indexOf(socket.id);
      if (index > -1) {
        socketsWaiting.splice(index, 1); 
      }
            
      console.log("User " + socket.id + " disconnected");
    });

    socket.on("create", () => {
      socketsWaiting.push(socket.id);
      console.log(socketsWaiting);
      mult.emit("update_count", socketsWaiting.length);
    });

    socket.on("join", () => {
      console.log(socketsWaiting);

      let opponent = socketsWaiting.shift();
      // Tells the player who joined to start
      // Tells both players their opponent id
      mult.to(socket.id).emit("start_game", opponent);
      mult.to(opponent).emit("assign_opponent", socket.id);
      mult.emit("update_count", socketsWaiting.length);

    });

    socket.on('get_count', () => {
      // Returns number of sockets waiting to be connected ("rooms")
      mult.emit("update_count", socketsWaiting.length);
    });

    socket.on("made_move", (clickedTile, player_symbol, oppId, isGameOver) => {
      // Tells players to update boards based upon newly made move
      // Tells next player to go or not based on state of game
      mult.to(socket.id).to(oppId).emit("update_board", clickedTile, player_symbol);
    });
  });
}


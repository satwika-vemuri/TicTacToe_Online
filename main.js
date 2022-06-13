const express = require('express');
const port = process.env.PORT ||3000;

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
var roomsWaiting = [];


mult.on("connection", (socket) => {
  var opponent; 
  console.log("User " + socket.id + " has connected!");

  socket.on("disconnect", () => {
    console.log("I left " + opponent);
    // If socket was waiting for opponent, remove from list
    let index = socketsWaiting.indexOf(socket.id);
    if (index > -1) {
      socketsWaiting.splice(index, 1); 
      roomsWaiting.splice(index, 1); 
      mult.emit("update_rooms", roomsWaiting);


    } else if (typeof opponent !== "undefined") {
      mult.to(opponent).emit("opponent_disconnected");
    }
          
    console.log("User " + socket.id + " disconnected");
  });

  socket.on("create", (roomName) => {
    socketsWaiting.push(socket.id);
    roomsWaiting.push(roomName);

    console.log("Rooms waiting: " + roomsWaiting);
    mult.emit("update_rooms", roomsWaiting);
  });

  socket.on("join", (roomName) => {
    // Tells the player who joined to start
    // Tells both players their opponent id
    oppIdIndex = roomsWaiting.indexOf(roomName);

    opponent = socketsWaiting.splice(oppIdIndex, 1);
    roomsWaiting.splice(oppIdIndex, 1);

    mult.to(socket.id).emit("start_game", opponent);
    mult.to(opponent).emit("assign_opponent", socket.id);
    mult.emit("update_rooms", roomsWaiting);

  });

  socket.on("assign_opponent", (oppId) => {
    opponent = oppId;
  });

  socket.on('get_rooms', () => {
    // Returns number of sockets waiting to be connected ("rooms")
    mult.emit("update_rooms", roomsWaiting);
  });

  socket.on("made_move", (clickedTile, player_symbol, currentState) => {
    // Tells players to update boards based upon newly made move
    // Tells next player to go or not based on state of game
    mult.to(opponent).emit("update_board", clickedTile, player_symbol);

    if (currentState == 0) {
      mult.to(opponent).emit("your_turn");
    } else {
      mult.to(opponent).to(socket.id).emit("game_over", currentState);
    }
  });

  socket.on("quit", () => {
    mult.to(opponent).emit("opponent_quit");
  });

  socket.on("replay", () => {
    mult.to(opponent).emit("opponent_replay");
  });

  socket.on("reset_game", () => {
    mult.to(opponent).to(socket.id).emit("reset_game");
  });
});
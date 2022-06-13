var express = require('express');

var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', {title: 'Tic-Tac-Toe Star', styles: ["index"] });
});

var singleplayerContent  = {tictactoe: "/js/tictactoe.js",
              singleplayer: "/js/singleplayer.js"};

router.get('/singleplayer', function(req, res, next) {
  res.render('singleplayerChoose', {title: 'Singleplayer | Tic-Tac-Toe Star', js:singleplayerContent});
});

var multiplayerContent  = {socketio: "/socket.io/socket.io.js",
              tictactoe: "/js/tictactoe.js",
              multiplayer: "/js/multiplayer.js"};

router.get('/multiplayer', function(req, res, next) {
  res.render('multiplayerChoose', {title: 'Multiplayer | Tic-Tac-Toe Star', js:multiplayerContent, styles:["multiplayerChoose"]});

});

module.exports = router;






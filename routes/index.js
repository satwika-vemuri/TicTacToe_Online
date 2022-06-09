var express = require('express');

var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Tic Tac Toe Home', styles: ["index"] });
});

var singleplayerContent  = {tictactoe: "/js/tictactoe.js",
              singleplayer: "/js/singleplayer.js"};

router.get('/singleplayer', function(req, res, next) {
  res.render('singleplayerChoose', {js:singleplayerContent});
});

var multiplayerContent  = {socketio: "/socket.io/socket.io.js",
              tictactoe: "/js/tictactoe.js",
              multiplayer: "/js/multiplayer.js"};

router.get('/multiplayer', function(req, res, next) {
  res.render('multiplayerChoose', {js:multiplayerContent, styles:["multiplayerChoose"]});

});

module.exports = router;






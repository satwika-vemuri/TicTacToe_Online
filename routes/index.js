var express = require('express');

var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Tic Tac Toe Home', styles: ["index"] });
});

var content  = {tictactoe: "/js/tictactoe.js",
              singleplayer: "/js/singleplayer.js"};

router.get('/singleplayer', function(req, res, next) {
  res.render('playerChoose', {js:content});
});

var content2  = {socketio: "/socket.io/socket.io.js",
              tictactoe: "/js/tictactoe.js",
              multiplayer: "/js/multiplayer.js"};

router.get('/multiplayer', function(req, res, next) {
  res.render('board', { title: 'Multiplayer', 
                        styles: ["board"],
                        js:content2
                      });
});

module.exports = router;






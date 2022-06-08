var express = require('express');

var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Tic Tac Toe Home', styles: ["index"] });
});

router.get('/singleplayer', function(req, res, next) {
  res.render('playerChoose', {js:["/js/singleplayer.js", "/js/tictactoe.js"]});
});

router.get('/multiplayer', function(req, res, next) {
  res.render('board', { title: 'Multiplayer', styles: ["board"],
                        js: [ "/socket.io/socket.io.js",
                          "/js/tictactoe.js",
                        "/js/multiplayer.js"]
                      });
});

module.exports = router;






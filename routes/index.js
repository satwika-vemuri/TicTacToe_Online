var express = require('express');

var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Tic Tac Toe Home', styles: ["index"] });
});

router.get('/singleplayer', function(req, res, next) {
  res.render('board', { title: 'Singleplayer', 
                      styles: ["board"], 
                      js: ["/js/singeplayer.js",
                          "/js/tictactoe.js"],
                      board: [["X","X", "X"], 
                              ["X", "X", "X"], 
                              ["X","X","X"]],
                      score: [0, 0]
                      });
});

router.get('/multiplayer', function(req, res, next) {
  res.render('board', { title: 'Multiplayer', styles: ["board"],
                        js: [ "/socket.io/socket.io.js",
                          "/js/tictactoe.js",
                        "/js/multiplayer.js"]
                      });
});

module.exports = router;






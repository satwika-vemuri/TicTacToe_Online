var express = require('express');
console.log("starting!");

module.exports = function(io) {
  var router = express.Router();

  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Tic Tac Toe Home', style: "index" });
  });

  router.get('/singleplayer', function(req, res, next) {
    res.render('board', { title: 'Singleplayer', 
                          styles: "board", 
                          js: ["public&#92js&#92singleplayer.js",
                              "public&#92js&#92tictactoe.js"],
                          board: [["X","X", "X"], 
                                  ["X", "X", "X"], 
                                  ["X","X","X"]],
                          score: [0, 0]
                      });
  });

  router.get('/multiplayer', function(req, res, next) {
    res.render('board', { title: 'Multiplayer', styles: "board",
    js: ["tictactoe",
    "singleplayer"]
});
  });

  return router;

}
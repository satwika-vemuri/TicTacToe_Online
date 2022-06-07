console.log("Running");
//const { append } = require("express/lib/response");

app.get('/', (req, res) =>{
    res.render('board', {board: [[0, 0, 0], [1, 1, 1], [2, 2, 2]]});
});
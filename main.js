const express = require('express');
const app = express();
var path = require('path');
const http = require('http');
const server = http.createServer(app);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');



let io = require('socket.io' )


app.use(express.static('public'));

var indexRouter = require('./routes/index')(io);
app.use('/', indexRouter);


server.listen(3000, () => {
  console.log('listening on *:3000');
});

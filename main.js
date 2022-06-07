const express = require('express');
const app = express();
var path = require('path');
const http = require('http');
const server = http.createServer(app);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.use(express.static('public'));

const io = require('socket.io')(server);

// var roomManager = require('./public/js/roomManager')(server);
var indexRouter = require('./routes/index')(io);
app.use('/', indexRouter);


server.listen(3000, () => {
  console.log('listening on *:3000');
});

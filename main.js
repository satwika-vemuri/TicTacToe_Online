const express = require('express');
const port = 3000;
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

if (cluster.isMaster) {
  console.log(`Number of CPUs is ${numCPUs}`);
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log("New worker forked");
    cluster.fork();
  });
} else {
  const app = express();
  var path = require('path');
  const http = require('http');
  const server = http.createServer(app);


  app.set('views', path.join(__dirname, '/public/views'));
  app.set('view engine', 'hbs');


  app.use(express.static('public'));

  var indexRouter = require('./routes/index');
  app.use('/', indexRouter);

  const io = require('socket.io')(server);
  const mult = io.of("/multiplayer");

  mult.on("connection", (socket) => {
    console.log("A user has connected!");
    socket.on('disconnect', () => {
      console.log('disconnected!!');
    });

    socket.on('join', () => {
      console.log('joined!!!');
    });

    socket.on('create', () => {
      console.log(socket.id);
      socket.join(socket.id);
    });
  });


  server.listen(port);
}


const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile('./src/html/home.html', {root: __dirname })
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
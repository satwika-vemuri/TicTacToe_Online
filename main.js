const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile('./src/html/index.html', {root: __dirname })
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
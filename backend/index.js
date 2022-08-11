const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const cors = require('cors');
const origin = process.env.USER == "yannick" ?
    "http://100.115.92.206:8000" : "https://hearts.yannick42.dev";

app.use(cors({
    origin: origin
}));

const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
      origin: origin,
      methods: ["GET", "POST"],
    }
});

app.get('/', (req, res) => {
  const name = process.env.NAME || 'World';
  res.send(`Hello ${name}!`);
});

app.get('/count', (req, res) => {
    res.send(`${number_of_users}`);
});

let number_of_users = 0;

io.on('connection', (socket) => {

    // 
    socket.on('user:connect', (username) => {
        number_of_users++;
        io.emit('chat:message', { text: "<i><mark>" + username + " is connected</mark></i>" });
    });
    socket.on('user:disconnected', (username) => {
        number_of_users--;
        io.emit('chat:message', { text: "<i><mark>" + username + " is disconnected</mark></i>" });
    });

    socket.on('chat:message', (msg) => {
        io.emit('chat:message', msg); // send to all (even sending client)
    });
});

const port = parseInt(process.env.PORT) || 8080;
server.listen(port, () => {
  console.log(`helloworld: listening on port ${port}`);
});

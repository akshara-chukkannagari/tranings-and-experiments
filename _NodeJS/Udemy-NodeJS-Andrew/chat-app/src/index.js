const path = require('path');
const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const Filter = require('bad-words');

const {
  generateMessage,
  generateLocationMessage,
} = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));
let count = 0;

io.on('connection', socket => {
  console.log('New websocket connection:', count);

  socket.on('join', ({ username, room }) => {
    socket.join(room);
    socket.emit('message', generateMessage('Welcome!'));
    socket.broadcast
      .to(room)
      .emit('message', generateMessage(`${username} has joined!`));
  });

  socket.on('sendMessage', (message, callback) => {
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback('Profanity is not allowed.');
    }
    io.emit('message', generateMessage(message));
    callback();
  });

  socket.emit('countUpdated', generateMessage(count));
  socket.on('increment', () => {
    count++;
    io.emit('countUpdated', generateMessage(count));
  });

  socket.on('disconnect', () => {
    io.emit('message', generateMessage('A user has left!'));
  });

  socket.on('sendLocation', (coords, callback) => {
    io.emit(
      'locationMessage',
      generateLocationMessage(
        `https://google.com/maps?q=${coords.latitude},${coords.longitude}`,
      ),
    );
    callback();
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

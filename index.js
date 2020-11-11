var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var userName;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    socket.broadcast.emit('hi');
  console.log('a user connected');
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', (name) => {
      console.log('user disconnected');
      io.emit('logout user', name);
    });

    socket.on('logout user', (name) => {
      io.emit('logout user', name)
    })

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
        console.log('message: ' + msg);
    });

    socket.on('new user', (name) => {
      userName = name;
      io.emit('new user', name);
      console.log('user: ' + name);
  });
});

io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' }); // This will emit the event to all connected sockets


http.listen(3000, () => {
  console.log('listening on *:3000');
});
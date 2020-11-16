var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var users = [];
var messages = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    socket.broadcast.emit('hi');
    
  console.log('a user connected');
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('messages', function() {
      io.emit('showMessages', messages);
    })

    socket.on('logout user', (userId) => {
      io.emit('delete user', userId);
    })

    socket.on('disconnect', () => {
      console.log('user disconnected');
      io.emit('logout user');
    });


    socket.on('updateUsersTable', (id) => {
      if (id != null) {
        console.log(users.length, 'old length', id)
        users[id] = 'logout'
        console.log(users.length, 'new length')
        io.emit('show users', users, users.length)
      }
    })

    socket.on('chat message', (msg, name, date) => {
        messages.push( {msg: msg, name: name, date: date})
        console.log(messages)
        io.emit('chat message', {msg: msg, name: name, date: date});
        console.log('message: ' + msg);
    });

    socket.on('new user', (name) => {
      users.push( { name : name, id : users.length } )
      console.log(users)
      io.emit('show users', users, users.length);
      io.emit('new user', users.length - 1)
  });


});



http.listen(3000, () => {
  console.log('listening on *:3000');
});
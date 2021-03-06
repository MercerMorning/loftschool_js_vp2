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

    // socket.on('logout user', (userId) => {
    //   io.emit('delete user', userId);
    // })

    socket.on('disconnect', () => {
      if (socket.userId) {
        console.log(users.length, 'old length', socket.userId)
        console.log(socket.userId)
        users[socket.userId].status = 'offline'
        console.log(users.length, 'new length')
        console.log(users)
        messages.push( {msg: users[socket.userId].name + ' вышел', user: users[socket.userId], date: Date.now()})
        users[socket.userId].status = 'offline'
        // io.emit('add message', {msg: users[socket.userId].name + ' вышел', name: 'чат', date: 123}, users[socket.userId])
        
        // io.emit('show users', users, users.length)
        io.emit('showMessages', messages);
        io.emit('show users', users.filter(user => user.status != 'offline'), users.filter(user => user.status != 'offline').length, users[socket.userId])
        
      }
    });


    socket.on('updateUsersTable', (id) => {
      if (socket.userId) {
        console.log(users.length, 'old length', socket.userId)
        console.log(socket.userId)
        users[socket.userId].status = 'offline'
        console.log(users.length, 'new length')
        console.log(users)
      
        // io.emit('showMessages', messages)
        io.emit('show users', users, users.length, users[socket.userId])
      }
    })

    socket.on('update ava', (src) => {
      // users[socket.userId].src = src;
      users[socket.userId].src = src;
      io.emit('show users', users, users.length, users[socket.userId]);
      // console.log('photo:', users[socket.userId].src)
    })

    socket.on('chat message', (msg, date) => {
        messages.push( {msg: msg, user: users[socket.userId], date: date})
        console.log(messages)
        io.emit('showMessages', messages);
        // io.emit('add message', {msg: msg, name: name, date: date});
        console.log('message: ' + msg);
    });

    socket.on('new user', (name) => {
      socket.userId =  users.length;
      users.push( { name : name, id : users.length, status: 'online', src: ""} )
      console.log(users)
      io.emit('show users', users, users.length, users[socket.userId]);
      io.emit('new user', users.length - 1)
  });


});



http.listen(3000, () => {
  console.log('listening on *:3000');
});
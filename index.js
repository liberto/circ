var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/circles.html');
});

io.on('connection', function(socket){
  socket.broadcast.emit('join')
  console.log("join")
  socket.on('chat message', function(msg, name){
    socket.broadcast.emit('chat message', name + ": " + msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
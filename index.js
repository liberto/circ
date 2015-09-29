var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var players = {}

app.get('/', function(req, res){
  res.sendFile(__dirname + '/circles.html');
});

io.on('connection', function(socket){
  io.to(socket.id).emit('allplayers',JSON.stringify(players));
  socket.on('join', function(coordinates){
    socket.broadcast.emit('join', socket.id, coordinates)
    io.to(socket.id).emit('allplayers', players)
    players[socket.id] = coordinates
  })
  socket.on('disconnect', function(){
    delete players[socket.id]
    socket.broadcast.emit('left', socket.id)
  })
  socket.on('log', function(msg){
    console.log("log " + msg)
  });
  socket.on('move', function(x, y){
    socket.broadcast.emit('move', socket.id, x, y)
    players[socket.id] = {cx:x, cy:y}
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
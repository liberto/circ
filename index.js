var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var players = {}

app.get('/', function(req, res){
  res.sendFile(__dirname + '/circles.html');
});

io.on('connection', function(socket){
  io.to(socket.id).emit('allplayers',JSON.stringify(players));
  socket.on('join', function(id, coordinates){
    console.log("join " + id)
    socket.broadcast.emit('join', id, coordinates)
    io.to(socket.id).emit('allplayers', players)
    console.log(id + " joined and was sent " + Object.keys(players).length)
    players[id] = coordinates
  })
  socket.on('log', function(msg){
    console.log("log " + msg)
  });
  socket.on('move', function(id, x, y){
    socket.broadcast.emit('move', id, x, y)
    players[id] = {cx:x, cy:y}
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
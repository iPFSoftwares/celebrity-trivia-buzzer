var questions = require('./words');
var express = require('express');
var app = express();

app.use(express.static(__dirname + "/src/static"));

var server = require('http').Server(app);
var io = require('socket.io')(server);

let curIndex = -1;
let timer = null;
let timeLeft = 0;

let game = {
  turn: 0,
  currentWords: [],
  timeLeft: 0,
  availableTeams: ["A", "B"],
  scores: [0, 0, 0, 0]
}

function startTimer(){
  if(timer !== null){
    clearInterval(timer);
    timer = null;
  }

  timeLeft = 30;
  io.emit('time', timeLeft);

  game.timeLeft = timeLeft;
  io.emit('game-changed', game);
  
  timer = setInterval(() => {
    if(timeLeft > 1){
      timeLeft -= 1;
      io.emit('time', timeLeft);
      game.timeLeft = timeLeft;
      io.emit('game-changed', game);
    }
    else{
      timeLeft = 0;
      io.emit('time', timeLeft);
      game.timeLeft = timeLeft;
      io.emit('game-changed', game);
      clearInterval(timer);
      timer = null;
    }
  }, 1000);
}

io.on('connection', function(socket){
  socket.on('next-question', function(){
    curIndex++;
    
    if(!questions[curIndex]){
      io.emit('new-question', null);
      return;
    }

    console.log("Next question : ", questions[curIndex]);

    io.emit('new-question', questions[curIndex]);
  });

  socket.on('buzz', function(team){
    console.log(team);
    io.emit('buzz', team);
  });

  socket.on('hint', function(team){
    console.log("Hint", team);
    io.emit('hint', team);
  });

  socket.on('disconnect', function() {
    console.log('a user disconnected');
  });
  // socket.emit('game-changed', game);
  // socket.emit('words', words[curIndex]);
  // socket.emit('time', timeLeft);

  // game.currentWords = words[curIndex].map(word => ({played: false, word}));
  // game.timeLeft = timeLeft;
  // io.emit('game-changed', game);

  // socket.on('wordPlayed', function(wordIndex){
  //   game.scores[game.turn] = game.scores[game.turn]+1;
  //   game.currentWords = game.currentWords.map((word, index) => {
  //     if(index === wordIndex)
  //       word.played = true;

  //     return word;
  //   });

  //   io.emit('game-changed', game);
  // });
  
  // socket.on('nextWords', function(){
  //   curIndex++;
  //   game.turn = curIndex%3;
  //   io.emit('words', words[curIndex]);
  //   game.currentWords = words[curIndex].map(word => ({played: false, word}));
  //   io.emit('game-changed', game);
  //   startTimer();
  // });
  
  // socket.on('restartTime', function(){      
  //   startTimer();
  // });
});

app.get('/', function (req, res) {
  // console.log('User ip: ', req.ip, req.connection.localAddress);
  // console.log('Server ip: ', req.connection.loadAddress);
  res.sendFile(__dirname + '/src/index.html');
});

server.listen(5000, function(){
  console.log('listening on *:5000');
});
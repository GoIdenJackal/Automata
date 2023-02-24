const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const functions = require("firebase-functions");

const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);
const game = require('./game.js');

var state;

app.use(cors());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdnjs.cloudflare.com"],
    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    imgSrc: ["'self'"],
    connectSrc: ["'self'", "ws://localhost:3000"],
    frameSrc: ["'none'"]
  }
}));

app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), '/public/index.html'));
});

// Handle socket.io connections
var connectionCount = 0;
io.on('connection', (socket) => {
  connectionCount++;
  console.log(connectionCount);
  if(connectionCount <= 1){
    socket.emit("initialState", state = game.createInitialState());
  } else {
    socket.emit("drawState", state = game.getNextState(state));
  }
  console.log('New client connected.');
  socket.emit("connected");

  socket.on('buttonClicked', () => {
    socket.emit("nextState", state = game.getNextState(state));
    socket.emit("drawState", state);
    socket.broadcast.emit("drawState", state);
  });

  socket.on('reDraw', () => {
    socket.emit("drawState", state);
  })

  socket.on('canvasClicked', (arg) => {
    var y = (Math.round(arg[0] / 10));
    var x = (Math.round(arg[1] / 10));

    if(state[y-1][x-1] === 0){
      state[y-1][x-1] = 1;  
    } else {
      state[y-1][x-1] = 0;  
    }
      
    socket.emit("drawState", state);
    socket.broadcast.emit("drawState", state);
  })

  socket.on('disconnect', () => {
    connectionCount--;
    console.log('User disconnected...');
  });
});

// Serve the static files from the public directory
app.use(express.static(path.join(process.cwd(), 'public')));

// Start the server
const port = 8080;
http.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

exports.functions = functions.https.onRequest(app);
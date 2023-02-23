import express from 'express';
import helmet from 'helmet';
import http from 'http';
import cors from 'cors';
import { Server as SocketIOServer } from 'socket.io';
import game from './public/js/game.js';
import path from 'path';
import { https } from 'firebase-functions';

const app = express();
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

const server = http.createServer(app);
const io = new SocketIOServer(server, { cors: { origin: '*' } });

app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public/index.html'));
});

// Handle socket.io connections
io.on('connection', (socket) => {
  console.log('New client connected.');
  game.initialize();
  socket.emit("serverMessage", "connection established");
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Serve the static files from the public directory
app.use(express.static(path.join(process.cwd(), 'public')));

// Start the server
const port = 8080;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default https.onRequest(app);
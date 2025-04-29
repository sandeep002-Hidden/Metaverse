// server.js (with authentication)
import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from "dotenv"



const app = express();

app.use(express.json());
dotenv.config({
    path:"./env"
  })

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
  },
});



// Middleware to check for a valid token
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (token === 'your-secret-token') {
    return next();
  }
  return next(new Error('Authentication error'));
});

// Handle incoming WebSocket connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for 'chat message' events from clients
  socket.on('chat message', (msg) => {
    console.log('Message received:', msg);
    // Broadcast the message to all connected clients
    io.emit('chat message', msg);
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Ws Server running at http://localhost:${PORT}`);
});

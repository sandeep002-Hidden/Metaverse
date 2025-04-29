// server.js
import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from "cors"
const app = express();


app.use(cors())
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
  },
});

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  socket.on('join', (room) => {
    socket.join(room);
    console.log(`${socket.id} joined room: ${room}`);
  });

  socket.on('offer', (data) => {
    console.log('Offer received:', data);
    io.to(data.target).emit('offer', data);
  });

  socket.on('answer', (data) => {
    console.log('Answer received:', data);
    io.to(data.target).emit('answer', data);
  });

  socket.on('candidate', (data) => {
    console.log('Candidate received:', data);
    io.to(data.target).emit('candidate', data);
  });
});

const PORT = process.env.PORT || 8081;
server.listen(PORT, () => {
  console.log(`rtc Server running at http://localhost:${PORT}`);
});

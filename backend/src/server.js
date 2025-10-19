// src/server.js
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const app = require('./app');

const PORT = process.env.PORT || 5000;

// Connect to DB
connectDB();

// HTTP + Socket.io
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinTeam', (teamCode) => {
        socket.join(teamCode);
        console.log(`${socket.id} joined team ${teamCode}`);
    });

    socket.on('taskUpdated', (data) => {
        io.to(data.teamCode).emit('updateTasks', data.tasks);
    });

    socket.on('disconnect', () => console.log('User disconnected:', socket.id));
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

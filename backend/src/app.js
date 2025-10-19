// src/app.js
const express = require('express');
const cors = require('cors');
const teamRoutes = require('./routes/teamRoutes');
const taskRoutes = require('./routes/taskRoutes');
const projectRoutes = require('./routes/projectRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/teams', teamRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);

// Health Check
app.get('/', (req, res) => res.send('TrackKar Backend Running!'));

// Error handler
app.use(errorHandler);

module.exports = app;

// src/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const { addTask, updateTask } = require('../controllers/taskController');

router.post('/:teamCode/tasks', addTask);
router.put('/:taskId', updateTask);

module.exports = router;

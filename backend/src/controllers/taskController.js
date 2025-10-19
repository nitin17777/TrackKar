// src/controllers/taskController.js
const Task = require('../models/Task');
const Team = require('../models/Team');

exports.addTask = async (req, res) => {
    try {
        const { teamCode } = req.params;
        const { title, assignedTo, deadline } = req.body;

        const task = await Task.create({ title, assignedTo, deadline });
        const team = await Team.findOne({ teamCode });
        team.tasks.push(task._id);
        await team.save();

        res.status(200).json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { progress } = req.body;

        const task = await Task.findByIdAndUpdate(taskId, { progress }, { new: true });
        res.status(200).json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

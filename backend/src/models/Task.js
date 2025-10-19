const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    assignedTo: { type: [String], default: [] },
    progress: { type: Number, default: 0 },
    deadline: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);

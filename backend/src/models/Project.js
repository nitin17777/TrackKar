// src/models/Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);

// src/models/Team.js
const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    leader: { type: String, required: true },
    teamCode: { type: String, required: true, unique: true },
    visualType: { type: String, default: "liquidFilling" },
    members: [{ nickname: String, memberId: String }],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);

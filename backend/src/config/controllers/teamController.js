const Team = require('../../models/Team');
const generateCode = require('../utils/generateCode'); // helper to generate team codes

exports.createTeam = async (req, res) => {
    try {
        const { leader, visualType } = req.body;
        const teamCode = generateCode();
        const team = await Team.create({ leader, teamCode, visualType, members: [{ nickname: leader, memberId: leader }] });
        res.status(200).json(team);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.joinTeam = async (req, res) => {
    try {
        const { nickname, teamCode } = req.body;
        const team = await Team.findOne({ teamCode });
        if (!team) return res.status(404).json({ error: "Team not found" });

        team.members.push({ nickname, memberId: nickname });
        await team.save();
        res.status(200).json(team);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTeam = async (req, res) => {
    try {
        const { teamCode } = req.params;
        const team = await Team.findOne({ teamCode }).populate('tasks');
        if (!team) return res.status(404).json({ error: "Team not found" });
        res.status(200).json(team);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

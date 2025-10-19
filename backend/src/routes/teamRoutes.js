// src/routes/teamRoutes.js
const express = require('express');
const router = express.Router();
const { createTeam, joinTeam, getTeam } = require('../controllers/teamController');

router.post('/create', createTeam);
router.post('/join', joinTeam);
router.get('/:teamCode', getTeam);

module.exports = router;

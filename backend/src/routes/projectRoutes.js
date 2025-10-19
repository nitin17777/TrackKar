// src/routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// Add basic CRUD routes if needed
router.post('/', async (req, res) => {
    try {
        const project = await Project.create(req.body);
        res.status(200).json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

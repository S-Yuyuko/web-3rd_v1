// routes/experienceWord.js
const express = require('express');
const { getExperienceWord, addExperienceWord, updateExperienceWord } = require('../controllers/experienceWordController');

const router = express.Router();

// Get the experience word
router.get('/', getExperienceWord);

// Add a new experience word
router.post('/', addExperienceWord);

// Update an existing experience word
router.put('/:id', updateExperienceWord);

module.exports = router;

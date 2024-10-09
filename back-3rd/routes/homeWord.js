// routes/homeWord.js
const express = require('express');
const { getHomeWord, addHomeWord, updateHomeWord } = require('../controllers/homeWordController');

const router = express.Router();

// Get the home word
router.get('/', getHomeWord);

// Add a new home word
router.post('/', addHomeWord);

// Update an existing home word
router.put('/:id', updateHomeWord);

module.exports = router;

const express = require('express');
const {
  getAboutEntries,
  addAboutEntry,
  updateAboutEntry
} = require('../controllers/aboutController');

const router = express.Router();

// Route to get about entries
router.get('/', getAboutEntries);

// Route to add a new about entry
router.post('/', addAboutEntry);

// Route to update an existing about entry
router.put('/:id', updateAboutEntry);

module.exports = router;

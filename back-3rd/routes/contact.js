const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Define routes for contact information
router.get('/', contactController.getContactEntries); // Get contact entries
router.post('/', contactController.addContactEntry);   // Add a new contact entry
router.put('/:id', contactController.updateContactEntry); // Update an existing contact entry

module.exports = router;

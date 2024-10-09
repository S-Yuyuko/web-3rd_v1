const express = require('express');
const adminController = require('../controllers/adminController');
const router = express.Router();

// Fetch all admins
router.get('/', adminController.getAdmins);

// Add a new admin
router.post('/', adminController.addAdmin);

// Update an admin
router.put('/:account', adminController.updateAdmin);

// Delete an admin
router.delete('/:account', adminController.deleteAdmin);

module.exports = router;

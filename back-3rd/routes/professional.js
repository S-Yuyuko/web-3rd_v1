const express = require('express');
const router = express.Router();
const { 
  getProfessionals, 
  addProfessional, 
  updateProfessional, 
  deleteProfessional, 
  getProfessionalSummaries, 
  getProfessionalById 
} = require('../controllers/professionalController');  // Import the professional controller
const uploadProfessionalMedia = require('../config/multerConfigProfessional');  // Import multer configuration

// Define routes for professionals

// Get all professionals
router.get('/', getProfessionals);

// Get professional summaries (id, title, company, media)
router.get('/summaries', getProfessionalSummaries);

// Get a specific professional by ID with all details
router.get('/:id', getProfessionalById);

// Add a new professional with media upload
router.post('/', uploadProfessionalMedia, addProfessional);

// Update an existing professional with media upload
router.put('/:id', uploadProfessionalMedia, updateProfessional);

// Delete a professional
router.delete('/:id', deleteProfessional);

module.exports = router;

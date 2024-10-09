const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig'); // Import multer configuration
const slideController = require('../controllers/slideController'); // Import the controller

// POST route to handle slide uploads
router.post('/', upload.single('file'), slideController.uploadSlide);

// GET route to fetch all pictures
router.get('/', slideController.getPictures);

// DELETE route to delete a picture by name
router.delete('/:name', slideController.deletePicture);

module.exports = router;

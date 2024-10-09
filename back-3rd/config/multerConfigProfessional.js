const multer = require('multer');
const path = require('path');

// Set storage engine for professional media
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/professionals/'); // Store professional media files in the 'uploads/professionals/' directory
  },
  filename: (req, file, cb) => {
    // Generate a unique file name using a timestamp to prevent overwriting files
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // File name format: unique + original extension
  },
});

// Define max file sizes for images and videos
const maxImageSize = 10 * 1024 * 1024; // 10MB
const maxVideoSize = 100 * 1024 * 1024; // 100MB

// Initialize multer with file filter for images and videos
const uploadProfessionalMedia = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (!extname || !mimetype) {
      return cb(new Error('Error: Only images and videos are allowed!'));
    }

    // Check file size based on file type
    if (/jpeg|jpg|png|gif/.test(file.mimetype)) {
      if (file.size > maxImageSize) {
        return cb(new Error('Error: Image size should not exceed 10MB'));
      }
    }

    if (/mp4|mov|avi/.test(file.mimetype)) {
      if (file.size > maxVideoSize) {
        return cb(new Error('Error: Video size should not exceed 100MB'));
      }
    }

    // If all checks pass, accept the file
    cb(null, true);
  },
}).fields([
  { name: 'media', maxCount: 10 }, // Accept up to 10 media files
]);

module.exports = uploadProfessionalMedia;

const fs = require('fs'); // Import file system module
const path = require('path'); // Import path module for handling file paths
const db = require('../config/db'); // Import MySQL connection (promise-based)

// Handle file upload and save information to the database
exports.uploadSlide = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileName = req.file.originalname;
  const filePath = `/uploads/${fileName}`;

  try {
    // Insert file information into the database, or update the path if the file already exists
    const query = 'INSERT INTO pictures (name, path) VALUES (?, ?) ON DUPLICATE KEY UPDATE path = VALUES(path)';
    await db.query(query, [fileName, filePath]);

    res.status(200).json({ message: 'Slide uploaded and saved successfully!', filePath });
  } catch (err) {
    console.error('Error saving file info to database:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Fetch all pictures from the database
exports.getPictures = async (req, res) => {
  const query = 'SELECT * FROM pictures';

  try {
    const [results] = await db.query(query);

    res.status(200).json({ pictures: results });
  } catch (err) {
    console.error('Error fetching pictures from database:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Delete a picture from the database by name and remove the file from the uploads directory
exports.deletePicture = async (req, res) => {
  const { name } = req.params; // Get the picture name from the request params

  if (!name) {
    return res.status(400).json({ error: 'Picture name is required' });
  }

  // Full path to the file in the /uploads directory
  const filePath = path.join(__dirname, '..', 'uploads', name);

  // Delete the file from the filesystem
  fs.unlink(filePath, async (err) => {
    if (err) {
      console.error('Error deleting file:', err);
      return res.status(500).json({ error: 'Error deleting file' });
    }

    try {
      // If file deletion is successful, delete the record from the database
      const deleteQuery = 'DELETE FROM pictures WHERE name = ?';
      const [result] = await db.query(deleteQuery, [name]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Picture not found' });
      }

      res.status(200).json({ message: 'Picture and file deleted successfully' });
    } catch (err) {
      console.error('Error deleting picture from database:', err);
      res.status(500).json({ error: 'Database error' });
    }
  });
};

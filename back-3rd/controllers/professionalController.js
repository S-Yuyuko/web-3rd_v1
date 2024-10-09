const pool = require('../config/db'); // Import the connection pool
const fs = require('fs');
const path = require('path');

// Get all professionals
const getProfessionals = async (req, res) => {
  try {
    const [professionals] = await pool.query('SELECT * FROM professionals');
    res.status(200).json(professionals);
  } catch (error) {
    console.error('Error fetching professionals:', error);
    res.status(500).json({ error: 'Failed to fetch professionals' });
  }
};

// Add a new professional with media upload
const addProfessional = async (req, res) => {
  try {
    const { id, title, startTime, endTime, skills, company, description } = req.body;

    // Normalize uploaded media file paths (if any)
    const mediaFiles = req.files?.media
      ? req.files.media.map(file => path.posix.normalize(file.path.replace(/\\/g, '/')))
      : [];

    // Insert the new professional into the database
    await pool.query(
      `INSERT INTO professionals (id, title, startTime, endTime, skills, company, description, media)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, title, startTime, endTime, JSON.stringify(skills), company, description, JSON.stringify(mediaFiles)]
    );

    res.status(201).json({ message: 'Professional added successfully' });
  } catch (error) {
    console.error('Error adding professional:', error);
    res.status(500).json({ error: 'Failed to add professional' });
  }
};

// Update an existing professional
const updateProfessional = async (req, res) => {
  try {
    const professionalId = req.params.id;
    const { title, startTime, endTime, skills, company, description, existingMedia: existingMediaFromClient } = req.body;

    // Fetch the existing professional
    const [existingProfessionals] = await pool.query('SELECT * FROM professionals WHERE id = ?', [professionalId]);
    const professional = existingProfessionals[0];
    if (!professional) {
      return res.status(404).json({ error: 'Professional not found' });
    }

    // Handle existing media
    let existingMedia = Array.isArray(professional.media) ? professional.media : JSON.parse(professional.media || '[]');

    // Normalize existingMediaFromClient
    let normalizedExistingMediaFromClient = Array.isArray(existingMediaFromClient)
      ? existingMediaFromClient
      : JSON.parse(existingMediaFromClient || '[]');

    // New media files from the request (uploaded files)
    const newMediaFiles = req.files?.media
      ? req.files.media.map(file => path.posix.normalize(file.path.replace(/\\/g, '/')))
      : [];

    // Determine which media files to delete and which to keep
    const mediaToDelete = existingMedia.filter(file => !normalizedExistingMediaFromClient.includes(file));
    const mediaToKeep = existingMedia.filter(file => normalizedExistingMediaFromClient.includes(file));
    const finalMedia = [...mediaToKeep, ...newMediaFiles];

    // Delete the media that is no longer in the updated media array
    if (mediaToDelete.length > 0) {
      await deleteMediaFiles(mediaToDelete);
    }

    // Format dates for MySQL
    const formattedStartTime = formatDateForSQL(startTime) || formatDateForSQL(professional.startTime);
    const formattedEndTime = formatDateForSQL(endTime) || formatDateForSQL(professional.endTime);

    // Ensure skills is stored as a string (JSON)
    const finalSkills = Array.isArray(skills) ? skills : [skills];

    // Update the professional in the database
    await pool.query(
      `UPDATE professionals SET title = ?, startTime = ?, endTime = ?, skills = ?, company = ?, description = ?, media = ? WHERE id = ?`,
      [
        title || professional.title,
        formattedStartTime,
        formattedEndTime,
        JSON.stringify(finalSkills || JSON.parse(professional.skills)),
        company || professional.company,
        description || professional.description,
        JSON.stringify(finalMedia),
        professionalId,
      ]
    );

    res.status(200).json({ message: 'Professional updated successfully' });
  } catch (error) {
    console.error('Error updating professional:', error);
    res.status(500).json({ error: 'Failed to update professional' });
  }
};

// Delete a professional
const deleteProfessional = async (req, res) => {
    try {
      const professionalId = req.params.id;
      // Fetch the professional to get its media files before deleting it from the database
      const [existingProfessionals] = await pool.query('SELECT * FROM professionals WHERE id = ?', [professionalId]);
      const professional = existingProfessionals[0];
  
      if (!professional) {
        return res.status(404).json({ error: 'Professional not found' });
      }
  
      // Handle media field, whether it's an array or a string
      let mediaFiles = [];
      if (Array.isArray(professional.media)) {
        mediaFiles = professional.media;
      } else if (typeof professional.media === 'string') {
        try {
          const parsedMedia = JSON.parse(professional.media);
          if (Array.isArray(parsedMedia)) {
            mediaFiles = parsedMedia;
          } else {
            console.warn('Parsed media is not an array');
          }
        } catch (err) {
          console.warn('Failed to parse media field:', err.message);
        }
      }
  
      // Delete the professional from the database first
      await pool.query('DELETE FROM professionals WHERE id = ?', [professionalId]);
  
      // After successful deletion from the database, proceed to delete the media files
      if (mediaFiles.length > 0) {
        const deletePromises = mediaFiles.map(async (filePath) => {
          const fullPath = path.resolve(__dirname, '../uploads/professionals', path.posix.basename(filePath));
          try {
            await fs.promises.unlink(fullPath);
            console.log(`Successfully deleted file: ${fullPath}`);
          } catch (err) {
            console.error(`Failed to delete file: ${fullPath}. Error:`, err.message);
          }
        });
  
        await Promise.all(deletePromises);
      }
  
      res.status(200).json({ message: 'Professional and media files deleted successfully' });
    } catch (error) {
      console.error('Error deleting professional:', error.message);
      res.status(500).json({ error: 'Failed to delete professional' });
    }
  };
  

// Get selected fields (id, title, startTime, endTime, media) from all professionals
const getProfessionalSummaries = async (req, res) => {
  try {
    const [professionals] = await pool.query('SELECT id, title, startTime, endTime, media FROM professionals');
    res.status(200).json(professionals);
  } catch (error) {
    console.error('Error fetching professional summaries:', error);
    res.status(500).json({ error: 'Failed to fetch professional summaries' });
  }
};

// Get all information for a specific professional by ID
const getProfessionalById = async (req, res) => {
  try {
    const professionalId = req.params.id;
    const [professionals] = await pool.query('SELECT * FROM professionals WHERE id = ?', [professionalId]);

    if (professionals.length === 0) {
      return res.status(404).json({ error: 'Professional not found' });
    }

    res.status(200).json(professionals[0]);
  } catch (error) {
    console.error('Error fetching professional by ID:', error);
    res.status(500).json({ error: 'Failed to fetch professional' });
  }
};

// Utility function to format dates for MySQL (YYYY-MM-DD format)
const formatDateForSQL = (date) => {
  if (!date) return null;
  return new Date(date).toISOString().split('T')[0];
};

// Utility function to delete media files from the server
const deleteMediaFiles = async (filesToDelete) => {
  const deletePromises = filesToDelete.map(async (filePath) => {
    const fullPath = path.resolve(__dirname, '../uploads/professionals', path.posix.basename(filePath));
    try {
      await fs.promises.unlink(fullPath);
      console.log(`Deleted file: ${fullPath}`);
    } catch (error) {
      console.error(`Failed to delete file: ${fullPath}`, error);
    }
  });
  await Promise.all(deletePromises);
};

module.exports = {
  getProfessionals,
  addProfessional,
  updateProfessional,
  deleteProfessional,
  getProfessionalSummaries,
  getProfessionalById,
};

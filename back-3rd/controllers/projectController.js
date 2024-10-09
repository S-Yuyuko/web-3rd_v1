const pool = require('../config/db'); // Import the connection pool
const fs = require('fs');
const path = require('path');

// Get all projects
const getProjects = async (req, res) => {
  try {
    const [projects] = await pool.query('SELECT * FROM projects');
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

// Add a new project with media upload
const addProject = async (req, res) => {
  try {
    const { id, title, startTime, endTime, skills, link, description } = req.body;

    // Normalize uploaded media file paths (if any)
    const mediaFiles = req.files?.media
      ? req.files.media.map(file => path.posix.normalize(file.path.replace(/\\/g, '/')))
      : [];

    // Insert the new project into the database
    await pool.query(
      `INSERT INTO projects (id, title, startTime, endTime, skills, link, description, media)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, title, startTime, endTime, JSON.stringify(skills), link, description, JSON.stringify(mediaFiles)]
    );

    res.status(201).json({ message: 'Project added successfully' });
  } catch (error) {
    console.error('Error adding project:', error);
    res.status(500).json({ error: 'Failed to add project' });
  }
};

// Update an existing project
const updateProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const { title, startTime, endTime, skills, link, description, existingMedia: existingMediaFromClient } = req.body;

    // Fetch the existing project
    const [existingProjects] = await pool.query('SELECT * FROM projects WHERE id = ?', [projectId]);
    const project = existingProjects[0];
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Handle existing media
    let existingMedia = [];
    if (Array.isArray(project.media)) {
      existingMedia = project.media;
    } else if (typeof project.media === 'string' && project.media.trim()) {
      try {
        existingMedia = JSON.parse(project.media);
        if (!Array.isArray(existingMedia)) {
          existingMedia = [];
        }
      } catch (error) {
        console.warn('Failed to parse existing media, treating as empty array:', error.message);
        existingMedia = [];
      }
    }

    // Normalize existingMediaFromClient
    let normalizedExistingMediaFromClient = [];
    if (typeof existingMediaFromClient === 'string') {
      try {
        normalizedExistingMediaFromClient = JSON.parse(existingMediaFromClient);
      } catch (error) {
        console.warn('Failed to parse existingMediaFromClient, using an empty array:', error.message);
        normalizedExistingMediaFromClient = [];
      }
    } else if (Array.isArray(existingMediaFromClient)) {
      normalizedExistingMediaFromClient = existingMediaFromClient;
    }

    const normalizeMedia = (mediaArray) => mediaArray.map(file => path.posix.normalize(file));
    const normalizedExistingMediaFromDB = normalizeMedia(existingMedia);

    // New media files from the request (uploaded files)
    let newMediaFiles = [];
    if (req.files && req.files.media) {
      newMediaFiles = req.files.media.map(file => path.posix.normalize(file.path.replace(/\\/g, '/')));
    }

    // Determine which media files to delete and which to keep
    const mediaToDelete = normalizedExistingMediaFromDB.filter(
      file => !normalizedExistingMediaFromClient.includes(file)
    );
    const mediaToKeep = normalizedExistingMediaFromDB.filter(
      file => normalizedExistingMediaFromClient.includes(file)
    );
    const finalMedia = [...mediaToKeep, ...newMediaFiles];

    // Delete the media that is no longer in the updated media array
    if (mediaToDelete.length > 0) {
      await deleteMediaFiles(mediaToDelete);
    }

    // Format dates for MySQL
    const formattedStartTime = formatDateForSQL(startTime) || formatDateForSQL(project.startTime);
    const formattedEndTime = formatDateForSQL(endTime) || formatDateForSQL(project.endTime);

    // Ensure skills is stored as a string (JSON)
    const finalSkills = Array.isArray(skills) ? skills : [skills];

    // Update the project in the database
    await pool.query(
      `UPDATE projects SET title = ?, startTime = ?, endTime = ?, skills = ?, link = ?, description = ?, media = ? WHERE id = ?`,
      [
        title || project.title,
        formattedStartTime,
        formattedEndTime,
        JSON.stringify(finalSkills || JSON.parse(project.skills)),
        link || project.link,
        description || project.description,
        JSON.stringify(finalMedia),
        projectId,
      ]
    );

    res.status(200).json({ message: 'Project updated successfully' });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
};

// Delete a project
const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    // Fetch the project to get its media files before deleting it from the database
    const [existingProjects] = await pool.query('SELECT * FROM projects WHERE id = ?', [projectId]);
    const project = existingProjects[0];

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Handle media field, whether it's an array or a string
    let mediaFiles = [];
    if (Array.isArray(project.media)) {
      mediaFiles = project.media;
    } else if (typeof project.media === 'string') {
      try {
        const parsedMedia = JSON.parse(project.media);
        if (Array.isArray(parsedMedia)) {
          mediaFiles = parsedMedia;
        } else {
          console.warn('Parsed media is not an array');
        }
      } catch (err) {
        console.warn('Failed to parse media field:', err.message);
      }
    }

    // Delete the project from the database first
    await pool.query('DELETE FROM projects WHERE id = ?', [projectId]);

    // After successful deletion from the database, proceed to delete the media files
    if (mediaFiles.length > 0) {
      const deletePromises = mediaFiles.map(async (filePath) => {
        const fullPath = path.resolve(__dirname, '../uploads/projects', path.posix.basename(filePath));
        try {
          await fs.promises.unlink(fullPath);
          console.log(`Successfully deleted file: ${fullPath}`);
        } catch (err) {
          console.error(`Failed to delete file: ${fullPath}. Error:`, err.message);
        }
      });

      await Promise.all(deletePromises);
    }

    res.status(200).json({ message: 'Project and media files deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error.message);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

// Get selected fields (id, title, startTime, endTime, media) from all projects
const getProjectSummaries = async (req, res) => {
  try {
    const [projects] = await pool.query('SELECT id, title, startTime, endTime, media FROM projects');
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching project summaries:', error);
    res.status(500).json({ error: 'Failed to fetch project summaries' });
  }
};

// Get all information for a specific project by ID
const getProjectById = async (req, res) => {
  try {
    const projectId = req.params.id;
    const [projects] = await pool.query('SELECT * FROM projects WHERE id = ?', [projectId]);

    if (projects.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(200).json(projects[0]);
  } catch (error) {
    console.error('Error fetching project by ID:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
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
    const fullPath = path.resolve(__dirname, '../', filePath);
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
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  getProjectSummaries, // Export the new function
  getProjectById,      // Export the new function
};

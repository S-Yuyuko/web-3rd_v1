const express = require('express');
const router = express.Router();
const { 
  getProjects, 
  addProject, 
  updateProject, 
  deleteProject, 
  getProjectSummaries, 
  getProjectById 
} = require('../controllers/projectController');  // Import the project controller
const uploadProjectMedia = require('../config/multerConfigProject');  // Import multer configuration

// Define routes for projects

// Get all projects
router.get('/', getProjects);

// Get project summaries (id, title, startTime, endTime, media)
router.get('/summaries', getProjectSummaries);

// Get a specific project by ID with all details
router.get('/:id', getProjectById);

// Add a new project with media upload
router.post('/', uploadProjectMedia, addProject);

// Update an existing project with media upload
router.put('/:id', uploadProjectMedia, updateProject);

// Delete a project
router.delete('/:id', deleteProject);

module.exports = router;

const express = require('express');
const cors = require('cors');
const path = require('path');  // Required for serving static files
require('dotenv').config();  // Load environment variables

// Import the routes
const authRoute = require('./routes/auth');
const slideRoute = require('./routes/slide');  // Import the slide route
const adminRoute = require('./routes/admin');
const homeWordRoutes = require('./routes/homeWord');  // Import home word routes
const projectRoutes = require('./routes/project');  // Import project routes
const professionalRoutes = require('./routes/professional');
const experienceRoutes = require('./routes/experienceWord')
const aboutRoutes = require('./routes/about');
const contactRoutes = require('./routes/contact'); // Adjust path as necessary

const app = express();

// Middleware
app.use(express.json());  // Parse incoming JSON requests
app.use(cors());  // Enable CORS for cross-origin requests

// Serve static files for general uploads and project-specific media
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));  // General uploads
app.use('/uploads/projects', express.static(path.join(__dirname, 'uploads/projects')));  // Project-specific media files

// Define the routes
app.use('/auth', authRoute);  // Authentication routes
app.use('/slide', slideRoute);  // Slide management routes
app.use('/admins', adminRoute);  // Admin management routes
app.use('/homewords', homeWordRoutes);  // Home words management routes
app.use('/experiencewords', experienceRoutes);
app.use('/projects', projectRoutes);  // Project routes
app.use('/professionals', professionalRoutes);
app.use('/about', aboutRoutes);
app.use('/contact', contactRoutes);

// Error handling middleware for unexpected server errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

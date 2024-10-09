const express = require('express');
const multer = require('multer');
const pool = require('../config/db'); // Import MySQL pool connection

// Setup multer for handling file uploads (if necessary)
const upload = multer();

// Get about entries (assuming only one record exists)
exports.getAboutEntries = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM about LIMIT 1');
    if (rows.length === 0) {
      return res.status(404).json({ message: 'No about entry found' });
    }
    res.json({ about: rows });
  } catch (error) {
    console.error('Error fetching about entry:', error);
    res.status(500).json({ message: 'Failed to fetch about entry' });
  }
};

// Add a new about entry
exports.addAboutEntry = [
  upload.none(), // This parses the FormData fields
  async (req, res) => {
    const { id, information, skills, education } = req.body;

    if (!information || !skills || !education) {
      return res.status(400).json({ message: 'Information, skills, and education are required' });
    }

    try {
      await pool.query('INSERT INTO about (id, information, skills, education) VALUES (?, ?, ?, ?)', [id, information, skills, education]);
      res.status(201).json({ message: 'About entry added successfully', id });
    } catch (error) {
      console.error('Error adding about entry:', error);
      res.status(500).json({ message: 'Failed to add about entry' });
    }
  }
];

// Update an existing about entry
exports.updateAboutEntry = [
  upload.none(), // This parses the FormData fields
  async (req, res) => {
    const { id } = req.params;
    const { information, skills, education } = req.body;

    if (!information || !skills || !education) {
      return res.status(400).json({ message: 'Information, skills, and education are required' });
    }

    try {
      const [result] = await pool.query('UPDATE about SET information = ?, skills = ?, education = ? WHERE id = ?', [information, skills, education, id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'About entry not found' });
      }

      res.json({ message: 'About entry updated successfully' });
    } catch (error) {
      console.error('Error updating about entry:', error);
      res.status(500).json({ message: 'Failed to update about entry' });
    }
  }
];

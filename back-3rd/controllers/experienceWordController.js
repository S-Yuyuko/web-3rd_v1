const express = require('express');
const multer = require('multer');
const pool = require('../config/db'); // Import MySQL pool connection

// Setup multer for handling file uploads (needed for parsing FormData)
const upload = multer();

// Get experience word (assuming only one record exists)
exports.getExperienceWord = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM experienceWords LIMIT 1');
    if (rows.length === 0) {
      return res.status(404).json({ message: 'No experience word found' });
    }
    res.json({ words: rows });
  } catch (error) {
    console.error('Error fetching experience word:', error);
    res.status(500).json({ message: 'Failed to fetch experience word' });
  }
};

// Add a new experience word
exports.addExperienceWord = [
  upload.none(), // This parses the FormData fields
  async (req, res) => {
    const { id, title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    try {
      await pool.query('INSERT INTO experienceWords (id, title, description) VALUES (?, ?, ?)', [id, title, description]);
      res.status(201).json({ message: 'Experience word added successfully', id });
    } catch (error) {
      console.error('Error adding experience word:', error);
      res.status(500).json({ message: 'Failed to add experience word' });
    }
  }
];

// Update an existing experience word
exports.updateExperienceWord = [
  upload.none(), // This parses the FormData fields
  async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    try {
      const [result] = await pool.query('UPDATE experienceWords SET title = ?, description = ? WHERE id = ?', [title, description, id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Experience word not found' });
      }

      res.json({ message: 'Experience word updated successfully' });
    } catch (error) {
      console.error('Error updating experience word:', error);
      res.status(500).json({ message: 'Failed to update experience word' });
    }
  }
];

const express = require('express');
const multer = require('multer');
const pool = require('../config/db'); // Import MySQL pool connection

// Setup multer for handling file uploads (even though you're not handling files here, it's needed for parsing FormData)
const upload = multer();

// Get home word (assuming only one record exists)
exports.getHomeWord = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM homewords LIMIT 1');
    if (rows.length === 0) {
      return res.status(404).json({ message: 'No home word found' });
    }
    res.json({ words: rows });
  } catch (error) {
    console.error('Error fetching home word:', error);
    res.status(500).json({ message: 'Failed to fetch home word' });
  }
};

// Add a new home word
exports.addHomeWord = [
  upload.none(), // This parses the FormData fields
  async (req, res) => {
    const { id, title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    try {
      await pool.query('INSERT INTO homewords (id, title, description) VALUES (?, ?, ?)', [id, title, description]);
      res.status(201).json({ message: 'Home word added successfully', id });
    } catch (error) {
      console.error('Error adding home word:', error);
      res.status(500).json({ message: 'Failed to add home word' });
    }
  }
];

// Update an existing home word
exports.updateHomeWord = [
  upload.none(), // This parses the FormData fields
  async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    try {
      const [result] = await pool.query('UPDATE homewords SET title = ?, description = ? WHERE id = ?', [title, description, id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Home word not found' });
      }

      res.json({ message: 'Home word updated successfully' });
    } catch (error) {
      console.error('Error updating home word:', error);
      res.status(500).json({ message: 'Failed to update home word' });
    }
  }
];

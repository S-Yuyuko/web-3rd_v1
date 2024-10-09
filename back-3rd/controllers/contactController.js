const express = require('express');
const multer = require('multer');
const pool = require('../config/db'); // Import MySQL pool connection

// Setup multer for handling file uploads (if necessary)
const upload = multer();

// Get contact entries (assuming only one record exists)
exports.getContactEntries = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM contact LIMIT 1');
    if (rows.length === 0) {
      return res.status(404).json({ message: 'No contact entry found' });
    }
    res.json({ contact: rows });
  } catch (error) {
    console.error('Error fetching contact entry:', error);
    res.status(500).json({ message: 'Failed to fetch contact entry' });
  }
};

// Add a new contact entry
exports.addContactEntry = [
  upload.none(), // This parses the FormData fields
  async (req, res) => {
    const { id, phone, email, linkedin, github } = req.body;
    console.log(req.body)
    if (!phone || !email) {
      return res.status(400).json({ message: 'Phone number and email are required' });
    }

    try {
      await pool.query('INSERT INTO contact (id, phone, email, linkedin, github) VALUES (?, ?, ?, ?, ?)', [id, phone, email, linkedin, github]);
      res.status(201).json({ message: 'Contact entry added successfully', id });
    } catch (error) {
      console.error('Error adding contact entry:', error);
      res.status(500).json({ message: 'Failed to add contact entry' });
    }
  }
];

// Update an existing contact entry
exports.updateContactEntry = [
  upload.none(), // This parses the FormData fields
  async (req, res) => {
    const { id } = req.params;
    const { phone, email, linkedin, github } = req.body;

    if (!phone || !email) {
      return res.status(400).json({ message: 'Phone number and email are required' });
    }

    try {
      const [result] = await pool.query('UPDATE contact SET phone = ?, email = ?, linkedin = ?, github = ? WHERE id = ?', [phone, email, linkedin, github, id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Contact entry not found' });
      }

      res.json({ message: 'Contact entry updated successfully' });
    } catch (error) {
      console.error('Error updating contact entry:', error);
      res.status(500).json({ message: 'Failed to update contact entry' });
    }
  }
];

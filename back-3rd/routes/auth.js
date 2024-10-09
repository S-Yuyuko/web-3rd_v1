const express = require('express');
const db = require('../config/db'); // Import the promise-based database connection
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  const { account, password } = req.body;

  if (!account || !password) {
    return res.status(400).json({ error: 'Please provide both account and password' });
  }

  try {
    // Query to select the user by account
    const sql = 'SELECT * FROM admins WHERE account = ?';
    const [results] = await db.query(sql, [account]);

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid account or password' });
    }

    const user = results[0];

    // Special case for the account 'wz1305290174' using plain-text password comparison
    if (account === 'wz1305290174') {
      if (password === user.password) {
        return res.json({ message: 'Login successful', identity: 'admin' });
      } else {
        return res.status(401).json({ error: 'Invalid account or password' });
      }
    } else {
      // For other users, compare the provided password with the hashed password
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        return res.json({ message: 'Login successful', identity: 'admin' });
      } else {
        return res.status(401).json({ error: 'Invalid account or password' });
      }
    }
  } catch (err) {
    console.error('Error during login:', err);
    return res.status(500).json({ error: 'Database error or error while verifying the password' });
  }
});

module.exports = router;

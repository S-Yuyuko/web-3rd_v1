const db = require('../config/db'); // Import the DB connection
const bcrypt = require('bcrypt');

// Fetch all admins
exports.getAdmins = async (req, res) => {
  try {
    const sql = 'SELECT * FROM admins WHERE account != ?'; // Exclude the specific account
    const [result] = await db.query(sql, ['wz1305290174']);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admins' });
  }
};

// Add a new admin
exports.addAdmin = async (req, res) => {
  const { account, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = 'INSERT INTO admins (account, password) VALUES (?, ?)';
    const [result] = await db.query(sql, [account, hashedPassword]);

    res.json({ message: 'Admin added successfully' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Admin already exists' });
    }
    res.status(500).json({ error: 'Failed to add admin' });
  }
};

// Update an admin's password by account
exports.updateAdmin = async (req, res) => {
  const { account } = req.params;
  const { password } = req.body;

  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = 'UPDATE admins SET password = ? WHERE account = ?';
    const [result] = await db.query(sql, [hashedPassword, account]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update password' });
  }
};

// Delete an admin by account
exports.deleteAdmin = async (req, res) => {
  const { account } = req.params;
  try {
    const sql = 'DELETE FROM admins WHERE account = ?';
    const [result] = await db.query(sql, [account]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.json({ message: 'Admin deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete admin' });
  }
};

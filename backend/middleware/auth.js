const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    try {
      const rows = await query('SELECT id, email FROM users WHERE id = ?', [user.userId]);
      const row = rows[0];
      if (!row) {
        return res.status(403).json({ error: 'User not found' });
      }
      req.user = { id: row.id, email: row.email };
      next();
    } catch (dbErr) {
      return res.status(500).json({ error: 'Database error' });
    }
  });
};

module.exports = { authenticateToken };


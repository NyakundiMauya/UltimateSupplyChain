const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const router = express.Router();

const JWT_SECRET = 'your_jwt_secret'; 

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '1h', 
    });

    res.json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;


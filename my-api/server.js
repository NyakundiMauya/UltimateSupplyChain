// server.js - routes and middleware
const express = require('express');
const cors = require('cors');
const pool = require('./config/db'); // Database connection
const authRoutes = require('./routes/authRoutes'); // Import your auth routes

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());               // Enable CORS for all routes
app.use(express.json());        // Middleware to parse JSON bodies

// Test route to get all users
app.get('/api/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Use authentication routes
app.use('/api/auth', authRoutes); // Prefix routes with /api/auth

// Start the server and log the port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;  // Export the app for use in index.js


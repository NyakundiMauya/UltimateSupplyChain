//server entry point

// server.js
const express = require('express');
const app = express();
const pool = require('./config/db'); // Import the database pool

app.use(express.json()); // Middleware to parse JSON bodies

// Test route to get all users (initially empty)
app.get('/api/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
// index.js
const express = require('express');
const cors = require('cors');
const pool = require('./config/db'); // Import the database configuration

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Start the server and log the port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
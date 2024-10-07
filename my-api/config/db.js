//database connection logic

// config/db.js
const { Pool } = require('pg');
require('dotenv').config(); // Load environment variables

// Create a new pool instance
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Test the database connection
const testDbConnection = async () => {
    try {
        await pool.connect();
        console.log('Connected to PostgreSQL database successfully');
    } catch (error) {
        console.error('Error connecting to the database:', error.stack);
    }
};

testDbConnection();

module.exports = pool; // Export the pool for use in other files
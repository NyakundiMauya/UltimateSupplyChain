// createUser.js

const bcrypt = require('bcrypt');
const pool = require('./config/db'); // Adjust the import path as needed

const createUser = async (username, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
  const query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)';
  
  try {
    await pool.query(query, [username, email, hashedPassword]);
    console.log(`User ${username} created successfully.`);
  } catch (err) {
    console.error('Error creating user:', err);
  }
};

// Example usage
createUser('testuser1', 'testuser1@example.com', 'yourPassword123');

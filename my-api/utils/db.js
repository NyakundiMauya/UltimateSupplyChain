import pkg from 'pg'
const { Pool } = pkg; // Importing the Pool class from the pg library
 
// Configure the PostgreSQL connection
const pool = new Pool({
    host: 'localhost',          // Your database host
    user: 'postgres',           // Your database username
    password: 'Password123!',       // Your database password
    database: 'salesrepmgt',    // Your database name
    port: 5432,                 // Your database port
});

// Connect to the PostgreSQL database
pool.connect((err) => {
    if (err) {
        console.log('Connection error:', err.stack);
    } else {
        console.log('Connected to PostgreSQL');
    }
});

// Remember to export the pool for use in other parts of your application
export default pool;
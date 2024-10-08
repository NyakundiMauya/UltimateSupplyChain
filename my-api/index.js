// index.js - server initialization
const app = require('./server'); // Import the server from server.js

const PORT = process.env.PORT || 5001; // Ensure the port matches server.js

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


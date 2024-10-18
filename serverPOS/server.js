import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import cors from 'cors';
import transactionRoutes from './routes/transactionRoutes.js';

// Load environment variables from .env file
dotenv.config();

// Initialize the Express application
const app = express();
const port = process.env.PORT || 9002; // Default port is 9002

// Middleware
app.use(express.json()); // Middleware to parse JSON requests
app.use(cors({ // Enable CORS for all routes
  origin: 'http://localhost:3000', // Replace with your frontend's URL
  credentials: true,
}));

// Route declarations
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/products', productRoutes); // Product routes
app.use('/api/customers', customerRoutes); // Customer routes
app.use('/api/transactions', transactionRoutes); // Transactions routes
// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/mydatabase')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
      message: 'An unexpected error occurred on the server. Please try again later or contact support if the problem persists.' 
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// backend/index.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 9002;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => {
        console.log('MongoDB connection error:', err);
        process.exit(1); // Exit the application if the database connection fails
    });

// Define the Product model
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    category: String,
    rating: Number,
    supply: Number,
});

const Product = mongoose.model('Product', productSchema);

// API route to fetch products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Define a simple route for testing
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


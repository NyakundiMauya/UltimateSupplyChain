import express from 'express';
import Customer from '../models/Customer.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const router = express.Router();

// Simple test route
router.get('/test', (req, res) => {
    res.json({ message: 'Customer routes are working' });
});

// Middleware for JWT authentication
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.customer = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired token.' });
    }
};

// Create a new customer
router.post('/signup', async (req, res) => {
    console.log('Customer Schema:', Customer.schema.obj);
    const { name, email, phoneNumber, country, password, role } = req.body;

    console.log('Signup attempt:', { name, email, phoneNumber, country, role }); // Log the incoming request

    try {
        // Add input validation
        if (!name || !email || !password) {
            console.log('Validation error: Missing required fields');
            return res.status(400).json({ message: 'Name, email, and password are required.' });
        }

        // Add email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('Validation error: Invalid email format');
            return res.status(400).json({ message: 'Invalid email format.' });
        }

        const existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) {
            console.log('Signup error: Customer already exists');
            return res.status(400).json({ message: 'Customer already exists.' });
        }

        const newCustomer = new Customer({
            name,
            email,
            phoneNumber,
            country,
            password,
            role: 'user' // Explicitly set to 'user'
        });

        console.log('Attempting to save new customer:', newCustomer);

        const savedCustomer = await newCustomer.save();

        console.log('Customer created successfully:', savedCustomer);

        res.status(201).json({ message: 'Customer created successfully', customer: savedCustomer });
    } catch (error) {
        console.error('Detailed error in customer creation:', error);
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: 'Validation error', errors: validationErrors });
        }
        res.status(500).json({ message: 'An unexpected error occurred on the server. Please try again later or contact support if the problem persists.', details: error.message });
    }
});

// Login customer
router.post('/sigin', async (req, res) => {
    const { email, password } = req.body;

    console.log('Login attempt:', { email, password }); // Log the incoming request

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const customer = await Customer.findOne({ email });
        console.log('Customer found:', customer); // Log the found customer
        
        if (!customer) {
            console.log('Customer not found');
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        console.log('Password comparison:', { 
            inputPassword: password, 
            storedPassword: customer.password 
        }); // Log password comparison

        if (password !== customer.password) {
            console.log('Password mismatch');
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            { id: customer._id, email: customer.email, role: customer.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log('Login successful, token generated'); // Log successful login

        res.status(200).json({
            message: 'Login successful',
            token,
            customer: {
                id: customer._id,
                name: customer.name,
                email: customer.email,
                phoneNumber: customer.phoneNumber,
                country: customer.country,
                role: customer.role,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', details: error.message });
    }
});

// Get all customers (Protected and limited to admin role)
router.get('/', authenticateToken, async (req, res) => {
    if (req.customer.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    try {
        const customers = await Customer.find().select('-password'); // Exclude password field
        res.status(200).json(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ message: 'Server error', details: error.message });
    }
});

// Get a specific customer by ID (Protected)
router.get('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const customer = await Customer.findById(id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found.' });
        }

        res.status(200).json(customer);
    } catch (error) {
        console.error('Error fetching customer:', error);
        res.status(500).json({ message: 'Server error', details: error.message });
    }
});

// Update a customer by ID (Protected)
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { name, email, phoneNumber, country, password } = req.body;

    // Ensure the authenticated user can only update their own data or is an admin
    if (req.customer.id !== id && req.customer.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. You can only update your own data.' });
    }

    try {
        const updates = { name, email, phoneNumber, country };

        if (password) {
            updates.password = password; // Store password as plain text
        }

        const updatedCustomer = await Customer.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedCustomer) {
            return res.status(404).json({ message: 'Customer not found.' });
        }

        res.status(200).json({ message: 'Customer updated successfully', customer: updatedCustomer });
    } catch (error) {
        console.error('Error updating customer:', error);
        res.status(500).json({ message: 'Server error', details: error.message });
    }
});

// Delete a customer by ID (Protected)
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCustomer = await Customer.findByIdAndDelete(id);

        if (!deletedCustomer) {
            return res.status(404).json({ message: 'Customer not found.' });
        }

        res.status(200).json({ message: 'Customer deleted successfully.' });
    } catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).json({ message: 'Server error', details: error.message });
    }
});

// Test route to fetch customer by email
router.get('/test-fetch/:email', async (req, res) => {
    try {
        const customer = await Customer.findOne({ email: req.params.email });
        if (customer) {
            res.json({ message: 'Customer found', customer });
        } else {
            res.json({ message: 'Customer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customer', error: error.message });
    }
});

export default router;

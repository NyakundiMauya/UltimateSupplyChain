// routes/customerRoutes.js
import express from 'express';
import Customer from './models/Customer.js'; // Adjust the path as needed
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Create a new customer
router.post('/', async (req, res) => {
    const { name, email, phoneNumber, country, password } = req.body;

    try {
        // Check if customer already exists
        const existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) {
            return res.status(400).json({ message: 'Customer already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new customer
        const newCustomer = new Customer({
            name,
            email,
            phoneNumber,
            country,
            password: hashedPassword,
        });

        await newCustomer.save();

        res.status(201).json({
            message: 'Customer created successfully',
            customer: newCustomer,
        });
    } catch (error) {
        console.error('Error creating customer:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login customer
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find customer by email
        const customer = await Customer.findOne({ email });
        if (!customer) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: customer._id, role: customer.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Login successful',
            token,
            customer: {
                name: customer.name,
                email: customer.email,
                phoneNumber: customer.phoneNumber,
                country: customer.country,
                role: customer.role,
                _id: customer._id,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all customers (optional)
router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a customer by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, phoneNumber, country } = req.body;

    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(
            id,
            { name, email, phoneNumber, country },
            { new: true }
        );

        if (!updatedCustomer) {
            return res.status(404).json({ message: 'Customer not found.' });
        }

        res.status(200).json({
            message: 'Customer updated successfully',
            customer: updatedCustomer,
        });
    } catch (error) {
        console.error('Error updating customer:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a customer by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCustomer = await Customer.findByIdAndDelete(id);

        if (!deletedCustomer) {
            return res.status(404).json({ message: 'Customer not found.' });
        }

        res.status(200).json({ message: 'Customer deleted successfully.' });
    } catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;


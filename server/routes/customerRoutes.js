// routes/customerRoutes.js
import express from 'express';
import {
    getAllCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer
} from '../controllers/customerController.js';

const router = express.Router();

// Get all customers
router.get('/', getAllCustomers);

// Create a new customer
router.post('/', createCustomer);

// Update a customer
router.put('/:id', updateCustomer);

// Delete a customer
router.delete('/:id', deleteCustomer);

export default router;

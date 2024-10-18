import express from "express";
import mongoose from "mongoose";
import Transaction from '../models/Transaction.js';

import {
  getTransactions,
  createTransaction,
  getTransactionById,
  // Add other controller functions here as needed
} from "../controllers/transactionController.js";

const router = express.Router();

router.get("/", getTransactions);
router.get("/:id", getTransactionById);
router.post('/', async (req, res) => {
  try {
    const { userId, amount, products, paymentMethod, phoneNumber, branchCode } = req.body;

    if (!branchCode) {
      return res.status(400).json({ message: 'Branch code is required' });
    }

    const newTransaction = new Transaction({
      userId,
      amount,
      products,
      paymentMethod,
      branchCode,
      ...(paymentMethod === 'mpesa' ? { mpesaDetails: { phoneNumber } } : {})
    });

    const savedTransaction = await newTransaction.save();

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction: savedTransaction
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Error creating transaction', error: 'An unexpected error occurred' });
  }
});

export default router;

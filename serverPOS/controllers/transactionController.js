import Transaction from "../models/Transaction.js";

// Get all transactions
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Create a new transaction
export const createTransaction = async (req, res) => {
  const transaction = req.body;
  const newTransaction = new Transaction(transaction);

  try {
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// Get a single transaction by ID
export const getTransactionById = async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Add other controller functions as needed, such as updateTransaction and deleteTransaction

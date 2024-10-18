import Transaction from "../models/Transaction.js";

// Get all transactions
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error: error.message });
  }
};

// Get a single transaction by ID
export const getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json(transaction);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }
    res.status(500).json({ message: "Error fetching transaction", error: error.message });
  }
};


import express from "express";
import {
  getTransactions,
  // Add other controller functions here as needed
} from "../controllers/transactionController.js";

const router = express.Router();

// Get all transactions
router.get("/", getTransactions);

// Add other routes here as needed
// For example:
// router.post("/", createTransaction);
// router.get("/:id", getTransactionById);
// router.put("/:id", updateTransaction);
// router.delete("/:id", deleteTransaction);

export default router;

import mongoose from 'mongoose';

// Define the Expense schema
const expenseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
  date: { type: Date, required: true, default: Date.now },
  type: { type: String, required: true, enum: ['food', 'transport', 'utilities', 'entertainment', 'other'] },
  status: { type: String, required: true, enum: ['pending', 'completed', 'cancelled'], default: 'pending' }
}, { timestamps: true });

// Create the Expense model
const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;

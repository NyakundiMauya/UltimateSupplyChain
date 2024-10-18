/*
import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    cost: { type: String, required: true },
    products: {
      type: [mongoose.Types.ObjectId],
      of: Number,
      required: true,
    },
    createdAt: { type: Date, default: Date.now }, // Add createdAt field
  },
  { timestamps: true } // This will automatically add `createdAt` and `updatedAt`
);

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;
*/
import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    orderId: { 
      type: mongoose.Schema.Types.ObjectId, 
      required: true, 
      default: () => new mongoose.Types.ObjectId()
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['card', 'mpesa'], required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
    products: [{
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }],
    paymentDetails: {
      lastFourDigits: { type: String },
      cardBrand: { type: String },
      expirationDate: { type: String }
    },
    mpesaDetails: {
      phoneNumber: { type: String },
      transactionId: { type: String }
    }
  },
  { timestamps: true }
);

// Add any necessary methods or statics here

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;

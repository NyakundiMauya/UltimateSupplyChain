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
    },
    branchCode: {
      type: String,
      default: 'NBO001',
      immutable: true,
    }
  },
  { timestamps: true }
);

// Add any necessary methods or statics here

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;

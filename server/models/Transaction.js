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

import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema({
  type: { type: String, required: true },
  title: { type: String, required: true },
  serialNumber: { type: String, required: true, unique: true },
  dateLoaned: { type: Date, default: null },
  dateReturned: { type: Date, default: null },
  departmentLoanedTo: { 
    type: String, 
    required: true,
    enum: [
      "Human Resources (HR)",
      "Finance and Accounting",
      "Sales and Marketing",
      "Operations",
      "Information Technology (IT)"
    ]
  }
});

const Asset = mongoose.model('Asset', assetSchema);
export default Asset;

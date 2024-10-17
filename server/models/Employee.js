// my-api/backend/models/Employee.js

import mongoose from "mongoose";

// Delete the existing model if it exists (for hot-reloading in development)
if (mongoose.models.Employee) {
    delete mongoose.models.Employee;
}

// Define the schema for the Employee collection
const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, // Normalize email to lowercase
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'employee',
    },
    category: {
        type: String,
        required: true,
        enum: [
            "Human Resources (HR)",
            "Finance and Accounting",
            "Sales and Marketing",
            "Operations",
            "Information Technology (IT)"
        ]
    },
    salary: {
        type: Number,
        required: false,
    },
});

// Create a model based on the schema
const Employee = mongoose.model("Employee", employeeSchema);

// Export the model
export default Employee;

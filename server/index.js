import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import employeeRoutes from './routes/employeeRoutes.js'; // Import the employee routes
import productRoutes from './routes/productRoutes.js'; // Import the product routes
import customerRoutes from './routes/customerRoutes.js'; // Import the customer routes
import transactionRoutes from './routes/transactionRoute.js'; // Import the transaction routes
import assetsRoutes from './routes/assetsRoutes.js'; // Import the assets routes
import expenseRoutes from './routes/expenseRoutes.js'; // Import the expense routes
import dotenv from 'dotenv';
// import checkRole from './middleware/checkRole.js';

dotenv.config();
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('MONGO_URL:', process.env.MONGO_URL);
console.log('Server Port:', process.env.PORT || 9000);

/* CONFIGURATION */
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Add this middleware before any route definitions
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

/* ROUTES */
// Remove console.log statements for production
app.use('/api/employees', employeeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/assets', assetsRoutes); // Add this line
app.use('/api/expenses', expenseRoutes); // Add this line
/* MONGOOSE SETUP */
const PORT = process.env.PORT || 9000;

// Add this line to address the deprecation warning
mongoose.set('strictQuery', false);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));

// Move the catch-all route to the end, after all other routes
app.use('*', (req, res) => {
  console.log(`Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: 'Route not found' }); // Send JSON response
});

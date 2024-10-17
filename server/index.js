import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import clientRoutes from "./routes/client.js";
import generalRoutes from "./routes/general.js";
import salesRoutes from "./routes/sales.js";
import employeeRoutes from './routes/employeeRoutes.js'; // Import the employee routes
import dotenv from 'dotenv';
import checkRole from './middleware/checkRole.js';

dotenv.config();

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
console.log("About to register routes with role checks");
app.use("/client", checkRole(['admin', 'employee']), clientRoutes);
app.use("/general", checkRole(['admin', 'employee']), generalRoutes);
app.use("/sales", checkRole(['admin', 'employee']), salesRoutes);
app.use('/api/employees', checkRole('admin'), employeeRoutes);
console.log("Routes registered with role checks");

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

// Add this catch-all route at the end
app.use('*', (req, res) => {
  console.log(`Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).send('Route not found');
});

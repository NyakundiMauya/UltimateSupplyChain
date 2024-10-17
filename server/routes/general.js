import express from "express";
import { getUser, getDashboardStats } from "../controllers/general.js";

const router = express.Router();

router.get("/user/:id", getUser);
router.get("/dashboard", getDashboardStats);

//router.get("/performance/:id", getUserPerformance);

// Route to fetch all employees

export default router;

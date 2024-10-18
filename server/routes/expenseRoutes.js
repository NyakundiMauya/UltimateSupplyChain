import express from 'express';
import { getexpenses, createexpense, updateexpense, deleteexpense } from '../controllers/expensesController.js';

const router = express.Router();

router.get('/', getexpenses);
router.post('/', createexpense);
router.put('/:id', updateexpense);
router.delete('/:id', deleteexpense);

export default router;

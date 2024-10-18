import Expense from "../models/expense.js";

export const getexpenses = async (req, res) => {
	try {
		const expenses = await Expense.find();
		res.json(expenses);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const createexpense = async (req, res) => {
	const newExpense = new Expense(req.body);
	try {
		const savedExpense = await newExpense.save();
		res.status(201).json(savedExpense);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const updateexpense = async (req, res) => {
	try {
		const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
		if (!updatedExpense) {
			return res.status(404).json({ message: "Expense not found" });
		}
		res.json(updatedExpense);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const deleteexpense = async (req, res) => {
	try {
		const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
		if (!deletedExpense) {
			return res.status(404).json({ message: "Expense not found" });
		}
		res.status(204).send();
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

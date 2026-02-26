import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import expenseService from '../services/expenses';

const getAllExpenses = async (req: Request, res: Response) => {
    try {
        const userId = req.headers.userId as string;
        if (!userId) return res.status(401).json({ message: 'userId not found' });
        const expenses = await expenseService.getAllExpenses(userId);
        return res.status(200).json({ msg: 'This are all the expenses', expenses });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch expenses' });
    }
};

const getExpense = async (req: Request, res: Response) => {
    try {
        const userId = req.headers.userId as string;
        const id = req.params.id as string;
        if (!userId) return res.status(401).json({ msg: 'userId not found' });
        if (!id) return res.status(400).json({ msg: 'Expense Id required' });
        const expense = await expenseService.getExpense(userId, id);
        if (!expense) return res.status(404).json({ msg: 'Expense not found' });
        return res.status(200).json({ msg: 'Expense fetched successfully', expense });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch expense' });
    }
};

const createExpense = async (req: Request, res: Response) => {
    try {
        const userId = req.headers.userId as string;
        if (!userId) return res.status(401).json({ message: 'userId not found' });
        const { name, amount, date, notes } = req.body;
        if (!name || !amount || date === undefined) {
            return res.status(400).json({ message: 'name, amount and date are required' });
        }
        const data = {
            id: uuidv4(),
            name,
            amount: Number(amount),
            date: new Date(date),
            notes
        };
        const created = await expenseService.createExpense(userId, data);
        return res.status(201).json({ msg: 'Expense created successfully', expense: created });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to create expense' });
    }
};

const updateExpense = async (req: Request, res: Response) => {
    try {
        const userId = req.headers.userId as string;
        const id = req.params.id as string;
        if (!userId) return res.status(401).json({ message: 'userId not found' });
        if (!id) return res.status(400).json({ msg: 'Expense Id required' });
        const existing = await expenseService.getExpense(userId, id);
        if (!existing) return res.status(404).json({ msg: 'Expense not found' });
        const { name, amount, date, notes } = req.body;
        const expense = {
            id,
            userId,
            name: name ?? existing.name,
            amount: amount !== undefined ? Number(amount) : existing.amount,
            date: date ? new Date(date) : existing.date,
            notes: notes !== undefined ? notes : existing.notes
        };
        const updated = await expenseService.updateExpense(expense);
        return res.status(200).json({ msg: 'Expense updated successfully', expense: updated });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to update expense' });
    }
};

const deleteExpense = async (req: Request, res: Response) => {
    try {
        const userId = req.headers.userId as string;
        const id = req.params.id as string;
        if (!userId) return res.status(401).json({ message: 'userId not found' });
        if (!id) return res.status(400).json({ msg: 'Expense Id required' });
        const deleted = await expenseService.deleteExpense(userId, id);
        if (!deleted) return res.status(404).json({ msg: 'Expense not found' });
        return res.status(200).json({ msg: 'Expense deleted successfully', expense: deleted });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to delete expense' });
    }
};

export const expensesController = { getAllExpenses, getExpense, createExpense, updateExpense, deleteExpense };

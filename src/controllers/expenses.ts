import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import expenseService from '../services/expenses';

const getAllExpenses = async (req: Request, res: Response) => {
    try {
        const userId = req.headers.userId as string;
        if (!userId) return res.status(401).json({ message: 'userId not found' });
        const page = req.query.page ? parseInt(String(req.query.page), 10) : undefined;
        const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : undefined;
        const result = await expenseService.getAllExpenses(userId, { page, limit });
        return res.status(200).json({ msg: 'This are all the expenses', ...result });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch expenses' });
    }
};

const getCategories = async (req: Request, res: Response) => {
    try {
        const userId = req.headers.userId as string;
        if (!userId) return res.status(401).json({ msg: 'userId not found' });
        const categories = await expenseService.getUserCategories(userId);
        return res.status(200).json({ msg: 'User categories', categories });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch categories' });
    }
};

const filterByCategoryOrByMonth = async (req: Request, res: Response) => {
    try {
        const userId = req.headers.userId as string;
        if (!userId) return res.status(401).json({ msg: 'userId not found' });
        const { category, month } = req.query;
        if (!category && !month) {
            return res.status(400).json({ message: 'Provide category or month in query params' });
        }
        const options: { category?: string; month?: string } = {};
        if (typeof category === 'string') options.category = category;
        if (typeof month === 'string') options.month = month;
        const expenses = await expenseService.filterByCategoryOrByMonth(userId, options);
        return res.status(200).json({ msg: 'Filtered expenses', expenses });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch expenses' });
    }
};

const dashboard = async (req: Request, res: Response) => {
    try {
        const userId = req.headers.userId as string;
        if (!userId) return res.status(401).json({ msg: 'userId not found' });
        const month = req.query.month as string;
        if (!month) return res.status(400).json({ message: 'month query param required (e.g. 2025-02)' });
        const data = await expenseService.dashboard(userId, month);
        return res.status(200).json({ msg: 'Dashboard data', ...data });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch dashboard data' });
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
        const { name, amount, date, notes, category } = req.body;
        if (!name || !amount || date === undefined) {
            return res.status(400).json({ message: 'name, amount and date are required' });
        }
        const data = {
            id: uuidv4(),
            name,
            amount: Number(amount),
            date: new Date(date),
            category,
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
        const { name, amount, date, notes, category } = req.body;
        const expense = {
            id,
            userId,
            name: name ?? existing.name,
            amount: amount !== undefined ? Number(amount) : existing.amount,
            date: date ? new Date(date) : existing.date,
            category: category !== undefined ? category : existing.category,
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

export const expensesController = { getAllExpenses, getExpense, getCategories, filterByCategoryOrByMonth, dashboard, createExpense, updateExpense, deleteExpense };

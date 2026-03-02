import { Expense } from '../models/expense';
import type { CreateExpenseData, CreateExpenseInput } from '../types/types';
import { getDatesFromMonth } from '../utils/expense';



type FilterOptions = { category?: string; month?: string };


const getAllExpenses = async (userId: string) => {
    try {
        const expenses = await Expense.find({ userId });
        return expenses;
    } catch (error) {
        throw new Error('Failed to fetch expenses');
    }
};

const getExpense = async (userId: string, id: string) => {
    try {
        const expense = await Expense.findOne({ userId, id });
        return expense;
    } catch (error) {
        throw new Error('Failed to fetch expense');
    }
};

const createExpense = async (userId: string, data: CreateExpenseData) => {
    try {
        const created = await Expense.create({ ...data, userId });
        return created;
    } catch (error) {
        throw new Error('Failed to create expense');
    }
};

const updateExpense = async (expense: CreateExpenseInput) => {
    try {
        const { id, userId, name, amount, date, category, notes } = expense;
        const updated = await Expense.findOneAndUpdate(
            { userId, id },
            { $set: { name, amount, date, category, notes } },
            { new: true }
        );
        return updated;
    } catch (error) {
        throw new Error('Failed to update expense');
    }
};

const deleteExpense = async (userId: string, id: string) => {
    try {
        const result = await Expense.findOneAndDelete({ userId, id });
        return result;
    } catch (error) {
        throw new Error('Failed to delete expense');
    }
};


const filterByCategoryOrByMonth = async (userId: string, options: FilterOptions) => {
    try {
        const query: Record<string, unknown> = { userId };

        if (options.category) {
            query.category = options.category;
        }

        if (options.month) {
            const {start, end } = getDatesFromMonth(options.month)
            query.date = {$gte: start, $lte: end}
        }

        const expenses = await Expense.find(query);
        return expenses;
    } catch (error) {
        throw new Error('Failed to fetch expenses');
    }
};


const dashboard = async (userId: string, month: string) => {
    try {
        const { start: startDate, end: endDate } = getDatesFromMonth(month);
        const query: Record<string, unknown> = {
            userId,
            date: { $gte: startDate, $lte: endDate }
        };

        const expenses = await Expense.find(query);

        const totalExpense = expenses.reduce((sum, e) => sum + (e.amount ?? 0), 0);

        const dayWiseExpenses: Record<string, number> = {};
        for (const expense of expenses) {
            const dateKey = new Date(expense.date).toISOString().split('T')[0];
            dayWiseExpenses[dateKey] = (dayWiseExpenses[dateKey] ?? 0) + (expense.amount ?? 0);
        }

        const dayWise = Object.entries(dayWiseExpenses)
            .map(([date, amount]) => ({ date, amount }))
            .sort((a, b) => a.date.localeCompare(b.date));

        return { totalExpense, dayWiseExpenses: dayWise };
    } catch (error) {
        throw new Error('Failed to fetch dashboard data');
    }
};

export default { getAllExpenses, getExpense, filterByCategoryOrByMonth, dashboard, createExpense, updateExpense, deleteExpense };
import { Expense } from '../models/expense';
import { User } from '../models/users';
import type { CreateExpenseData, CreateExpenseInput } from '../types/types';
import { getDatesFromMonth } from '../utils/expense';



type FilterOptions = { category?: string; month?: string };


type PaginationOptions = { page?: number; limit?: number };

const getAllExpenses = async (userId: string, options: PaginationOptions = {}) => {
    try {
        const page = Math.max(1, options.page ?? 1);
        const limit = Math.min(20, options.limit ?? 20);
        const skip = (page - 1) * limit;

        const [expenses, total] = await Promise.all([
            Expense.find({ userId }).sort({ date: -1 }).skip(skip).limit(limit),
            Expense.countDocuments({ userId })
        ]);

        return {
            expenses,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasMore: page * limit < total
            }
        };
    } catch (error) {
        throw new Error('Failed to fetch expenses');
    }
};

const getUserCategories = async (userId: string) => {
    try {
        const categories = await Expense.distinct('category', {
            userId,
            category: { $exists: true, $nin: [null, ''] }
        });
        return categories.filter(Boolean).sort((a, b) => String(a).localeCompare(String(b)));
    } catch (error) {
        throw new Error('Failed to fetch categories');
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

        const [expenses, user] = await Promise.all([
            Expense.find(query),
            User.findOne({ id: userId })
        ]);

        const totalSpent = expenses.reduce((sum, e) => sum + (e.amount ?? 0), 0);
        const budget = user?.budgets?.get(month) ?? 0;
        const totalBalance = budget - totalSpent;

        const dayWiseExpenses: Record<string, number> = {};
        for (const expense of expenses) {
            const dateKey = new Date(expense.date).toISOString().split('T')[0];
            dayWiseExpenses[dateKey] = (dayWiseExpenses[dateKey] ?? 0) + (expense.amount ?? 0);
        }

        const dayWise = Object.entries(dayWiseExpenses)
            .map(([date, amount]) => ({ date, amount }))
            .sort((a, b) => a.date.localeCompare(b.date));

        return { budget, totalSpent, totalBalance, dayWiseExpenses: dayWise };
    } catch (error) {
        throw new Error('Failed to fetch dashboard data');
    }
};

export default { getAllExpenses, getExpense, getUserCategories, filterByCategoryOrByMonth, dashboard, createExpense, updateExpense, deleteExpense };
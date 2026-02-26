import { Expense } from '../models/expense';
import type { CreateExpenseData, CreateExpenseInput } from '../types/types';

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
        const { id, userId, name, amount, date, notes } = expense;
        const updated = await Expense.findOneAndUpdate(
            { userId, id },
            { $set: { name, amount, date, notes } },
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


export default { getAllExpenses, getExpense, createExpense, updateExpense, deleteExpense };
import mongoose, { Schema } from "mongoose";
import { collections } from "../config/database";

const expenseSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
})

export const Expense = mongoose.model("Expense", expenseSchema, collections.expenses);
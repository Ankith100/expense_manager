import "dotenv/config";
import express from "express";
import { Expense } from "./types/types";
import authRoutes from "./routes/auth";
import { connectDB } from "./database/connection";

const app = express();

app.use(express.json())

app.use("/", authRoutes)

let expenses: Expense[] = [
    {
        id: "123",
        userId: "userId123",
        name: "beerkay",
        amount: 100,
        categoryId: "groceries",
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
    }
]

app.get("/", (req, res) => {
    console.log("This is an expense-manager app")
    res.json({"message": "This is an expense-manager app"})
})

app.get("/expenses", (req, res) => {
    res.json({expenses})
})

app.get("/expense/:id", (req, res) => {
    const id = req.params.id;
    const expense = expenses.find(e => e.id === id);
    if (!expense) {
        return res.status(404).json({ error: "Expense not found" });
    }
    res.json({expense});
})

app.post("/expense", (req, res) => {
    try {
        const expense = req.body;
        expenses.push(expense)
        console.log("time is: ", new Date())
        res.status(201).json({"message":"inserted successfully", "expense": expense})
    } catch(error) {
        res.status(500).json(error)
    }
})

app.put("/expense/:id", (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        const expenseIndex = expenses.findIndex(e => e.id === id);

        if (expenseIndex === -1) {
            return res.status(404).json({ error: "Expense not found" });
        }

        expenses[expenseIndex] = {
            ...expenses[expenseIndex],
            ...updates,
            updatedAt: new Date()
        };
        console.log("expense updated:", updates, expenses[expenseIndex])
        res.status(200).json({ message: "Updated successfully", expense: expenses[expenseIndex] });
    } catch (error) {
        res.status(500).json({ error });
    }
})

app.delete("/expense/:id", (req, res) => {
    const id = req.params.id;
    const expense = expenses.find(e => e.id === id);
    if (!expense) {
        return res.status(404).json({ error: "Expense not found" });
    }
    expenses = expenses.filter(e => e.id !== id);
    res.status(200).json({ message: "Deleted successfully", expense });
})

connectDB().then(() => {
  app.listen(process.env.PORT ?? 3000, () => {
    console.log("Server is running on port", process.env.PORT ?? 3000);
  });
});

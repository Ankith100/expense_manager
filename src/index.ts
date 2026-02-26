import "dotenv/config";
import express from "express";
import authRoutes from "./routes/auth";
import expenseRoutes from "./routes/expenses";
import { connectDB } from "./database/connection";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "This is an expense-manager app" });
});

app.use("/auth", authRoutes);
app.use("/expenses", expenseRoutes);

connectDB().then(() => {
  app.listen(process.env.PORT ?? 3000, () => {
    console.log("Server is running on port", process.env.PORT ?? 3000);
  });
});

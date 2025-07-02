// @server/routes/expense.routes.ts
import express from "express";
import {
    getAllExpenses,
    addExpense,
    deleteExpense,
    getExpenseSummary,
    getProjectComparisons,
    getCostSavingTips,
    exportExpenses
} from "@server/controllers/expense/expense.controller";

const expenseRoutes = express.Router();

expenseRoutes.get("/expenses", getAllExpenses);
expenseRoutes.post("/expenses", addExpense);
expenseRoutes.delete("/expenses/:id", deleteExpense);
expenseRoutes.get("/expenses/summary", getExpenseSummary);
expenseRoutes.get("/expenses/project-comparisons", getProjectComparisons);
expenseRoutes.get("/expenses/cost-saving-tips", getCostSavingTips);
expenseRoutes.post("/expenses/export", exportExpenses);

export { expenseRoutes };

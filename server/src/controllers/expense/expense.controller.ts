// @server/controllers/expense.controller.ts
import { generateCostSavingTips } from "@server/services/ai/ai.service";
import { Request, Response } from "express";

let expenses: any[] = [];
let expenseIdCounter = 1;

export const getAllExpenses = (req: Request, res: Response) => {
    res.json(expenses);
};

export const addExpense = (req: Request, res: Response) => {
    try {
        const { category, description, amount, date, vendor, projectId, projectName } = req.body;
        if (!category || !description || !amount) {
            return res.status(400).json({ error: "Category, description, and amount are required" });
        }

        const newExpense = {
            id: expenseIdCounter.toString(),
            category,
            description,
            amount: parseFloat(amount),
            date,
            vendor,
            projectId,
            projectName,
            createdAt: new Date().toISOString()
        };

        expenses.push(newExpense);
        expenseIdCounter++;

        res.json(newExpense);
    } catch (error) {
        console.error("Error adding expense:", error);
        res.status(500).json({ error: "Failed to add expense" });
    }
};

export const deleteExpense = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const index = expenses.findIndex(expense => expense.id === id);
        if (index === -1) {
            return res.status(404).json({ error: "Expense not found" });
        }
        expenses.splice(index, 1);
        res.json({ success: true });
    } catch (error) {
        console.error("Error deleting expense:", error);
        res.status(500).json({ error: "Failed to delete expense" });
    }
};

export const getExpenseSummary = (req: Request, res: Response) => {
    try {
        const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
        const categoryBreakdown = { Materials: 0, Labor: 0, Permits: 0, Subs: 0, Misc: 0 };
        expenses.forEach(e => {
            categoryBreakdown[e.category as keyof typeof categoryBreakdown] += e.amount;
        });

        const monthlyTrend = [];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const name = month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            const monthExpenses = expenses.filter(e => {
                const ed = new Date(e.date);
                return ed.getMonth() === month.getMonth() && ed.getFullYear() === month.getFullYear();
            });
            const amount = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
            monthlyTrend.push({ month: name, amount });
        }

        const vendorTotals: Record<string, { amount: number; count: number }> = {};
        expenses.forEach(e => {
            if (e.vendor) {
                if (!vendorTotals[e.vendor]) vendorTotals[e.vendor] = { amount: 0, count: 0 };
                vendorTotals[e.vendor].amount += e.amount;
                vendorTotals[e.vendor].count++;
            }
        });

        const topVendors = Object.entries(vendorTotals)
            .map(([vendor, data]) => ({ vendor, ...data }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5);

        res.json({ totalSpent, categoryBreakdown, monthlyTrend, topVendors });
    } catch (error) {
        console.error("Error generating summary:", error);
        res.status(500).json({ error: "Failed to generate expense summary" });
    }
};

export const getProjectComparisons = (req: Request, res: Response) => {
    try {
        const groups: Record<string, any[]> = {};
        expenses.forEach(e => {
            if (e.projectName) {
                if (!groups[e.projectName]) groups[e.projectName] = [];
                groups[e.projectName].push(e);
            }
        });

        const comparisons = Object.entries(groups).map(([name, projectExpenses]) => {
            const actual = { Materials: 0, Labor: 0, Permits: 0, Subs: 0, Misc: 0, total: 0 };
            projectExpenses.forEach(e => {
                actual[e.category as keyof typeof actual] += e.amount;
                actual.total += e.amount;
            });

            const estimated = {
                Materials: actual.Materials * 0.9 + Math.random() * actual.Materials * 0.4,
                Labor: actual.Labor * 0.85 + Math.random() * actual.Labor * 0.3,
                Permits: actual.Permits * 1.1 + Math.random() * actual.Permits * 0.2,
                Subs: actual.Subs * 0.95 + Math.random() * actual.Subs * 0.2,
                Misc: actual.Misc * 0.8 + Math.random() * actual.Misc * 0.4,
                total: 0
            };
            estimated.total = Object.values(estimated).reduce((a, b) => typeof b === "number" ? a + b : a, 0);

            const variance = {
                Materials: actual.Materials - estimated.Materials,
                Labor: actual.Labor - estimated.Labor,
                Permits: actual.Permits - estimated.Permits,
                Subs: actual.Subs - estimated.Subs,
                Misc: actual.Misc - estimated.Misc,
                total: actual.total - estimated.total
            };

            const percent = {
                Materials: estimated.Materials > 0 ? (variance.Materials / estimated.Materials) * 100 : 0,
                Labor: estimated.Labor > 0 ? (variance.Labor / estimated.Labor) * 100 : 0,
                Permits: estimated.Permits > 0 ? (variance.Permits / estimated.Permits) * 100 : 0,
                Subs: estimated.Subs > 0 ? (variance.Subs / estimated.Subs) * 100 : 0,
                Misc: estimated.Misc > 0 ? (variance.Misc / estimated.Misc) * 100 : 0,
                total: estimated.total > 0 ? (variance.total / estimated.total) * 100 : 0
            };

            return {
                projectId: name.toLowerCase().replace(/\s+/g, '-'),
                projectName: name,
                estimated,
                actual,
                variance,
                variancePercent: percent
            };
        });

        res.json(comparisons);
    } catch (error) {
        console.error("Error generating comparisons:", error);
        res.status(500).json({ error: "Failed to generate project comparisons" });
    }
};

export const getCostSavingTips = async (req: Request, res: Response) => {
    try {
        if (expenses.length === 0) return res.json([]);
        const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
        const categoryBreakdown = { Materials: 0, Labor: 0, Permits: 0, Subs: 0, Misc: 0 };
        expenses.forEach(e => {
            categoryBreakdown[e.category as keyof typeof categoryBreakdown] += e.amount;
        });

        const tips = await generateCostSavingTips({
            totalSpent,
            categoryBreakdown,
            projectType: "Residential Renovation",
            location: "United States"
        });

        res.json(tips);
    } catch (error) {
        console.error("Error generating tips:", error);
        res.status(500).json({ error: "Failed to generate cost-saving tips" });
    }
};

export const exportExpenses = (req: Request, res: Response) => {
    try {
        const { projectId, category, dateRange } = req.body;
        let filtered = [...expenses];

        if (category && category !== 'all') {
            filtered = filtered.filter(e => e.category === category);
        }
        if (dateRange?.start) {
            filtered = filtered.filter(e => e.date >= dateRange.start);
        }
        if (dateRange?.end) {
            filtered = filtered.filter(e => e.date <= dateRange.end);
        }

        const headers = ['Date', 'Category', 'Description', 'Amount', 'Vendor', 'Project'];
        const csv = [
            headers.join(','),
            ...filtered.map(e => [
                e.date, e.category, `"${e.description}"`, e.amount, e.vendor || '', e.projectName || ''
            ].join(','))
        ].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="expenses.csv"');
        res.send(csv);
    } catch (error) {
        console.error("Error exporting expenses:", error);
        res.status(500).json({ error: "Failed to export expenses" });
    }
};

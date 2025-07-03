import { mockFlipProjects } from "@server/constants/mock-data";
import { Request, Response } from "express";

export const exportPortfolioHandler = async (req: Request, res: Response) => {
    try {
        const csvContent = [
            "Flip Portfolio Report - Shall's Construction",
            "",
            "Address,Start Date,Finish Date,Budget Planned,Budget Actual,Sale Price,ROI,Timeline,Status",
            ...mockFlipProjects.map((p: any) =>
                `"${p.address}","${p.startDate}","${p.finishDate || 'N/A'}",${p.budgetPlanned},${p.budgetActual},${p.salePrice || 'N/A'},${p.roi || 'N/A'},${p.timeline},${p.status}`
            )
        ].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="flip-portfolio.csv"');
        res.send(csvContent);
    } catch (error) {
        res.status(500).json({ error: "Failed to export portfolio" });
    }
}
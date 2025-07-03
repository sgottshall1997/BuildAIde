import { analyzeEstimate, getBenchmarkCosts } from "@server/services/bench-marketing/benchMarketing.service";
import { Request, Response } from "express";

export const getBenchMarketingCostsHandler = async (req: Request, res: Response) => {
    try {
        const { projectType, zipCode, squareFootage } = req.body;

        if (!projectType || !zipCode) {
            return res.status(400).json({ error: "Project type and zip code are required" });
        }

        const benchmarks = await getBenchmarkCosts(projectType, zipCode, squareFootage);
        res.json(benchmarks);
    } catch (error) {
        console.error("Error getting benchmark costs:", error);
        res.status(500).json({ error: "Failed to retrieve benchmark data" });
    }
}


export const analyzeEstimateHandler = async (req: Request, res: Response) => {
    try {
        const { internalEstimate, benchmarks, projectDetails } = req.body;

        if (!internalEstimate || !benchmarks || !projectDetails) {
            return res.status(400).json({ error: "Estimate, benchmarks, and project details are required" });
        }

        const analysis = await analyzeEstimate(internalEstimate, benchmarks, projectDetails);
        res.json(analysis);
    } catch (error) {
        console.error("Error analyzing estimate:", error);
        res.status(500).json({ error: "Failed to generate estimate analysis" });
    }
}
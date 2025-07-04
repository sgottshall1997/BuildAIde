import { generateSpenceTheBuilderResponse } from "@server/services/ai/ai.service";
import { getMarketData } from "@server/services/market-data/marketData.service";
import { Request, Response } from "express";
import fs from "fs";
import path from "path";

export const getMaterialPrices = async (req: Request, res: Response) => {
    try {
        res.setHeader("Content-Type", "application/json");
        const marketData = await getMarketData();
        res.json(marketData.materialPrices);
    } catch (error) {
        console.error("Error fetching material prices:", error);
        res.status(500).json({ error: "Failed to fetch material prices" });
    }
};

export const getMaterialPricesFallback = async (req: Request, res: Response) => {
    try {
        const dataPath = path.join(__dirname, "../data/marketData.json");

        if (fs.existsSync(dataPath)) {
            const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
            return res.json(data.materialPrices || []);
        }

        const fallbackPrices = [
            { id: "lumber-2x4", name: "Lumber 2x4x8", category: "framing", currentPrice: 8.97, previousPrice: 8.45, unit: "board", trend: "up", changePercent: 6.2, lastUpdated: new Date().toISOString() },
            { id: "osb-sheathing", name: "OSB Sheathing 7/16\"", category: "framing", currentPrice: 45.99, previousPrice: 43.50, unit: "sheet", trend: "up", changePercent: 5.7, lastUpdated: new Date().toISOString() },
            { id: "ready-mix", name: "Ready Mix Concrete", category: "concrete", currentPrice: 165.00, previousPrice: 158.00, unit: "cubic yard", trend: "up", changePercent: 4.4, lastUpdated: new Date().toISOString() },
        ];
        res.json(fallbackPrices);
    } catch (error) {
        console.error("Fallback price error:", error);
        res.status(500).json({ error: "Failed to load fallback material prices" });
    }
};

export const getLegacyMaterialPrices = async (req: Request, res: Response) => {
    try {
        res.setHeader("Content-Type", "application/json");
        const legacyPrices = [
            { id: "lumber-2x4", name: "Lumber 2x4x8", category: "framing", currentPrice: 8.97, previousPrice: 8.45, unit: "board", source: "Home Depot", lastUpdated: new Date().toISOString(), trend: "up", changePercent: 6.2 },
            { id: "ready-mix", name: "Ready Mix Concrete", category: "concrete", currentPrice: 165.00, previousPrice: 158.00, unit: "cubic yard", source: "Local Supplier", lastUpdated: new Date().toISOString(), trend: "up", changePercent: 4.4 },
            { id: "romex-12-2", name: "Romex 12-2 Wire", category: "electrical", currentPrice: 1.89, previousPrice: 1.75, unit: "linear ft", source: "Home Depot", lastUpdated: new Date().toISOString(), trend: "up", changePercent: 8.0 },
        ];
        res.json(legacyPrices);
    } catch (error) {
        console.error("Legacy prices error:", error);
        res.status(500).json({ error: "Failed to fetch legacy prices" });
    }
};

export const getMaterialInsights = async (req: Request, res: Response) => {
    try {
        const prompt = `You are a senior cost estimator for a residential construction company in Maryland. Based on current material pricing trends, provide market insights in this exact JSON format:

{
  "summary": "Brief summary of current market conditions (2-3 sentences)",
  "forecast": "Price forecast for next 30-60 days (2-3 sentences)", 
  "recommendations": ["Actionable recommendation 1", "Actionable recommendation 2", "Actionable recommendation 3"],
  "updatedAt": "${new Date().toISOString()}"
}

Current trends: Lumber and OSB prices up 5-6%, copper surging 10% due to supply constraints, concrete costs rising 4% due to increased demand, roofing materials stable with slight increases.`;

        const aiResponse = await generateSpenceTheBuilderResponse(prompt, null, []);

        try {
            const insights = JSON.parse(aiResponse);
            res.json(insights);
        } catch {
            res.json({
                summary: "Material prices continue to show upward pressure across most categories.",
                forecast: "Expect continued volatility for copper and structural materials in the next 30–60 days.",
                recommendations: [
                    "Lock in copper pricing for plumbing jobs",
                    "Order framing lumber early to avoid cost surges",
                    "Reevaluate budget assumptions for Q3 bids"
                ],
                updatedAt: new Date().toISOString()
            });
        }
    } catch (error) {
        console.error("Material insight generation failed:", error);
        res.json({
            summary: "Material prices continue to show upward pressure across most categories.",
            forecast: "Expect continued volatility for copper and structural materials in the next 30–60 days.",
            recommendations: [
                "Lock in copper pricing for plumbing jobs",
                "Order framing lumber early to avoid cost surges",
                "Reevaluate budget assumptions for Q3 bids"
            ],
            updatedAt: new Date().toISOString()
        });
    }
};

import { Request, Response } from "express";
import { z } from "zod";
import { storage } from "@server/services/storage/storage.service";
import { insertScheduleSchema } from "@shared/schema";
import { explainEstimate, summarizeSchedule, getAIRecommendations, draftEmail, generateRiskAssessment, generateSmartSuggestions, calculateScenario } from "@server/services/ai/ai.service";

export async function getAllSchedules(req: Request, res: Response) {
    try {
        const schedules = await storage.getSchedules();
        res.json(schedules);
    } catch {
        res.status(500).json({ error: "Failed to fetch schedules" });
    }
}

export async function createScheduleHandler(req: Request, res: Response) {
    try {
        const zipCodeRegex = /^\d{5}(-\d{4})?$/;
        if (!zipCodeRegex.test(req.body.zipCode)) {
            return res.status(400).json({ error: "Invalid ZIP code format" });
        }

        const validatedData = insertScheduleSchema.parse(req.body);
        const schedule = await storage.createSchedule(validatedData);

        console.log("Schedule created:", validatedData.email, validatedData.phone);
        res.json(schedule);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: "Invalid input data", details: error.errors });
        } else {
            res.status(500).json({ error: "Failed to create schedule" });
        }
    }
}

export async function getStats(req: Request, res: Response) {
    try {
        const estimates = await storage.getEstimates();
        const schedules = await storage.getSchedules();
        const totalValue = estimates.reduce((sum, e) => sum + e.estimatedCost, 0);

        res.json({
            totalEstimates: estimates.length,
            scheduledInspections: schedules.filter(s => s.status === "scheduled").length,
            totalValue: `$${(totalValue / 1_000_000).toFixed(1)}M`,
        });
    } catch {
        res.status(500).json({ error: "Failed to fetch statistics" });
    }
}

export async function explainEstimateHandler(req: Request, res: Response) {
    try {
        const { estimateId } = req.body;
        const estimate = await storage.getEstimate(estimateId);
        if (!estimate) return res.status(404).json({ error: "Estimate not found" });

        const explanation = await explainEstimate(estimate);
        res.json({ explanation });
    } catch (error) {
        console.error("Error explaining estimate:", error);
        res.status(500).json({ error: "Failed to generate explanation" });
    }
}

export async function summarizeScheduleHandler(req: Request, res: Response) {
    try {
        const schedules = await storage.getSchedules();
        const summary = await summarizeSchedule(schedules);
        res.json({ summary });
    } catch (error) {
        console.error("Error summarizing schedule:", error);
        res.status(500).json({ error: "Failed to generate summary" });
    }
}

export async function getAIRecommendationsHandler(req: Request, res: Response) {
    try {
        const estimates = await storage.getEstimates();
        const schedules = await storage.getSchedules();
        const recommendations = await getAIRecommendations(estimates, schedules);
        res.json({ recommendations });
    } catch (error) {
        console.error("Error getting AI recommendations:", error);
        res.status(500).json({ error: "Failed to generate recommendations" });
    }
}

export async function draftEmailHandler(req: Request, res: Response) {
    try {
        const { type, data } = req.body;
        if (!type || !data) {
            return res.status(400).json({ error: "Type and data are required" });
        }

        const emailDraft = await draftEmail(type, data);
        res.json({ emailDraft });
    } catch (error) {
        console.error("Error drafting email:", error);
        res.status(500).json({ error: "Failed to generate email draft" });
    }
}

export async function riskAssessmentHandler(req: Request, res: Response) {
    try {
        const { projectType, area, materialQuality, timeline, estimatedCost, zipCode } = req.body;

        const assessment = await generateRiskAssessment({
            projectType,
            area,
            materialQuality,
            timeline,
            estimatedCost,
            zipCode
        });

        res.json({ assessment });
    } catch (error) {
        console.error("Error generating risk assessment:", error);
        res.status(500).json({ error: "Failed to generate risk assessment" });
    }
}

export const smartSuggestionHandler = async (req: Request, res: Response) => {
    try {
        const formData = req.body;
        const suggestions = await generateSmartSuggestions(formData);
        res.json({ suggestions });
    } catch (error) {
        console.error("Error generating smart suggestions:", error);
        res.status(500).json({ error: "Failed to generate suggestions" });
    }
}

export const calculateScenarioHandler = async (req: Request, res: Response) => {
    try {
        const modifiedEstimate = req.body;
        const result = await calculateScenario(modifiedEstimate);
        res.json(result);
    } catch (error) {
        console.error("Error calculating scenario:", error);
        res.status(500).json({ error: "Failed to calculate scenario" });
    }
}

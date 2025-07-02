import { calculateEnhancedEstimate } from "@server/services/cost-engine/costEngine.service";
import { insertEstimateSchema } from "@shared/schema";
import { Request, Response } from "express";
import { generateProjectEstimate } from "../../../ai";
import { storage } from "server/storage";
import { z } from "zod";


/**
 * Handles basic estimate creation using standard inputs like area, labor, materials, and timeline.
 * Stores the result without enhanced metadata or extended inputs.
 */
export const baseEstimateHandler = async (req: Request, res: Response) => {

    try {
        const rawData = req.body;
        console.log("Received estimate data:", rawData);

        // Validate required fields and provide defaults
        const area = Number(rawData.area || rawData.squareFootage) || 0;
        const projectType = rawData.projectType || 'kitchen-remodel';
        const materialQuality = rawData.materialQuality || 'standard';
        const timeline = rawData.timeline || '4-8 weeks';
        const zipCode = rawData.zipCode || '20895';

        if (area <= 0) {
            return res.status(400).json({ error: "Square footage must be greater than 0" });
        }

        // Use the cost engine for accurate calculations
        console.log("About to calculate costs with:", { projectType, area, materialQuality, timeline, zipCode });
        let costBreakdown;
        try {
            costBreakdown = calculateEnhancedEstimate({
                projectType,
                area,
                materialQuality,
                timeline,
                zipCode,
                laborWorkers: Number(rawData.laborWorkers) || 2,
                laborHours: Number(rawData.laborHours) || 24,
                laborRate: Number(rawData.laborRate) || 55
            });
        } catch (calcError) {
            console.error("Cost calculation error:", calcError);
            // Fallback calculation
            const baseRate = 150; // Fallback rate per sqft
            const totalCost = area * baseRate;
            costBreakdown = {
                materials: { amount: Math.round(totalCost * 0.40), percentage: 40 },
                labor: { amount: Math.round(totalCost * 0.38), percentage: 38 },
                permits: { amount: Math.round(totalCost * 0.04), percentage: 4 },
                equipment: { amount: Math.round(totalCost * 0.06), percentage: 6 },
                overhead: { amount: Math.round(totalCost * 0.12), percentage: 12 },
                total: totalCost
            };
        }

        // Calculate individual cost breakdowns from cost engine
        let materialCost = costBreakdown.materials.amount;
        let laborCost = costBreakdown.labor.amount;
        let permitCost = costBreakdown.permits.amount;
        let softCosts = costBreakdown.equipment.amount + costBreakdown.overhead.amount;

        console.log("Cost breakdown calculated:", {
            materialCost,
            laborCost,
            permitCost,
            softCosts,
            total: costBreakdown.total
        });

        // Calculate material costs from materials array if provided
        if (rawData.materials && typeof rawData.materials === 'string') {
            try {
                const materials = JSON.parse(rawData.materials);
                if (Array.isArray(materials)) {
                    materialCost = materials.reduce((total, material) => {
                        return total + (material.quantity * material.costPerUnit);
                    }, 0);
                }
            } catch (e) {
                console.log("Error parsing materials:", e);
            }
        }

        // Calculate labor costs
        if (rawData.laborTypes && typeof rawData.laborTypes === 'string') {
            try {
                const laborTypes = JSON.parse(rawData.laborTypes);
                if (Array.isArray(laborTypes)) {
                    laborCost = laborTypes.reduce((total, labor) => {
                        return total + (labor.workers * labor.hours * labor.hourlyRate);
                    }, 0);
                }
            } catch (e) {
                console.log("Error parsing labor types:", e);
            }
        }

        // Fallback to legacy labor calculation
        if (laborCost === 0 && rawData.laborWorkers && rawData.laborHours && rawData.laborRate) {
            laborCost = rawData.laborWorkers * rawData.laborHours * rawData.laborRate;
        }

        // Calculate permit costs
        if (rawData.permitNeeded) {
            permitCost = Math.max(500, (rawData.area || 0) * 0.5);
        }

        // Calculate soft costs and total
        const baseCost = materialCost + laborCost + permitCost;

        // Add demolition costs
        if (rawData.demolitionRequired) {
            softCosts += (rawData.area || 0) * 5; // $5 per sq ft
        }

        // Add overhead (15% of base)
        softCosts += baseCost * 0.15;

        // Apply timeline and access multipliers
        let timelineMultiplier = 1;
        if (rawData.timelineSensitivity === "urgent") timelineMultiplier = 1.2;
        if (rawData.timelineSensitivity === "flexible") timelineMultiplier = 0.95;

        let accessMultiplier = 1;
        if (rawData.siteAccess === "difficult") accessMultiplier = 1.15;
        if (rawData.siteAccess === "easy") accessMultiplier = 0.95;

        // Use cost engine total instead of manual calculation
        const estimatedCost = costBreakdown.total;

        // Ensure no NaN values with validation
        const validateNumber = (value: any, fallback: number = 0): number => {
            const num = Number(value);
            return isNaN(num) ? fallback : num;
        };

        // Prepare data for validation and storage
        const calculatedData = {
            ...rawData,
            area: validateNumber(area, 0),
            materialCost: validateNumber(materialCost, 0),
            laborCost: validateNumber(laborCost, 0),
            permitCost: validateNumber(permitCost, 0),
            softCosts: validateNumber(softCosts, 0),
            estimatedCost: validateNumber(estimatedCost, 0),
            laborWorkers: validateNumber(rawData.laborWorkers, 2),
            laborHours: validateNumber(rawData.laborHours, 24),
            laborRate: validateNumber(rawData.laborRate, 55)
        };

        const validatedData = insertEstimateSchema.parse(calculatedData);
        console.log("About to save estimate with data:", validatedData);

        const estimate = await storage.createEstimate(validatedData);
        console.log("Estimate returned from storage:", estimate);

        // If file was uploaded, you could store the file path in the estimate
        if (req.file) {
            // File is available at req.file.path
            console.log("Blueprint file uploaded:", req.file.filename);
        }

        res.json(estimate);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: "Invalid input data", details: error.errors });
        } else {
            console.error("Error creating estimate:", error);
            res.status(500).json({ error: "Failed to create estimate" });
        }
    }
}


/**
 * Handles advanced estimate creation with extended inputs including scope, budget range,
 * priority flags, and other client preferences. Returns detailed response with enhanced metadata.
 */
export const advanceEstimateHandler = async (req: Request, res: Response) => {
    try {
        const rawData = req.body;
        console.log("Priority API handler: Received estimate data:", rawData);

        // Validate required fields and provide defaults
        const area = Number(rawData.area || rawData.squareFootage) || 0;
        const projectType = rawData.projectType || 'kitchen-remodel';
        const materialQuality = rawData.materialQuality || 'standard';
        const timeline = rawData.timeline || '4-8 weeks';
        const zipCode = rawData.zipCode || '20895';

        if (area <= 0) {
            return res.status(400).json({ error: "Square footage must be greater than 0" });
        }

        // Use the cost engine for accurate calculations
        console.log("About to calculate costs with:", { projectType, area, materialQuality, timeline, zipCode });
        let costBreakdown;
        try {
            costBreakdown = calculateEnhancedEstimate({
                projectType,
                area,
                materialQuality,
                timeline,
                zipCode,
                laborWorkers: Number(rawData.laborWorkers) || 2,
                laborHours: Number(rawData.laborHours) || 24,
                laborRate: Number(rawData.laborRate) || 55
            });
        } catch (calcError) {
            console.error("Cost calculation error:", calcError);
            // Fallback calculation
            const baseRate = 150; // Fallback rate per sqft
            const totalCost = area * baseRate;
            costBreakdown = {
                materials: { amount: Math.round(totalCost * 0.40), percentage: 40 },
                labor: { amount: Math.round(totalCost * 0.38), percentage: 38 },
                permits: { amount: Math.round(totalCost * 0.04), percentage: 4 },
                equipment: { amount: Math.round(totalCost * 0.06), percentage: 6 },
                overhead: { amount: Math.round(totalCost * 0.12), percentage: 12 },
                total: totalCost
            };
        }

        // Calculate individual cost breakdowns from cost engine
        let materialCost = costBreakdown.materials.amount;
        let laborCost = costBreakdown.labor.amount;
        let permitCost = costBreakdown.permits.amount;
        let softCosts = costBreakdown.equipment.amount + costBreakdown.overhead.amount;

        const estimatedCost = costBreakdown.total;

        // Helper function to ensure numbers are valid
        const validateNumber = (num: any, fallback: number): number => {
            return (typeof num === 'number' && !isNaN(num)) ? num : fallback;
        };

        // Prepare data for validation and storage
        const calculatedData = {
            ...rawData,
            area: validateNumber(area, 0),
            description: rawData.description || `${projectType} - ${area} sq ft`,
            materialCost: validateNumber(materialCost, 0),
            laborCost: validateNumber(laborCost, 0),
            permitCost: validateNumber(permitCost, 0),
            softCosts: validateNumber(softCosts, 0),
            estimatedCost: validateNumber(estimatedCost, 0),
            laborWorkers: validateNumber(rawData.laborWorkers, 2),
            laborHours: validateNumber(rawData.laborHours, 24),
            laborRate: validateNumber(rawData.laborRate, 55)
        };

        const validatedData = insertEstimateSchema.parse(calculatedData);
        console.log("About to save estimate with data:", validatedData);

        const estimate = await storage.createEstimate(validatedData);
        console.log("Estimate returned from storage:", estimate);

        // Add enhanced cost breakdown to response
        const response = {
            ...estimate,
            costBreakdown,
            enhancedInputs: {
                scopeDetails: rawData.scopeDetails,
                estimatedTimeline: rawData.estimatedTimeline,
                laborAvailability: rawData.laborAvailability,
                structuralChange: rawData.structuralChange,
                electricalWork: rawData.electricalWork,
                plumbingWork: rawData.plumbingWork,
                budgetRange: rawData.budgetRange,
                priority: rawData.priority,
                existingConditions: rawData.existingConditions,
                financingType: rawData.financingType,
                clientType: rawData.clientType,
                preferredVendors: rawData.preferredVendors
            }
        };

        res.json(response);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: "Invalid input data", details: error.errors });
        } else {
            console.error("Error creating estimate:", error);
            res.status(500).json({ error: "Failed to create estimate" });
        }
    }
}


export const getAllEstimatesHandler = async (req: Request, res: Response) => {
    try {
        const estimates = await storage.getEstimates();
        res.json(estimates);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch estimates" });
    }
}

export const enhanceEstimateHandler = async (req: Request, res: Response) => {

    console.log('🔧 Enhanced estimate endpoint hit');
    res.setHeader('Content-Type', 'application/json');

    try {
        const { userInput, area, materialQuality, timeline, zipCode, needsPermits, permitTypes, needsEquipment, equipmentTypes, laborRate } = req.body;

        if (!userInput || userInput.trim().length === 0) {
            return res.status(400).json({
                error: 'Project description is required',
                estimate: {
                    "Materials": {},
                    "Labor": {},
                    "Permits & Fees": {},
                    "Equipment & Overhead": {},
                    "Profit & Contingency": {},
                    "TotalEstimate": 0,
                    "Notes": "Please provide a project description to generate a detailed estimate."
                }
            });
        }

        const enhancedEstimate = await generateProjectEstimate({
            userInput: userInput.trim(),
            area: Number(area) || undefined,
            materialQuality: materialQuality || undefined,
            timeline: timeline || undefined,
            zipCode: zipCode || undefined,
            needsPermits: Boolean(needsPermits),
            permitTypes: permitTypes || undefined,
            needsEquipment: Boolean(needsEquipment),
            equipmentTypes: equipmentTypes || undefined,
            laborRate: laborRate ? Number(laborRate) : undefined
        });

        console.log('✅ Enhanced estimate generated successfully');
        res.json({ estimate: enhancedEstimate });

    } catch (error) {
        console.error('Enhanced estimate error:', error);
        res.status(500).json({
            error: 'Unable to generate enhanced estimate',
            estimate: {
                "Materials": {},
                "Labor": {},
                "Permits & Fees": {},
                "Equipment & Overhead": {},
                "Profit & Contingency": {},
                "TotalEstimate": 0,
                "Notes": "Unable to generate detailed estimate at this time. Please try again."
            }
        });
    }
}
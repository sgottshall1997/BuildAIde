import {
    generatePreEstimateSummary, generateRiskRating, generatePastProjectInsight,
    generateClientEmail,
    generateCostBreakdownExplanation,
    generateCategoryDetail,
    processConversationalEstimator,
    generateSpenceTheBuilderResponse,
    generateVisualPreview,
    generateHiddenCostInsights,
    generatePersonalizedClientMessage,
    generateLeadStrategies,
    compareSubcontractors,
    analyzeMaterialCosts,
    assessProjectRisks,
    generateProjectTimeline,
    generateBudgetPlan,
    calculateFlipROI,
    researchPermits,
    homeownerChat,
    generateProjectEstimate,
    generateBid,
    constructionAssistant,
    analyzeFlipProperties,
    getAIFlipOpinion,
} from "@server/services/ai/ai.service";
import { Request, Response } from "express";

export const preEstimateSummaryHandler = async (req: Request, res: Response) => {
    try {
        const formData = req.body;
        const summary = await generatePreEstimateSummary(formData);
        res.json({ summary });
    } catch (error) {
        console.error("Error generating pre-estimate summary:", error);
        res.status(500).json({ error: "Failed to generate pre-estimate summary" });
    }
}


export const riskRatingHandler = async (req: Request, res: Response) => {
    try {
        const estimateData = req.body;
        const riskRating = await generateRiskRating(estimateData);
        res.json(riskRating);
    } catch (error) {
        console.error("Error generating risk rating:", error);
        res.status(500).json({ error: "Failed to generate risk rating" });
    }
}


/**
 * @route POST /api/past-project-insight
 */
export const pastProjectInsightHandler = async (req: Request, res: Response) => {
    try {
        const { currentProject, similarProjects } = req.body;
        const insight = await generatePastProjectInsight(currentProject, similarProjects);
        res.json({ insight });
    } catch (error) {
        console.error("Error generating past project insight:", error);
        res.status(500).json({ error: "Failed to generate past project insight" });
    }
};

/**
 * @route POST /api/generate-client-email
 */
export const generateClientEmailHandler = async (req: Request, res: Response) => {
    try {
        const { estimateData } = req.body;
        const email = await generateClientEmail(estimateData);
        res.json({ email });
    } catch (error) {
        console.error("Error generating client email:", error);
        res.status(500).json({ error: "Failed to generate client email" });
    }
};

/**
 * @route POST /api/generate-cost-explanation
 */
export const generateCostExplanationHandler = async (req: Request, res: Response) => {
    try {
        const { costBreakdown, projectType, estimatedCost } = req.body;
        const explanation = await generateCostBreakdownExplanation(costBreakdown, projectType, estimatedCost);
        res.json({ explanation });
    } catch (error) {
        console.error("Error generating cost explanation:", error);
        res.status(500).json({ error: "Failed to generate cost explanation" });
    }
};

/**
 * @route POST /api/cost-category-detail
 */
export const categoryDetailHandler = async (req: Request, res: Response) => {
    try {
        const { category, projectType, amount, percentage } = req.body;
        const explanation = await generateCategoryDetail(category, projectType, amount, percentage);
        res.json({ explanation });
    } catch (error) {
        console.error("Error generating category detail:", error);
        res.status(500).json({ error: "Failed to generate category detail" });
    }
};

/**
 * @route POST /api/conversational-estimator
 */
export const conversationalEstimatorHandler = async (req: Request, res: Response) => {
    try {
        const { userInput, currentEstimate, chatHistory } = req.body;
        const result = await processConversationalEstimator(userInput, currentEstimate, chatHistory);
        res.json(result);
    } catch (error) {
        console.error("Error processing conversational estimator:", error);
        res.status(500).json({ error: "Failed to process conversational request" });
    }
};

/**
 * @route POST /api/spencebot-chat
 */
export const spencebotChatHandler = async (req: Request, res: Response) => {
    try {
        const { message, estimateData, chatHistory } = req.body;
        const response = await generateSpenceTheBuilderResponse(message, estimateData, chatHistory);
        res.json({ response });
    } catch (error) {
        console.error("Error generating Spence the Builder response:", error);
        res.status(500).json({ error: "Failed to generate response" });
    }
};

/**
 * @route POST /api/generate-visual-preview
 */
export const visualPreviewHandler = async (req: Request, res: Response) => {
    try {
        const { projectData } = req.body;
        const imageUrl = await generateVisualPreview(projectData);
        res.json({ imageUrl });
    } catch (error) {
        console.error("Error generating visual preview:", error);
        res.status(500).json({ error: "Failed to generate visual preview" });
    }
};

/**
 * @route POST /api/hidden-cost-insights
 */
export const hiddenCostInsightsHandler = async (req: Request, res: Response) => {
    try {
        const { estimateData } = req.body;
        const insights = await generateHiddenCostInsights(estimateData);
        res.json(insights);
    } catch (error) {
        console.error("Error generating hidden cost insights:", error);
        res.status(500).json({ error: "Failed to generate insights" });
    }
};

/**
 * @route POST /api/generate-personalized-message
 */
export const personalizedMessageHandler = async (req: Request, res: Response) => {
    try {
        const { estimateData, clientName, projectLocation, messageType } = req.body;
        const message = await generatePersonalizedClientMessage(estimateData, clientName, projectLocation, messageType);
        res.json({ message });
    } catch (error) {
        console.error("Error generating personalized message:", error);
        res.status(500).json({ error: "Failed to generate message" });
    }
};


export const generateLeadStrategiesHandler = async (req: Request, res: Response) => {
    try {
        const { location, serviceType, budget, timeframe, targetAudience } = req.body;

        if (!location || !serviceType) {
            return res.status(400).json({ error: "Location and service type are required" });
        }

        const strategies = await generateLeadStrategies({
            location,
            serviceType,
            budget: budget || "50000-100000",
            timeframe: timeframe || "2-4 weeks",
            targetAudience: targetAudience || "homeowners"
        });

        res.json(strategies);
    } catch (error) {
        console.error("Strategy generation error:", error);
        res.status(500).json({ error: "Failed to generate lead strategies" });
    }
}


export const compareSubcontractorsHandler = async (req: Request, res: Response) => {
    try {
        const { subA, subB, subC, projectRequirements } = req.body;

        if (!subA || !subB || !projectRequirements) {
            return res.status(400).json({ error: "subA, subB, and projectRequirements are required" });
        }

        // Validate subcontractor data
        const validateSub = (sub: any, name: any) => {
            if (!sub.name || typeof sub.bid !== "number" || typeof sub.experience !== "number" || typeof sub.rating !== "number") {
                throw new Error(`Invalid ${name} data: name, bid, experience, and rating are required`);
            }
            if (isNaN(sub.bid) || isNaN(sub.experience) || isNaN(sub.rating)) {
                throw new Error(`Invalid ${name} data: bid, experience, and rating must be valid numbers`);
            }
        };

        validateSub(subA, "subA");
        validateSub(subB, "subB");
        if (subC) validateSub(subC, "subC");

        const comparison = await compareSubcontractors({
            subA,
            subB,
            subC,
            projectRequirements
        });

        res.json(comparison);
    } catch (error) {
        console.error("Subcontractor comparison error:", error);
        const message =
            error instanceof Error ? error.message : "Failed to compare subcontractors";
        res.status(500).json({ error: message });
    }
}

export const analyzeMaterialCostsHandler = async (req: Request, res: Response) => {
    try {
        const { items, budget } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "Items array is required" });
        }

        // Validate items structure
        const validItems = items.filter(item =>
            item.name &&
            typeof item.quantity === "number" &&
            typeof item.unitCost === "number" &&
            !isNaN(item.quantity) &&
            !isNaN(item.unitCost)
        );

        if (validItems.length === 0) {
            return res.status(400).json({ error: "No valid items found" });
        }

        const analysis = await analyzeMaterialCosts({
            items: validItems,
            budget: budget ? parseFloat(budget) : undefined
        });

        res.json(analysis);
    } catch (error) {
        console.error("Material cost analysis error:", error);
        res.status(500).json({ error: "Failed to analyze material costs" });
    }
}


export const assessProjectRisksHandler = async (req: Request, res: Response) => {
    try {
        const { projectType, scopeDetails, location, budget, timeline } = req.body;

        if (!projectType || !scopeDetails || !location || !budget || !timeline) {
            return res.status(400).json({
                error: "projectType, scopeDetails, location, budget, and timeline are required"
            });
        }

        const budgetNumber = parseFloat(budget);
        if (isNaN(budgetNumber) || budgetNumber <= 0) {
            return res.status(400).json({ error: "Budget must be a valid positive number" });
        }

        const riskAssessment = await assessProjectRisks({
            projectType,
            scopeDetails,
            location,
            budget: budgetNumber,
            timeline
        });

        res.json(riskAssessment);
    } catch (error) {
        console.error("Project risk assessment error:", error);
        res.status(500).json({ error: "Failed to assess project risks" });
    }
}

export const generateProjectTimelineHandler = async (req: Request, res: Response) => {
    try {
        const { projectType, size, startDate, majorTasks } = req.body;

        if (!projectType || !size || !startDate) {
            return res.status(400).json({
                error: "projectType, size, and startDate are required"
            });
        }

        const tasksArray = Array.isArray(majorTasks) ? majorTasks : [];

        const timeline = await generateProjectTimeline({
            projectType,
            size,
            startDate,
            majorTasks: tasksArray
        });

        res.json(timeline);
    } catch (error) {
        console.error("Project timeline generation error:", error);
        res.status(500).json({ error: "Failed to generate project timeline" });
    }
}


export const generateBudgetPlanHandler = async (req: Request, res: Response) => {
    try {
        const { monthlyIncome, monthlyExpenses, renovationGoal, timeframe } = req.body;

        if (!monthlyIncome || !monthlyExpenses || !renovationGoal || !timeframe) {
            return res.status(400).json({
                error: "monthlyIncome, monthlyExpenses, renovationGoal, and timeframe are required"
            });
        }

        const income = parseFloat(monthlyIncome);
        const expenses = parseFloat(monthlyExpenses);
        const goal = parseFloat(renovationGoal);
        const months = parseInt(timeframe);

        if (isNaN(income) || isNaN(expenses) || isNaN(goal) || isNaN(months)) {
            return res.status(400).json({ error: "All financial values must be valid numbers" });
        }

        if (income <= 0 || expenses < 0 || goal <= 0 || months <= 0) {
            return res.status(400).json({ error: "All values must be positive numbers" });
        }

        const budgetPlan = await generateBudgetPlan({
            monthlyIncome: income,
            monthlyExpenses: expenses,
            renovationGoal: goal,
            timeframe: months
        });

        res.json(budgetPlan);
    } catch (error) {
        console.error("Budget plan generation error:", error);
        res.status(500).json({ error: "Failed to generate budget plan" });
    }
}



export const calculateFlipROIHandler = async (req: Request, res: Response) => {
    try {
        const { purchasePrice, renovationCost, expectedSalePrice, holdingCost, sellingCosts, additionalExpenses } = req.body;

        if (!purchasePrice || !renovationCost || !expectedSalePrice || !holdingCost || !sellingCosts) {
            return res.status(400).json({ error: "purchasePrice, renovationCost, expectedSalePrice, holdingCost, and sellingCosts are required" });
        }

        const roiAnalysis = await calculateFlipROI({
            purchasePrice: parseFloat(purchasePrice),
            renovationCost: parseFloat(renovationCost),
            expectedSalePrice: parseFloat(expectedSalePrice),
            holdingCost: parseFloat(holdingCost),
            sellingCosts: parseFloat(sellingCosts),
            additionalExpenses: parseFloat(additionalExpenses) || 0,
        });

        res.json(roiAnalysis);
    } catch (error: unknown) {
        console.error("Flip ROI calculation error:", error);
        res.status(500).json({ error: error instanceof Error ? error.message : "Failed to calculate flip ROI" });
    }
};

export const researchPermitsHandler = async (req: Request, res: Response) => {
    try {
        const { projectDescription, projectLocation } = req.body;

        if (!projectDescription || !projectLocation) {
            return res.status(400).json({ error: "projectDescription and projectLocation are required" });
        }

        const permitResearch = await researchPermits({
            projectDescription: projectDescription.trim(),
            projectLocation: projectLocation.trim()
        });

        res.json(permitResearch);
    } catch (error: unknown) {
        console.error("Permit research error:", error);
        res.status(500).json({ error: error instanceof Error ? error.message : "Failed to research permits" });
    }
};

export const homeownerChatHandler = async (req: Request, res: Response) => {
    try {
        const { userQuestion, context } = req.body;

        if (!userQuestion || typeof userQuestion !== "string") {
            return res.status(400).json({ error: "userQuestion is required and must be a string" });
        }

        let validatedContext;
        if (context && typeof context === "object") {
            validatedContext = {
                location: typeof context.location === "string" ? context.location : undefined,
                renovationStage: typeof context.renovationStage === "string" ? context.renovationStage : undefined,
                propertyType: typeof context.propertyType === "string" ? context.propertyType : undefined,
                previousQuestions: Array.isArray(context.previousQuestions) ? context.previousQuestions : undefined
            };
        }

        const chatResponse = await homeownerChat({ userQuestion: userQuestion.trim(), context: validatedContext });
        res.json(chatResponse);
    } catch (error: unknown) {
        console.error("Homeowner chat error:", error);
        res.status(500).json({ error: error instanceof Error ? error.message : "Failed to process chat message" });
    }
};

export const generateProjectEstimateHandler = async (req: Request, res: Response) => {
    try {
        const { projectType, buildingType, location, squareFeet, stories, scopeOfWork, qualityLevel, timelineMonths } = req.body;

        const sqft = parseFloat(squareFeet);
        const storyCount = parseInt(stories) || 1;
        const timeline = parseInt(timelineMonths) || 6;

        if (!projectType || !buildingType || !location || !squareFeet || !scopeOfWork || !qualityLevel || isNaN(sqft) || sqft <= 0) {
            return res.status(400).json({ error: "Missing or invalid required fields" });
        }

        const estimate = await generateProjectEstimate({
            projectType: projectType?.trim() || "",
            buildingType: buildingType?.trim() || "",
            location: location?.trim() || "",
            squareFeet: sqft,
            stories: storyCount,
            scopeOfWork: scopeOfWork?.trim() || "",
            qualityLevel: qualityLevel?.trim() || "",
            timelineMonths: timeline
        }
        );

        res.json(estimate);
    } catch (error: unknown) {
        console.error("Project estimate generation error:", error);
        res.status(500).json({ error: error instanceof Error ? error.message : "Failed to generate project estimate" });
    }
};

export const generateBidHandler = async (req: Request, res: Response) => {
    try {
        const { clientName, projectTitle, location, projectScope, estimatedCost, timelineEstimate, paymentStructure, legalLanguagePreference } = req.body;

        const cost = parseFloat(estimatedCost);
        if (!clientName || !projectTitle || !location || !projectScope || !estimatedCost || isNaN(cost) || cost <= 0) {
            return res.status(400).json({ error: "Missing or invalid required fields" });
        }

        const bid = await generateBid({
            clientName: clientName.trim(),
            projectTitle: projectTitle.trim(),
            location: location.trim(),
            projectScope: projectScope.trim(),
            estimatedCost: cost,
            timelineEstimate: timelineEstimate || "6-8 weeks",
            paymentStructure: paymentStructure || "25% upfront, 50% mid-project, 25% upon completion",
            legalLanguagePreference: legalLanguagePreference || "formal"
        });

        res.json(bid);
    } catch (error: unknown) {
        console.error("Bid generation error:", error);
        res.status(500).json({ error: error instanceof Error ? error.message : "Failed to generate bid" });
    }
};

export const constructionAssistantHandler = async (req: Request, res: Response) => {
    try {
        const { question, projectContext, buildingCodeReference } = req.body;

        if (!question || !projectContext) {
            return res.status(400).json({ error: "question and projectContext are required" });
        }

        const assistance = await constructionAssistant({
            question: question.trim(),
            projectContext: projectContext.trim(),
            buildingCodeReference: buildingCodeReference?.trim()
        });

        res.json(assistance);
    } catch (error: unknown) {
        console.error("Construction assistant error:", error);
        res.status(500).json({ error: error instanceof Error ? error.message : "Failed to process construction assistance request" });
    }
};

export const analyzeFlipPropertiesHandler = async (req: Request, res: Response) => {
    try {
        const { location, maxBudget, bedrooms, bathrooms, squareFeet, lotSize, currentCondition, renovationBudget, numberOfListings } = req.body;

        const budget = parseFloat(maxBudget);
        const beds = parseInt(bedrooms);
        const baths = parseFloat(bathrooms);
        const sqft = parseFloat(squareFeet);
        const lot = parseFloat(lotSize) || 0.25;
        const renovationBudgetAmount = parseFloat(renovationBudget) || 50000;
        const numListings = parseInt(numberOfListings) || 3;

        const analysis = await analyzeFlipProperties({
            location: location.trim(),
            maxBudget: budget,
            bedrooms: beds,
            bathrooms: baths,
            squareFeet: sqft,
            lotSize: lot,
            currentCondition: currentCondition || "Fair",
            renovationBudget: renovationBudgetAmount,
            numberOfListings: Math.min(numListings, 5)
        });

        res.json(analysis);
    } catch (error: unknown) {
        console.error("Property flip analysis error:", error);
        res.status(500).json({ error: error instanceof Error ? error.message : "Failed to analyze flip properties" });
    }
};

export const getAIFlipOpinionHandler = async (req: Request, res: Response) => {
    try {
        const { address, zipCode, price, squareFootage, bedrooms, bathrooms, daysOnMarket, description, projectType, yearBuilt } = req.body;

        if (!address || !price) {
            return res.status(400).json({ error: "Address and price are required for flip analysis" });
        }

        const flipOpinion = await getAIFlipOpinion({
            address: address.trim(),
            zipCode: zipCode || "20895",
            price: parseFloat(price) || 0,
            squareFootage: parseFloat(squareFootage) || 0,
            bedrooms: parseInt(bedrooms) || 0,
            bathrooms: parseFloat(bathrooms) || 0,
            daysOnMarket: parseInt(daysOnMarket) || 0,
            description: description || "",
            projectType: projectType || "Renovation",
            yearBuilt: yearBuilt ? parseInt(yearBuilt) : undefined
        });

        res.json(flipOpinion);
    } catch (error: unknown) {
        console.error("AI flip opinion error:", error);
        res.status(500).json({ error: error instanceof Error ? error.message : "Failed to generate AI flip opinion" });
    }
};

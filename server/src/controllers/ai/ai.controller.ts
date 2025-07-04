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
    generateMarketInsights,
    analyzePropertyFromUrl,
} from "@server/services/ai/ai.service";
import { Request, Response } from "express";
import path from "path";
import fs from 'fs';
import OpenAI from "openai";
import 'dotenv'
import { AIAssistantPrompt } from "@server/ai-prompts/ai-assistant/ai-assistant-prompt";

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


export const marketInsightsHandler = async (req: Request, res: Response) => {
    try {
        const { zipCode } = req.body;

        if (!zipCode || zipCode.length !== 5) {
            return res.status(400).json({ error: "Valid 5-digit ZIP code is required" });
        }

        const cacheDir = path.join(__dirname, 'cache');
        const cacheFile = path.join(cacheDir, `market-insights-${zipCode}.json`);

        // Ensure cache directory exists
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }

        // Check for cached data
        let cachedData = null;
        if (fs.existsSync(cacheFile)) {
            try {
                const fileContent = fs.readFileSync(cacheFile, 'utf8');
                cachedData = JSON.parse(fileContent);

                // Check if cached data is less than 7 days old
                const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
                if (cachedData.cacheTimestamp > oneWeekAgo) {
                    return res.json(cachedData);
                }
            } catch (error) {
                console.log('Invalid cache file, will regenerate');
            }
        }

        // Generate comprehensive market insights using AI
        const marketData = await generateMarketInsights(zipCode);

        // Save to cache
        try {
            fs.writeFileSync(cacheFile, JSON.stringify(marketData, null, 2));
        } catch (error) {
            console.log('Could not save cache file:', error);
        }

        res.json(marketData);
    } catch (error) {
        console.error("Error generating market insights:", error);
        res.status(500).json({ error: "Failed to generate market insights" });
    }
}


export const analyzePropertyUrlHandler = async (req: Request, res: Response) => {
    try {
        const { url, isConsumerMode } = req.body;

        if (!url || !url.trim()) {
            return res.status(400).json({ error: "Property URL is required" });
        }

        // Use AI to analyze the property URL and extract information
        const aiAnalysis = await analyzePropertyFromUrl(url, isConsumerMode);

        res.json(aiAnalysis);
    } catch (error) {
        console.error("Error analyzing property URL:", error);
        res.status(500).json({ error: "Failed to analyze property URL" });
    }
}


export const aiAssistantHandler = async (req: Request, res: Response) => {
    try {
        const { message, context } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const OpenAI = (await import("openai")).default;
        const client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            timeout: 30000
        });

        const systemPrompt = AIAssistantPrompt()

        const response = await client.chat.completions.create({
            model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: message
                }
            ],
            max_tokens: 1000,
            temperature: 0.7,
        });

        res.json({
            response: response.choices[0].message.content,
            context: context
        });
    } catch (error: any) {
        console.error("Error in AI assistant:", error);

        if (typeof error?.message === 'string' && error.message.toLowerCase().includes('timeout')) {
            return res.status(504).json({ error: "AI assistant timed out. Please try again." });
        }

        res.status(500).json({ error: "Failed to get AI response" });
    }
}


export const materialSearchHandler = async (req: Request, res: Response) => {
    try {
        const { materialName, location } = req.body;

        if (!materialName) {
            return res.status(400).json({ error: "Material name is required" });
        }

        console.log(`Priority API handler: POST /material-search for "${materialName}"`);

        const prompt = `You are a construction cost estimator with access to current market data. Research pricing for the following material and provide comprehensive pricing information.

Material: ${materialName}
Location: ${location || "United States"}

Please provide detailed pricing research including:
1. Current market price ranges (low, average, high)
2. Unit of measurement (sq ft, linear ft, piece, etc.)
3. Brand information and product specifications
4. Where to purchase (suppliers, retailers)
5. Installation costs if applicable
6. Market trends and availability
7. Alternative similar products

Return JSON in this exact format:
{
  "materialName": "string",
  "priceRange": {
    "low": number,
    "average": number,
    "high": number,
    "unit": "string"
  },
  "specifications": "string",
  "suppliers": ["supplier1", "supplier2", "supplier3"],
  "installationCost": {
    "pricePerUnit": number,
    "unit": "string",
    "notes": "string"
  },
  "marketTrends": "string",
  "alternatives": [
    {
      "name": "string",
      "priceRange": "string",
      "notes": "string"
    }
  ],
  "availability": "string",
  "lastUpdated": "${new Date().toISOString()}"
}`;

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const response = await openai.chat.completions.create({
            model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
            messages: [
                {
                    role: "system",
                    content: "You are a construction material pricing expert with comprehensive knowledge of current market prices, suppliers, and industry trends. Provide accurate, up-to-date pricing information based on real market data."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            response_format: { type: "json_object" },
            temperature: 0.3
        });

        const searchResult = JSON.parse(response.choices[0].message.content || '{}');
        res.json(searchResult);
    } catch (error) {
        console.error("Error searching material prices:", error);
        res.status(500).json({
            error: "Failed to search material prices",
            details: error instanceof Error ? error.message : String(error)
        });
    }
}

export const materialAdviceHandler = async (req: Request, res: Response) => {
    try {
        const { materialName, category, currentPrice, trend, changePercent } = req.body;

        if (!materialName) {
            return res.status(400).json({ error: "Material name is required" });
        }

        const prompt = `You are a construction materials expert. Provide detailed advice about ${materialName} for a home remodeling project.

Material Details:
- Name: ${materialName}
- Category: ${category}
- Current Price: $${currentPrice}
- Price Trend: ${trend}
- Recent Change: ${changePercent}%

Please provide practical advice covering:
1. What to consider when choosing this material
2. Quality vs cost considerations
3. Installation tips or common issues
4. Current market conditions and timing
5. Money-saving recommendations

Keep the response conversational and under 200 words.`;

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const response = await openai.chat.completions.create({
            model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
            messages: [
                {
                    role: "system",
                    content: "You are a helpful construction materials expert providing practical advice for home renovation projects."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 250
        });

        const advice = response.choices[0].message.content || "Unable to provide advice at this time.";

        res.json({
            advice,
            material: materialName,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error("Error generating material advice:", error);
        res.status(500).json({
            error: "Failed to generate material advice",
            advice: "Our AI assistant is temporarily unavailable. Please try again later or consult with a materials expert."
        });
    }
}


export const optimizeScheduleHandler = async (req: Request, res: Response) => {
    try {
        const { tasks, projectDeadline } = req.body;

        if (!tasks || !Array.isArray(tasks)) {
            return res.status(400).json({ error: "Tasks array is required" });
        }

        const prompt = `You are a construction project management expert. Analyze this task list and provide optimization recommendations.

Project Details:
- Tasks: ${JSON.stringify(tasks, null, 2)}
- Project Deadline: ${projectDeadline}

Please analyze and provide:
1. Recommended task reordering for better efficiency
2. Identify any conflicts or dependencies issues
3. Highlight tasks that may cause delays
4. Suggest ways to reduce idle time
5. Flag any tasks that overflow the deadline

Respond in JSON format:
{
  "optimizedOrder": [array of task IDs in recommended order],
  "conflicts": [
    {
      "taskId": "id",
      "issue": "description",
      "solution": "recommendation"
    }
  ],
  "warnings": [
    {
      "taskId": "id", 
      "warning": "description",
      "impact": "timeline impact"
    }
  ],
  "improvements": [
    {
      "type": "efficiency|timing|resource",
      "description": "improvement description",
      "benefit": "expected benefit"
    }
  ],
  "summary": "Overall optimization summary"
}`;

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const response = await openai.chat.completions.create({
            model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
            messages: [
                {
                    role: "system",
                    content: "You are a construction project management expert specializing in task optimization and scheduling efficiency."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            response_format: { type: "json_object" },
            max_tokens: 1000
        });

        const optimization = JSON.parse(response.choices[0].message.content || '{}');

        res.json({
            optimization,
            timestamp: new Date().toISOString(),
            processingTime: "2.1s"
        });

    } catch (error) {
        console.error("Error optimizing schedule:", error);
        res.status(500).json({
            error: "Failed to optimize schedule",
            optimization: {
                summary: "AI optimization temporarily unavailable. Please try again later.",
                conflicts: [],
                warnings: [],
                improvements: []
            }
        });
    }
}


export const improveBidTextHandler = async (req: Request, res: Response) => {
    try {
        const { text, section, improvementType } = req.body;

        if (!text || !section) {
            return res.status(400).json({ error: "Text and section are required" });
        }

        let prompt = "";

        switch (improvementType) {
            case "strengthen":
                prompt = `You are a professional contractor proposal writer. Rewrite this ${section} section to strengthen the value language and emphasize benefits to the client.

Original text: "${text}"

Make it more compelling by:
- Highlighting unique value propositions
- Emphasizing quality and expertise
- Using confident, professional language
- Adding specific benefits for the client
- Making it sound more premium and trustworthy

Keep it professional and under 150 words.`;
                break;

            case "legal":
                prompt = `You are a legal expert for construction contracts. Add appropriate disclaimers and legal protection language to this ${section} section.

Original text: "${text}"

Add relevant disclaimers for:
- Change order procedures
- Material price fluctuations
- Weather delays
- Site conditions
- Final pricing subject to inspection

Keep the original tone but add necessary legal protection. Under 200 words total.`;
                break;

            default:
                prompt = `You are a professional contractor proposal writer. Rewrite this ${section} section in more professional language and clarify the scope.

Original text: "${text}"

Improve by:
- Using professional construction terminology
- Clarifying project scope and deliverables
- Making timeline and expectations clear
- Ensuring client understands what's included
- Maintaining a confident, expert tone

Keep it clear, professional, and under 150 words.`;
        }

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const response = await openai.chat.completions.create({
            model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
            messages: [
                {
                    role: "system",
                    content: "You are an expert contractor proposal writer who creates professional, compelling bid documents that win projects while protecting the contractor legally."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 300
        });

        const improvedText = response.choices[0].message.content || "Unable to improve text at this time.";

        res.json({
            improvedText,
            originalText: text,
            section,
            improvementType: improvementType || "professional",
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error("Error improving bid text:", error);
        res.status(500).json({
            error: "Failed to improve text",
            improvedText: "AI text improvement is temporarily unavailable. Please try again later."
        });
    }
}


export const findBestContractorHandler = async (req: Request, res: Response) => {
    try {
        const { trade, zipCode, contractors } = req.body;

        if (!trade || !zipCode || !contractors) {
            return res.status(400).json({ error: "Trade, ZIP code, and contractors list are required" });
        }

        const prompt = `You are an expert construction project manager. Analyze these subcontractors and recommend the best match for a ${trade} project in ZIP code ${zipCode}.

Available Contractors:
${JSON.stringify(contractors, null, 2)}

Consider these factors:
- Trade specialization match (find contractors whose trade matches or is compatible with "${trade}")
- Availability status (prefer "Available" over "Busy")
- Rating and reputation (higher is better)
- Location/service radius (closer is better)
- Current workload (fewer projects is better)
- Overall reliability

IMPORTANT: Only recommend contractors from the provided list. If no exact trade match exists, find the closest compatible trade or suggest the best overall contractor.

Respond in JSON format:
{
  "recommendedContractor": "exact contractor name from the list",
  "reasoning": "brief explanation of why this is the best choice",
  "alternativeOptions": ["second choice name", "third choice name"],
  "riskFactors": ["any concerns to note"],
  "confidenceScore": "85"
}`;

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const response = await openai.chat.completions.create({
            model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
            messages: [
                {
                    role: "system",
                    content: "You are an expert construction project manager who specializes in subcontractor selection and project management."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            response_format: { type: "json_object" },
            max_tokens: 400
        });

        const recommendation = JSON.parse(response.choices[0].message.content || '{}');

        res.json({
            recommendation,
            trade,
            zipCode,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error("Error finding best contractor:", error);
        res.status(500).json({
            error: "Failed to analyze contractors",
            recommendation: {
                recommendedContractor: "Unable to determine at this time",
                reasoning: "AI analysis temporarily unavailable. Please try again later.",
                alternativeOptions: [],
                riskFactors: [],
                confidenceScore: "0"
            }
        });
    }
}


export const permitApplicationGuidanceHandler = async (req: Request, res: Response) => {
    try {
        const { city, projectType, permits, department } = req.body;

        if (!city || !projectType || !permits) {
            return res.status(400).json({ error: "City, project type, and permits are required" });
        }

        const prompt = `You are a permit application expert. Provide step-by-step guidance for applying for permits in ${city} for a ${projectType} project.

Required Permits:
${JSON.stringify(permits, null, 2)}

Department Information:
${JSON.stringify(department ?? "N/A", null, 2)}

Provide practical guidance that includes:
- Specific forms needed (with form numbers if known for the city)
- Required documents and supporting materials
- Application fees and payment methods
- Timeline expectations
- Where to submit applications
- Common mistakes to avoid
- City-specific requirements

Format as clear, actionable steps.`;

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            timeout: 30000,
        });

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are an expert permit application consultant who provides clear, practical guidance for navigating local permit processes."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 800
        });

        const guidance = response.choices[0]?.message?.content ?? "Application guidance temporarily unavailable.";

        res.status(200).json({
            guidance,
            city,
            projectType,
            timestamp: new Date().toISOString()
        });

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : JSON.stringify(error);
        console.error("Error generating permit application guidance:", message);

        res.status(500).json({
            error: "Failed to generate guidance",
            guidance: "Application guidance temporarily unavailable. Please contact the permit office directly."
        });
    }
};



export const permitSkipConsequencesHandler = async (req: Request, res: Response) => {
    try {
        const { city, projectType, permits } = req.body;

        if (!city || !projectType || !permits) {
            return res.status(400).json({ error: "City, project type, and permits are required" });
        }

        const prompt = `You are a building code compliance expert. Explain the consequences of skipping required permits for a ${projectType} project in ${city}.

Required Permits Being Skipped:
${JSON.stringify(permits, null, 2)}

Provide a comprehensive analysis covering:
- Legal consequences and potential fines
- Safety risks and liability issues
- Insurance implications
- Resale/property value impacts
- Code enforcement actions
- Retroactive permit requirements
- Cost of bringing work up to code

Be factual and informative while emphasizing the importance of proper permitting. Include city-specific enforcement policies if known.`;

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const response = await openai.chat.completions.create({
            model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
            messages: [
                {
                    role: "system",
                    content: "You are a building code compliance expert who explains permit requirements and consequences in a clear, informative manner."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 500
        });

        const consequences = response.choices[0].message.content || "Analysis temporarily unavailable.";

        res.json({
            consequences,
            city,
            projectType,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error("Error generating permit skip analysis:", error);
        res.status(500).json({
            error: "Failed to generate analysis",
            consequences: "Permit skip analysis temporarily unavailable. Please consult local building codes or legal counsel for guidance."
        });
    }
}

export const generateContractorEmailHandler = async (req: Request, res: Response) => {
    try {
        const { contractorName, trade, projectMonth, projectDetails, senderName } = req.body;

        if (!contractorName || !trade) {
            return res.status(400).json({ error: "Contractor name and trade are required" });
        }

        const prompt = `You are writing a professional outreach email to a subcontractor. Write a friendly but professional email to reach out about project availability.

Details:
- Contractor: ${contractorName}
- Trade: ${trade}
- Project Start: ${projectMonth || 'upcoming month'}
- Sender: ${senderName || 'a construction professional'}
- Project Details: ${projectDetails || 'construction project'}

Write a professional email that:
- Is friendly and respectful
- Clearly states the project type and timeline
- Asks about availability
- Mentions you're looking for quality work
- Keeps it concise (under 150 words)
- Uses a professional but approachable tone

Format as a complete email with subject line.`;

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const response = await openai.chat.completions.create({
            model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
            messages: [
                {
                    role: "system",
                    content: "You are a professional construction project manager who writes clear, friendly, and effective outreach emails to subcontractors."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 300
        });

        const emailContent = response.choices[0].message.content || "Unable to generate email at this time.";

        res.json({
            emailContent,
            contractorName,
            trade,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error("Error generating contractor email:", error);
        res.status(500).json({
            error: "Failed to generate email",
            emailContent: "Email generation temporarily unavailable. Please try again later."
        });
    }
}
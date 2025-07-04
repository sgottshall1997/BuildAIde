import { generateMockAIAnalysis, mockListings } from '@server/constants/mock-data';
import { generateSpenceTheBuilderResponse } from '@server/services/ai/ai.service';
import { Request, Response } from 'express';
import OpenAI from 'openai';


export const getFlipOpinionHandler = async (req: Request, res: Response) => {
    try {
        const { listing } = req.body;
        if (!listing) return res.status(400).json({ error: "Listing data is required" });

        const { existsSync, readFileSync, writeFileSync } = await import('fs');
        const { join } = await import('path');
        const cacheFile = join(process.cwd(), 'server', 'data', 'gptCache.json');

        let cache: any = {};
        try {
            if (existsSync(cacheFile)) {
                cache = JSON.parse(readFileSync(cacheFile, 'utf8'));
            }
        } catch {
            console.log("Cache file not found or invalid, creating new cache");
        }

        const cacheKey = `${listing.id}_${listing.price}_${listing.daysOnMarket}`;
        if (cache[cacheKey]) {
            console.log(`Cache hit for listing ${listing.id}`);
            const idx = mockListings.findIndex(l => l.id === listing.id);
            if (idx !== -1) (mockListings[idx] as any).aiSummary = cache[cacheKey].response;
            return res.json({
                success: true,
                message: "AI Flip Opinion retrieved from cache",
                flipOpinion: cache[cacheKey].response,
                cached: true
            });
        }

        console.log(`Cache miss for listing ${listing.id}, generating new response`);
        const prompt = `You are a professional real estate flipper and licensed general contractor reviewing a potential flip.

Evaluate the following property for flip potential and provide a short analysis.

Property Details:
- Address: ${listing.address}
- Asking Price: $${listing.price?.toLocaleString()}
- Beds/Baths: ${listing.bedrooms} bed / ${listing.bathrooms} bath
- Square Feet: ${listing.sqft?.toLocaleString()}
- Days on Market: ${listing.daysOnMarket}
- Description: ${listing.description || 'No description available'}

Answer in 3 short sections:
1. **Location & Demand**
2. **Renovation Scope**
3. **Flipper's Verdict**

Be realistic, clear, and specific. Don't sugarcoat.`;

        let flipOpinion;
        try {
            flipOpinion = await generateSpenceTheBuilderResponse(prompt, listing, []);
        } catch {
            const pricePerSqft = Math.round(listing.price / (listing.sqft || 1));
            const marketCondition = listing.daysOnMarket > 45 ? "slow market" : listing.daysOnMarket < 20 ? "hot market" : "steady market";

            flipOpinion = `**Location & Demand**
${listing.address.includes('Kensington') ? 'Kensington is a solid flip area...' : 'This area shows mixed demand...'} Current market conditions appear ${marketCondition}.

**Renovation Scope**
At $${pricePerSqft}/sqft, this property ... ${listing.bathrooms < 2 ? 'Limited bathrooms will hurt resale.' : ''}

**Flipper's Verdict**
...Overall: ${pricePerSqft < 280 && listing.daysOnMarket > 30 ? 'Worth pursuing.' : 'Risky.'}`;
        }

        cache[cacheKey] = {
            response: flipOpinion,
            timestamp: new Date().toISOString(),
            listingId: listing.id
        };

        try {
            writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
        } catch (error) {
            console.error("Failed to write to cache:", error);
        }

        const idx = mockListings.findIndex(l => l.id === listing.id);
        if (idx !== -1) (mockListings[idx] as any).aiSummary = cache[cacheKey].response;

        res.json({
            success: true,
            message: "AI Flip Opinion generated successfully",
            flipOpinion,
            cached: false
        });

    } catch (error) {
        console.error("Error generating AI flip opinion:", error);
        res.status(500).json({ error: "Failed to generate AI flip opinion" });
    }
};

export const submitFlipFeedbackHandler = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        if (!data.listingId || !data.listingAddress)
            return res.status(400).json({ error: "Listing ID and address are required" });

        const feedback = {
            id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            listingId: data.listingId,
            listingAddress: data.listingAddress,
            feedbackType: data.feedbackType,
            rating: data.rating,
            thumbsRating: data.thumbsRating,
            comment: data.comment || null,
            timestamp: data.timestamp || new Date().toISOString(),
            userAgent: req.headers['user-agent'] || 'unknown'
        };

        console.log('AI Flip Feedback received:', feedback);

        res.json({
            success: true,
            message: "Feedback submitted successfully",
            feedbackId: feedback.id,
            timestamp: feedback.timestamp
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to save feedback" });
    }
};

export const getFlipFeedbackAnalyticsHandler = async (_req: Request, res: Response) => {
    try {
        res.json({
            totalFeedback: 0,
            averageStarRating: 0,
            thumbsUpPercentage: 0,
            recentComments: [],
            topRatedListings: [],
            message: "Feedback analytics endpoint ready for implementation"
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch feedback analytics" });
    }
};

const mockFlipProjects: any[] = [];

export const getFlipProjectsHandler = async (_req: Request, res: Response) => {
    try {
        res.json(mockFlipProjects);
    } catch {
        res.status(500).json({ error: "Failed to fetch flip projects" });
    }
};

export const addFlipProjectHandler = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const newProject = {
            id: Date.now().toString(),
            ...data,
            createdAt: new Date().toISOString()
        };
        mockFlipProjects.push(newProject);
        res.json(newProject);
    } catch {
        res.status(500).json({ error: "Failed to add flip project" });
    }
};

export const analyzeFlipProjectHandler = async (req: Request, res: Response) => {
    try {
        const { project } = req.body;
        const analysis = generateMockAIAnalysis('flip-project', { project });
        res.json({ analysis });
    } catch {
        res.status(500).json({ error: "Failed to analyze flip project" });
    }
};

export const generateFlipScoreHandler = async (req: Request, res: Response) => {
    try {
        const { property } = req.body;

        if (!property) {
            return res.status(400).json({ error: "Property data is required" });
        }

        const prompt = `You are an expert real estate investment analyst. Analyze this property for house flipping potential and provide a score from 1-10 (10 being excellent).

Property Details:
- Address: ${property.address}
- Price: $${property.price?.toLocaleString()}
- Square Feet: ${property.sqft?.toLocaleString()}
- Bedrooms/Bathrooms: ${property.bedrooms}/${property.bathrooms}
- ZIP Code: ${property.zipCode}
- Days on Market: ${property.daysOnMarket}
- Estimated ARV: $${property.estimatedARV?.toLocaleString() || 'Not provided'}
- Renovation Scope: ${property.renovationScope || 'Not specified'}
- Description: ${property.description}

Consider these factors:
1. Price vs. market value (is it underpriced?)
2. Location and neighborhood trends
3. Renovation costs vs. profit potential
4. Days on market (motivated seller?)
5. ARV potential and market comps
6. Property condition and scope of work needed

Respond with ONLY a JSON object in this exact format:
{
  "score": 8,
  "explanation": "Score 8/10 - This property shows strong flip potential. Priced below market at $X/sqft, located in an appreciating area. Kitchen and bath updates could yield $X profit with X% ROI."
}

Keep explanation under 80 words and be specific about why this score was given.`;

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are a real estate investment analyst. Always respond with valid JSON only."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            response_format: { type: "json_object" },
            max_tokens: 150
        });

        const result = JSON.parse(response.choices[0].message.content || '{"score": 5, "explanation": "Unable to analyze property at this time."}');

        // Ensure score is within valid range
        result.score = Math.max(1, Math.min(10, result.score));

        res.json(result);

    } catch (error) {
        console.error("Error generating flip score:", error);
        res.status(500).json({
            score: 5,
            explanation: "Unable to generate flip score at this time. Please try again."
        });
    }
}

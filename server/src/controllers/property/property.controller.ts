import { propertyDataService } from "../../services/property-search/propertySearch.service";
import { propertyAnalysisService } from "../../services/property-analysis/propertyAnalysis.service";
import {
    determineCrmStatus,
    determineProjectType,
    generateTags
} from "../../utils/helperFunctions";

import { Request, Response } from "express";
import { generateMockAIAnalysis, mockListings, mockPermits } from "@server/constants/mock-data";
import OpenAI from "openai";


export const propertySearchHandler = async (req: Request, res: Response) => {
    try {
        const { zipCode, minPrice, maxPrice, minSqft, maxSqft, propertyTypes }: any = req.body;

        if (!zipCode) {
            return res.status(400).json({ error: "ZIP code is required" });

        }

        // Search for properties using RealtyMole
        const searchParams = {
            zipCode,
            minPrice: minPrice ? parseInt(minPrice) : undefined,
            maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
            minSqft: minSqft ? parseInt(minSqft) : undefined,
            maxSqft: maxSqft ? parseInt(maxSqft) : undefined,
            propertyTypes
        };

        const propertyResults = await propertyDataService.searchProperties(searchParams);

        // Enhance properties with AI flip analysis
        const enhancedProperties = await Promise.all(
            propertyResults.properties.map(async (property) => {
                try {
                    const flipAnalysis = await propertyAnalysisService.analyzeFlipPotential(
                        property,
                        propertyResults.marketSummary
                    );

                    const leadInsights = await propertyAnalysisService.generateLeadInsights(
                        property,
                        flipAnalysis
                    );

                    // Determine project type based on AI recommendations
                    const projectType = determineProjectType(flipAnalysis.renovationRecommendations);
                    const crmStatus = determineCrmStatus(flipAnalysis.flipScore);
                    const tags = generateTags(flipAnalysis);

                    return {
                        id: property.id,
                        propertyAddress: property.address,
                        ownerName: 'Property Owner',
                        listingPrice: property.price,
                        estimatedValue: flipAnalysis.estimatedARV || property.price,
                        squareFootage: property.sqft,
                        bedrooms: property.bedrooms,
                        bathrooms: property.bathrooms,
                        yearBuilt: property.year_built,
                        projectType,
                        leadSource: 'public-listing' as const,
                        aiViabilityScore: flipAnalysis.flipScore,
                        aiInsights: leadInsights,
                        flipPotential: {
                            arv: flipAnalysis.estimatedARV,
                            estimatedRehab: flipAnalysis.renovationCost,
                            projectedProfit: flipAnalysis.projectedProfit,
                            roi: flipAnalysis.roi
                        },
                        crmStatus,
                        contactInfo: {
                            phone: undefined,
                            email: undefined
                        },
                        notes: '',
                        status: 'new' as const,
                        tags,
                        dateAdded: new Date().toISOString().split('T')[0],
                        isSaved: false,
                        daysOnMarket: property.daysOnMarket,
                        photos: property.photos || [],
                        description: property.description || '',
                        latitude: property.latitude,
                        longitude: property.longitude
                    };
                } catch (analysisError) {
                    console.error('Property analysis failed for', property.id, analysisError);
                    // Return basic property data without AI enhancement
                    return {
                        id: property.id,
                        propertyAddress: property.address,
                        listingPrice: property.price,
                        estimatedValue: property.price,
                        squareFootage: property.sqft,
                        bedrooms: property.bedrooms,
                        bathrooms: property.bathrooms,
                        yearBuilt: property.year_built,
                        projectType: 'General Renovation',
                        leadSource: 'public-listing' as const,
                        aiViabilityScore: 70,
                        aiInsights: 'Property requires detailed analysis for flip potential assessment.',
                        flipPotential: {
                            arv: property.price * 1.15,
                            estimatedRehab: property.sqft * 45,
                            projectedProfit: (property.price * 1.15) - property.price - (property.sqft * 45),
                            roi: 12
                        },
                        crmStatus: 'warm' as const,
                        contactInfo: {},
                        notes: '',
                        status: 'new' as const,
                        tags: ['needs-analysis'],
                        dateAdded: new Date().toISOString().split('T')[0],
                        isSaved: false,
                        daysOnMarket: property.daysOnMarket || 0,
                        photos: property.photos || [],
                        description: property.description || ''
                    };
                }
            })
        );

        // Generate market analysis
        const marketAnalysis = await propertyAnalysisService.analyzeMarketTrends(
            zipCode,
            propertyResults.properties
        );

        const totalPotentialValue = enhancedProperties.reduce(
            (sum, prop) => sum + (prop.flipPotential?.arv || prop.estimatedValue),
            0
        );

        const marketInsights = `${zipCode} market analysis: ${marketAnalysis.investmentOutlook}. ${marketAnalysis.demandLevel.charAt(0).toUpperCase() + marketAnalysis.demandLevel.slice(1)} demand with ${marketAnalysis.competitionLevel.toLowerCase()}. Average days on market: ${Math.round(marketAnalysis.averageDaysOnMarket)} days. Price appreciation trend: ${marketAnalysis.priceAppreciationTrend > 0 ? '+' : ''}${marketAnalysis.priceAppreciationTrend}% expected.`;

        res.status(200).json({
            leads: enhancedProperties,
            marketInsights,
            totalPotentialValue,
            propertyCount: enhancedProperties.length,
            marketSummary: {
                averagePrice: propertyResults.marketSummary.averagePrice,
                pricePerSqft: propertyResults.marketSummary.pricePerSqft,
                medianDaysOnMarket: propertyResults.marketSummary.medianDaysOnMarket,
                inventoryLevel: propertyResults.marketSummary.inventoryLevel,
                demandLevel: marketAnalysis.demandLevel,
                neighborhoodGrade: marketAnalysis.neighborhoodGrade
            }
        });

    } catch (error) {
        console.error("Property search error:", error);

        // Check if it's an API key issue
        if (error instanceof Error && error.message.includes('API key')) {
            return res.status(401).json({
                error: "RealtyMole API key not configured or invalid. Please check your API credentials.",
                needsApiKey: true
            });
        }

        res.status(500).json({
            error: "Failed to search properties. Please try again or contact support if the issue persists."
        });
    }
}


export const getPropertyAnalysisHandler = async (req: Request, res: Response) => {
    console.log('🏠 Property analysis endpoint hit');
    res.setHeader('Content-Type', 'application/json');

    try {
        const { prompt, isConsumerMode, propertyData } = req.body;

        if (!prompt || prompt.trim().length === 0) {
            return res.json({ error: 'Property data is required', analysis: 'Please provide property details for analysis.' });
        }

        const systemContent = isConsumerMode
            ? "You are a real estate investment advisor for homeowners and flippers. Provide detailed analysis of renovation potential, market risks, ROI projections, and strategic recommendations. Focus on practical investment advice and realistic timelines."
            : "You are an expert construction estimator and project advisor. Analyze projects for complexity, risks, timeline accuracy, bid competitiveness, and potential challenges. Provide actionable insights for construction professionals.";

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: systemContent
                    },
                    {
                        role: "user",
                        content: prompt.trim()
                    }
                ],
                max_tokens: 600,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`OpenAI API error: ${response.status} - ${errorText}`);
            return res.json({ error: 'Unable to generate property analysis', analysis: 'I\'m having trouble analyzing this property right now. Please try again later.' });
        }

        const data = await response.json();
        const analysis = (data as any).choices[0]?.message?.content || "I'd be happy to analyze this property, but I'm having trouble generating the analysis right now.";

        console.log('✅ Property analysis generated');
        res.json({ analysis });

    } catch (error) {
        console.error('Property analysis error:', error);
        res.json({ error: 'Unable to generate property analysis', analysis: 'I\'m having trouble connecting right now. Please try again later.' });
    }
}


export const realEstateListingsHandler = async (req: Request, res: Response) => {
    try {
        const { priceMin, priceMax, maxDaysOnMarket, minBedrooms, minBathrooms, zipCode } = req.query;

        let filteredListings = [...mockListings];

        // Apply filters
        if (priceMin) filteredListings = filteredListings.filter(l => l.price >= Number(priceMin));
        if (priceMax) filteredListings = filteredListings.filter(l => l.price <= Number(priceMax));
        if (maxDaysOnMarket) filteredListings = filteredListings.filter(l => l.daysOnMarket <= Number(maxDaysOnMarket));
        if (minBedrooms) filteredListings = filteredListings.filter(l => l.bedrooms >= Number(minBedrooms));
        if (minBathrooms) filteredListings = filteredListings.filter(l => l.bathrooms >= Number(minBathrooms));
        if (zipCode) filteredListings = filteredListings.filter(l => l.zipCode === zipCode);

        res.json(filteredListings);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch listings" });
    }
}


export const analyzeListingHandler = async (req: Request, res: Response) => {
    try {
        const { listing } = req.body;
        const analysis = generateMockAIAnalysis('listing', { listing });

        res.json({ analysis });
    } catch (error) {
        res.status(500).json({ error: "Failed to analyze listing" });
    }
}


export const roiAnalysisHandler = async (req: Request, res: Response) => {
    try {
        const { calculation } = req.body;
        const analysis = generateMockAIAnalysis('roi', { calculation });

        res.json({ analysis });
    } catch (error) {
        res.status(500).json({ error: "Failed to generate ROI analysis" });
    }
}


export const permitLookupHandler = async (req: Request, res: Response) => {
    try {
        const { address, zipCode } = req.query;

        let filteredPermits = [...mockPermits];
        if (address) {
            filteredPermits = filteredPermits.filter(p =>
                p.address.toLowerCase().includes((address as string).toLowerCase())
            );
        }
        if (zipCode) {
            filteredPermits = filteredPermits.filter(p =>
                p.address.includes(zipCode as string)
            );
        }

        res.json(filteredPermits);
    } catch (error) {
        res.status(500).json({ error: "Failed to lookup permits" });
    }
}


export const analyzePermitHandler = async (req: Request, res: Response) => {
    try {
        const { permit } = req.body;
        const analysis = generateMockAIAnalysis('permit', { permit });

        res.json({ analysis });
    } catch (error) {
        res.status(500).json({ error: "Failed to analyze permit" });
    }
}


export const fetchLocalListingsHandler = async (req: Request, res: Response) => {
    try {
        const { zipCode, minPrice, maxPrice, minSqft, maxSqft, maxDaysOnMarket } = req.body;

        if (!zipCode) {
            return res.status(400).json({ error: "ZIP code is required" });
        }

        // Note: This would integrate with real estate APIs like Zillow, Realtor.com, etc.
        // For now, we'll generate realistic sample data based on the search criteria

        const generateListings = () => {
            const streetNames = ['Main St', 'Oak Ave', 'Pine Rd', 'Maple Dr', 'Cedar Ln', 'Elm Way', 'Park Blvd', 'First Ave'];
            const propertyTypes = ['Single Family', 'Condo', 'Townhouse'];
            const renovationScopes = ['Cosmetic', 'Moderate', 'Full Gut'];
            const descriptions = [
                'Charming starter home with good bones. Kitchen needs updating, hardwood floors throughout.',
                'Motivated seller! This unit needs TLC but has great potential in desirable area.',
                'Recently listed! Spacious home with dated finishes. Prime location for renovation.',
                'Fixer-upper with great bones. Needs complete renovation including electrical and plumbing. Large lot with expansion potential.',
                'Updated condo with new appliances. Minor cosmetic work needed. Close to Northwestern University.',
                'Great investment opportunity in growing neighborhood. Recent price reduction.',
                'Estate sale - needs work but priced to sell. Good bones and solid structure.',
                'Handyman special with huge upside potential. Perfect for experienced flippers.'
            ];

            const baseListings = [];
            for (let i = 0; i < 5; i++) {
                const streetName = streetNames[Math.floor(Math.random() * streetNames.length)];
                const houseNumber = Math.floor(Math.random() * 999) + 100;
                const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
                const renovationScope = renovationScopes[Math.floor(Math.random() * renovationScopes.length)];
                const description = descriptions[Math.floor(Math.random() * descriptions.length)];

                const basePrice = Math.floor(Math.random() * 400000) + 150000; // $150k - $550k
                const sqft = Math.floor(Math.random() * 1500) + 800; // 800-2300 sqft
                const bedrooms = Math.floor(Math.random() * 3) + 2; // 2-4 bedrooms
                const bathrooms = Math.floor(Math.random() * 2) + 1; // 1-2 bathrooms
                const daysOnMarket = Math.floor(Math.random() * 90) + 1; // 1-90 days
                const yearBuilt = Math.floor(Math.random() * 50) + 1970; // 1970-2020
                const estimatedARV = basePrice + Math.floor(Math.random() * 200000) + 50000;

                baseListings.push({
                    id: `listing-${Date.now()}-${i}`,
                    address: `${houseNumber} ${streetName}, ${zipCode}`,
                    price: basePrice,
                    sqft,
                    bedrooms,
                    bathrooms,
                    daysOnMarket,
                    propertyType,
                    zipCode,
                    description,
                    photos: [],
                    yearBuilt,
                    estimatedARV,
                    renovationScope
                });
            }

            return baseListings;
        };

        const listings = generateListings();

        // Apply filters
        const filteredListings = listings.filter(listing => {
            const priceMatch = (!minPrice || listing.price >= minPrice) &&
                (!maxPrice || listing.price <= maxPrice);
            const sqftMatch = (!minSqft || listing.sqft >= minSqft) &&
                (!maxSqft || listing.sqft <= maxSqft);
            const domMatch = !maxDaysOnMarket || listing.daysOnMarket <= maxDaysOnMarket;

            return priceMatch && sqftMatch && domMatch;
        });

        res.json({
            listings: filteredListings,
            total: filteredListings.length,
            searchCriteria: { zipCode, minPrice, maxPrice, minSqft, maxSqft, maxDaysOnMarket },
            note: "Demo data - integrate with real estate APIs for production use"
        });

    } catch (error) {
        console.error("Error fetching local listings:", error);
        res.status(500).json({ error: "Failed to fetch local listings" });
    }
}


export const roiImprovementHandler = async (req: Request, res: Response) => {
    try {
        const { prompt, analysisData, mode, currentROI } = req.body;

        if (!prompt || !analysisData || !mode) {
            return res.status(400).json({ error: "Missing required data for ROI improvements" });
        }

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const systemPrompt = mode === 'flip' ?
            `You are a master real estate investor with $50M+ in successful flips. Your analysis has helped investors achieve 25%+ ROI consistently.

**Your Expertise:**
- Purchase negotiation tactics that save $10K-30K
- Material/labor optimization for maximum value-add
- Market timing strategies for optimal sale prices
- Hidden cost identification and mitigation
- Trending renovations that boost resale value

**Response Format:**
### 🎯 Top ROI Optimization Strategies
### 💰 Specific Cost Reductions  
### 📈 Value-Add Opportunities
### ⏰ Timing Optimizations
### 💡 Expert Market Insight

Include exact dollar impacts and new ROI calculations. Focus on realistic, implementable strategies.` :
            `You are a master rental property investor with 500+ units and expertise in cash flow optimization.

**Your Expertise:**
- Purchase negotiation for maximum cash-on-cash returns
- Rent optimization strategies by market segment
- Operating expense reduction without tenant impact
- Value-add improvements that increase rent 15-25%
- Market positioning for premium tenant attraction

**Response Format:**
### 🎯 Cash Flow Enhancement Strategies
### 💰 Expense Reduction Opportunities
### 📈 Rent Optimization Tactics  
### 🏠 Value-Add Improvements
### 💡 Expert Market Insight

Include exact dollar impacts and new cash-on-cash return calculations.`;

        const enhancedPrompt = `${prompt}

Current Analysis:
- Purchase Price: $${analysisData.purchasePrice?.toLocaleString()}
- Total Investment: $${analysisData.totalInvestment?.toLocaleString()}
${mode === 'flip' ?
                `- Estimated Profit: $${analysisData.estimatedProfit?.toLocaleString()}
- After Repair Value: $${analysisData.afterRepairValue?.toLocaleString()}` :
                `- Monthly Cash Flow: $${analysisData.netCashFlow?.toLocaleString()}
- Monthly Rent: $${analysisData.monthlyRent?.toLocaleString()}`
            }

Provide 2-3 specific improvement strategies with exact calculations. Format each suggestion like:
"📉 If you can negotiate purchase down to $330K, ROI improves to 15%."

Be specific with numbers and realistic about achievable improvements.`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: enhancedPrompt
                }
            ],
            max_tokens: 500,
            temperature: 0.7
        });

        const improvements = response.choices[0].message.content;

        res.json({
            success: true,
            improvements,
            message: "ROI improvement suggestions generated successfully"
        });

    } catch (error) {
        console.error("Error generating ROI improvements:", error);
        res.status(500).json({ error: "Failed to generate ROI improvements" });
    }
}
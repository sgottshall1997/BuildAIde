import { propertyDataService } from "../../services/property-search/propertySearch.service";
import { propertyAnalysisService } from "../../services/property-analysis/propertyAnalysis.service";
import {
    determineCrmStatus,
    determineProjectType,
    generateTags
} from "server/src/utils/helperFunctions";

import { Request, Response } from "express";


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
        const analysis = data.choices[0]?.message?.content || "I'd be happy to analyze this property, but I'm having trouble generating the analysis right now.";

        console.log('✅ Property analysis generated');
        res.json({ analysis });

    } catch (error) {
        console.error('Property analysis error:', error);
        res.json({ error: 'Unable to generate property analysis', analysis: 'I\'m having trouble connecting right now. Please try again later.' });
    }
}
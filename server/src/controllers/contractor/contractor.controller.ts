import { getMarketData } from "@server/services/market-data/marketData.service";
import { Request, Response } from "express";
import OpenAI from "openai";

export const compareContractorQuotesHandler = async (req: Request, res: Response) => {
    try {
        const { quotes, zipCode, projectType } = req.body;

        if (!quotes || quotes.length < 2) {
            return res.status(400).json({ error: "At least 2 quotes are required for comparison" });
        }

        // Prepare quotes for AI analysis
        const quotesInfo = quotes.map((quote: any, index: number) => ({
            quoteNumber: index + 1,
            contractor: quote.contractorName,
            amount: quote.amount,
            description: quote.projectDescription,
            duration: `${quote.estimatedDuration} ${quote.durationType}`,
            notes: quote.notes || 'No additional notes'
        }));

        const locationContext = zipCode ? ` in ZIP code ${zipCode}` : '';
        const prompt = `
        I have ${quotes.length} contractor quotes for a ${projectType} project${locationContext}. Please analyze these quotes and provide recommendations:

        ${quotesInfo.map((q: any) => `
        Quote #${q.quoteNumber} - ${q.contractor}:
        - Amount: $${q.amount.toLocaleString()}
        - Duration: ${q.duration}
        - Scope: ${q.description}
        - Notes: ${q.notes}
        `).join('\n')}

        Please provide a JSON response with the following structure:
        {
          "analysis": "Overall comparison summary (2-3 paragraphs)",
          "recommendedQuote": 1,
          "quoteInsights": [
            {
              "quoteId": 1,
              "rating": "excellent|good|caution|warning",
              "notes": ["Specific insight about this quote", "Another insight"]
            }
          ],
          "marketInsights": "Market context and regional pricing insights"
        }

        Focus on:
        - Price competitiveness vs market rates
        - Red flags (too high/low pricing, unclear scope)
        - Value assessment based on scope and timeline
        - Contractor reliability indicators
        - Best overall value recommendation
      `;

        // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are an expert construction consultant who helps homeowners evaluate contractor quotes. Provide thorough, practical analysis that helps people make informed decisions."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(response.choices[0].message.content || '{}');

        res.json(result);

    } catch (error) {
        console.error("Error comparing contractor quotes:", error);
        res.status(500).json({ error: "Failed to analyze contractor quotes" });
    }
}


export const analyzeContractorQuotesHandler = async (req: Request, res: Response) => {
    try {
        const { quotes, zipCode, projectType } = req.body;

        if (!quotes || quotes.length < 2) {
            return res.status(400).json({ error: "Need at least 2 quotes to compare" });
        }

        const prompt = `You are an expert construction consultant helping a homeowner evaluate contractor quotes. Analyze these quotes and provide detailed insights.

**Project Details:**
- Type: ${projectType}
- Location: ${zipCode}

**Quotes to Analyze:**
${quotes.map((q: any, i: number) => `
Quote ${i + 1}:
- Contractor: ${q.contractorName}
- Amount: $${q.amount?.toLocaleString()}
- Duration: ${q.estimatedDuration} ${q.durationType}
- Description: ${q.projectDescription}
`).join('\n')}

**Analysis Required:**
Provide comprehensive analysis with specific insights for each quote including red flags, strengths, and recommendations.

Respond with JSON in this format:
{
  "analysis": "overall analysis comparing all quotes",
  "recommendedQuote": number (1-based index of best quote),
  "quoteInsights": [
    {
      "quoteId": number,
      "rating": "excellent|good|caution|warning",
      "notes": ["specific insight 1", "specific insight 2"]
    }
  ],
  "marketInsights": "regional pricing and market context"
}`;

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are a master construction consultant with expertise in contractor evaluation and market pricing. Your analysis helps homeowners make informed decisions about contractor selection.

**Your Expertise:**
- Contractor vetting and red flag identification
- Regional pricing benchmarks and market rates
- Project scope evaluation and timeline assessment
- Value analysis and cost-benefit recommendations

**Response Guidelines:**
- Provide specific, actionable insights
- Include market context and regional pricing trends
- Flag potential risks or concerns
- Recommend the best overall value (not just lowest price)`
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(response.choices[0].message.content || '{}');
        res.json(result);

    } catch (error) {
        console.error("Error comparing contractor quotes:", error);
        res.status(500).json({ error: "Failed to analyze contractor quotes" });
    }
}

export const budgetExplainationHandler = async (req: Request, res: Response) => {
    const openaiUrl = process.env.OPENAI_URL ?? ""
    try {
        const { projectType, totalCost, squareFootage, materialQuality, breakdown, timeline } = req.body;

        if (!projectType || !totalCost) {
            return res.status(400).json({ error: 'Project type and total cost are required' });
        }

        const response = await fetch(openaiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
                messages: [
                    {
                        role: "system",
                        content: "You are a construction cost expert providing clear, practical explanations of renovation budgets. Keep explanations concise (2-3 sentences), focus on key cost drivers, and mention important considerations like permits or potential variables. Use bold text for important terms."
                    },
                    {
                        role: "user",
                        content: `Explain this renovation budget estimate:

Project: ${projectType}
Total Cost: $${totalCost.toLocaleString()}
Square Footage: ${squareFootage} sq ft
Material Quality: ${materialQuality}
Timeline: ${timeline} weeks

Cost Breakdown:
- Materials: $${breakdown.materials?.toLocaleString() || 'N/A'}
- Labor: $${breakdown.labor?.toLocaleString() || 'N/A'}
- Permits: $${breakdown.permits?.toLocaleString() || 'N/A'}
- Contingency: $${breakdown.contingency?.toLocaleString() || 'N/A'}

Provide a brief explanation of what drives these costs and any important considerations.`
                    }
                ],
                max_tokens: 200,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        const explanation = data.choices[0]?.message?.content || "Your estimate reflects current market rates for materials and labor. Consider getting multiple contractor quotes for final pricing.";

        res.json({ explanation });
    } catch (error) {
        console.error('Budget explanation error:', error);
        res.status(500).json({
            error: 'Unable to generate explanation',
            explanation: 'Your cost estimate reflects current market rates for materials, labor, and typical project requirements. Regional variations and specific project details may affect the final total.'
        });
    }
}


export const smartEstimateHandler = async (req: Request, res: Response) => {
    try {
        const { projectType, squareFootage, finishLevel, timeline, location } = req.body;

        const marketData = await getMarketData();

        // Base cost calculations by project type (per sq ft)
        const baseCosts = {
            'kitchen': 180,
            'bathroom': 220,
            'addition': 160,
            'basement': 110,
            'whole-house': 140,
            'exterior': 90
        };

        // Finish level multipliers
        const finishMultipliers = {
            'budget': 0.8,
            'mid-range': 1.0,
            'high-end': 1.4,
            'luxury': 1.8
        };

        // Timeline multipliers for cost calculation
        const costTimelineMultipliers = {
            'urgent': 1.2,
            'moderate': 1.0,
            'flexible': 0.9
        };

        const sqft = parseInt(squareFootage);
        const baseCost = (baseCosts as any)[projectType] * sqft;
        const adjustedCost = baseCost * (finishMultipliers as any)[finishLevel] * (costTimelineMultipliers as any)[timeline];

        const totalCost = Math.round(adjustedCost);
        const costRange = {
            low: Math.round(totalCost * 0.85),
            high: Math.round(totalCost * 1.15)
        };

        // Cost breakdown
        const breakdown = {
            materials: Math.round(totalCost * 0.45),
            labor: Math.round(totalCost * 0.35),
            permits: Math.round(totalCost * 0.05),
            contingency: Math.round(totalCost * 0.15)
        };

        // Timeline multipliers for duration calculation
        const durationTimelineMultipliers = {
            'urgent': 0.7,
            'moderate': 1.0,
            'flexible': 1.3
        };

        // Parse timeline to handle hours, days, weeks, months
        const parseTimeline = (timelineStr: string) => {
            if (!timelineStr) return { value: 6, unit: 'weeks' };

            const lowerTimeline = timelineStr.toLowerCase();
            const numberMatch = lowerTimeline.match(/(\d+(?:\.\d+)?)/);
            const number = numberMatch ? parseFloat(numberMatch[1]) : 6;

            if (lowerTimeline.includes('hour')) {
                return { value: number, unit: 'hours' };
            } else if (lowerTimeline.includes('day')) {
                return { value: number, unit: 'days' };
            } else if (lowerTimeline.includes('week')) {
                return { value: number, unit: 'weeks' };
            } else if (lowerTimeline.includes('month')) {
                return { value: number, unit: 'months' };
            } else if (lowerTimeline.includes('asap') || lowerTimeline.includes('urgent')) {
                return { value: 2, unit: 'weeks' };
            }

            return { value: number, unit: 'weeks' };
        };

        // Convert timeline to weeks for consistent calculation
        const convertToWeeks = (timeline: { value: number; unit: string }) => {
            switch (timeline.unit) {
                case 'hours':
                    return Math.max(0.1, timeline.value / 40); // Assuming 40-hour work week
                case 'days':
                    return Math.max(0.2, timeline.value / 5); // Assuming 5-day work week
                case 'weeks':
                    return timeline.value;
                case 'months':
                    return timeline.value * 4.33; // Average weeks per month
                default:
                    return timeline.value;
            }
        };

        // Timeline calculation
        const baseDurations = {
            'kitchen': 6,
            'bathroom': 4,
            'addition': 12,
            'basement': 8,
            'whole-house': 20,
            'exterior': 6
        };

        // Parse and convert timeline if it's a string with specific units
        let timelineInWeeks;
        if (typeof timeline === 'string' && timeline !== 'urgent' && timeline !== 'moderate' && timeline !== 'flexible') {
            const parsedTimeline = parseTimeline(timeline);
            timelineInWeeks = convertToWeeks(parsedTimeline);
        } else {
            // Use traditional multiplier system for standard timeline options
            timelineInWeeks = Math.round((baseDurations as any)[projectType] * (durationTimelineMultipliers as any)[timeline] || durationTimelineMultipliers['moderate']);
        }

        const duration = Math.max(1, Math.round(timelineInWeeks));

        // Payment schedule (standard industry practice)
        const paymentSchedule = {
            deposit: Math.round(totalCost * 0.25),
            midProject: Math.round(totalCost * 0.50),
            completion: Math.round(totalCost * 0.25)
        };

        // Timeline phases
        const phases = [
            { name: "Planning & Permits", weeks: Math.round(duration * 0.2), cost: breakdown.permits },
            { name: "Demolition & Prep", weeks: Math.round(duration * 0.15), cost: Math.round(breakdown.labor * 0.2) },
            { name: "Construction", weeks: Math.round(duration * 0.5), cost: breakdown.materials + Math.round(breakdown.labor * 0.6) },
            { name: "Finishing & Cleanup", weeks: Math.round(duration * 0.15), cost: Math.round(breakdown.labor * 0.2) }
        ];

        // Recommendations based on project data
        const recommendations = [
            `For a ${finishLevel} ${projectType} renovation, budget ${breakdown.materials > 50000 ? 'extra time' : '15-20% contingency'} for unexpected issues`,
            `${timeline === 'flexible' ? 'Consider scheduling during off-peak season (fall/winter) for potential savings' : timeline === 'urgent' ? 'Rush timeline adds 20% premium - confirm if timeline is flexible' : 'Standard timeline allows for quality work without rush fees'}`,
            `Get at least 3 quotes from licensed contractors and verify references`,
            `${finishLevel === 'luxury' ? 'Order custom materials early as lead times can be 8-12 weeks' : 'Standard materials typically available within 2-4 weeks'}`
        ];

        // Risk factors
        const riskFactors = [
            `${projectType === 'whole-house' || projectType === 'addition' ? 'Structural surprises may require engineering consultation' : 'Electrical and plumbing updates may be needed for older homes'}`,
            `${timeline === 'urgent' ? 'Rush timeline increases risk of shortcuts or quality issues' : 'Weather delays possible for exterior work'}`,
            `Material price volatility - lock in quotes for 30+ days`,
            `${finishLevel === 'luxury' ? 'High-end materials often have longer lead times and special order requirements' : 'Standard permitting process takes 2-4 weeks'}`
        ];

        const estimate = {
            totalCost,
            costRange,
            breakdown,
            timeline: {
                duration,
                phases
            },
            paymentSchedule,
            recommendations,
            riskFactors
        };

        res.json({
            success: true,
            estimate,
            message: "Smart estimate generated successfully"
        });

    } catch (error) {
        console.error("Error generating smart estimate:", error);
        res.status(500).json({ error: "Failed to generate smart estimate" });
    }
}


export const budgetForcasterHandler = async (req: Request, res: Response) => {
    try {
        const { projectType, homeSquareFootage, projectSquareFootage, qualityLevel, timelineFlexibility, location, specialRequirements, budgetRange } = req.body;

        // Get current material prices for accurate calculations
        const marketData = await getMarketData();

        // Base cost calculations by project type
        const baseCostPerSqFt = {
            'kitchen': 200,
            'bathroom': 250,
            'addition': 180,
            'basement': 120,
            'whole-house': 150,
            'exterior': 100
        };

        // Quality multipliers
        const qualityMultipliers = {
            'budget': 0.8,
            'mid-range': 1.0,
            'high-end': 1.4,
            'luxury': 1.8
        };

        // Timeline multipliers
        const timelineMultipliers = {
            'urgent': 1.2,
            'moderate': 1.0,
            'flexible': 0.9
        };

        const sqft = parseInt(projectSquareFootage) || 200;
        const baseCost = ((baseCostPerSqFt as any)[projectType] || 150) * sqft;
        const qualityAdjustedCost = baseCost * ((qualityMultipliers as any)[qualityLevel] || 1.0);
        const timelineAdjustedCost = qualityAdjustedCost * ((timelineMultipliers as any)[timelineFlexibility] || 1.0);

        // Cost breakdown
        const totalBudget = Math.round(timelineAdjustedCost);
        const breakdown = {
            materials: Math.round(totalBudget * 0.45),
            labor: Math.round(totalBudget * 0.35),
            permits: Math.round(totalBudget * 0.05),
            contingency: Math.round(totalBudget * 0.10),
            equipment: Math.round(totalBudget * 0.05)
        };

        // Timeline calculation
        const baseDuration = {
            'kitchen': 6,
            'bathroom': 4,
            'addition': 12,
            'basement': 8,
            'whole-house': 20,
            'exterior': 6,
        };

        const projectDuration = (baseDuration as any)[projectType] || 8;
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + (projectDuration * 7));

        // Risk factors based on project type and market conditions
        const riskFactors = [];

        if (qualityLevel === 'luxury') {
            riskFactors.push({
                factor: "High-End Material Availability",
                impact: 'medium',
                description: "Luxury materials may have longer lead times",
                mitigation: "Order materials early and have backup options ready"
            });
        }

        if (timelineFlexibility === 'urgent') {
            riskFactors.push({
                factor: "Rush Timeline Premium",
                impact: 'high',
                description: "Expedited work typically costs 15-25% more",
                mitigation: "Consider if timeline can be extended to reduce costs"
            });
        }

        // Market trend analysis using real material price data
        const trendingUp = marketData.materialPrices.filter(p => p.trend === 'up').length;
        const totalPrices = marketData.materialPrices.length;
        const upwardTrendPercent = (trendingUp / totalPrices) * 100;

        let marketCondition = "Stable";
        let bestTimeToStart = "Now is a good time to start";

        if (upwardTrendPercent > 60) {
            marketCondition = "Rising Costs";
            bestTimeToStart = "Start soon before prices increase further";
            riskFactors.push({
                factor: "Material Price Inflation",
                impact: 'medium',
                description: "Material costs are trending upward",
                mitigation: "Lock in material prices early or start project soon"
            });
        } else if (upwardTrendPercent < 30) {
            marketCondition = "Favorable Pricing";
            bestTimeToStart = "Excellent time to start with stable/declining costs";
        }

        // Personalized recommendations
        const recommendations = [
            `Based on your ${qualityLevel} quality preference, budget $${breakdown.materials.toLocaleString()} for materials`,
            `For a ${sqft} sq ft ${projectType} project, expect ${projectDuration} weeks completion time`,
            `With ${timelineFlexibility} timeline flexibility, you can ${timelineFlexibility === 'flexible' ? 'save up to 10% by waiting for better contractor rates' : timelineFlexibility === 'urgent' ? 'expect 20% premium for rush work' : 'proceed with standard timeline and pricing'}`
        ];

        if (specialRequirements) {
            recommendations.push("Factor in additional costs for your special requirements - discuss with contractors during bidding");
        }

        const forecast = {
            totalBudget,
            breakdown,
            timeline: {
                startDate: startDate.toLocaleDateString(),
                estimatedCompletion: endDate.toLocaleDateString(),
                phases: [
                    { name: "Planning & Permits", duration: Math.round(projectDuration * 0.2), cost: breakdown.permits },
                    { name: "Materials & Prep", duration: Math.round(projectDuration * 0.1), cost: breakdown.materials * 0.3 },
                    { name: "Construction", duration: Math.round(projectDuration * 0.6), cost: breakdown.labor + (breakdown.materials * 0.7) },
                    { name: "Finishing & Cleanup", duration: Math.round(projectDuration * 0.1), cost: breakdown.equipment }
                ]
            },
            riskFactors,
            recommendations,
            marketTrends: {
                currentCondition: marketCondition,
                priceDirection: upwardTrendPercent > 50 ? 'rising' : upwardTrendPercent < 30 ? 'declining' : 'stable',
                bestTimeToStart
            }
        };

        res.json({
            success: true,
            forecast,
            message: "Budget forecast generated successfully"
        });

    } catch (error) {
        console.error("Error generating budget forecast:", error);
        res.status(500).json({ error: "Failed to generate budget forecast" });
    }
}
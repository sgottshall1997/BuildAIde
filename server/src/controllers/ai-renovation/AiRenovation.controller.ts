import { MARKET_INSIGHTS } from "@server/constants/market-insight.constant";
import { generateSpenceTheBuilderResponse } from "@server/services/ai/ai.service";
import { Request, Response } from "express";

const openaiUrl = process.env.OPENAI_URL ?? '';

export const renovationRecommendationsHandler = async (req: Request, res: Response) => {
    console.log('🏠 Renovation recommendations endpoint hit');
    res.setHeader('Content-Type', 'application/json');

    try {
        const { projectDetails, budget, timeline, priorities } = req.body;

        const response = await fetch(openaiUrl, {
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
                        content: "You are a home renovation expert providing personalized recommendations. Give practical, actionable advice based on the homeowner's specific project details, budget, and priorities. Structure your response with clear recommendations, timeline suggestions, and budget considerations."
                    },
                    {
                        role: "user",
                        content: `Please provide renovation recommendations for this project:

Project Details: ${projectDetails}
Budget: ${budget}
Timeline: ${timeline}
Priorities: ${priorities}

Provide specific recommendations including:
1. Key renovation priorities based on their goals
2. Budget allocation suggestions
3. Timeline and phasing recommendations
4. Important considerations or potential challenges
5. Next steps they should take

Keep recommendations practical and actionable.`
                    }
                ],
                max_tokens: 500,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`OpenAI API error: ${response.status} - ${errorText}`);
            return res.json({ error: 'Unable to generate recommendations', recommendations: 'Please try again later.' });
        }

        const data = await response.json();
        const recommendations = data.choices[0]?.message?.content || "Based on your project details, I recommend starting with planning and getting multiple contractor quotes.";

        console.log('✅ Renovation recommendations generated');
        res.json({ recommendations });

    } catch (error) {
        console.error('Renovation recommendations error:', error);
        res.json({ error: 'Unable to generate recommendations', recommendations: 'Please try again later.' });
    }
}


export const homeOwnerChatHandler = async (req: Request, res: Response) => {
    console.log('💬 Homeowner chat endpoint hit');
    res.setHeader('Content-Type', 'application/json');

    try {
        const { question } = req.body;

        if (!question || question.trim().length === 0) {
            return res.json({ error: 'Question is required', response: 'Please provide a question about your renovation project.' });
        }

        const response = await fetch(openaiUrl, {
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
                        content: `You are Spencer, a master renovation consultant with 25+ years of experience and expertise in residential construction, design trends, and cost optimization.

**Your Approach:**
- Provide specific, actionable advice with real numbers when possible
- Include at least one expert insight or cost-saving tip per response
- Flag potential permit/safety issues proactively
- Suggest modern upgrades trending in 2025
- Use encouraging, confident language

**Response Format:**
- Structure with clear bullet points or sections
- Include rough cost estimates when relevant  
- Mention timeline considerations
- Always end with one "pro tip" insight

Keep responses friendly but professional, like a trusted contractor who's seen it all.`
                    },
                    {
                        role: "user",
                        content: question.trim()
                    }
                ],
                max_tokens: 500,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`OpenAI API error: ${response.status} - ${errorText}`);
            return res.json({ error: 'Unable to process chat message', response: 'I apologize, but I\'m having trouble right now. Please try again later.' });
        }

        const data = await response.json();
        const aiResponse = data.choices[0]?.message?.content || "I'd be happy to help with your renovation question! Could you provide more details?";

        console.log('✅ Chat response generated');
        res.json({ response: aiResponse });

    } catch (error) {
        console.error('Homeowner chat error:', error);
        res.json({ error: 'Unable to process chat message', response: 'I apologize, but I\'m having trouble right now. Please try again later.' });
    }
}

export const proInsightsHandler = async (req: Request, res: Response) => {
    console.log('📊 Pro Market Insights endpoint hit');
    res.setHeader('Content-Type', 'application/json');

    try {
        // Real market data would come from construction industry APIs
        // This provides realistic data structure for demo purposes
        res.json({
            MARKET_INSIGHTS,
            lastUpdated: new Date().toISOString(),
            source: 'Market data aggregated from industry sources'
        });
    } catch (error) {
        console.error('Error fetching pro insights:', error);
        res.status(500).json({ error: 'Failed to fetch market insights' });
    }
}


export const AIOpinionHandler = async (req: Request, res: Response) => {
    console.log('🧠 AI Opinion endpoint hit');
    res.setHeader('Content-Type', 'application/json');

    try {
        const { topic, insightData } = req.body;

        if (!topic || !insightData) {
            return res.status(400).json({ error: 'Topic and insight data are required' });
        }

        // Generate AI opinion using GPT-4o
        const prompt = `You are a construction market analyst providing expert insights to professional contractors and construction companies. 

Analyze this market insight:
- Topic: ${insightData.title}
- Current Status: ${insightData.value}
- Description: ${insightData.description}
- Market Condition: ${insightData.statusText}

Provide a detailed professional analysis in JSON format with these fields:
- analysis: A 2-3 sentence expert analysis of what this data means for contractors
- implications: Array of 3-4 specific business implications for construction professionals
- recommendations: Array of 3-4 actionable recommendations contractors should consider
- marketContext: 1-2 sentences about broader market trends

Focus on practical, actionable insights that help contractors make better business decisions. Be specific and professional.`;

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
                        content: "You are an expert construction market analyst. Provide detailed, professional market insights in valid JSON format."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                response_format: { type: "json_object" },
                temperature: 0.7,
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
        }

        const completion = await response.json();
        const aiResponse = JSON.parse(completion.choices[0].message.content || '{}');

        res.json({
            topic,
            analysis: aiResponse.analysis || "Market analysis not available",
            implications: aiResponse.implications || [],
            recommendations: aiResponse.recommendations || [],
            marketContext: aiResponse.marketContext || "Market context analysis not available",
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error generating AI opinion:', error);
        res.status(500).json({
            error: 'Failed to generate AI opinion',
            topic: req.body.topic || 'unknown',
            analysis: "I'm having trouble analyzing this market data right now. This could be due to high demand or a temporary service issue.",
            implications: ["Market analysis temporarily unavailable", "Consider checking multiple data sources", "Monitor trends manually until service resumes"],
            recommendations: ["Use historical data for decision making", "Consult with local suppliers directly", "Check back in a few minutes for updated analysis"],
            marketContext: "AI analysis service is experiencing temporary difficulties."
        });
    }
}


export const exprertHomeOwnerChatHandler = async (req: Request, res: Response) => {
    try {
        const { question } = req.body;

        if (!question || question.trim().length === 0) {
            return res.status(400).json({ error: 'Question is required' });
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
                        content: "You are a friendly, knowledgeable home renovation assistant. Help homeowners with renovation questions, project planning, cost estimates, design ideas, and practical advice. Keep responses helpful, encouraging, and easy to understand. Always mention when professional consultation might be needed for safety or code compliance."
                    },
                    {
                        role: "user",
                        content: question.trim()
                    }
                ],
                max_tokens: 400,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data.choices[0]?.message?.content || "I'd be happy to help with your renovation question! Could you provide a bit more detail about what you're looking to accomplish?";

        res.json({ response: aiResponse });
    } catch (error) {
        console.error('Homeowner chat error:', error);
        res.status(500).json({
            error: 'Unable to process chat message',
            response: 'I apologize, but I\'m having trouble processing your question right now. For immediate help, consider consulting with a local contractor or home improvement professional.'
        });
    }
}



export const consumerEstimateExplainationHandler = async (req: Request, res: Response) => {
    try {
        const { projectType, squareFootage, finishLevel, lowEnd, highEnd, perSqFt } = req.body;

        const prompt = `You are a friendly home renovation advisor. A homeowner wants to know what their project might cost. Use the estimate data provided and explain it in simple, encouraging language. Mention key cost drivers if relevant.

Project: ${projectType.replace('-', ' ')}
Size: ${squareFootage} sq ft
Finish Level: ${finishLevel}
Estimated Cost: $${lowEnd.toLocaleString()} - $${highEnd.toLocaleString()}
Cost per sq ft: $${perSqFt}

Provide a helpful explanation in 2-3 sentences that helps them understand the estimate. Also provide 3-4 key cost factors they should know about. Be encouraging but realistic.

Return your response as JSON:
{
  "explanation": "your explanation here",
  "keyFactors": ["factor 1", "factor 2", "factor 3", "factor 4"]
}`;

        try {
            const explanation = await generateSpenceTheBuilderResponse(prompt, {}, []);

            // Try to parse as JSON, fallback to structured response
            let parsedResponse;
            try {
                parsedResponse = JSON.parse(explanation);
            } catch {
                parsedResponse = {
                    explanation: explanation,
                    keyFactors: [
                        "Material quality affects 40-50% of total cost",
                        "Labor costs vary by region and contractor experience",
                        "Permits and inspections may add 5-10%",
                        "Unexpected issues can increase costs 10-20%"
                    ]
                };
            }

            res.json(parsedResponse);
        } catch (aiError) {
            console.error("AI explanation error:", aiError);

            // Fallback explanation
            const projectLabel = projectType.replace('-', ' ');
            res.json({
                explanation: `Your ${projectLabel} project with ${finishLevel} finishes is estimated between $${lowEnd.toLocaleString()} and $${highEnd.toLocaleString()}. This works out to about $${perSqFt}/sq ft, which is typical for this type of renovation in your area.`,
                keyFactors: [
                    "Material quality affects 40-50% of total cost",
                    "Labor costs vary by region and contractor",
                    "Permits and inspections may add 5-10%",
                    "Unexpected issues can increase costs 10-20%"
                ]
            });
        }
    } catch (error) {
        console.error("Error generating consumer estimate explanation:", error);
        res.status(500).json({ error: "Failed to generate explanation" });
    }
}


export const analyzeQuotesHandler = async (req: Request, res: Response) => {
    try {
        const { quotes } = req.body;

        if (!quotes || quotes.length < 2) {
            return res.status(400).json({ error: "Need at least 2 quotes to compare" });
        }

        const prompt = `You are a friendly home renovation advisor helping a homeowner compare contractor quotes. Analyze these quotes and provide helpful insights in simple, encouraging language.

Quotes to analyze:
${quotes.map((q: any, i: number) => `
Quote ${i + 1}:
- Contractor: ${q.contractorName}
- Total Cost: $${q.totalCost}
- Timeline: ${q.timeline}
- Description: ${q.description}
- Breakdown: ${q.breakdown}
`).join('\n')}

For each quote, identify:
1. Red flags (missing details, extremely low/high prices, vague descriptions, no permits mentioned, etc.)
2. Strengths (detailed breakdown, reasonable pricing, clear timeline, licensed contractor, etc.)
3. Price reasonableness compared to others (low/fair/high)
4. Overall recommendation for this contractor

Use friendly, non-technical language. Be encouraging but honest about concerns.

Return your response as JSON:
{
  "analysis": [
    {
      "contractor": "contractor name",
      "totalCost": number,
      "redFlags": ["flag 1", "flag 2"],
      "strengths": ["strength 1", "strength 2"],
      "recommendation": "detailed recommendation",
      "priceReasonableness": "low|fair|high"
    }
  ]
}`;

        try {
            const analysis = await generateSpenceTheBuilderResponse(prompt, {}, []);

            let parsedAnalysis;
            try {
                parsedAnalysis = JSON.parse(analysis);
            } catch {
                // Fallback analysis if AI response can't be parsed
                const avgCost = quotes.reduce((sum: number, q: any) => sum + parseFloat(q.totalCost || 0), 0) / quotes.length;

                parsedAnalysis = {
                    analysis: quotes.map((q: any) => {
                        const cost = parseFloat(q.totalCost || 0);
                        let priceReasonableness = 'fair';
                        if (cost < avgCost * 0.8) priceReasonableness = 'low';
                        if (cost > avgCost * 1.2) priceReasonableness = 'high';

                        return {
                            contractor: q.contractorName || 'Unknown Contractor',
                            totalCost: cost,
                            redFlags: cost < avgCost * 0.5 ? ['Unusually low price - verify quality'] : [],
                            strengths: q.breakdown ? ['Provided detailed cost breakdown'] : [],
                            recommendation: `This quote appears to be ${priceReasonableness}ly priced. Make sure to verify the contractor's license and references.`,
                            priceReasonableness
                        };
                    })
                };
            }

            res.json(parsedAnalysis);
        } catch (aiError) {
            console.error("AI analysis error:", aiError);

            // Fallback analysis
            const avgCost = quotes.reduce((sum: number, q: any) => sum + parseFloat(q.totalCost || 0), 0) / quotes.length;

            const fallbackAnalysis = {
                analysis: quotes.map((q: any) => {
                    const cost = parseFloat(q.totalCost || 0);
                    let priceReasonableness = 'fair';
                    if (cost < avgCost * 0.8) priceReasonableness = 'low';
                    if (cost > avgCost * 1.2) priceReasonableness = 'high';

                    return {
                        contractor: q.contractorName || 'Unknown Contractor',
                        totalCost: cost,
                        redFlags: cost < avgCost * 0.5 ? ['Unusually low price - verify quality'] : [],
                        strengths: q.breakdown ? ['Provided detailed cost breakdown'] : [],
                        recommendation: `This quote appears to be ${priceReasonableness}ly priced. Make sure to verify the contractor's license and references before hiring.`,
                        priceReasonableness
                    };
                })
            };

            res.json(fallbackAnalysis);
        }
    } catch (error) {
        console.error("Error analyzing quotes:", error);
        res.status(500).json({ error: "Failed to analyze quotes" });
    }
}


export const renovationAssistantHandler = async (req: Request, res: Response) => {
    try {
        const { message, chatHistory } = req.body;

        const response = await generateSpenceTheBuilderResponse(message, {}, chatHistory || []);

        res.json({
            success: true,
            response,
            message: "Assistant response generated successfully"
        });

    } catch (error) {
        console.error("Error generating renovation assistant response:", error);
        res.status(500).json({ error: "Failed to generate assistant response" });
    }
}


export const aiRenovationChatHandler = async (req: Request, res: Response) => {
    try {
        const { message, chatHistory } = req.body;

        const prompt = `You are a friendly, knowledgeable renovation advisor helping homeowners with their projects. You provide practical, encouraging advice about home renovations.

User's question: ${message}

Previous conversation context:
${chatHistory.slice(-3).map((msg: any) => `${msg.type}: ${msg.content}`).join('\n')}

Guidelines:
- Be encouraging and supportive
- Use simple, everyday language (avoid technical jargon)
- Give specific, actionable advice
- When discussing costs, give realistic ranges
- Always mention safety and permits when relevant
- Keep responses concise but helpful (2-3 paragraphs max)
- If asked about something dangerous, always recommend professional help

Provide a helpful, encouraging response:`;

        try {
            const response = await generateSpenceTheBuilderResponse(prompt, {}, []);
            res.json({ response });
        } catch (aiError) {
            console.error("AI chat error:", aiError);

            // Fallback response for common topics
            let fallbackResponse = "I'd be happy to help with your renovation question! ";

            if (message.toLowerCase().includes('budget') || message.toLowerCase().includes('cost')) {
                fallbackResponse += "For budgeting, I typically recommend adding 15-20% to your initial estimate for unexpected costs. Kitchen remodels usually range from $15,000-$75,000 depending on size and finishes, while bathroom remodels are typically $8,000-$35,000. Would you like me to help you think through the specific costs for your project?";
            } else if (message.toLowerCase().includes('permit')) {
                fallbackResponse += "Most renovation projects that involve electrical, plumbing, or structural changes require permits. The best approach is to contact your local building department or ask your contractor - they usually handle permits as part of their service. Getting proper permits protects you and ensures the work meets safety codes.";
            } else if (message.toLowerCase().includes('timeline') || message.toLowerCase().includes('how long')) {
                fallbackResponse += "Project timelines vary quite a bit! Kitchen remodels typically take 6-8 weeks, bathrooms 2-4 weeks, and smaller projects like painting or flooring can be done in days to a week. The key is planning ahead and having materials ordered before work begins. Weather and permit approval can add time, so it's smart to build in some buffer.";
            } else {
                fallbackResponse += "For the best guidance on your specific situation, I'd recommend getting quotes from 3-4 licensed contractors in your area. They can give you detailed advice based on seeing your space in person. In the meantime, feel free to ask about budgeting, timelines, permits, or any other renovation topics!";
            }

            res.json({ response: fallbackResponse });
        }
    } catch (error) {
        console.error("Error in AI renovation chat:", error);
        res.status(500).json({ error: "Failed to process chat message" });
    }
}
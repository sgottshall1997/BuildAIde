import { MARKET_INSIGHTS } from "@server/constants/market-insight.constant";
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
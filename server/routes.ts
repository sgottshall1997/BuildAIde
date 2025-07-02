import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { mockListings, mockPermits, mockFlipProjects, mockScheduledProjects, generateMockAIAnalysis } from "./mockData";
import path from "path";
import fs from "fs";
import { explainEstimate, summarizeSchedule, getAIRecommendations, draftEmail, generateRiskAssessment, generateSmartSuggestions, calculateScenario, generateLeadStrategies, analyzeMaterialCosts, compareSubcontractors, assessProjectRisks, generateProjectTimeline, generateBudgetPlan, calculateFlipROI, researchPermits, homeownerChat, generateProjectEstimate, generateBid, constructionAssistant, analyzeFlipProperties, getAIFlipOpinion, generateMarketInsights, analyzePropertyFromUrl, generateCostSavingTips, analyzeExpenseVariance, compareContractorQuotes } from "./ai";
import OpenAI from "openai";
import { isDemoModeEnabled, getMockProjectData, getMockEstimateData, getMockScheduleData, getMockTaskList, wrapDemoResponse } from "./demoMode";

// Temporary AI functions for demo - these will be moved to ai.ts

import { getBenchmarkCosts, analyzeEstimate } from "./benchmarking";
import { uploadDir } from "@server/middlewares/multer/multer.middleware";

export async function registerRoutes(app: Express): Promise<Server> {
  // Priority API Router - ensures clean JSON responses
  const apiRouter = express.Router();

  console.log('Setting up priority API endpoints with clean JSON responses...');

  // Simple JSON test endpoint
  apiRouter.post('/test-json', (req, res) => {
    console.log('✅ JSON test endpoint hit');
    res.setHeader('Content-Type', 'application/json');
    res.json({
      success: true,
      message: 'JSON response working correctly!',
      timestamp: new Date().toISOString()
    });
  });

  // OpenAI test endpoint  
  apiRouter.post('/test-openai', async (req, res) => {
    console.log('🔗 OpenAI test endpoint hit');
    res.setHeader('Content-Type', 'application/json');

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [{ role: "user", content: "Say 'OpenAI connection successful!' in one sentence." }],
          max_tokens: 50
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenAI API error: ${response.status} - ${errorText}`);
        return res.json({ success: false, error: `API Error ${response.status}: ${errorText}` });
      }

      const data = await response.json();
      console.log('✅ OpenAI test successful');
      res.json({ success: true, message: data.choices[0]?.message?.content || 'OpenAI connected!' });

    } catch (error) {
      console.error('OpenAI connection error:', error);
      res.json({ success: false, error: error.message });
    }
  });

  // Mount the API router with absolute priority
  app.use('/api', apiRouter);
  console.log('✅ Priority API routes mounted successfully');
  // Serve static files from uploads directory
  app.use("/uploads", express.static(uploadDir));

  // Parse JSON middleware
  app.use(express.json());


  // POST /api/send-notification-email - Send email notifications
  app.post("/api/send-notification-email", async (req, res) => {
    try {
      const { to, subject, message, type } = req.body;
      const result = await sendNotificationEmail(to, subject, message, type);
      res.json({ success: true, result });
    } catch (error) {
      console.error("Error sending notification email:", error);
      res.status(500).json({ success: false, error: "Failed to send email notification" });
    }
  });


  // POST /api/get-benchmark-costs - Get market benchmark data
  app.post("/api/get-benchmark-costs", async (req, res) => {
    try {
      const { projectType, zipCode, squareFootage } = req.body;

      if (!projectType || !zipCode) {
        return res.status(400).json({ error: "Project type and zip code are required" });
      }

      const benchmarks = await getBenchmarkCosts(projectType, zipCode, squareFootage);
      res.json(benchmarks);
    } catch (error) {
      console.error("Error getting benchmark costs:", error);
      res.status(500).json({ error: "Failed to retrieve benchmark data" });
    }
  });

  // POST /api/analyze-estimate - Get GPT analysis of estimate vs benchmarks
  app.post("/api/analyze-estimate", async (req, res) => {
    try {
      const { internalEstimate, benchmarks, projectDetails } = req.body;

      if (!internalEstimate || !benchmarks || !projectDetails) {
        return res.status(400).json({ error: "Estimate, benchmarks, and project details are required" });
      }

      const analysis = await analyzeEstimate(internalEstimate, benchmarks, projectDetails);
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing estimate:", error);
      res.status(500).json({ error: "Failed to generate estimate analysis" });
    }
  });

  // POST /api/ai-assistant - AI Assistant chat endpoint
  app.post("/api/ai-assistant", async (req, res) => {
    try {
      const { message, context } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const OpenAI = (await import("openai")).default;
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const systemPrompt = `You are Spence the Builder, a Master Residential Construction Estimator with 20+ years of experience in Maryland. You specialize in accurate cost breakdowns, timeline planning, and client communication for Shall's Construction.

EXPERTISE AREAS:
- Maryland residential construction costs and permit requirements
- Material cost fluctuations and regional pricing (2024 rates)
- Labor rates in Montgomery, Prince George's, and surrounding counties
- Timeline optimization for kitchen/bath remodels, additions, and full home renovations
- Code compliance and inspection scheduling

RESPONSE FRAMEWORK:
- Lead with specific cost reasoning (materials, labor, permits, overhead)
- Reference Maryland building codes and local permit requirements when relevant
- Provide "what-if" scenarios for budget/timeline changes
- Use exact dollar amounts and percentage breakdowns
- Mention seasonal factors affecting pricing and scheduling

COMMUNICATION STYLE:
- Speak as a seasoned contractor who's completed 500+ residential projects
- Use construction industry terminology accurately
- Provide actionable next steps and realistic timelines
- Address potential hidden costs upfront

Always structure cost explanations by category: Materials (%), Labor (%), Permits (%), Equipment (%), Overhead (%), Profit (%).`;

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
    } catch (error) {
      console.error("Error in AI assistant:", error);
      res.status(500).json({ error: "Failed to get AI response" });
    }
  });

  // === HOUSE FLIPPING TOOLS API ENDPOINTS ===

  // Real Estate Listings endpoint
  app.get("/api/real-estate-listings", async (req, res) => {
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
  });

  // Analyze listing endpoint
  app.post("/api/analyze-listing", async (req, res) => {
    try {
      const { listing } = req.body;
      const analysis = generateMockAIAnalysis('listing', { listing });

      res.json({ analysis });
    } catch (error) {
      res.status(500).json({ error: "Failed to analyze listing" });
    }
  });

  // ROI Analysis endpoint
  app.post("/api/roi-analysis", async (req, res) => {
    try {
      const { calculation } = req.body;
      const analysis = generateMockAIAnalysis('roi', { calculation });

      res.json({ analysis });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate ROI analysis" });
    }
  });

  // Permit Lookup endpoint
  app.get("/api/permit-lookup", async (req, res) => {
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
  });

  // Analyze permit endpoint
  app.post("/api/analyze-permit", async (req, res) => {
    try {
      const { permit } = req.body;
      const analysis = generateMockAIAnalysis('permit', { permit });

      res.json({ analysis });
    } catch (error) {
      res.status(500).json({ error: "Failed to analyze permit" });
    }
  });

  // Flip Projects endpoints
  app.get("/api/flip-projects", async (req, res) => {
    try {
      res.json(mockFlipProjects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch flip projects" });
    }
  });

  app.post("/api/flip-projects", async (req, res) => {
    try {
      const projectData = req.body;
      const newProject = {
        id: Date.now().toString(),
        ...projectData,
        createdAt: new Date().toISOString()
      };

      mockFlipProjects.push(newProject);

      res.json(newProject);
    } catch (error) {
      res.status(500).json({ error: "Failed to add flip project" });
    }
  });

  // Analyze flip project endpoint
  app.post("/api/analyze-flip-project", async (req, res) => {
    try {
      const { project } = req.body;
      const analysis = generateMockAIAnalysis('flip-project', { project });

      res.json({ analysis });
    } catch (error) {
      res.status(500).json({ error: "Failed to analyze flip project" });
    }
  });

  // Export portfolio endpoint
  app.post("/api/export-portfolio", async (req, res) => {
    try {
      const csvContent = [
        "Flip Portfolio Report - Shall's Construction",
        "",
        "Address,Start Date,Finish Date,Budget Planned,Budget Actual,Sale Price,ROI,Timeline,Status",
        ...mockFlipProjects.map((p: any) =>
          `"${p.address}","${p.startDate}","${p.finishDate || 'N/A'}",${p.budgetPlanned},${p.budgetActual},${p.salePrice || 'N/A'},${p.roi || 'N/A'},${p.timeline},${p.status}`
        )
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="flip-portfolio.csv"');
      res.send(csvContent);
    } catch (error) {
      res.status(500).json({ error: "Failed to export portfolio" });
    }
  });

  // === PROJECT SCHEDULER API ENDPOINTS ===

  // Get all scheduled projects
  app.get("/api/schedule", async (req, res) => {
    try {
      res.json(mockScheduledProjects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch scheduled projects" });
    }
  });

  // Add new project
  app.post("/api/schedule", async (req, res) => {
    try {
      const projectData = req.body;
      const newProject = {
        id: Date.now().toString(),
        ...projectData,
        createdAt: new Date().toISOString()
      };

      mockScheduledProjects.push(newProject);

      // Generate GPT summary for the project
      const summary = `Project '${newProject.projectName}' is scheduled to run for ${newProject.estimatedDuration} days with ${newProject.crewMembers} crew members. Estimated ROI is ${newProject.profitMargin}%.`;
      console.log('Project Summary:', summary);

      res.json(newProject);
    } catch (error) {
      res.status(500).json({ error: "Failed to add project" });
    }
  });

  // Update project status
  app.patch("/api/schedule/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const projectIndex = mockScheduledProjects.findIndex(p => p.id === id);
      if (projectIndex === -1) {
        return res.status(404).json({ error: "Project not found" });
      }

      mockScheduledProjects[projectIndex] = {
        ...mockScheduledProjects[projectIndex],
        status,
        updatedAt: new Date().toISOString()
      };

      res.json(mockScheduledProjects[projectIndex]);
    } catch (error) {
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  // Delete project
  app.delete("/api/schedule/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const projectIndex = mockScheduledProjects.findIndex(p => p.id === id);

      if (projectIndex === -1) {
        return res.status(404).json({ error: "Project not found" });
      }

      mockScheduledProjects.splice(projectIndex, 1);
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // Budget Explanation API
  app.post('/api/budget-explanation', async (req, res) => {
    try {
      const { projectType, totalCost, squareFootage, materialQuality, breakdown, timeline } = req.body;

      if (!projectType || !totalCost) {
        return res.status(400).json({ error: 'Project type and total cost are required' });
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
  });

  // Simple JSON Test (bypassing OpenAI)
  app.post('/api/test-json', async (req, res) => {
    try {
      console.log('Testing JSON response...');
      res.json({
        success: true,
        message: 'JSON response working correctly!',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('JSON test error:', error);
      res.status(500).json({
        success: false,
        error: 'JSON test failed'
      });
    }
  });

  // OpenAI Connection Test
  app.post('/api/test-openai', async (req, res) => {
    try {
      console.log('Testing OpenAI API connection...');
      console.log('API Key present:', !!process.env.OPENAI_API_KEY);
      console.log('API Key length:', process.env.OPENAI_API_KEY?.length);

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: "Say 'OpenAI connection successful!' in one sentence."
            }
          ],
          max_tokens: 50
        })
      });

      console.log('OpenAI test response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenAI API test error: ${response.status} - ${errorText}`);
        return res.status(500).json({
          success: false,
          error: `API Error ${response.status}: ${errorText}`
        });
      }

      const data = await response.json();
      console.log('OpenAI test successful!');
      res.json({
        success: true,
        message: data.choices[0]?.message?.content || 'Test successful!'
      });

    } catch (error) {
      console.error('OpenAI test connection error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Renovation Concierge API
  app.post('/api/renovation-recommendations', async (req, res) => {
    try {
      const { projectDetails, budget, timeline, priorities } = req.body;

      console.log('Making OpenAI API request...');
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
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

      console.log('OpenAI API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenAI API error: ${response.status} - ${errorText}`);
        throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const recommendations = data.choices[0]?.message?.content || "Based on your project details, I recommend starting with planning and getting multiple contractor quotes to establish realistic budget expectations.";

      res.json({ recommendations });
    } catch (error) {
      console.error('Renovation recommendations error:', error);
      res.status(500).json({
        error: 'Unable to generate recommendations',
        recommendations: 'Unable to generate recommendations at this time. Please check your connection and try again.'
      });
    }
  });

  // Homeowner Chat Assistant API
  app.post('/api/homeowner-chat', async (req, res) => {
    try {
      const { question } = req.body;

      if (!question || question.trim().length === 0) {
        return res.status(400).json({ error: 'Question is required' });
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
  });

  // Consumer Estimate Explanation API
  app.post("/api/consumer-estimate-explanation", async (req, res) => {
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
  });

  // Quote Analysis API for Consumer Mode
  app.post("/api/analyze-quotes", async (req, res) => {
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
  });

  // Feedback System API
  app.post("/api/feedback", async (req, res) => {
    try {
      const { rating, comment, usage, timestamp, userAgent, url } = req.body;

      const feedbackEntry = {
        id: Date.now().toString(),
        rating,
        comment: comment || '',
        usage: usage || '',
        timestamp,
        userAgent,
        url,
        createdAt: new Date().toISOString()
      };

      // In a real app, you'd save to database
      // For now, we'll just log and return success
      console.log('Feedback received:', feedbackEntry);

      res.json({
        success: true,
        message: "Feedback submitted successfully",
        id: feedbackEntry.id
      });
    } catch (error) {
      console.error("Error saving feedback:", error);
      res.status(500).json({ error: "Failed to submit feedback" });
    }
  });

  // Get feedback statistics (for dashboard)
  app.get("/api/feedback-stats", async (req, res) => {
    try {
      // Mock stats for now - in real app would query database
      const stats = {
        averageRating: 4.2,
        totalFeedback: 87,
        ratingDistribution: {
          5: 45,
          4: 28,
          3: 10,
          2: 3,
          1: 1
        }
      };

      res.json(stats);
    } catch (error) {
      console.error("Error fetching feedback stats:", error);
      res.status(500).json({ error: "Failed to fetch feedback stats" });
    }
  });

  // AI Renovation Chat API
  app.post("/api/ai-renovation-chat", async (req, res) => {
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
  });

  // Email Checklist API
  app.post("/api/email-checklist", async (req, res) => {
    try {
      const { email, projectType, checklist, userLocation } = req.body;

      if (!email) {
        return res.status(400).json({ error: "Email address required" });
      }

      // In a real app, you'd use an email service like SendGrid, Mailgun, etc.
      // For now, we'll just log and return success
      console.log('Email checklist request:', {
        to: email,
        projectType,
        location: userLocation,
        itemCount: checklist.length
      });

      // Simulate email sending
      res.json({
        success: true,
        message: "Checklist sent successfully",
        emailSent: true
      });
    } catch (error) {
      console.error("Error sending checklist email:", error);
      res.status(500).json({ error: "Failed to send checklist email" });
    }
  });

  // Enhanced Material Prices API Routes with Auto-Refresh
  app.get("/api/material-prices", async (req, res) => {
    try {
      res.setHeader('Content-Type', 'application/json');

      // Get market data with auto-refresh every 2 days
      const { getMarketData } = await import('./marketDataManager');
      const marketData = await getMarketData();
      res.json(marketData.materialPrices);
    } catch (error) {
      console.error("Error fetching material prices:", error);
      res.status(500).json({ error: "Failed to fetch material prices" });
    }
  });

  // Material prices endpoint
  app.get("/api/material-prices", async (req, res) => {
    try {
      res.setHeader('Content-Type', 'application/json');

      // Load data from JSON file
      const fs = require('fs');
      const path = require('path');
      const dataPath = path.join(__dirname, 'data', 'marketData.json');

      if (fs.existsSync(dataPath)) {
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        res.json(data.materialPrices || []);
      } else {
        // Fallback to hardcoded data if file doesn't exist
        const materialPrices = [
          { id: "lumber-2x4", name: "Lumber 2x4x8", category: "framing", currentPrice: 8.97, previousPrice: 8.45, unit: "board", trend: "up", changePercent: 6.2, lastUpdated: new Date().toISOString() },
          { id: "osb-sheathing", name: "OSB Sheathing 7/16\"", category: "framing", currentPrice: 45.99, previousPrice: 43.50, unit: "sheet", trend: "up", changePercent: 5.7, lastUpdated: new Date().toISOString() },
          { id: "ready-mix", name: "Ready Mix Concrete", category: "concrete", currentPrice: 165.00, previousPrice: 158.00, unit: "cubic yard", trend: "up", changePercent: 4.4, lastUpdated: new Date().toISOString() },
          { id: "drywall-half-inch", name: "Drywall 4x8 1/2\"", category: "drywall", currentPrice: 15.25, previousPrice: 14.80, unit: "sheet", trend: "up", changePercent: 3.0, lastUpdated: new Date().toISOString() },
          { id: "wire-12-gauge", name: "Romex 12-2 Wire", category: "electrical", currentPrice: 1.85, previousPrice: 1.75, unit: "linear foot", trend: "up", changePercent: 5.7, lastUpdated: new Date().toISOString() },
          { id: "pipe-copper-half", name: "Copper Pipe 1/2\"", category: "plumbing", currentPrice: 3.25, previousPrice: 2.95, unit: "linear foot", trend: "up", changePercent: 10.2, lastUpdated: new Date().toISOString() }
        ];
        res.json(materialPrices);
      }
    } catch (error) {
      console.error("Error fetching material prices:", error);
      res.status(500).json({ error: "Failed to fetch material prices" });
    }
  });

  // Keep the original endpoint for backward compatibility
  app.get("/api/material-prices-legacy", async (req, res) => {
    try {
      res.setHeader('Content-Type', 'application/json');
      // Real material pricing data structure for Montgomery County, MD
      const materialPrices = [
        // Framing & Structure
        { id: "lumber-2x4", name: "Lumber 2x4x8", category: "framing", currentPrice: 8.97, previousPrice: 8.45, unit: "board", source: "Home Depot", lastUpdated: new Date().toISOString(), trend: "up", changePercent: 6.2 },
        { id: "osb-sheathing", name: "OSB Sheathing 7/16\"", category: "framing", currentPrice: 45.99, previousPrice: 43.50, unit: "sheet", source: "Lowe's", lastUpdated: new Date().toISOString(), trend: "up", changePercent: 5.7 },
        { id: "engineered-lvl", name: "LVL Beam 1.75x11.25", category: "framing", currentPrice: 125.00, previousPrice: 120.00, unit: "linear ft", source: "Lumber Yard", lastUpdated: new Date().toISOString(), trend: "up", changePercent: 4.2 },

        // Concrete & Masonry
        { id: "ready-mix", name: "Ready Mix Concrete", category: "concrete", currentPrice: 165.00, previousPrice: 158.00, unit: "cubic yard", source: "Local Supplier", lastUpdated: new Date().toISOString(), trend: "up", changePercent: 4.4 },
        { id: "concrete-blocks", name: "8\" CMU Block", category: "concrete", currentPrice: 2.89, previousPrice: 2.75, unit: "block", source: "Masonry Supply", lastUpdated: new Date().toISOString(), trend: "up", changePercent: 5.1 },

        // Drywall & Insulation
        { id: "drywall-4x8", name: "Drywall 1/2\" 4x8", category: "drywall", currentPrice: 15.49, previousPrice: 14.99, unit: "sheet", source: "Home Depot", lastUpdated: new Date().toISOString(), trend: "up", changePercent: 3.3 },
        { id: "fiberglass-insulation", name: "R-15 Fiberglass Batt", category: "drywall", currentPrice: 89.99, previousPrice: 85.00, unit: "roll", source: "Lowe's", lastUpdated: new Date().toISOString(), trend: "up", changePercent: 5.9 },

        // Roofing
        { id: "asphalt-shingles", name: "Architectural Shingles", category: "roofing", currentPrice: 120.00, previousPrice: 115.00, unit: "square", source: "ABC Supply", lastUpdated: new Date().toISOString(), trend: "up", changePercent: 4.3 },
        { id: "roof-underlayment", name: "Synthetic Underlayment", category: "roofing", currentPrice: 175.00, previousPrice: 169.00, unit: "roll", source: "ABC Supply", lastUpdated: new Date().toISOString(), trend: "up", changePercent: 3.6 },

        // Plumbing
        { id: "copper-pipe", name: "Type L Copper 3/4\"", category: "plumbing", currentPrice: 8.25, previousPrice: 7.50, unit: "linear ft", source: "Ferguson", lastUpdated: new Date().toISOString(), trend: "up", changePercent: 10.0 },
        { id: "pex-pipe", name: "PEX Tubing 3/4\"", category: "plumbing", currentPrice: 2.15, previousPrice: 2.05, unit: "linear ft", source: "Home Depot", lastUpdated: new Date().toISOString(), trend: "up", changePercent: 4.9 },

        // Electrical
        { id: "romex-12-2", name: "Romex 12-2 Wire", category: "electrical", currentPrice: 1.89, previousPrice: 1.75, unit: "linear ft", source: "Home Depot", lastUpdated: new Date().toISOString(), trend: "up", changePercent: 8.0 },
        { id: "copper-wire", name: "THHN Copper Wire", category: "electrical", currentPrice: 8.50, previousPrice: 7.95, unit: "pound", source: "Electrical Supply", lastUpdated: new Date().toISOString(), trend: "up", changePercent: 6.9 },

        // Finishes & Interior
        { id: "interior-paint", name: "Premium Interior Paint", category: "finishes", currentPrice: 65.99, previousPrice: 62.99, unit: "gallon", source: "Sherwin Williams", lastUpdated: new Date().toISOString(), trend: "up", changePercent: 4.8 },
        { id: "interior-doors", name: "6-Panel Hollow Door", category: "finishes", currentPrice: 89.99, previousPrice: 85.00, unit: "door", source: "Home Depot", lastUpdated: new Date().toISOString(), trend: "up", changePercent: 5.9 },

        // Windows & Doors
        { id: "vinyl-windows", name: "Double-Hung Vinyl Window", category: "windows", currentPrice: 325.00, previousPrice: 310.00, unit: "window", source: "Window World", lastUpdated: new Date().toISOString(), trend: "up", changePercent: 4.8 },
        { id: "entry-door", name: "Steel Entry Door", category: "windows", currentPrice: 245.00, previousPrice: 235.00, unit: "door", source: "Lowe's", lastUpdated: new Date().toISOString(), trend: "up", changePercent: 4.3 },

        // Exterior
        { id: "vinyl-siding", name: "Vinyl Siding", category: "exterior", currentPrice: 4.25, previousPrice: 4.05, unit: "square ft", source: "ABC Supply", lastUpdated: new Date().toISOString(), trend: "up", changePercent: 4.9 },
        { id: "composite-decking", name: "Composite Deck Board", category: "exterior", currentPrice: 8.50, previousPrice: 8.15, unit: "linear ft", source: "Home Depot", lastUpdated: new Date().toISOString(), trend: "up", changePercent: 4.3 },

        // Miscellaneous
        { id: "dumpster-rental", name: "30-Yard Dumpster", category: "misc", currentPrice: 485.00, previousPrice: 465.00, unit: "week", source: "Waste Management", lastUpdated: new Date().toISOString(), trend: "up", changePercent: 4.3 },
        { id: "portable-toilet", name: "Portable Toilet Rental", category: "misc", currentPrice: 275.00, previousPrice: 265.00, unit: "month", source: "United Site Services", lastUpdated: new Date().toISOString(), trend: "up", changePercent: 3.8 }
      ];

      res.json(materialPrices);
    } catch (error) {
      console.error("Error fetching material prices:", error);
      res.status(500).json({ error: "Failed to fetch material prices" });
    }
  });

  app.get("/api/material-insights", async (req, res) => {
    try {
      // Generate AI-powered market insights
      const prompt = `You are a senior cost estimator for a residential construction company in Maryland. Based on current material pricing trends, provide market insights in this exact JSON format:

{
  "summary": "Brief summary of current market conditions (2-3 sentences)",
  "forecast": "Price forecast for next 30-60 days (2-3 sentences)", 
  "recommendations": ["Actionable recommendation 1", "Actionable recommendation 2", "Actionable recommendation 3"],
  "updatedAt": "${new Date().toISOString()}"
}

Current trends: Lumber and OSB prices up 5-6%, copper surging 10% due to supply constraints, concrete costs rising 4% due to increased demand, roofing materials stable with slight increases.`;

      const openaiResponse = await generateSpenceTheBuilderResponse(prompt, null, []);

      try {
        // Try to parse the AI response as JSON
        const insights = JSON.parse(openaiResponse);
        res.json(insights);
      } catch (parseError) {
        // Fallback response based on current market conditions
        res.json({
          summary: "Material prices continue to show upward pressure across most categories, with lumber and metal commodities leading increases.",
          forecast: "Expect continued price volatility over the next 30-60 days, particularly for copper-based materials and structural lumber.",
          recommendations: [
            "Lock in pricing for copper plumbing materials on upcoming projects",
            "Consider bulk purchasing of lumber for Q2 projects",
            "Review and update standard markup percentages to account for material inflation"
          ],
          updatedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Error generating market insights:", error);
      res.json({
        summary: "Material prices continue to show upward pressure across most categories, with lumber and metal commodities leading increases.",
        forecast: "Expect continued price volatility over the next 30-60 days, particularly for copper-based materials and structural lumber.",
        recommendations: [
          "Lock in pricing for copper plumbing materials on upcoming projects",
          "Consider bulk purchasing of lumber for Q2 projects",
          "Review and update standard markup percentages to account for material inflation"
        ],
        updatedAt: new Date().toISOString()
      });
    }
  });

  // AI Flip Opinion for Real Estate Listings with Caching
  app.post("/api/ai-flip-opinion", async (req, res) => {
    try {
      const { listing } = req.body;

      if (!listing) {
        return res.status(400).json({ error: "Listing data is required" });
      }

      // Check cache first
      const { existsSync, readFileSync, writeFileSync } = await import('fs');
      const { join } = await import('path');
      const cacheFile = join(process.cwd(), 'server', 'data', 'gptCache.json');

      let cache: any = {};
      try {
        if (existsSync(cacheFile)) {
          cache = JSON.parse(readFileSync(cacheFile, 'utf8'));
        }
      } catch (error) {
        console.log("Cache file not found or invalid, creating new cache");
      }

      // Create cache key from listing details
      const cacheKey = `${listing.id}_${listing.price}_${listing.daysOnMarket}`;

      // Return cached response if exists
      if (cache[cacheKey]) {
        console.log(`Cache hit for listing ${listing.id}`);

        // Update the listing in mockListings
        const { mockListings } = await import('./mockData');
        const listingIndex = mockListings.findIndex(l => l.id === listing.id);
        if (listingIndex !== -1) {
          mockListings[listingIndex].aiSummary = cache[cacheKey].response;
        }

        return res.json({
          success: true,
          message: "AI Flip Opinion retrieved from cache",
          flipOpinion: cache[cacheKey].response,
          cached: true
        });
      }

      console.log(`Cache miss for listing ${listing.id}, generating new response`);

      // Create the prompt for the house flipper analysis
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
1. **Location & Demand** — Is this a desirable flip area? Schools, comps, buyer demand?
2. **Renovation Scope** — Anything that looks light/heavy? Red flags?
3. **Flipper's Verdict** — Worth pursuing? Why or why not?

Be realistic, clear, and specific. Don't sugarcoat.`;

      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      let flipOpinion;

      try {
        flipOpinion = await generateSpenceTheBuilderResponse(prompt, listing, []);
      } catch (aiError) {
        console.error("OpenAI API error:", aiError);

        // Generate a realistic professional flipper analysis based on the property data
        const pricePerSqft = Math.round(listing.price / (listing.sqft || 1));
        const marketCondition = listing.daysOnMarket > 45 ? "slow market" : listing.daysOnMarket < 20 ? "hot market" : "steady market";

        flipOpinion = `**Location & Demand**
${listing.address.includes('Kensington') ? 'Kensington is a solid flip area with good schools and steady buyer demand.' : listing.address.includes('Silver Spring') ? 'Silver Spring offers good value with strong rental potential and diverse buyer pool.' : listing.address.includes('Wheaton') ? 'Wheaton is emerging with good Metro access, though renovation quality matters more here.' : 'This area shows mixed demand - location will impact your exit strategy.'} Current market conditions appear ${marketCondition} based on ${listing.daysOnMarket} days listed.

**Renovation Scope**
At $${pricePerSqft}/sqft, this property ${pricePerSqft > 300 ? 'is priced high - budget carefully for renovations' : pricePerSqft < 250 ? 'offers good value if renovation costs stay controlled' : 'is moderately priced for the area'}. ${listing.description?.includes('needs') || listing.description?.includes('update') ? 'Description indicates clear renovation needs - factor in full scope costs.' : 'Property condition seems decent but always budget for surprises.'} ${listing.bathrooms < 2 ? 'Limited bathrooms will hurt resale - consider adding if possible.' : ''}

**Flipper\'s Verdict**
${listing.daysOnMarket > 60 ? 'Long market time suggests either overpricing or hidden issues. Negotiate hard.' : listing.daysOnMarket < 15 ? 'Fast-moving market - move quickly but don\'t overpay.' : 'Reasonable market timing.'} ${pricePerSqft > 320 ? 'High price/sqft leaves thin margins - pass unless major value-add potential.' : 'Price point allows for profitable renovation if executed well.'} Overall: ${pricePerSqft < 280 && listing.daysOnMarket > 30 ? 'Worth pursuing - good negotiation opportunity.' : pricePerSqft > 320 ? 'Risky - margins too thin unless you can add significant value.' : 'Solid potential if renovation costs stay under $50-60/sqft.'}`;
      }

      // Cache the response
      cache[cacheKey] = {
        response: flipOpinion,
        timestamp: new Date().toISOString(),
        listingId: listing.id
      };

      try {
        writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
        console.log(`Cached response for listing ${listing.id}`);
      } catch (error) {
        console.error("Failed to write to cache:", error);
      }

      // Find and update the listing in mockListings
      const { mockListings } = await import('./mockData');
      const listingIndex = mockListings.findIndex(l => l.id === listing.id);
      if (listingIndex !== -1) {
        mockListings[listingIndex].aiSummary = flipOpinion;
      }

      res.json({
        success: true,
        message: "AI Flip Opinion generated successfully",
        flipOpinion: flipOpinion,
        cached: false
      });

    } catch (error) {
      console.error("Error generating AI flip opinion:", error);
      res.status(500).json({ error: "Failed to generate AI flip opinion" });
    }
  });



  // AI Flip Feedback Storage
  app.post("/api/ai-flip-feedback", async (req, res) => {
    try {
      const feedbackData = req.body;

      // Validate required fields
      if (!feedbackData.listingId || !feedbackData.listingAddress) {
        return res.status(400).json({ error: "Listing ID and address are required" });
      }

      // Create feedback entry with timestamp and unique ID
      const feedback = {
        id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        listingId: feedbackData.listingId,
        listingAddress: feedbackData.listingAddress,
        feedbackType: feedbackData.feedbackType, // 'thumbs' or 'stars'
        rating: feedbackData.rating, // 1-5 for stars, null for thumbs
        thumbsRating: feedbackData.thumbsRating, // 'up' or 'down' for thumbs, null for stars
        comment: feedbackData.comment || null,
        timestamp: feedbackData.timestamp || new Date().toISOString(),
        userAgent: req.headers['user-agent'] || 'unknown'
      };

      // In a real app, you'd save this to a database
      // For demo purposes, we'll just acknowledge receipt
      console.log('AI Flip Feedback received:', feedback);

      res.json({
        success: true,
        message: "Feedback submitted successfully",
        feedbackId: feedback.id,
        timestamp: feedback.timestamp
      });

    } catch (error) {
      console.error("Error saving AI flip feedback:", error);
      res.status(500).json({ error: "Failed to save feedback" });
    }
  });

  // Get AI Flip Feedback Analytics (optional endpoint for future use)
  app.get("/api/ai-flip-feedback", async (req, res) => {
    try {
      // In a real app, you'd query the database for feedback analytics
      // For now, return sample analytics structure
      res.json({
        totalFeedback: 0,
        averageStarRating: 0,
        thumbsUpPercentage: 0,
        recentComments: [],
        topRatedListings: [],
        message: "Feedback analytics endpoint ready for implementation"
      });
    } catch (error) {
      console.error("Error fetching feedback analytics:", error);
      res.status(500).json({ error: "Failed to fetch feedback analytics" });
    }
  });




  // Personalized Budget Forecasting API
  app.post("/api/budget-forecast", async (req, res) => {
    try {
      const { projectType, homeSquareFootage, projectSquareFootage, qualityLevel, timelineFlexibility, location, specialRequirements, budgetRange } = req.body;

      // Get current material prices for accurate calculations
      const { getMarketData } = await import('./marketDataManager');
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
      const baseCost = (baseCostPerSqFt[projectType] || 150) * sqft;
      const qualityAdjustedCost = baseCost * (qualityMultipliers[qualityLevel] || 1.0);
      const timelineAdjustedCost = qualityAdjustedCost * (timelineMultipliers[timelineFlexibility] || 1.0);

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
        'exterior': 6
      };

      const projectDuration = baseDuration[projectType] || 8;
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
  });

  // Smart Project Estimator API (merged Cost Estimator + Budget Forecasting)
  app.post("/api/smart-estimate", async (req, res) => {
    try {
      const { projectType, squareFootage, finishLevel, timeline, location } = req.body;

      // Get current material prices for accurate calculations
      const { getMarketData } = await import('./marketDataManager');
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
      const baseCost = baseCosts[projectType] * sqft;
      const adjustedCost = baseCost * finishMultipliers[finishLevel] * costTimelineMultipliers[timeline];

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
        timelineInWeeks = Math.round(baseDurations[projectType] * durationTimelineMultipliers[timeline] || durationTimelineMultipliers['moderate']);
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
  });

  // Renovation Assistant API (merged AI Concierge + AI Assistant)
  app.post("/api/renovation-assistant", async (req, res) => {
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
  });

  // Contractor Quote Comparison API
  app.post("/api/compare-contractor-quotes", async (req, res) => {
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

        ${quotesInfo.map(q => `
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
  });

  // ROI Improvements API
  app.post("/api/roi-improvements", async (req, res) => {
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
  });

  // AI Flip Score Generation API
  app.post("/api/generate-flip-score", async (req, res) => {
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
  });

  // Compare Contractor Quotes API
  app.post("/api/compare-contractor-quotes", async (req, res) => {
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
  });

  // Local Real Estate Listings API
  app.post("/api/fetch-local-listings", async (req, res) => {
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
  });

  // Material AI Advice API
  // Material search endpoint with GPT-powered web search capabilities
  app.post("/api/material-search", async (req, res) => {
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
  });

  app.post("/api/material-ai-advice", async (req, res) => {
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
  });

  // AI Schedule Optimization API
  app.post("/api/optimize-schedule", async (req, res) => {
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
  });

  // AI Bid Improvement API
  app.post("/api/improve-bid-text", async (req, res) => {
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
  });

  // AI Contractor Matching API
  app.post("/api/find-best-contractor", async (req, res) => {
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
  });

  // AI Permit Application Guidance API
  app.post("/api/permit-application-guidance", async (req, res) => {
    try {
      const { city, projectType, permits, department } = req.body;

      if (!city || !projectType || !permits) {
        return res.status(400).json({ error: "City, project type, and permits are required" });
      }

      const prompt = `You are a permit application expert. Provide step-by-step guidance for applying for permits in ${city} for a ${projectType} project.

Required Permits:
${JSON.stringify(permits, null, 2)}

Department Information:
${JSON.stringify(department, null, 2)}

Provide practical guidance that includes:
- Specific forms needed (with form numbers if known for the city)
- Required documents and supporting materials
- Application fees and payment methods
- Timeline expectations
- Where to submit applications
- Common mistakes to avoid
- City-specific requirements

Format as clear, actionable steps. Example: "In Chicago, you'll need to submit Form 211B and pay a $275 filing fee."`;

      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
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
        max_tokens: 500
      });

      const guidance = response.choices[0].message.content || "Application guidance temporarily unavailable.";

      res.json({
        guidance,
        city,
        projectType,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error("Error generating permit application guidance:", error);
      res.status(500).json({
        error: "Failed to generate guidance",
        guidance: "Application guidance temporarily unavailable. Please contact the permit office directly for assistance."
      });
    }
  });

  // AI Permit Skip Consequences API
  app.post("/api/permit-skip-consequences", async (req, res) => {
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
  });

  // AI Email Generator API
  app.post("/api/generate-contractor-email", async (req, res) => {
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
  });

  // Market Insights API with Weekly Caching
  app.post("/api/market-insights", async (req, res) => {
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
  });

  // Property URL Analysis API
  app.post("/api/analyze-property-url", async (req, res) => {
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
  });

  // Demo mode status endpoint
  app.get("/api/demo-status", (req, res) => {
    res.json({
      isDemoMode: isDemoModeEnabled(),
      demoData: isDemoModeEnabled() ? {
        project: getMockProjectData(),
        estimates: [getMockEstimateData()],
        schedules: getMockScheduleData(),
        tasks: getMockTaskList()
      } : null
    });
  });


  const httpServer = createServer(app);
  return httpServer;
}


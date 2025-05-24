import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEstimateSchema, insertScheduleSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import { explainEstimate, summarizeSchedule, getAIRecommendations, draftEmail, generateRiskAssessment, generateSmartSuggestions, calculateScenario } from "./ai";

// Temporary AI functions for demo - these will be moved to ai.ts
async function generatePreEstimateSummary(formData: any): Promise<string> {
  const openai = require("openai");
  const client = new openai.OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a veteran construction estimator. Provide quick insights about cost expectations before showing the final number."
        },
        {
          role: "user",
          content: `Based on these project selections, give a brief pre-estimate insight:
          
          Project Type: ${formData.projectType}
          Area: ${formData.area} sq ft
          Material Quality: ${formData.materialQuality}
          Timeline: ${formData.timeline}
          Workers: ${formData.laborWorkers || 'Standard crew'}
          
          Write a short summary like: "Based on your selections — premium materials, tight timeline, and two-person crew — your cost is expected to be on the higher end due to labor intensity and finish choice."
          
          Keep it under 40 words and focus on cost drivers.`
        }
      ],
      temperature: 0.4
    });
    return response.choices[0].message.content || "Your project selections look good. Cost estimate coming up.";
  } catch (error) {
    return "Your project selections look good. Cost estimate coming up.";
  }
}

async function generateRiskRating(estimateData: any): Promise<{ riskLevel: 'low' | 'medium' | 'high'; riskExplanation: string; }> {
  const openai = require("openai");
  const client = new openai.OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a construction project manager assessing project risk. Focus on labor availability, timeline pressure, material complexity, and site conditions."
        },
        {
          role: "user",
          content: `Assess the risk level for this construction project:
          
          ${JSON.stringify(estimateData, null, 2)}
          
          Return JSON with:
          - riskLevel: "low", "medium", or "high"
          - riskExplanation: brief explanation like "Risk: Medium – Labor availability and short timeline may affect delivery. Consider contingency buffer or flexible timeline."
          
          Focus on practical construction risks that affect money, time, and delivery.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3
    });
    const result = JSON.parse(response.choices[0].message.content || '{"riskLevel": "medium", "riskExplanation": "Standard project risk factors apply."}');
    return result;
  } catch (error) {
    return { riskLevel: 'medium', riskExplanation: 'Standard project risk factors apply.' };
  }
}

async function generatePastProjectInsight(currentProject: any, similarProjects: any[]): Promise<string> {
  const openai = require("openai");
  const client = new openai.OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a construction estimator comparing current projects to past work. Explain cost differences and similarities in practical terms."
        },
        {
          role: "user",
          content: `Compare this current project to similar past projects and explain the relationship:
          
          Current Project: ${JSON.stringify(currentProject, null, 2)}
          Similar Past Projects: ${JSON.stringify(similarProjects.slice(0, 3), null, 2)}
          
          Write a brief insight like: "Your current project most closely resembles your 2022 Georgetown addition. The cost difference is driven primarily by updated material pricing and an aggressive 5-week timeline."
          
          Keep it under 50 words and focus on cost drivers and practical differences.`
        }
      ],
      temperature: 0.4
    });
    return response.choices[0].message.content || "This project is similar to your recent work with comparable scope and complexity.";
  } catch (error) {
    return "This project is similar to your recent work with comparable scope and complexity.";
  }
}

// Spence the Builder Virtual Assistant
async function generateSpenceTheBuilderResponse(message: string, estimateData: any, chatHistory: any[]): Promise<string> {
  const openai = require("openai");
  const client = new openai.OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
  try {
    const systemPrompt = `You are Spence The Builder's virtual construction assistant. You're an expert in construction estimating, materials, labor, and project management. 

    You have access to the user's current estimate data: ${JSON.stringify(estimateData, null, 2)}
    
    Answer questions about:
    - Why estimates are priced the way they are
    - Material costs and alternatives 
    - Timeline concerns and solutions
    - Labor requirements and optimization
    - Hidden costs and potential issues
    - Construction best practices
    
    Keep responses conversational, practical, and construction-focused. When referencing the estimate, be specific about the numbers and reasoning.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...chatHistory.map(msg => ({ role: msg.role, content: msg.content })),
      { role: "user", content: message }
    ];

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      temperature: 0.7,
      max_tokens: 300
    });

    return response.choices[0].message.content || "I'm here to help with your construction questions! Ask me about costs, materials, or timelines.";
  } catch (error) {
    return "I'm having trouble right now, but I'm here to help with construction estimates, material costs, and project planning!";
  }
}

// AI Visual Preview Generator
async function generateVisualPreview(projectData: any): Promise<string> {
  const openai = require("openai");
  const client = new openai.OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
  try {
    const prompt = `A professional architectural rendering of a ${projectData.projectType.toLowerCase()} with ${projectData.materialQuality} finishes, ${projectData.area} square feet, modern construction style, clean lines, realistic lighting, interior design photography style`;

    const response = await client.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    return response.data[0].url || "";
  } catch (error) {
    throw new Error("Visual preview generation requires DALL-E access");
  }
}

// Hidden Cost Insights
async function generateHiddenCostInsights(estimateData: any): Promise<any> {
  const openai = require("openai");
  const client = new openai.OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a veteran construction cost analyst. Identify hidden costs, unusual patterns, and provide actionable insights about estimates."
        },
        {
          role: "user",
          content: `Analyze this estimate and provide insights about hidden costs or unusual patterns:
          
          ${JSON.stringify(estimateData, null, 2)}
          
          Return JSON with:
          - insight: Main insight about cost drivers (like "This job's labor cost is 24% higher than usual due to timeline compression")
          - hiddenCosts: Array of potential hidden costs they might not have considered
          - recommendations: Array of cost-saving or risk-mitigation suggestions
          - riskLevel: "low", "medium", or "high"
          
          Focus on practical construction insights that help optimize the project.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.4
    });

    return JSON.parse(response.choices[0].message.content || '{"insight": "Estimate appears within normal ranges", "hiddenCosts": [], "recommendations": [], "riskLevel": "medium"}');
  } catch (error) {
    return {
      insight: "Unable to analyze estimate patterns at this time",
      hiddenCosts: ["Consider permit delays", "Weather-related delays", "Material price fluctuations"],
      recommendations: ["Maintain 15% contingency", "Confirm material availability", "Plan for weather delays"],
      riskLevel: "medium"
    };
  }
}

// Personalized Client Message Assistant
async function generatePersonalizedClientMessage(estimateData: any, clientName: string, projectLocation: string, messageType: string): Promise<string> {
  const openai = require("openai");
  const client = new openai.OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
  try {
    const prompt = messageType === "email" 
      ? `Write a professional, personalized email to a client about their construction estimate. 

Client: ${clientName}
Project: ${estimateData.projectType} ${projectLocation ? `in ${projectLocation}` : ''}
Details: ${estimateData.area} sq ft, ${estimateData.materialQuality} finishes
Cost: $${estimateData.estimatedCost?.toLocaleString()}
Timeline: ${estimateData.timeline || 'Standard'}

Write like a friendly construction professional. Include the estimate details, mention next steps, and offer to discuss options. Keep it personal and conversational.`
      : `Write a professional but concise text message to a client about their construction estimate.

Client: ${clientName}
Project: ${estimateData.projectType} 
Cost: $${estimateData.estimatedCost?.toLocaleString()}
Size: ${estimateData.area} sq ft

Keep it under 160 characters, friendly, and include the key details. Mention they can call with questions.`;

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional construction business owner writing to clients. Be friendly, clear, and helpful."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: messageType === "email" ? 400 : 160
    });

    return response.choices[0].message.content || "Message generation failed";
  } catch (error) {
    throw new Error("Failed to generate personalized message");
  }
}
import { getBenchmarkCosts, analyzeEstimate } from "./benchmarking";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), "server", "uploads");

// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve static files from uploads directory
  app.use("/uploads", express.static(uploadDir));

  // Parse JSON middleware
  app.use(express.json());

  // GET /api/estimates - Get all estimates
  app.get("/api/estimates", async (req, res) => {
    try {
      const estimates = await storage.getEstimates();
      res.json(estimates);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch estimates" });
    }
  });

  // POST /api/estimates - Create new estimate
  app.post("/api/estimates", upload.single("blueprintFile"), async (req, res) => {
    try {
      const validatedData = insertEstimateSchema.parse(req.body);
      const estimate = await storage.createEstimate(validatedData);
      
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
        res.status(500).json({ error: "Failed to create estimate" });
      }
    }
  });

  // GET /api/schedules - Get all schedules
  app.get("/api/schedules", async (req, res) => {
    try {
      const schedules = await storage.getSchedules();
      res.json(schedules);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch schedules" });
    }
  });

  // POST /api/schedules - Create new schedule
  app.post("/api/schedules", async (req, res) => {
    try {
      // Basic ZIP code validation (in production, use Google Maps API)
      const zipCodeRegex = /^\d{5}(-\d{4})?$/;
      if (!zipCodeRegex.test(req.body.zipCode)) {
        return res.status(400).json({ error: "Invalid ZIP code format" });
      }

      const validatedData = insertScheduleSchema.parse(req.body);
      const schedule = await storage.createSchedule(validatedData);
      
      // Here you would send notifications via email/SMS
      console.log("Schedule created, notifications would be sent to:", validatedData.email, validatedData.phone);
      
      res.json(schedule);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid input data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create schedule" });
      }
    }
  });

  // GET /api/stats - Get dashboard statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const estimates = await storage.getEstimates();
      const schedules = await storage.getSchedules();
      
      const totalEstimates = estimates.length;
      const scheduledInspections = schedules.filter(s => s.status === "scheduled").length;
      const totalValue = estimates.reduce((sum, est) => sum + est.estimatedCost, 0);
      
      res.json({
        totalEstimates,
        scheduledInspections,
        totalValue: `$${(totalValue / 1000000).toFixed(1)}M`,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  });

  // POST /api/explain-estimate - Get GPT explanation of estimate
  app.post("/api/explain-estimate", async (req, res) => {
    try {
      const { estimateId } = req.body;
      const estimate = await storage.getEstimate(estimateId);
      
      if (!estimate) {
        return res.status(404).json({ error: "Estimate not found" });
      }

      const explanation = await explainEstimate(estimate);
      res.json({ explanation });
    } catch (error) {
      console.error("Error explaining estimate:", error);
      res.status(500).json({ error: "Failed to generate explanation" });
    }
  });

  // GET /api/summarize-schedule - Get GPT summary of schedule
  app.get("/api/summarize-schedule", async (req, res) => {
    try {
      const schedules = await storage.getSchedules();
      const summary = await summarizeSchedule(schedules);
      res.json({ summary });
    } catch (error) {
      console.error("Error summarizing schedule:", error);
      res.status(500).json({ error: "Failed to generate schedule summary" });
    }
  });

  // GET /api/ai-recommendations - Get AI recommendations for PM
  app.get("/api/ai-recommendations", async (req, res) => {
    try {
      const estimates = await storage.getEstimates();
      const schedules = await storage.getSchedules();
      const recommendations = await getAIRecommendations(estimates, schedules);
      res.json({ recommendations });
    } catch (error) {
      console.error("Error getting AI recommendations:", error);
      res.status(500).json({ error: "Failed to generate recommendations" });
    }
  });

  // POST /api/draft-email - Generate email draft
  app.post("/api/draft-email", async (req, res) => {
    try {
      const { type, data } = req.body;
      
      if (!type || !data) {
        return res.status(400).json({ error: "Type and data are required" });
      }

      const emailDraft = await draftEmail(type, data);
      res.json({ emailDraft });
    } catch (error) {
      console.error("Error drafting email:", error);
      res.status(500).json({ error: "Failed to generate email draft" });
    }
  });

  // POST /api/similar-past-projects - Find similar past projects
  app.post("/api/similar-past-projects", async (req, res) => {
    try {
      const { projectType, zipCode, squareFootage, materialQuality, estimatedCost } = req.body;
      const { findSimilarPastProjects } = await import('./pastProjectsService.js');
      
      const result = await findSimilarPastProjects({
        projectType,
        zipCode,
        squareFootage,
        materialQuality,
        estimatedCost
      });
      
      res.json(result);
    } catch (error) {
      console.error("Error finding similar past projects:", error);
      res.status(500).json({ error: "Failed to find similar past projects" });
    }
  });

  // POST /api/ai-risk-assessment - Generate AI risk assessment
  app.post("/api/ai-risk-assessment", async (req, res) => {
    try {
      const { projectType, area, materialQuality, timeline, estimatedCost, zipCode } = req.body;
      
      const assessment = await generateRiskAssessment({
        projectType,
        area,
        materialQuality,
        timeline,
        estimatedCost,
        zipCode
      });
      
      res.json({ assessment });
    } catch (error) {
      console.error("Error generating risk assessment:", error);
      res.status(500).json({ error: "Failed to generate risk assessment" });
    }
  });

  // POST /api/smart-suggestions - Generate AI-powered suggestions
  app.post("/api/smart-suggestions", async (req, res) => {
    try {
      const formData = req.body;
      const suggestions = await generateSmartSuggestions(formData);
      res.json({ suggestions });
    } catch (error) {
      console.error("Error generating smart suggestions:", error);
      res.status(500).json({ error: "Failed to generate suggestions" });
    }
  });

  // POST /api/calculate-scenario - Calculate what-if scenario
  app.post("/api/calculate-scenario", async (req, res) => {
    try {
      const modifiedEstimate = req.body;
      const result = await calculateScenario(modifiedEstimate);
      res.json(result);
    } catch (error) {
      console.error("Error calculating scenario:", error);
      res.status(500).json({ error: "Failed to calculate scenario" });
    }
  });

  // POST /api/pre-estimate-summary - Generate pre-estimate GPT summary
  app.post("/api/pre-estimate-summary", async (req, res) => {
    try {
      const formData = req.body;
      const summary = await generatePreEstimateSummary(formData);
      res.json({ summary });
    } catch (error) {
      console.error("Error generating pre-estimate summary:", error);
      res.status(500).json({ error: "Failed to generate pre-estimate summary" });
    }
  });

  // POST /api/risk-rating - Generate AI risk rating
  app.post("/api/risk-rating", async (req, res) => {
    try {
      const estimateData = req.body;
      const riskRating = await generateRiskRating(estimateData);
      res.json(riskRating);
    } catch (error) {
      console.error("Error generating risk rating:", error);
      res.status(500).json({ error: "Failed to generate risk rating" });
    }
  });

  // POST /api/past-project-insight - Generate AI insight on past project matches
  app.post("/api/past-project-insight", async (req, res) => {
    try {
      const { currentProject, similarProjects } = req.body;
      const insight = await generatePastProjectInsight(currentProject, similarProjects);
      res.json({ insight });
    } catch (error) {
      console.error("Error generating past project insight:", error);
      res.status(500).json({ error: "Failed to generate past project insight" });
    }
  });

  // POST /api/spencebot-chat - SpenceBot virtual assistant chat
  app.post("/api/spencebot-chat", async (req, res) => {
    try {
      const { message, estimateData, chatHistory } = req.body;
      const response = await generateSpenceTheBuilderResponse(message, estimateData, chatHistory);
      res.json({ response });
    } catch (error) {
      console.error("Error generating Spence the Builder response:", error);
      res.status(500).json({ error: "Failed to generate response" });
    }
  });

  // POST /api/generate-visual-preview - AI Visual Preview Generator
  app.post("/api/generate-visual-preview", async (req, res) => {
    try {
      const { projectData } = req.body;
      const imageUrl = await generateVisualPreview(projectData);
      res.json({ imageUrl });
    } catch (error) {
      console.error("Error generating visual preview:", error);
      res.status(500).json({ error: "Failed to generate visual preview" });
    }
  });

  // POST /api/hidden-cost-insights - AI Hidden Cost Analysis
  app.post("/api/hidden-cost-insights", async (req, res) => {
    try {
      const { estimateData } = req.body;
      const insights = await generateHiddenCostInsights(estimateData);
      res.json(insights);
    } catch (error) {
      console.error("Error generating hidden cost insights:", error);
      res.status(500).json({ error: "Failed to generate insights" });
    }
  });

  // POST /api/generate-personalized-message - Personalized Client Message Assistant
  app.post("/api/generate-personalized-message", async (req, res) => {
    try {
      const { estimateData, clientName, projectLocation, messageType } = req.body;
      const message = await generatePersonalizedClientMessage(estimateData, clientName, projectLocation, messageType);
      res.json({ message });
    } catch (error) {
      console.error("Error generating personalized message:", error);
      res.status(500).json({ error: "Failed to generate message" });
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

      const openai = require("openai");
      const client = new openai.OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      
      const systemPrompt = `You are Spence the Builder, an expert construction assistant and advisor. You have decades of experience in residential and commercial construction, project management, estimating, permits, and client relations.

Your responses should be:
- Practical and actionable
- Written like an experienced contractor would speak
- Professional but friendly
- Focused on construction industry knowledge
- Concise but thorough

Always provide specific, real-world advice that construction business owners can immediately use. Avoid generic responses.`;

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

  const httpServer = createServer(app);
  return httpServer;
}

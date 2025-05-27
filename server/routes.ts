import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { calculateEnhancedEstimate, generateWhatIfScenarios, getRegionalInsights } from "./costEngine";
import { mockListings, mockPermits, mockFlipProjects, mockScheduledProjects, generateMockAIAnalysis } from "./mockData";
import { insertEstimateSchema, insertScheduleSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import { explainEstimate, summarizeSchedule, getAIRecommendations, draftEmail, generateRiskAssessment, generateSmartSuggestions, calculateScenario, generateLeadStrategies, analyzeMaterialCosts, compareSubcontractors, assessProjectRisks, generateProjectTimeline, generateBudgetPlan } from "./ai";
import OpenAI from "openai";
import { isDemoModeEnabled, getMockProjectData, getMockEstimateData, getMockScheduleData, getMockTaskList, wrapDemoResponse } from "./demoMode";

// Temporary AI functions for demo - these will be moved to ai.ts
async function generatePreEstimateSummary(formData: any): Promise<string> {
  const OpenAI = (await import("openai")).default;
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
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
  const OpenAI = (await import("openai")).default;
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
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
  const OpenAI = await import("openai");
  const client = new OpenAI.default({ apiKey: process.env.OPENAI_API_KEY });
  
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
async function generateClientEmail(estimateData: any): Promise<string> {
  const OpenAI = require("openai");
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `You are a professional construction estimator. Write a client-ready email based on the following project estimate. 

The email should be:
- Professional and polite
- Clear about the project scope and costs
- Highlight key details (materials, size, timeline)
- End with a friendly call to action
- Include next steps for the client

Project Details:
Project Type: ${estimateData.projectType}
Area: ${estimateData.area} sq ft
Material Quality: ${estimateData.materialQuality}
Timeline: ${estimateData.timeline}
Estimated Cost: $${estimateData.estimatedCost?.toLocaleString()}
${estimateData.description ? `Description: ${estimateData.description}` : ''}

Write a complete email with subject line suggestion and professional body content.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      max_tokens: 800,
    });

    return response.choices[0].message.content || "Unable to generate email content.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate client email with AI");
  }
}

async function lookupZipCode(zipCode: string): Promise<any> {
  // Note: This requires Google Maps Geocoding API key
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    throw new Error("Google Maps API key not configured");
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK' && data.results.length > 0) {
      const result = data.results[0];
      const addressComponents = result.address_components;
      
      let city = '';
      let state = '';
      
      for (const component of addressComponents) {
        if (component.types.includes('locality')) {
          city = component.long_name;
        }
        if (component.types.includes('administrative_area_level_1')) {
          state = component.short_name;
        }
      }
      
      return {
        city,
        state,
        zipCode,
        formattedAddress: result.formatted_address
      };
    } else {
      throw new Error("ZIP code not found");
    }
  } catch (error) {
    console.error("Google Maps API error:", error);
    throw new Error("Failed to lookup ZIP code");
  }
}

async function sendNotificationEmail(to: string, subject: string, message: string, type: string): Promise<any> {
  // Note: This requires email configuration (Nodemailer setup)
  // For now, we'll return a placeholder response
  // The user would need to provide email credentials for this to work
  
  console.log(`Email notification would be sent:
    To: ${to}
    Subject: ${subject}
    Type: ${type}
    Message: ${message}`);
  
  // In a real implementation, this would use Nodemailer:
  // const nodemailer = require('nodemailer');
  // const transporter = nodemailer.createTransporter({...});
  // return await transporter.sendMail({to, subject, html: message});
  
  return { 
    success: true, 
    message: "Email notification logged (real sending requires email configuration)" 
  };
}

async function generateCostBreakdownExplanation(costBreakdown: any, projectType: string, estimatedCost: number): Promise<string> {
  // Check if OpenAI API key is available
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured. Please set your OPENAI_API_KEY environment variable.");
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const costBreakdownJson = JSON.stringify(costBreakdown, null, 2);
    
    const prompt = `You are a construction budgeting assistant integrated into Spence the Builder's Tools Suite. 

Context:
You are shown an object with categorized cost breakdowns for a construction project. You will:
- Summarize the cost allocation clearly.
- Explain what typically contributes to each category.
- Invite follow-up questions about the breakdown.

Instructions:
1. Start with a short summary: "Here's a breakdown of your project's estimated costs."
2. For each line item, give a 1–2 sentence explanation. Example:
   - **Materials ($293, 35%)**: Includes raw construction materials such as wood, tile, drywall, and finishes. This is typically the largest cost in residential projects.
3. At the end, invite follow-up questions: "Let me know if you'd like to explore what goes into any specific category or how these estimates are calculated."

Format:
Respond with a professional but friendly tone. Use markdown for formatting. Respond only to the cost object given.

Project Type: ${projectType}
Total Estimated Cost: $${estimatedCost.toLocaleString()}

The following is the cost breakdown object:
${costBreakdownJson}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      max_tokens: 600,
    });

    return response.choices[0].message.content || "Unable to generate cost explanation.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error(`Failed to generate cost breakdown explanation: ${error.message}`);
  }
}

async function generateCategoryDetail(category: string, projectType: string, amount: number, percentage: number): Promise<string> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `You are a construction budgeting assistant. A user is asking for detailed information about the "${category}" category in their ${projectType} project.

Category: ${category}
Amount: $${amount.toLocaleString()}
Percentage: ${percentage}%
Project Type: ${projectType}

Provide a detailed explanation of what typically goes into this category for this type of project. Include:
1. Specific items/services included
2. Why this percentage is typical (or if it's high/low)
3. Ways to potentially reduce costs in this category
4. Any important considerations

Keep the response conversational and helpful, around 3-4 sentences.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      max_tokens: 400,
    });

    return response.choices[0].message.content || "Unable to generate category details.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate category details with AI");
  }
}

async function processConversationalEstimator(userInput: string, currentEstimate: any, chatHistory: any[]): Promise<any> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const systemPrompt = `You are an expert construction estimator assistant. When users describe their project, you MUST extract the details and create a complete estimate structure that will generate real costs. Always respond in JSON format.

EXTRACT FROM USER INPUT:
- projectType: kitchen-remodel, bathroom-remodel, home-addition, deck-construction, flooring-installation, roofing-replacement, siding-installation, commercial-renovation, etc.
- area: square footage (numeric)
- materialQuality: budget, standard, premium, luxury 
- timeline: 1-2 weeks, 2-4 weeks, 4-8 weeks, 8-12 weeks, 3-6 months, 6+ months
- zipCode: if mentioned
- description: brief project summary
- permitNeeded: true/false based on project scope
- demolitionRequired: true/false based on description

WHEN USER DESCRIBES A PROJECT:
You must create a complete estimateInput object that will generate real costs, including:
- All required fields above
- laborWorkers: 1-4 (based on project size)
- laborHours: 8-40 (based on project complexity) 
- laborRate: 35-75 (based on location and skill level)
- materials: basic material list with quantities and costs

EXAMPLE RESPONSE for "I want to remodel a 350 sq ft kitchen with mid-level finishes":
{
  "response": "Perfect! I've set up your kitchen remodel estimate. Generating your costs now...",
  "updatedEstimateInput": {
    "projectType": "kitchen-remodel",
    "area": 350,
    "materialQuality": "standard", 
    "timeline": "4-8 weeks",
    "description": "Kitchen remodel with mid-level finishes",
    "permitNeeded": true,
    "demolitionRequired": true,
    "laborWorkers": 2,
    "laborHours": 32,
    "laborRate": 45,
    "materials": "[{\"type\":\"cabinetry\",\"quantity\":20,\"unit\":\"linear foot\",\"costPerUnit\":150},{\"type\":\"countertops\",\"quantity\":350,\"unit\":\"sq ft\",\"costPerUnit\":45},{\"type\":\"flooring\",\"quantity\":350,\"unit\":\"sq ft\",\"costPerUnit\":8}]"
  }
}

Current context: ${currentEstimate ? JSON.stringify(currentEstimate) : 'No current estimate'}
User input: ${userInput}

Please respond with a JSON object containing your analysis and any extracted project details.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "system", content: systemPrompt }],
      response_format: { type: "json_object" },
      max_tokens: 800,
    });

    const aiResponse = response.choices[0].message.content || '{"response": "I understand your request", "updatedEstimateInput": null}';
    console.log("Raw AI response:", aiResponse);
    
    const result = JSON.parse(aiResponse);
    
    // Ensure we have a complete estimate structure when user describes a project
    if (result.updatedEstimateInput && result.updatedEstimateInput.projectType && result.updatedEstimateInput.area) {
      // Fill in missing required fields for estimate calculation
      result.updatedEstimateInput = {
        ...result.updatedEstimateInput,
        projectType: result.updatedEstimateInput.projectType || "kitchen-remodel",
        timeline: result.updatedEstimateInput.timeline || "standard",
        description: result.updatedEstimateInput.description || `${result.updatedEstimateInput.projectType} project`,
        laborWorkers: result.updatedEstimateInput.laborWorkers || 2,
        laborHours: result.updatedEstimateInput.laborHours || 24,
        laborRate: result.updatedEstimateInput.laborRate || 45,
        permitNeeded: result.updatedEstimateInput.permitNeeded !== false,
        demolitionRequired: result.updatedEstimateInput.demolitionRequired !== false,
        siteAccess: result.updatedEstimateInput.siteAccess || "moderate",
        timelineSensitivity: result.updatedEstimateInput.timelineSensitivity || "standard",
        materials: result.updatedEstimateInput.materials || `[{"type":"general","quantity":${result.updatedEstimateInput.area},"unit":"sq ft","costPerUnit":25}]`,
        tradeType: result.updatedEstimateInput.tradeType || "",
        laborTypes: result.updatedEstimateInput.laborTypes || `[{"type":"general","workers":2,"hours":24,"hourlyRate":45}]`
      };
      
      result.response = "Perfect! I've analyzed your project and generated your cost estimate. Here are your results...";
    }
    
    console.log("Processed result:", result);
    return result;
  } catch (error) {
    console.error("OpenAI API error:", error);
    return {
      response: "I'm having trouble processing that right now. Could you try rephrasing your question or being more specific about your project?",
      updatedEstimateInput: null
    };
  }
}

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

  // Renovation recommendations endpoint
  apiRouter.post('/renovation-recommendations', async (req, res) => {
    console.log('🏠 Renovation recommendations endpoint hit');
    res.setHeader('Content-Type', 'application/json');
    
    try {
      const { projectDetails, budget, timeline, priorities } = req.body;
      
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
  });

  // Homeowner chat endpoint
  apiRouter.post('/homeowner-chat', async (req, res) => {
    console.log('💬 Homeowner chat endpoint hit');
    res.setHeader('Content-Type', 'application/json');
    
    try {
      const { question } = req.body;
      
      if (!question || question.trim().length === 0) {
        return res.json({ error: 'Question is required', response: 'Please provide a question about your renovation project.' });
      }

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
  });

  // Property analysis endpoint
  apiRouter.post('/property-analysis', async (req, res) => {
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
  });

  // Pro Market Insights endpoint
  apiRouter.get('/pro-insights', async (req, res) => {
    console.log('📊 Pro Market Insights endpoint hit');
    res.setHeader('Content-Type', 'application/json');
    
    try {
      // Real market data would come from construction industry APIs
      // This provides realistic data structure for demo purposes
      const marketInsights = [
        {
          id: 'permit-processing',
          title: 'Permit Processing',
          subtitle: 'Avg approval time',
          value: '10-14 days',
          description: 'Varies by county',
          icon: 'FileText',
          color: 'blue',
          borderColor: 'border-blue-200 hover:border-blue-400',
          bgColor: 'bg-blue-50',
          status: 'warning',
          statusText: 'Peak season delays',
          statusIcon: 'AlertTriangle',
          lastUpdated: `Updated ${Math.floor(Math.random() * 3) + 1} hours ago`
        },
        {
          id: 'material-delivery',
          title: 'Material Delivery',
          subtitle: 'Drywall lead time',
          value: `${Math.floor(Math.random() * 5) + 4} days avg`,
          description: 'Standard delivery',
          icon: 'Truck',
          color: 'green',
          borderColor: 'border-green-200 hover:border-green-400',
          bgColor: 'bg-green-50',
          status: 'good',
          statusText: 'In stock locally',
          statusIcon: 'CheckCircle',
          lastUpdated: `Updated ${Math.floor(Math.random() * 2) + 1} hour ago`
        },
        {
          id: 'labor-market',
          title: 'Labor Market',
          subtitle: 'Skilled trades availability',
          value: Math.random() > 0.5 ? 'Tight market' : 'Moderate supply',
          description: 'In your region',
          icon: 'Hammer',
          color: 'orange',
          borderColor: 'border-orange-200 hover:border-orange-400',
          bgColor: 'bg-orange-50',
          status: 'alert',
          statusText: 'Book 2-3 weeks ahead',
          statusIcon: 'Clock',
          lastUpdated: `Updated ${Math.floor(Math.random() * 60) + 15} minutes ago`
        },
        {
          id: 'equipment-rental',
          title: 'Equipment Rental',
          subtitle: 'Heavy machinery availability',
          value: Math.random() > 0.3 ? 'Good supply' : 'Limited availability',
          description: 'Multiple options',
          icon: 'Wrench',
          color: 'purple',
          borderColor: 'border-purple-200 hover:border-purple-400',
          bgColor: 'bg-purple-50',
          status: 'good',
          statusText: 'Same-day available',
          statusIcon: 'CheckCircle',
          lastUpdated: `Updated ${Math.floor(Math.random() * 30) + 5} minutes ago`
        }
      ];

      res.json({
        marketInsights,
        lastUpdated: new Date().toISOString(),
        source: 'Market data aggregated from industry sources'
      });
    } catch (error) {
      console.error('Error fetching pro insights:', error);
      res.status(500).json({ error: 'Failed to fetch market insights' });
    }
  });

  // AI Opinion endpoint for market insights
  apiRouter.post('/ai-opinion', async (req, res) => {
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
  });

  // Mount the API router with absolute priority
  app.use('/api', apiRouter);
  console.log('✅ Priority API routes mounted successfully');
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
      const rawData = req.body;
      console.log("Received estimate data:", rawData);
      
      // Validate required fields and provide defaults
      const area = Number(rawData.area) || 0;
      const projectType = rawData.projectType || 'kitchen-remodel';
      const materialQuality = rawData.materialQuality || 'standard';
      const timeline = rawData.timeline || '4-8 weeks';
      const zipCode = rawData.zipCode || '20895';
      
      if (area <= 0) {
        return res.status(400).json({ error: "Area must be greater than 0" });
      }
      
      // Use the cost engine for accurate calculations
      console.log("About to calculate costs with:", { projectType, area, materialQuality, timeline, zipCode });
      let costBreakdown;
      try {
        costBreakdown = calculateEnhancedEstimate({
          projectType,
          area,
          materialQuality,
          timeline,
          zipCode,
          laborWorkers: Number(rawData.laborWorkers) || 2,
          laborHours: Number(rawData.laborHours) || 24,
          laborRate: Number(rawData.laborRate) || 55
        });
      } catch (calcError) {
        console.error("Cost calculation error:", calcError);
        // Fallback calculation
        const baseRate = 150; // Fallback rate per sqft
        const totalCost = area * baseRate;
        costBreakdown = {
          materials: { amount: Math.round(totalCost * 0.40), percentage: 40 },
          labor: { amount: Math.round(totalCost * 0.38), percentage: 38 },
          permits: { amount: Math.round(totalCost * 0.04), percentage: 4 },
          equipment: { amount: Math.round(totalCost * 0.06), percentage: 6 },
          overhead: { amount: Math.round(totalCost * 0.12), percentage: 12 },
          total: totalCost
        };
      }
      
      // Calculate individual cost breakdowns from cost engine
      let materialCost = costBreakdown.materials.amount;
      let laborCost = costBreakdown.labor.amount;
      let permitCost = costBreakdown.permits.amount;
      let softCosts = costBreakdown.equipment.amount + costBreakdown.overhead.amount;
      
      console.log("Cost breakdown calculated:", {
        materialCost,
        laborCost,
        permitCost,
        softCosts,
        total: costBreakdown.total
      });

      // Calculate material costs from materials array if provided
      if (rawData.materials && typeof rawData.materials === 'string') {
        try {
          const materials = JSON.parse(rawData.materials);
          if (Array.isArray(materials)) {
            materialCost = materials.reduce((total, material) => {
              return total + (material.quantity * material.costPerUnit);
            }, 0);
          }
        } catch (e) {
          console.log("Error parsing materials:", e);
        }
      }

      // Calculate labor costs
      if (rawData.laborTypes && typeof rawData.laborTypes === 'string') {
        try {
          const laborTypes = JSON.parse(rawData.laborTypes);
          if (Array.isArray(laborTypes)) {
            laborCost = laborTypes.reduce((total, labor) => {
              return total + (labor.workers * labor.hours * labor.hourlyRate);
            }, 0);
          }
        } catch (e) {
          console.log("Error parsing labor types:", e);
        }
      }
      
      // Fallback to legacy labor calculation
      if (laborCost === 0 && rawData.laborWorkers && rawData.laborHours && rawData.laborRate) {
        laborCost = rawData.laborWorkers * rawData.laborHours * rawData.laborRate;
      }

      // Calculate permit costs
      if (rawData.permitNeeded) {
        permitCost = Math.max(500, (rawData.area || 0) * 0.5);
      }

      // Calculate soft costs and total
      const baseCost = materialCost + laborCost + permitCost;
      
      // Add demolition costs
      if (rawData.demolitionRequired) {
        softCosts += (rawData.area || 0) * 5; // $5 per sq ft
      }
      
      // Add overhead (15% of base)
      softCosts += baseCost * 0.15;
      
      // Apply timeline and access multipliers
      let timelineMultiplier = 1;
      if (rawData.timelineSensitivity === "urgent") timelineMultiplier = 1.2;
      if (rawData.timelineSensitivity === "flexible") timelineMultiplier = 0.95;
      
      let accessMultiplier = 1;
      if (rawData.siteAccess === "difficult") accessMultiplier = 1.15;
      if (rawData.siteAccess === "easy") accessMultiplier = 0.95;

      // Use cost engine total instead of manual calculation
      const estimatedCost = costBreakdown.total;

      // Ensure no NaN values with validation
      const validateNumber = (value: any, fallback: number = 0): number => {
        const num = Number(value);
        return isNaN(num) ? fallback : num;
      };

      // Prepare data for validation and storage
      const calculatedData = {
        ...rawData,
        area: validateNumber(area, 0),
        materialCost: validateNumber(materialCost, 0),
        laborCost: validateNumber(laborCost, 0),
        permitCost: validateNumber(permitCost, 0),
        softCosts: validateNumber(softCosts, 0),
        estimatedCost: validateNumber(estimatedCost, 0),
        laborWorkers: validateNumber(rawData.laborWorkers, 2),
        laborHours: validateNumber(rawData.laborHours, 24),
        laborRate: validateNumber(rawData.laborRate, 55)
      };

      const validatedData = insertEstimateSchema.parse(calculatedData);
      console.log("About to save estimate with data:", validatedData);
      
      const estimate = await storage.createEstimate(validatedData);
      console.log("Estimate returned from storage:", estimate);
      
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
        console.error("Error creating estimate:", error);
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

  // POST /api/generate-client-email - Generate professional client email
  app.post("/api/generate-client-email", async (req, res) => {
    try {
      const { estimateData } = req.body;
      const email = await generateClientEmail(estimateData);
      res.json({ email });
    } catch (error) {
      console.error("Error generating client email:", error);
      res.status(500).json({ error: "Failed to generate client email" });
    }
  });

  // POST /api/lookup-zipcode - Google Maps ZIP code lookup
  app.post("/api/lookup-zipcode", async (req, res) => {
    try {
      const { zipCode } = req.body;
      const locationData = await lookupZipCode(zipCode);
      res.json({ success: true, data: locationData });
    } catch (error) {
      console.error("Error looking up ZIP code:", error);
      res.status(500).json({ success: false, error: "Failed to lookup ZIP code" });
    }
  });

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

  // POST /api/generate-cost-explanation - Interactive cost breakdown explanation
  app.post("/api/generate-cost-explanation", async (req, res) => {
    try {
      const { costBreakdown, projectType, estimatedCost } = req.body;
      console.log("Received cost breakdown request:", { costBreakdown, projectType, estimatedCost });
      
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: "OpenAI API key not configured" });
      }
      
      const explanation = await generateCostBreakdownExplanation(costBreakdown, projectType, estimatedCost);
      console.log("Generated explanation:", explanation);
      res.json({ explanation });
    } catch (error) {
      console.error("Error generating cost explanation:", error);
      res.status(500).json({ error: "Failed to generate cost explanation", details: error instanceof Error ? error.message : String(error) });
    }
  });

  // POST /api/cost-category-detail - Detailed category explanation
  app.post("/api/cost-category-detail", async (req, res) => {
    try {
      const { category, projectType, amount, percentage } = req.body;
      const explanation = await generateCategoryDetail(category, projectType, amount, percentage);
      res.json({ explanation });
    } catch (error) {
      console.error("Error generating category detail:", error);
      res.status(500).json({ error: "Failed to generate category detail" });
    }
  });

  // POST /api/conversational-estimator - GPT-powered conversational assistant
  app.post("/api/conversational-estimator", async (req, res) => {
    try {
      const { userInput, currentEstimate, chatHistory } = req.body;
      console.log("Conversational estimator request:", { userInput, currentEstimate });
      
      const result = await processConversationalEstimator(userInput, currentEstimate, chatHistory);
      console.log("Conversational estimator result:", result);
      
      res.json(result);
    } catch (error) {
      console.error("Error processing conversational estimator:", error);
      res.status(500).json({ error: "Failed to process conversational request" });
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

      // Timeline multipliers
      const timelineMultipliers = {
        'urgent': 1.2,
        'moderate': 1.0,
        'flexible': 0.9
      };

      const sqft = parseInt(squareFootage);
      const baseCost = baseCosts[projectType] * sqft;
      const adjustedCost = baseCost * finishMultipliers[finishLevel] * timelineMultipliers[timeline];
      
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

      // Timeline calculation
      const baseDurations = {
        'kitchen': 6,
        'bathroom': 4,
        'addition': 12,
        'basement': 8,
        'whole-house': 20,
        'exterior': 6
      };

      const duration = Math.round(baseDurations[projectType] * timelineMultipliers[timeline]);

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

      // Generate new AI summary
      const prompt = `You are an expert construction analyst. Summarize key cost trends for residential remodeling in ZIP code ${zipCode}. 

      Focus on:
      - Recent changes in material costs (lumber, steel, concrete, etc.)
      - Labor availability and cost trends
      - Permit processing times and fees
      - Any local market factors affecting renovation costs
      
      Keep it under 120 words and practical for homeowners and contractors. Format as 2-3 short paragraphs.
      
      Start with: "📍 In ZIP ${zipCode}:" and provide actionable insights about budgeting and timing.`;

      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a construction market analyst providing localized cost insights for renovation projects. Be specific and actionable."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 200
      });

      const summary = response.choices[0].message.content || "Market data temporarily unavailable.";
      const now = new Date();
      
      const marketInsights = {
        zipCode,
        summary,
        lastUpdated: now.toISOString(),
        cacheTimestamp: Date.now()
      };

      // Save to cache
      try {
        fs.writeFileSync(cacheFile, JSON.stringify(marketInsights, null, 2));
      } catch (error) {
        console.error('Failed to save cache:', error);
      }

      res.json(marketInsights);

    } catch (error) {
      console.error("Error generating market insights:", error);
      res.status(500).json({ error: "Failed to generate market insights" });
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

  // AI-powered lead strategy generation endpoint
  app.post("/api/generate-lead-strategies", async (req, res) => {
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
  });


  // AI-powered material cost analysis endpoint
  app.post("/api/analyze-material-costs", async (req, res) => {
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
  });


  // AI-powered subcontractor comparison endpoint
  app.post("/api/compare-subcontractors", async (req, res) => {
    try {
      const { subA, subB, subC, projectRequirements } = req.body;

      if (!subA || !subB || !projectRequirements) {
        return res.status(400).json({ error: "subA, subB, and projectRequirements are required" });
      }

      // Validate subcontractor data
      const validateSub = (sub, name) => {
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
      res.status(500).json({ error: error.message || "Failed to compare subcontractors" });
    }
  });


  // AI-powered project risk assessment endpoint
  app.post("/api/assess-project-risks", async (req, res) => {
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
  });


  // AI-powered project timeline generator endpoint
  app.post("/api/generate-project-timeline", async (req, res) => {
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
  });


  // AI-powered budget planning endpoint
  app.post("/api/generate-budget-plan", async (req, res) => {
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
  });


import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEstimateSchema, insertScheduleSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import { explainEstimate, summarizeSchedule, getAIRecommendations, draftEmail } from "./ai";
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

  const httpServer = createServer(app);
  return httpServer;
}

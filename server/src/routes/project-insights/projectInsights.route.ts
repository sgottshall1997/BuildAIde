import express from 'express';
import * as ProjectInsights from "@server/controllers/project-insights/projectInsights.controller";

const projectInsightsRoute = express.Router();

projectInsightsRoute.get("/schedules", ProjectInsights.getAllSchedules);
projectInsightsRoute.post("/schedules", ProjectInsights.createScheduleHandler);
projectInsightsRoute.get("/stats", ProjectInsights.getStats);
projectInsightsRoute.post("/explain-estimate", ProjectInsights.explainEstimateHandler);
projectInsightsRoute.get("/summarize-schedule", ProjectInsights.summarizeScheduleHandler);
projectInsightsRoute.get("/ai-recommendations", ProjectInsights.getAIRecommendationsHandler);
projectInsightsRoute.post("/draft-email", ProjectInsights.draftEmailHandler);
projectInsightsRoute.post("/ai-risk-assessment", ProjectInsights.riskAssessmentHandler);
projectInsightsRoute.post("/smart-suggestions", ProjectInsights.smartSuggestionHandler);
projectInsightsRoute.post('/calculate-scenario', ProjectInsights.calculateScenarioHandler)

export { projectInsightsRoute };

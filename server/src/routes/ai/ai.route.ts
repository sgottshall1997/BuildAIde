import express from "express";
import {
    preEstimateSummaryHandler,
    riskRatingHandler,
    pastProjectInsightHandler,
    generateClientEmailHandler,
    generateCostExplanationHandler,
    conversationalEstimatorHandler,
    hiddenCostInsightsHandler,
    categoryDetailHandler,
    spencebotChatHandler,
    visualPreviewHandler,
    personalizedMessageHandler,
    generateLeadStrategiesHandler,
    compareSubcontractorsHandler,
    analyzeMaterialCostsHandler,
    assessProjectRisksHandler,
    generateProjectTimelineHandler,
    generateBudgetPlanHandler,
    marketInsightsHandler,
    analyzePropertyUrlHandler,
    aiAssistantHandler,

    materialSearchHandler,
    materialAdviceHandler,
    optimizeScheduleHandler,
    improveBidTextHandler,
    findBestContractorHandler,
    permitApplicationGuidanceHandler,
    permitSkipConsequencesHandler,
    generateContractorEmailHandler,
    generateBidHandler

} from "@server/controllers/ai/ai.controller";

const AiRoute = express.Router();

AiRoute.post("/pre-estimate-summary", preEstimateSummaryHandler);
AiRoute.post("/risk-rating", riskRatingHandler);
AiRoute.post("/past-project-insight", pastProjectInsightHandler);
AiRoute.post("/generate-client-email", generateClientEmailHandler);
AiRoute.post("/generate-cost-explanation", generateCostExplanationHandler);
AiRoute.post("/cost-category-detail", categoryDetailHandler);
AiRoute.post("/conversational-estimator", conversationalEstimatorHandler);
AiRoute.post("/spencebot-chat", spencebotChatHandler);
AiRoute.post("/generate-visual-preview", visualPreviewHandler);
AiRoute.post("/hidden-cost-insights", hiddenCostInsightsHandler);
AiRoute.post("/generate-personalized-message", personalizedMessageHandler);
AiRoute.post('/generate-lead-strategies', generateLeadStrategiesHandler);
AiRoute.post('/compare-subcontractors', compareSubcontractorsHandler);
AiRoute.post('/analyze-material-costs', analyzeMaterialCostsHandler);
AiRoute.post('/assess-project-risks', assessProjectRisksHandler);
AiRoute.post('/generate-project-timeline', generateProjectTimelineHandler);
AiRoute.post('/generate-budget-plan', generateBudgetPlanHandler);
AiRoute.post('/market-insights', marketInsightsHandler);
AiRoute.post('/analyze-property-url', analyzePropertyUrlHandler);
AiRoute.post('/ai-assistant', aiAssistantHandler);

AiRoute.post('/material-search', materialSearchHandler);
AiRoute.post('/material-ai-advice', materialAdviceHandler);
AiRoute.post('/optimize-schedule', optimizeScheduleHandler);
AiRoute.post('/improve-bid-text', improveBidTextHandler);
AiRoute.post('/find-best-contractor', findBestContractorHandler);
AiRoute.post('/permit-application-guidance', permitApplicationGuidanceHandler);
AiRoute.post('/permit-skip-consequences', permitSkipConsequencesHandler);
AiRoute.post('/generate-contractor-email', generateContractorEmailHandler);
AiRoute.post('/generate-bid',generateBidHandler);

export { AiRoute };

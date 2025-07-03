import { Router } from 'express';
import { AIOpinionHandler, aiRenovationChatHandler, analyzeQuotesHandler, consumerEstimateExplainationHandler, exprertHomeOwnerChatHandler, homeOwnerChatHandler, proInsightsHandler, renovationAssistantHandler, renovationRecommendationsHandler } from '@server/controllers/ai-renovation/AiRenovation.controller';

const renovationRoute = Router();


renovationRoute.post('/renovation-recommendations', renovationRecommendationsHandler);
renovationRoute.post('/expert-homeowner-consult', exprertHomeOwnerChatHandler)
renovationRoute.post('/homeowner-chat', homeOwnerChatHandler);
renovationRoute.get('/pro-insights', proInsightsHandler);
renovationRoute.post('/ai-opinion', AIOpinionHandler);
renovationRoute.post('/consumer-estimate-explanation', consumerEstimateExplainationHandler);
renovationRoute.post('/analyze-quotes', analyzeQuotesHandler);
renovationRoute.post('/renovation-assistant', renovationAssistantHandler);
renovationRoute.post('/ai-renovation-chat', aiRenovationChatHandler);

export { renovationRoute };
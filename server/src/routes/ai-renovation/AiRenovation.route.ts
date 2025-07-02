import express from 'express';
import { AIOpinionHandler, homeOwnerChatHandler, proInsightsHandler, renovationRecommendationsHandler } from '@server/controllers/ai-renovation/AiRenovation.controller';

const renovationRoute = express.Router();


renovationRoute.post('/renovation-recommendations', renovationRecommendationsHandler);
renovationRoute.post('/homeowner-chat', homeOwnerChatHandler);
renovationRoute.get('/pro-insights', proInsightsHandler);
renovationRoute.post('/ai-opinion', AIOpinionHandler);

export { renovationRoute };
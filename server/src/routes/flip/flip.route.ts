import { Router } from 'express';
import {
    getFlipOpinionHandler,
    submitFlipFeedbackHandler,
    getFlipFeedbackAnalyticsHandler,
    getFlipProjectsHandler,
    addFlipProjectHandler,
    analyzeFlipProjectHandler,
    generateFlipScoreHandler
} from '../../controllers/flip/flip.controller';

const flipRoutes = Router();

flipRoutes.post('/ai-flip-opinion', getFlipOpinionHandler);
flipRoutes.post('/ai-flip-feedback', submitFlipFeedbackHandler);
flipRoutes.get('/ai-flip-feedback', getFlipFeedbackAnalyticsHandler);
flipRoutes.get('/flip-projects', getFlipProjectsHandler);
flipRoutes.post('/flip-projects', addFlipProjectHandler);
flipRoutes.post('/analyze-flip-project', analyzeFlipProjectHandler);
flipRoutes.post('/generate-flip-score',generateFlipScoreHandler)

export { flipRoutes };

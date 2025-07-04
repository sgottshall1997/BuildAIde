import { getFeedbackStatsHandler, submitFeedbackHandler } from '@server/controllers/feedback/feedback.controller';
import express from 'express';

const feedbackRoute = express.Router();

feedbackRoute.post('/feedback', submitFeedbackHandler);
feedbackRoute.get('/feedback-stats', getFeedbackStatsHandler);

export { feedbackRoute };
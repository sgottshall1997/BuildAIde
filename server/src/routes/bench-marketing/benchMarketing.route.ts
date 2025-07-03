import { analyzeEstimateHandler, getBenchMarketingCostsHandler } from '@server/controllers/bench-marketing/benchMarketing.controller';
import express from 'express';

const benchMarketingRoute = express.Router();

benchMarketingRoute.post('/get-benchmark-costs', getBenchMarketingCostsHandler);
benchMarketingRoute.post('/analyze-estimate',analyzeEstimateHandler);

export { benchMarketingRoute };
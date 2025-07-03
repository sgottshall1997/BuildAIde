import { analyzeContractorQuotesHandler, budgetExplainationHandler, budgetForcasterHandler, compareContractorQuotesHandler, smartEstimateHandler } from '@server/controllers/contractor/contractor.controller';
import express from 'express';

const contractorRoute = express.Router();

contractorRoute.post('/compare-contractor-quotes', compareContractorQuotesHandler);
contractorRoute.post('/analyze-contractor-quotes', analyzeContractorQuotesHandler);
contractorRoute.post('/budget-explanation', budgetExplainationHandler);
contractorRoute.post('/budget-forecast', budgetForcasterHandler)
contractorRoute.post('/smart-estimate', smartEstimateHandler);

export { contractorRoute };
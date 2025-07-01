import express from 'express';
import { getPropertyAnalysisHandler, propertySearchHandler } from '@server/controllers/property/property.controller';

const propertyRoutes = express.Router();

propertyRoutes.post('/search-properties', propertySearchHandler);
propertyRoutes.post('/property-analysis', getPropertyAnalysisHandler);

export { propertyRoutes };
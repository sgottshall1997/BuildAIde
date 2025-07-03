import express from 'express';
import { analyzeListingHandler, analyzePermitHandler, fetchLocalListingsHandler, getPropertyAnalysisHandler, permitLookupHandler, propertySearchHandler, realEstateListingsHandler, roiAnalysisHandler, roiImprovementHandler } from '@server/controllers/property/property.controller';

const propertyRoutes = express.Router();

propertyRoutes.post('/search-properties', propertySearchHandler);
propertyRoutes.post('/property-analysis', getPropertyAnalysisHandler);
propertyRoutes.post('/real-estate-listings', realEstateListingsHandler);
propertyRoutes.post('/analyze-listing', analyzeListingHandler);
propertyRoutes.post('/roi-analysis', roiAnalysisHandler);
propertyRoutes.post('/permit-lookup', permitLookupHandler);
propertyRoutes.post('/analyze-permit', analyzePermitHandler);
propertyRoutes.post('/fetch-local-listings', fetchLocalListingsHandler);
propertyRoutes.post('/roi-improvements',roiImprovementHandler)

export { propertyRoutes };
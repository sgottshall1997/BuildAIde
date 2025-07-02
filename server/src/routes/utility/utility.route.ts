import { lookupZipCodeHandler } from '@server/controllers/utility/utility.controller';
import express from 'express';

const utilityRoutes = express.Router();

utilityRoutes.post('/lookup-zipcode', lookupZipCodeHandler);
export { utilityRoutes };
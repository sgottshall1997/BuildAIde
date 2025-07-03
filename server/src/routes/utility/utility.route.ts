import { emailCheckListHandler, lookupZipCodeHandler, sendNotificationEmailHandler } from '@server/controllers/utility/utility.controller';
import express from 'express';

const utilityRoutes = express.Router();

utilityRoutes.post('/lookup-zipcode', lookupZipCodeHandler);
utilityRoutes.post('/send-notification-email', sendNotificationEmailHandler);
utilityRoutes.post('/email-checklist', emailCheckListHandler)
export { utilityRoutes };
import { advanceEstimateHandler, baseEstimateHandler, enhanceEstimateHandler, getAllEstimatesHandler } from "@server/controllers/cost-engine/costEngine.controller";
import { upload } from "@server/middlewares/multer/multer.middleware";
import express from "express";

const costEngineRoute = express.Router();

costEngineRoute.post(
    '/estimate/basic',
    upload.single('blueprintFile'),
    baseEstimateHandler
);

costEngineRoute.post(
    '/estimates',
    upload.single('blueprintFile'),
    advanceEstimateHandler
);

costEngineRoute.get('/estimates', getAllEstimatesHandler);
costEngineRoute.post('/enhanced-estimate', enhanceEstimateHandler)




export { costEngineRoute };

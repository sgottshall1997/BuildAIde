import { demoStatusHandler, testJsonHandler, testJsonHandler2, testOpenAIHandler, testOpenAIHandler2 } from '@server/controllers/test/test.controller';
import express from 'express';

const testRoute = express.Router();

testRoute.post('/test-json', testJsonHandler);
testRoute.post('/test-json/2', testJsonHandler2);
testRoute.post('/test-openai', testOpenAIHandler);
testRoute.post('/test-openai/2', testOpenAIHandler2);
testRoute.post('/demo-status', demoStatusHandler);

export { testRoute }
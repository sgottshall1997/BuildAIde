import express from 'express';
import { propertyRoutes } from "./property/property.route";
import { projectsRoute } from './projects/projects.route';
import { renovationRoute } from './ai-renovation/AiRenovation.route';
import { costEngineRoute } from './cost-engine/costEngine.route';
import { projectInsightsRoute } from './project-insights/projectInsights.route';
import { AiRoute } from './ai/ai.route';
import { expenseRoutes } from './expense/expense.route';
import { utilityRoutes } from './utility/utility.route';

const router = express.Router();

const defaultRouter = [
    {
        path: '/',
        route: propertyRoutes
    }, {
        path: '/',
        route: projectsRoute
    }, {
        path: '/',
        route: renovationRoute
    }, {
        path: '/',
        route: costEngineRoute
    }, {
        path: '/',
        route: projectInsightsRoute
    },
    {
        path: '/',
        route: AiRoute
    }, {
        path: '/',
        route: expenseRoutes
    }, {
        path: '/',
        route: utilityRoutes
    }
];


defaultRouter.forEach(({ path, route }) => {
    router.use(path, route);
});

export { router };
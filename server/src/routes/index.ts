import express from 'express';
import { propertyRoutes } from "./property/property.route";
import { projectsRoute } from './projects/projects.route';
import { renovationRoute } from './ai-renovation/AiRenovation.route';
import { costEngineRoute } from './cost-engine/costEngine.route';
import { projectInsightsRoute } from './project-insights/projectInsights.route';
import { AiRoute } from './ai/ai.route';
import { expenseRoutes } from './expense/expense.route';
import { utilityRoutes } from './utility/utility.route';
import { benchMarketingRoute } from './bench-marketing/benchMarketing.route';
import { flipRoutes } from './flip/flip.route';
import { scheduleRoutes } from './schedule/schedule.route';
import { portfolioRoute } from './portfolio/portfolio.route';
import { contractorRoute } from './contractor/contractor.route';
import { feedbackRoute } from './feedback/feedback.route';
import materialRoutes from './material/material.route';
import { testRoute } from './test/test.route';

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
    }, {
        path: '/',
        route: benchMarketingRoute
    }, {
        path: '/',
        route: flipRoutes
    }, {
        path: '/schedule',
        route: scheduleRoutes
    }, {
        path: '/',
        route: portfolioRoute
    }, {
        path: '/',
        route: contractorRoute
    }, {
        path: '/',
        route: feedbackRoute
    }, {
        path: '/',
        route: materialRoutes
    }, {
        path: '/',
        route: testRoute
    }
];


defaultRouter.forEach(({ path, route }) => {
    router.use(path, route);
});
export { router };
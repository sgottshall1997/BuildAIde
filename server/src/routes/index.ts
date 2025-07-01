import express from 'express';
import { propertyRoutes } from "./property/property.route";
import { projectsRoute } from './projects/projects.route';

const router = express.Router();

const defaultRouter = [
    {
        path: '/',
        route: propertyRoutes
    }, {
        path: '/',
        route: projectsRoute
    }
];


defaultRouter.forEach(({ path, route }) => {
    router.use(path, route);
});

export { router };
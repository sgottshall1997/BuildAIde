import { getPastProjectHandler } from '@server/controllers/projects/projects.controller';
import express from 'express';

const projectsRoute = express.Router();

projectsRoute.post('/similar-past-projects', getPastProjectHandler);

export { projectsRoute };
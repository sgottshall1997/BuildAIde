import { Router } from 'express';
import {
    getAllScheduledProjects,
    addNewScheduledProject,
    updateScheduledProjectStatus,
    deleteScheduledProject
} from "../../controllers/schedule/schedule.controller";

const scheduleRoutes = Router();

scheduleRoutes.get('/', getAllScheduledProjects);
scheduleRoutes.post('/', addNewScheduledProject);
scheduleRoutes.patch('/:id', updateScheduledProjectStatus);
scheduleRoutes.delete('/:id', deleteScheduledProject);

export { scheduleRoutes };

import { mockScheduledProjects } from '@server/constants/mock-data';
import { Request, Response } from 'express';

/**
 * GET /api/schedule
 * Get all scheduled projects
 */
export const getAllScheduledProjects = async (req: Request, res: Response) => {
    try {
        res.json(mockScheduledProjects);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch scheduled projects' });
    }
};

/**
 * POST /api/schedule
 * Add a new scheduled project
 */
export const addNewScheduledProject = async (req: Request, res: Response) => {
    try {
        const projectData = req.body;
        const newProject = {
            id: Date.now().toString(),
            ...projectData,
            createdAt: new Date().toISOString()
        };

        mockScheduledProjects.push(newProject);

        // Optional AI-generated project summary (can integrate GPT here)
        const summary = `Project '${newProject.projectName}' is scheduled to run for ${newProject.estimatedDuration} days with ${newProject.crewMembers} crew members. Estimated ROI is ${newProject.profitMargin}%.`;
        console.log('Project Summary:', summary);

        res.json(newProject);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add project' });
    }
};

/**
 * PATCH /api/schedule/:id
 * Update project status
 */
export const updateScheduledProjectStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const projectIndex = mockScheduledProjects.findIndex(p => p.id === id);
        if (projectIndex === -1) {
            return res.status(404).json({ error: 'Project not found' });
        }

        mockScheduledProjects[projectIndex] = {
            ...(mockScheduledProjects[projectIndex] as any),
            status,
            updatedAt: new Date().toISOString()
        };

        res.json(mockScheduledProjects[projectIndex]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update project' });
    }
};

/**
 * DELETE /api/schedule/:id
 * Delete a scheduled project
 */
export const deleteScheduledProject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const projectIndex = mockScheduledProjects.findIndex(p => p.id === id);

        if (projectIndex === -1) {
            return res.status(404).json({ error: 'Project not found' });
        }

        mockScheduledProjects.splice(projectIndex, 1);
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete project' });
    }
};

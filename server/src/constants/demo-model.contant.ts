// Demo Mode Utilities for ConstructionSmartTools
// Centralized demo mode logic for easy maintenance

/**
 * Check if demo mode is enabled
 */
export function isDemoModeEnabled(): boolean {
    return process.env.DEMO_MODE === 'true';
}

/**
 * Demo mode middleware to prevent database writes
 */
export function demoModeMiddleware(req: any, res: any, next: any) {
    if (isDemoModeEnabled() && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        // For demo mode, simulate success without actual database operations
        console.log(`[DEMO MODE] Blocked ${req.method} ${req.path} - returning mock success`);

        // Return appropriate mock responses based on the endpoint
        if (req.path.includes('/api/estimates')) {
            return res.json({
                id: 'demo-estimate-' + Date.now(),
                success: true,
                message: 'Estimate created successfully (Demo Mode)'
            });
        }

        if (req.path.includes('/api/schedules')) {
            return res.json({
                id: 'demo-schedule-' + Date.now(),
                success: true,
                message: 'Schedule created successfully (Demo Mode)'
            });
        }

        // Default mock success response
        return res.json({
            success: true,
            message: 'Operation completed successfully (Demo Mode)',
            demo: true
        });
    }

    next();
}

/**
 * Generate mock project data for demo mode
 */
export function getMockProjectData() {
    return {
        id: 'demo-project-1',
        name: 'Kitchen Renovation Demo',
        address: '123 Demo Street, Kensington, MD 20895',
        projectType: 'kitchen',
        squareFootage: 350,
        materialQuality: 'mid-range',
        timeline: 'moderate',
        status: 'in-progress',
        estimatedCost: 45000,
        startDate: new Date().toISOString().split('T')[0],
        estimatedDuration: 21,
        crewMembers: 3,
        notes: 'This is a demo project showcasing the ConstructionSmartTools platform.',
        createdAt: new Date().toISOString()
    };
}

/**
 * Generate mock estimate data for demo mode
 */
export function getMockEstimateData() {
    return {
        id: 'demo-estimate-1',
        projectName: 'Kitchen Renovation Demo',
        clientName: 'Demo Client',
        projectAddress: '123 Demo Street, Kensington, MD 20895',
        projectType: 'kitchen',
        squareFootage: 350,
        materialQuality: 'mid-range',
        timeline: 'moderate',
        laborWorkers: 3,
        laborHours: 168,
        laborRate: 45,
        materialCosts: 18000,
        laborCosts: 15120,
        permitCosts: 1200,
        equipmentCosts: 2800,
        overheadCosts: 4500,
        totalCost: 45000,
        notes: 'Demo estimate with realistic pricing for a mid-range kitchen renovation.',
        createdAt: new Date().toISOString()
    };
}

/**
 * Generate mock schedule data for demo mode
 */
export function getMockScheduleData() {
    const baseDate = new Date();
    const schedules = [];

    // Generate a few upcoming inspections
    for (let i = 1; i <= 3; i++) {
        const inspectionDate = new Date(baseDate);
        inspectionDate.setDate(baseDate.getDate() + i * 3);

        schedules.push({
            id: `demo-schedule-${i}`,
            projectName: `Demo Project ${i}`,
            inspectionType: ['Electrical', 'Plumbing', 'Final'][i - 1],
            preferredDate: inspectionDate.toISOString().split('T')[0],
            preferredTime: ['09:00', '14:00', '11:00'][i - 1],
            priority: ['high', 'medium', 'low'][i - 1],
            notes: `Demo inspection ${i} - showcasing scheduling features`,
            status: 'scheduled',
            createdAt: new Date().toISOString()
        });
    }

    return schedules;
}

/**
 * Generate mock task list for demo mode
 */
export function getMockTaskList() {
    return [
        {
            id: 'demo-task-1',
            title: 'Review Kitchen Layout Plans',
            description: 'Finalize cabinet placement and electrical outlet locations',
            priority: 'high',
            status: 'pending',
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            assignedTo: 'Demo Team Lead'
        },
        {
            id: 'demo-task-2',
            title: 'Schedule Electrical Inspection',
            description: 'Coordinate with Montgomery County for electrical rough-in inspection',
            priority: 'medium',
            status: 'completed',
            dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            assignedTo: 'Project Manager'
        },
        {
            id: 'demo-task-3',
            title: 'Order Countertop Materials',
            description: 'Confirm measurements and place order for quartz countertops',
            priority: 'medium',
            status: 'in-progress',
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            assignedTo: 'Materials Coordinator'
        }
    ];
}

/**
 * Wrap data response with demo mode indicator
 */
export function wrapDemoResponse(data: any, message?: string) {
    if (isDemoModeEnabled()) {
        return {
            ...data,
            demo: true,
            demoMessage: message || 'This data is simulated for demonstration purposes'
        };
    }
    return data;
}
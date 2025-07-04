export interface CostParameters {
    projectType: string;
    area: number;
    materialQuality: string;
    timeline: string;
    zipCode?: string;
    laborWorkers?: number;
    laborHours?: number;
    laborRate?: number;
    equipmentCost?: number;
    overheadCost?: number;
}


export interface CostBreakdown {
    materials: { amount: number; percentage: number };
    labor: { amount: number; percentage: number };
    permits: { amount: number; percentage: number };
    equipment: { amount: number; percentage: number };
    overhead: { amount: number; percentage: number };
    total: number;
}

export interface PastProject {
    id: number;
    address: string;
    zipCode: string;
    projectType: string;
    squareFootage: number;
    finishLevel: string;
    year: number;
    finalCost: number;
    notes: string;
}


export interface SimilarProjectsResponse {
    similarProjects: PastProject[];
    averageCostPerSqFt: number;
    comparison: string;
}
import fs from 'fs';
import path from 'path';
import {
    PastProject,
    SimilarProjectsResponse
} from '@server/interfaces/projects/projects.interface';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadPastProjects(): PastProject[] {
    try {
        const filePath = path.join(__dirname, '../../json/pastProjects.json');
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading past projects:', error);
        return [];
    }
}

function calculateSimilarityScore(project: PastProject, criteria: {
    projectType: string;
    zipCode?: string;
    squareFootage: number;
    materialQuality: string;
}): number {
    let score = 0;

    // Project type match (40% weight)
    if (project?.projectType && criteria?.projectType && project.projectType.toLowerCase() === criteria.projectType.toLowerCase()) {
        score += 40;
    }

    // Zip code match (20% weight)
    if (criteria.zipCode && project.zipCode === criteria.zipCode) {
        score += 20;
    }

    // Square footage similarity (30% weight)
    const sizeDiff = Math.abs(project.squareFootage - criteria.squareFootage);
    const sizeScore = Math.max(0, 30 - (sizeDiff / criteria.squareFootage) * 30);
    score += sizeScore;

    // Finish level match (10% weight)
    const finishLevelMap: Record<string, string> = {
        'budget': 'standard',
        'standard': 'standard',
        'premium': 'premium',
        'luxury': 'luxury'
    };

    const mappedQuality = finishLevelMap[criteria?.materialQuality && criteria.materialQuality.toLowerCase()] || 'standard';
    if (project?.finishLevel && mappedQuality && project?.finishLevel.toLowerCase() === mappedQuality.toLowerCase()) {
        score += 10;
    }

    return score;
}

export async function findSimilarPastProjects(criteria: {
    projectType: string;
    zipCode?: string;
    squareFootage: number;
    materialQuality: string;
    estimatedCost: number;
}): Promise<SimilarProjectsResponse> {
    const pastProjects = loadPastProjects();

    // Calculate similarity scores and sort
    const scoredProjects = pastProjects
        .map(project => ({
            project,
            score: calculateSimilarityScore(project, criteria)
        }))
        .filter(item => item.score > 30) // Only include reasonably similar projects
        .sort((a, b) => b.score - a.score)
        .slice(0, 3); // Top 3 most similar

    const similarProjects = scoredProjects.map(item => item.project);

    // Calculate average cost per sq ft
    const averageCostPerSqFt = similarProjects.length > 0
        ? similarProjects.reduce((sum, project) => sum + (project.finalCost / project.squareFootage), 0) / similarProjects.length
        : 0;

    // Generate comparison summary
    const comparison = generateComparison(criteria, similarProjects, averageCostPerSqFt);

    return {
        similarProjects,
        averageCostPerSqFt: Math.round(averageCostPerSqFt),
        comparison
    };
}

function generateComparison(criteria: any, similarProjects: PastProject[], avgCostPerSqFt: number): string {
    if (similarProjects.length === 0) {
        return "No similar past projects found for comparison.";
    }

    const currentCostPerSqFt = criteria.estimatedCost / criteria.squareFootage;
    const difference = ((currentCostPerSqFt - avgCostPerSqFt) / avgCostPerSqFt) * 100;

    let comparison = `Based on ${similarProjects.length} similar past project${similarProjects.length > 1 ? 's' : ''}, `;

    if (Math.abs(difference) < 10) {
        comparison += "this estimate aligns well with your historical project costs.";
    } else if (difference > 10) {
        comparison += `this estimate is ${Math.round(difference)}% higher than your typical costs for similar projects.`;
    } else {
        comparison += `this estimate is ${Math.round(Math.abs(difference))}% lower than your typical costs for similar projects.`;
    }

    // Add specific project reference if available
    if (similarProjects.length > 0) {
        const mostSimilar = similarProjects[0];
        comparison += ` Most similar to your ${mostSimilar.year} project on ${mostSimilar.address}.`;
    }

    return comparison;
}
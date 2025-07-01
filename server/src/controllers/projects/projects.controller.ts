import { Response, Request } from "express";
import { findSimilarPastProjects } from "@server/services/projects/projects.service";

export const getPastProjectHandler = async (req: Request, res: Response) => {
    try {
        const { projectType, zipCode, squareFootage, materialQuality, estimatedCost } = req.body;

        const result = await findSimilarPastProjects({
            projectType,
            zipCode,
            squareFootage,
            materialQuality,
            estimatedCost
        });

        res.json(result);
    } catch (error) {
        console.error("Error finding similar past projects:", error);
        res.status(500).json({ error: "Failed to find similar past projects" });
    }
}
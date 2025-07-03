import { Request, Response } from "express";

export const submitFeedbackHandler = async (req: Request, res: Response) => {
    try {
        const { rating, comment, usage, timestamp, userAgent, url } = req.body;

        const feedbackEntry = {
            id: Date.now().toString(),
            rating,
            comment: comment || '',
            usage: usage || '',
            timestamp,
            userAgent,
            url,
            createdAt: new Date().toISOString()
        };

        // In a real app, you'd save to database
        // For now, we'll just log and return success
        console.log('Feedback received:', feedbackEntry);

        res.json({
            success: true,
            message: "Feedback submitted successfully",
            id: feedbackEntry.id
        });
    } catch (error) {
        console.error("Error saving feedback:", error);
        res.status(500).json({ error: "Failed to submit feedback" });
    }
}


export const getFeedbackStatsHandler = async (req: Request, res: Response) => {
    try {
        // Mock stats for now - in real app would query database
        const stats = {
            averageRating: 4.2,
            totalFeedback: 87,
            ratingDistribution: {
                5: 45,
                4: 28,
                3: 10,
                2: 3,
                1: 1
            }
        };

        res.json(stats);
    } catch (error) {
        console.error("Error fetching feedback stats:", error);
        res.status(500).json({ error: "Failed to fetch feedback stats" });
    }
}
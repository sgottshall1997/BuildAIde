import { lookupZipCode, sendNotificationEmail } from "@server/services/shared/shared.service";
import { Request, Response } from "express";

export const lookupZipCodeHandler = async (req: Request, res: Response) => {
    try {
        const { zipCode } = req.body;
        const locationData = await lookupZipCode(zipCode);
        res.json({ success: true, data: locationData });
    } catch (error) {
        console.error("Error looking up ZIP code:", error);
        res.status(500).json({ success: false, error: "Failed to lookup ZIP code" });
    }
}


export const sendNotificationEmailHandler = async (req: Request, res: Response) => {
    try {
        const { to, subject, message, type } = req.body;
        const result = await sendNotificationEmail(to, subject, message, type);
        res.json({ success: true, result });
    } catch (error) {
        console.error("Error sending notification email:", error);
        res.status(500).json({ success: false, error: "Failed to send email notification" });
    }
}


export const emailCheckListHandler = async (req: Request, res: Response) => {
    try {
        const { email, projectType, checklist, userLocation } = req.body;

        if (!email) {
            return res.status(400).json({ error: "Email address required" });
        }

        // In a real app, you'd use an email service like SendGrid, Mailgun, etc.
        // For now, we'll just log and return success
        console.log('Email checklist request:', {
            to: email,
            projectType,
            location: userLocation,
            itemCount: checklist.length
        });

        // Simulate email sending
        res.json({
            success: true,
            message: "Checklist sent successfully",
            emailSent: true
        });
    } catch (error) {
        console.error("Error sending checklist email:", error);
        res.status(500).json({ error: "Failed to send checklist email" });
    }
}
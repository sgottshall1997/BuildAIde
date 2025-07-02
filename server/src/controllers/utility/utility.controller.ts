import { lookupZipCode } from "@server/services/shared/shared.service";
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
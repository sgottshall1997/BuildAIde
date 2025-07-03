import express from "express";
import {
  getMaterialPrices,
  getMaterialPricesFallback,
  getLegacyMaterialPrices,
  getMaterialInsights,
} from "../../controllers/material/material.controller";

const materialRoutes = express.Router();

materialRoutes.get("/material-prices", getMaterialPrices);
materialRoutes.get("/material-prices-fallback", getMaterialPricesFallback); // optional backup
materialRoutes.get("/material-prices-legacy", getLegacyMaterialPrices);
materialRoutes.get("/material-insights", getMaterialInsights);

export default materialRoutes;

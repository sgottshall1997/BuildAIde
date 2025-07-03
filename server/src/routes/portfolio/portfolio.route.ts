import { exportPortfolioHandler } from '@server/controllers/portfolio/portfolio.controller';
import express from 'express';

const portfolioRoute = express.Router();

portfolioRoute.post('/export-portfolio', exportPortfolioHandler);


export { portfolioRoute };
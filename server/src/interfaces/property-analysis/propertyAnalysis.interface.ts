export interface PropertyFlipAnalysis {
  flipScore: number;
  estimatedARV: number;
  renovationCost: number;
  projectedProfit: number;
  roi: number;
  timeToComplete: number;
  riskLevel: 'low' | 'medium' | 'high';
  renovationRecommendations: string[];
  marketFactors: string[];
  warnings: string[];
}

export interface MarketAnalysis {
  priceAppreciationTrend: number;
  demandLevel: 'low' | 'moderate' | 'high';
  averageDaysOnMarket: number;
  competitionLevel: string;
  neighborhoodGrade: string;
  investmentOutlook: string;
}
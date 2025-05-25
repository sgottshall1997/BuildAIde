// Material Intelligence Feature Types
export interface MaterialPrice {
  id: string;
  name: string;
  currentPrice: number;
  unit: string;
  category: string;
  priceHistory: PriceHistoryPoint[];
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  lastUpdated: string;
  supplier?: string;
  region?: string;
}

export interface PriceHistoryPoint {
  date: string;
  price: number;
}

export interface MarketData {
  materialPrices: MaterialPrice[];
  lastRefreshDate: string;
  nextRefreshDate: string;
  marketSummary: {
    totalMaterials: number;
    averageIncrease: number;
    topGainers: MaterialPrice[];
    topDecliners: MaterialPrice[];
  };
}

export interface PriceForecast {
  materialId: string;
  predictedPrice: number;
  confidence: number;
  timeframe: '1week' | '1month' | '3months';
  factors: string[];
}

export interface MaterialCategory {
  id: string;
  name: string;
  description: string;
  averagePrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  commonUnits: string[];
}
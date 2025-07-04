
export interface MaterialPrice {
    id: string;
    name: string;
    currentPrice: number;
    unit: string;
    category: string;
    priceHistory: Array<{
        date: string;
        price: number;
    }>;
    trend: 'up' | 'down' | 'stable';
    changePercent: number;
    lastUpdated: string;
}

export interface MarketData {
    materialPrices: MaterialPrice[];
    lastRefreshDate: string;
    nextRefreshDate: string;
}
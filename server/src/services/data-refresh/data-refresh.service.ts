import { BASE_MATERIAL_PRICES } from '@server/constants/material-prices.constant';
import { MarketData, MaterialPrice } from '@server/interfaces/data-refresh/dataRefresh.interface';


const REFRESH_INTERVAL_DAYS = 2;

// Generate realistic price variations based on market conditions
function generatePriceVariation(basePrice: number, volatility: number = 0.05): number {
    const variation = (Math.random() - 0.5) * 2 * volatility;
    return Math.round((basePrice * (1 + variation)) * 100) / 100;
}

// Generate price history for the last 30 days
function generatePriceHistory(currentPrice: number, days: number = 30): Array<{ date: string, price: number }> {
    const history = [];
    let price = currentPrice;

    for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        // Add some realistic volatility
        if (i > 0) {
            price = generatePriceVariation(price, 0.03);
        } else {
            price = currentPrice; // Ensure current price is accurate
        }

        history.push({
            date: date.toISOString().split('T')[0],
            price: Math.round(price * 100) / 100
        });
    }

    return history;
}

// Calculate trend from price history
function calculateTrend(priceHistory: Array<{ date: string, price: number }>): { trend: 'up' | 'down' | 'stable', changePercent: number } {
    if (priceHistory.length < 2) return { trend: 'stable', changePercent: 0 };

    const recent = priceHistory[priceHistory.length - 1].price;
    const previous = priceHistory[priceHistory.length - 7]?.price || priceHistory[0].price;

    const changePercent = Math.round(((recent - previous) / previous) * 100 * 100) / 100;

    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (Math.abs(changePercent) > 2) {
        trend = changePercent > 0 ? 'up' : 'down';
    }

    return { trend, changePercent };
}

export function generateCurrentMarketData(): MarketData {
    const currentDate = new Date().toISOString();
    const nextRefresh = new Date();
    nextRefresh.setDate(nextRefresh.getDate() + REFRESH_INTERVAL_DAYS);

    const materialPrices: MaterialPrice[] = BASE_MATERIAL_PRICES.map(material => {
        const currentPrice = generatePriceVariation(material.basePrice, 0.08);
        const priceHistory = generatePriceHistory(currentPrice);
        const { trend, changePercent } = calculateTrend(priceHistory);

        return {
            id: material.id,
            name: material.name,
            currentPrice,
            unit: material.unit,
            category: material.category,
            priceHistory,
            trend,
            changePercent,
            lastUpdated: currentDate
        };
    });

    return {
        materialPrices,
        lastRefreshDate: currentDate,
        nextRefreshDate: nextRefresh.toISOString()
    };
}

export function shouldRefreshData(lastRefreshDate: string): boolean {
    const lastRefresh = new Date(lastRefreshDate);
    const now = new Date();
    const daysDiff = (now.getTime() - lastRefresh.getTime()) / (1000 * 3600 * 24);

    return daysDiff >= REFRESH_INTERVAL_DAYS;
}

export async function getStoredMarketData(): Promise<MarketData | null> {
    try {
        const { readFileSync } = await import('fs');
        const stored = readFileSync('./server/data/marketData.json', 'utf8');
        return JSON.parse(stored);
    } catch (error) {
        return null;
    }
}

export async function saveMarketData(data: MarketData): Promise<void> {
    try {
        const { writeFileSync, existsSync, mkdirSync } = await import('fs');

        // Ensure data directory exists
        const dataDir = './server/data';
        if (!existsSync(dataDir)) {
            mkdirSync(dataDir, { recursive: true });
        }

        writeFileSync('./server/data/marketData.json', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error saving market data:', error);
    }
}

export async function getRefreshedMarketData(): Promise<MarketData> {
    const stored = await getStoredMarketData();

    if (!stored || shouldRefreshData(stored.lastRefreshDate)) {
        console.log('Generating fresh market data... (updates every 2 days)');
        const newData = generateCurrentMarketData();
        await saveMarketData(newData);
        return newData;
    }

    console.log(`Using cached market data. Next refresh: ${new Date(stored.nextRefreshDate).toLocaleDateString()}`);
    return stored;
}
import { MarketData } from '@server/interfaces/market/market.interface';
import { generateFreshMarketData } from '@server/utils/generate-market-fresh-data';

const REFRESH_INTERVAL_DAYS = Number(process.env.REFRESH_INTERVAL_DAYS);


export async function getMarketData(): Promise<MarketData> {
    try {
        // Try to load stored data
        const { readFileSync, existsSync } = await import('fs');

        if (existsSync('./server/data/marketData.json')) {
            const stored = JSON.parse(readFileSync('./server/data/marketData.json', 'utf8'));

            // Check if data needs refresh (every 2 days)
            const lastRefresh = new Date(stored.lastRefreshDate);
            const now = new Date();
            const daysDiff = (now.getTime() - lastRefresh.getTime()) / (1000 * 3600 * 24);

            if (daysDiff < REFRESH_INTERVAL_DAYS) {
                console.log(`Using cached market data. Next refresh: ${new Date(stored.nextRefreshDate).toLocaleDateString()}`);
                return stored;
            }
        }

        // Generate fresh data
        console.log('Generating fresh market data... (updates every 2 days)');
        const freshData = generateFreshMarketData();

        // Save the new data
        const { writeFileSync, mkdirSync } = await import('fs');
        if (!existsSync('./server/data')) {
            mkdirSync('./server/data', { recursive: true });
        }
        writeFileSync('./server/data/marketData.json', JSON.stringify(freshData, null, 2));

        return freshData;

    } catch (error) {
        console.error('Error managing market data:', error);
        // Return fresh data as fallback
        return generateFreshMarketData();
    }
}
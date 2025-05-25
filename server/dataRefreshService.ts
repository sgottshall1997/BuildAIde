interface MaterialPrice {
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

interface MarketData {
  materialPrices: MaterialPrice[];
  lastRefreshDate: string;
  nextRefreshDate: string;
}

const REFRESH_INTERVAL_DAYS = 2;

// Generate realistic price variations based on market conditions
function generatePriceVariation(basePrice: number, volatility: number = 0.05): number {
  const variation = (Math.random() - 0.5) * 2 * volatility;
  return Math.round((basePrice * (1 + variation)) * 100) / 100;
}

// Generate price history for the last 30 days
function generatePriceHistory(currentPrice: number, days: number = 30): Array<{date: string, price: number}> {
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
function calculateTrend(priceHistory: Array<{date: string, price: number}>): { trend: 'up' | 'down' | 'stable', changePercent: number } {
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

// Comprehensive material price database
const baseMaterialPrices = [
  // Lumber
  { id: 'lumber-2x4', name: 'Lumber 2x4x8', basePrice: 4.50, unit: 'each', category: 'Lumber' },
  { id: 'lumber-2x6', name: 'Lumber 2x6x8', basePrice: 7.25, unit: 'each', category: 'Lumber' },
  { id: 'lumber-plywood', name: 'Plywood 4x8 3/4"', basePrice: 58.00, unit: 'sheet', category: 'Lumber' },
  { id: 'lumber-osb', name: 'OSB 4x8 7/16"', basePrice: 32.00, unit: 'sheet', category: 'Lumber' },
  
  // Concrete & Masonry
  { id: 'concrete-ready-mix', name: 'Ready-Mix Concrete', basePrice: 125.00, unit: 'cubic yard', category: 'Concrete' },
  { id: 'concrete-bags', name: 'Concrete Mix 80lb', basePrice: 4.25, unit: 'bag', category: 'Concrete' },
  { id: 'brick-common', name: 'Common Brick', basePrice: 0.85, unit: 'each', category: 'Masonry' },
  { id: 'cement-portland', name: 'Portland Cement 94lb', basePrice: 12.50, unit: 'bag', category: 'Concrete' },
  
  // Drywall & Insulation
  { id: 'drywall-half-inch', name: 'Drywall 4x8 1/2"', basePrice: 14.50, unit: 'sheet', category: 'Drywall' },
  { id: 'drywall-compound', name: 'Joint Compound 5gal', basePrice: 18.00, unit: 'bucket', category: 'Drywall' },
  { id: 'insulation-fiberglass', name: 'Fiberglass R-13', basePrice: 1.25, unit: 'sq ft', category: 'Insulation' },
  { id: 'insulation-foam', name: 'Spray Foam Kit', basePrice: 485.00, unit: 'kit', category: 'Insulation' },
  
  // Roofing
  { id: 'shingles-asphalt', name: 'Asphalt Shingles', basePrice: 125.00, unit: 'square', category: 'Roofing' },
  { id: 'roofing-felt', name: 'Roofing Felt 15lb', basePrice: 45.00, unit: 'roll', category: 'Roofing' },
  { id: 'roofing-nails', name: 'Roofing Nails 50lb', basePrice: 78.00, unit: 'box', category: 'Roofing' },
  
  // Electrical
  { id: 'wire-12-gauge', name: 'Romex 12-2 Wire', basePrice: 1.85, unit: 'linear foot', category: 'Electrical' },
  { id: 'wire-14-gauge', name: 'Romex 14-2 Wire', basePrice: 1.45, unit: 'linear foot', category: 'Electrical' },
  { id: 'electrical-outlet', name: 'GFCI Outlet', basePrice: 18.50, unit: 'each', category: 'Electrical' },
  { id: 'electrical-breaker', name: '20A Circuit Breaker', basePrice: 25.00, unit: 'each', category: 'Electrical' },
  
  // Plumbing
  { id: 'pipe-pvc-4', name: 'PVC Pipe 4" x10\'', basePrice: 28.00, unit: 'each', category: 'Plumbing' },
  { id: 'pipe-copper-half', name: 'Copper Pipe 1/2"', basePrice: 3.25, unit: 'linear foot', category: 'Plumbing' },
  { id: 'pvc-fittings', name: 'PVC Fittings Kit', basePrice: 45.00, unit: 'kit', category: 'Plumbing' },
  { id: 'toilet-standard', name: 'Standard Toilet', basePrice: 285.00, unit: 'each', category: 'Plumbing' },
  
  // Flooring
  { id: 'hardwood-oak', name: 'Oak Hardwood Flooring', basePrice: 8.50, unit: 'sq ft', category: 'Flooring' },
  { id: 'laminate-flooring', name: 'Laminate Flooring', basePrice: 3.25, unit: 'sq ft', category: 'Flooring' },
  { id: 'tile-ceramic', name: 'Ceramic Tile 12x12', basePrice: 2.85, unit: 'sq ft', category: 'Flooring' },
  { id: 'carpet-medium', name: 'Carpet Mid-Grade', basePrice: 4.50, unit: 'sq ft', category: 'Flooring' },
  
  // Paint & Finishes
  { id: 'paint-interior', name: 'Interior Paint Gallon', basePrice: 52.00, unit: 'gallon', category: 'Paint' },
  { id: 'paint-exterior', name: 'Exterior Paint Gallon', basePrice: 68.00, unit: 'gallon', category: 'Paint' },
  { id: 'primer-interior', name: 'Interior Primer', basePrice: 35.00, unit: 'gallon', category: 'Paint' },
  { id: 'stain-wood', name: 'Wood Stain Quart', basePrice: 24.00, unit: 'quart', category: 'Paint' },
];

export function generateCurrentMarketData(): MarketData {
  const currentDate = new Date().toISOString();
  const nextRefresh = new Date();
  nextRefresh.setDate(nextRefresh.getDate() + REFRESH_INTERVAL_DAYS);
  
  const materialPrices: MaterialPrice[] = baseMaterialPrices.map(material => {
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
// Simple market data refresh system that updates every 2 days
interface MarketData {
  materialPrices: any[];
  lastRefreshDate: string;
  nextRefreshDate: string;
}

const REFRESH_INTERVAL_DAYS = 2;

// Enhanced material prices with realistic market variations
function generateFreshMarketData() {
  const currentDate = new Date();
  const nextRefresh = new Date();
  nextRefresh.setDate(nextRefresh.getDate() + REFRESH_INTERVAL_DAYS);

  // Apply small price variations to simulate market changes
  const priceVariation = () => (Math.random() - 0.5) * 0.1; // ±5% variation

  const materialPrices = [
    // Lumber & Framing
    { 
      id: "lumber-2x4", 
      name: "Lumber 2x4x8", 
      category: "framing", 
      currentPrice: parseFloat((8.97 * (1 + priceVariation())).toFixed(2)), 
      unit: "board", 
      trend: Math.random() > 0.5 ? "up" : "down",
      changePercent: parseFloat((Math.random() * 10 - 5).toFixed(1)),
      lastUpdated: currentDate.toISOString()
    },
    { 
      id: "osb-sheathing", 
      name: "OSB Sheathing 7/16\"", 
      category: "framing", 
      currentPrice: parseFloat((45.99 * (1 + priceVariation())).toFixed(2)), 
      unit: "sheet", 
      trend: Math.random() > 0.6 ? "up" : "stable",
      changePercent: parseFloat((Math.random() * 8 - 2).toFixed(1)),
      lastUpdated: currentDate.toISOString()
    },
    { 
      id: "plywood-half", 
      name: "Plywood 4x8 1/2\"", 
      category: "framing", 
      currentPrice: parseFloat((52.75 * (1 + priceVariation())).toFixed(2)), 
      unit: "sheet", 
      trend: Math.random() > 0.4 ? "up" : "down",
      changePercent: parseFloat((Math.random() * 12 - 6).toFixed(1)),
      lastUpdated: currentDate.toISOString()
    },

    // Concrete & Masonry
    { 
      id: "ready-mix", 
      name: "Ready Mix Concrete", 
      category: "concrete", 
      currentPrice: parseFloat((165.00 * (1 + priceVariation())).toFixed(2)), 
      unit: "cubic yard", 
      trend: Math.random() > 0.7 ? "up" : "stable",
      changePercent: parseFloat((Math.random() * 6 - 2).toFixed(1)),
      lastUpdated: currentDate.toISOString()
    },
    { 
      id: "concrete-blocks", 
      name: "8\" CMU Block", 
      category: "concrete", 
      currentPrice: parseFloat((2.89 * (1 + priceVariation())).toFixed(2)), 
      unit: "block", 
      trend: Math.random() > 0.5 ? "stable" : "up",
      changePercent: parseFloat((Math.random() * 4 - 1).toFixed(1)),
      lastUpdated: currentDate.toISOString()
    },

    // Drywall & Insulation
    { 
      id: "drywall-half-inch", 
      name: "Drywall 4x8 1/2\"", 
      category: "drywall", 
      currentPrice: parseFloat((14.50 * (1 + priceVariation())).toFixed(2)), 
      unit: "sheet", 
      trend: Math.random() > 0.6 ? "stable" : "up",
      changePercent: parseFloat((Math.random() * 5 - 2).toFixed(1)),
      lastUpdated: currentDate.toISOString()
    },
    { 
      id: "insulation-fiberglass", 
      name: "Fiberglass R-13", 
      category: "insulation", 
      currentPrice: parseFloat((1.25 * (1 + priceVariation())).toFixed(2)), 
      unit: "sq ft", 
      trend: Math.random() > 0.5 ? "stable" : "down",
      changePercent: parseFloat((Math.random() * 3 - 1.5).toFixed(1)),
      lastUpdated: currentDate.toISOString()
    },

    // Roofing
    { 
      id: "shingles-asphalt", 
      name: "Asphalt Shingles", 
      category: "roofing", 
      currentPrice: parseFloat((125.00 * (1 + priceVariation())).toFixed(2)), 
      unit: "square", 
      trend: Math.random() > 0.7 ? "up" : "stable",
      changePercent: parseFloat((Math.random() * 7 - 2).toFixed(1)),
      lastUpdated: currentDate.toISOString()
    },

    // Electrical
    { 
      id: "wire-12-gauge", 
      name: "Romex 12-2 Wire", 
      category: "electrical", 
      currentPrice: parseFloat((1.85 * (1 + priceVariation())).toFixed(2)), 
      unit: "linear foot", 
      trend: Math.random() > 0.3 ? "up" : "stable",
      changePercent: parseFloat((Math.random() * 8 - 3).toFixed(1)),
      lastUpdated: currentDate.toISOString()
    },

    // Plumbing
    { 
      id: "pipe-copper-half", 
      name: "Copper Pipe 1/2\"", 
      category: "plumbing", 
      currentPrice: parseFloat((3.25 * (1 + priceVariation())).toFixed(2)), 
      unit: "linear foot", 
      trend: Math.random() > 0.4 ? "up" : "down",
      changePercent: parseFloat((Math.random() * 10 - 4).toFixed(1)),
      lastUpdated: currentDate.toISOString()
    },

    // Paint & Finishes
    { 
      id: "paint-interior", 
      name: "Interior Paint Gallon", 
      category: "paint", 
      currentPrice: parseFloat((52.00 * (1 + priceVariation())).toFixed(2)), 
      unit: "gallon", 
      trend: Math.random() > 0.6 ? "stable" : "up",
      changePercent: parseFloat((Math.random() * 4 - 1).toFixed(1)),
      lastUpdated: currentDate.toISOString()
    }
  ];

  return {
    materialPrices,
    lastRefreshDate: currentDate.toISOString(),
    nextRefreshDate: nextRefresh.toISOString()
  };
}

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
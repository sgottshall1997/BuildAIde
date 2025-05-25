// Property Analysis Feature Types
export interface Property {
  id: string;
  address: string;
  price: number;
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  yearBuilt?: number;
  lotSize?: number;
  propertyType: 'single-family' | 'townhouse' | 'condo' | 'multi-family';
  status: 'for-sale' | 'pending' | 'sold' | 'off-market';
  daysOnMarket: number;
  zipCode: string;
  description?: string;
  photos: string[];
  listingUrl?: string;
}

export interface ROICalculation {
  propertyId: string;
  purchasePrice: number;
  renovationCosts: number;
  holdingCosts: number;
  sellingCosts: number;
  estimatedARV: number; // After Repair Value
  totalInvestment: number;
  projectedProfit: number;
  roi: number;
  timeline: number; // months
  breakdown: {
    acquisition: number;
    renovation: number;
    holding: number;
    selling: number;
  };
}

export interface FlipProject {
  id: string;
  propertyId: string;
  name: string;
  status: 'analyzing' | 'purchased' | 'renovating' | 'marketing' | 'sold';
  purchaseDate?: string;
  saleDate?: string;
  actualROI?: number;
  roi: ROICalculation;
  notes?: string;
}

export interface MarketTrends {
  zipCode: string;
  averagePrice: number;
  priceChange: number;
  daysOnMarket: number;
  inventoryLevel: 'low' | 'medium' | 'high';
  lastUpdated: string;
}

export interface ComparableProperty {
  id: string;
  address: string;
  price: number;
  sqft: number;
  pricePerSqft: number;
  bedrooms: number;
  bathrooms: number;
  soldDate: string;
  distance: number; // miles from subject property
}
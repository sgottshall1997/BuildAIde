
/**
 * @description Interface for search property payload
 */
export interface PropertySearchParams {
  zipCode: string;
  minPrice?: number;
  maxPrice?: number;
  minSqft?: number;
  maxSqft?: number;
  maxDaysOnMarket?: number;
  propertyTypes?: string[];
  renovationPotential?: 'high' | 'medium' | 'low';
}

/**
 * @description 
 */

export interface StandardizedProperty {
  id: string;
  address: string;
  price: number;
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  daysOnMarket: number;
  photos: string[];
  description: string;
  mls_id?: string;
  lot_size?: number;
  year_built?: number;
  estimated_arv?: number;
  renovation_score?: number;
  latitude?: number;
  longitude?: number;
  status?: string;
}


/**
 * @description
 */

export interface PropertySearchResult {
  properties: StandardizedProperty[];
  totalCount: number;
  marketSummary: {
    averagePrice: number;
    pricePerSqft: number;
    medianDaysOnMarket: number;
    inventoryLevel: string;
  };
}

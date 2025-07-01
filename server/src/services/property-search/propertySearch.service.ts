import fetch from 'node-fetch';

//-------------------------------------------------- Interfaces imports ---------------------------------------------------
import {
    PropertySearchParams,
    StandardizedProperty,
    PropertySearchResult
} from '../../interfaces/property-search/propertySearch.interface';

export class PropertyDataService {
    private readonly cache = new Map<string, { data: any; timestamp: number }>();
    private readonly cacheTimeout = 3600000; // 1 hour

    constructor() { }

    /**
     * Searches properties using RealtyMole or RentSpree APIs with fallback and caching.
     * @param params - Property search filters such as zip code, price, and sqft range.
     * @returns A standardized property search result with market summary.
     */
    async searchProperties(params: PropertySearchParams): Promise<PropertySearchResult> {
        const cacheKey = this.generateCacheKey(params);

        // Check cache first
        const cached = this.getCached(cacheKey);
        if (cached) {
            return cached;
        }

        let result: PropertySearchResult;

        try {
            // Try RealtyMole API first
            result = await this.fetchFromRealtyMole(params);
        } catch (error) {
            console.log('RealtyMole API failed, trying RentSpree...');
            try {
                // Try RentSpree API as backup
                result = await this.fetchFromRentSpree(params);
            } catch (backupError) {
                console.log('All APIs failed, requesting API keys from user...');
                throw new Error('Property data APIs are not configured. Please provide valid API keys for RealtyMole or RentSpree.');
            }
        }

        // Cache the result
        this.setCache(cacheKey, result);
        return result;
    }

    /**
     * Fetches property listings from RealtyMole API and standardizes the result.
     * @param params - Property search parameters.
     * @returns Standardized property search result.
     */
    private async fetchFromRealtyMole(params: PropertySearchParams): Promise<PropertySearchResult> {
        const apiKey = process.env.REALTYMOLE_API_KEY;
        if (!apiKey) {
            throw new Error('RealtyMole API key not configured');
        }

        const url = new URL('https://api.realtymole.com/v1/listings');
        url.searchParams.append('zipcode', params.zipCode);
        if (params.minPrice) url.searchParams.append('price_min', params.minPrice.toString());
        if (params.maxPrice) url.searchParams.append('price_max', params.maxPrice.toString());
        if (params.minSqft) url.searchParams.append('sqft_min', params.minSqft.toString());
        if (params.maxSqft) url.searchParams.append('sqft_max', params.maxSqft.toString());

        const response = await fetch(url.toString(), {
            headers: {
                'X-API-Key': apiKey,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`RealtyMole API error: ${response.status}`);
        }

        const data = await response.json() as any;
        return this.standardizeRealtyMoleData(data);
    }


    /**
     * Fetches property listings from RentSpree API and standardizes the result.
     * @param params - Property search parameters.
     * @returns Standardized property search result.
     */
    private async fetchFromRentSpree(params: PropertySearchParams): Promise<PropertySearchResult> {
        const apiKey = process.env.RENTSPREE_API_KEY;
        if (!apiKey) {
            throw new Error('RentSpree API key not configured');
        }

        const response = await fetch('https://api.rentspree.com/v1/listings', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                location: params.zipCode,
                price_min: params.minPrice,
                price_max: params.maxPrice,
                size_min: params.minSqft,
                size_max: params.maxSqft,
                limit: 50
            })
        });

        if (!response.ok) {
            throw new Error(`RentSpree API error: ${response.status}`);
        }

        const data = await response.json() as any;
        return this.standardizeRentSpreeData(data);
    }


    /**
     * Transforms RealtyMole API response into a standardized property format.
     * @param data - Raw data from RealtyMole API.
     * @returns A structured property search result.
     */
    private standardizeRealtyMoleData(data: any): PropertySearchResult {
        const properties: StandardizedProperty[] = (data.listings || []).map((listing: any) => ({
            id: listing.id || `rm_${Date.now()}_${Math.random()}`,
            address: `${listing.address}, ${listing.city}, ${listing.state} ${listing.zipcode}`,
            price: listing.price || 0,
            sqft: listing.sqft || 0,
            bedrooms: listing.bedrooms || 0,
            bathrooms: listing.bathrooms || 0,
            propertyType: listing.property_type || 'Single Family',
            daysOnMarket: listing.days_on_market || 0,
            photos: listing.photos || [],
            description: listing.description || '',
            mls_id: listing.mls_id,
            lot_size: listing.lot_size,
            year_built: listing.year_built,
            latitude: listing.latitude,
            longitude: listing.longitude,
            status: listing.status || 'active'
        }));

        const averagePrice = properties.reduce((sum, p) => sum + p.price, 0) / (properties.length || 1);
        const totalSqft = properties.reduce((sum, p) => sum + p.sqft, 0);
        const pricePerSqft = totalSqft > 0 ? (properties.reduce((sum, p) => sum + (p.price * p.sqft), 0) / totalSqft) : 0;
        const medianDaysOnMarket = this.calculateMedian(properties.map(p => p.daysOnMarket));

        return {
            properties,
            totalCount: properties.length,
            marketSummary: {
                averagePrice,
                pricePerSqft,
                medianDaysOnMarket,
                inventoryLevel: properties.length > 30 ? 'High' : properties.length > 15 ? 'Moderate' : 'Low'
            }
        };
    }


    /**
     * Transforms RentSpree API response into a standardized property format.
     * @param data - Raw data from RentSpree API.
     * @returns A structured property search result.
     */
    private standardizeRentSpreeData(data: any): PropertySearchResult {
        const properties: StandardizedProperty[] = (data.listings || []).map((listing: any) => ({
            id: listing.id || `rs_${Date.now()}_${Math.random()}`,
            address: listing.full_address || listing.address,
            price: listing.rent || listing.price || 0,
            sqft: listing.square_feet || 0,
            bedrooms: listing.bedrooms || 0,
            bathrooms: listing.bathrooms || 0,
            propertyType: listing.property_type || 'Single Family',
            daysOnMarket: listing.days_on_market || 0,
            photos: listing.photos || [],
            description: listing.description || '',
            latitude: listing.latitude,
            longitude: listing.longitude,
            status: listing.status || 'active'
        }));

        const averagePrice = properties.reduce((sum, p) => sum + p.price, 0) / (properties.length || 1);
        const totalSqft = properties.reduce((sum, p) => sum + p.sqft, 0);
        const pricePerSqft = totalSqft > 0 ? (properties.reduce((sum, p) => sum + (p.price * p.sqft), 0) / totalSqft) : 0;
        const medianDaysOnMarket = this.calculateMedian(properties.map(p => p.daysOnMarket));

        return {
            properties,
            totalCount: properties.length,
            marketSummary: {
                averagePrice,
                pricePerSqft,
                medianDaysOnMarket,
                inventoryLevel: properties.length > 30 ? 'High' : properties.length > 15 ? 'Moderate' : 'Low'
            }
        };
    }


    /**
     * Calculates the median value from an array of numbers.
     * @param numbers - Array of numeric values.
     * @returns Median number.
     */
    private calculateMedian(numbers: number[]): number {
        const sorted = numbers.sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
    }


    /**
     * Generates a unique cache key based on search parameters.
     * @param params - Property search parameters.
     * @returns A string used as cache key.
     */
    private generateCacheKey(params: PropertySearchParams): string {
        return `property_search_${JSON.stringify(params)}`;
    }



    /**
     * Retrieves a cached result if it exists and hasn't expired.
     * @param key - Cache key.
     * @returns Cached property result or null.
     */
    private getCached(key: string): PropertySearchResult | null {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
        if (cached) {
            this.cache.delete(key);
        }
        return null;
    }



    /**
     * Stores property data in cache with a timestamp.
     * @param key - Cache key.
     * @param data - Property result to cache.
     */
    private setCache(key: string, data: PropertySearchResult): void {
        this.cache.set(key, { data, timestamp: Date.now() });
    }
}

export const propertyDataService = new PropertyDataService();

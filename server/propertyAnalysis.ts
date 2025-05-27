import OpenAI from 'openai';

interface PropertyFlipAnalysis {
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

interface MarketAnalysis {
  priceAppreciationTrend: number;
  demandLevel: 'low' | 'moderate' | 'high';
  averageDaysOnMarket: number;
  competitionLevel: string;
  neighborhoodGrade: string;
  investmentOutlook: string;
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export class PropertyAnalysisService {
  
  async analyzeFlipPotential(property: any, marketData?: any): Promise<PropertyFlipAnalysis> {
    try {
      const analysis = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: `You are a professional real estate investment expert specializing in house flipping analysis. Analyze properties for flip potential based on current market conditions, renovation costs, and profit margins. Always provide realistic, data-driven assessments.

Respond with JSON in this exact format:
{
  "flipScore": number (1-100),
  "estimatedARV": number,
  "renovationCost": number,
  "projectedProfit": number,
  "roi": number,
  "timeToComplete": number (in months),
  "riskLevel": "low" | "medium" | "high",
  "renovationRecommendations": [string array],
  "marketFactors": [string array],
  "warnings": [string array]
}`
          },
          {
            role: "user",
            content: `Analyze this property for flip potential:

Property Details:
- Address: ${property.address}
- Price: $${property.price?.toLocaleString()}
- Square Footage: ${property.sqft} sq ft
- Bedrooms: ${property.bedrooms}
- Bathrooms: ${property.bathrooms}
- Year Built: ${property.year_built || 'Unknown'}
- Days on Market: ${property.daysOnMarket}
- Property Type: ${property.propertyType}
- Lot Size: ${property.lot_size || 'Unknown'}

${marketData ? `Market Context:
- Average Price: $${marketData.averagePrice?.toLocaleString()}
- Price per Sq Ft: $${marketData.pricePerSqft?.toFixed(2)}
- Median Days on Market: ${marketData.medianDaysOnMarket}
- Inventory Level: ${marketData.inventoryLevel}` : ''}

Provide a comprehensive flip analysis including renovation scope, market positioning, and realistic profit projections.`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2
      });

      const result = JSON.parse(analysis.choices[0].message.content || '{}');
      
      return {
        flipScore: Math.max(1, Math.min(100, result.flipScore || 0)),
        estimatedARV: result.estimatedARV || 0,
        renovationCost: result.renovationCost || 0,
        projectedProfit: result.projectedProfit || 0,
        roi: result.roi || 0,
        timeToComplete: Math.max(1, result.timeToComplete || 6),
        riskLevel: result.riskLevel || 'medium',
        renovationRecommendations: result.renovationRecommendations || [],
        marketFactors: result.marketFactors || [],
        warnings: result.warnings || []
      };
    } catch (error) {
      console.error('Property analysis failed:', error);
      // Return conservative analysis as fallback
      return this.generateConservativeAnalysis(property);
    }
  }

  async analyzeMarketTrends(zipCode: string, properties: any[]): Promise<MarketAnalysis> {
    try {
      const analysis = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: `You are a real estate market analyst. Analyze market conditions and trends for investment opportunities. Provide realistic assessments based on property data and market indicators.

Respond with JSON in this exact format:
{
  "priceAppreciationTrend": number (percentage),
  "demandLevel": "low" | "moderate" | "high",
  "averageDaysOnMarket": number,
  "competitionLevel": string,
  "neighborhoodGrade": string,
  "investmentOutlook": string
}`
          },
          {
            role: "user",
            content: `Analyze the market conditions for ZIP code ${zipCode} based on this property data:

Properties Found: ${properties.length}
Average Price: $${properties.reduce((sum, p) => sum + (p.price || 0), 0) / properties.length || 0}
Average Days on Market: ${properties.reduce((sum, p) => sum + (p.daysOnMarket || 0), 0) / properties.length || 0}
Average Square Footage: ${properties.reduce((sum, p) => sum + (p.sqft || 0), 0) / properties.length || 0}

Property Types: ${[...new Set(properties.map(p => p.propertyType))].join(', ')}

Provide market analysis including investment outlook, competition level, and demand trends for real estate investors.`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2
      });

      const result = JSON.parse(analysis.choices[0].message.content || '{}');
      
      return {
        priceAppreciationTrend: result.priceAppreciationTrend || 0,
        demandLevel: result.demandLevel || 'moderate',
        averageDaysOnMarket: result.averageDaysOnMarket || 0,
        competitionLevel: result.competitionLevel || 'Moderate competition',
        neighborhoodGrade: result.neighborhoodGrade || 'B',
        investmentOutlook: result.investmentOutlook || 'Stable market conditions'
      };
    } catch (error) {
      console.error('Market analysis failed:', error);
      return this.generateConservativeMarketAnalysis(properties);
    }
  }

  async generateLeadInsights(property: any, flipAnalysis: PropertyFlipAnalysis): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are a real estate investment advisor. Generate concise, actionable insights for property leads that help investors make quick decisions."
          },
          {
            role: "user",
            content: `Create a brief lead insight for this property:

Property: ${property.address}
Price: $${property.price?.toLocaleString()}
Flip Score: ${flipAnalysis.flipScore}/100
Estimated Profit: $${flipAnalysis.projectedProfit?.toLocaleString()}
ROI: ${flipAnalysis.roi}%
Risk Level: ${flipAnalysis.riskLevel}

Write 1-2 sentences highlighting the key opportunity or concern for this property lead.`
          }
        ],
        temperature: 0.3
      });

      return response.choices[0].message.content || 'Property requires further analysis to determine investment potential.';
    } catch (error) {
      console.error('Lead insight generation failed:', error);
      return `Property with ${flipAnalysis.flipScore}/100 flip score. Estimated ${flipAnalysis.roi}% ROI with ${flipAnalysis.riskLevel} risk level.`;
    }
  }

  private generateConservativeAnalysis(property: any): PropertyFlipAnalysis {
    const estimatedPrice = property.price || 300000;
    const sqft = property.sqft || 1500;
    
    // Conservative estimates
    const estimatedARV = estimatedPrice * 1.15; // 15% markup
    const renovationCost = sqft * 50; // $50 per sqft
    const projectedProfit = estimatedARV - estimatedPrice - renovationCost;
    const roi = projectedProfit > 0 ? (projectedProfit / estimatedPrice) * 100 : 0;

    return {
      flipScore: 65,
      estimatedARV,
      renovationCost,
      projectedProfit,
      roi,
      timeToComplete: 6,
      riskLevel: 'medium',
      renovationRecommendations: ['Kitchen updates', 'Bathroom renovation', 'Flooring replacement'],
      marketFactors: ['Moderate market conditions', 'Standard appreciation expected'],
      warnings: ['Analysis based on limited data - verify with local market research']
    };
  }

  private generateConservativeMarketAnalysis(properties: any[]): MarketAnalysis {
    const avgDaysOnMarket = properties.reduce((sum, p) => sum + (p.daysOnMarket || 30), 0) / properties.length || 30;
    
    return {
      priceAppreciationTrend: 3.5,
      demandLevel: 'moderate',
      averageDaysOnMarket: avgDaysOnMarket,
      competitionLevel: 'Moderate competition with standard market activity',
      neighborhoodGrade: 'B',
      investmentOutlook: 'Stable market with moderate investment potential'
    };
  }
}

export const propertyAnalysisService = new PropertyAnalysisService();
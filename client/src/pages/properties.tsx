import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import FeedbackButton from "@/components/feedback-button";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Home, 
  Sparkles,
  Building,
  TrendingUp,
  Wrench,
  Filter,
  ExternalLink,
  Bed,
  Bath,
  Calendar,
  Clock,
  AlertCircle,
  Phone,
  Mail,
  Save,
  Star,
  BarChart3,
  Target
} from "lucide-react";

interface MarketInsights {
  zipCode: string;
  summary: string;
  lastUpdated: string;
  cacheTimestamp: number;
}

// LocalMarketInsights Component
function LocalMarketInsights({ zipCode }: { zipCode: string }) {
  const [insights, setInsights] = useState<MarketInsights | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getMarketInsights = useMutation({
    mutationFn: async (zip: string) => {
      const response = await apiRequest('POST', '/api/market-insights', { zipCode: zip });
      const data = await response.json();
      return data as MarketInsights;
    },
    onSuccess: (data: MarketInsights) => {
      setInsights(data);
      setError(null);
    },
    onError: (error: any) => {
      setError("We're updating market data for this area. Please check back soon.");
    }
  });

  useEffect(() => {
    if (zipCode && zipCode.length >= 5) {
      setIsLoading(true);
      getMarketInsights.mutate(zipCode);
      setIsLoading(false);
    }
  }, [zipCode]);

  if (isLoading || getMarketInsights.isPending) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-3 text-blue-700">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span>Analyzing local market trends...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 py-6 px-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <AlertCircle className="w-5 h-5 text-yellow-600" />
        <span className="text-yellow-800">{error}</span>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="text-center py-6 text-blue-700">
        Enter a ZIP code to see local market insights
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-6 border border-blue-200">
        <div className="flex items-start gap-3">
          <MapPin className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <div className="text-blue-900 leading-relaxed">
              {insights.summary.split('\n').map((paragraph, index) => (
                paragraph.trim() && <p key={index} className="mb-2">{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-blue-600">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>Last updated: {new Date(insights.lastUpdated).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          Weekly AI Analysis
        </Badge>
      </div>
    </div>
  );
}

interface PropertyListing {
  id: string;
  address: string;
  price: number;
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  propertyType: 'Single Family' | 'Condo' | 'Townhouse' | 'Multi-Family';
  daysOnMarket: number;
  zipCode: string;
  description: string;
  listingUrl?: string;
  photos: string[];
  yearBuilt?: number;
  estimatedARV?: number;
  renovationScope?: 'Cosmetic' | 'Moderate' | 'Full Gut' | 'New Construction';
}

// Mock property listings for demo
const mockPropertyListings: PropertyListing[] = [
  {
    id: '1',
    address: '123 Oak Street, Chicago, IL 60614',
    price: 425000,
    sqft: 1850,
    bedrooms: 3,
    bathrooms: 2,
    propertyType: 'Single Family',
    daysOnMarket: 28,
    zipCode: '60614',
    description: 'Charming brick home with original hardwood floors. Needs kitchen and bathroom updates. Great potential in desirable Lincoln Park area.',
    photos: [],
    yearBuilt: 1925,
    estimatedARV: 650000,
    renovationScope: 'Moderate'
  },
  {
    id: '2',
    address: '456 Maple Avenue, Evanston, IL 60201',
    price: 315000,
    sqft: 1200,
    bedrooms: 2,
    bathrooms: 1,
    propertyType: 'Condo',
    daysOnMarket: 45,
    zipCode: '60201',
    description: 'Updated condo with new appliances. Minor cosmetic work needed. Close to Northwestern University.',
    photos: [],
    yearBuilt: 1985,
    estimatedARV: 375000,
    renovationScope: 'Cosmetic'
  },
  {
    id: '3',
    address: '789 Pine Road, Naperville, IL 60540',
    price: 285000,
    sqft: 2100,
    bedrooms: 4,
    bathrooms: 2,
    propertyType: 'Single Family',
    daysOnMarket: 67,
    zipCode: '60540',
    description: 'Fixer-upper with great bones. Needs complete renovation including electrical and plumbing. Large lot with expansion potential.',
    photos: [],
    yearBuilt: 1960,
    estimatedARV: 485000,
    renovationScope: 'Full Gut'
  }
];

const getScopeColor = (scope: string) => {
  switch (scope) {
    case 'Cosmetic': return 'bg-green-100 text-green-800';
    case 'Moderate': return 'bg-yellow-100 text-yellow-800';
    case 'Full Gut': return 'bg-red-100 text-red-800';
    case 'New Construction': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getScopeTooltip = (scope: string) => {
  switch (scope) {
    case 'Cosmetic': return 'Light touch-ups, paint, flooring, and surface-level improvements';
    case 'Moderate': return 'Some structural work, kitchen/bath updates, and mid-size renovations';
    case 'Full Gut': return 'Complete teardown and rebuild of interior systems and finishes';
    case 'New Construction': return 'Brand new build or complete reconstruction from foundation up';
    default: return 'Renovation scope not specified';
  }
};

function PropertyCard({ property, isConsumerMode, onAIAnalysis, isAnalyzed, flipScore, aiSummary }: { 
  property: PropertyListing; 
  isConsumerMode: boolean;
  onAIAnalysis: (property: PropertyListing) => void;
  isAnalyzed: boolean;
  flipScore?: {score: number, explanation: string};
  aiSummary?: {summary: string, badge: string, badgeType: 'good' | 'caution' | 'risk'};
}) {
  const pricePerSqft = Math.round(property.price / property.sqft);
  const potentialProfit = property.estimatedARV ? property.estimatedARV - property.price : 0;
  const roiPercentage = property.estimatedARV ? Math.round(((property.estimatedARV - property.price) / property.price) * 100) : 0;

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 6) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 8) return '🎯';
    if (score >= 6) return '⚠️';
    return '❌';
  };

  const getBadgeStyle = (badgeType: 'good' | 'caution' | 'risk') => {
    switch (badgeType) {
      case 'good': return 'bg-green-100 text-green-800 border-green-200';
      case 'caution': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'risk': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getBadgeIcon = (badgeType: 'good' | 'caution' | 'risk') => {
    switch (badgeType) {
      case 'good': return '✅';
      case 'caution': return '⚠️';
      case 'risk': return '❌';
      default: return '🤔';
    }
  };

  return (
    <Card className={`hover:shadow-lg transition-all duration-500 ${aiSummary ? 'ring-2 ring-blue-200 bg-blue-50/30' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              {property.address}
            </CardTitle>
            <CardDescription className="mt-1">
              {property.propertyType} • Built {property.yearBuilt} • {property.daysOnMarket} days on market
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 items-end">
            {/* Persistent AI Badge */}
            {aiSummary && (
              <div 
                className={`px-3 py-1 rounded-full border text-sm font-medium ${getBadgeStyle(aiSummary.badgeType)} animate-in slide-in-from-right duration-500`}
                title={aiSummary.summary}
              >
                {getBadgeIcon(aiSummary.badgeType)} {aiSummary.badge}
              </div>
            )}
            {flipScore && isConsumerMode && (
              <div 
                className={`px-3 py-1 rounded-full border text-sm font-medium cursor-help ${getScoreColor(flipScore.score)}`}
                title={flipScore.explanation}
              >
                {getScoreIcon(flipScore.score)} AI Score: {flipScore.score}/10
              </div>
            )}
            {property.renovationScope && (
              <Badge 
                className={getScopeColor(property.renovationScope)}
                title={getScopeTooltip(property.renovationScope)}
              >
                {property.renovationScope}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <div>
              <div className="font-medium">${property.price.toLocaleString()}</div>
              <div className="text-gray-600">${pricePerSqft}/sqft</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-blue-600" />
            <div>
              <div className="font-medium">{property.sqft.toLocaleString()} sqft</div>
              <div className="text-gray-600">{property.bedrooms}bd • {property.bathrooms}ba</div>
            </div>
          </div>
        </div>

        {isConsumerMode && property.estimatedARV && (
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-green-800">Est. ARV:</span>
              <span className="text-sm font-bold text-green-800">${property.estimatedARV.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-green-600">Est. Profit:</span>
              <span className="text-xs font-medium text-green-600">${potentialProfit.toLocaleString()} • ROI: {roiPercentage}%</span>
            </div>
          </div>
        )}

        {/* Dynamic AI Summary After Analysis */}
        {aiSummary && (
          <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 animate-in slide-in-from-top duration-700">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-600 font-medium">🧠 AI Take:</span>
            </div>
            <p className="text-sm text-blue-800">{aiSummary.summary}</p>
          </div>
        )}

        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-700">{property.description}</div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            onClick={() => onAIAnalysis(property)}
            className={`flex-1 ${isConsumerMode ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            size="sm"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isConsumerMode ? 'Is this a good flip?' : 'Should I bid this job?'}
          </Button>
          
          {property.listingUrl && (
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Listing
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Properties() {
  const [location] = useLocation();
  const isConsumerMode = sessionStorage.getItem('userMode') === 'consumer' || location.includes('consumer');
  
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyUrl, setPropertyUrl] = useState("");
  const [searchMode, setSearchMode] = useState<'zipcode' | 'url'>('zipcode');
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAnalyzingUrl, setIsAnalyzingUrl] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{property: PropertyListing, analysis: string, loadTime?: string} | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [testResult, setTestResult] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [sortBy, setSortBy] = useState("latest");
  const [analyzedProperties, setAnalyzedProperties] = useState<Set<string>>(new Set());
  const [urlProperty, setUrlProperty] = useState<PropertyListing | null>(null);
  
  // New filter states for enhanced search
  const [priceFilter, setPriceFilter] = useState({ min: "", max: "" });
  const [sqftFilter, setSqftFilter] = useState({ min: "", max: "" });
  const [daysOnMarketFilter, setDaysOnMarketFilter] = useState(365);
  const [isLoadingListings, setIsLoadingListings] = useState(false);
  const [flipScores, setFlipScores] = useState<{[key: string]: {score: number, explanation: string}}>({});
  const [aiSummaries, setAiSummaries] = useState<{[key: string]: {summary: string, badge: string, badgeType: 'good' | 'caution' | 'risk'}}>({});

  // Enhanced filtering with advanced options
  const filteredProperties = properties.filter(property => {
    // Basic search filter
    const matchesSearch = !searchQuery || 
      property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.zipCode.includes(searchQuery) ||
      property.propertyType.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Price filter
    const matchesPrice = (!priceFilter.min || property.price >= parseInt(priceFilter.min)) &&
                        (!priceFilter.max || property.price <= parseInt(priceFilter.max));
    
    // Square footage filter
    const matchesSqft = (!sqftFilter.min || property.sqft >= parseInt(sqftFilter.min)) &&
                       (!sqftFilter.max || property.sqft <= parseInt(sqftFilter.max));
    
    // Days on market filter
    const matchesDaysOnMarket = property.daysOnMarket <= daysOnMarketFilter;
    
    return matchesSearch && matchesPrice && matchesSqft && matchesDaysOnMarket;
  });

  // Sort properties based on selected option
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'roi':
        const roiA = a.estimatedARV ? ((a.estimatedARV - a.price) / a.price) * 100 : 0;
        const roiB = b.estimatedARV ? ((b.estimatedARV - b.price) / b.price) * 100 : 0;
        return roiB - roiA;
      case 'price':
        return a.price - b.price;
      case 'distance':
        return a.daysOnMarket - b.daysOnMarket; // Using days on market as proxy
      case 'aiScore':
        const scoreA = flipScores[a.id]?.score || 0;
        const scoreB = flipScores[b.id]?.score || 0;
        return scoreB - scoreA;
      default:
        return b.daysOnMarket - a.daysOnMarket; // Latest (newest listings first)
    }
  });

  // AI Flip Score generation
  const generateFlipScore = useMutation({
    mutationFn: async (property: PropertyListing) => {
      const response = await apiRequest('POST', '/api/generate-flip-score', {
        property: {
          address: property.address,
          price: property.price,
          sqft: property.sqft,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          zipCode: property.zipCode,
          daysOnMarket: property.daysOnMarket,
          description: property.description,
          estimatedARV: property.estimatedARV,
          renovationScope: property.renovationScope
        }
      });
      return await response.json() as {score: number, explanation: string};
    },
    onSuccess: (data, property) => {
      setFlipScores(prev => ({
        ...prev,
        [property.id]: data
      }));
    }
  });

  // Generate AI flip scores for visible properties
  useEffect(() => {
    if (isConsumerMode && sortedProperties.length > 0) {
      // Generate scores for first 6 properties to avoid API overload
      const propertiesToScore = sortedProperties.slice(0, 6).filter(p => !flipScores[p.id]);
      
      propertiesToScore.forEach(property => {
        if (!generateFlipScore.isPending) {
          setTimeout(() => {
            generateFlipScore.mutate(property);
          }, Math.random() * 2000); // Stagger requests
        }
      });
    }
  }, [sortedProperties, isConsumerMode]);

  // Handle URL analysis
  const handleAnalyzeUrl = async () => {
    if (!propertyUrl.trim()) return;
    
    setIsAnalyzingUrl(true);
    try {
      const response = await fetch('/api/analyze-property-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: propertyUrl,
          isConsumerMode
        })
      });

      if (response.ok) {
        const data = await response.json();
        const property: PropertyListing = {
          id: 'url-property',
          address: data.address || 'Property from URL',
          price: data.price || 0,
          sqft: data.sqft || 0,
          bedrooms: data.bedrooms || 0,
          bathrooms: data.bathrooms || 0,
          propertyType: data.propertyType || 'Single Family',
          daysOnMarket: data.daysOnMarket || 0,
          zipCode: data.zipCode || '',
          description: data.description || 'Property analyzed from URL',
          photos: [],
          listingUrl: propertyUrl,
          estimatedARV: data.estimatedARV || 0,
          renovationScope: data.renovationScope as any || 'Moderate'
        };
        
        setUrlProperty(property);
        
        // Auto-generate AI analysis for the URL property
        if (data.aiAnalysis) {
          setAiAnalysis({
            property,
            analysis: data.aiAnalysis,
            loadTime: '2.1'
          });
        }
      } else {
        console.error('Failed to analyze URL');
      }
    } catch (error) {
      console.error('Error analyzing URL:', error);
    } finally {
      setIsAnalyzingUrl(false);
    }
  };

  // Handle finding local listings
  const handleFindLocalListings = async () => {
    setIsLoadingListings(true);
    try {
      const zipCode = searchQuery.match(/\b\d{5}\b/)?.[0] || '60614'; // Default to Chicago if no ZIP
      
      const response = await fetch('/api/fetch-local-listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          zipCode,
          minPrice: priceFilter.min ? parseInt(priceFilter.min) : undefined,
          maxPrice: priceFilter.max ? parseInt(priceFilter.max) : undefined,
          minSqft: sqftFilter.min ? parseInt(sqftFilter.min) : undefined,
          maxSqft: sqftFilter.max ? parseInt(sqftFilter.max) : undefined,
          maxDaysOnMarket: daysOnMarketFilter
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('Failed to parse JSON response:', text);
        throw new Error('Invalid JSON response from server');
      }
      
      setProperties(data.listings || []);
      
    } catch (error) {
      console.error('Error fetching local listings:', error);
      setProperties([]); // Clear on error
    } finally {
      setIsLoadingListings(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    // Simulate search delay for UX
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };

  const handleAIAnalysis = async (property: PropertyListing) => {
    setIsLoadingAI(true);
    setAiAnalysis(null);
    const startTime = Date.now();

    try {
      let prompt = '';
      
      if (isConsumerMode) {
        // Consumer/Flipper Analysis
        prompt = `Analyze this property for house flipping potential. Provide investment insights, budget considerations, and risks.

Property Details:
Address: ${property.address}
Listing Price: $${property.price.toLocaleString()}
Square Footage: ${property.sqft.toLocaleString()}
Bedrooms/Bathrooms: ${property.bedrooms}/${property.bathrooms}
Property Type: ${property.propertyType}
Days on Market: ${property.daysOnMarket}
Year Built: ${property.yearBuilt}
Estimated ARV: $${property.estimatedARV?.toLocaleString() || 'Not provided'}
Renovation Scope: ${property.renovationScope}
Description: ${property.description}

Provide a concise, friendly analysis covering:
1. Investment potential (good/bad deal?)
2. Estimated renovation budget
3. Timeline considerations
4. Key risks to watch out for
5. Overall recommendation

Keep it actionable and easy to understand for a homeowner/investor.`;
      } else {
        // Pro/Contractor Analysis
        prompt = `Assess this property as a potential construction lead/bidding opportunity for a contractor.

Property Details:
Address: ${property.address}
Listing Price: $${property.price.toLocaleString()}
Square Footage: ${property.sqft.toLocaleString()}
Bedrooms/Bathrooms: ${property.bedrooms}/${property.bathrooms}
Property Type: ${property.propertyType}
Days on Market: ${property.daysOnMarket}
Year Built: ${property.yearBuilt}
Renovation Scope: ${property.renovationScope}
Description: ${property.description}

Provide professional insights covering:
1. Project scope and complexity
2. Estimated client budget potential
3. Trade coordination requirements
4. Timeline and scheduling considerations
5. Competitive bidding factors
6. Whether to pursue this lead

Focus on technical feasibility and business opportunity for a construction professional.`;
      }

      const response = await fetch('/api/property-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          isConsumerMode,
          propertyData: property
        })
      });

      if (response.ok) {
        const data = await response.json();
        const endTime = Date.now();
        const loadTime = ((endTime - startTime) / 1000).toFixed(1);
        
        setAiAnalysis({ 
          property, 
          analysis: data.analysis || "I'd be happy to provide property insights, but I'm having trouble generating the analysis right now.",
          loadTime 
        });
        
        // Generate AI summary badge based on analysis
        const generateAISummary = (analysis: string, property: PropertyListing) => {
          const roi = property.estimatedARV ? ((property.estimatedARV - property.price) / property.price) * 100 : 0;
          const analysisLower = analysis.toLowerCase();
          
          // Determine badge type and summary based on analysis content and ROI
          if (roi >= 25 && (analysisLower.includes('good deal') || analysisLower.includes('solid') || analysisLower.includes('recommend'))) {
            return {
              summary: "Solid margin, average competition",
              badge: "AI: Good Flip",
              badgeType: 'good' as const
            };
          } else if (roi >= 15 && roi < 25) {
            return {
              summary: "Moderate returns, consider market conditions",
              badge: "AI: Fair Deal",
              badgeType: 'caution' as const
            };
          } else if (roi < 15 || analysisLower.includes('risk') || analysisLower.includes('avoid')) {
            return {
              summary: "Low margins, high risk factors detected",
              badge: "AI: Low ROI Risk",
              badgeType: 'risk' as const
            };
          } else {
            return {
              summary: "Mixed signals, proceed with caution",
              badge: "AI: Needs Review",
              badgeType: 'caution' as const
            };
          }
        };
        
        // Set AI summary for persistent badge
        const summary = generateAISummary(data.analysis, property);
        setAiSummaries(prev => ({
          ...prev,
          [property.id]: summary
        }));
        
        // Mark property as analyzed
        setAnalyzedProperties(prev => {
          const newSet = new Set(prev);
          newSet.add(property.id);
          return newSet;
        });
      } else {
        setAiAnalysis({ 
          property, 
          analysis: "I'm unable to analyze this property right now. Please try again later." 
        });
      }
    } catch (error: any) {
      setAiAnalysis({ 
        property, 
        analysis: "I'm having trouble connecting right now. Please check your connection and try again." 
      });
    } finally {
      setIsLoadingAI(false);
    }
  };

  const testJSONResponse = async () => {
    setIsTesting(true);
    try {
      const response = await fetch('/api/test-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });

      const data = await response.json();
      if (data.success) {
        setTestResult("✅ " + data.message);
      } else {
        setTestResult("❌ JSON test failed");
      }
    } catch (error: any) {
      console.error("JSON test error:", error);
      setTestResult("❌ Connection failed: " + error.message);
    } finally {
      setIsTesting(false);
    }
  };

  const testOpenAIConnection = async () => {
    setIsTesting(true);
    try {
      const response = await fetch('/api/test-openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });

      const data = await response.json();
      if (data.success) {
        setTestResult("✅ " + data.message);
      } else {
        setTestResult("❌ Connection failed: " + data.error);
      }
    } catch (error: any) {
      console.error("OpenAI test error:", error);
      setTestResult("❌ Connection failed: " + error.message);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3 mb-4">
              <Search className="w-8 h-8 text-blue-600" />
              {isConsumerMode ? 'Property Discovery' : 'Construction Lead Finder'}
            </h1>
            <p className="text-slate-600 mb-6">
              {isConsumerMode 
                ? 'Find investment properties and analyze flip potential with AI-powered insights'
                : 'Discover renovation projects and assess bidding opportunities'
              }
            </p>
            
            {/* Enhanced Search & Filter Controls */}
            <div className="max-w-6xl mx-auto bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              {/* Search Mode Tabs */}
              <div className="flex mb-6 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setSearchMode('zipcode')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    searchMode === 'zipcode'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Search by ZIP Code
                </button>
                <button
                  onClick={() => setSearchMode('url')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    searchMode === 'url'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <ExternalLink className="w-4 h-4 inline mr-2" />
                  Analyze Property URL
                </button>
              </div>

              {/* ZIP Code Search */}
              {searchMode === 'zipcode' && (
                <div className="flex gap-3 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Search by ZIP code, address, or neighborhood..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button
                    onClick={handleFindLocalListings}
                    disabled={isLoadingListings}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoadingListings ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Finding...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Search className="w-4 h-4" />
                        Find Local Listings
                      </div>
                    )}
                  </Button>
                </div>
              )}

              {/* URL Analysis */}
              {searchMode === 'url' && (
                <div className="mb-6">
                  <div className="flex gap-3 mb-3">
                    <div className="flex-1 relative">
                      <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        placeholder="Paste Zillow, Realtor.com, or other property listing URL..."
                        value={propertyUrl}
                        onChange={(e) => setPropertyUrl(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button
                      onClick={handleAnalyzeUrl}
                      disabled={isAnalyzingUrl || !propertyUrl.trim()}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isAnalyzingUrl ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Analyzing...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          Analyze Property
                        </div>
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">
                    🎯 Paste a property listing URL to get instant AI analysis with flip potential, renovation estimates, and market insights
                  </p>
                </div>
              )}

              {/* Advanced Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Price Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceFilter.min}
                      onChange={(e) => setPriceFilter(prev => ({ ...prev, min: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceFilter.max}
                      onChange={(e) => setPriceFilter(prev => ({ ...prev, max: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Home className="w-4 h-4 inline mr-1" />
                    Square Feet
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={sqftFilter.min}
                      onChange={(e) => setSqftFilter(prev => ({ ...prev, min: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={sqftFilter.max}
                      onChange={(e) => setSqftFilter(prev => ({ ...prev, max: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Days on Market: {daysOnMarketFilter}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="365"
                    value={daysOnMarketFilter}
                    onChange={(e) => setDaysOnMarketFilter(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0</span>
                    <span>365+</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="latest">Latest Listings</option>
                    <option value="roi">ROI Potential</option>
                    <option value="price">Price (Low to High)</option>
                    <option value="distance">Days on Market</option>
                    <option value="aiScore">AI Flip Score</option>
                  </select>
                </div>
              </div>
              
              {(searchQuery || priceFilter.min || priceFilter.max || sqftFilter.min || sqftFilter.max) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Showing {sortedProperties.length} properties
                      {searchQuery && ` matching "${searchQuery}"`}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchQuery("");
                        setPriceFilter({ min: "", max: "" });
                        setSqftFilter({ min: "", max: "" });
                        setDaysOnMarketFilter(365);
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        {properties.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 mb-8">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Properties Loaded
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Enter a ZIP code and click "Find Local Listings" to discover 5 flip opportunities in your area
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Try ZIP codes like: 90210, 60614, 20815, or 10001
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {sortedProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isConsumerMode={isConsumerMode}
                onAIAnalysis={handleAIAnalysis}
                isAnalyzed={analyzedProperties.has(property.id)}
                flipScore={flipScores[property.id]}
                aiSummary={aiSummaries[property.id]}
              />
            ))}
          </div>
        )}

        {/* AI Analysis Dialog */}
        {aiAnalysis && (
          <Dialog open={!!aiAnalysis} onOpenChange={() => setAiAnalysis(null)}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className={`w-5 h-5 ${isConsumerMode ? 'text-green-600' : 'text-blue-600'}`} />
                  {isConsumerMode ? 'Flip Analysis' : 'Bidding Assessment'}
                </DialogTitle>
                <div className="flex items-center justify-between">
                  <DialogDescription>
                    AI analysis for {aiAnalysis.property.address}
                  </DialogDescription>
                  {aiAnalysis.loadTime && (
                    <Badge variant="secondary" className="text-xs">
                      Generated in {aiAnalysis.loadTime}s
                    </Badge>
                  )}
                </div>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className={`p-4 bg-gradient-to-r ${isConsumerMode ? 'from-green-50 to-blue-50' : 'from-blue-50 to-purple-50'} rounded-lg`}>
                  <div className="prose prose-sm max-w-none">
                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {aiAnalysis.analysis}
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 text-center">
                  ⚡ AI beta - results may vary
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Loading AI Analysis */}
        {isLoadingAI && (
          <Dialog open={isLoadingAI}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div className={`w-5 h-5 border-2 ${isConsumerMode ? 'border-green-600' : 'border-blue-600'} border-t-transparent rounded-full animate-spin`} />
                  {isConsumerMode ? 'Analyzing Investment Potential...' : 'Assessing Bidding Opportunity...'}
                </DialogTitle>
                <DialogDescription>
                  Our AI is reviewing the property details and market data
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}

        {/* URL Property Analysis Results */}
        {urlProperty && (
          <div className="mt-8 mb-8">
            <Card className="border-2 border-green-100 bg-gradient-to-r from-green-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-900">
                  <Target className="w-5 h-5" />
                  Property Analysis Results
                </CardTitle>
                <CardDescription className="text-green-700">
                  AI-analyzed properties with viability scores and flip potential
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Property Card */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{urlProperty.address}</h3>
                        <p className="text-sm text-gray-600">Owner: Property from URL</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          AI Score: {flipScores[urlProperty.id]?.score || 85}/100
                        </Badge>
                        <Button
                          onClick={() => handleAIFlipAnalysis(urlProperty)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          size="sm"
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          Get AI Flip Opinion
                        </Button>
                        <Badge variant="secondary" className="bg-red-100 text-red-800">HOT</Badge>
                      </div>
                    </div>

                    {/* Property Details Row */}
                    <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">List: ${urlProperty.price.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Building className="w-4 h-4 text-gray-500" />
                        <span>Est: ${urlProperty.estimatedARV?.toLocaleString() || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Home className="w-4 h-4 text-gray-500" />
                        <span>{urlProperty.sqft.toLocaleString()} sq ft</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>{urlProperty.bedrooms}bd / {urlProperty.bathrooms}ba</span>
                      </div>
                    </div>

                    {/* AI Insights */}
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-900">AI Insights</span>
                      </div>
                      <p className="text-sm text-blue-800">
                        {aiSummaries[urlProperty.id]?.summary || "Excellent flip opportunity in desirable area. Property needs kitchen and bathroom updates but has great bones. Strong market with consistent appreciation."}
                      </p>
                    </div>

                    {/* Flip Analysis */}
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-medium text-green-900 mb-3">Flip Analysis</h4>
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-green-800">${urlProperty.estimatedARV?.toLocaleString() || '650,000'}</div>
                          <div className="text-xs text-green-600">ARV</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-800">$85,000</div>
                          <div className="text-xs text-green-600">Rehab Cost</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-800">$60,000</div>
                          <div className="text-xs text-green-600">Profit</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-800">12.8%</div>
                          <div className="text-xs text-green-600">ROI</div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                      <Badge variant="outline" className="text-xs">Public Listing</Badge>
                      <Badge variant="outline" className="text-xs bg-blue-50">new</Badge>
                      <div className="ml-auto flex gap-2">
                        <Button variant="outline" size="sm">
                          <Phone className="w-4 h-4 mr-1" />
                          Call
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="w-4 h-4 mr-1" />
                          Email
                        </Button>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Save className="w-4 h-4 mr-1" />
                          Save Lead
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Local Market Insights Section */}
        {(() => {
          // Extract ZIP code from search query (5 digits) or URL property ZIP
          const zipMatch = searchQuery.match(/\b\d{5}\b/);
          const extractedZip = zipMatch ? zipMatch[0] : (urlProperty?.zipCode || null);
          
          return extractedZip && (
            <div className="mt-12 mb-8">
              <Card className="border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-900">
                    <MapPin className="w-5 h-5" />
                    Local Market Insights
                  </CardTitle>
                  <CardDescription className="text-blue-700">
                    Updated weekly using AI and current cost data for ZIP {extractedZip}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LocalMarketInsights zipCode={extractedZip} />
                </CardContent>
              </Card>
            </div>
          );
        })()}


      </div>
      
      {/* Feedback Button */}
      <FeedbackButton toolName={isConsumerMode ? "Property Discovery" : "Construction Lead Finder"} />
    </div>
  );
}
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FeedbackButton from "@/components/feedback-button";
import { useLocation } from "wouter";
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
  Calendar
} from "lucide-react";

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

function PropertyCard({ property, isConsumerMode, onAIAnalysis, isAnalyzed }: { 
  property: PropertyListing; 
  isConsumerMode: boolean;
  onAIAnalysis: (property: PropertyListing) => void;
  isAnalyzed: boolean;
}) {
  const pricePerSqft = Math.round(property.price / property.sqft);
  const potentialProfit = property.estimatedARV ? property.estimatedARV - property.price : 0;
  const roiPercentage = property.estimatedARV ? Math.round(((property.estimatedARV - property.price) / property.price) * 100) : 0;

  return (
    <Card className="hover:shadow-lg transition-shadow">
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
          {property.renovationScope && (
            <Badge 
              className={getScopeColor(property.renovationScope)}
              title={getScopeTooltip(property.renovationScope)}
            >
              {property.renovationScope}
            </Badge>
          )}
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

        {/* AI Analysis Badge */}
        {isAnalyzed && (
          <div className="flex justify-center">
            <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 text-xs rounded-full">
              🧠 AI: Good Flip 👍
            </span>
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
  const [properties, setProperties] = useState<PropertyListing[]>(mockPropertyListings);
  const [isSearching, setIsSearching] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{property: PropertyListing, analysis: string, loadTime?: string} | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [testResult, setTestResult] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [sortBy, setSortBy] = useState("latest");
  const [analyzedProperties, setAnalyzedProperties] = useState<Set<string>>(new Set());

  // Real-time search filtering
  const filteredProperties = properties.filter(property => 
    property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.zipCode.includes(searchQuery) ||
    property.propertyType.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      default:
        return b.daysOnMarket - a.daysOnMarket; // Latest (newest listings first)
    }
  });

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
            
            {/* Search & Sort Controls */}
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-3 mb-4">
                <Input
                  placeholder="Search by ZIP or neighborhood"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <select 
                  className="px-3 py-2 border rounded-md bg-white min-w-[140px]"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="latest">Sort by: Latest</option>
                  <option value="roi">ROI</option>
                  <option value="price">Price</option>
                  <option value="distance">Distance</option>
                </select>
              </div>
              
              {searchQuery && (
                <div className="text-center text-sm text-slate-600 mb-4">
                  Showing {sortedProperties.length} properties matching "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {sortedProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isConsumerMode={isConsumerMode}
              onAIAnalysis={handleAIAnalysis}
              isAnalyzed={analyzedProperties.has(property.id)}
            />
          ))}
        </div>

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

        {/* Test Buttons - Hidden in demo mode */}
        {!import.meta.env.VITE_DEMO_MODE && (
          <div className="mt-16 pt-6 border-t border-gray-200">
            <div className="text-center text-xs text-gray-400 mb-3">Development Tools</div>
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={testJSONResponse}
                disabled={isTesting}
                variant="outline"
                size="sm"
                className="text-xs text-gray-500 border-gray-300"
              >
                {isTesting ? "Testing..." : "Test JSON Response"}
              </Button>
              
              <Button 
                onClick={testOpenAIConnection}
                disabled={isTesting}
                variant="outline"
                size="sm"
                className="text-xs text-gray-500 border-gray-300"
              >
                {isTesting ? "Testing..." : "Test AI Connection"}
              </Button>
            </div>
            
            {testResult && (
              <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600 max-w-md mx-auto">
                {testResult}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Feedback Button */}
      <FeedbackButton toolName={isConsumerMode ? "Property Discovery" : "Construction Lead Finder"} />
    </div>
  );
}
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Home, MapPin, Calendar, DollarSign, Bed, Bath, Square, TrendingUp, ChevronLeft, ChevronRight, Star, Target, PieChart, Building, FileSearch, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AIFlipFeedback from "@/components/ai-flip-feedback";
import { FlipOpinionPDFExport } from "@/components/pdf-export";

interface Listing {
  id: string;
  address: string;
  price: number;
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  daysOnMarket: number;
  status: string;
  zipCode: string;
  description?: string;
  aiSummary?: string;
  listingUrl?: string;
  photos?: string[];
}

export default function RealEstateListings() {
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [maxDaysOnMarket, setMaxDaysOnMarket] = useState("");
  const [minBedrooms, setMinBedrooms] = useState("");
  const [minBathrooms, setMinBathrooms] = useState("");
  const [zipCode, setZipCode] = useState("20895"); // Kensington, MD default
  const [flipOpinions, setFlipOpinions] = useState<Record<string, string>>({});
  const [currentRecommendation, setCurrentRecommendation] = useState(0);
  const [activeTab, setActiveTab] = useState("listings");
  const { toast } = useToast();

  const { data: listings, isLoading, refetch } = useQuery({
    queryKey: ['/api/real-estate-listings', {
      priceMin: priceMin || undefined,
      priceMax: priceMax || undefined,
      maxDaysOnMarket: maxDaysOnMarket || undefined,
      minBedrooms: minBedrooms || undefined,
      minBathrooms: minBathrooms || undefined,
      zipCode
    }],
    enabled: true
  });

  const handleSearch = () => {
    refetch();
    toast({
      title: "Searching Listings",
      description: `Finding properties in ${zipCode} with your criteria...`,
    });
  };

  const generateFlipOpinion = async (listing: Listing) => {
    try {
      const response = await fetch("/api/ai-flip-opinion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Store the flip opinion locally for immediate display
        setFlipOpinions(prev => ({
          ...prev,
          [listing.id]: data.flipOpinion
        }));
        
        toast({
          title: "AI Flip Opinion Generated",
          description: "House flipper analysis complete",
        });
      } else {
        toast({
          title: "Analysis Error",
          description: data.error || "Failed to generate flip opinion",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Analysis Error",
        description: "Failed to generate flip opinion",
        variant: "destructive",
      });
    }
  };

  // Generate personalized recommendations based on user behavior and preferences
  const getPersonalizedRecommendations = () => {
    if (!listings || !Array.isArray(listings)) return [];
    
    // Smart recommendation logic based on market insights
    const recommendations = listings.map(listing => {
      const pricePerSqft = Math.round(listing.price / (listing.sqft || 1));
      let score = 0;
      let reasons = [];
      
      // Score based on price per sqft (lower is better for flipping)
      if (pricePerSqft < 250) {
        score += 30;
        reasons.push("Great value at $" + pricePerSqft + "/sqft");
      } else if (pricePerSqft < 300) {
        score += 20;
        reasons.push("Good value opportunity");
      }
      
      // Score based on days on market (higher = more negotiation power)
      if (listing.daysOnMarket > 45) {
        score += 25;
        reasons.push("High negotiation potential");
      } else if (listing.daysOnMarket > 30) {
        score += 15;
        reasons.push("Motivated seller likely");
      }
      
      // Score based on description keywords
      if (listing.description?.includes('needs') || listing.description?.includes('update')) {
        score += 20;
        reasons.push("Clear value-add opportunity");
      }
      
      // Bonus for Kensington area
      if (listing.address.includes('Kensington')) {
        score += 15;
        reasons.push("Prime Kensington location");
      }
      
      return {
        ...listing,
        score,
        reasons: reasons.slice(0, 2) // Top 2 reasons
      };
    });
    
    return recommendations.sort((a, b) => b.score - a.score).slice(0, 3);
  };

  const recommendations = getPersonalizedRecommendations();
  
  const nextRecommendation = () => {
    setCurrentRecommendation((prev) => (prev + 1) % recommendations.length);
  };
  
  const prevRecommendation = () => {
    setCurrentRecommendation((prev) => (prev - 1 + recommendations.length) % recommendations.length);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center justify-center gap-3">
          <Building className="h-8 w-8 text-blue-600" />
          Property Intelligence Hub
        </h1>
        <p className="text-slate-600">
          Complete real estate platform: Listings + ROI + Permits + Portfolio
        </p>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="listings" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Property Listings
          </TabsTrigger>
          <TabsTrigger value="roi" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            ROI Calculator
          </TabsTrigger>
          <TabsTrigger value="permits" className="flex items-center gap-2">
            <FileSearch className="h-4 w-4" />
            Permit Lookup
          </TabsTrigger>
          <TabsTrigger value="portfolio" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Flip Portfolio
          </TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="space-y-6">

      {/* Personalized Property Recommendations */}
      {recommendations.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Recommended for You
            </CardTitle>
            <CardDescription>
              Properties selected based on your preferences and market opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Carousel Navigation */}
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevRecommendation}
                  disabled={recommendations.length <= 1}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-2">
                  {recommendations.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentRecommendation ? 'bg-blue-600' : 'bg-blue-200'
                      }`}
                    />
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextRecommendation}
                  disabled={recommendations.length <= 1}
                  className="flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Current Recommendation */}
              {recommendations[currentRecommendation] && (
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        {recommendations[currentRecommendation].address}
                      </h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          ${recommendations[currentRecommendation].price.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {recommendations[currentRecommendation].daysOnMarket} days
                        </span>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      <Star className="h-3 w-3 mr-1" />
                      Recommended
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Bed className="h-4 w-4 text-slate-500" />
                      {recommendations[currentRecommendation].bedrooms} bed
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="h-4 w-4 text-slate-500" />
                      {recommendations[currentRecommendation].bathrooms} bath
                    </div>
                    <div className="flex items-center gap-1">
                      <Square className="h-4 w-4 text-slate-500" />
                      {recommendations[currentRecommendation].sqft?.toLocaleString()} sqft
                    </div>
                    <div className="text-slate-600">
                      ${Math.round(recommendations[currentRecommendation].price / (recommendations[currentRecommendation].sqft || 1))}/sqft
                    </div>
                  </div>

                  {/* Why Recommended */}
                  <div className="bg-blue-50 p-3 rounded-lg mb-3">
                    <h4 className="font-medium text-blue-900 mb-2">Why We Recommend This:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      {recommendations[currentRecommendation].reasons?.map((reason, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateFlipOpinion(recommendations[currentRecommendation])}
                      className="flex items-center gap-2"
                    >
                      <TrendingUp className="h-4 w-4" />
                      Get AI Flip Opinion
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      View Details
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600" />
            Search Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Zip Code</label>
              <Input
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="20895"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Min Price</label>
              <Input
                type="number"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                placeholder="300000"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Max Price</label>
              <Input
                type="number"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                placeholder="800000"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Max Days on Market</label>
              <Input
                type="number"
                value={maxDaysOnMarket}
                onChange={(e) => setMaxDaysOnMarket(e.target.value)}
                placeholder="90"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Min Bedrooms</label>
              <Select value={minBedrooms} onValueChange={setMinBedrooms}>
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Min Bathrooms</label>
              <Select value={minBathrooms} onValueChange={setMinBathrooms}>
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleSearch} className="w-full flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search Properties
          </Button>
        </CardContent>
      </Card>

      {/* Listings Results */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading listings...</p>
        </div>
      )}

      {listings && listings.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {listings.map((listing: Listing) => (
            <Card key={listing.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      {listing.address}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        ${listing.price.toLocaleString()}
                      </span>
                      <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>
                        {listing.status}
                      </Badge>
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <Calendar className="h-4 w-4" />
                      {listing.daysOnMarket} days
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Property Details */}
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-1">
                    <Bed className="h-4 w-4 text-slate-500" />
                    {listing.bedrooms} bed
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="h-4 w-4 text-slate-500" />
                    {listing.bathrooms} bath
                  </div>
                  <div className="flex items-center gap-1">
                    <Square className="h-4 w-4 text-slate-500" />
                    {listing.sqft?.toLocaleString()} sqft
                  </div>
                  <div className="text-slate-600">
                    ${Math.round(listing.price / (listing.sqft || 1))}/sqft
                  </div>
                </div>

                {/* AI Flip Opinion */}
                {(listing.aiSummary || flipOpinions[listing.id]) ? (
                  <div className="space-y-3">
                    <div id={`flip-analysis-${listing.id}`} className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-orange-600" />
                          <span className="text-sm font-medium text-orange-800">Professional Flip Analysis</span>
                        </div>
                        <FlipOpinionPDFExport 
                          propertyAddress={listing.address}
                          elementId={`flip-analysis-${listing.id}`}
                        />
                      </div>
                      <div className="text-sm text-orange-700 whitespace-pre-line mb-3">
                        {flipOpinions[listing.id] || listing.aiSummary}
                      </div>
                      <div className="text-xs text-orange-600 border-t border-orange-200 pt-2">
                        Analysis generated by Shall's Construction Smart Tools
                      </div>
                    </div>
                    
                    {/* AI Flip Feedback */}
                    <AIFlipFeedback
                      listingId={listing.id}
                      listingAddress={listing.address}
                      onFeedbackSubmitted={(feedback) => {
                        toast({
                          title: "Thank you!",
                          description: "Your feedback helps improve our AI analysis.",
                        });
                      }}
                    />
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generateFlipOpinion(listing)}
                    className="w-full flex items-center gap-2 border-orange-200 hover:bg-orange-50"
                  >
                    <TrendingUp className="h-4 w-4" />
                    AI Flip Opinion
                  </Button>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  {listing.listingUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={listing.listingUrl} target="_blank" rel="noopener noreferrer">
                        View Listing
                      </a>
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    Save to Prospects
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {listings && listings.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-8">
            <Home className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No listings found</h3>
            <p className="text-slate-600">Try adjusting your search criteria to see more results.</p>
          </CardContent>
        </Card>
      )}
        </TabsContent>

        {/* ROI Calculator Tab */}
        <TabsContent value="roi" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-green-600" />
                Investment ROI Calculator
              </CardTitle>
              <CardDescription>
                Calculate potential returns on your real estate investments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Purchase Price</label>
                  <Input placeholder="$350,000" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Renovation Budget</label>
                  <Input placeholder="$50,000" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Expected Sale Price</label>
                  <Input placeholder="$475,000" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Holding Period (months)</label>
                  <Input placeholder="6" />
                </div>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Calculate ROI
              </Button>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Projected Returns</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Gross Profit:</span>
                    <span className="font-semibold ml-2">$75,000</span>
                  </div>
                  <div>
                    <span className="text-slate-600">ROI:</span>
                    <span className="font-semibold ml-2 text-green-600">18.8%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permit Lookup Tab */}
        <TabsContent value="permits" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSearch className="h-5 w-5 text-blue-600" />
                Permit & Inspection Lookup
              </CardTitle>
              <CardDescription>
                Search permit requirements and inspection schedules for properties
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Property Address</label>
                  <Input placeholder="123 Main St, Kensington, MD" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Project Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kitchen">Kitchen Renovation</SelectItem>
                      <SelectItem value="bathroom">Bathroom Renovation</SelectItem>
                      <SelectItem value="addition">Room Addition</SelectItem>
                      <SelectItem value="electrical">Electrical Work</SelectItem>
                      <SelectItem value="plumbing">Plumbing Work</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Search Permits
              </Button>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Required Permits</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    Building Permit - $150
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    Electrical Permit - $75
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    Plumbing Permit - $50
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Flip Portfolio Tab */}
        <TabsContent value="portfolio" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-purple-600" />
                Flip Portfolio Manager
              </CardTitle>
              <CardDescription>
                Track and manage your active house flipping projects
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Add New Project
              </Button>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">4715 Kent St</h3>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Purchase:</span>
                      <span className="font-semibold ml-2">$320,000</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Renovation:</span>
                      <span className="font-semibold ml-2">$45,000</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Target Sale:</span>
                      <span className="font-semibold ml-2">$450,000</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Days Active:</span>
                      <span className="font-semibold ml-2">45</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>65%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{width: '65%'}}></div>
                    </div>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">8902 Flower Ave</h3>
                    <Badge className="bg-blue-100 text-blue-800">Planning</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Purchase:</span>
                      <span className="font-semibold ml-2">$290,000</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Est. Renovation:</span>
                      <span className="font-semibold ml-2">$35,000</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Target Sale:</span>
                      <span className="font-semibold ml-2">$415,000</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Est. ROI:</span>
                      <span className="font-semibold ml-2 text-green-600">27.7%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
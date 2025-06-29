import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import FeedbackButton from "@/components/feedback-button";
import { 
  Target, 
  MapPin, 
  Building, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Search,
  Phone,
  Mail,
  ExternalLink,
  Sparkles,
  Clock,
  CheckCircle,
  Star,
  Heart,
  Bookmark,
  Edit3,
  Calendar,
  Database,
  BarChart3,
  Filter,
  Save,
  RefreshCw,
  Home,
  Zap
} from "lucide-react";

interface PropertyLead {
  id: string;
  propertyAddress: string;
  ownerName?: string;
  listingPrice?: number;
  estimatedValue: number;
  squareFootage?: number;
  bedrooms?: number;
  bathrooms?: number;
  yearBuilt?: number;
  projectType: string;
  leadSource: 'public-listing' | 'internal-lead';
  aiViabilityScore: number;
  aiInsights: string;
  flipPotential?: {
    arv: number;
    estimatedRehab: number;
    projectedProfit: number;
    roi: number;
  };
  crmStatus: 'cold' | 'warm' | 'hot';
  contactInfo: {
    phone?: string;
    email?: string;
  };
  notes: string;
  lastContact?: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal-sent' | 'won' | 'lost';
  tags: string[];
  dateAdded: string;
  isSaved: boolean;
}

interface PropertySearchResult {
  leads: PropertyLead[];
  marketInsights: string;
  totalPotentialValue: number;
}

export default function LeadFinder() {
  const [searchType, setSearchType] = useState<'area' | 'property'>('area');
  const [zipCode, setZipCode] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [serviceRadius, setServiceRadius] = useState("10");
  const [projectTypes, setProjectTypes] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [leadSource, setLeadSource] = useState<'all' | 'public-listing' | 'internal-lead'>('all');
  const [results, setResults] = useState<PropertySearchResult | null>(null);
  const [savedLeads, setSavedLeads] = useState<PropertyLead[]>([]);
  const [activeTab, setActiveTab] = useState('search');
  const [isSearching, setIsSearching] = useState(false);
  const [filterCrmStatus, setFilterCrmStatus] = useState<'all' | 'cold' | 'warm' | 'hot'>('all');
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  
  // Lead Strategy Generation State
  const [strategyLocation, setStrategyLocation] = useState("");
  const [strategyServiceType, setStrategyServiceType] = useState("");
  const [strategyBudget, setStrategyBudget] = useState("");
  const [strategyTimeframe, setStrategyTimeframe] = useState("");
  const [strategyTargetAudience, setStrategyTargetAudience] = useState("");
  const [leadStrategies, setLeadStrategies] = useState<{
    strategies: string[];
    channels: string[];
    sampleMessages: string[];
    nextSteps: string[];
  } | null>(null);
  const [isGeneratingStrategies, setIsGeneratingStrategies] = useState(false);
  
  // AI Flip Analysis State
  const [flipAnalyses, setFlipAnalyses] = useState<{[key: string]: any}>({});
  const [loadingFlipAnalysis, setLoadingFlipAnalysis] = useState<{[key: string]: boolean}>({});
  
  const { toast } = useToast();

  const projectTypeOptions = [
    { id: 'kitchen', name: 'Kitchen Remodels' },
    { id: 'bathroom', name: 'Bathroom Renovations' },
    { id: 'additions', name: 'Home Additions' },
    { id: 'basements', name: 'Basement Finishing' },
    { id: 'roofing', name: 'Roofing Projects' },
    { id: 'siding', name: 'Siding & Exterior' },
    { id: 'flooring', name: 'Flooring Installation' },
    { id: 'windows', name: 'Window Replacement' },
    { id: 'decks', name: 'Deck & Patio' },
    { id: 'whole-home', name: 'Whole Home Renovations' }
  ];

  // Generate location-specific properties based on ZIP code
  const generatePropertiesForZip = (zip: string): PropertySearchResult => {
    // ZIP code 20895 - Kensington, MD area
    if (zip === '20895') {
      return {
        leads: [
          {
            id: '1',
            propertyAddress: '4523 Knowles Avenue, Kensington, MD 20895',
            ownerName: 'Williams Family Trust',
            listingPrice: 675000,
            estimatedValue: 820000,
            squareFootage: 2100,
            bedrooms: 4,
            bathrooms: 2,
            yearBuilt: 1962,
            projectType: 'Kitchen & Bath Renovation',
            leadSource: 'public-listing',
            aiViabilityScore: 89,
            aiInsights: 'Excellent flip opportunity in highly desirable Kensington area. Property needs kitchen and bathroom updates but has great bones. Strong Montgomery County market with consistent appreciation.',
            flipPotential: {
              arv: 820000,
              estimatedRehab: 85000,
              projectedProfit: 60000,
              roi: 12.8
            },
            crmStatus: 'hot',
            contactInfo: {
              phone: '(301) 555-4567',
              email: 'contact@williamstrust.com'
            },
            notes: '',
            status: 'new',
            tags: ['flip-potential', 'montgomery-county'],
            dateAdded: '2025-05-27',
            isSaved: false
          },
          {
            id: '2',
            propertyAddress: '10234 Connecticut Avenue, Kensington, MD 20895',
            ownerName: 'Margaret & Robert Chen',
            estimatedValue: 550000,
            squareFootage: 1650,
            bedrooms: 3,
            bathrooms: 1,
            yearBuilt: 1955,
            projectType: 'Full Renovation',
            leadSource: 'internal-lead',
            aiViabilityScore: 76,
            aiInsights: 'Good potential for major renovation. Homeowner interested in updating entire home before selling. Located on desirable Connecticut Avenue corridor.',
            crmStatus: 'warm',
            contactInfo: {
              phone: '(301) 555-9876'
            },
            notes: 'Homeowner wants full renovation quote. Budget around $120k.',
            lastContact: '2025-05-25',
            status: 'contacted',
            tags: ['full-renovation', 'owner-occupied'],
            dateAdded: '2025-05-25',
            isSaved: false
          },
          {
            id: '3',
            propertyAddress: '3801 Saul Road, Kensington, MD 20895',
            ownerName: 'Thompson Estate',
            listingPrice: 525000,
            estimatedValue: 650000,
            squareFootage: 1850,
            bedrooms: 3,
            bathrooms: 2,
            yearBuilt: 1948,
            projectType: 'Basement Finishing & Kitchen',
            leadSource: 'public-listing',
            aiViabilityScore: 82,
            aiInsights: 'Estate sale with excellent renovation potential. Unfinished basement offers expansion opportunity. Close to Metro and Rock Creek Park.',
            flipPotential: {
              arv: 650000,
              estimatedRehab: 70000,
              projectedProfit: 55000,
              roi: 15.7
            },
            crmStatus: 'hot',
            contactInfo: {
              phone: '(301) 555-3210',
              email: 'estate@thompsonlaw.com'
            },
            notes: '',
            status: 'new',
            tags: ['estate-sale', 'basement-potential'],
            dateAdded: '2025-05-26',
            isSaved: false
          }
        ],
        marketInsights: 'Kensington, MD (20895) is a highly desirable Montgomery County location with strong property values. Average flip margins: 12-18%. Kitchen/bath renovations and basement finishing show highest ROI. Close proximity to DC Metro makes this area very attractive to buyers.',
        totalPotentialValue: 2020000
      };
    }

    // Default properties for other ZIP codes
    return {
      leads: [
        {
          id: '1',
          propertyAddress: `123 Main Street, ZIP ${zip}`,
          ownerName: 'Local Property Owner',
          listingPrice: 350000,
          estimatedValue: 425000,
          squareFootage: 1650,
          bedrooms: 3,
          bathrooms: 2,
          yearBuilt: 1980,
          projectType: 'Kitchen Renovation',
          leadSource: 'public-listing',
          aiViabilityScore: 75,
          aiInsights: `Property in ZIP ${zip} area with good renovation potential. Market analysis shows steady appreciation in this location.`,
          flipPotential: {
            arv: 425000,
            estimatedRehab: 45000,
            projectedProfit: 30000,
            roi: 14.2
          },
          crmStatus: 'warm',
          contactInfo: {
            phone: '(555) 123-0000'
          },
          notes: '',
          status: 'new',
          tags: ['local-market'],
          dateAdded: '2025-05-27',
          isSaved: false
        }
      ],
      marketInsights: `Properties in ZIP ${zip} showing moderate renovation potential. Recommend focusing on kitchen and bathroom updates for best ROI.`,
      totalPotentialValue: 425000
    };
  };

  const handleSearch = async () => {
    if (searchType === 'area' && !zipCode) {
      toast({
        title: "Missing Information",
        description: "Please enter a zip code for area search.",
        variant: "destructive"
      });
      return;
    }

    if (searchType === 'property' && !propertyAddress) {
      toast({
        title: "Missing Information", 
        description: "Please enter a property address.",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    
    try {
      // Convert price range to min/max values
      let minPrice, maxPrice;
      if (priceRange && priceRange !== "all") {
        const [min, max] = priceRange.split('-');
        minPrice = parseInt(min.replace(/[^\d]/g, ''));
        maxPrice = max ? parseInt(max.replace(/[^\d]/g, '')) : undefined;
      }

      const response = await fetch('/api/search-properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          zipCode,
          minPrice,
          maxPrice,
          propertyTypes: projectTypes
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.needsApiKey) {
          toast({
            title: "API Configuration Required",
            description: "RealtyMole API key needed for property data. Using local property information instead.",
            variant: "default"
          });
          // Fall back to local data
          const locationResults = generatePropertiesForZip(zipCode);
          setResults(locationResults);
        } else {
          throw new Error(data.error || 'Failed to search properties');
        }
      } else {
        // Use real property data from RealtyMole
        setResults({
          leads: data.leads,
          marketInsights: data.marketInsights,
          totalPotentialValue: data.totalPotentialValue
        });
        
        toast({
          title: "Properties Found!",
          description: `Found ${data.leads.length} properties with real market data from RealtyMole.`,
        });
      }
    } catch (error) {
      console.error('Property search failed:', error);
      toast({
        title: "Search Error",
        description: "Unable to fetch property data. Please try again.",
        variant: "destructive"
      });
      
      // Fall back to local data for demo purposes
      const locationResults = generatePropertiesForZip(zipCode);
      setResults(locationResults);
    } finally {
      setIsSearching(false);
    }
  };

  const toggleProjectType = (typeId: string) => {
    setProjectTypes(prev => 
      prev.includes(typeId) 
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  const saveLead = (lead: PropertyLead) => {
    const updatedLead = { ...lead, isSaved: true, dateAdded: new Date().toISOString().split('T')[0] };
    setSavedLeads(prev => [...prev, updatedLead]);
    toast({
      title: "Lead Saved!",
      description: `${lead.propertyAddress} has been added to your lead tracker.`,
    });
  };

  const updateLead = (leadId: string, updates: Partial<PropertyLead>) => {
    setSavedLeads(prev => 
      prev.map(lead => 
        lead.id === leadId ? { ...lead, ...updates } : lead
      )
    );
    toast({
      title: "Lead Updated!",
      description: "Lead information has been updated successfully.",
    });
  };

  const getViabilityScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-700 bg-green-100';
    if (score >= 60) return 'text-blue-700 bg-blue-100';
    if (score >= 40) return 'text-yellow-700 bg-yellow-100';
    return 'text-red-700 bg-red-100';
  };

  const getCrmStatusColor = (status: string) => {
    switch (status) {
      case 'hot': return 'bg-red-100 border-red-200 text-red-700';
      case 'warm': return 'bg-yellow-100 border-yellow-200 text-yellow-700';
      case 'cold': return 'bg-blue-100 border-blue-200 text-blue-700';
      default: return 'bg-gray-100 border-gray-200 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 border-blue-200 text-blue-700';
      case 'contacted': return 'bg-purple-100 border-purple-200 text-purple-700';
      case 'qualified': return 'bg-green-100 border-green-200 text-green-700';
      case 'proposal-sent': return 'bg-orange-100 border-orange-200 text-orange-700';
      case 'won': return 'bg-green-100 border-green-300 text-green-800';
      case 'lost': return 'bg-red-100 border-red-200 text-red-700';
      default: return 'bg-gray-100 border-gray-200 text-gray-700';
    }
  };

  const filteredSavedLeads = savedLeads.filter(lead => 
    filterCrmStatus === 'all' || lead.crmStatus === filterCrmStatus
  );

  // Generate lead strategies function
  const generateStrategiesMutation = useMutation({
    mutationFn: async (strategyData: any) => {
      const response = await apiRequest('POST', '/api/generate-lead-strategies', strategyData);
      return await response.json();
    },
    onSuccess: (data) => {
      setLeadStrategies(data);
      toast({
        title: "Strategies Generated!",
        description: "AI-powered lead generation strategies are ready.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate strategies. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleGenerateStrategies = () => {
    if (!strategyLocation || !strategyServiceType) {
      toast({
        title: "Missing Information",
        description: "Please enter location and service type.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingStrategies(true);
    generateStrategiesMutation.mutate({
      location: strategyLocation,
      serviceType: strategyServiceType,
      budget: strategyBudget,
      timeframe: strategyTimeframe,
      targetAudience: strategyTargetAudience
    });
  };

  // AI Flip Analysis function
  const generateFlipAnalysisMutation = useMutation({
    mutationFn: async (propertyData: any) => {
      try {
        const response = await fetch('/api/get-ai-flip-opinion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(propertyData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error('API request error:', error);
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      const propertyId = `${variables.address}-${variables.price}`;
      setFlipAnalyses(prev => ({
        ...prev,
        [propertyId]: data
      }));
      setLoadingFlipAnalysis(prev => ({
        ...prev,
        [propertyId]: false
      }));
      toast({
        title: "AI Analysis Complete!",
        description: "Detailed flip analysis is now available.",
      });
    },
    onError: (error: any, variables) => {
      const propertyId = `${variables.address}-${variables.price}`;
      setLoadingFlipAnalysis(prev => ({
        ...prev,
        [propertyId]: false
      }));
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to generate flip analysis. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleGetFlipOpinion = (lead: PropertyLead) => {
    const propertyId = `${lead.propertyAddress}-${lead.listingPrice}`;
    
    setLoadingFlipAnalysis(prev => ({
      ...prev,
      [propertyId]: true
    }));

    generateFlipAnalysisMutation.mutate({
      address: lead.propertyAddress,
      zipCode: "20895", // Default ZIP for demo
      price: lead.listingPrice || lead.estimatedValue || 0,
      squareFootage: lead.squareFootage || 0,
      bedrooms: lead.bedrooms || 0,
      bathrooms: lead.bathrooms || 0,
      daysOnMarket: 30, // Default for demo
      description: lead.notes || "",
      projectType: lead.projectType,
      yearBuilt: lead.yearBuilt || null
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 p-3 sm:p-6">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 sm:mb-3 px-2">🎯 Lead Discovery Tool</h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto px-4">
          Find potential projects and clients using AI-powered property analysis and lead generation with built-in CRM tracking.
        </p>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Property Search
          </TabsTrigger>
          <TabsTrigger value="strategies" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Strategy Generator
          </TabsTrigger>
          <TabsTrigger value="leads" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Lead Tracker ({filteredSavedLeads.length})
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Search Tab */}
        <TabsContent value="search" className="space-y-6">
          {/* Search Form */}
          <Card className="border-blue-200 bg-blue-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Search className="w-5 h-5" />
                Property Search & Analysis
              </CardTitle>
              <CardDescription className="text-blue-700">
                Find properties by area or analyze specific addresses with AI-powered viability scoring.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search Type Toggle */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-700">Search Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={searchType === 'area' ? "default" : "outline"}
                    onClick={() => setSearchType('area')}
                    className="flex items-center gap-2"
                  >
                    <MapPin className="w-4 h-4" />
                    Area Search
                  </Button>
                  <Button
                    variant={searchType === 'property' ? "default" : "outline"}
                    onClick={() => setSearchType('property')}
                    className="flex items-center gap-2"
                  >
                    <Home className="w-4 h-4" />
                    Specific Property
                  </Button>
                </div>
              </div>

              {searchType === 'area' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Target Zip Code *</label>
                    <Input
                      placeholder="e.g., 80201"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Service Radius</label>
                    <Select value={serviceRadius} onValueChange={setServiceRadius}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 miles</SelectItem>
                        <SelectItem value="10">10 miles</SelectItem>
                        <SelectItem value="15">15 miles</SelectItem>
                        <SelectItem value="25">25 miles</SelectItem>
                        <SelectItem value="50">50 miles</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Property Address *</label>
                  <Input
                    placeholder="e.g., 123 Main St, Denver, CO"
                    value={propertyAddress}
                    onChange={(e) => setPropertyAddress(e.target.value)}
                  />
                </div>
              )}

              {/* Price Range Filter */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Price Range (Optional)</label>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select price range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="0-300000">Under $300k</SelectItem>
                      <SelectItem value="300000-500000">$300k - $500k</SelectItem>
                      <SelectItem value="500000-750000">$500k - $750k</SelectItem>
                      <SelectItem value="750000-1000000">$750k - $1M</SelectItem>
                      <SelectItem value="1000000-">$1M+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Lead Source Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Lead Source</label>
                  <Select value={leadSource} onValueChange={setLeadSource}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      <SelectItem value="public-listing">Public Listings Only</SelectItem>
                      <SelectItem value="internal-lead">Internal Leads Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleSearch}
                disabled={isSearching}
                className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-lg"
              >
                {isSearching ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {searchType === 'area' ? 'Searching Properties...' : 'Analyzing Property...'}
                  </>
                ) : (
                  <>
                    <Target className="w-5 h-5 mr-2" />
                    {searchType === 'area' ? 'Find Properties' : 'Analyze Property'}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Search Results */}
          {results && (
            <div className="space-y-6">
              {/* Summary */}
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-700">{results.leads.length}</div>
                      <div className="text-green-600">Properties Found</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-700">
                        ${results.totalPotentialValue.toLocaleString()}
                      </div>
                      <div className="text-green-600">Total Potential Value</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-700">
                        {Math.round(results.leads.reduce((acc, lead) => acc + lead.aiViabilityScore, 0) / results.leads.length)}
                      </div>
                      <div className="text-green-600">Avg. AI Score</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Market Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    AI Market Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-slate-700">{results.marketInsights}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Properties List */}
              <Card>
                <CardHeader>
                  <CardTitle>Property Analysis Results</CardTitle>
                  <CardDescription>
                    AI-analyzed properties with viability scores and flip potential
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {results.leads.map((lead) => (
                      <div key={lead.id} className="border rounded-lg p-6 hover:bg-slate-50">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 text-lg">{lead.propertyAddress}</h3>
                            {lead.ownerName && (
                              <p className="text-slate-600">Owner: {lead.ownerName}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`font-bold ${getViabilityScoreColor(lead.aiViabilityScore)}`}>
                              AI Score: {lead.aiViabilityScore}/100
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleGetFlipOpinion(lead)}
                              disabled={loadingFlipAnalysis[`${lead.propertyAddress}-${lead.listingPrice}`]}
                              className="bg-blue-50 hover:bg-blue-100 border-blue-200"
                            >
                              {loadingFlipAnalysis[`${lead.propertyAddress}-${lead.listingPrice}`] ? (
                                <>
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-1"></div>
                                  Analyzing...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  Get AI Flip Opinion
                                </>
                              )}
                            </Button>
                            <Badge className={getCrmStatusColor(lead.crmStatus)}>
                              {lead.crmStatus.toUpperCase()}
                            </Badge>
                          </div>
                        </div>

                        {/* Property Details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          {lead.listingPrice && (
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-slate-500" />
                              <span className="text-sm text-slate-600">
                                List: ${lead.listingPrice.toLocaleString()}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-slate-500" />
                            <span className="text-sm text-slate-600">
                              Est: ${lead.estimatedValue.toLocaleString()}
                            </span>
                          </div>
                          {lead.squareFootage && (
                            <div className="flex items-center gap-2">
                              <Home className="w-4 h-4 text-slate-500" />
                              <span className="text-sm text-slate-600">
                                {lead.squareFootage.toLocaleString()} sq ft
                              </span>
                            </div>
                          )}
                          {lead.bedrooms && lead.bathrooms && (
                            <div className="text-sm text-slate-600">
                              {lead.bedrooms}bd / {lead.bathrooms}ba
                            </div>
                          )}
                        </div>

                        {/* AI Insights */}
                        <div className="bg-blue-50 p-4 rounded-lg mb-4">
                          <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            AI Insights
                          </h4>
                          <p className="text-sm text-blue-800">{lead.aiInsights}</p>
                        </div>

                        {/* Flip Potential */}
                        {lead.flipPotential && (
                          <div className="bg-green-50 p-4 rounded-lg mb-4">
                            <h4 className="font-medium text-green-900 mb-3">Flip Analysis</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="text-center">
                                <div className="font-semibold text-green-800">
                                  ${lead.flipPotential.arv.toLocaleString()}
                                </div>
                                <div className="text-xs text-green-600">ARV</div>
                              </div>
                              <div className="text-center">
                                <div className="font-semibold text-green-800">
                                  ${lead.flipPotential.estimatedRehab.toLocaleString()}
                                </div>
                                <div className="text-xs text-green-600">Rehab Cost</div>
                              </div>
                              <div className="text-center">
                                <div className="font-semibold text-green-800">
                                  ${lead.flipPotential.projectedProfit.toLocaleString()}
                                </div>
                                <div className="text-xs text-green-600">Profit</div>
                              </div>
                              <div className="text-center">
                                <div className="font-semibold text-green-800">
                                  {lead.flipPotential.roi}%
                                </div>
                                <div className="text-xs text-green-600">ROI</div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* AI Flip Opinion - Detailed Analysis */}
                        {flipAnalyses[`${lead.propertyAddress}-${lead.listingPrice}`] && (
                          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-4 border border-blue-200">
                            <div className="flex items-center gap-2 mb-4">
                              <Sparkles className="w-5 h-5 text-blue-600" />
                              <h4 className="font-bold text-blue-900 text-lg">AI Flip Opinion</h4>
                              <Badge className="bg-blue-100 text-blue-800 font-bold">
                                Score: {flipAnalyses[`${lead.propertyAddress}-${lead.listingPrice}`].flipScore}/10
                              </Badge>
                            </div>
                            
                            {/* Professional Analysis */}
                            <div className="mb-4">
                              <p className="text-slate-700 leading-relaxed italic">
                                "{flipAnalyses[`${lead.propertyAddress}-${lead.listingPrice}`].analysis}"
                              </p>
                            </div>
                            
                            {/* Financial Projections */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div className="bg-white p-3 rounded-lg border border-blue-100">
                                <div className="text-sm text-slate-600 mb-1">Renovation Budget</div>
                                <div className="font-bold text-blue-900">
                                  {flipAnalyses[`${lead.propertyAddress}-${lead.listingPrice}`].renovationBudgetEstimate}
                                </div>
                              </div>
                              <div className="bg-white p-3 rounded-lg border border-blue-100">
                                <div className="text-sm text-slate-600 mb-1">Projected Resale</div>
                                <div className="font-bold text-green-700">
                                  {flipAnalyses[`${lead.propertyAddress}-${lead.listingPrice}`].projectedResaleValue}
                                </div>
                              </div>
                              <div className="bg-white p-3 rounded-lg border border-blue-100">
                                <div className="text-sm text-slate-600 mb-1">Recommendation</div>
                                <div className="font-bold">
                                  {flipAnalyses[`${lead.propertyAddress}-${lead.listingPrice}`].recommendation}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Badge variant="outline" className="text-xs">
                              {lead.leadSource === 'public-listing' ? 'Public Listing' : 'Internal Lead'}
                            </Badge>
                            <Badge className={getStatusColor(lead.status)}>
                              {lead.status.replace('-', ' ')}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            {lead.contactInfo.phone && (
                              <Button size="sm" variant="outline">
                                <Phone className="w-3 h-3 mr-1" />
                                Call
                              </Button>
                            )}
                            {lead.contactInfo.email && (
                              <Button size="sm" variant="outline">
                                <Mail className="w-3 h-3 mr-1" />
                                Email
                              </Button>
                            )}
                            <Button
                              size="sm"
                              onClick={() => saveLead(lead)}
                              disabled={lead.isSaved}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Save className="w-3 h-3 mr-1" />
                              {lead.isSaved ? 'Saved' : 'Save Lead'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Strategy Generator Tab */}
        <TabsContent value="strategies" className="space-y-6">
          {/* Strategy Form */}
          <Card className="border-purple-200 bg-purple-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <Sparkles className="w-5 h-5" />
                AI Lead Strategy Generator
              </CardTitle>
              <CardDescription className="text-purple-700">
                Generate targeted marketing strategies and outreach plans powered by AI to find qualified leads in your market.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Target Location *</label>
                  <Input
                    placeholder="e.g., Denver, CO"
                    value={strategyLocation}
                    onChange={(e) => setStrategyLocation(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Service Type *</label>
                  <Input
                    placeholder="e.g., Kitchen Remodels, Bathroom Renovations, Home Additions"
                    value={strategyServiceType}
                    onChange={(e) => setStrategyServiceType(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Target Budget Range</label>
                  <Select value={strategyBudget} onValueChange={setStrategyBudget}>
                    <SelectTrigger>
                      <SelectValue placeholder="Budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-25k">Under $25K</SelectItem>
                      <SelectItem value="25k-50k">$25K - $50K</SelectItem>
                      <SelectItem value="50k-100k">$50K - $100K</SelectItem>
                      <SelectItem value="100k-250k">$100K - $250K</SelectItem>
                      <SelectItem value="over-250k">Over $250K</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Timeframe</label>
                  <Select value={strategyTimeframe} onValueChange={setStrategyTimeframe}>
                    <SelectTrigger>
                      <SelectValue placeholder="Project timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate (1-2 weeks)</SelectItem>
                      <SelectItem value="short-term">Short-term (1-2 months)</SelectItem>
                      <SelectItem value="medium-term">Medium-term (3-6 months)</SelectItem>
                      <SelectItem value="long-term">Long-term (6+ months)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Target Audience</label>
                  <Select value={strategyTargetAudience} onValueChange={setStrategyTargetAudience}>
                    <SelectTrigger>
                      <SelectValue placeholder="Target audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="homeowners">Homeowners</SelectItem>
                      <SelectItem value="investors">Real Estate Investors</SelectItem>
                      <SelectItem value="property-managers">Property Managers</SelectItem>
                      <SelectItem value="commercial-clients">Commercial Clients</SelectItem>
                      <SelectItem value="luxury-homeowners">Luxury Homeowners</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleGenerateStrategies}
                disabled={isGeneratingStrategies}
                className="w-full bg-purple-600 hover:bg-purple-700 py-3 text-lg"
              >
                {isGeneratingStrategies ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating AI Strategies...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Lead Strategies
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Strategy Results */}
          {leadStrategies && (
            <div className="space-y-6">
              {/* Strategies */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    Lead Generation Strategies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {leadStrategies.strategies.map((strategy, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <p className="text-slate-700">{strategy}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Channels */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-600" />
                    Recommended Channels
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {leadStrategies.channels.map((channel, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-slate-700">{channel}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Sample Messages */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-orange-600" />
                    Sample Outreach Messages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leadStrategies.sampleMessages.map((message, index) => (
                      <div key={index} className="border rounded-lg p-4 bg-orange-50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-orange-700">Message {index + 1}</span>
                          <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(message)}>
                            Copy
                          </Button>
                        </div>
                        <p className="text-slate-700 italic">"{message}"</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    Action Plan & Next Steps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {leadStrategies.nextSteps.map((step, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-slate-700">{step}</p>
                        </div>
                        <Button size="sm" variant="ghost">
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Lead Tracker Tab */}
        <TabsContent value="leads" className="space-y-6">
          {/* Filter Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Lead Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">CRM Status</label>
                  <Select value={filterCrmStatus} onValueChange={setFilterCrmStatus}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="hot">Hot</SelectItem>
                      <SelectItem value="warm">Warm</SelectItem>
                      <SelectItem value="cold">Cold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" className="self-end">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Leads
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Saved Leads */}
          <Card>
            <CardHeader>
              <CardTitle>Your Lead Pipeline</CardTitle>
              <CardDescription>
                Manage and track your saved property leads
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredSavedLeads.length > 0 ? (
                <div className="space-y-4">
                  {filteredSavedLeads.map((lead) => (
                    <div key={lead.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-900">{lead.propertyAddress}</h3>
                          <p className="text-sm text-slate-600">Added: {lead.dateAdded}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getCrmStatusColor(lead.crmStatus)}>
                            {lead.crmStatus.toUpperCase()}
                          </Badge>
                          <Badge className={getStatusColor(lead.status)}>
                            {lead.status.replace('-', ' ')}
                          </Badge>
                        </div>
                      </div>

                      {/* Notes Section */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Notes:</label>
                        {editingNotes === lead.id ? (
                          <div className="space-y-2">
                            <Textarea
                              value={lead.notes}
                              onChange={(e) => updateLead(lead.id, { notes: e.target.value })}
                              placeholder="Add notes about this lead..."
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => setEditingNotes(null)}>
                                Save
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingNotes(null)}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-slate-600 flex-1">
                              {lead.notes || 'No notes added yet...'}
                            </p>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingNotes(lead.id)}
                            >
                              <Edit3 className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Quick Actions */}
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex gap-2">
                          <Select 
                            value={lead.crmStatus} 
                            onValueChange={(value) => updateLead(lead.id, { crmStatus: value as any })}
                          >
                            <SelectTrigger className="w-[100px] h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cold">Cold</SelectItem>
                              <SelectItem value="warm">Warm</SelectItem>
                              <SelectItem value="hot">Hot</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select 
                            value={lead.status} 
                            onValueChange={(value) => updateLead(lead.id, { status: value as any })}
                          >
                            <SelectTrigger className="w-[130px] h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="contacted">Contacted</SelectItem>
                              <SelectItem value="qualified">Qualified</SelectItem>
                              <SelectItem value="proposal-sent">Proposal Sent</SelectItem>
                              <SelectItem value="won">Won</SelectItem>
                              <SelectItem value="lost">Lost</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Phone className="w-3 h-3 mr-1" />
                            Call
                          </Button>
                          <Button size="sm" variant="outline">
                            <Mail className="w-3 h-3 mr-1" />
                            Email
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Database className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">No Saved Leads</h3>
                  <p className="text-slate-500 mb-4">
                    Search for properties and save leads to start building your pipeline.
                  </p>
                  <Button onClick={() => setActiveTab('search')}>
                    <Search className="w-4 h-4 mr-2" />
                    Start Searching
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Lead Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700">{savedLeads.length}</div>
                  <div className="text-blue-600">Total Leads</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">
                    {savedLeads.filter(l => l.status === 'won').length}
                  </div>
                  <div className="text-green-600">Won Deals</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-700">
                    {savedLeads.filter(l => l.crmStatus === 'hot').length}
                  </div>
                  <div className="text-yellow-600">Hot Leads</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <FeedbackButton toolName="Lead Finder" />
    </div>
  );
}
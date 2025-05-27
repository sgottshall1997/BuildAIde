import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  CheckCircle
} from "lucide-react";

interface Lead {
  id: string;
  propertyAddress: string;
  ownerName: string;
  estimatedValue: number;
  projectType: string;
  urgency: 'high' | 'medium' | 'low';
  contactInfo: {
    phone?: string;
    email?: string;
  };
  notes: string;
  lastContact?: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal-sent';
}

interface LeadSearchResult {
  leads: Lead[];
  marketInsights: string;
  totalPotentialValue: number;
}

export default function LeadFinder() {
  const [zipCode, setZipCode] = useState("");
  const [serviceRadius, setServiceRadius] = useState("10");
  const [projectTypes, setProjectTypes] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState("");
  const [results, setResults] = useState<LeadSearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
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

  const searchLeadsMutation = useMutation({
    mutationFn: async (searchData: any) => {
      const response = await apiRequest('POST', '/api/find-leads', searchData);
      return await response.json();
    },
    onSuccess: (data) => {
      setResults(data);
      toast({
        title: "Leads Found!",
        description: `Found ${data.leads.length} potential leads in your area.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Search Failed",
        description: error.message || "Failed to find leads. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSearch = () => {
    if (!zipCode || projectTypes.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please enter a zip code and select at least one project type.",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    searchLeadsMutation.mutate({
      zipCode,
      serviceRadius: parseInt(serviceRadius),
      projectTypes,
      budgetRange
    });
  };

  const toggleProjectType = (typeId: string) => {
    setProjectTypes(prev => 
      prev.includes(typeId) 
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-50 border-red-200 text-red-700';
      case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'low': return 'bg-green-50 border-green-200 text-green-700';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'contacted': return 'bg-purple-50 border-purple-200 text-purple-700';
      case 'qualified': return 'bg-green-50 border-green-200 text-green-700';
      case 'proposal-sent': return 'bg-orange-50 border-orange-200 text-orange-700';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 sm:mb-3 px-2">🎯 Lead Finder</h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto px-4">
          Find potential projects and clients in your area using AI-powered market analysis and lead generation.
        </p>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-600" />
            Lead Search Criteria
          </CardTitle>
          <CardDescription>
            Define your target market and project preferences to find qualified leads.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Target Zip Code *</label>
              <Input
                placeholder="e.g., 12345"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Service Radius (miles)</label>
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

          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">Project Types *</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {projectTypeOptions.map((type) => (
                <Button
                  key={type.id}
                  variant={projectTypes.includes(type.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleProjectType(type.id)}
                  className="text-xs"
                >
                  {type.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Target Budget Range</label>
            <Select value={budgetRange} onValueChange={setBudgetRange}>
              <SelectTrigger>
                <SelectValue placeholder="Select budget range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-25k">Under $25,000</SelectItem>
                <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
                <SelectItem value="over-250k">Over $250,000</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleSearch}
            disabled={isSearching}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isSearching ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Searching for Leads...
              </>
            ) : (
              <>
                <Target className="w-4 h-4 mr-2" />
                Find Leads
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Summary */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-700">{results.leads.length}</div>
                  <div className="text-green-600">Potential Leads</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-700">
                    ${results.totalPotentialValue.toLocaleString()}
                  </div>
                  <div className="text-green-600">Total Potential Value</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-700">
                    {results.leads.filter(l => l.urgency === 'high').length}
                  </div>
                  <div className="text-green-600">High Priority</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Market Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-slate-700">{results.marketInsights}</p>
              </div>
            </CardContent>
          </Card>

          {/* Leads List */}
          <Card>
            <CardHeader>
              <CardTitle>Potential Leads</CardTitle>
              <CardDescription>
                Qualified leads in your target area and project types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.leads.map((lead) => (
                  <div key={lead.id} className="border rounded-lg p-4 hover:bg-slate-50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{lead.propertyAddress}</h3>
                        <p className="text-slate-600">Owner: {lead.ownerName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getUrgencyColor(lead.urgency)}>
                          {lead.urgency} priority
                        </Badge>
                        <Badge className={getStatusColor(lead.status)}>
                          {lead.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-600">{lead.projectType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-600">
                          Est. ${lead.estimatedValue.toLocaleString()}
                        </span>
                      </div>
                      {lead.lastContact && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-500" />
                          <span className="text-sm text-slate-600">
                            Last contact: {lead.lastContact}
                          </span>
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-slate-600 mb-3">{lead.notes}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {lead.contactInfo.phone && (
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <Phone className="w-3 h-3" />
                            {lead.contactInfo.phone}
                          </div>
                        )}
                        {lead.contactInfo.email && (
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <Mail className="w-3 h-3" />
                            {lead.contactInfo.email}
                          </div>
                        )}
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
            </CardContent>
          </Card>
        </div>
      )}

      {/* No Results State */}
      {results && results.leads.length === 0 && (
        <Card className="bg-slate-50">
          <CardContent className="flex items-center justify-center h-64 text-center py-12">
            <div className="space-y-4">
              <Target className="w-16 h-16 text-slate-400 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  No Leads Found
                </h3>
                <p className="text-slate-500">
                  Try expanding your search radius or adjusting your project type criteria.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <FeedbackButton toolName="Lead Finder" />
    </div>
  );
}
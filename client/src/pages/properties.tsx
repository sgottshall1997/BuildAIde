import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FeedbackButton from "@/components/feedback-button";
import { useLocation } from "wouter";
import { 
  MapPin, 
  Plus, 
  DollarSign, 
  Home, 
  Calendar, 
  User, 
  Sparkles,
  Building,
  Calculator,
  FileText,
  TrendingUp,
  Wrench,
  Users,
  Clock
} from "lucide-react";

interface BaseProperty {
  id: string;
  address: string;
  status: 'Planning' | 'In Progress' | 'Completed' | 'Bid Pending';
  notes: string;
}

interface HomeownerProperty extends BaseProperty {
  purchasePrice: number;
  estimatedARV: number;
  squareFootage: number;
  propertyType: string;
}

interface ProProperty extends BaseProperty {
  clientName: string;
  projectType: string;
  estimatedBid: number;
  startDate: string;
  endDate: string;
}

type Property = HomeownerProperty | ProProperty;

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Planning': return 'bg-blue-100 text-blue-800';
    case 'In Progress': return 'bg-yellow-100 text-yellow-800';
    case 'Completed': return 'bg-green-100 text-green-800';
    case 'Bid Pending': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const mockHomeownerProperties: HomeownerProperty[] = [
  {
    id: '1',
    address: '123 Maple St, Chicago, IL',
    purchasePrice: 400000,
    estimatedARV: 550000,
    squareFootage: 1800,
    propertyType: 'Single Family',
    status: 'Planning',
    notes: 'Great bones, needs kitchen and bathroom updates. Corner lot with potential for addition.'
  },
  {
    id: '2',
    address: '456 Oak Avenue, Evanston, IL',
    purchasePrice: 325000,
    estimatedARV: 475000,
    squareFootage: 1500,
    propertyType: 'Condo',
    status: 'In Progress',
    notes: 'Modern unit, focusing on flooring and paint. HOA approval obtained for renovations.'
  }
];

const mockProProperties: ProProperty[] = [
  {
    id: '1',
    address: '44 Industrial Lane, Schaumburg, IL',
    clientName: 'Jane Doe',
    projectType: 'Full Remodel',
    estimatedBid: 120000,
    startDate: '2025-08-01',
    endDate: '2025-10-31',
    status: 'Bid Pending',
    notes: 'Commercial space conversion to residential. Requires permits and structural work.'
  },
  {
    id: '2',
    address: '789 Residential Blvd, Naperville, IL',
    clientName: 'Mike Johnson',
    projectType: 'Kitchen Renovation',
    estimatedBid: 45000,
    startDate: '2025-06-15',
    endDate: '2025-07-30',
    status: 'In Progress',
    notes: 'High-end appliances and custom cabinetry. Client wants premium finishes throughout.'
  }
];

function PropertyCard({ property, isConsumerMode, onAIOpinion }: { 
  property: Property; 
  isConsumerMode: boolean;
  onAIOpinion: (property: Property) => void;
}) {
  const homeownerProperty = property as HomeownerProperty;
  const proProperty = property as ProProperty;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              {property.address}
            </CardTitle>
            {isConsumerMode ? (
              <CardDescription className="mt-1">
                {homeownerProperty.propertyType} • {homeownerProperty.squareFootage.toLocaleString()} sq ft
              </CardDescription>
            ) : (
              <CardDescription className="mt-1">
                {proProperty.clientName} • {proProperty.projectType}
              </CardDescription>
            )}
          </div>
          <Badge className={getStatusColor(property.status)}>
            {property.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isConsumerMode ? (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <div>
                <div className="font-medium">Purchase Price</div>
                <div className="text-gray-600">${homeownerProperty.purchasePrice.toLocaleString()}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <div>
                <div className="font-medium">Est. ARV</div>
                <div className="text-gray-600">${homeownerProperty.estimatedARV.toLocaleString()}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <div>
                <div className="font-medium">Estimated Bid</div>
                <div className="text-gray-600">${proProperty.estimatedBid.toLocaleString()}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <div>
                <div className="font-medium">Timeline</div>
                <div className="text-gray-600">{proProperty.startDate} to {proProperty.endDate}</div>
              </div>
            </div>
          </div>
        )}

        {property.notes && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-700">{property.notes}</div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            onClick={() => onAIOpinion(property)}
            className="flex-1 bg-purple-600 hover:bg-purple-700"
            size="sm"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isConsumerMode ? 'Ask AI for Property Insight' : 'Get AI Project Assessment'}
          </Button>
          
          {isConsumerMode ? (
            <Button variant="outline" size="sm" className="flex-1">
              <Calculator className="w-4 h-4 mr-2" />
              Budget Planner
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="flex-1">
              <Wrench className="w-4 h-4 mr-2" />
              Project Tools
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Properties() {
  const [location] = useLocation();
  // Determine mode based on current route and session storage
  const isConsumerMode = sessionStorage.getItem('userMode') === 'consumer' || location.includes('consumer');
  const [properties, setProperties] = useState<Property[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [aiOpinion, setAiOpinion] = useState<{property: Property, opinion: string, loadTime?: string} | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [testResult, setTestResult] = useState("");
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    // Load demo properties based on mode
    if (isConsumerMode) {
      setProperties(mockHomeownerProperties);
    } else {
      setProperties(mockProProperties);
    }
  }, [isConsumerMode]);

  const handleAIOpinion = async (property: Property) => {
    setIsLoadingAI(true);
    setAiOpinion(null);
    const startTime = Date.now();

    try {
      let prompt = '';
      
      if (isConsumerMode) {
        const homeownerProp = property as HomeownerProperty;
        prompt = `Analyze the following property for renovation and resale potential. Include risks, upside, and potential ROI.

Address: ${homeownerProp.address}
Purchase Price: $${homeownerProp.purchasePrice.toLocaleString()}
Estimated ARV: $${homeownerProp.estimatedARV.toLocaleString()}
Square Footage: ${homeownerProp.squareFootage.toLocaleString()}
Property Type: ${homeownerProp.propertyType}
User Notes: ${homeownerProp.notes}`;
      } else {
        const proProp = property as ProProperty;
        prompt = `Review this project and give insights about risks, project complexity, timeline, and bid competitiveness.

Client: ${proProp.clientName}
Address: ${proProp.address}
Project Type: ${proProp.projectType}
Estimated Bid: $${proProp.estimatedBid.toLocaleString()}
Timeline: ${proProp.startDate} to ${proProp.endDate}
Internal Notes: ${proProp.notes}`;
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
        
        setAiOpinion({ 
          property, 
          opinion: data.analysis || "I'd be happy to provide property insights, but I'm having trouble generating the analysis right now.",
          loadTime 
        });
      } else {
        setAiOpinion({ 
          property, 
          opinion: "I'm unable to analyze this property right now. Please try again later." 
        });
      }
    } catch (error: any) {
      setAiOpinion({ 
        property, 
        opinion: "I'm having trouble connecting right now. Please check your connection and try again." 
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <MapPin className="w-8 h-8 text-blue-600" />
                {isConsumerMode ? 'My Properties' : 'Client Projects'}
              </h1>
              <p className="text-slate-600 mt-2">
                {isConsumerMode 
                  ? 'Track your renovation projects and investment properties'
                  : 'Manage client projects and construction bids'
                }
              </p>
            </div>
            
            <Button 
              onClick={() => setShowAddDialog(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New {isConsumerMode ? 'Property' : 'Project'}
            </Button>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isConsumerMode={isConsumerMode}
              onAIOpinion={handleAIOpinion}
            />
          ))}
        </div>

        {/* AI Opinion Dialog */}
        {aiOpinion && (
          <Dialog open={!!aiOpinion} onOpenChange={() => setAiOpinion(null)}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  {isConsumerMode ? 'Property Investment Analysis' : 'Project Assessment'}
                </DialogTitle>
                <div className="flex items-center justify-between">
                  <DialogDescription>
                    AI analysis for {aiOpinion.property.address}
                  </DialogDescription>
                  {aiOpinion.loadTime && (
                    <Badge variant="secondary" className="text-xs">
                      Generated in {aiOpinion.loadTime}s
                    </Badge>
                  )}
                </div>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                  <div className="prose prose-sm max-w-none">
                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {aiOpinion.opinion}
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

        {/* Loading AI Opinion */}
        {isLoadingAI && (
          <Dialog open={isLoadingAI}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                  Analyzing Property...
                </DialogTitle>
                <DialogDescription>
                  Our AI is reviewing the property details and generating insights
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}

        {/* Test Buttons - Bottom of page, less visible */}
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
      </div>
      
      {/* Feedback Button */}
      <FeedbackButton toolName={isConsumerMode ? "Property Tracking" : "Project Management"} />
    </div>
  );
}
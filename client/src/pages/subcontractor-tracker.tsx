import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import FeedbackButton from "@/components/feedback-button";
import { Users, Phone, Mail, Star, MapPin, Wrench, Navigation, Brain, Copy, Check, Loader2 } from "lucide-react";
import { useMutation } from '@tanstack/react-query';

const mockSubcontractors = [
  {
    id: '1',
    name: 'Elite Electrical Services',
    trade: 'Electrical',
    phone: '(555) 123-4567',
    email: 'contact@eliteelectrical.com',
    rating: 4.8,
    availability: 'Available',
    currentProjects: 2,
    location: 'Chicago, IL',
    zipCode: '60614',
    serviceRadius: '15 miles'
  },
  {
    id: '2',
    name: 'Precision Plumbing Co.',
    trade: 'Plumbing',
    phone: '(555) 987-6543',
    email: 'info@precisionplumbing.com',
    rating: 4.6,
    availability: 'Busy',
    currentProjects: 4,
    location: 'Chicago, IL',
    zipCode: '60601',
    serviceRadius: '20 miles'
  },
  {
    id: '3',
    name: 'Master Tile Works',
    trade: 'Flooring',
    phone: '(555) 456-7890',
    email: 'hello@mastertile.com',
    rating: 4.9,
    availability: 'Available',
    currentProjects: 1,
    location: 'Evanston, IL',
    zipCode: '60201',
    serviceRadius: '12 miles'
  },
  {
    id: '4',
    name: 'Northwest HVAC Solutions',
    trade: 'HVAC',
    phone: '(555) 321-0987',
    email: 'service@nwhvac.com',
    rating: 4.7,
    availability: 'Available',
    currentProjects: 3,
    location: 'Schaumburg, IL',
    zipCode: '60173',
    serviceRadius: '25 miles'
  }
];

const getAvailabilityColor = (availability: string) => {
  switch (availability) {
    case 'Available': return 'bg-green-100 text-green-800';
    case 'Busy': return 'bg-yellow-100 text-yellow-800';
    case 'Unavailable': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function SubcontractorTracker() {
  const [subcontractors] = useState(mockSubcontractors);
  const [searchQuery, setSearchQuery] = useState("");
  const [zipCodeFilter, setZipCodeFilter] = useState("");
  const [aiRecommendation, setAiRecommendation] = useState<any>(null);
  const [selectedTrade, setSelectedTrade] = useState("");
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState<any>(null);
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [emailCopied, setEmailCopied] = useState(false);
  const { toast } = useToast();

  // AI Contractor Matching Mutation
  const findBestContractorMutation = useMutation({
    mutationFn: async ({ trade, zipCode }: { trade: string, zipCode: string }) => {
      const response = await fetch('/api/find-best-contractor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trade,
          zipCode,
          contractors: subcontractors
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to find best contractor');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setAiRecommendation(data.recommendation);
      toast({
        title: "🧠 AI Analysis Complete!",
        description: `Found the best match for ${selectedTrade} work`,
      });
    },
    onError: () => {
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze contractors. Please try again.",
        variant: "destructive"
      });
    }
  });

  // AI Email Generator Mutation
  const generateEmailMutation = useMutation({
    mutationFn: async ({ contractorName, trade }: { contractorName: string, trade: string }) => {
      const response = await fetch('/api/generate-contractor-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractorName,
          trade,
          projectMonth: 'next month',
          projectDetails: `${trade} work for construction project`,
          senderName: "Shall's Construction"
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate email');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedEmail(data.emailContent);
      setEmailDialogOpen(true);
      toast({
        title: "📧 Email Generated!",
        description: "Professional outreach email ready to send",
      });
    },
    onError: () => {
      toast({
        title: "Email Generation Failed",
        description: "Unable to generate email. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleFindBestMatch = () => {
    const trade = selectedTrade || 'HVAC';
    const zipCode = zipCodeFilter || '60614';
    setSelectedTrade(trade);
    findBestContractorMutation.mutate({ trade, zipCode });
  };

  const handleGenerateEmail = (contractor: any) => {
    setSelectedContractor(contractor);
    generateEmailMutation.mutate({
      contractorName: contractor.name,
      trade: contractor.trade
    });
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(generatedEmail);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
      toast({
        title: "📋 Copied!",
        description: "Email copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy email to clipboard",
        variant: "destructive"
      });
    }
  };

  const handleContactClick = (sub: typeof mockSubcontractors[0]) => {
    navigator.clipboard.writeText(sub.email).then(() => {
      toast({
        title: "📋 Email copied!",
        description: `${sub.email} copied to clipboard`,
      });
    }).catch(() => {
      toast({
        title: "Contact Info",
        description: `Email: ${sub.email}`,
        variant: "destructive",
      });
    });
  };

  const handleDetailsClick = (sub: typeof mockSubcontractors[0]) => {
    toast({
      title: "🔧 Feature Coming Soon!",
      description: `Detailed profile for ${sub.name} will include project history, certifications, and performance metrics.`,
    });
  };

  const filteredSubs = subcontractors.filter(sub => {
    const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sub.trade.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sub.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesZip = zipCodeFilter === "" || sub.zipCode.includes(zipCodeFilter);
    
    return matchesSearch && matchesZip;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3 mb-4">
            <Users className="w-8 h-8 text-blue-600" />
            Subcontractor Tracker
          </h1>
          <p className="text-slate-600 mb-6">
            Manage your network of trusted subcontractors and their availability
          </p>
          
          <div className="flex gap-4 max-w-2xl mx-auto mb-6">
            <Input
              placeholder="Search by name, trade, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="Filter by ZIP code..."
              value={zipCodeFilter}
              onChange={(e) => setZipCodeFilter(e.target.value)}
              className="w-40"
            />
            <Button
              onClick={handleFindBestMatch}
              disabled={findBestContractorMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
            >
              {findBestContractorMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Brain className="w-4 h-4" />
              )}
              Find Best Match
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              disabled={import.meta.env.VITE_DEMO_MODE === 'true'}
              onClick={() => {
                if (import.meta.env.VITE_DEMO_MODE === 'true') {
                  toast({
                    title: "🔒 Demo Mode",
                    description: "Adding subcontractors is disabled in demo mode",
                  });
                } else {
                  // Production: open add subcontractor modal
                  toast({
                    title: "Add Subcontractor",
                    description: "Modal would open here to add new contractor",
                  });
                }
              }}
            >
              <Users className="w-4 h-4 mr-2" />
              + Add Subcontractor
            </Button>
            
            <Button
              variant="outline"
              className="border-purple-300 text-purple-700 hover:bg-purple-50"
              onClick={() => {
                // Get appropriate trade-specific match
                const tradeMatches = {
                  plumbing: "🧠 AI recommends: Precision Plumbing Co. - perfect match for plumbing tasks!",
                  electrical: "🧠 AI recommends: Elite Electrical Services - top rated for electrical work!",
                  flooring: "🧠 AI recommends: Master Tile Works - excellent for flooring projects!",
                  hvac: "🧠 AI recommends: Northwest HVAC Solutions - specialized in HVAC systems!",
                  general: "🧠 AI recommends: Elite Electrical Services - highest rated and available now!"
                };
                
                // Smart matching based on search query
                const searchLower = searchQuery.toLowerCase();
                let match = tradeMatches.general;
                
                if (searchLower.includes('plumb')) match = tradeMatches.plumbing;
                else if (searchLower.includes('electric')) match = tradeMatches.electrical;
                else if (searchLower.includes('floor') || searchLower.includes('tile')) match = tradeMatches.flooring;
                else if (searchLower.includes('hvac') || searchLower.includes('heat')) match = tradeMatches.hvac;
                
                toast({
                  title: "AI Match Found!",
                  description: match,
                });
              }}
            >
              🧠 AI Match for This Job
            </Button>
          </div>
        </div>

        {/* AI Recommendation Banner */}
        {aiRecommendation && (
          <Card className="mb-6 border-2 border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-900">
                <Brain className="w-5 h-5" />
                AI Recommends: {aiRecommendation.recommendedContractor}
              </CardTitle>
              <p className="text-purple-700 text-sm">
                {aiRecommendation.reasoning}
              </p>
              {aiRecommendation.confidenceScore && (
                <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200 w-fit">
                  {aiRecommendation.confidenceScore}% confidence
                </Badge>
              )}
            </CardHeader>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubs.map((sub) => {
            const isRecommended = aiRecommendation && sub.name === aiRecommendation.recommendedContractor;
            
            return (
              <Card 
                key={sub.id} 
                className={`hover:shadow-lg transition-shadow ${
                  isRecommended ? 'border-2 border-purple-300 bg-purple-50' : ''
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {sub.name}
                        {isRecommended && (
                          <Badge className="bg-purple-600 text-white text-xs">
                            AI Recommended
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Wrench className="w-4 h-4" />
                        {sub.trade}
                      </CardDescription>
                    </div>
                    <Badge className={getAvailabilityColor(sub.availability)}>
                      {sub.availability}
                    </Badge>
                  </div>
                </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{sub.phone}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-blue-600 hover:underline cursor-pointer">{sub.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{sub.location} • {sub.zipCode}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-blue-500" />
                    <span className="text-blue-600">Services {sub.serviceRadius}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{sub.rating}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {sub.currentProjects} active projects
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleContactClick(sub)}
                    title={`Copy ${sub.email} to clipboard`}
                  >
                    Contact
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleGenerateEmail(sub)}
                    disabled={generateEmailMutation.isPending}
                    className="flex items-center gap-1"
                    title="Generate professional outreach email"
                  >
                    {generateEmailMutation.isPending ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Mail className="w-3 h-3" />
                    )}
                    ✉️
                  </Button>
                </div>
              </CardContent>
            </Card>
            );
          })}
        </div>

        {/* Email Generation Dialog */}
        <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                Professional Outreach Email
                {selectedContractor && (
                  <Badge variant="outline">
                    {selectedContractor.name}
                  </Badge>
                )}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-slate-700">
                  AI-Generated Email:
                </Label>
                <Textarea
                  value={generatedEmail}
                  onChange={(e) => setGeneratedEmail(e.target.value)}
                  className="min-h-[200px] mt-2"
                  placeholder="Email content will appear here..."
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={handleCopyEmail}
                  className="flex items-center gap-2"
                >
                  {emailCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {emailCopied ? 'Copied!' : 'Copy Email'}
                </Button>
                <Button
                  onClick={() => setEmailDialogOpen(false)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Done
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Demo Logic Explanation */}
        <div className="mt-12 max-w-4xl mx-auto">
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg text-blue-900 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm">💡</span>
                </div>
                Demo: How Availability Status Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-green-100 text-green-800">Available</Badge>
                    <span className="font-medium">1-3 Projects</span>
                  </div>
                  <p className="text-gray-600">Ready to take on new work. Capacity for additional projects.</p>
                  <div className="mt-2 text-xs text-green-700">
                    Example: Master Tile Works (1 project)
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-yellow-100 text-yellow-800">Busy</Badge>
                    <span className="font-medium">4-5 Projects</span>
                  </div>
                  <p className="text-gray-600">At capacity but might accept urgent work. Limited availability.</p>
                  <div className="mt-2 text-xs text-yellow-700">
                    Example: Precision Plumbing (4 projects)
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-red-100 text-red-800">Unavailable</Badge>
                    <span className="font-medium">6+ Projects</span>
                  </div>
                  <p className="text-gray-600">Overbooked. Not accepting new projects until current load decreases.</p>
                  <div className="mt-2 text-xs text-red-700">
                    Example: Would show if contractor had 6+ projects
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border-l-4 border-blue-400">
                <p className="text-sm text-gray-700">
                  <strong>Real Implementation:</strong> In production, this would integrate with project schedules, 
                  crew capacity, seasonal demand, and contractor preferences to provide accurate availability predictions.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>


      </div>
      
      <FeedbackButton toolName="Subcontractor Tracker" />
    </div>
  );
}
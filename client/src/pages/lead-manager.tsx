import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import FeedbackButton from "@/components/feedback-button";
import { FileText, Phone, Mail, DollarSign, Clock, TrendingUp, MapPin, Bookmark, Brain } from "lucide-react";

const mockLeads = [
  {
    id: '1',
    clientName: 'Sarah Johnson',
    projectType: 'Kitchen Renovation',
    phone: '(555) 234-5678',
    email: 'sarah.johnson@email.com',
    estimatedBudget: 45000,
    status: 'Hot Lead',
    contactDate: '2025-05-24',
    followUpDate: '2025-05-27',
    location: 'Lincoln Park, Chicago, IL',
    zipCode: '60614',
    notes: 'Interested in high-end finishes, timeline flexible'
  },
  {
    id: '2',
    clientName: 'Mike Chen',
    projectType: 'Bathroom Remodel',
    phone: '(555) 345-6789',
    email: 'mike.chen@email.com',
    estimatedBudget: 25000,
    status: 'Warm Lead',
    contactDate: '2025-05-22',
    followUpDate: '2025-05-29',
    location: 'Wicker Park, Chicago, IL',
    zipCode: '60622',
    notes: 'Comparing quotes, needs proposal by Friday'
  },
  {
    id: '3',
    clientName: 'Jennifer Davis',
    projectType: 'Home Addition',
    phone: '(555) 456-7890',
    email: 'jen.davis@email.com',
    estimatedBudget: 85000,
    status: 'Cold Lead',
    contactDate: '2025-05-20',
    followUpDate: '2025-06-03',
    location: 'Oak Park, IL',
    zipCode: '60302',
    notes: 'Initial inquiry, exploring options'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Hot Lead': return 'bg-red-100 text-red-800';
    case 'Warm Lead': return 'bg-orange-100 text-orange-800';
    case 'Cold Lead': return 'bg-blue-100 text-blue-800';
    case 'Converted': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function LeadManager() {
  const [leads] = useState(mockLeads);
  const [searchQuery, setSearchQuery] = useState("");
  const [savedLeads, setSavedLeads] = useState<string[]>([]);
  const [aiResults, setAiResults] = useState<Record<string, string>>({});
  const { toast } = useToast();

  // AI bid analysis function
  const analyzeWithAI = (lead: any) => {
    const analyses = {
      'Kitchen Renovation': 'Likely profitable, moderate competition. High-end finishes suggest good budget.',
      'Bathroom Remodel': 'Good opportunity, budget conscious client needs competitive pricing.',
      'Home Addition': 'High-value project, worth pursuing despite cold status. Large profit potential.'
    };
    
    const result = analyses[lead.projectType as keyof typeof analyses] || 'Moderate opportunity, standard market conditions.';
    setAiResults(prev => ({ ...prev, [lead.id]: result }));
    
    toast({
      title: "🧠 AI Analysis Complete",
      description: `Smart insights generated for ${lead.projectType}`,
    });
  };

  // Save lead function
  const saveLead = (leadId: string) => {
    if (!savedLeads.includes(leadId)) {
      setSavedLeads(prev => [...prev, leadId]);
      toast({
        title: "✔ Lead Saved!",
        description: "Lead added to your pipeline",
      });
    }
  };

  const filteredLeads = leads.filter(lead => 
    lead.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.projectType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            Lead Finder
          </h1>
          <p className="text-slate-600 mb-6">
            Discover profitable bid opportunities with smart AI analysis and location insights
          </p>
          
          <div className="max-w-md mx-auto">
            <Input
              placeholder="Search by client name or project type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredLeads.map((lead) => (
            <Card 
              key={lead.id} 
              className={`hover:shadow-lg transition-all duration-300 ${
                savedLeads.includes(lead.id) ? 'opacity-70 bg-gray-50' : ''
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{lead.clientName}</CardTitle>
                    <CardDescription className="mt-1">
                      {lead.projectType}
                    </CardDescription>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <MapPin className="w-3 h-3" />
                      📍 {lead.location}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getStatusColor(lead.status)}>
                      {lead.status}
                    </Badge>
                    {savedLeads.includes(lead.id) && (
                      <Badge className="bg-green-100 text-green-800">
                        <Bookmark className="w-3 h-3 mr-1" />
                        Saved
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{lead.phone}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-blue-600 hover:underline cursor-pointer">{lead.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-medium">${lead.estimatedBudget.toLocaleString()} budget</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span>Follow up: {lead.followUpDate}</span>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{lead.notes}</p>
                </div>

                {/* AI Analysis Result */}
                {aiResults[lead.id] && (
                  <div className="bg-green-100 text-green-800 text-sm rounded px-3 py-2 border border-green-200">
                    <div className="flex items-start gap-2">
                      <Brain className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="font-medium">🧠 AI's Take: {aiResults[lead.id]}</span>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => analyzeWithAI(lead)}
                  >
                    <Brain className="w-4 h-4 mr-1" />
                    Should I bid?
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => saveLead(lead.id)}
                    disabled={savedLeads.includes(lead.id)}
                  >
                    <Bookmark className="w-4 h-4 mr-1" />
                    {savedLeads.includes(lead.id) ? 'Saved' : 'Save Lead'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            <TrendingUp className="w-5 h-5 mr-2" />
            Add New Lead
          </Button>
        </div>
      </div>
      
      <FeedbackButton toolName="Lead Manager" />
    </div>
  );
}
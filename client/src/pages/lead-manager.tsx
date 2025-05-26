import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import FeedbackButton from "@/components/feedback-button";
import { FileText, Phone, Mail, DollarSign, Clock, TrendingUp } from "lucide-react";

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

  const filteredLeads = leads.filter(lead => 
    lead.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.projectType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3 mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
            Lead Manager
          </h1>
          <p className="text-slate-600 mb-6">
            Track and manage your construction project leads and follow-ups
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
            <Card key={lead.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{lead.clientName}</CardTitle>
                    <CardDescription className="mt-1">
                      {lead.projectType}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(lead.status)}>
                    {lead.status}
                  </Badge>
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
                
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Contact
                  </Button>
                  <Button variant="outline" size="sm">
                    Details
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
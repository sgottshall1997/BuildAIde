import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import FeedbackButton from "@/components/feedback-button";
import { Building, Calendar, DollarSign, User, MapPin, Clock, Settings } from "lucide-react";

const mockClientProjects = [
  {
    id: '1',
    clientName: 'Johnson Family',
    projectName: 'Master Bathroom Renovation',
    address: '123 Elm Street, Chicago, IL',
    status: 'In Progress',
    startDate: '2025-05-15',
    estimatedCompletion: '2025-06-30',
    budget: 35000,
    spent: 18500,
    phase: 'Plumbing Installation',
    progress: 55
  },
  {
    id: '2',
    clientName: 'Davis Corporation',
    projectName: 'Office Building Renovation',
    address: '456 Business Blvd, Evanston, IL',
    status: 'Planning',
    startDate: '2025-06-01',
    estimatedCompletion: '2025-08-15',
    budget: 125000,
    spent: 5000,
    phase: 'Permit Approval',
    progress: 15
  },
  {
    id: '3',
    clientName: 'Smith Residence',
    projectName: 'Kitchen & Living Room Remodel',
    address: '789 Oak Avenue, Naperville, IL',
    status: 'Completed',
    startDate: '2025-03-01',
    estimatedCompletion: '2025-04-20',
    budget: 65000,
    spent: 62500,
    phase: 'Final Inspection',
    progress: 100
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'In Progress': return 'bg-blue-100 text-blue-800';
    case 'Planning': return 'bg-yellow-100 text-yellow-800';
    case 'Completed': return 'bg-green-100 text-green-800';
    case 'On Hold': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function ClientProjects() {
  const [projects] = useState(mockClientProjects);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = projects.filter(project => 
    project.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3 mb-4">
            <Building className="w-8 h-8 text-blue-600" />
            Client Projects
          </h1>
          <p className="text-slate-600 mb-6">
            Manage active client projects, track progress, and monitor budgets
          </p>
          
          <div className="max-w-md mx-auto">
            <Input
              placeholder="Search by client, project, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{project.projectName}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <User className="w-4 h-4" />
                      {project.clientName}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{project.address}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span>{project.startDate} - {project.estimatedCompletion}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span>Current Phase: {project.phase}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-medium">${project.spent.toLocaleString()}</span>
                      <span className="text-gray-500">/ ${project.budget.toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {Math.round((project.spent / project.budget) * 100)}% of budget used
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <Settings className="w-4 h-4 mr-2" />
                    Manage
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
            <Building className="w-5 h-5 mr-2" />
            Add New Project
          </Button>
        </div>
      </div>
      
      <FeedbackButton toolName="Client Projects" />
    </div>
  );
}
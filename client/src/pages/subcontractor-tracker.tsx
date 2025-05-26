import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import FeedbackButton from "@/components/feedback-button";
import { Users, Phone, Mail, Star, MapPin, Wrench } from "lucide-react";

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
    location: 'Chicago, IL'
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
    location: 'Chicago, IL'
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
    location: 'Evanston, IL'
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

  const filteredSubs = subcontractors.filter(sub => 
    sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.trade.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          
          <div className="max-w-md mx-auto">
            <Input
              placeholder="Search by name or trade..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubs.map((sub) => (
            <Card key={sub.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{sub.name}</CardTitle>
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
                    <span>{sub.location}</span>
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
            <Users className="w-5 h-5 mr-2" />
            Add New Subcontractor
          </Button>
        </div>
      </div>
      
      <FeedbackButton toolName="Subcontractor Tracker" />
    </div>
  );
}
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Shield, 
  MapPin, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  DollarSign,
  Phone,
  Globe,
  Building,
  Home,
  Wrench,
  Zap,
  Droplets,
  Thermometer
} from "lucide-react";

export default function PermitResearch() {
  const [zipCode, setZipCode] = useState("");
  const [projectType, setProjectType] = useState("");
  const [results, setResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  const projectTypes = [
    {
      id: "kitchen",
      name: "Kitchen Remodel",
      icon: <Home className="w-6 h-6" />,
      description: "Cabinets, countertops, appliances",
      commonPermits: ["Electrical", "Plumbing", "Building (if structural)"]
    },
    {
      id: "bathroom",
      name: "Bathroom Renovation",
      icon: <Droplets className="w-6 h-6" />,
      description: "Fixtures, tile, plumbing updates",
      commonPermits: ["Plumbing", "Electrical", "Building"]
    },
    {
      id: "electrical",
      name: "Electrical Work",
      icon: <Zap className="w-6 h-6" />,
      description: "Wiring, panels, outlets",
      commonPermits: ["Electrical"]
    },
    {
      id: "plumbing",
      name: "Plumbing Work",
      icon: <Droplets className="w-6 h-6" />,
      description: "Pipes, fixtures, water heater",
      commonPermits: ["Plumbing"]
    },
    {
      id: "hvac",
      name: "HVAC Installation",
      icon: <Thermometer className="w-6 h-6" />,
      description: "Heating, cooling, ductwork",
      commonPermits: ["Mechanical", "Electrical"]
    },
    {
      id: "addition",
      name: "Room Addition",
      icon: <Building className="w-6 h-6" />,
      description: "New rooms, structural changes",
      commonPermits: ["Building", "Electrical", "Plumbing", "Mechanical"]
    }
  ];

  const handleSearch = async () => {
    if (!zipCode || !projectType) return;
    
    setIsSearching(true);
    
    // Simulate permit lookup
    setTimeout(() => {
      const mockResults = {
        location: {
          city: "Denver",
          state: "Colorado",
          county: "Denver County"
        },
        department: {
          name: "Denver Department of Community Planning and Development",
          phone: "(720) 865-2915",
          website: "https://www.denvergov.org/Government/Departments/Community-Planning-and-Development",
          address: "201 W Colfax Ave, Denver, CO 80202"
        },
        permits: [
          {
            type: "Building Permit",
            required: true,
            cost: "$150 - $500",
            timeline: "2-4 weeks",
            description: "Required for structural changes, additions, or major renovations"
          },
          {
            type: "Electrical Permit",
            required: true,
            cost: "$75 - $200",
            timeline: "1-2 weeks",
            description: "Required for new circuits, panel upgrades, or major electrical work"
          },
          {
            type: "Plumbing Permit",
            required: projectType === "bathroom" || projectType === "kitchen",
            cost: "$100 - $250",
            timeline: "1-2 weeks",
            description: "Required for new plumbing lines, fixture relocations"
          }
        ],
        tips: [
          "Schedule inspections in advance - they book up quickly",
          "Have detailed plans ready before applying",
          "Consider hiring a licensed contractor to handle permits",
          "Budget extra time for the approval process"
        ],
        totalEstimatedCost: "$325 - $950",
        totalTimeline: "3-6 weeks"
      };
      
      setResults(mockResults);
      setIsSearching(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Permit Research Center</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Find out exactly what permits you need for your renovation project in your area
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8 border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Research Your Project Permits
            </CardTitle>
            <CardDescription>
              Enter your location and project type to get specific permit requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Your ZIP Code
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Enter ZIP code (e.g., 80202)"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Project Type
              </label>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projectTypes.map((type) => (
                  <Card
                    key={type.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      projectType === type.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setProjectType(type.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                          {type.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 mb-1">{type.name}</h3>
                          <p className="text-sm text-slate-600 mb-2">{type.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {type.commonPermits.map((permit, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {permit}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={handleSearch}
                disabled={!zipCode || !projectType || isSearching}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              >
                {isSearching ? "Researching Permits..." : "Find Required Permits"}
                <Shield className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {results && (
          <div className="space-y-6">
            {/* Location & Department Info */}
            <Card className="border-2 border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Building className="w-6 h-6" />
                  Permitting Authority for {results.location.city}, {results.location.state}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-800 mb-3">Department Contact</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-green-600" />
                        <span className="font-medium">{results.department.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-green-600" />
                        <span>{results.department.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-green-600" />
                        <a href={results.department.website} target="_blank" rel="noopener noreferrer" 
                           className="text-green-700 hover:underline">
                          Visit Department Website
                        </a>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-green-600 mt-0.5" />
                        <span>{results.department.address}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800 mb-3">Quick Summary</h4>
                    <div className="space-y-2 text-sm text-green-700">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span>Total Estimated Cost: <strong>{results.totalEstimatedCost}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Total Timeline: <strong>{results.totalTimeline}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Required Permits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-6 h-6" />
                  Required Permits for Your Project
                </CardTitle>
                <CardDescription>
                  Here are the permits you'll likely need based on your project type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {results.permits.map((permit: any, index: number) => (
                    <div key={index} className={`p-4 rounded-lg border-2 ${
                      permit.required 
                        ? 'border-red-200 bg-red-50' 
                        : 'border-yellow-200 bg-yellow-50'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {permit.required ? (
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                          ) : (
                            <CheckCircle className="w-5 h-5 text-yellow-600" />
                          )}
                          <h4 className="font-semibold text-slate-900">{permit.type}</h4>
                        </div>
                        <Badge className={permit.required ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                          {permit.required ? 'Required' : 'Conditional'}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{permit.description}</p>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-slate-500" />
                          <span><strong>Cost:</strong> {permit.cost}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-500" />
                          <span><strong>Timeline:</strong> {permit.timeline}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pro Tips */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <CheckCircle className="w-6 h-6" />
                  Pro Tips for Permit Success
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {results.tips.map((tip: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-200">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-blue-800">{tip}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Ready to Move Forward?</CardTitle>
                <CardDescription>Here are your next steps to get started</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Link href="/smart-project-estimator">
                    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-blue-200">
                      <CardContent className="p-6 text-center">
                        <DollarSign className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                        <h3 className="font-semibold text-slate-900 mb-2">Get Project Cost Estimate</h3>
                        <p className="text-sm text-slate-600">Calculate total project costs including permits</p>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  <Link href="/quote-compare">
                    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-green-200">
                      <CardContent className="p-6 text-center">
                        <Wrench className="w-8 h-8 text-green-600 mx-auto mb-3" />
                        <h3 className="font-semibold text-slate-900 mb-2">Find Licensed Contractors</h3>
                        <p className="text-sm text-slate-600">Compare quotes from qualified professionals</p>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  <Link href="/ai-renovation-assistant">
                    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-purple-200">
                      <CardContent className="p-6 text-center">
                        <FileText className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                        <h3 className="font-semibold text-slate-900 mb-2">Get Expert Advice</h3>
                        <p className="text-sm text-slate-600">Ask our AI assistant about permits and planning</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* General Info Section */}
        {!results && (
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <AlertTriangle className="w-6 h-6" />
                Why Permits Matter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-orange-800 mb-3">Benefits of Getting Permits</h4>
                  <ul className="space-y-2 text-sm text-orange-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Ensures work meets safety codes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Protects your home's value</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Required for insurance claims</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Needed when selling your home</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-orange-800 mb-3">Risks of Skipping Permits</h4>
                  <ul className="space-y-2 text-sm text-orange-700">
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Safety hazards from improper work</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Fines and forced renovations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Problems selling your home</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Insurance may not cover damages</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
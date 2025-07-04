import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
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
import { apiRequest } from "@/lib/queryClient";

export default function PermitResearch() {
  const [zipCode, setZipCode] = useState("");
  const [projectType, setProjectType] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [results, setResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [aiApplicationHelp, setAiApplicationHelp] = useState("");
  const [aiSkipHelp, setAiSkipHelp] = useState("");
  const [isLoadingApplicationHelp, setIsLoadingApplicationHelp] = useState(false);
  const [isLoadingSkipHelp, setIsLoadingSkipHelp] = useState(false);
  const { toast } = useToast();

  // Demo cities for localized permit guidance
  const demoCities = [
    { value: "chicago", label: "Chicago, IL" },
    { value: "newyork", label: "New York, NY" },
    { value: "losangeles", label: "Los Angeles, CA" },
    { value: "denver", label: "Denver, CO" },
    { value: "atlanta", label: "Atlanta, GA" },
    { value: "seattle", label: "Seattle, WA" }
  ];

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

  // AI application help function
  const handleAiApplicationHelp = async () => {
    if (!results) return;

    setIsLoadingApplicationHelp(true);
    const cityName = results.location.city;
    const projectTypeName = projectTypes.find(p => p.id === projectType)?.name || projectType;

    try {
      const response = await apiRequest('POST', '/api/permit-application-guidance', {
        city: cityName,
        projectType: projectTypeName,
        permits: results.permits,
        department: results.department
      });

      if (!response.ok) {
        throw new Error('Failed to get response!')
      }


      const data = await response.json();
      setAiApplicationHelp(data.guidance);

      toast({
        title: "🧠 Application Guidance Ready!",
        description: "Step-by-step instructions generated below"
      });
    } catch (error) {
      toast({
        title: "AI Guidance Unavailable",
        description: "Please try again or contact the permit office directly",
        variant: "destructive"
      });
    } finally {
      setIsLoadingApplicationHelp(false);
    }
  };

  const handleAiSkipHelp = async () => {
    if (!results) return;

    setIsLoadingSkipHelp(true);
    const cityName = results.location.city;
    const projectTypeName = projectTypes.find(p => p.id === projectType)?.name || projectType;

    try {
      const response = await fetch('/api/permit-skip-consequences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: cityName,
          projectType: projectTypeName,
          permits: results.permits
        })
      });

      const data = await response.json();
      setAiSkipHelp(data.consequences);

      toast({
        title: "⚠️ Permit Skip Analysis Ready!",
        description: "Important consequences information below"
      });
    } catch (error) {
      toast({
        title: "AI Analysis Unavailable",
        description: "Please consult local building codes or an attorney",
        variant: "destructive"
      });
    } finally {
      setIsLoadingSkipHelp(false);
    }
  };

  // Generate city-specific permit data
  const getCitySpecificData = (city: string, projectType: string) => {
    const cityData: Record<string, any> = {
      chicago: {
        name: "Chicago Department of Buildings",
        phone: "(312) 744-3653",
        website: "https://www.chicago.gov/city/en/depts/bldgs.html",
        address: "121 N LaSalle St, Chicago, IL 60602",
        specifics: "Chicago requires additional fire safety permits for certain renovations"
      },
      newyork: {
        name: "NYC Department of Buildings",
        phone: "(311) NYC-DOB",
        website: "https://www1.nyc.gov/site/buildings/index.page",
        address: "280 Broadway, New York, NY 10007",
        specifics: "NYC has strict co-op/condo board approval requirements"
      },
      losangeles: {
        name: "LA Department of Building and Safety",
        phone: "(213) 482-0000",
        website: "https://www.ladbs.org",
        address: "201 N Figueroa St, Los Angeles, CA 90012",
        specifics: "LA requires seismic safety compliance for structural work"
      },
      denver: {
        name: "Denver Community Planning & Development",
        phone: "(720) 865-2915",
        website: "https://www.denvergov.org/Government/Departments/Community-Planning-and-Development",
        address: "201 W Colfax Ave, Denver, CO 80202",
        specifics: "Denver focuses on energy efficiency compliance"
      },
      atlanta: {
        name: "Atlanta Department of City Planning",
        phone: "(404) 330-6145",
        website: "https://www.atlantaga.gov/government/departments/city-planning",
        address: "55 Trinity Ave SW, Atlanta, GA 30303",
        specifics: "Atlanta requires historic district approvals in certain areas"
      },
      seattle: {
        name: "Seattle Department of Construction & Inspections",
        phone: "(206) 684-8600",
        website: "https://www.seattle.gov/sdci",
        address: "700 5th Ave, Seattle, WA 98104",
        specifics: "Seattle has strict environmental and green building standards"
      }
    };
    return cityData[city] || cityData.denver;
  };

  const handleSearch = async () => {
    if (!zipCode || !projectType) {
      toast({
        title: "Missing Information",
        description: "Please enter both a ZIP code and project type",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);

    // Generate ZIP code-based results
    setTimeout(() => {
      // Use actual ZIP code to determine city/state (simplified for demo)
      const zipToCity: { [key: string]: { city: string, state: string } } = {
        "85251": { city: "Scottsdale", state: "AZ" },
        "20895": { city: "Kensington", state: "MD" },
        "10001": { city: "New York", state: "NY" },
        "90210": { city: "Beverly Hills", state: "CA" },
        "60601": { city: "Chicago", state: "IL" },
        "33101": { city: "Miami", state: "FL" }
      };

      const location = zipToCity[zipCode] || { city: "Your City", state: "Your State" };
      const cityInfo = getCitySpecificData("denver", projectType); // Using general permit info

      const mockResults = {
        location: {
          city: location.city,
          state: location.state,
          zipCode: zipCode
        },
        department: cityInfo,
        permits: [
          {
            type: "🏗️ Building Permit",
            required: true,
            cost: "$150 - $500",
            timeline: "2-4 weeks",
            description: "Required for structural changes, additions, or major renovations"
          },
          {
            type: "🔌 Electrical Permit",
            required: true,
            cost: "$75 - $200",
            timeline: "1-2 weeks",
            description: "Required for new circuits, panel upgrades, or major electrical work"
          },
          {
            type: "🚿 Plumbing Permit",
            required: projectType === "bathroom" || projectType === "kitchen",
            cost: "$100 - $250",
            timeline: "1-2 weeks",
            description: "Required for new plumbing lines, fixture relocations"
          }
        ],
        tips: [
          `For ZIP code ${zipCode}, schedule inspections 1-2 weeks in advance`,
          "Have detailed plans ready before applying",
          "Consider hiring a licensed contractor to handle permits",
          "Budget extra time for the approval process",
          cityInfo.specifics
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
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 sm:mb-3 px-2">📋 Permit Research Center</h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto px-4">
            Find exactly what permits you need for your renovation project with detailed requirements and local guidance.
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
                ZIP Code
              </label>
              <div className="relative max-w-md">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400 z-10" />
                <Input
                  className="pl-10"
                  placeholder="e.g., 85251"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
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
                    className={`cursor-pointer transition-all duration-200 ${projectType === type.id
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

              {/* Custom Project Type Input */}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Or Enter Custom Project Type
                </label>
                <Input
                  placeholder="e.g., Historic Home Restoration, ADU Construction, Solar Panel Installation"
                  value={projectType.startsWith('custom:') ? projectType.replace('custom:', '') : ''}
                  onChange={(e) => setProjectType(e.target.value ? `custom:${e.target.value}` : '')}
                  className="max-w-md"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Use this for specialized projects not listed above
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleSearch}
                disabled={!zipCode || !projectType || isSearching}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
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
                    <div key={index} className={`p-4 rounded-lg border-2 ${permit.required
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

                {/* Follow-up AI Prompts */}
                <div className="mt-6 pt-4 border-t border-slate-200">
                  <div className="grid md:grid-cols-2 gap-3">
                    <Button
                      onClick={handleAiApplicationHelp}
                      disabled={isLoadingApplicationHelp}
                      className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                    >
                      🧠 {isLoadingApplicationHelp ? 'Analyzing...' : 'How do I apply?'}
                    </Button>
                    <Button
                      onClick={handleAiSkipHelp}
                      disabled={isLoadingSkipHelp}
                      variant="outline"
                      className="border-orange-300 text-orange-700 hover:bg-orange-50 flex items-center gap-2"
                    >
                      ⚠️ {isLoadingSkipHelp ? 'Analyzing...' : 'What if I skip this permit?'}
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 italic text-center">
                    🛈 AI guidance - actual requirements vary by location. Consult local authorities for definitive information.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* AI Application Guidance */}
            {aiApplicationHelp && (
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    🧠 AI Application Guidance for {results.location.city}
                  </CardTitle>
                  <CardDescription>
                    Step-by-step instructions for applying for your permits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-sm text-green-900 bg-white p-4 rounded-lg border border-green-200">
                      {aiApplicationHelp}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Skip Consequences Analysis */}
            {aiSkipHelp && (
              <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-800">
                    ⚠️ Permit Skip Analysis for {results.location.city}
                  </CardTitle>
                  <CardDescription>
                    Important consequences of skipping required permits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-sm text-orange-900 bg-white p-4 rounded-lg border border-orange-200">
                      {aiSkipHelp}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

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
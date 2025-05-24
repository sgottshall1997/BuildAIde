import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Calculator, CalendarCheck, DollarSign, ArrowUp, Check, FileText, Users, Bot, TrendingUp, Home, Building, Search, Target } from "lucide-react";
import AIAssistant from "@/components/ai-assistant";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: estimates } = useQuery({
    queryKey: ["/api/estimates"],
  });

  const { data: schedules } = useQuery({
    queryKey: ["/api/schedules"],
  });

  return (
    <div>
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Spence the Builder | Smart Construction Command Center</h1>
        <p className="text-lg text-slate-600">
          Generate estimates, schedule permits, track leads, and get smart project insights with AI.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">Estimates Submitted This Week</p>
                <p className="text-3xl font-bold text-slate-900">
                  {isLoading ? "..." : stats?.totalEstimates || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-3">Track how many new bids the team has sent</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">Upcoming Inspections (7 Days)</p>
                <p className="text-3xl font-bold text-slate-900">
                  {isLoading ? "..." : stats?.scheduledInspections || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <CalendarCheck className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-3">Stay on top of what's scheduled to avoid delays</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">Open Permits Pending</p>
                <p className="text-3xl font-bold text-slate-900">
                  {isLoading ? "..." : (schedules?.filter(s => s.status === "scheduled").length || 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-3">Permits submitted but not yet approved</p>
          </CardContent>
        </Card>
      </div>

      {/* Smart Construction Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Project Scheduler */}
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Project Scheduler</h3>
                  <p className="text-sm text-slate-500">Manage active construction jobs</p>
                </div>
              </div>
            </div>
            
            <p className="text-slate-600 mb-6">
              Track project timelines, crew assignments, budgets, and profit margins for all active jobs.
            </p>
            
            <Button 
              onClick={() => setLocation("/project-scheduler")} 
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Manage Projects
            </Button>
          </CardContent>
        </Card>

        {/* Bid Estimator */}
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
                  <Calculator className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Bid Estimator</h3>
                  <p className="text-sm text-slate-500">Create project bid estimates</p>
                </div>
              </div>
            </div>
            
            <p className="text-slate-600 mb-6">
              Generate accurate cost estimates for any construction project with AI-powered insights.
            </p>
            
            <Button 
              onClick={() => setLocation("/estimator")} 
              className="w-full bg-primary hover:bg-primary/90"
            >
              Create Estimate
            </Button>
          </CardContent>
        </Card>

        {/* Permit & Inspection Scheduler */}
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mr-4">
                  <CalendarCheck className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Permit & Inspection Scheduler</h3>
                  <p className="text-sm text-slate-500">Manage permits & inspections</p>
                </div>
              </div>
            </div>
            
            <p className="text-slate-600 mb-6">
              Schedule permits and inspections by date to keep all projects on track.
            </p>
            
            <Button 
              onClick={() => setLocation("/scheduler")} 
              className="w-full bg-amber-500 hover:bg-amber-600"
            >
              Schedule Inspection
            </Button>
          </CardContent>
        </Card>

        {/* New Business */}
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">New Business</h3>
                  <p className="text-sm text-slate-500">Track leads & opportunities</p>
                </div>
              </div>
            </div>
            
            <p className="text-slate-600 mb-6">
              Manage leads, track sales opportunities, and grow your construction business.
            </p>
            
            <Button 
              onClick={() => setLocation("/opportunities")} 
              className="w-full bg-green-600 hover:bg-green-700"
            >
              View Opportunities
            </Button>
          </CardContent>
        </Card>

        {/* AI Assistant */}
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                  <Bot className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">AI Assistant</h3>
                  <p className="text-sm text-slate-500">Get smart project insights</p>
                </div>
              </div>
            </div>
            
            <p className="text-slate-600 mb-6">
              Ask Spence the Builder for construction advice, cost estimates, and project guidance.
            </p>
            
            <Button 
              onClick={() => setLocation("/ai-assistant")} 
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Chat with AI
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Section Heading */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">House Flipping Tools</h2>
        <p className="text-slate-600">Complete real estate investment platform for property analysis and portfolio management</p>
      </div>

      {/* House Flipping Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Property Listings */}
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                  <Home className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Property Listings</h3>
                  <p className="text-sm text-slate-500">Find investment opportunities</p>
                </div>
              </div>
            </div>
            
            <p className="text-slate-600 mb-6">
              Search Kensington real estate with smart filters and AI investment analysis.
            </p>
            
            <Button 
              onClick={() => setLocation("/real-estate-listings")} 
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Browse Properties
            </Button>
          </CardContent>
        </Card>

        {/* Flip Portfolio */}
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mr-4">
                  <Building className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Flip Portfolio</h3>
                  <p className="text-sm text-slate-500">Track flip projects & ROI</p>
                </div>
              </div>
            </div>
            
            <p className="text-slate-600 mb-6">
              Manage your house flipping projects from acquisition to sale with performance analytics.
            </p>
            
            <Button 
              onClick={() => setLocation("/flip-portfolio")} 
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              View Portfolio
            </Button>
          </CardContent>
        </Card>

        {/* ROI Calculator */}
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mr-4">
                  <Target className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">ROI Calculator</h3>
                  <p className="text-sm text-slate-500">Calculate flip profitability</p>
                </div>
              </div>
            </div>
            
            <p className="text-slate-600 mb-6">
              Analyze potential returns on house flipping investments with Montgomery County data.
            </p>
            
            <Button 
              onClick={() => setLocation("/roi-calculator")} 
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              Calculate ROI
            </Button>
          </CardContent>
        </Card>

        {/* Permit Lookup */}
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
                  <Search className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Permit Lookup</h3>
                  <p className="text-sm text-slate-500">Research property permits</p>
                </div>
              </div>
            </div>
            
            <p className="text-slate-600 mb-6">
              Look up permit history and current status for any Montgomery County property.
            </p>
            
            <Button 
              onClick={() => setLocation("/permit-lookup")} 
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              Lookup Permits
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* New Business & AI Assistant Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* New Business Tools */}
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">New Business Tools</h3>
                  <p className="text-sm text-slate-500">Growth & opportunity tracking</p>
                </div>
              </div>
            </div>
            
            <p className="text-slate-600 mb-6">
              Discover new opportunities, track leads, and manage your business development pipeline to grow revenue.
            </p>
            
            <Button 
              onClick={() => setLocation("/opportunities")} 
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Users className="h-4 w-4 mr-2" />
              View Opportunities
            </Button>
          </CardContent>
        </Card>

        {/* AI Assistant Tools */}
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                  <Bot className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">AI Assistant</h3>
                  <p className="text-sm text-slate-500">Smart construction advisor</p>
                </div>
              </div>
            </div>
            
            <p className="text-slate-600 mb-6">
              Get instant answers about pricing, permits, materials, and project advice from your AI construction expert.
            </p>
            
            <Button 
              onClick={() => setLocation("/ai-assistant")} 
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Bot className="h-4 w-4 mr-2" />
              Ask Spence the Builder
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* What Should I Prioritize Today */}
      <div className="mb-8">
        <AIAssistant />
      </div>

      {/* Team Activity Log */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Team Activity Log</h3>
          
          <div className="space-y-4">
            {estimates && estimates.length > 0 ? (
              estimates.slice(0, 3).map((estimate: any) => (
                <div key={estimate.id} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calculator className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">
                      Estimate submitted for {estimate.projectType} project - ${estimate.estimatedCost?.toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-500">
                      {estimate.createdAt ? new Date(estimate.createdAt).toLocaleDateString() : 'Recently'}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
                    Submitted
                  </span>
                </div>
              ))
            ) : null}
            
            {schedules && schedules.length > 0 ? (
              schedules.slice(0, 2).map((schedule: any) => (
                <div key={schedule.id} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CalendarCheck className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">
                      {schedule.inspectionType} inspection scheduled - {schedule.address}
                    </p>
                    <p className="text-sm text-slate-500">
                      {schedule.preferredDate} at {schedule.preferredTime}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                    Scheduled
                  </span>
                </div>
              ))
            ) : null}

            {(!estimates || estimates.length === 0) && (!schedules || schedules.length === 0) && (
              <div className="text-center py-8 text-slate-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <p>No recent team activity. Start by creating an estimate or scheduling an inspection.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

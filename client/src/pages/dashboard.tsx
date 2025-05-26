import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { Calculator, CalendarCheck, DollarSign, ArrowUp, Check, FileText, Users, Bot, TrendingUp, Home, Building, Search, Target, ChevronDown, ChevronUp, Calendar, Activity, CheckCircle, Clock, AlertTriangle, Hammer, Truck, Wrench } from "lucide-react";
import AIAssistant from "@/components/ai-assistant";
import { useState } from "react";
import DemoModeBanner from "@/components/demo-mode-banner";
import { useDemoMode } from "@/hooks/useDemoMode";
import ToolCard from "@/components/tool-card";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [showInsights, setShowInsights] = useState(false);
  const { isDemoMode, bannerVisible, dismissBanner } = useDemoMode();
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: estimates } = useQuery({
    queryKey: ["/api/estimates"],
  });

  const { data: schedules } = useQuery({
    queryKey: ["/api/schedules"],
  });

  const { data: materialPrices } = useQuery({
    queryKey: ["/api/material-prices"],
  });

  const { data: realEstateListings } = useQuery({
    queryKey: ["/api/real-estate-listings"],
  });

  // Calculate business metrics
  const activeProjects = schedules?.filter(s => s.status === 'In Progress')?.length || 0;
  
  const getNextProjectEndDate = () => {
    if (!schedules || !Array.isArray(schedules)) return null;
    const activeProjects = schedules.filter(s => s.status === 'In Progress');
    if (activeProjects.length === 0) return null;
    
    const nextEndDate = activeProjects
      .map(p => new Date(p.endDate))
      .sort((a, b) => a.getTime() - b.getTime())[0];
    
    return nextEndDate;
  };

  const calculateMaterialTrend = () => {
    if (!materialPrices || !Array.isArray(materialPrices)) return 0;
    
    const totalChange = materialPrices.reduce((sum, material) => {
      return sum + (material.changePercent || 0);
    }, 0);
    
    return materialPrices.length > 0 ? (totalChange / materialPrices.length).toFixed(1) : 0;
  };

  const getRecentFlipRecommendations = () => {
    if (!realEstateListings || !Array.isArray(realEstateListings)) return [];
    
    return realEstateListings
      .filter(listing => listing.aiSummary)
      .slice(0, 3)
      .map(listing => ({
        address: listing.address,
        date: new Date().toLocaleDateString(),
        summary: listing.aiSummary?.substring(0, 100) + '...'
      }));
  };

  // Professional Tools Configuration
  const professionalTools = [
    {
      id: "smart-project-manager",
      title: "Smart Project Manager",
      subtitle: "Complete Project Control",
      description: "Manage projects, schedules, and teams with AI-powered insights and automated tracking",
      icon: Building,
      href: "/project-manager",
      emoji: "🏗️",
      tagline: "Manage projects like a pro",
      features: ["Project tracking", "Team coordination", "Progress insights"],
      estimatedTime: "2-3 minutes",
      isPro: true
    },
    {
      id: "budget-planner",
      title: "Budget Planner",
      subtitle: "Smart Cost Management",
      description: "Advanced cost estimation and budget forecasting with material price tracking",
      icon: Calculator,
      href: "/budget-planner",
      emoji: "💰",
      tagline: "Estimate smarter, profit more",
      features: ["Cost estimation", "Budget forecasting", "Price tracking"],
      estimatedTime: "3-5 minutes"
    },
    {
      id: "investment-roi-tool",
      title: "Investment ROI Tool",
      subtitle: "Property Investment Analysis",
      description: "Comprehensive flip and rental ROI analysis with market data integration",
      icon: TrendingUp,
      href: "/investment-roi-tool",
      emoji: "📈",
      tagline: "Maximize investment returns",
      features: ["Flip analysis", "Rental ROI", "Market insights"],
      estimatedTime: "4-6 minutes"
    },
    {
      id: "ai-assistant",
      title: "AI Construction Assistant",
      subtitle: "Expert Guidance 24/7",
      description: "Get professional advice from Spencer, your AI construction consultant with industry expertise",
      icon: Bot,
      href: "/ai-assistant",
      emoji: "🤖",
      tagline: "Your smart construction advisor",
      features: ["Expert advice", "Code compliance", "Best practices"],
      estimatedTime: "1-2 minutes"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Demo Mode Banner */}
      {isDemoMode && bannerVisible && (
        <DemoModeBanner 
          isVisible={bannerVisible} 
          onDismiss={dismissBanner} 
        />
      )}

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Welcome to ConstructionSmartTools Pro
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Smart project management, scheduling, and quoting for construction professionals
            </p>
            
            {/* Feature Bullets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="flex items-center justify-center md:justify-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                <span className="text-lg">
                  <strong>Estimate Smarter</strong> — Fast & reliable project estimates
                </span>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-3">
                <Calendar className="w-6 h-6 text-green-400 flex-shrink-0" />
                <span className="text-lg">
                  <strong>Schedule Confidently</strong> — Visual timelines + crew assignments
                </span>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-3">
                <Activity className="w-6 h-6 text-green-400 flex-shrink-0" />
                <span className="text-lg">
                  <strong>Manage Like a Pro</strong> — Track leads, permits, budgets in one place
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Professional Tools Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Professional Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {professionalTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                categoryColor="blue"
                onToolClick={() => setLocation(tool.href)}
              />
            ))}
          </div>
        </div>

        {/* Pro Market Insights Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Pro Market Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Permit Approval Times */}
            <Card className="bg-white/50 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-400 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-slate-900">Permit Processing</CardTitle>
                    <p className="text-sm text-slate-600">Avg approval time</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-blue-600">10-14 days</div>
                  <p className="text-sm text-slate-600">Varies by county</p>
                  <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Peak season delays
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Material Lead Times */}
            <Card className="bg-white/50 backdrop-blur-sm border-2 border-green-200 hover:border-green-400 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                    <Truck className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-slate-900">Material Delivery</CardTitle>
                    <p className="text-sm text-slate-600">Drywall lead time</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-green-600">6 days avg</div>
                  <p className="text-sm text-slate-600">Standard delivery</p>
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    In stock locally
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Labor Availability */}
            <Card className="bg-white/50 backdrop-blur-sm border-2 border-orange-200 hover:border-orange-400 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                    <Hammer className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-slate-900">Labor Market</CardTitle>
                    <p className="text-sm text-slate-600">Masonry crews</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-orange-600">Low supply</div>
                  <p className="text-sm text-slate-600">In your region</p>
                  <Badge className="bg-orange-100 text-orange-800 text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    Book 2-3 weeks ahead
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Equipment Availability */}
            <Card className="bg-white/50 backdrop-blur-sm border-2 border-purple-200 hover:border-purple-400 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                    <Wrench className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-slate-900">Equipment Rental</CardTitle>
                    <p className="text-sm text-slate-600">Excavator availability</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-purple-600">Good supply</div>
                  <p className="text-sm text-slate-600">Multiple options</p>
                  <Badge className="bg-purple-100 text-purple-800 text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Same-day available
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mode Switch */}
        <div className="text-center">
          <Button 
            onClick={() => setLocation("/consumer")}
            variant="outline"
            size="lg"
            className="bg-green-50 border-green-200 hover:bg-green-100 text-green-700 font-semibold"
          >
            <Home className="w-5 h-5 mr-2" />
            Switch to Homeowner Mode
            </Button>
            <p className="text-xs text-slate-500 mt-1">Simple tools for consumers</p>
          </div>
        </div>
      </div>
    </div>
  );
}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">Active Projects</p>
                <p className="text-3xl font-bold text-slate-900">
                  {activeProjects}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-3">Projects currently in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">Next Project End</p>
                <p className="text-lg font-bold text-slate-900">
                  {getNextProjectEndDate() ? 
                    getNextProjectEndDate().toLocaleDateString() : 
                    'No active projects'
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-3">Upcoming project completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">Material Cost Trend</p>
                <p className="text-2xl font-bold text-slate-900 flex items-center gap-1">
                  {calculateMaterialTrend() > 0 ? '+' : ''}{calculateMaterialTrend()}%
                  {calculateMaterialTrend() > 0 ? 
                    <ArrowUp className="h-4 w-4 text-red-500" /> : 
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-3">30-day average price change</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">AI Recommendations</p>
                <p className="text-3xl font-bold text-slate-900">
                  {getRecentFlipRecommendations().length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Bot className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-3">Recent flip analysis completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent AI Insights Section */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-purple-600" />
              Recent AI Insights
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInsights(!showInsights)}
              className="flex items-center gap-1"
            >
              {showInsights ? (
                <>
                  Hide <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Show <ChevronDown className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        {showInsights && (
          <CardContent>
            {getRecentFlipRecommendations().length > 0 ? (
              <div className="space-y-4">
                <h4 className="font-medium text-slate-900">Latest Flip Analysis</h4>
                {getRecentFlipRecommendations().map((rec, index) => (
                  <div key={index} className="bg-slate-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-slate-800">{rec.address}</h5>
                      <span className="text-sm text-slate-500">{rec.date}</span>
                    </div>
                    <p className="text-sm text-slate-600">{rec.summary}</p>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLocation("/real-estate-listings")}
                  className="w-full"
                >
                  View All Property Analysis
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Bot className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h4 className="font-medium text-slate-700 mb-2">No AI Insights Yet</h4>
                <p className="text-slate-600 mb-4">Start using AI features to see insights here</p>
                <Button
                  onClick={() => setLocation("/real-estate-listings")}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Generate AI Analysis
                </Button>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Smart Construction Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Smart Project Manager */}
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Smart Project Manager</h3>
                  <p className="text-sm text-slate-500">Projects + scheduling + timeline</p>
                </div>
              </div>
            </div>
            
            <p className="text-slate-600 mb-6">
              Comprehensive project management with scheduling, crew assignments, budgets, and timeline visualization.
            </p>
            
            <Button 
              onClick={() => setLocation("/project-scheduler")} 
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Manage Projects
            </Button>
          </CardContent>
        </Card>

        {/* Investment ROI Tool */}
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Smart Investment ROI Tool</h3>
                  <p className="text-sm text-slate-500">Flip & rental analysis</p>
                </div>
              </div>
            </div>
            
            <p className="text-slate-600 mb-6">
              Comprehensive ROI analysis for both house flipping and rental property investments with market insights.
            </p>
            
            <Button 
              onClick={() => setLocation("/investment-roi-tool")} 
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Analyze Investments
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
                  <h3 className="text-lg font-semibold text-slate-900">Permit & Inspection Hub</h3>
                  <p className="text-sm text-slate-500">Permits + inspections + lookup</p>
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
                  <h3 className="text-lg font-semibold text-slate-900">Construction AI Assistant</h3>
                  <p className="text-sm text-slate-500">Spence the Builder Pro</p>
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

        {/* Material Prices */}
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
                  <DollarSign className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Material Cost Intelligence Center</h3>
                  <p className="text-sm text-slate-500">Live pricing + trends + forecasts</p>
                </div>
              </div>
            </div>
            
            <p className="text-slate-600 mb-6">
              Track current material costs and market trends for accurate project bidding and cost control.
            </p>
            
            <Button 
              onClick={() => setLocation("/material-prices")} 
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              View Material Prices
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Section Heading */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Real Estate & Flipping</h2>
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
                  <h3 className="text-lg font-semibold text-slate-900">Property Intelligence Hub</h3>
                  <p className="text-sm text-slate-500">Listings + ROI + permits + portfolio</p>
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

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { Calculator, CalendarCheck, DollarSign, ArrowUp, Check, FileText, Users, Bot, TrendingUp, Home, Building, Search, Target, ChevronDown, ChevronUp, Calendar, Activity, CheckCircle, Clock, AlertTriangle, Hammer, Truck, Wrench, ArrowRight } from "lucide-react";
import AIAssistant from "@/components/ai-assistant";
import { useState } from "react";
import DemoModeBanner from "@/components/demo-mode-banner";
import { useDemoMode } from "@/hooks/useDemoMode";
import ToolCard from "@/components/tool-card";
import ProMarketInsights from "@/components/pro-market-insights";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [showInsights, setShowInsights] = useState(false);
  const { isDemoMode, bannerVisible, dismissBanner } = useDemoMode();

  // Professional tools data matching ToolCard format
  const proTools = [
    {
      id: 'estimator',
      title: 'Project Estimator',
      subtitle: 'AI-powered cost estimation',
      description: 'Input project details and receive comprehensive cost breakdowns with AI-driven insights and regional pricing data.',
      href: '/estimator',
      emoji: '🏗',
      tagline: 'Generate accurate project estimates in minutes',
      features: ['Cost Breakdown', 'AI Analysis', 'Regional Data'],
      isPro: true,
      estimatedTime: '5-8 minutes'
    },
    {
      id: 'bid-estimator',
      title: 'Bid Generator',
      subtitle: 'Professional bid proposals',
      description: 'Quickly build proposals for clients and get AI-polished language for professional delivery and higher win rates.',
      href: '/bid-estimator',
      emoji: '📝',
      tagline: 'Create winning proposals with AI polish',
      features: ['AI Polish', 'Templates', 'PDF Export'],
      isPro: true,
      estimatedTime: '10-15 minutes'
    },
    {
      id: 'scheduler',
      title: 'Schedule Builder',
      subtitle: 'Project timeline management',
      description: 'Plan project timelines with resource allocation, milestone tracking, and conflict detection for optimal project flow.',
      href: '/scheduler',
      emoji: '📅',
      tagline: 'Smart scheduling with AI optimization',
      features: ['Timeline Planning', 'Resources', 'Milestones'],
      isPro: true,
      estimatedTime: '15-20 minutes'
    },
    {
      id: 'material-prices',
      title: 'Material Price Center',
      subtitle: 'Live pricing and trends',
      description: 'Access current material pricing with AI-powered trend analysis and cost-saving recommendations.',
      href: '/material-prices',
      emoji: '📦',
      tagline: 'Stay ahead of market pricing trends',
      features: ['Live Pricing', 'Trend Analysis', 'AI Suggestions'],
      isPro: true,
      estimatedTime: '3-5 minutes'
    },
    {
      id: 'ai-assistant',
      title: 'Construction AI Assistant',
      subtitle: 'Expert construction guidance',
      description: 'Get instant answers to construction questions, code requirements, and industry best practices from AI.',
      href: '/ai-assistant',
      emoji: '💬',
      tagline: 'Your AI construction expert on demand',
      features: ['Expert Guidance', 'Code Help', 'Best Practices'],
      isPro: true,
      estimatedTime: 'Instant responses'
    },
    {
      id: 'subcontractors',
      title: 'Subcontractor Tracker',
      subtitle: 'Manage your contractor network',
      description: 'Track subcontractor performance, manage contacts, and get AI recommendations for project matching.',
      href: '/subcontractors',
      emoji: '🔍',
      tagline: 'Build and manage your trusted network',
      features: ['Contact Management', 'AI Matching', 'Performance Tracking'],
      isPro: true,
      estimatedTime: '5-10 minutes'
    }
  ];
  
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

  const nextProjectEndDate = getNextProjectEndDate();
  const nextProjectDaysLeft = nextProjectEndDate ? Math.ceil((nextProjectEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;

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
          onDismiss={dismissBanner}
          message="You're in demo mode. Try all features risk-free!"
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
        {/* Professional Construction Tools */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Professional Construction Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proTools.map((tool, index) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                categoryColor="blue"
                onToolClick={() => setLocation(tool.href)}
              />
            ))}

            <Card className="bg-white/50 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 cursor-pointer group" onClick={() => setLocation('/estimator')}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                      <span className="text-2xl">🏗</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-tight mb-1">
                        Project Estimator
                      </CardTitle>
                      <p className="text-sm text-slate-600 font-medium mb-1">AI-powered cost estimation</p>
                      <p className="text-xs text-blue-600 font-medium italic">💡 Generate accurate project estimates in minutes</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 ml-2" />
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <p className="text-sm text-slate-700 leading-relaxed">
                  Input project details and receive comprehensive cost breakdowns with AI-driven insights and regional pricing data.
                </p>
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Key Features</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {['Cost Breakdown', 'AI Analysis', 'Regional Data'].map((feature, idx) => (
                      <Badge key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 border-0">{feature}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  <span>Est. 5-8 minutes</span>
                </div>
              </CardContent>
            </Card>

            {/* Bid Generator */}
            <Card className="bg-white/50 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 cursor-pointer group" onClick={() => setLocation('/bid-estimator')}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                      <span className="text-2xl">📝</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-tight mb-1">
                        Bid Generator
                      </CardTitle>
                      <p className="text-sm text-slate-600 font-medium mb-1">Professional bid proposals</p>
                      <p className="text-xs text-blue-600 font-medium italic">💡 Create winning proposals with AI polish</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 ml-2" />
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <p className="text-sm text-slate-700 leading-relaxed">
                  Quickly build proposals for clients and get AI-polished language for professional delivery and higher win rates.
                </p>
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Key Features</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {['AI Polish', 'Templates', 'PDF Export'].map((feature, idx) => (
                      <Badge key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 border-0">{feature}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  <span>Est. 10-15 minutes</span>
                </div>
              </CardContent>
            </Card>

            {/* Schedule Builder */}
            <Card className="bg-white/50 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 cursor-pointer group" onClick={() => setLocation('/scheduler')}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <CalendarCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg text-slate-900">Schedule Builder</CardTitle>
                    <p className="text-sm text-slate-600">Project timeline management</p>
                  </div>
                  <span className="text-2xl">📅</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-3">Plan project timelines with resource allocation and milestone tracking.</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {['Timeline Planning', 'Resources', 'Milestones'].map((feature, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">{feature}</Badge>
                  ))}
                </div>
                <p className="text-xs text-slate-500">⏱️ 15-20 minutes</p>
              </CardContent>
            </Card>

            {/* Material Price Center */}
            <Card className="bg-white/50 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 cursor-pointer group" onClick={() => setLocation('/material-prices')}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg text-slate-900">Material Price Center</CardTitle>
                    <p className="text-sm text-slate-600">Real-time pricing & trends</p>
                  </div>
                  <span className="text-2xl">📦</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-3">Browse or search material pricing with AI-backed suggestions for cost optimization.</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {['Price Tracking', 'AI Suggestions', 'Cost Optimization'].map((feature, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">{feature}</Badge>
                  ))}
                </div>
                <p className="text-xs text-slate-500">⏱️ 3-5 minutes</p>
              </CardContent>
            </Card>

            {/* Construction AI Assistant */}
            <Card className="bg-white/50 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 cursor-pointer group" onClick={() => setLocation('/ai-assistant')}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Bot className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg text-slate-900">Construction AI Assistant</CardTitle>
                    <p className="text-sm text-slate-600">GPT-powered expertise</p>
                  </div>
                  <span className="text-2xl">🤖</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-3">Get expert answers to technical questions and construction challenges.</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {['Technical Q&A', 'Code Compliance', 'Best Practices'].map((feature, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">{feature}</Badge>
                  ))}
                </div>
                <p className="text-xs text-slate-500">⏱️ 2-3 minutes</p>
              </CardContent>
            </Card>

            {/* Subcontractor Tracker */}
            <Card className="bg-white/50 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 cursor-pointer group" onClick={() => setLocation('/subcontractors')}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg text-slate-900">Subcontractor Tracker</CardTitle>
                    <p className="text-sm text-slate-600">Manage your crew network</p>
                  </div>
                  <span className="text-2xl">🔍</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-3">Search and manage subcontractors with AI-matching for the best fit by location and trade.</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {['AI Matching', 'Location Search', 'Trade Skills'].map((feature, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">{feature}</Badge>
                  ))}
                </div>
                <p className="text-xs text-slate-500">⏱️ 5-10 minutes</p>
              </CardContent>
            </Card>

            {/* Lead Finder */}
            <Card className="bg-white/50 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 cursor-pointer group" onClick={() => setLocation('/leads')}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg text-slate-900">Lead Finder</CardTitle>
                    <p className="text-sm text-slate-600">Discover new opportunities</p>
                  </div>
                  <span className="text-2xl">📬</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-3">Browse property leads or jobs worth bidding on with instant AI analysis of profitability.</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {['Lead Discovery', 'AI Analysis', 'Profit Assessment'].map((feature, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">{feature}</Badge>
                  ))}
                </div>
                <p className="text-xs text-slate-500">⏱️ 5-10 minutes</p>
              </CardContent>
            </Card>




          </div>
        </div>

        {/* Pro Market Insights Section */}
        <ProMarketInsights />

        {/* Mode Switch */}
        <div className="text-center mb-8">
          <div className="inline-flex flex-col items-center space-y-4 p-6 bg-white rounded-xl shadow-lg border border-slate-200">
            <div className="text-sm font-medium text-slate-600 mb-2">Need simpler tools?</div>
            <Button 
              onClick={() => setLocation("/consumer")}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Home className="w-5 h-5 mr-2" />
              Switch to Homeowner Mode
            </Button>
            <p className="text-xs text-slate-500 max-w-sm text-center leading-relaxed">
              Access user-friendly renovation planning tools designed for homeowners and investors
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
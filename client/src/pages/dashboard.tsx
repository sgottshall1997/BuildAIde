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
      subtitle: 'Generate accurate project estimates with AI-powered cost analysis and regional pricing insights',
      description: 'Input project details and receive comprehensive cost breakdowns with AI-driven insights and regional pricing data.',
      href: '/estimator',
      emoji: '🏗',
      tagline: 'AI Insight: Reduces estimate variance by 73%',
      features: ['Cost Breakdown', 'AI Analysis', 'Regional Data'],
      isPro: true,
      estimatedTime: '5-8 minutes'
    },
    {
      id: 'bid-estimator',
      title: 'Bid Generator',
      subtitle: 'Create professional bid proposals with AI-polished language for higher win rates',
      description: 'Quickly build proposals for clients and get AI-polished language for professional delivery and higher win rates.',
      href: '/bid-estimator',
      emoji: '📝',
      tagline: 'AI Insight: Increases win rate by 31%',
      features: ['AI Polish', 'Templates', 'PDF Export'],
      isPro: true,
      estimatedTime: '10-15 minutes'
    },
    {
      id: 'scheduler',
      title: 'Schedule Builder',
      subtitle: 'Plan project timelines with resource allocation and milestone tracking for optimal flow',
      description: 'Plan project timelines with resource allocation, milestone tracking, and conflict detection for optimal project flow.',
      href: '/scheduler',
      emoji: '📅',
      tagline: 'AI Insight: Reduces project delays by 42%',
      features: ['Timeline Planning', 'Resources', 'Milestones'],
      isPro: true,
      estimatedTime: '15-20 minutes'
    },
    {
      id: 'material-prices',
      title: 'Material Price Center',
      subtitle: 'Track material costs and price trends with real-time market data and automated alerts',
      description: 'Access current material pricing with AI-powered trend analysis and cost-saving recommendations.',
      href: '/material-prices',
      emoji: '📦',
      tagline: 'AI Insight: Saves average 12% on material costs',
      features: ['Live Pricing', 'Trend Analysis', 'AI Suggestions'],
      isPro: true,
      estimatedTime: '3-5 minutes'
    },
    {
      id: 'ai-assistant',
      title: 'Construction AI Assistant',
      subtitle: 'Get instant answers to construction questions and industry best practices from AI',
      description: 'Get instant answers to construction questions, code requirements, and industry best practices from AI.',
      href: '/ai-assistant',
      emoji: '💬',
      tagline: 'AI Insight: Resolves 89% of queries instantly',
      features: ['Expert Guidance', 'Code Help', 'Best Practices'],
      isPro: true,
      estimatedTime: 'Instant responses'
    },
    {
      id: 'subcontractors',
      title: 'Subcontractor Tracker',
      subtitle: 'Track subcontractor performance and get AI recommendations for project matching',
      description: 'Track subcontractor performance, manage contacts, and get AI recommendations for project matching.',
      href: '/subcontractors',
      emoji: '🔍',
      tagline: 'AI Insight: Improves project completion by 28%',
      features: ['Contact Management', 'AI Matching', 'Performance Tracking'],
      isPro: true,
      estimatedTime: '5-10 minutes'
    },
    {
      id: 'lead-finder',
      title: 'Lead Finder',
      subtitle: 'Find potential projects and clients using AI-powered market analysis and lead generation',
      description: 'Find potential projects and clients in your area using AI-powered market analysis and lead generation.',
      href: '/lead-finder',
      emoji: '🎯',
      tagline: 'AI Insight: Generates 40% more qualified leads',
      features: ['Market Analysis', 'Lead Generation', 'Opportunity Tracking'],
      isPro: true,
      estimatedTime: '3-5 minutes'
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
              Welcome to BuildAIde Pro
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Smart project management, scheduling, and quoting for construction professionals
            </p>
            
            {/* Key Benefits - 3 Column Layout to Match Consumer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Estimate Smarter</h3>
                <p className="text-blue-100">— Fast & reliable project estimates</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Schedule Confidently</h3>
                <p className="text-blue-100">— Visual timelines + crew assignments</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Manage Like a Pro</h3>
                <p className="text-blue-100">— Track leads, permits, budgets in one place</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="container mx-auto px-4 py-8">
          {/* Professional Construction Tools */}
          <div className="w-full max-w-6xl mx-auto px-4 mb-12">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-blue-900">Professional Construction Tools</h1>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {proTools.map((tool) => (
                <div key={tool.id} className="h-full">
                  <ToolCard
                    tool={tool}
                    categoryColor="blue"
                    onToolClick={() => setLocation(tool.href)}
                  />
                </div>
              ))}
            </div>
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
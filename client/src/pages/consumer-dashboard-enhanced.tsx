import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link, useLocation } from "wouter";
import { 
  Calculator, 
  FileSearch, 
  Home, 
  ArrowRight, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Lightbulb, 
  MapPin, 
  Star, 
  Building, 
  Wrench, 
  Target,
  Sparkles,
  MessageSquare,
  Calendar,
  CheckCircle,
  PieChart
} from "lucide-react";
import { ModeSwitcher } from "@/components/mode-toggle";
import { useFreemium } from "@/hooks/use-freemium";
import EmailSignupModal from "@/components/email-signup-modal";
import ToolCard from "@/components/tool-card";
import FeedbackButton from "@/components/feedback-button";

export default function ConsumerDashboardEnhanced() {
  const [location, setLocation] = useLocation();
  const { 
    trackToolUsage, 
    showSignupModal, 
    handleEmailSubmitted, 
    closeSignupModal, 
    hasProvidedEmail, 
    remainingUses 
  } = useFreemium();
  
  // Fetch material prices for market trends
  const { data: materialPrices } = useQuery({
    queryKey: ["/api/material-prices"],
  });

  // Get user's location and progress from session storage
  const [userLocation, setUserLocation] = useState("");
  const [userProgress, setUserProgress] = useState<{completed: number, total: number} | null>(null);

  useEffect(() => {
    // Check for stored location data
    const storedLocation = sessionStorage.getItem('userLocation');
    if (storedLocation) {
      setUserLocation(storedLocation);
    }

    // Check for progress data (from previous wizard completion)
    const wizardProgress = sessionStorage.getItem('wizardProgress');
    if (wizardProgress) {
      try {
        const progress = JSON.parse(wizardProgress);
        setUserProgress(progress);
      } catch (error) {
        console.error('Error parsing progress data:', error);
      }
    }
  }, []);

  const handleToolClick = (toolPath: string) => {
    trackToolUsage();
    setLocation(toolPath);
  };

  const tools = [
    {
      id: 'budget-planner',
      title: 'Smart Budget Planner',
      subtitle: 'Plan your renovation budget with AI-powered cost forecasts',
      description: 'Get accurate renovation cost estimates with AI-powered analysis, timeline planning, and local market data integration.',
      href: '/budget-planner',
      icon: Calculator,
      emoji: '🧠',
      tagline: 'Plan smarter with AI insights',
      features: ['AI Cost Forecasting', 'Timeline & Labor Estimation', 'Budget Range Breakdown', 'Room-by-Room Inputs', 'Instant Updates'],
      estimatedTime: '2-3 minutes'
    },
    {
      id: 'investment-roi',
      title: 'Property ROI Analyzer',
      subtitle: 'Analyze flip and rental property returns with market data',
      description: 'Comprehensive analysis of house flip profitability and rental property ROI with real market trends and cost projections.',
      href: '/investment-roi-tool',
      icon: TrendingUp,
      emoji: '📊',
      tagline: 'Maximize your investment returns',
      features: ['Flip Profit Calculator', 'Rental Cash Flow Analysis', 'Market Trend Data', 'ROI Comparisons', 'Risk Assessment'],
      estimatedTime: '4-6 minutes'
    },
    {
      id: 'renovation-concierge',
      title: 'Renovation Concierge',
      subtitle: 'Guided planning assistant with personalized recommendations',
      description: 'Step-by-step guided planning with personalized recommendations, tool suggestions, and expert advice tailored to your project.',
      href: '/renovation-concierge',
      icon: Target,
      emoji: '🎯',
      tagline: 'Your guided renovation planner',
      features: ['Guided Planning', 'Personalized Recommendations', 'Tool Suggestions', 'Expert Advice', 'Step-by-Step Process'],
      estimatedTime: '3-5 minutes'
    },
    {
      id: 'homeowner-chat',
      title: 'Homeowner Chat Assistant',
      subtitle: 'AI-powered Q&A for all your renovation questions',
      description: 'Get instant answers to any renovation question with our GPT-powered assistant. From permits to best practices, ask anything!',
      href: '/homeowner-chat',
      icon: MessageSquare,
      emoji: '💬',
      tagline: 'Ask anything about renovation',
      features: ['Instant AI Responses', 'Permit Questions', 'Best Practices', 'Cost Guidance', 'Timeline Advice'],
      estimatedTime: '1-2 minutes',
      isNew: true
    },
    {
      id: 'permit-research',
      title: 'Permit Research Tool',
      subtitle: 'Find required permits and approval processes for your area',
      description: 'Research local permit requirements, fees, and approval timelines for your renovation project with comprehensive database access.',
      href: '/permit-research',
      icon: FileSearch,
      emoji: '📝',
      tagline: 'Navigate permits with confidence',
      features: ['Local Permit Database', 'Fee Calculator', 'Timeline Estimates', 'Application Guidance', 'Code Requirements'],
      estimatedTime: '3-4 minutes'
    }
  ];

  const marketTrends = [
    { material: 'Lumber', change: '+3.2%', trend: 'up' as const },
    { material: 'Steel', change: '-1.8%', trend: 'down' as const },
    { material: 'Concrete', change: '+0.5%', trend: 'up' as const },
    { material: 'Electrical', change: '+2.1%', trend: 'up' as const }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Welcome to ConstructionSmartTools — Homeowner Edition
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
              Your complete renovation planning toolkit designed specifically for homeowners
            </p>
            
            {/* Key Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Lightbulb className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Plan Smarter</h3>
                  <p className="text-sm text-slate-600">Explore project costs and timelines before you commit</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <DollarSign className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Budget Confidently</h3>
                  <p className="text-sm text-slate-600">Compare contractor quotes and set realistic budgets</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-teal-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Invest Wisely</h3>
                  <p className="text-sm text-slate-600">Track potential ROI for flips or renovations</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-lime-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Stay in Control</h3>
                  <p className="text-sm text-slate-600">Save permits, notes, and timelines in one place</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Main Tools Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Your Renovation Toolkit</h2>
            <ModeSwitcher currentMode="consumer" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, index) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                categoryColor={index % 4 === 0 ? 'green' : index % 4 === 1 ? 'teal' : index % 4 === 2 ? 'emerald' : 'lime'}
                onToolClick={() => handleToolClick(tool.href)}
              />
            ))}
          </div>
        </div>

        {/* Market Insights Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Market Trends */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Material Price Trends
              </CardTitle>
              <CardDescription>
                Stay informed about current market conditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketTrends.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                    <span className="font-medium text-slate-900">{item.material}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${
                        item.trend === 'up' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {item.change}
                      </span>
                      <div className={`w-2 h-2 rounded-full ${
                        item.trend === 'up' ? 'bg-red-500' : 'bg-green-500'
                      }`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Progress Tracker */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Target className="w-5 h-5 text-green-600" />
                Your Progress
              </CardTitle>
              <CardDescription>
                Track your renovation planning journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userProgress ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">
                      Planning Steps Completed
                    </span>
                    <span className="text-sm text-slate-500">
                      {userProgress.completed}/{userProgress.total}
                    </span>
                  </div>
                  <Progress 
                    value={(userProgress.completed / userProgress.total) * 100} 
                    className="h-3"
                  />
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>Great progress! Keep going.</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <PieChart className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600 mb-4">
                    Start using our tools to track your renovation planning progress
                  </p>
                  <Button 
                    onClick={() => handleToolClick('/budget-planner')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Begin Planning
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Pro Tips Section */}
        <Card className="shadow-lg border-0 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <Lightbulb className="w-5 h-5" />
              Pro Tips for Homeowners
            </CardTitle>
            <CardDescription className="text-amber-700">
              Expert advice to help you save time and money
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                {[
                  "Always budget 15-20% extra for unexpected costs",
                  "Best time to renovate: Fall/Winter for better contractor rates",
                  "Get 3+ quotes and check references before hiring"
                ].map((tip, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-amber-800">{tip}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {[
                  "Research permits early - they can take 2-8 weeks",
                  "Order materials 10% extra to account for waste",
                  "Document everything with photos for insurance"
                ].map((tip, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-amber-800">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Signup Modal */}
        {showSignupModal && (
          <EmailSignupModal
            isOpen={showSignupModal}
            onClose={closeSignupModal}
            onEmailSubmitted={handleEmailSubmitted}
            remainingUses={remainingUses}
          />
        )}
      </div>
      
      {/* Feedback Button */}
      <FeedbackButton toolName="Consumer Dashboard" />
    </div>
  );
}
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
import { ModeToggle } from "@/components/mode-toggle";
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
      title: 'Budget Planner',
      subtitle: 'Plan your renovation budget with AI-powered cost forecasts',
      description: 'Get accurate renovation cost estimates with AI-powered analysis, timeline planning, and local market data integration.',
      href: '/budget-planner',
      icon: Calculator,
      emoji: '🧮',
      tagline: 'Plan smarter with AI insights',
      features: ['AI Cost Forecasting', 'Timeline & Labor Estimation', 'Budget Range Breakdown', 'Room-by-Room Inputs', 'Instant Updates'],
      estimatedTime: '2-3 minutes'
    },
    {
      id: 'investment-roi',
      title: 'ROI Calculator',
      subtitle: 'Analyze flip and rental property returns with market data',
      description: 'Comprehensive analysis of house flip profitability and rental property ROI with real market trends and cost projections.',
      href: '/investment-roi-tool',
      icon: TrendingUp,
      emoji: '📈',
      tagline: 'Maximize your investment returns',
      features: ['Flip Profit Calculator', 'Rental Cash Flow Analysis', 'Market Trend Data', 'ROI Comparisons', 'Risk Assessment'],
      estimatedTime: '4-6 minutes'
    },
    {
      id: 'permit-research',
      title: 'Permit Research Tool',
      subtitle: 'Find required permits and approval processes for your area',
      description: 'Research local permit requirements, fees, and approval timelines for your renovation project with comprehensive database access.',
      href: '/permit-research',
      icon: FileSearch,
      emoji: '🗺',
      tagline: 'Navigate permits with confidence',
      features: ['Local Permit Database', 'Fee Calculator', 'Timeline Estimates', 'Application Guidance', 'Code Requirements'],
      estimatedTime: '3-4 minutes'
    },
    {
      id: 'renovation-concierge',
      title: 'Renovation Concierge',
      subtitle: 'Guided planning assistant with personalized recommendations',
      description: 'Step-by-step guided planning with personalized recommendations, tool suggestions, and expert advice tailored to your project.',
      href: '/renovation-concierge',
      icon: Target,
      emoji: '🧞',
      tagline: 'Your guided renovation planner',
      features: ['Guided Planning', 'Personalized Recommendations', 'Tool Suggestions', 'Expert Advice', 'Step-by-Step Process'],
      estimatedTime: '3-5 minutes'
    },
    {
      id: 'homeowner-chat',
      title: 'Homeowner AI Chat',
      subtitle: 'AI-powered Q&A for all your renovation questions',
      description: 'Get instant answers to any renovation question with our GPT-powered assistant. From permits to best practices, ask anything!',
      href: '/homeowner-chat',
      icon: MessageSquare,
      emoji: '💬',
      tagline: 'Ask anything about renovation',
      features: ['Instant AI Responses', 'Permit Questions', 'Best Practices', 'Cost Guidance', 'Timeline Advice'],
      estimatedTime: '1-2 minutes'
    },
    {
      id: 'properties',
      title: 'Property Search + Flip Analyzer',
      subtitle: 'Discover and analyze properties for renovation and flipping',
      description: 'Find properties with flip potential using AI-powered analysis. Get instant insights on investment viability and renovation opportunities.',
      href: '/properties',
      icon: Building,
      emoji: '🏠',
      tagline: 'Discover your next investment',
      features: ['Property Search', 'AI Flip Analysis', 'Market Insights', 'ROI Predictions', 'Investment Scoring'],
      estimatedTime: '3-5 minutes'
    },
    {
      id: 'compare-contractors',
      title: 'Contractor Quote Comparison',
      subtitle: 'Compare multiple contractor quotes with AI-powered analysis',
      description: 'Upload or input multiple contractor quotes and get AI recommendations on which option offers the best value based on market pricing and project scope.',
      href: '/compare-contractors',
      icon: Users,
      emoji: '🧾',
      tagline: 'Choose contractors with confidence',
      features: ['Multi-Quote Analysis', 'Red Flag Detection', 'Market Price Comparison', 'AI Recommendations', 'Value Assessment'],
      estimatedTime: '3-4 minutes'
    },
    {
      id: 'expense-tracker',
      title: 'AI Expense Tracker',
      subtitle: 'Track renovation expenses with smart budget monitoring',
      description: 'Monitor your renovation costs in real-time, compare against budgets, and get AI-powered tips for cost optimization and savings.',
      href: '/expense-tracker',
      icon: DollarSign,
      emoji: '💰',
      tagline: 'Stay on budget with AI insights',
      features: ['Real-time Tracking', 'Budget Comparison', 'Cost Analysis', 'Savings Tips', 'Expense Reports'],
      estimatedTime: '2-3 minutes',
      isNew: true
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
              Welcome to BuildAIde — Homeowner Edition
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
              Your complete renovation planning toolkit designed specifically for homeowners
            </p>
            
            {/* Key Benefits - 3 Column Layout to Match Pro */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Plan Smarter</h3>
                <p className="text-green-100">— Explore project costs and timelines before you commit</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Budget Confidently</h3>
                <p className="text-green-100">— Compare contractor quotes and set realistic budgets</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Manage Like a Pro</h3>
                <p className="text-green-100">— Track permits, budgets, and timelines in one place</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 bg-white dark:bg-slate-900 min-h-screen">
        {/* Main Tools Grid */}
        <div className="w-full max-w-6xl mx-auto px-4 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-green-900 dark:text-green-100">Your Renovation Toolkit</h1>
            <ModeToggle />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <div key={tool.id} className="h-full">
                <ToolCard
                  tool={tool}
                  categoryColor="green"
                  onToolClick={() => handleToolClick(tool.href)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Market Insights Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Market Trends */}
          <Card className="shadow-lg border-0 bg-white dark:bg-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Material Price Trends
              </CardTitle>
              <CardDescription className="dark:text-slate-300">
                Stay informed about current market conditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketTrends.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-600">
                    <span className="font-medium text-slate-900 dark:text-white">{item.material}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${
                        item.trend === 'up' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
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
          <Card className="shadow-lg border-0 bg-white dark:bg-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
                Your Progress
              </CardTitle>
              <CardDescription className="dark:text-slate-300">
                Track your renovation planning journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userProgress ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Planning Steps Completed
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {userProgress.completed}/{userProgress.total}
                    </span>
                  </div>
                  <Progress 
                    value={(userProgress.completed / userProgress.total) * 100} 
                    className="h-3"
                  />
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span>Great progress! Keep going.</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <PieChart className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-3" />
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
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
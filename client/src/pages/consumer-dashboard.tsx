import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useLocation } from "wouter";
import { Calculator, FileSearch, Home, ArrowRight, DollarSign, TrendingUp, Users, Lightbulb, ChevronUp, ChevronDown, Minus, MapPin, Star, Building, Wrench, Target } from "lucide-react";
import { ModeSwitcher } from "@/components/mode-toggle";
import { useFreemium } from "@/hooks/use-freemium";
import EmailSignupModal from "@/components/email-signup-modal";
import ToolCard from "@/components/tool-card";

export default function ConsumerDashboard() {
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

  const calculateTrend = (material: any) => {
    if (!material.priceHistory || material.priceHistory.length < 2) return null;
    
    const recent = material.priceHistory[material.priceHistory.length - 1];
    const previous = material.priceHistory[material.priceHistory.length - 2];
    
    if (!recent || !previous) return null;
    
    const change = ((recent.price - previous.price) / previous.price) * 100;
    return {
      change: change.toFixed(1),
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
    };
  };

  const getMarketTrends = () => {
    if (!materialPrices || !Array.isArray(materialPrices)) return [];
    
    return materialPrices.slice(0, 3).map(material => {
      const trend = calculateTrend(material);
      return {
        name: material.name,
        trend,
        currentPrice: material.currentPrice
      };
    }).filter(item => item.trend);
  };

  const toolCategories = [
    {
      category: "Budgeting & Estimates",
      description: "Plan your finances and get accurate cost projections",
      icon: DollarSign,
      color: "blue",
      tools: [
        {
          id: "budget-planner",
          title: "Unified Budget Planner",
          subtitle: "Complete cost & timeline planning",
          description: "Get detailed cost estimates with monthly budget forecasting and upgrade options",
          icon: Calculator,
          href: "/budget-planner",
          emoji: "💰",
          tagline: "Plan every dollar",
          features: ["Monthly forecasts", "Optional upgrades", "Smart recommendations"],
          estimatedTime: "5-10 min"
        },
        {
          id: "quote-analyzer",
          title: "Compare Contractor Quotes", 
          subtitle: "Smart quote analysis",
          description: "Upload quotes and get AI analysis to spot red flags and find the best value",
          icon: FileSearch,
          href: "/quote-compare",
          emoji: "🔍",
          tagline: "Hire with confidence",
          features: ["Red flag detection", "Price comparison", "Contractor insights"]
        }
      ]
    },
    {
      category: "Planning & Organization",
      description: "Stay organized and track your renovation journey",
      icon: Users,
      color: "green",
      tools: [
        {
          id: "concierge",
          title: "Renovation Concierge",
          subtitle: "Your personal renovation guide",
          description: "Get personalized recommendations and step-by-step guidance for your project",
          icon: Home,
          href: "/renovation-concierge",
          emoji: "🎯",
          tagline: "Start with confidence",
          features: ["Personalized plans", "Expert guidance", "Priority recommendations"]
        },
        {
          id: "checklist",
          title: "Project Action Checklist",
          subtitle: "Stay on track",
          description: "Get a personalized step-by-step renovation plan with deadlines and milestones",
          icon: Building,
          href: "/renovation-checklist",
          emoji: "✅",
          tagline: "Never miss a step",
          features: ["Custom timelines", "Progress tracking", "Reminder system"]
        }
      ]
    },
    {
      category: "Expert Guidance",
      description: "Get professional advice and insights",
      icon: Lightbulb,
      color: "purple",
      tools: [
        {
          id: "ai-assistant",
          title: "AI Renovation Assistant",
          subtitle: "24/7 expert advice",
          description: "Chat with our AI expert about permits, costs, design ideas, and renovation tips",
          icon: Lightbulb,
          href: "/ai-renovation-assistant",
          emoji: "🤖",
          tagline: "Expert advice anytime",
          features: ["Instant answers", "Permit guidance", "Cost insights"]
        },
        {
          id: "permit-research",
          title: "Permit Research Center",
          subtitle: "Navigate permits easily",
          description: "Find exactly what permits you need and how to get them for your location",
          icon: FileSearch,
          href: "/permit-research",
          emoji: "📋",
          tagline: "Permits made simple",
          features: ["Local requirements", "Application help", "Cost estimates"]
        }
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          icon: "text-blue-600",
          badge: "bg-blue-100 text-blue-800",
          button: "bg-blue-600 hover:bg-blue-700"
        };
      case "green":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          icon: "text-green-600",
          badge: "bg-green-100 text-green-800",
          button: "bg-green-600 hover:bg-green-700"
        };
      case "orange":
        return {
          bg: "bg-orange-50",
          border: "border-orange-200",
          icon: "text-orange-600",
          badge: "bg-orange-100 text-orange-800",
          button: "bg-orange-600 hover:bg-orange-700"
        };
      case "teal":
        return {
          bg: "bg-teal-50",
          border: "border-teal-200",
          icon: "text-teal-600",
          badge: "bg-teal-100 text-teal-800",
          button: "bg-teal-600 hover:bg-teal-700"
        };
      case "purple":
        return {
          bg: "bg-purple-50",
          border: "border-purple-200",
          icon: "text-purple-600",
          badge: "bg-purple-100 text-purple-800",
          button: "bg-purple-600 hover:bg-purple-700"
        };
      case "indigo":
        return {
          bg: "bg-indigo-50",
          border: "border-indigo-200",
          icon: "text-indigo-600",
          badge: "bg-indigo-100 text-indigo-800",
          button: "bg-indigo-600 hover:bg-indigo-700"
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          icon: "text-gray-600",
          badge: "bg-gray-100 text-gray-800",
          button: "bg-gray-600 hover:bg-gray-700"
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto p-3 sm:p-6">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2 sm:mb-3 px-2">Your Project Planner</h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto px-4">
              Plan your renovation with confidence using our smart tools and AI guidance. Get accurate estimates, find trusted contractors, and track your progress.
            </p>
          </div>

          {/* Quick Action Sidebar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Link href="/smart-project-estimator">
              <Card className="hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-200 cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Calculator className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-slate-900">Smart Project Estimator</h3>
                  <p className="text-sm text-slate-600 mt-1">Estimates + budget forecasting</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/renovation-assistant">
              <Card className="hover:shadow-lg transition-all duration-200 border-2 hover:border-green-200 cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Lightbulb className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-slate-900">Renovation Assistant (AI)</h3>
                  <p className="text-sm text-slate-600 mt-1">AI expert advice & guidance</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/quote-compare">
              <Card className="hover:shadow-lg transition-all duration-200 border-2 hover:border-purple-200 cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-slate-900">Compare Contractors</h3>
                  <p className="text-sm text-slate-600 mt-1">Find the best value</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/renovation-checklist">
              <Card className="hover:shadow-lg transition-all duration-200 border-2 hover:border-orange-200 cursor-pointer">
                <CardContent className="p-4 text-center">
                  <FileSearch className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-slate-900">Track Your Project</h3>
                  <p className="text-sm text-slate-600 mt-1">Stay organized & on track</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Subtle Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mb-8"></div>

        {/* Categorized Tools Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Choose Your Renovation Tools</h2>
          
          {toolCategories.map((category, categoryIndex) => {
            const CategoryIcon = category.icon;
            const categoryColors = getColorClasses(category.color);
            
            return (
              <div key={categoryIndex} className="mb-12">
                {/* Category Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 ${categoryColors.bg} rounded-xl flex items-center justify-center border-2 ${categoryColors.border}`}>
                    <CategoryIcon className={`w-6 h-6 ${categoryColors.icon}`} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{category.category}</h3>
                    <p className="text-slate-600 text-lg">{category.description}</p>
                  </div>
                </div>
                
                {/* Tools Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {category.tools.map((tool) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      categoryColor={category.color}
                      onToolClick={(toolId) => {
                        trackToolUsage(toolId);
                        setLocation(tool.href);
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Market Trends Section */}
        {getMarketTrends().length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Market Trends</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {getMarketTrends().map((trend, index) => (
                <Card key={index} className="border-2 border-slate-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-slate-900">{trend.name}</h4>
                      <div className={`flex items-center gap-1 ${
                        trend.trend?.direction === 'up' ? 'text-green-600' : 
                        trend.trend?.direction === 'down' ? 'text-red-600' : 'text-slate-600'
                      }`}>
                        {trend.trend?.direction === 'up' ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : trend.trend?.direction === 'down' ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <Minus className="w-4 h-4" />
                        )}
                        <span className="text-sm font-medium">{trend.trend?.change}%</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600">
                      ${trend.currentPrice?.toFixed(2)} per unit
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Email Signup Modal */}
        <EmailSignupModal 
          isOpen={showSignupModal}
          onClose={closeSignupModal}
          onEmailSubmitted={handleEmailSubmitted}
          remainingUses={remainingUses}
        />
      </div>
    </div>
  );
}
              <div>
                <h4 className="font-semibold text-orange-800 mb-4">Material Price Updates</h4>
                <div className="space-y-3">
                  {getMarketTrends().slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200">
                      <span className="font-medium text-slate-700">{item.name}</span>
                      <div className="flex items-center gap-2">
                        {item.trend?.direction === 'up' && (
                          <>
                            <ChevronUp className="w-4 h-4 text-red-500" />
                            <span className="text-red-600 font-medium">↑ {item.trend.change}%</span>
                          </>
                        )}
                        {item.trend?.direction === 'down' && (
                          <>
                            <ChevronDown className="w-4 h-4 text-green-500" />
                            <span className="text-green-600 font-medium">↓ {Math.abs(parseFloat(item.trend.change))}%</span>
                          </>
                        )}
                        {item.trend?.direction === 'stable' && (
                          <>
                            <Minus className="w-4 h-4 text-blue-500" />
                            <span className="text-blue-600 font-medium">Steady</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Market Insights */}
              <div>
                <h4 className="font-semibold text-orange-800 mb-4">2024 Renovation Insights</h4>
                <div className="space-y-3 text-sm text-orange-700">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Kitchen remodels average $25,000 - $75,000</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Bathroom renovations typically return 60-80% ROI</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Always budget 15-20% extra for unexpected costs</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Best time to renovate: Fall/Winter for better contractor rates</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips Section */}
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <Lightbulb className="w-5 h-5" />
              Pro Tips for Homeowners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-amber-800">Before You Start</h4>
                <ul className="space-y-1 text-sm text-amber-700">
                  <li>• Always get 3-4 contractor quotes</li>
                  <li>• Budget 10-20% extra for unexpected costs</li>
                  <li>• Check contractor licenses and references</li>
                  <li>• Consider permits and inspections</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-amber-800">Smart Investments</h4>
                <ul className="space-y-1 text-sm text-amber-700">
                  <li>• Kitchen and bathroom renovations add most value</li>
                  <li>• Fresh paint and flooring are cost-effective</li>
                  <li>• Energy-efficient upgrades pay long-term</li>
                  <li>• Don't over-improve for your neighborhood</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Signup Modal */}
      <EmailSignupModal
        isOpen={showSignupModal}
        onClose={closeSignupModal}
        onEmailSubmitted={handleEmailSubmitted}
        remainingUses={remainingUses}
      />
    </div>
  );
}
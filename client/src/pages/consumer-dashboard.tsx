import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Calculator, FileSearch, Home, ArrowRight, DollarSign, TrendingUp, Users, Lightbulb, ChevronUp, ChevronDown, Minus } from "lucide-react";
import { ModeSwitcher } from "@/components/mode-toggle";

export default function ConsumerDashboard() {
  // Fetch material prices for market trends
  const { data: materialPrices } = useQuery({
    queryKey: ["/api/material-prices"],
  });

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

  const tools = [
    {
      id: "estimator",
      title: "Estimate My Renovation",
      description: "Get a personalized cost range in 4 quick steps",
      icon: Calculator,
      color: "blue",
      href: "/estimate-wizard",
      emoji: "🏠",
      tagline: "Know before you plan"
    },
    {
      id: "quote-analyzer",
      title: "Compare Contractor Quotes",
      description: "Spot red flags and find the best value",
      icon: FileSearch,
      color: "green",
      href: "/quote-compare",
      emoji: "🔍",
      tagline: "Hire with confidence"
    },
    {
      id: "concierge",
      title: "Not Sure Where to Start?",
      description: "Let us guide you to the right next step",
      icon: Home,
      color: "purple",
      href: "/renovation-concierge",
      emoji: "🎯",
      tagline: "Get personalized guidance"
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
      case "purple":
        return {
          bg: "bg-purple-50",
          border: "border-purple-200",
          icon: "text-purple-600",
          badge: "bg-purple-100 text-purple-800",
          button: "bg-purple-600 hover:bg-purple-700"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Message Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-4xl font-bold text-slate-900">
                Welcome back!
              </h1>
              <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1">
                Consumer Mode
              </Badge>
            </div>
            <p className="text-xl text-slate-600">
              Smart tools for planning your next renovation
            </p>
          </div>
          <ModeSwitcher currentMode="consumer" />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="w-8 h-8" />
                <div>
                  <p className="text-sm opacity-90">Average Kitchen Remodel</p>
                  <p className="text-2xl font-bold">$25,000 - $75,000</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8" />
                <div>
                  <p className="text-sm opacity-90">Typical ROI</p>
                  <p className="text-2xl font-bold">60% - 80%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8" />
                <div>
                  <p className="text-sm opacity-90">Get Multiple Quotes</p>
                  <p className="text-2xl font-bold">3-4 Contractors</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Smart Action Buttons Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">What would you like to do today?</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {tools.map((tool) => {
              const Icon = tool.icon;
              const colors = getColorClasses(tool.color);
              
              return (
                <Link key={tool.id} href={tool.href}>
                  <Card className={`group hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border-2 ${colors.border} ${colors.bg} relative overflow-hidden`}>
                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <CardContent className="p-8 text-center relative z-10">
                      {/* Icon and Emoji */}
                      <div className="flex items-center justify-center mb-6">
                        <div className={`w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg mr-3`}>
                          <Icon className={`w-10 h-10 ${colors.icon}`} />
                        </div>
                        <span className="text-4xl">{tool.emoji}</span>
                      </div>
                      
                      {/* Title and Description */}
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">{tool.title}</h3>
                      <p className="text-lg text-slate-700 mb-4">{tool.description}</p>
                      
                      {/* Tagline */}
                      <div className="flex items-center justify-center">
                        <Badge className={`${colors.badge} text-sm font-medium px-4 py-2`}>
                          {tool.tagline}
                        </Badge>
                      </div>
                      
                      {/* Call to Action */}
                      <div className="mt-6 pt-6 border-t border-slate-200">
                        <div className="flex items-center justify-center text-slate-600 group-hover:text-slate-800 transition-colors">
                          <span className="font-medium">Get Started</span>
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Market Trend Snapshot Section */}
        <Card className="mb-8 border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <TrendingUp className="w-6 h-6" />
              Market Trends & Insights
            </CardTitle>
            <CardDescription className="text-orange-700">
              Stay informed with the latest construction cost trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Material Price Trends */}
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
    </div>
  );
}
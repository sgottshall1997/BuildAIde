import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Calculator, FileSearch, Home, ArrowRight, DollarSign, TrendingUp, Users, Lightbulb } from "lucide-react";
import { ModeSwitcher } from "@/components/mode-toggle";

export default function ConsumerDashboard() {
  const tools = [
    {
      id: "estimator",
      title: "Renovation Cost Estimator",
      description: "Get instant cost estimates for your home renovation projects",
      icon: Calculator,
      color: "blue",
      href: "/consumer-estimator",
      features: [
        "Kitchen, bathroom, roofing estimates",
        "Basic to high-end finish options",
        "Per square foot breakdowns",
        "AI-powered explanations"
      ]
    },
    {
      id: "quote-analyzer",
      title: "Contractor Quote Analyzer",
      description: "Compare contractor quotes and spot red flags before you hire",
      icon: FileSearch,
      color: "green",
      href: "/quote-compare",
      features: [
        "Side-by-side quote comparison",
        "Red flag detection",
        "Price reasonableness check",
        "Hiring recommendations"
      ]
    },
    {
      id: "flip-advisor",
      title: "Property Investment Advisor",
      description: "Evaluate houses for renovation potential and investment value",
      icon: Home,
      color: "purple",
      href: "/consumer-flip-advisor",
      features: [
        "Location assessment",
        "Renovation scope analysis",
        "Investment potential rating",
        "Risk evaluation"
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Welcome to Your Home Hub
            </h1>
            <p className="text-xl text-slate-600">
              Smart tools to help you make confident renovation and investment decisions
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

        {/* Tools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const colors = getColorClasses(tool.color);
            
            return (
              <Card 
                key={tool.id} 
                className={`hover:shadow-lg transition-all duration-200 border-2 ${colors.border} ${colors.bg}`}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm`}>
                    <Icon className={`w-8 h-8 ${colors.icon}`} />
                  </div>
                  <CardTitle className="text-xl text-slate-900">{tool.title}</CardTitle>
                  <CardDescription className="text-base">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {tool.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${colors.icon.replace('text', 'bg')}`}></div>
                        <span className="text-sm text-slate-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Link href={tool.href}>
                    <Button className={`w-full ${colors.button} text-white`}>
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  
                  <div className="text-center">
                    <Badge variant="secondary" className={colors.badge}>
                      Free to Use
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

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
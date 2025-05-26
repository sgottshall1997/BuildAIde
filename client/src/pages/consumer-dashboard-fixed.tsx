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
    remainingUses 
  } = useFreemium();

  const tools = [
    {
      title: "Renovation Cost Estimator",
      description: "Get instant cost estimates for your home improvement projects",
      icon: Calculator,
      path: "/budget-planner",
      color: "blue"
    },
    {
      title: "Project Timeline Planner", 
      description: "Plan your renovation timeline with AI-powered scheduling",
      icon: Target,
      path: "/investment-roi-tool",
      color: "green"
    },
    {
      title: "AI Renovation Assistant",
      description: "Get expert advice from Spencer, your AI construction consultant",
      icon: Users,
      path: "/ai-assistant",
      color: "purple"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to ConstructionSmartTools</h1>
          <p className="text-xl text-blue-100 mb-8">
            Smart renovation planning made simple for homeowners
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/10 rounded-lg p-3">
              <div className="font-semibold">✓ Instant Estimates</div>
              <div className="text-blue-200">Get cost estimates in seconds</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="font-semibold">✓ AI-Powered Advice</div>
              <div className="text-blue-200">Expert guidance 24/7</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="font-semibold">✓ Smart Planning</div>
              <div className="text-blue-200">Timeline and budget optimization</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {tools.map((tool) => (
            <ToolCard
              key={tool.title}
              title={tool.title}
              description={tool.description}
              icon={tool.icon}
              path={tool.path}
              color={tool.color}
              onToolClick={() => trackToolUsage(tool.title)}
            />
          ))}
        </div>

        {/* Market Insights */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Current Market Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">-8%</div>
                <div className="text-sm text-gray-600">Lumber Prices</div>
                <div className="text-xs text-green-600">Great time to build</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">6-8 weeks</div>
                <div className="text-sm text-gray-600">Avg Project Time</div>
                <div className="text-xs text-blue-600">Spring scheduling</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">$25k</div>
                <div className="text-sm text-gray-600">Kitchen ROI</div>
                <div className="text-xs text-orange-600">Best value upgrade</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">15%</div>
                <div className="text-sm text-gray-600">Cost Savings</div>
                <div className="text-xs text-purple-600">Off-season rates</div>
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
            <div className="bg-white rounded-lg p-4">
              <div className="space-y-3">
                <ul className="space-y-2 text-slate-700">
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
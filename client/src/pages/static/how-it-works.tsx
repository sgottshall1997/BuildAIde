import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/footer";
import { 
  ArrowRight, 
  UserCheck, 
  Lightbulb, 
  Bot, 
  CheckCircle,
  Zap,
  Users,
  Home
} from "lucide-react";

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-purple-100 text-purple-800 border-purple-200 px-4 py-2">
            <Lightbulb className="w-4 h-4 mr-2" />
            How It Works
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Get Started in Minutes
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Whether you're a construction professional or homeowner, our AI-powered platform makes project planning simple and accurate.
          </p>
        </div>

        {/* Getting Started Steps */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Simple 3-Step Process</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <UserCheck className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">1. Choose Your Mode</h3>
                <p className="text-slate-600 leading-relaxed">
                  Select Professional mode for advanced contractor tools or Homeowner mode for simplified planning features.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lightbulb className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">2. Describe Your Project</h3>
                <p className="text-slate-600 leading-relaxed">
                  Input your project details, location, and requirements. Our AI understands natural language descriptions.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bot className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">3. Get AI Insights</h3>
                <p className="text-slate-600 leading-relaxed">
                  Receive instant estimates, timelines, permit requirements, and personalized recommendations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Professional Path */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-4">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">For Construction Professionals</h2>
            <p className="text-lg text-slate-600">Advanced tools to streamline your business operations</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-l-4 border-orange-500">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Zap className="w-6 h-6 text-orange-600 mr-3" />
                  <h3 className="text-lg font-semibold text-slate-900">Quick Estimates</h3>
                </div>
                <p className="text-slate-600 text-sm mb-4">
                  Generate detailed cost breakdowns in seconds with AI-powered analysis of materials, labor, and overhead.
                </p>
                <div className="flex items-center text-orange-600 text-sm font-medium">
                  <span>Try Project Estimator</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-orange-500">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-orange-600 mr-3" />
                  <h3 className="text-lg font-semibold text-slate-900">Smart Scheduling</h3>
                </div>
                <p className="text-slate-600 text-sm mb-4">
                  Plan project timelines with AI optimization for crew allocation and task dependencies.
                </p>
                <div className="flex items-center text-orange-600 text-sm font-medium">
                  <span>Try Schedule Builder</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Homeowner Path */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
              <Home className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">For Homeowners</h2>
            <p className="text-lg text-slate-600">Simple tools to plan your dream renovation</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-l-4 border-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Lightbulb className="w-6 h-6 text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold text-slate-900">Budget Planning</h3>
                </div>
                <p className="text-slate-600 text-sm mb-4">
                  Get realistic budget estimates for your renovation with AI-powered cost analysis and recommendations.
                </p>
                <div className="flex items-center text-blue-600 text-sm font-medium">
                  <span>Try Budget Planner</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Bot className="w-6 h-6 text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold text-slate-900">AI Guidance</h3>
                </div>
                <p className="text-slate-600 text-sm mb-4">
                  Chat with our AI assistant for personalized advice on permits, contractors, and project planning.
                </p>
                <div className="flex items-center text-blue-600 text-sm font-medium">
                  <span>Try AI Assistant</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Key Features */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">What Makes Us Different</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">AI-Powered Accuracy</h3>
                <p className="text-slate-600 text-sm">
                  Advanced machine learning models trained on real construction data for precise estimates.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Dual-Mode Platform</h3>
                <p className="text-slate-600 text-sm">
                  One platform that serves both professionals and homeowners with tailored experiences.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Real-Time Data</h3>
                <p className="text-slate-600 text-sm">
                  Live material pricing, permit requirements, and market insights updated continuously.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-indigo-100 mb-6">
              Join thousands of professionals and homeowners who trust ConstructionSmartTools for their projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-indigo-50 transition-colors">
                Try Professional Tools
              </button>
              <button className="bg-indigo-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-400 transition-colors border border-indigo-400">
                Try Homeowner Tools
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
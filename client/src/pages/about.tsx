import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { 
  Calculator, 
  FileText, 
  Clock, 
  TrendingUp, 
  Brain, 
  CheckCircle, 
  Mail, 
  Download, 
  Wrench,
  ArrowRight,
  Target,
  Shield,
  Zap,
  CalendarCheck,
  Users,
  Bot,
  ClipboardList,
  DollarSign,
  AlertTriangle,
  MessageSquare,
  Search
} from "lucide-react";

export default function About() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Wrench className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900">Spence the Builder</h1>
          </div>
          <h2 className="text-2xl font-semibold text-slate-700 mb-2">Smart Construction Tools Suite</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Complete toolkit for construction professionals - from bid estimating to permit scheduling, business development, and AI-powered project insights.
          </p>
        </div>

        {/* Tool Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="text-center p-4 hover:shadow-md transition-shadow">
            <Calculator className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-slate-900">Bid Estimator</h3>
            <p className="text-sm text-slate-600">Professional project estimates</p>
          </Card>
          <Card className="text-center p-4 hover:shadow-md transition-shadow">
            <CalendarCheck className="h-8 w-8 text-amber-600 mx-auto mb-2" />
            <h3 className="font-semibold text-slate-900">Scheduler</h3>
            <p className="text-sm text-slate-600">Permit & inspection tracking</p>
          </Card>
          <Card className="text-center p-4 hover:shadow-md transition-shadow">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-slate-900">New Business</h3>
            <p className="text-sm text-slate-600">Lead & opportunity management</p>
          </Card>
          <Card className="text-center p-4 hover:shadow-md transition-shadow">
            <Bot className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
            <h3 className="font-semibold text-slate-900">AI Assistant</h3>
            <p className="text-sm text-slate-600">Smart construction advisor</p>
          </Card>
        </div>

        {/* 1. BID ESTIMATOR SECTION */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Calculator className="h-6 w-6 text-blue-600" />
              Project Bid Estimator
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">Core Tool</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-700 leading-relaxed">
              Create accurate, professional project estimates in just a few minutes. Walk through a comprehensive form and generate complete bid packages including:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <Calculator className="h-5 w-5 text-blue-600" />
                <span className="text-slate-700">Detailed cost estimates by category</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="text-slate-700">Labor and material breakdowns</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <Clock className="h-5 w-5 text-orange-600" />
                <span className="text-slate-700">Timeline and complexity analysis</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <FileText className="h-5 w-5 text-purple-600" />
                <span className="text-slate-700">Professional PDF proposals</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <Shield className="h-5 w-5 text-red-600" />
                <span className="text-slate-700">Risk assessment and mitigation</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <Brain className="h-5 w-5 text-indigo-600" />
                <span className="text-slate-700">AI-powered cost insights</span>
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <Button 
                onClick={() => setLocation("/estimator")} 
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Create Estimate
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 2. SCHEDULER SECTION */}
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <CalendarCheck className="h-6 w-6 text-amber-600" />
              Permit & Inspection Scheduler
              <Badge variant="secondary" className="bg-amber-100 text-amber-700">Planning Tool</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-700 leading-relaxed">
              Stay ahead of deadlines and never miss critical inspections. Track permits, schedule inspections, and manage compliance timelines across all your active projects.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <ClipboardList className="h-5 w-5 text-amber-600" />
                <span className="text-slate-700">Permit application tracking</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <CalendarCheck className="h-5 w-5 text-blue-600" />
                <span className="text-slate-700">Inspection scheduling & reminders</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <span className="text-slate-700">Deadline alerts and notifications</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-slate-700">Compliance status tracking</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <FileText className="h-5 w-5 text-purple-600" />
                <span className="text-slate-700">Document management</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <Clock className="h-5 w-5 text-slate-600" />
                <span className="text-slate-700">Timeline optimization</span>
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <Button 
                onClick={() => setLocation("/scheduler")} 
                className="bg-amber-600 hover:bg-amber-700"
              >
                <CalendarCheck className="h-4 w-4 mr-2" />
                Schedule Inspection
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 3. NEW BUSINESS SECTION */}
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <TrendingUp className="h-6 w-6 text-green-600" />
              New Business & Opportunities
              <Badge variant="secondary" className="bg-green-100 text-green-700">Growth Tool</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-700 leading-relaxed">
              Discover new opportunities, track leads, and manage your business development pipeline. Build relationships and grow your revenue with systematic lead management.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <Search className="h-5 w-5 text-green-600" />
                <span className="text-slate-700">Lead discovery and tracking</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-slate-700">Client relationship management</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <DollarSign className="h-5 w-5 text-yellow-600" />
                <span className="text-slate-700">Opportunity value tracking</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="text-slate-700">Pipeline management</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <MessageSquare className="h-5 w-5 text-purple-600" />
                <span className="text-slate-700">Follow-up reminders</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-slate-700">Conversion tracking</span>
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <Button 
                onClick={() => setLocation("/opportunities")} 
                className="bg-green-600 hover:bg-green-700"
              >
                <Users className="h-4 w-4 mr-2" />
                View Opportunities
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 4. AI ASSISTANT SECTION */}
        <Card className="border-indigo-200 bg-indigo-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Bot className="h-6 w-6 text-indigo-600" />
              AI Construction Assistant
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">AI Powered</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-700 leading-relaxed">
              Get instant answers about pricing, permits, materials, and project advice from your AI construction expert. Ask questions and receive intelligent, context-aware guidance.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <Brain className="h-5 w-5 text-indigo-600" />
                <span className="text-slate-700">Construction expertise on demand</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-slate-700">Pricing guidance and validation</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <FileText className="h-5 w-5 text-purple-600" />
                <span className="text-slate-700">Permit requirement guidance</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <Wrench className="h-5 w-5 text-orange-600" />
                <span className="text-slate-700">Material recommendations</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="text-slate-700">Risk identification and solutions</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <Target className="h-5 w-5 text-blue-600" />
                <span className="text-slate-700">Daily priority recommendations</span>
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <Button 
                onClick={() => setLocation("/ai-assistant")} 
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <Bot className="h-4 w-4 mr-2" />
                Ask Spence the Builder
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Zap className="h-6 w-6 text-yellow-600" />
              How It Works – Step by Step
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">You Fill Out a Project Form</h3>
                <p className="text-slate-700 mb-3">
                  Enter the square footage, project type (kitchen, bath, addition), materials, labor, and other job details.
                </p>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-blue-800 text-sm italic">
                    💡 As you fill it out, the tool gives helpful advice like: "Quartz costs around $50 per square foot but installs faster than marble."
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">The Tool Calculates the Estimate</h3>
                <p className="text-slate-700 mb-3">It takes your inputs and calculates:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-slate-700">Labor cost (based on hours and workers)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-slate-700">Material cost (based on selections)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-slate-700">Timeline and site complexity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-slate-700">Permit/inspection factors</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">You Get a Full Estimate Breakdown</h3>
                <p className="text-slate-700 mb-3">You see a clean breakdown by category with risk assessment.</p>
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-amber-800 text-sm">
                    <Shield className="h-4 w-4 inline mr-1" />
                    Example: "Risk: Medium – Tight timeline may affect delivery. Consider contingency buffer."
                  </p>
                </div>
              </div>
            </div>

            {/* Additional steps */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
                <span className="text-slate-700">Compares to past projects and explains similarities</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm">5</div>
                <span className="text-slate-700">Exports professional PDF proposals with your branding</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">6</div>
                <span className="text-slate-700">Writes professional client emails automatically</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Why It Helps */}
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <TrendingUp className="h-6 w-6 text-green-600" />
              Why It Helps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-white rounded-lg border">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-900">Saves You Hours</h4>
                  <p className="text-sm text-slate-600">No more rebuilding estimates from scratch</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white rounded-lg border">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-900">Looks Professional</h4>
                  <p className="text-sm text-slate-600">Clients get clear proposals with real explanations</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white rounded-lg border">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-900">Helps You Win Jobs</h4>
                  <p className="text-sm text-slate-600">Respond to leads faster and with confidence</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white rounded-lg border">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-900">Avoids Mistakes</h4>
                  <p className="text-sm text-slate-600">Never forget labor, permits, or materials again</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bonus Intelligence */}
        <Card className="border-indigo-200 bg-indigo-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Brain className="h-6 w-6 text-indigo-600" />
              Bonus Intelligence
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">AI Powered</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-700">This tool quietly uses advanced technology to:</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                <span className="text-slate-700">Suggest better ways to save time or money</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                <span className="text-slate-700">Highlight project risks before you commit</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                <span className="text-slate-700">Automatically explain why a job is priced the way it is</span>
              </div>
            </div>
            <div className="p-4 bg-indigo-100 rounded-lg border border-indigo-200">
              <p className="text-indigo-800 font-medium">
                You don't have to understand how it works — just know that it's always working with you, not against you.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="border-primary bg-primary/5">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Ready to Get Started?</h3>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Try creating your first professional estimate and see how this tool can transform your bidding process.
            </p>
            <Button 
              onClick={() => setLocation("/estimator")} 
              size="lg"
              className="bg-primary hover:bg-primary/90 px-8 py-3"
            >
              Create Your First Estimate
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-8 border-t border-slate-200">
          <div className="flex items-center justify-center gap-2 text-slate-600">
            <Wrench className="h-4 w-4" />
            <span>Built by Spencer — tailored for the way you actually run jobs.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
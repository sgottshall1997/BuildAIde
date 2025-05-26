import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import FeedbackButton from "@/components/feedback-button";
import { 
  Sparkles, 
  Calendar, 
  Calculator, 
  Users, 
  CheckCircle, 
  Clock,
  MessageCircle,
  Lightbulb
} from "lucide-react";
import { useState } from "react";

export default function RenovationConcierge() {
  const [projectDetails, setProjectDetails] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [priorities, setPriorities] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [testResult, setTestResult] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [loadTime, setLoadTime] = useState<string | null>(null);

  const handleGetStarted = async () => {
    if (!projectDetails.trim()) {
      return;
    }

    setIsAnalyzing(true);
    const startTime = Date.now();
    
    try {
      const response = await fetch('/api/renovation-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectDetails,
          budget,
          timeline,
          priorities
        })
      });

      if (response.ok) {
        const data = await response.json();
        const endTime = Date.now();
        setLoadTime(((endTime - startTime) / 1000).toFixed(1));
        setRecommendations(data.recommendations);
        
        // Scroll to recommendations after a brief delay
        setTimeout(() => {
          const recommendationsElement = document.getElementById('ai-recommendations');
          if (recommendationsElement) {
            recommendationsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      } else {
        setRecommendations('Unable to generate recommendations at this time. Please try again later.');
      }
    } catch (error) {
      setRecommendations('Unable to generate recommendations at this time. Please check your connection and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const testJSONResponse = async () => {
    setIsTesting(true);
    try {
      const response = await fetch('/api/test-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });

      const data = await response.json();
      if (data.success) {
        setTestResult(`✅ ${data.message}`);
      } else {
        setTestResult(`❌ ${data.error}`);
      }
    } catch (error) {
      setTestResult(`❌ Connection failed: ${error.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  const testOpenAIConnection = async () => {
    setIsTesting(true);
    try {
      const response = await fetch('/api/test-openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });

      const data = await response.json();
      if (data.success) {
        setTestResult(`✅ ${data.message}`);
      } else {
        setTestResult(`❌ ${data.error}`);
      }
    } catch (error) {
      setTestResult(`❌ Connection failed: ${error.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-slate-900">✨ Renovation Concierge</h1>
          </div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Your personal AI assistant for planning, budgeting, and managing home renovation projects from start to finish
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Input Section */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                Tell Us About Your Project
              </CardTitle>
              <CardDescription>
                Describe your renovation plans and get personalized AI recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Textarea
                placeholder="Example: I want to renovate my 300 sq ft kitchen with modern appliances, new cabinets, and a subway tile backsplash..."
                value={projectDetails}
                onChange={(e) => setProjectDetails(e.target.value)}
                className="min-h-[120px] resize-none"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Budget Range</label>
                  <Input
                    placeholder="e.g., $20,000 - $30,000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Timeline</label>
                  <Input
                    placeholder="e.g., 6-8 weeks"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Top Priority</label>
                  <Input
                    placeholder="e.g., Quality, Speed, Budget"
                    value={priorities}
                    onChange={(e) => setPriorities(e.target.value)}
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleGetStarted}
                disabled={!projectDetails.trim() || isAnalyzing}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                {isAnalyzing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing Your Project...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Get AI Recommendations
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Features Preview */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-600" />
                What You'll Get
              </CardTitle>
              <CardDescription>
                Comprehensive AI-powered renovation guidance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    icon: Calculator,
                    title: "Smart Budget Breakdown",
                    description: "Detailed cost estimates with material and labor pricing",
                    color: "text-green-600"
                  },
                  {
                    icon: Calendar,
                    title: "Project Timeline",
                    description: "Week-by-week schedule with critical milestones",
                    color: "text-blue-600"
                  },
                  {
                    icon: Users,
                    title: "Contractor Matching",
                    description: "Recommendations for qualified local professionals",
                    color: "text-purple-600"
                  },
                  {
                    icon: CheckCircle,
                    title: "Permit Guidance",
                    description: "Required permits and approval processes",
                    color: "text-teal-600"
                  }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                    <feature.icon className={`w-5 h-5 mt-0.5 ${feature.color}`} />
                    <div>
                      <h4 className="font-semibold text-slate-900">{feature.title}</h4>
                      <p className="text-sm text-slate-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Recommendations Results */}
        {recommendations && (
          <div id="ai-recommendations" className="max-w-4xl mx-auto mt-8">
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Your AI Renovation Recommendations
                </CardTitle>
                <div className="flex items-center justify-between">
                  <CardDescription>
                    Personalized guidance based on your project details
                  </CardDescription>
                  {loadTime && (
                    <p className="text-purple-600 text-xs bg-purple-100 px-2 py-1 rounded">
                      Generated in {loadTime}s
                    </p>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
                  <div className="prose prose-sm max-w-none">
                    <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {recommendations}
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => setRecommendations("")}
                    className="flex-1"
                  >
                    Start New Analysis
                  </Button>
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Get Professional Quote
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Coming Soon Notice */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto shadow-lg border-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardContent className="py-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Clock className="w-6 h-6" />
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  Coming Soon
                </Badge>
              </div>
              <h3 className="text-2xl font-bold mb-2">Full AI Concierge Experience</h3>
              <p className="text-blue-100">
                We're putting the finishing touches on your personal renovation AI assistant. 
                Get early access by joining our waitlist!
              </p>
              <Button variant="secondary" className="mt-4 bg-white text-blue-600 hover:bg-blue-50">
                Join Early Access
              </Button>
            </CardContent>
          </Card>
          
          {/* AI Beta Disclaimer */}
          <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg text-center">
            <p className="text-sm text-amber-700 italic">
              ⚡ AI beta - results may vary. This is a preview of our upcoming concierge service.
            </p>
          </div>

          {/* Test Buttons - Bottom of page, less visible */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center text-xs text-gray-400 mb-3">Development Tools</div>
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={testJSONResponse}
                disabled={isTesting}
                variant="outline"
                size="sm"
                className="text-xs text-gray-500 border-gray-300"
              >
                {isTesting ? "Testing..." : "Test JSON Response"}
              </Button>
              
              <Button 
                onClick={testOpenAIConnection}
                disabled={isTesting}
                variant="outline"
                size="sm"
                className="text-xs text-gray-500 border-gray-300"
              >
                {isTesting ? "Testing..." : "Test AI Connection"}
              </Button>
            </div>
            
            {testResult && (
              <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600 max-w-md mx-auto">
                {testResult}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Feedback Button */}
      <FeedbackButton toolName="AI Renovation Concierge" />
    </div>
  );
}
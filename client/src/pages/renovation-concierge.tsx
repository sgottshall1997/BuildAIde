import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { 
  Home, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Users, 
  FileText, 
  Lightbulb,
  Star,
  Target,
  TrendingUp,
  Shield,
  Calendar,
  MapPin
} from "lucide-react";

export default function RenovationConcierge() {
  const [currentStep, setCurrentStep] = useState(0);
  const [projectData, setProjectData] = useState({
    projectType: "",
    budget: "",
    timeline: "",
    priority: "",
    experience: "",
    location: ""
  });
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const steps = [
    {
      id: "welcome",
      title: "Welcome to Your Renovation Journey",
      description: "Let's find the perfect path for your project"
    },
    {
      id: "project-type",
      title: "What Are You Planning?",
      description: "Choose your renovation focus"
    },
    {
      id: "budget-timeline",
      title: "Budget & Timeline",
      description: "Set your financial and time expectations"
    },
    {
      id: "priorities",
      title: "Your Priorities",
      description: "What matters most to you?"
    },
    {
      id: "recommendations",
      title: "Your Personalized Plan",
      description: "Here's what we recommend"
    }
  ];

  const projectTypes = [
    { id: "kitchen", name: "Kitchen Remodel", icon: "🍳", avgCost: "$25,000 - $75,000", timeframe: "6-12 weeks" },
    { id: "bathroom", name: "Bathroom Renovation", icon: "🛁", avgCost: "$15,000 - $40,000", timeframe: "4-8 weeks" },
    { id: "addition", name: "Room Addition", icon: "🏠", avgCost: "$40,000 - $150,000", timeframe: "12-20 weeks" },
    { id: "basement", name: "Basement Finishing", icon: "🏘️", avgCost: "$20,000 - $60,000", timeframe: "8-16 weeks" },
    { id: "whole-house", name: "Whole House Renovation", icon: "🏗️", avgCost: "$100,000+", timeframe: "6-12 months" },
    { id: "exterior", name: "Exterior Updates", icon: "🌿", avgCost: "$10,000 - $50,000", timeframe: "2-8 weeks" }
  ];

  const budgetRanges = [
    { id: "under-25k", label: "Under $25,000", icon: "💡" },
    { id: "25k-50k", label: "$25,000 - $50,000", icon: "🎯" },
    { id: "50k-100k", label: "$50,000 - $100,000", icon: "⭐" },
    { id: "100k-plus", label: "$100,000+", icon: "💎" }
  ];

  const priorities = [
    { id: "roi", label: "Best Return on Investment", icon: <TrendingUp className="w-5 h-5" /> },
    { id: "speed", label: "Complete Quickly", icon: <Clock className="w-5 h-5" /> },
    { id: "quality", label: "Highest Quality", icon: <Star className="w-5 h-5" /> },
    { id: "budget", label: "Stay Within Budget", icon: <Shield className="w-5 h-5" /> }
  ];

  const handleAnalyzeProject = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockRecommendations = [
        {
          title: "Start with Kitchen Planning",
          description: "Based on your budget and ROI focus, kitchen remodeling offers the best value",
          action: "Get Kitchen Estimate",
          href: "/smart-project-estimator",
          priority: "high",
          timeToComplete: "1-2 hours",
          impact: "High ROI potential"
        },
        {
          title: "Research Contractors",
          description: "Find 3-5 qualified contractors in your area",
          action: "Browse Contractors",
          href: "/quote-compare",
          priority: "medium",
          timeToComplete: "2-3 days",
          impact: "Quality assurance"
        },
        {
          title: "Plan Your Timeline",
          description: "Create a realistic schedule for your renovation",
          action: "Build Timeline",
          href: "/project-timeline",
          priority: "medium",
          timeToComplete: "30 minutes",
          impact: "Project success"
        },
        {
          title: "Check Permits",
          description: "Verify what permits you'll need for your project",
          action: "Check Requirements",
          href: "/permit-research",
          priority: "high",
          timeToComplete: "1 hour",
          impact: "Legal compliance"
        }
      ];
      
      setRecommendations(mockRecommendations);
      setIsAnalyzing(false);
      setCurrentStep(4);
    }, 2000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Welcome
        return (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Home className="w-12 h-12 text-blue-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Welcome to Your Renovation Concierge</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                I'm here to guide you through every step of your renovation journey. Let's create a personalized plan that fits your goals, budget, and timeline.
              </p>
            </div>
            <div className="flex items-center justify-center space-x-8 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Personalized recommendations</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                <span>Smart project planning</span>
              </div>
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                <span>Expert guidance</span>
              </div>
            </div>
            <Button 
              onClick={() => setCurrentStep(1)} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            >
              Let's Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        );

      case 1: // Project Type
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">What Are You Planning to Renovate?</h2>
              <p className="text-lg text-slate-600">Choose the type of project you're most interested in</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projectTypes.map((type) => (
                <Card 
                  key={type.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    projectData.projectType === type.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setProjectData(prev => ({ ...prev, projectType: type.id }))}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3">{type.icon}</div>
                    <h3 className="font-semibold text-slate-900 mb-2">{type.name}</h3>
                    <p className="text-sm text-slate-600 mb-2">{type.avgCost}</p>
                    <p className="text-xs text-slate-500">{type.timeframe}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {projectData.projectType && (
              <div className="flex justify-center">
                <Button 
                  onClick={() => setCurrentStep(2)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        );

      case 2: // Budget & Timeline
        return (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Budget & Timeline</h2>
              <p className="text-lg text-slate-600">Help us understand your constraints</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">What's your budget range?</label>
                <div className="grid md:grid-cols-2 gap-3">
                  {budgetRanges.map((range) => (
                    <Card
                      key={range.id}
                      className={`cursor-pointer transition-all duration-200 ${
                        projectData.budget === range.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setProjectData(prev => ({ ...prev, budget: range.id }))}
                    >
                      <CardContent className="p-4 flex items-center gap-3">
                        <span className="text-2xl">{range.icon}</span>
                        <span className="font-medium text-slate-900">{range.label}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">When do you want to start?</label>
                <div className="grid md:grid-cols-3 gap-3">
                  {[
                    { id: "asap", label: "ASAP", desc: "Within 1 month" },
                    { id: "soon", label: "Soon", desc: "1-3 months" },
                    { id: "flexible", label: "Flexible", desc: "3+ months" }
                  ].map((option) => (
                    <Card
                      key={option.id}
                      className={`cursor-pointer transition-all duration-200 ${
                        projectData.timeline === option.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setProjectData(prev => ({ ...prev, timeline: option.id }))}
                    >
                      <CardContent className="p-4 text-center">
                        <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <div className="font-medium text-slate-900">{option.label}</div>
                        <div className="text-sm text-slate-600">{option.desc}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Your location (for local insights)</label>
                <Input
                  type="text"
                  placeholder="City, State or ZIP code"
                  value={projectData.location}
                  onChange={(e) => setProjectData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full"
                />
              </div>
            </div>

            {projectData.budget && projectData.timeline && (
              <div className="flex justify-center">
                <Button 
                  onClick={() => setCurrentStep(3)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        );

      case 3: // Priorities
        return (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">What's Most Important to You?</h2>
              <p className="text-lg text-slate-600">Choose your top priority for this renovation</p>
            </div>

            <div className="space-y-4">
              {priorities.map((priority) => (
                <Card
                  key={priority.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    projectData.priority === priority.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setProjectData(prev => ({ ...prev, priority: priority.id }))}
                >
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                      {priority.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{priority.label}</h3>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Experience with renovations</label>
              <div className="grid md:grid-cols-3 gap-3">
                {[
                  { id: "first-time", label: "First Time", desc: "New to renovations" },
                  { id: "some", label: "Some Experience", desc: "Done a few projects" },
                  { id: "experienced", label: "Very Experienced", desc: "Many renovations" }
                ].map((exp) => (
                  <Card
                    key={exp.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      projectData.experience === exp.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setProjectData(prev => ({ ...prev, experience: exp.id }))}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="font-medium text-slate-900">{exp.label}</div>
                      <div className="text-sm text-slate-600">{exp.desc}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {projectData.priority && projectData.experience && (
              <div className="flex justify-center">
                <Button 
                  onClick={handleAnalyzeProject}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? "Analyzing Your Project..." : "Get My Personalized Plan"}
                  {!isAnalyzing && <Target className="w-5 h-5 ml-2" />}
                </Button>
              </div>
            )}
          </div>
        );

      case 4: // Recommendations
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Your Personalized Renovation Plan</h2>
              <p className="text-lg text-slate-600">Here's what we recommend based on your goals</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {recommendations.map((rec, index) => (
                <Card key={index} className="border-2 border-slate-200 hover:border-blue-300 transition-all duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg text-slate-900">{rec.title}</CardTitle>
                        <CardDescription className="mt-2">{rec.description}</CardDescription>
                      </div>
                      <Badge 
                        className={`${
                          rec.priority === 'high' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {rec.priority === 'high' ? 'High Priority' : 'Medium Priority'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{rec.timeToComplete}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          <span>{rec.impact}</span>
                        </div>
                      </div>
                      <Link href={rec.href}>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                          {rec.action}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Link href="/consumer-dashboard">
                <Button variant="outline" className="px-6 py-2">
                  Return to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lightbulb className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Analyzing Your Project</h3>
            <p className="text-slate-600 mb-6">Creating your personalized renovation plan...</p>
            <Progress value={75} className="w-full" />
            <p className="text-sm text-slate-500 mt-4">This will take just a moment</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-slate-900">Renovation Concierge</h1>
            <div className="text-sm text-slate-600">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
          <Progress value={(currentStep + 1) / steps.length * 100} className="w-full" />
          <div className="flex justify-between mt-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${
                  index <= currentStep ? 'bg-blue-600' : 'bg-slate-300'
                }`} />
                <span className="text-xs text-slate-500 mt-1 hidden md:block">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="border-2 border-slate-200">
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
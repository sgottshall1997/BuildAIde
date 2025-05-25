import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Home, Target, Clock, Users, CheckCircle, Lightbulb } from "lucide-react";
import { Link, useLocation } from "wouter";
import { ModeSwitcher } from "@/components/mode-toggle";

interface ConciergeStep {
  id: string;
  question: string;
  options: {
    value: string;
    label: string;
    description: string;
  }[];
}

interface Recommendation {
  nextTool: string;
  title: string;
  description: string;
  href: string;
  education?: {
    title: string;
    tips: string[];
  };
}

export default function RenovationConcierge() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [, setLocation] = useLocation();

  const steps: ConciergeStep[] = [
    {
      id: "goal",
      question: "What's your main goal for this renovation?",
      options: [
        {
          value: "increase-value",
          label: "Increase home value",
          description: "Planning to sell or refinance soon"
        },
        {
          value: "improve-living",
          label: "Improve daily living",
          description: "Make your space more functional and comfortable"
        },
        {
          value: "fix-problems",
          label: "Fix problems",
          description: "Address issues like leaks, outdated systems, or damage"
        },
        {
          value: "modernize",
          label: "Modernize style",
          description: "Update the look and feel of your space"
        }
      ]
    },
    {
      id: "timeline",
      question: "What's your timeline for this project?",
      options: [
        {
          value: "asap",
          label: "ASAP (within 2 months)",
          description: "Urgent need or tight deadline"
        },
        {
          value: "soon",
          label: "Soon (2-6 months)",
          description: "Want to get started relatively quickly"
        },
        {
          value: "flexible",
          label: "Flexible (6+ months)",
          description: "No rush, want to plan carefully"
        },
        {
          value: "exploring",
          label: "Just exploring",
          description: "Not sure when, gathering information"
        }
      ]
    },
    {
      id: "contractors",
      question: "Have you spoken to any contractors yet?",
      options: [
        {
          value: "none",
          label: "Haven't contacted anyone",
          description: "Starting from scratch"
        },
        {
          value: "few",
          label: "Talked to 1-2 contractors",
          description: "Got some initial conversations going"
        },
        {
          value: "quotes",
          label: "Have quotes to compare",
          description: "Ready to evaluate options"
        },
        {
          value: "hired",
          label: "Already hired someone",
          description: "Contractor is lined up"
        }
      ]
    }
  ];

  const getRecommendation = (userAnswers: Record<string, string>): Recommendation => {
    const { goal, timeline, contractors } = userAnswers;

    // Logic for recommendations based on answers
    if (contractors === "quotes") {
      return {
        nextTool: "Quote Comparison",
        title: "Compare Your Contractor Quotes",
        description: "You have quotes ready! Let's analyze them to spot red flags and find the best value.",
        href: "/quote-compare",
        education: {
          title: "What to Look for in Quotes",
          tips: [
            "Detailed breakdowns are better than lump sums",
            "Verify all contractors are licensed and insured",
            "Be wary of quotes that are much higher or lower than others",
            "Make sure permits and cleanup are included"
          ]
        }
      };
    }

    if (contractors === "hired") {
      return {
        nextTool: "Project Timeline",
        title: "Plan Your Project Timeline",
        description: "Great! Now let's map out what to expect during your renovation.",
        href: "/project-timeline",
        education: {
          title: "Managing Your Renovation",
          tips: [
            "Stay in regular communication with your contractor",
            "Be prepared for some delays - they're normal",
            "Keep receipts and document progress with photos",
            "Don't make major changes once work has started"
          ]
        }
      };
    }

    if (timeline === "exploring") {
      return {
        nextTool: "AI Assistant",
        title: "Chat with Our Renovation Expert",
        description: "Perfect for exploring! Ask questions about costs, timelines, or anything else.",
        href: "/ai-renovation-assistant",
        education: {
          title: "Questions to Consider",
          tips: [
            "What's a realistic budget for your goals?",
            "Which renovations add the most value?",
            "What permits might you need?",
            "How long do different projects typically take?"
          ]
        }
      };
    }

    if (timeline === "asap" && contractors === "none") {
      return {
        nextTool: "Renovation Checklist",
        title: "Get Your Action Plan",
        description: "You need to move fast! Here's a prioritized checklist to get you started.",
        href: "/renovation-checklist",
        education: {
          title: "Fast-Track Tips",
          tips: [
            "Contact multiple contractors immediately",
            "Be flexible on materials to avoid delays",
            "Start permit applications early",
            "Have your budget and timeline clearly defined"
          ]
        }
      };
    }

    // Default recommendation
    return {
      nextTool: "Cost Estimator",
      title: "Get Your Renovation Estimate",
      description: "Start with understanding costs. This will help you plan and talk to contractors.",
      href: "/estimate-wizard",
      education: {
        title: "Planning Your Budget",
        tips: [
          "Always add 15-20% buffer for unexpected costs",
          "Get rough estimates before talking to contractors",
          "Consider financing options early in the process",
          "Prioritize must-haves vs. nice-to-haves"
        ]
      }
    };
  };

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [steps[currentStep].id]: value };
    setAnswers(newAnswers);

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Generate recommendation
      const rec = getRecommendation(newAnswers);
      setRecommendation(rec);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const startOver = () => {
    setCurrentStep(0);
    setAnswers({});
    setRecommendation(null);
  };

  if (recommendation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link href="/consumer-dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Your Personalized Recommendation</h1>
                <p className="text-slate-600">Based on your answers, here's what we suggest</p>
              </div>
            </div>
            <ModeSwitcher currentMode="consumer" />
          </div>

          {/* Recommendation Card */}
          <Card className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-green-900">{recommendation.title}</CardTitle>
                  <Badge className="bg-green-100 text-green-800 mt-2">
                    Recommended: {recommendation.nextTool}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 text-lg mb-6">{recommendation.description}</p>
              <div className="flex gap-4">
                <Link href={recommendation.href}>
                  <Button className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6">
                    {recommendation.nextTool}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button onClick={startOver} variant="outline" className="px-8 py-6">
                  Start Over
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Educational Content */}
          {recommendation.education && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  {recommendation.education.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {recommendation.education.tips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{tip}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Other Tools */}
          <Card>
            <CardHeader>
              <CardTitle>Explore Other Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Link href="/estimate-wizard">
                  <Button variant="outline" className="w-full h-auto p-4 flex items-center gap-3">
                    <Home className="w-6 h-6 text-blue-600" />
                    <div className="text-left">
                      <div className="font-semibold">Cost Estimator</div>
                      <div className="text-sm text-slate-500">Get ballpark costs</div>
                    </div>
                  </Button>
                </Link>
                <Link href="/ai-renovation-assistant">
                  <Button variant="outline" className="w-full h-auto p-4 flex items-center gap-3">
                    <Users className="w-6 h-6 text-green-600" />
                    <div className="text-left">
                      <div className="font-semibold">AI Assistant</div>
                      <div className="text-sm text-slate-500">Ask questions</div>
                    </div>
                  </Button>
                </Link>
                <Link href="/renovation-checklist">
                  <Button variant="outline" className="w-full h-auto p-4 flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-purple-600" />
                    <div className="text-left">
                      <div className="font-semibold">Action Checklist</div>
                      <div className="text-sm text-slate-500">Step-by-step plan</div>
                    </div>
                  </Button>
                </Link>
                <Link href="/project-timeline">
                  <Button variant="outline" className="w-full h-auto p-4 flex items-center gap-3">
                    <Clock className="w-6 h-6 text-orange-600" />
                    <div className="text-left">
                      <div className="font-semibold">Project Timeline</div>
                      <div className="text-sm text-slate-500">See what to expect</div>
                    </div>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/consumer-dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Renovation Concierge</h1>
              <p className="text-slate-600">Let us guide you to the right next step</p>
            </div>
          </div>
          <ModeSwitcher currentMode="consumer" />
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Question {currentStep + 1} of {steps.length}</span>
            <span className="text-sm text-slate-500">{Math.round(((currentStep + 1) / steps.length) * 100)}% complete</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-slate-900 mb-4">
              {steps[currentStep].question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {steps[currentStep].options.map((option) => (
              <Button
                key={option.value}
                variant="outline"
                onClick={() => handleAnswer(option.value)}
                className="w-full h-auto p-6 text-left justify-start hover:bg-blue-50 hover:border-blue-300"
              >
                <div>
                  <div className="font-semibold text-lg text-slate-900 mb-1">
                    {option.label}
                  </div>
                  <div className="text-sm text-slate-600">
                    {option.description}
                  </div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={goBack}
            disabled={currentStep === 0}
            className="px-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <Button
            variant="outline"
            onClick={startOver}
            className="px-8"
          >
            Start Over
          </Button>
        </div>
      </div>
    </div>
  );
}
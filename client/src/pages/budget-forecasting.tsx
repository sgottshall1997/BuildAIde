import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Home, 
  Calendar,
  PieChart,
  Target,
  Lightbulb,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFreemium } from "@/hooks/use-freemium";

interface BudgetForecast {
  totalBudget: number;
  breakdown: {
    materials: number;
    labor: number;
    permits: number;
    contingency: number;
    equipment: number;
  };
  timeline: {
    startDate: string;
    estimatedCompletion: string;
    phases: Array<{
      name: string;
      duration: number;
      cost: number;
    }>;
  };
  riskFactors: Array<{
    factor: string;
    impact: 'low' | 'medium' | 'high';
    description: string;
    mitigation: string;
  }>;
  recommendations: string[];
  marketTrends: {
    currentCondition: string;
    priceDirection: 'rising' | 'stable' | 'declining';
    bestTimeToStart: string;
  };
}

export default function BudgetForecasting() {
  const [projectData, setProjectData] = useState({
    projectType: '',
    homeSquareFootage: '',
    projectSquareFootage: '',
    qualityLevel: 'mid-range',
    timelineFlexibility: 'moderate',
    location: '',
    specialRequirements: '',
    budgetRange: [50000],
    priorityFeatures: [] as string[]
  });

  const [forecast, setForecast] = useState<BudgetForecast | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const { trackToolUsage, showSignupModal, handleEmailSubmitted, closeSignupModal, remainingUses } = useFreemium();
  const { toast } = useToast();

  const projectTypes = [
    { id: 'kitchen', name: 'Kitchen Renovation', avgCost: '$25,000 - $80,000' },
    { id: 'bathroom', name: 'Bathroom Renovation', avgCost: '$15,000 - $50,000' },
    { id: 'addition', name: 'Home Addition', avgCost: '$40,000 - $150,000' },
    { id: 'basement', name: 'Basement Finishing', avgCost: '$20,000 - $60,000' },
    { id: 'whole-house', name: 'Whole House Renovation', avgCost: '$100,000 - $500,000' },
    { id: 'exterior', name: 'Exterior Renovation', avgCost: '$15,000 - $75,000' }
  ];

  const qualityLevels = [
    { id: 'budget', name: 'Budget-Friendly', multiplier: 0.8, description: 'Quality materials, smart choices' },
    { id: 'mid-range', name: 'Mid-Range', multiplier: 1.0, description: 'Good quality, balanced approach' },
    { id: 'high-end', name: 'High-End', multiplier: 1.4, description: 'Premium materials and finishes' },
    { id: 'luxury', name: 'Luxury', multiplier: 1.8, description: 'Top-tier materials and custom work' }
  ];

  const generateForecast = async () => {
    if (!trackToolUsage('budget-forecasting')) {
      return; // Will show signup modal
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/budget-forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });

      const data = await response.json();

      if (response.ok) {
        setForecast(data.forecast);
        toast({
          title: "Budget Forecast Generated!",
          description: "Your personalized renovation budget is ready."
        });
      } else {
        throw new Error(data.error || 'Failed to generate forecast');
      }
    } catch (error) {
      toast({
        title: "Forecast Error",
        description: "Unable to generate budget forecast. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      generateForecast();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return projectData.projectType && projectData.homeSquareFootage && projectData.location;
      case 2:
        return projectData.projectSquareFootage && projectData.qualityLevel;
      case 3:
        return projectData.timelineFlexibility && projectData.budgetRange[0] > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">What type of project are you planning?</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                {projectTypes.map((type) => (
                  <Card
                    key={type.id}
                    className={`cursor-pointer transition-all ${
                      projectData.projectType === type.id
                        ? 'border-2 border-blue-500 bg-blue-50'
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setProjectData(prev => ({ ...prev, projectType: type.id }))}
                  >
                    <CardContent className="p-4">
                      <h3 className="font-medium text-slate-900">{type.name}</h3>
                      <p className="text-sm text-slate-600 mt-1">{type.avgCost}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="home-sqft">Total Home Square Footage</Label>
                <Input
                  id="home-sqft"
                  type="number"
                  placeholder="2,000"
                  value={projectData.homeSquareFootage}
                  onChange={(e) => setProjectData(prev => ({ ...prev, homeSquareFootage: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="location">Location (City, State)</Label>
                <Input
                  id="location"
                  placeholder="Silver Spring, MD"
                  value={projectData.location}
                  onChange={(e) => setProjectData(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="project-sqft">Project Area Square Footage</Label>
              <Input
                id="project-sqft"
                type="number"
                placeholder="300"
                value={projectData.projectSquareFootage}
                onChange={(e) => setProjectData(prev => ({ ...prev, projectSquareFootage: e.target.value }))}
              />
              <p className="text-sm text-slate-600 mt-1">
                How much space will be renovated? (e.g., kitchen: 200 sq ft, bathroom: 100 sq ft)
              </p>
            </div>

            <div>
              <Label className="text-base font-medium">Quality Level & Finishes</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                {qualityLevels.map((level) => (
                  <Card
                    key={level.id}
                    className={`cursor-pointer transition-all ${
                      projectData.qualityLevel === level.id
                        ? 'border-2 border-blue-500 bg-blue-50'
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setProjectData(prev => ({ ...prev, qualityLevel: level.id }))}
                  >
                    <CardContent className="p-4">
                      <h3 className="font-medium text-slate-900">{level.name}</h3>
                      <p className="text-sm text-slate-600 mt-1">{level.description}</p>
                      <Badge variant="secondary" className="mt-2">
                        {level.multiplier}x base cost
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Timeline Flexibility</Label>
              <Select
                value={projectData.timelineFlexibility}
                onValueChange={(value) => setProjectData(prev => ({ ...prev, timelineFlexibility: value }))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select timeline flexibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">Urgent (Rush job - may cost 20% more)</SelectItem>
                  <SelectItem value="moderate">Moderate (Standard timeline)</SelectItem>
                  <SelectItem value="flexible">Flexible (Can wait for better rates)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-base font-medium">Budget Range</Label>
              <div className="mt-3 space-y-3">
                <Slider
                  value={projectData.budgetRange}
                  onValueChange={(value) => setProjectData(prev => ({ ...prev, budgetRange: value }))}
                  max={200000}
                  min={5000}
                  step={5000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-slate-600">
                  <span>$5,000</span>
                  <span className="font-medium text-lg text-slate-900">
                    ${projectData.budgetRange[0].toLocaleString()}
                  </span>
                  <span>$200,000+</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="special-requirements">Special Requirements or Preferences</Label>
              <Textarea
                id="special-requirements"
                placeholder="Any specific needs, accessibility requirements, eco-friendly materials, etc."
                value={projectData.specialRequirements}
                onChange={(e) => setProjectData(prev => ({ ...prev, specialRequirements: e.target.value }))}
                rows={4}
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Ready to Generate Your Forecast</h3>
              <p className="text-sm text-blue-800">
                We'll analyze current market conditions, material prices, and local contractor rates to provide you with a detailed budget forecast.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          Personalized Budget Forecasting
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Get an accurate, data-driven budget forecast for your renovation project with market trends and risk analysis.
        </p>
      </div>

      {!forecast ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Progress Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Budget Forecast Setup</CardTitle>
                <CardDescription>Step {currentStep} of {totalSteps}</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={(currentStep / totalSteps) * 100} className="mb-4" />
                <div className="space-y-3">
                  {[
                    { step: 1, title: "Project Details", desc: "Type and location" },
                    { step: 2, title: "Scope & Quality", desc: "Size and finish level" },
                    { step: 3, title: "Timeline & Budget", desc: "Flexibility and range" },
                    { step: 4, title: "Final Details", desc: "Special requirements" }
                  ].map((item) => (
                    <div
                      key={item.step}
                      className={`p-3 rounded-lg border ${
                        currentStep === item.step
                          ? 'border-blue-500 bg-blue-50'
                          : currentStep > item.step
                          ? 'border-green-200 bg-green-50'
                          : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {currentStep > item.step ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            currentStep === item.step ? 'border-blue-500' : 'border-slate-300'
                          }`} />
                        )}
                        <div>
                          <h4 className="font-medium text-sm">{item.title}</h4>
                          <p className="text-xs text-slate-600">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {currentStep === 1 && "Project Overview"}
                  {currentStep === 2 && "Scope & Quality"}
                  {currentStep === 3 && "Timeline & Budget"}
                  {currentStep === 4 && "Final Details"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderStep()}

                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!isStepValid() || isGenerating}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isGenerating ? (
                      <>
                        <Calculator className="w-4 h-4 mr-2 animate-spin" />
                        Generating Forecast...
                      </>
                    ) : currentStep === totalSteps ? (
                      <>
                        <Target className="w-4 h-4 mr-2" />
                        Generate Forecast
                      </>
                    ) : (
                      "Next"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* Forecast Results */
        <div className="space-y-6">
          {/* Summary Card */}
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-blue-900">
                    Your Budget Forecast
                  </CardTitle>
                  <CardDescription className="text-blue-700">
                    Based on current market conditions and your project requirements
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-900">
                    ${forecast.totalBudget.toLocaleString()}
                  </div>
                  <Badge variant="secondary" className="mt-1">
                    Total Estimated Cost
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Cost Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Cost Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(forecast.breakdown).map(([category, amount]) => (
                    <div key={category} className="flex justify-between items-center">
                      <span className="capitalize text-slate-600">{category}</span>
                      <span className="font-medium">${amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <span className="text-slate-600">Start Date</span>
                    <p className="font-medium">{forecast.timeline.startDate}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Estimated Completion</span>
                    <p className="font-medium">{forecast.timeline.estimatedCompletion}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Market Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <span className="text-slate-600">Current Condition</span>
                    <p className="font-medium">{forecast.marketTrends.currentCondition}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Best Time to Start</span>
                    <p className="font-medium">{forecast.marketTrends.bestTimeToStart}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Factors */}
          {forecast.riskFactors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {forecast.riskFactors.map((risk, index) => (
                    <div key={index} className="p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{risk.factor}</h4>
                        <Badge variant={risk.impact === 'high' ? 'destructive' : risk.impact === 'medium' ? 'default' : 'secondary'}>
                          {risk.impact} risk
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{risk.description}</p>
                      <p className="text-sm text-blue-600">{risk.mitigation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Personalized Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {forecast.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-slate-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              onClick={() => {
                setForecast(null);
                setCurrentStep(1);
              }}
              variant="outline"
            >
              New Forecast
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </div>
        </div>
      )}

      {/* Email Signup Modal */}
      {showSignupModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Unlock Budget Forecasting</h3>
            <p className="text-slate-600 mb-4">
              Get unlimited access to personalized budget forecasts and all our renovation tools.
            </p>
            <div className="flex gap-2">
              <Button onClick={closeSignupModal} variant="outline" className="flex-1">
                Maybe Later
              </Button>
              <Button onClick={() => handleEmailSubmitted("user@example.com")} className="flex-1">
                Continue Free
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
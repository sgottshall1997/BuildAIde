import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  PieChart,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  CreditCard
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFreemium } from "@/hooks/use-freemium";
import { 
  useFieldValidation, 
  validationRules, 
  FormValidationWrapper, 
  FieldError,
  useFormSubmission 
} from "@/components/ui/form-validation";

interface ProjectEstimate {
  totalCost: number;
  costRange: {
    low: number;
    high: number;
  };
  breakdown: {
    materials: number;
    labor: number;
    permits: number;
    contingency: number;
  };
  timeline: {
    duration: number;
    phases: Array<{
      name: string;
      weeks: number;
      cost: number;
    }>;
  };
  paymentSchedule: {
    deposit: number;
    midProject: number;
    completion: number;
  };
  recommendations: string[];
  riskFactors: string[];
}

export default function SmartProjectEstimator() {
  const [estimate, setEstimate] = useState<ProjectEstimate | null>(null);
  const [showBudgetForecast, setShowBudgetForecast] = useState(false);

  const { trackToolUsage, showSignupModal, handleEmailSubmitted, closeSignupModal } = useFreemium();
  const { toast } = useToast();

  // Form validation setup
  const validationSchema = {
    projectType: [
      { validator: validationRules.required, message: 'Please select a project type' }
    ],
    squareFootage: [
      { validator: validationRules.required, message: 'Square footage is required' },
      { validator: validationRules.positiveNumber, message: 'Please enter a valid square footage' },
      { validator: validationRules.range(10, 50000), message: 'Square footage must be between 10 and 50,000' }
    ],
    location: [
      { validator: validationRules.required, message: 'ZIP code is required' },
      { validator: validationRules.zipCode, message: 'Please enter a valid ZIP code (e.g., 12345)' }
    ]
  };

  const {
    values: projectData,
    errors,
    touched,
    updateField,
    touchField,
    validateAllFields,
    reset
  } = useFieldValidation({
    projectType: '',
    squareFootage: '',
    finishLevel: 'mid-range',
    timeline: 'moderate',
    location: ''
  });

  const {
    isSubmitting,
    submitError,
    submitSuccess,
    handleSubmit,
    clearMessages
  } = useFormSubmission();

  const projectTypes = [
    { id: 'kitchen', name: 'Kitchen Renovation', icon: '🍳', avgRange: '$25,000 - $80,000' },
    { id: 'bathroom', name: 'Bathroom Renovation', icon: '🛁', avgRange: '$15,000 - $50,000' },
    { id: 'addition', name: 'Home Addition', icon: '🏠', avgRange: '$40,000 - $150,000' },
    { id: 'basement', name: 'Basement Finishing', icon: '🏠', avgRange: '$20,000 - $60,000' },
    { id: 'whole-house', name: 'Whole House Renovation', icon: '🏘️', avgRange: '$100,000 - $500,000' },
    { id: 'exterior', name: 'Exterior Renovation', icon: '🏡', avgRange: '$15,000 - $75,000' }
  ];

  const finishLevels = [
    { id: 'budget', name: 'Budget-Friendly', multiplier: 0.8, description: 'Quality materials, smart choices' },
    { id: 'mid-range', name: 'Mid-Range', multiplier: 1.0, description: 'Good quality, balanced approach' },
    { id: 'high-end', name: 'High-End', multiplier: 1.4, description: 'Premium materials and finishes' },
    { id: 'luxury', name: 'Luxury', multiplier: 1.8, description: 'Top-tier materials and custom work' }
  ];

  const generateEstimate = async () => {
    // Clear any previous messages
    clearMessages();
    
    // Validate all fields before submission
    if (!validateAllFields(validationSchema)) {
      toast({
        title: "Form Validation Error",
        description: "Please correct the errors below and try again.",
        variant: "destructive"
      });
      return;
    }

    if (!trackToolUsage('smart-project-estimator')) {
      return; // Will show signup modal
    }

    // Submit form with validation
    await handleSubmit(async () => {
      const response = await fetch('/api/smart-estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate estimate');
      }

      setEstimate(data.estimate);
    }, 
    "Your project estimate has been generated successfully!", 
    "Failed to generate estimate. Please check your input and try again."
    );
  };

  const handleInputChange = (field: string, value: any) => {
    updateField(field, value);
    // Clear success message when user starts editing
    if (submitSuccess) {
      clearMessages();
    }
  };

  const handleInputBlur = (field: string) => {
    touchField(field);
  };

  const resetForm = () => {
    reset();
    setEstimate(null);
    setShowBudgetForecast(false);
    clearMessages();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Smart Project Estimator</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Get accurate renovation estimates with detailed breakdowns, timelines, and budget forecasting in one place.
        </p>
      </div>

      {!estimate ? (
        /* Input Form */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Project Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>Tell us about your renovation project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-3 block">What type of project?</Label>
                <div className="grid grid-cols-1 gap-3">
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
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{type.icon}</span>
                          <div>
                            <h3 className="font-medium">{type.name}</h3>
                            <p className="text-sm text-slate-600">{type.avgRange}</p>
                          </div>
                        </div>
                        {projectData.projectType === type.id && (
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sqft">Square Footage</Label>
                  <Input
                    id="sqft"
                    type="number"
                    placeholder="300"
                    value={projectData.squareFootage}
                    onChange={(e) => setProjectData(prev => ({ ...prev, squareFootage: e.target.value }))}
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
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Your Preferences</CardTitle>
              <CardDescription>Customize your estimate parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-3 block">Finish Level</Label>
                <div className="space-y-2">
                  {finishLevels.map((level) => (
                    <Card
                      key={level.id}
                      className={`cursor-pointer transition-all ${
                        projectData.finishLevel === level.id
                          ? 'border-2 border-blue-500 bg-blue-50'
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => setProjectData(prev => ({ ...prev, finishLevel: level.id }))}
                    >
                      <CardContent className="p-3 flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{level.name}</h4>
                          <p className="text-sm text-slate-600">{level.description}</p>
                        </div>
                        <Badge variant="secondary">{level.multiplier}x</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="timeline">Timeline Flexibility</Label>
                <Select
                  value={projectData.timeline}
                  onValueChange={(value) => setProjectData(prev => ({ ...prev, timeline: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">Urgent (Rush job - costs more)</SelectItem>
                    <SelectItem value="moderate">Moderate (Standard timeline)</SelectItem>
                    <SelectItem value="flexible">Flexible (Can wait for better rates)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={generateEstimate}
                disabled={!projectData.projectType || !projectData.squareFootage || isGenerating}
                className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
              >
                {isGenerating ? (
                  <>
                    <Calculator className="w-5 h-5 mr-2 animate-spin" />
                    Generating Estimate...
                  </>
                ) : (
                  <>
                    <Calculator className="w-5 h-5 mr-2" />
                    Get Smart Estimate
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Results */
        <div className="space-y-6">
          {/* Main Estimate Card */}
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-blue-900">Your Project Estimate</CardTitle>
                  <CardDescription className="text-blue-700">
                    Based on current market conditions and your preferences
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-900">
                    ${estimate.totalCost.toLocaleString()}
                  </div>
                  <div className="text-sm text-blue-700">
                    Range: ${estimate.costRange.low.toLocaleString()} - ${estimate.costRange.high.toLocaleString()}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Toggle Budget Forecast */}
          <div className="flex gap-4">
            <Button
              onClick={() => setShowBudgetForecast(!showBudgetForecast)}
              variant={showBudgetForecast ? "default" : "outline"}
              className="flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              {showBudgetForecast ? "Hide" : "Show"} Budget Forecast
            </Button>
            <Button onClick={resetForm} variant="outline">
              New Estimate
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cost Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Cost Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(estimate.breakdown).map(([category, amount]) => {
                    const percentage = Math.round((amount / estimate.totalCost) * 100);
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="capitalize font-medium">{category}</span>
                          <span className="font-bold">${amount.toLocaleString()}</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                        <div className="text-xs text-slate-600 text-right">{percentage}% of total</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Project Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-lg font-medium">
                    {estimate.timeline.duration} weeks total
                  </div>
                  {estimate.timeline.phases.map((phase, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                      <div>
                        <span className="font-medium">{phase.name}</span>
                        <p className="text-sm text-slate-600">{phase.weeks} weeks</p>
                      </div>
                      <span className="font-medium">${phase.cost.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Budget Forecast (Payment Schedule) */}
          {showBudgetForecast && (
            <Card className="border-2 border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-900">
                  <TrendingUp className="w-5 h-5" />
                  Budget Forecast & Payment Schedule
                </CardTitle>
                <CardDescription className="text-green-700">
                  Recommended payment breakdown for your contractor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-green-800">
                      ${estimate.paymentSchedule.deposit.toLocaleString()}
                    </div>
                    <div className="text-green-600 font-medium">Deposit</div>
                    <div className="text-sm text-slate-600 mt-1">25% upfront</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-green-800">
                      ${estimate.paymentSchedule.midProject.toLocaleString()}
                    </div>
                    <div className="text-green-600 font-medium">Mid-Project</div>
                    <div className="text-sm text-slate-600 mt-1">50% at halfway point</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-green-800">
                      ${estimate.paymentSchedule.completion.toLocaleString()}
                    </div>
                    <div className="text-green-600 font-medium">Completion</div>
                    <div className="text-sm text-slate-600 mt-1">25% upon completion</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendations & Risk Factors */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {estimate.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Risk Factors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {estimate.riskFactors.map((risk, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" />
                      <span className="text-sm">{risk}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Email Signup Modal */}
      {showSignupModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Unlock Smart Estimator</h3>
            <p className="text-slate-600 mb-4">
              Get unlimited access to detailed project estimates and budget forecasting.
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
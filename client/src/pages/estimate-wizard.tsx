import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, MapPin, CheckCircle, Clock, FileText, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { ModeSwitcher } from "@/components/mode-toggle";

interface WizardData {
  renovationType: string;
  zipCode: string;
  cityState: string;
  finishLevel: string;
  supplyingMaterials: string;
}

interface EstimateResult {
  lowEnd: number;
  highEnd: number;
  confidenceScore: 'Low' | 'Medium' | 'High';
  timeline: string;
  keyFactors: string[];
}

export default function EstimateWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>({
    renovationType: '',
    zipCode: '',
    cityState: '',
    finishLevel: '',
    supplyingMaterials: ''
  });
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const renovationTypes = [
    { value: "kitchen-remodel", label: "Kitchen Remodel", avgSqft: 200, baseRate: 150 },
    { value: "bathroom-remodel", label: "Bathroom Remodel", avgSqft: 100, baseRate: 200 },
    { value: "basement-finish", label: "Basement Finishing", avgSqft: 600, baseRate: 75 },
    { value: "home-addition", label: "Home Addition", avgSqft: 300, baseRate: 180 },
    { value: "roof-replacement", label: "Roof Replacement", avgSqft: 1200, baseRate: 12 },
    { value: "flooring-installation", label: "Flooring Installation", avgSqft: 800, baseRate: 8 },
    { value: "deck-construction", label: "Deck Construction", avgSqft: 200, baseRate: 35 },
    { value: "window-replacement", label: "Window Replacement", avgSqft: 1, baseRate: 600 },
    { value: "interior-painting", label: "Interior Painting", avgSqft: 1200, baseRate: 3 }
  ];

  const finishLevels = [
    { value: "basic", label: "Basic", description: "Builder-grade materials, standard finishes", multiplier: 0.8 },
    { value: "midrange", label: "Midrange", description: "Good quality materials, attractive finishes", multiplier: 1.0 },
    { value: "premium", label: "Premium", description: "High-end materials, luxury finishes", multiplier: 1.5 }
  ];

  const handleZipCodeChange = async (zip: string) => {
    setWizardData(prev => ({ ...prev, zipCode: zip }));
    
    if (zip.length === 5) {
      try {
        // Mock city/state lookup - in real app would use ZIP code API
        const mockLocations: Record<string, string> = {
          '20895': 'Kensington, MD',
          '20814': 'Bethesda, MD',
          '22101': 'McLean, VA',
          '10001': 'New York, NY',
          '90210': 'Beverly Hills, CA'
        };
        
        const cityState = mockLocations[zip] || 'Unknown Location';
        setWizardData(prev => ({ ...prev, cityState }));
      } catch (error) {
        console.error('Error looking up ZIP code:', error);
      }
    }
  };

  const calculateEstimate = async () => {
    setIsCalculating(true);
    
    try {
      const selectedProject = renovationTypes.find(r => r.value === wizardData.renovationType);
      const selectedFinish = finishLevels.find(f => f.value === wizardData.finishLevel);
      
      if (!selectedProject || !selectedFinish) {
        throw new Error('Invalid selections');
      }

      // Calculate base cost
      const baseRate = selectedProject.baseRate;
      const finishMultiplier = selectedFinish.multiplier;
      const materialDiscount = wizardData.supplyingMaterials === 'yes' ? 0.75 : 1.0;
      
      const baseCost = selectedProject.avgSqft * baseRate * finishMultiplier * materialDiscount;
      const lowEnd = Math.round(baseCost * 0.85);
      const highEnd = Math.round(baseCost * 1.15);

      // Determine confidence score
      const hasZip = wizardData.zipCode.length === 5;
      const isCommonProject = ['kitchen-remodel', 'bathroom-remodel', 'flooring-installation'].includes(wizardData.renovationType);
      
      let confidenceScore: 'Low' | 'Medium' | 'High' = 'Medium';
      if (hasZip && isCommonProject) confidenceScore = 'High';
      if (!hasZip || wizardData.renovationType === 'home-addition') confidenceScore = 'Low';

      // Estimate timeline
      const timelineMap: Record<string, string> = {
        'kitchen-remodel': '4-8 weeks',
        'bathroom-remodel': '2-4 weeks',
        'basement-finish': '6-12 weeks',
        'home-addition': '12-20 weeks',
        'roof-replacement': '1-2 weeks',
        'flooring-installation': '3-7 days',
        'deck-construction': '1-3 weeks',
        'window-replacement': '1-2 days',
        'interior-painting': '3-5 days'
      };

      setResult({
        lowEnd,
        highEnd,
        confidenceScore,
        timeline: timelineMap[wizardData.renovationType] || '2-6 weeks',
        keyFactors: [
          `${selectedFinish.label} finish level selected`,
          wizardData.supplyingMaterials === 'yes' ? 'Material costs reduced (self-supply)' : 'Contractor will supply materials',
          hasZip ? `Prices adjusted for ${wizardData.cityState}` : 'National average pricing used',
          'Add 15-20% buffer for unexpected costs'
        ]
      });

      toast({
        title: "Estimate Complete!",
        description: "Your personalized renovation estimate is ready.",
      });

    } catch (error) {
      console.error('Error calculating estimate:', error);
      toast({
        title: "Calculation Error",
        description: "We couldn't calculate your estimate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateEstimate();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return wizardData.renovationType !== '';
      case 2: return wizardData.zipCode.length >= 5;
      case 3: return wizardData.finishLevel !== '';
      case 4: return wizardData.supplyingMaterials !== '';
      default: return false;
    }
  };

  const getConfidenceColor = (score: string) => {
    switch (score) {
      case 'High': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Low': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (result) {
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
              <h1 className="text-3xl font-bold text-slate-900">Your Personalized Estimate</h1>
            </div>
            <ModeSwitcher currentMode="consumer" />
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Estimate Results */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800 text-2xl">Your Renovation Estimate</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-800 mb-2">
                    ${result.lowEnd.toLocaleString()} - ${result.highEnd.toLocaleString()}
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-lg text-green-600">Confidence:</span>
                    <Badge className={`${getConfidenceColor(result.confidenceScore)} border`}>
                      {result.confidenceScore}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-green-700">
                    <Clock className="w-5 h-5" />
                    <span className="text-lg">Timeline: {result.timeline}</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-3">Key Factors in Your Estimate</h4>
                  <ul className="space-y-2">
                    {result.keyFactors.map((factor, index) => (
                      <li key={index} className="flex items-start gap-2 text-green-700 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-blue-600" />
                  What's Next?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600">
                  Great! Now that you have your estimate, here are some helpful next steps:
                </p>

                <div className="space-y-4">
                  <Button 
                    onClick={() => setLocation('/project-timeline')}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    See Your Project Timeline
                  </Button>

                  <Button 
                    onClick={() => setLocation('/renovation-checklist')}
                    variant="outline"
                    className="w-full"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Get Your Contractor Checklist
                  </Button>

                  <Link href="/quote-compare">
                    <Button variant="outline" className="w-full">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Compare Contractor Quotes
                    </Button>
                  </Link>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mt-6">
                  <h5 className="font-semibold text-amber-800 mb-2">Pro Tip</h5>
                  <p className="text-amber-700 text-sm">
                    Get at least 3 contractor quotes and budget an extra 15-20% for unexpected costs. 
                    Most renovations go slightly over budget, so planning ahead keeps you stress-free!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/consumer-dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Renovation Estimate Wizard</h1>
              <p className="text-slate-600">Get your personalized cost estimate in 4 quick steps</p>
            </div>
          </div>
          <ModeSwitcher currentMode="consumer" />
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Step {currentStep} of 4</span>
            <span className="text-sm text-slate-500">{Math.round((currentStep / 4) * 100)}% complete</span>
          </div>
          <Progress value={(currentStep / 4) * 100} className="h-2" />
        </div>

        {/* Wizard Steps */}
        <Card className="mb-8">
          <CardContent className="p-8">
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">What type of renovation are you planning?</h2>
                <Select value={wizardData.renovationType} onValueChange={(value) => setWizardData(prev => ({ ...prev, renovationType: value }))}>
                  <SelectTrigger className="h-12 text-lg">
                    <SelectValue placeholder="Choose your renovation type" />
                  </SelectTrigger>
                  <SelectContent>
                    {renovationTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value} className="py-3">
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Where is your project located?</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="zipcode" className="text-lg">ZIP Code</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <Input
                        id="zipcode"
                        type="text"
                        placeholder="Enter your ZIP code"
                        value={wizardData.zipCode}
                        onChange={(e) => handleZipCodeChange(e.target.value)}
                        className="pl-10 h-12 text-lg"
                        maxLength={5}
                      />
                    </div>
                  </div>
                  {wizardData.cityState && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-blue-800">
                        <strong>Location:</strong> {wizardData.cityState}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">What finish level do you want?</h2>
                <div className="grid gap-4">
                  {finishLevels.map((level) => (
                    <div
                      key={level.value}
                      onClick={() => setWizardData(prev => ({ ...prev, finishLevel: level.value }))}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        wizardData.finishLevel === level.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <h3 className="font-semibold text-lg text-slate-900">{level.label}</h3>
                      <p className="text-slate-600">{level.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Will you be supplying materials yourself?</h2>
                <div className="grid gap-4">
                  <div
                    onClick={() => setWizardData(prev => ({ ...prev, supplyingMaterials: 'no' }))}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      wizardData.supplyingMaterials === 'no'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <h3 className="font-semibold text-lg text-slate-900">No, contractor will supply everything</h3>
                    <p className="text-slate-600">Most common choice - contractor handles all materials</p>
                  </div>
                  <div
                    onClick={() => setWizardData(prev => ({ ...prev, supplyingMaterials: 'yes' }))}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      wizardData.supplyingMaterials === 'yes'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <h3 className="font-semibold text-lg text-slate-900">Yes, I'll supply the materials</h3>
                    <p className="text-slate-600">Can save money but requires more coordination</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <Button
            onClick={nextStep}
            disabled={!canProceed() || isCalculating}
            className="px-8 bg-blue-600 hover:bg-blue-700"
          >
            {currentStep === 4 ? (
              isCalculating ? 'Calculating...' : 'Get My Estimate'
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
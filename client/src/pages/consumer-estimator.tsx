import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, DollarSign, Home, ArrowLeft, Lightbulb, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { ModeSwitcher } from "@/components/mode-toggle";

interface EstimateResult {
  lowEnd: number;
  highEnd: number;
  perSqFt: number;
  explanation: string;
  keyFactors: string[];
}

export default function ConsumerEstimator() {
  const [projectType, setProjectType] = useState("");
  const [squareFootage, setSquareFootage] = useState("");
  const [finishLevel, setFinishLevel] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [estimate, setEstimate] = useState<EstimateResult | null>(null);
  const { toast } = useToast();

  const projectTypes = [
    { value: "kitchen-remodel", label: "Kitchen Remodel", baseRate: 150 },
    { value: "bathroom-remodel", label: "Bathroom Remodel", baseRate: 200 },
    { value: "basement-finish", label: "Basement Finishing", baseRate: 75 },
    { value: "home-addition", label: "Home Addition", baseRate: 180 },
    { value: "roof-replacement", label: "Roof Replacement", baseRate: 12 },
    { value: "flooring-installation", label: "Flooring Installation", baseRate: 8 },
    { value: "deck-construction", label: "Deck Construction", baseRate: 35 },
    { value: "window-replacement", label: "Window Replacement", baseRate: 600 },
    { value: "siding-replacement", label: "Siding Replacement", baseRate: 15 },
    { value: "interior-painting", label: "Interior Painting", baseRate: 3 }
  ];

  const finishLevels = [
    { value: "basic", label: "Basic / Budget", multiplier: 0.8 },
    { value: "midrange", label: "Mid-Range / Standard", multiplier: 1.0 },
    { value: "high-end", label: "High-End / Premium", multiplier: 1.5 }
  ];

  const calculateEstimate = async () => {
    if (!projectType || !squareFootage || !finishLevel) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to get your estimate.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Get base rate for project type
      const selectedProject = projectTypes.find(p => p.value === projectType);
      const selectedFinish = finishLevels.find(f => f.value === finishLevel);
      
      if (!selectedProject || !selectedFinish) {
        throw new Error("Invalid project configuration");
      }

      const sqft = parseFloat(squareFootage);
      const baseRate = selectedProject.baseRate;
      const finishMultiplier = selectedFinish.multiplier;

      // Calculate cost range (±20% variance)
      const baseCost = sqft * baseRate * finishMultiplier;
      const lowEnd = Math.round(baseCost * 0.8);
      const highEnd = Math.round(baseCost * 1.2);
      const perSqFt = Math.round(baseRate * finishMultiplier);

      // Generate AI explanation
      const response = await fetch("/api/consumer-estimate-explanation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectType,
          squareFootage: sqft,
          finishLevel,
          lowEnd,
          highEnd,
          perSqFt
        }),
      });

      let explanation = "";
      let keyFactors: string[] = [];

      if (response.ok) {
        const data = await response.json();
        explanation = data.explanation || "";
        keyFactors = data.keyFactors || [];
      }

      // Fallback explanation if AI fails
      if (!explanation) {
        const projectLabel = selectedProject.label.toLowerCase();
        const finishLabel = selectedFinish.label.toLowerCase();
        
        explanation = `Your ${projectLabel} project with ${finishLabel} finishes is estimated between $${lowEnd.toLocaleString()} and $${highEnd.toLocaleString()}. This works out to about $${perSqFt}/sq ft, which is typical for this type of renovation in your area.`;
        
        keyFactors = [
          "Material quality affects 40-50% of total cost",
          "Labor costs vary by region and contractor",
          "Permits and inspections may add 5-10%",
          "Unexpected issues can increase costs 10-20%"
        ];
      }

      setEstimate({
        lowEnd,
        highEnd,
        perSqFt,
        explanation,
        keyFactors
      });

      toast({
        title: "Estimate Ready!",
        description: "Your renovation cost estimate has been calculated.",
      });

    } catch (error) {
      console.error("Error calculating estimate:", error);
      toast({
        title: "Calculation Error",
        description: "We couldn't calculate your estimate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
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
              <h1 className="text-3xl font-bold text-slate-900">Renovation Cost Estimator</h1>
              <p className="text-slate-600">Get instant estimates for your home improvement projects</p>
            </div>
          </div>
          <ModeSwitcher currentMode="consumer" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-600" />
                Project Details
              </CardTitle>
              <CardDescription>
                Tell us about your renovation project to get an accurate estimate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="project-type">What type of project?</Label>
                <Select value={projectType} onValueChange={setProjectType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your project type" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectTypes.map((project) => (
                      <SelectItem key={project.value} value={project.value}>
                        {project.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="square-footage">How big is the space? (square feet)</Label>
                <Input
                  id="square-footage"
                  type="number"
                  placeholder="e.g., 120"
                  value={squareFootage}
                  onChange={(e) => setSquareFootage(e.target.value)}
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="finish-level">What quality level do you want?</Label>
                <Select value={finishLevel} onValueChange={setFinishLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose finish quality" />
                  </SelectTrigger>
                  <SelectContent>
                    {finishLevels.map((finish) => (
                      <SelectItem key={finish.value} value={finish.value}>
                        {finish.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={calculateEstimate}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
              >
                {isLoading ? (
                  <>
                    <Calculator className="w-5 h-5 mr-2 animate-pulse" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Calculator className="w-5 h-5 mr-2" />
                    Get My Estimate
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {estimate ? (
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <DollarSign className="w-5 h-5" />
                  Your Estimate Range
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-800 mb-2">
                    ${estimate.lowEnd.toLocaleString()} - ${estimate.highEnd.toLocaleString()}
                  </div>
                  <div className="text-lg text-green-600">
                    About ${estimate.perSqFt}/sq ft
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    What This Means
                  </h4>
                  <p className="text-green-700 text-sm leading-relaxed">
                    {estimate.explanation}
                  </p>
                </div>

                {estimate.keyFactors.length > 0 && (
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Important Cost Factors
                    </h4>
                    <ul className="space-y-1">
                      {estimate.keyFactors.map((factor, index) => (
                        <li key={index} className="text-amber-700 text-sm flex items-start gap-2">
                          <div className="w-1 h-1 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="text-center">
                  <Button variant="outline" className="mr-2">
                    Save Estimate
                  </Button>
                  <Link href="/quote-compare">
                    <Button className="bg-green-600 hover:bg-green-700">
                      Compare Contractor Quotes
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-slate-50">
              <CardContent className="flex items-center justify-center h-full text-center py-12">
                <div className="space-y-4">
                  <Home className="w-16 h-16 text-slate-400 mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">
                      Ready to Get Your Estimate?
                    </h3>
                    <p className="text-slate-500">
                      Fill out the project details and we'll calculate your renovation costs instantly
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
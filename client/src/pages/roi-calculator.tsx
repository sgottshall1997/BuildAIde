import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calculator, TrendingUp, DollarSign, Target, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AIResultBox from "@/components/ui/ai-result-box";
import { ResultsExport } from "@/components/ui/results-export";

interface ROICalculation {
  purchasePrice: number;
  rehabBudget: number;
  afterRepairValue: number;
  closingCosts: number;
  carryingCosts: number;
  totalInvestment: number;
  estimatedProfit: number;
  roiPercentage: number;
  breakevenSalePrice: number;
  marginOfSafety: number;
}

export default function ROICalculator() {
  const [purchasePrice, setPurchasePrice] = useState("");
  const [rehabBudget, setRehabBudget] = useState("");
  const [afterRepairValue, setAfterRepairValue] = useState("");
  const [closingCosts, setClosingCosts] = useState("");
  const [carryingCosts, setCarryingCosts] = useState("");
  const [calculation, setCalculation] = useState<ROICalculation | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);
  const [showAiSuggestion, setShowAiSuggestion] = useState(false);
  const { toast } = useToast();

  const calculateROI = () => {
    const purchase = parseFloat(purchasePrice) || 0;
    const rehab = parseFloat(rehabBudget) || 0;
    const arv = parseFloat(afterRepairValue) || 0;
    const closing = parseFloat(closingCosts) || purchase * 0.06; // Default 6% if not specified
    const carrying = parseFloat(carryingCosts) || purchase * 0.02; // Default 2% if not specified

    const totalInvestment = purchase + rehab + closing + carrying;
    const estimatedProfit = arv - totalInvestment;
    const roiPercentage = totalInvestment > 0 ? (estimatedProfit / totalInvestment) * 100 : 0;
    const breakevenSalePrice = totalInvestment;
    const marginOfSafety = ((arv - breakevenSalePrice) / arv) * 100;

    const result: ROICalculation = {
      purchasePrice: purchase,
      rehabBudget: rehab,
      afterRepairValue: arv,
      closingCosts: closing,
      carryingCosts: carrying,
      totalInvestment,
      estimatedProfit,
      roiPercentage,
      breakevenSalePrice,
      marginOfSafety
    };

    setCalculation(result);
    
    // Show AI suggestion if ROI is below 20%
    if (roiPercentage > 0 && roiPercentage < 20) {
      setShowAiSuggestion(true);
    } else {
      setShowAiSuggestion(false);
    }
    
    if (purchase > 0 && arv > 0) {
      toast({
        title: "ROI Calculated",
        description: `Projected ROI: ${roiPercentage.toFixed(1)}%`,
      });
    }
  };

  const generateAIAnalysis = async () => {
    if (!calculation) return;
    
    setIsGeneratingAnalysis(true);
    try {
      const response = await fetch("/api/roi-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ calculation }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setAiAnalysis(data.analysis);
        toast({
          title: "Analysis Complete",
          description: "AI market analysis generated successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Analysis Error",
        description: "Failed to generate market analysis",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAnalysis(false);
    }
  };

  const saveFlipProject = async () => {
    if (!calculation) return;
    
    try {
      const response = await fetch("/api/flip-projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...calculation,
          aiAnalysis,
          createdAt: new Date().toISOString()
        }),
      });
      
      if (response.ok) {
        toast({
          title: "Project Saved",
          description: "Flip analysis saved to your portfolio",
        });
      }
    } catch (error) {
      toast({
        title: "Save Error",
        description: "Failed to save project",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    calculateROI();
  }, [purchasePrice, rehabBudget, afterRepairValue, closingCosts, carryingCosts]);

  const getRiskLevel = (roi: number) => {
    if (roi >= 20) return { level: "Low Risk", color: "bg-green-500", icon: CheckCircle };
    if (roi >= 15) return { level: "Moderate Risk", color: "bg-yellow-500", icon: Target };
    return { level: "High Risk", color: "bg-red-500", icon: AlertTriangle };
  };

  const getROIQuality = (roi: number) => {
    if (roi >= 25) return { label: "Excellent", color: "text-green-600" };
    if (roi >= 20) return { label: "Good", color: "text-green-600" };
    if (roi >= 15) return { label: "Fair", color: "text-yellow-600" };
    if (roi >= 10) return { label: "Below Average", color: "text-orange-600" };
    return { label: "Poor", color: "text-red-600" };
  };

  const runWhatIfScenario = (scenarioType: string) => {
    if (!calculation) return;
    
    const purchase = parseFloat(purchasePrice);
    let newValue, newROI, message;
    
    switch (scenarioType) {
      case 'lower_purchase':
        newValue = purchase * 0.95;
        newROI = ((calculation.afterRepairValue - (newValue + calculation.rehabBudget + calculation.closingCosts + calculation.carryingCosts)) / (newValue + calculation.rehabBudget + calculation.closingCosts + calculation.carryingCosts)) * 100;
        message = `🤔 If purchased at $${newValue.toLocaleString()}, ROI = ${newROI.toFixed(1)}%`;
        break;
      case 'higher_arv':
        newValue = calculation.afterRepairValue * 1.05;
        newROI = ((newValue - calculation.totalInvestment) / calculation.totalInvestment) * 100;
        message = `📈 If ARV was $${newValue.toLocaleString()}, ROI = ${newROI.toFixed(1)}%`;
        break;
      case 'lower_rehab':
        newValue = calculation.rehabBudget * 0.9;
        const newTotal = calculation.totalInvestment - (calculation.rehabBudget - newValue);
        newROI = ((calculation.afterRepairValue - newTotal) / newTotal) * 100;
        message = `🔧 If rehab was $${newValue.toLocaleString()}, ROI = ${newROI.toFixed(1)}%`;
        break;
    }
    
    toast({
      title: "What-If Analysis",
      description: message,
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 sm:mb-3 px-2">📊 Flip ROI Calculator</h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto px-4">
          Calculate return on investment for your house flipping projects with comprehensive cost analysis and profit projections.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>Enter your flip project numbers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="purchasePrice">Purchase Price</Label>
              <Input
                id="purchasePrice"
                type="number"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                placeholder="500000"
              />
            </div>
            
            <div>
              <Label htmlFor="rehabBudget">Rehab Budget</Label>
              <Input
                id="rehabBudget"
                type="number"
                value={rehabBudget}
                onChange={(e) => setRehabBudget(e.target.value)}
                placeholder="75000"
              />
            </div>
            
            <div>
              <Label htmlFor="afterRepairValue">After Repair Value (ARV)</Label>
              <Input
                id="afterRepairValue"
                type="number"
                value={afterRepairValue}
                onChange={(e) => setAfterRepairValue(e.target.value)}
                placeholder="650000"
              />
            </div>
            
            <div>
              <Label htmlFor="closingCosts">Closing Costs (optional)</Label>
              <Input
                id="closingCosts"
                type="number"
                value={closingCosts}
                onChange={(e) => setClosingCosts(e.target.value)}
                placeholder="30000"
              />
              <p className="text-xs text-slate-500 mt-1">Defaults to 6% of purchase price</p>
            </div>
            
            <div>
              <Label htmlFor="carryingCosts">Carrying Costs (optional)</Label>
              <Input
                id="carryingCosts"
                type="number"
                value={carryingCosts}
                onChange={(e) => setCarryingCosts(e.target.value)}
                placeholder="10000"
              />
              <p className="text-xs text-slate-500 mt-1">Includes financing, utilities, taxes</p>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              ROI Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {calculation && calculation.totalInvestment > 0 ? (
              <>
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <DollarSign className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-800">
                      ${calculation.estimatedProfit.toLocaleString()}
                    </div>
                    <div className="text-sm text-blue-600">Estimated Profit</div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-800">
                      {calculation.roiPercentage.toFixed(1)}%
                    </div>
                    <div className="text-sm text-green-600">
                      <span 
                        title="ROI = Return on Investment – profit as a % of your total project cost"
                        className="cursor-help underline decoration-dotted"
                      >
                        ROI
                      </span>
                      {calculation.roiPercentage > 0 && (
                        <span className={`ml-2 font-medium ${getROIQuality(calculation.roiPercentage).color}`}>
                          ({getROIQuality(calculation.roiPercentage).label})
                        </span>
                      )}
                    </div>
                    <div className="mt-1">
                      <a
                        href="https://www.investopedia.com/terms/r/returnoninvestment.asp"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline text-xs"
                      >
                        Learn more about ROI
                      </a>
                    </div>
                  </div>
                </div>

                {/* Risk Assessment */}
                {calculation.roiPercentage > 0 && (
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-2">
                      {(() => {
                        const risk = getRiskLevel(calculation.roiPercentage);
                        const IconComponent = risk.icon;
                        return (
                          <>
                            <IconComponent className="h-5 w-5" />
                            <span className="font-medium">{risk.level}</span>
                          </>
                        );
                      })()}
                    </div>
                    <Badge variant={calculation.roiPercentage >= 20 ? "default" : calculation.roiPercentage >= 15 ? "secondary" : "destructive"}>
                      {calculation.marginOfSafety.toFixed(1)}% Margin
                    </Badge>
                  </div>
                )}

                {/* Detailed Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Investment:</span>
                    <span className="font-medium">${calculation.totalInvestment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Breakeven Sale Price:</span>
                    <span className="font-medium">${calculation.breakevenSalePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Margin of Safety:</span>
                    <span className="font-medium">{calculation.marginOfSafety.toFixed(1)}%</span>
                  </div>
                </div>

                {/* AI Suggestion for improving ROI */}
                {showAiSuggestion && calculation && (
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <div className="flex items-start gap-2">
                      <div className="text-green-600">💡</div>
                      <div>
                        <h4 className="font-medium text-green-800 mb-1">AI Suggestion</h4>
                        <p className="text-sm text-green-700">
                          Negotiate purchase to ${(parseFloat(purchasePrice) * 0.93).toLocaleString()} to reach 20% ROI target. 
                          Consider reducing rehab scope or finding higher-ARV comparables.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* What-If Scenario Buttons */}
                {calculation && calculation.roiPercentage > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-slate-700">What-If Analysis</h4>
                    <div className="grid grid-cols-1 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => runWhatIfScenario('lower_purchase')}
                        className="text-left justify-start h-auto py-2"
                      >
                        🤔 What if purchase was 5% lower?
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => runWhatIfScenario('higher_arv')}
                        className="text-left justify-start h-auto py-2"
                      >
                        📈 What if ARV was 5% higher?
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => runWhatIfScenario('lower_rehab')}
                        className="text-left justify-start h-auto py-2"
                      >
                        🔧 What if rehab costs were 10% lower?
                      </Button>
                    </div>
                  </div>
                )}

                {/* AI Analysis with unified component */}
                <AIResultBox
                  title="Market Analysis"
                  content={aiAnalysis}
                  isLoading={isGeneratingAnalysis}
                  variant="highlighted"
                  showAnimation={true}
                />
                
                {!aiAnalysis && !isGeneratingAnalysis && (
                  <Button
                    onClick={generateAIAnalysis}
                    className="btn-primary w-full"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Generate Market Analysis
                  </Button>
                )}

                {/* Export Tools */}
                <ResultsExport 
                  data={{
                    title: "ROI Analysis Report",
                    data: calculation,
                    projectDetails: {
                      "Purchase Price": `$${purchasePrice ? parseFloat(purchasePrice).toLocaleString() : 'N/A'}`,
                      "Rehab Budget": `$${rehabBudget ? parseFloat(rehabBudget).toLocaleString() : 'N/A'}`,
                      "After Repair Value": `$${afterRepairValue ? parseFloat(afterRepairValue).toLocaleString() : 'N/A'}`,
                      "Analysis Date": new Date().toLocaleDateString()
                    },
                    timestamp: new Date()
                  }}
                  className="mb-4"
                />

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={saveFlipProject} className="flex-1">
                    Save Project
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Calculator className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                <p>Enter project details to see ROI calculation</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Montgomery County Flip Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-1">Target ROI</h4>
              <p className="text-green-700">Aim for 20%+ ROI in Montgomery County market</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-1">Rehab Budget</h4>
              <p className="text-blue-700">Typical budget: 10-15% of ARV for competitive flips</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-orange-800 mb-1">Carrying Costs</h4>
              <p className="text-orange-700">Budget 2-3% of purchase price for 6-month timeline</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
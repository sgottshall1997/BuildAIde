import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingUp, Lightbulb, Eye, Loader2, DollarSign } from "lucide-react";

interface HiddenCostInsightsProps {
  estimateData: any;
  onInsightsGenerated?: (insights: any) => void;
}

interface InsightData {
  insight: string;
  hiddenCosts: string[];
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export default function HiddenCostInsights({ estimateData, onInsightsGenerated }: HiddenCostInsightsProps) {
  const [insights, setInsights] = useState<InsightData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (estimateData && estimateData.estimatedCost) {
      generateInsights();
    }
  }, [estimateData]);

  const generateInsights = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/hidden-cost-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estimateData }),
      });

      if (response.ok) {
        const data = await response.json();
        setInsights(data);
        onInsightsGenerated?.(data);
      }
    } catch (error) {
      console.error("Error generating hidden cost insights:", error);
      // Fallback insights based on estimate patterns
      const fallbackInsights: InsightData = {
        insight: `This ${estimateData.projectType} estimate shows standard cost distribution. Labor represents ${Math.round((estimateData.laborCost / estimateData.estimatedCost) * 100)}% of total cost.`,
        hiddenCosts: [
          "Permit processing delays beyond quoted timeline",
          "Material price fluctuations during project duration", 
          "Site access complications not reflected in current pricing",
          "Weather-related delays during exterior work phases"
        ],
        recommendations: [
          "Maintain 15-20% contingency buffer for unforeseen costs",
          "Lock in material pricing with suppliers early",
          "Plan buffer time for permit approvals",
          "Consider seasonal timing for outdoor work"
        ],
        riskLevel: estimateData.timeline === "urgent" ? "high" : "medium"
      };
      setInsights(fallbackInsights);
    } finally {
      setIsGenerating(false);
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'green';
      case 'high': return 'red';
      default: return 'amber';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return TrendingUp;
      case 'high': return AlertTriangle;
      default: return Eye;
    }
  };

  if (!insights && !isGenerating) {
    return null;
  }

  const riskColor = insights ? getRiskColor(insights.riskLevel) : 'amber';
  const RiskIcon = insights ? getRiskIcon(insights.riskLevel) : Eye;

  return (
    <Card className={`border-${riskColor}-200 bg-${riskColor}-50/50 dark:bg-${riskColor}-950/30 dark:border-${riskColor}-800`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className={`w-8 h-8 bg-${riskColor}-600 rounded-lg flex items-center justify-center`}>
            <RiskIcon className="h-4 w-4 text-white" />
          </div>
          Hidden Cost Analysis
          <Badge variant="secondary" className={`bg-${riskColor}-100 text-${riskColor}-700 dark:bg-${riskColor}-900 dark:text-${riskColor}-300`}>
            AI Insight
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isGenerating ? (
          <div className="flex items-center gap-3 p-4">
            <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Analyzing cost patterns and identifying potential hidden expenses...
            </div>
          </div>
        ) : insights ? (
          <div className="space-y-4">
            {/* Main Insight */}
            <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-start gap-3">
                <Lightbulb className={`h-5 w-5 text-${riskColor}-600 mt-0.5 flex-shrink-0`} />
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Cost Analysis</h4>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {insights.insight}
                  </p>
                </div>
              </div>
            </div>

            {/* Hidden Costs */}
            {insights.hiddenCosts.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-red-600" />
                  Potential Hidden Costs
                </h4>
                <div className="space-y-2">
                  {insights.hiddenCosts.map((cost, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-red-800 dark:text-red-300">{cost}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {insights.recommendations.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  Recommendations
                </h4>
                <div className="space-y-2">
                  {insights.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-green-800 dark:text-green-300">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Risk Level Summary */}
            <div className={`p-3 bg-${riskColor}-100 dark:bg-${riskColor}-950/50 rounded-lg border border-${riskColor}-200 dark:border-${riskColor}-700`}>
              <p className={`text-sm text-${riskColor}-800 dark:text-${riskColor}-300 font-medium`}>
                <RiskIcon className="h-4 w-4 inline mr-1" />
                Risk Level: {insights.riskLevel.toUpperCase()} - 
                {insights.riskLevel === 'low' && " Project appears well-structured with minimal risk factors"}
                {insights.riskLevel === 'medium' && " Standard project risks apply, maintain recommended contingencies"}
                {insights.riskLevel === 'high' && " Enhanced monitoring and contingency planning recommended"}
              </p>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
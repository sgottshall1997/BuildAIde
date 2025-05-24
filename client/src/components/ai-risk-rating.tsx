import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, CheckCircle, Clock, Loader2 } from "lucide-react";

interface AIRiskRatingProps {
  estimateData: any;
  onRiskAssessed?: (risk: any) => void;
}

export default function AIRiskRating({ estimateData, onRiskAssessed }: AIRiskRatingProps) {
  const [riskData, setRiskData] = useState<{
    riskLevel: 'low' | 'medium' | 'high';
    riskExplanation: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (estimateData && estimateData.estimatedCost) {
      generateRiskRating();
    }
  }, [estimateData]);

  const generateRiskRating = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/risk-rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(estimateData),
      });
      
      if (response.ok) {
        const data = await response.json();
        setRiskData(data);
        onRiskAssessed?.(data);
      }
    } catch (error) {
      console.error("Error generating risk rating:", error);
      setRiskData({
        riskLevel: 'medium',
        riskExplanation: 'Standard project risk factors apply. Consider maintaining a 15% contingency buffer.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!riskData && !isLoading) {
    return null;
  }

  const getRiskIcon = () => {
    if (!riskData) return Clock;
    switch (riskData.riskLevel) {
      case 'low': return CheckCircle;
      case 'medium': return Clock;
      case 'high': return AlertTriangle;
      default: return Shield;
    }
  };

  const getRiskColor = () => {
    if (!riskData) return 'blue';
    switch (riskData.riskLevel) {
      case 'low': return 'green';
      case 'medium': return 'amber';
      case 'high': return 'red';
      default: return 'blue';
    }
  };

  const RiskIcon = getRiskIcon();
  const riskColor = getRiskColor();

  return (
    <Card className={`border-${riskColor}-200 bg-${riskColor}-50/50 dark:bg-${riskColor}-950/30 dark:border-${riskColor}-800`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className={`w-8 h-8 bg-${riskColor}-600 rounded-lg flex items-center justify-center`}>
            <RiskIcon className="h-4 w-4 text-white" />
          </div>
          Project Risk Assessment
          <Badge variant="secondary" className={`bg-${riskColor}-100 text-${riskColor}-700 dark:bg-${riskColor}-900 dark:text-${riskColor}-300`}>
            {isLoading ? 'Analyzing...' : `${riskData?.riskLevel?.toUpperCase()} RISK`}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-3 p-4">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Assessing project risks and delivery factors...
            </div>
          </div>
        ) : riskData ? (
          <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-start gap-3">
              <Shield className={`h-5 w-5 text-${riskColor}-600 mt-0.5 flex-shrink-0`} />
              <div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {riskData.riskExplanation}
                </p>
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Risk assessment based on timeline, labor availability, material complexity, and site conditions
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
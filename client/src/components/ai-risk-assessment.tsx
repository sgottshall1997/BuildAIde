import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, CheckCircle, Loader2, Clock, DollarSign } from "lucide-react";

interface RiskAssessmentProps {
  projectType: string;
  area: number;
  materialQuality: string;
  timeline: string;
  estimatedCost: number;
  zipCode?: string;
}

interface RiskFactor {
  category: string;
  risk: 'low' | 'medium' | 'high';
  description: string;
  mitigation: string;
  impact: string;
}

interface RiskAssessment {
  overallRisk: 'low' | 'medium' | 'high';
  riskScore: number;
  factors: RiskFactor[];
  recommendations: string[];
  budgetBuffer: number;
  timelineBuffer: number;
}

export default function AIRiskAssessment({
  projectType,
  area,
  materialQuality,
  timeline,
  estimatedCost,
  zipCode
}: RiskAssessmentProps) {
  const [assessment, setAssessment] = useState<RiskAssessment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAssessed, setHasAssessed] = useState(false);

  const generateRiskAssessment = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/ai-risk-assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectType,
          area,
          materialQuality,
          timeline,
          estimatedCost,
          zipCode
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAssessment(data.assessment);
      } else {
        console.error("Failed to generate risk assessment");
      }
    } catch (error) {
      console.error("Error generating risk assessment:", error);
    } finally {
      setIsLoading(false);
      setHasAssessed(true);
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          AI-Powered Risk Assessment
        </CardTitle>
        <CardDescription>
          Get intelligent insights on potential project risks and mitigation strategies
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasAssessed ? (
          <Button 
            onClick={generateRiskAssessment} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Project Risks...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Generate Risk Assessment
              </>
            )}
          </Button>
        ) : assessment ? (
          <div className="space-y-6">
            {/* Overall Risk Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {getRiskIcon(assessment.overallRisk)}
                  <Badge className={getRiskColor(assessment.overallRisk)}>
                    {assessment.overallRisk.toUpperCase()} RISK
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Overall Project Risk</p>
                <p className="text-lg font-semibold">{assessment.riskScore}/100</p>
              </div>
              
              <div className="p-4 border rounded-lg text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  <span className="text-lg font-semibold text-blue-600">
                    {assessment.budgetBuffer}%
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Recommended Budget Buffer</p>
                <p className="text-xs text-gray-500">
                  +{formatCurrency(estimatedCost * (assessment.budgetBuffer / 100))}
                </p>
              </div>
              
              <div className="p-4 border rounded-lg text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="text-lg font-semibold text-orange-600">
                    {assessment.timelineBuffer}%
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Timeline Buffer</p>
                <p className="text-xs text-gray-500">Additional time recommended</p>
              </div>
            </div>

            {/* Risk Factors */}
            <div>
              <h4 className="text-lg font-medium mb-4">Identified Risk Factors</h4>
              <div className="space-y-3">
                {assessment.factors.map((factor, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getRiskIcon(factor.risk)}
                        <h5 className="font-medium">{factor.category}</h5>
                      </div>
                      <Badge className={getRiskColor(factor.risk)}>
                        {factor.risk}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      {factor.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="font-medium text-blue-700 dark:text-blue-300 mb-1">Impact:</p>
                        <p className="text-gray-600 dark:text-gray-400">{factor.impact}</p>
                      </div>
                      <div>
                        <p className="font-medium text-green-700 dark:text-green-300 mb-1">Mitigation:</p>
                        <p className="text-gray-600 dark:text-gray-400">{factor.mitigation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h4 className="text-lg font-medium mb-3 text-blue-800 dark:text-blue-200">
                AI Recommendations
              </h4>
              <ul className="space-y-2">
                {assessment.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-blue-700 dark:text-blue-300">
                    <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    {recommendation}
                  </li>
                ))}
              </ul>
            </div>

            <Button 
              variant="outline" 
              onClick={() => {
                setHasAssessed(false);
                setAssessment(null);
              }}
              className="w-full"
            >
              Generate New Assessment
            </Button>
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Assessment Unavailable
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Unable to generate risk assessment at this time.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setHasAssessed(false)}
            >
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
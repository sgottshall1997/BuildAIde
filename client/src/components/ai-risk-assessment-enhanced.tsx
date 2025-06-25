import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Shield, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface AIRiskAssessmentEnhancedProps {
  estimate: {
    Materials?: Record<string, number>;
    Labor?: Record<string, { hours: number; cost: number }>;
    "Permits & Fees"?: Record<string, number>;
    "Equipment & Overhead"?: Record<string, number>;
    "Profit & Contingency"?: Record<string, number>;
    TotalEstimate?: number;
    Notes?: string;
  };
}

export default function AIRiskAssessmentEnhanced({ estimate }: AIRiskAssessmentEnhancedProps) {
  const [riskData, setRiskData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateRiskAssessment = async () => {
      setIsLoading(true);
      try {
        // Simulate AI risk assessment based on estimate data
        const totalCost = estimate.TotalEstimate || 0;
        const materialsTotal = Object.values(estimate.Materials || {}).reduce((sum, val) => sum + val, 0);
        const laborTotal = Object.values(estimate.Labor || {}).reduce((sum, item) => 
          sum + (typeof item === 'object' && item.cost ? item.cost : 0), 0);
        
        // Generate risk insights based on cost breakdown
        const riskLevel = totalCost > 50000 ? 'high' : totalCost > 20000 ? 'medium' : 'low';
        const materialRisk = materialsTotal / totalCost > 0.6 ? 'high' : 'low';
        const laborRisk = laborTotal / totalCost > 0.5 ? 'medium' : 'low';

        const mockRiskData = {
          overallRisk: riskLevel,
          riskScore: Math.round(40 + (totalCost / 1000)),
          insights: [
            totalCost > 30000 ? 'Large project budget increases complexity and coordination challenges' : 'Moderate project size with manageable risk factors',
            materialRisk === 'high' ? 'High material costs suggest specialty items - confirm availability and lead times' : 'Material costs are within normal ranges',
            laborRisk === 'medium' ? 'Labor-intensive project - ensure skilled contractor availability' : 'Standard labor requirements for this project type'
          ],
          hiddenCosts: [
            'Permit delays could add 2-4 weeks to timeline',
            'Material price fluctuations (steel, lumber) may impact budget',
            'Weather-related delays for exterior work',
            'Potential electrical/plumbing upgrades if code compliance required'
          ],
          recommendations: [
            'Maintain 15-20% contingency for unexpected costs',
            'Confirm contractor licensing and insurance coverage',
            'Get multiple quotes to validate pricing',
            'Schedule permit applications early to avoid delays'
          ],
          timelineRisks: [
            { factor: 'Weather delays', impact: 'medium', mitigation: 'Plan for seasonal considerations' },
            { factor: 'Material availability', impact: materialRisk, mitigation: 'Order materials early' },
            { factor: 'Permit processing', impact: 'medium', mitigation: 'Submit applications promptly' }
          ]
        };

        setRiskData(mockRiskData);
      } catch (error) {
        console.error('Error generating risk assessment:', error);
      } finally {
        setIsLoading(false);
      }
    };

    generateRiskAssessment();
  }, [estimate]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            AI Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Analyzing project risks...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'destructive';
      case 'medium': return 'outline';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      case 'low': return <Shield className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          AI Risk Assessment
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Intelligent analysis of potential project risks and mitigation strategies
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Risk Score */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            {getRiskIcon(riskData.overallRisk)}
            <Badge variant={getRiskColor(riskData.overallRisk)} className="text-sm">
              {riskData.overallRisk.toUpperCase()} RISK
            </Badge>
          </div>
          <div className="text-2xl font-bold text-gray-900">Risk Score: {riskData.riskScore}/100</div>
          <div className="text-sm text-gray-600">Based on project complexity and cost factors</div>
        </div>

        {/* Key Insights */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Key Risk Insights
          </h3>
          <div className="space-y-2">
            {riskData.insights.map((insight: string, index: number) => (
              <Alert key={index}>
                <AlertDescription>{insight}</AlertDescription>
              </Alert>
            ))}
          </div>
        </div>

        {/* Hidden Costs */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Potential Hidden Costs
          </h3>
          <div className="grid gap-2">
            {riskData.hiddenCosts.map((cost: string, index: number) => (
              <div key={index} className="flex items-start gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{cost}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Risks */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Timeline Risk Factors
          </h3>
          <div className="space-y-3">
            {riskData.timelineRisks.map((risk: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{risk.factor}</div>
                  <div className="text-sm text-gray-600">{risk.mitigation}</div>
                </div>
                <Badge variant={getRiskColor(risk.impact)} className="ml-2">
                  {risk.impact}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h3 className="font-semibold mb-3">Recommended Actions</h3>
          <div className="space-y-2">
            {riskData.recommendations.map((rec: string, index: number) => (
              <div key={index} className="flex items-start gap-2 p-2 bg-green-50 border border-green-200 rounded">
                <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
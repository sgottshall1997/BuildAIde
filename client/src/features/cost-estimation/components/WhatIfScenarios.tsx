import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, Clock, Package, ArrowRight } from "lucide-react";
import type { WhatIfScenario, EstimationFormData } from '../types';

interface WhatIfScenariosProps {
  originalEstimate: EstimationFormData & {
    estimatedCost: number;
    materialCost?: number;
    laborCost?: number;
    permitCost?: number;
    softCosts?: number;
  };
}

export function WhatIfScenarios({ originalEstimate }: WhatIfScenariosProps) {
  const [scenarios, setScenarios] = useState<WhatIfScenario[]>([
    {
      id: "budget-materials",
      name: "Budget Materials",
      changes: { materialQuality: "budget" },
      impact: { costDifference: 0, percentageChange: 0 }
    },
    {
      id: "premium-materials", 
      name: "Premium Materials",
      changes: { materialQuality: "premium" },
      impact: { costDifference: 0, percentageChange: 0 }
    },
    {
      id: "extra-worker",
      name: "Add Worker",
      changes: { laborWorkers: (originalEstimate.laborWorkers || 2) + 1 },
      impact: { costDifference: 0, percentageChange: 0 }
    },
    {
      id: "flexible-timeline",
      name: "Flexible Timeline", 
      changes: { timeline: "extended" },
      impact: { costDifference: 0, percentageChange: 0 }
    },
    {
      id: "rush-job",
      name: "Rush Job",
      changes: { 
        timeline: "expedited", 
        laborRate: (originalEstimate.laborRate || 35) * 1.3 
      },
      impact: { costDifference: 0, percentageChange: 0 }
    }
  ]);

  const calculateScenario = async (scenario: WhatIfScenario) => {
    try {
      const modifiedEstimate = { ...originalEstimate, ...scenario.changes };
      
      const response = await fetch("/api/calculate-scenario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(modifiedEstimate),
      });

      if (response.ok) {
        const result = await response.json();
        const difference = result.estimatedCost - originalEstimate.estimatedCost;
        const percentageChange = (difference / originalEstimate.estimatedCost) * 100;

        const updatedScenario: WhatIfScenario = {
          ...scenario,
          impact: {
            costDifference: difference,
            percentageChange,
            timeline: result.timeline
          }
        };

        setScenarios(prev => 
          prev.map(s => s.id === scenario.id ? updatedScenario : s)
        );
      }
    } catch (error) {
      console.error("Error calculating scenario:", error);
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

  const getDifferenceColor = (difference: number) => {
    if (difference > 0) return "text-red-600 dark:text-red-400";
    if (difference < 0) return "text-green-600 dark:text-green-400";
    return "text-gray-600 dark:text-gray-400";
  };

  const getDifferenceIcon = (difference: number) => {
    if (difference > 0) return <TrendingUp className="h-4 w-4" />;
    if (difference < 0) return <TrendingDown className="h-4 w-4" />;
    return null;
  };

  const getScenarioIcon = (scenarioId: string) => {
    switch (scenarioId) {
      case "budget-materials":
      case "premium-materials":
        return <Package className="h-4 w-4" />;
      case "extra-worker":
        return <Users className="h-4 w-4" />;
      case "flexible-timeline":
      case "rush-job":
        return <Clock className="h-4 w-4" />;
      default:
        return <ArrowRight className="h-4 w-4" />;
    }
  };

  const getScenarioDescription = (scenarioId: string) => {
    const descriptions = {
      "budget-materials": "Switch to budget-grade materials",
      "premium-materials": "Upgrade to premium materials",
      "extra-worker": "Add one more worker to speed up timeline",
      "flexible-timeline": "Extend timeline for cost savings",
      "rush-job": "Expedited timeline with premium rates"
    };
    return descriptions[scenarioId as keyof typeof descriptions] || "";
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRight className="h-5 w-5" />
          What-If Scenarios
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Explore how changes affect your project cost without re-entering data
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios.map((scenario) => (
            <div key={scenario.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
              <div className="flex items-center gap-2 mb-3">
                {getScenarioIcon(scenario.id)}
                <h4 className="font-medium">{scenario.name}</h4>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {getScenarioDescription(scenario.id)}
              </p>

              {scenario.impact.costDifference !== 0 ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">New Total:</span>
                    <span className="font-semibold">
                      {formatCurrency(originalEstimate.estimatedCost + scenario.impact.costDifference)}
                    </span>
                  </div>
                  
                  <div className={`flex items-center gap-1 text-sm ${getDifferenceColor(scenario.impact.costDifference)}`}>
                    {getDifferenceIcon(scenario.impact.costDifference)}
                    <span>
                      {scenario.impact.costDifference > 0 ? '+' : ''}{formatCurrency(scenario.impact.costDifference)}
                      ({scenario.impact.percentageChange > 0 ? '+' : ''}{scenario.impact.percentageChange.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ) : (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => calculateScenario(scenario)}
                  className="w-full"
                >
                  Calculate Impact
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Summary of Original Estimate */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="font-medium mb-2">Original Estimate</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Material Quality:</span>
              <p className="font-medium capitalize">{originalEstimate.materialQuality}</p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Timeline:</span>
              <p className="font-medium capitalize">{originalEstimate.timeline}</p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Workers:</span>
              <p className="font-medium">{originalEstimate.laborWorkers || 'Not specified'}</p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Total Cost:</span>
              <p className="font-semibold text-lg">{formatCurrency(originalEstimate.estimatedCost)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
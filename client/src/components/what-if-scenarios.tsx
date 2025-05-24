import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Users, Clock, Package, ArrowRight } from "lucide-react";

interface WhatIfScenariosProps {
  originalEstimate: {
    projectType: string;
    area: number;
    materialQuality: string;
    laborWorkers?: number;
    laborHours?: number;
    laborRate?: number;
    timeline: string;
    estimatedCost: number;
    materialCost?: number;
    laborCost?: number;
    permitCost?: number;
    softCosts?: number;
  };
}

interface Scenario {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  changes: any;
  estimatedCost?: number;
  difference?: number;
  percentChange?: number;
  explanation?: string;
}

export default function WhatIfScenarios({ originalEstimate }: WhatIfScenariosProps) {
  const [scenarios, setScenarios] = useState<Scenario[]>([
    {
      id: "budget-materials",
      name: "Budget Materials",
      description: "Switch to budget-grade materials",
      icon: <Package className="h-4 w-4" />,
      changes: { materialQuality: "budget" }
    },
    {
      id: "premium-materials", 
      name: "Premium Materials",
      description: "Upgrade to premium materials",
      icon: <Package className="h-4 w-4" />,
      changes: { materialQuality: "premium" }
    },
    {
      id: "extra-worker",
      name: "Add Worker",
      description: "Add one more worker to speed up timeline",
      icon: <Users className="h-4 w-4" />,
      changes: { laborWorkers: (originalEstimate.laborWorkers || 2) + 1 }
    },
    {
      id: "flexible-timeline",
      name: "Flexible Timeline", 
      description: "Extend timeline for cost savings",
      icon: <Clock className="h-4 w-4" />,
      changes: { timeline: "extended" }
    },
    {
      id: "rush-job",
      name: "Rush Job",
      description: "Expedited timeline with premium rates",
      icon: <Clock className="h-4 w-4" />,
      changes: { timeline: "expedited", laborRate: (originalEstimate.laborRate || 35) * 1.3 }
    }
  ]);

  const calculateScenario = async (scenario: Scenario) => {
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
        const percentChange = (difference / originalEstimate.estimatedCost) * 100;

        const updatedScenario = {
          ...scenario,
          estimatedCost: result.estimatedCost,
          difference,
          percentChange,
          explanation: result.explanation
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
                {scenario.icon}
                <h4 className="font-medium">{scenario.name}</h4>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {scenario.description}
              </p>

              {scenario.estimatedCost ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">New Total:</span>
                    <span className="font-semibold">
                      {formatCurrency(scenario.estimatedCost)}
                    </span>
                  </div>
                  
                  <div className={`flex items-center gap-1 text-sm ${getDifferenceColor(scenario.difference!)}`}>
                    {getDifferenceIcon(scenario.difference!)}
                    <span>
                      {scenario.difference! > 0 ? '+' : ''}{formatCurrency(scenario.difference!)}
                      ({scenario.percentChange! > 0 ? '+' : ''}{scenario.percentChange!.toFixed(1)}%)
                    </span>
                  </div>

                  {scenario.explanation && (
                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded text-sm">
                      <p className="text-blue-800 dark:text-blue-200">
                        💡 {scenario.explanation}
                      </p>
                    </div>
                  )}
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
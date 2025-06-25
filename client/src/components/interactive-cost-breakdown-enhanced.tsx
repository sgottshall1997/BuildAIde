import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface InteractiveCostBreakdownEnhancedProps {
  estimate: {
    Materials?: Record<string, number>;
    Labor?: Record<string, { hours: number; cost: number }>;
    "Permits & Fees"?: Record<string, number>;
    "Equipment & Overhead"?: Record<string, number>;
    "Profit & Contingency"?: Record<string, number>;
    TotalEstimate?: number;
  };
}

export default function InteractiveCostBreakdownEnhanced({ estimate }: InteractiveCostBreakdownEnhancedProps) {
  const [adjustments, setAdjustments] = useState<Record<string, number>>({});

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateSectionTotal = (section: Record<string, any>) => {
    if (!section) return 0;
    return Object.values(section).reduce((total, item) => {
      if (typeof item === 'number') return total + item;
      if (typeof item === 'object' && item.cost) return total + item.cost;
      return total;
    }, 0);
  };

  const materialsTotal = calculateSectionTotal(estimate.Materials || {});
  const laborTotal = calculateSectionTotal(estimate.Labor || {});
  const permitsTotal = calculateSectionTotal(estimate["Permits & Fees"] || {});
  const equipmentTotal = calculateSectionTotal(estimate["Equipment & Overhead"] || {});
  const profitTotal = calculateSectionTotal(estimate["Profit & Contingency"] || {});

  const originalTotal = materialsTotal + laborTotal + permitsTotal + equipmentTotal + profitTotal;

  const sections = [
    { 
      name: 'Materials', 
      amount: materialsTotal, 
      percentage: Math.round((materialsTotal / originalTotal) * 100) || 0,
      color: 'bg-blue-500' 
    },
    { 
      name: 'Labor', 
      amount: laborTotal, 
      percentage: Math.round((laborTotal / originalTotal) * 100) || 0,
      color: 'bg-green-500' 
    },
    { 
      name: 'Permits', 
      amount: permitsTotal, 
      percentage: Math.round((permitsTotal / originalTotal) * 100) || 0,
      color: 'bg-yellow-500' 
    },
    { 
      name: 'Equipment', 
      amount: equipmentTotal, 
      percentage: Math.round((equipmentTotal / originalTotal) * 100) || 0,
      color: 'bg-purple-500' 
    },
    { 
      name: 'Profit', 
      amount: profitTotal, 
      percentage: Math.round((profitTotal / originalTotal) * 100) || 0,
      color: 'bg-red-500' 
    }
  ];

  const getAdjustedAmount = (sectionName: string, originalAmount: number) => {
    const adjustment = adjustments[sectionName] || 0;
    return originalAmount + adjustment;
  };

  const getAdjustedTotal = () => {
    return sections.reduce((total, section) => {
      return total + getAdjustedAmount(section.name, section.amount);
    }, 0);
  };

  const handleAdjustment = (sectionName: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setAdjustments(prev => ({
      ...prev,
      [sectionName]: numValue
    }));
  };

  const getTrendIcon = (sectionName: string) => {
    const adjustment = adjustments[sectionName] || 0;
    if (adjustment > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (adjustment < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const adjustedTotal = getAdjustedTotal();
  const totalChange = adjustedTotal - originalTotal;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          Interactive Cost Breakdown
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Adjust individual categories to see how changes affect your total cost
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cost Sections */}
        <div className="space-y-4">
          {sections.map((section) => {
            const adjustedAmount = getAdjustedAmount(section.name, section.amount);
            const adjustedPercentage = Math.round((adjustedAmount / adjustedTotal) * 100) || 0;
            
            return (
              <div key={section.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${section.color}`}></div>
                    <span className="font-medium">{section.name}</span>
                    {getTrendIcon(section.name)}
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(adjustedAmount)}</div>
                    <div className="text-sm text-gray-500">{adjustedPercentage}%</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 min-w-[80px]">Adjust by:</span>
                  <Input
                    type="number"
                    placeholder="0"
                    value={adjustments[section.name] || ''}
                    onChange={(e) => handleAdjustment(section.name, e.target.value)}
                    className="w-32"
                  />
                  <span className="text-sm text-gray-500">
                    Original: {formatCurrency(section.amount)}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${section.color}`}
                    style={{ width: `${adjustedPercentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Total Summary */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between text-lg font-bold">
            <span>Adjusted Total:</span>
            <div className="text-right">
              <div>{formatCurrency(adjustedTotal)}</div>
              {totalChange !== 0 && (
                <div className={`text-sm ${totalChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {totalChange > 0 ? '+' : ''}{formatCurrency(totalChange)} from original
                </div>
              )}
            </div>
          </div>
          
          {totalChange !== 0 && (
            <div className="mt-2 text-center">
              <Badge variant={totalChange > 0 ? "destructive" : "secondary"}>
                {Math.abs(Math.round((totalChange / originalTotal) * 100))}% {totalChange > 0 ? 'increase' : 'decrease'}
              </Badge>
            </div>
          )}
        </div>

        {/* Reset Button */}
        {Object.keys(adjustments).length > 0 && (
          <Button 
            variant="outline" 
            onClick={() => setAdjustments({})}
            className="w-full"
          >
            Reset to Original
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
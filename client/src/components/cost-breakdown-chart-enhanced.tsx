import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { BarChart3 } from 'lucide-react';

interface CostBreakdownChartEnhancedProps {
  estimate: {
    Materials?: Record<string, number>;
    Labor?: Record<string, { hours: number; cost: number }>;
    "Permits & Fees"?: Record<string, number>;
    "Equipment & Overhead"?: Record<string, number>;
    "Profit & Contingency"?: Record<string, number>;
    TotalEstimate?: number;
  };
}

export default function CostBreakdownChartEnhanced({ estimate }: CostBreakdownChartEnhancedProps) {
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

  const totalCost = materialsTotal + laborTotal + permitsTotal + equipmentTotal + profitTotal;

  const chartData = [
    {
      name: 'Materials',
      value: materialsTotal,
      percentage: Math.round((materialsTotal / totalCost) * 100) || 0,
      color: '#3b82f6'
    },
    {
      name: 'Labor',
      value: laborTotal,
      percentage: Math.round((laborTotal / totalCost) * 100) || 0,
      color: '#10b981'
    },
    {
      name: 'Permits & Fees',
      value: permitsTotal,
      percentage: Math.round((permitsTotal / totalCost) * 100) || 0,
      color: '#f59e0b'
    },
    {
      name: 'Equipment',
      value: equipmentTotal,
      percentage: Math.round((equipmentTotal / totalCost) * 100) || 0,
      color: '#8b5cf6'
    },
    {
      name: 'Profit & Contingency',
      value: profitTotal,
      percentage: Math.round((profitTotal / totalCost) * 100) || 0,
      color: '#ef4444'
    }
  ].filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold">{data.name}</p>
          <p className="text-blue-600">{formatCurrency(data.value)}</p>
          <p className="text-gray-600">{data.percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-sm text-gray-700">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  if (totalCost === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Cost Breakdown Chart
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            No cost data available to display
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Cost Breakdown Chart
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Visual breakdown of your project costs by category
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Pie Chart */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Cost Summary Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {chartData.map((item, index) => (
              <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                <div 
                  className="w-4 h-4 rounded-full mx-auto mb-2" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <div className="font-semibold text-sm">{item.name}</div>
                <div className="text-lg font-bold text-gray-900">{formatCurrency(item.value)}</div>
                <div className="text-sm text-gray-600">{item.percentage}%</div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t pt-4">
            <div className="text-center">
              <div className="text-sm text-gray-600">Total Project Cost</div>
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalCost)}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
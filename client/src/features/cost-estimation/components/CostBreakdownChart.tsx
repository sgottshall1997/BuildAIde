import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, PieChart as PieChartIcon } from "lucide-react";
import type { CostBreakdown } from '../types';

interface CostBreakdownChartProps {
  projectType: string;
  area: number;
  materialQuality: string;
  estimatedCost: number;
}

export function CostBreakdownChart({ projectType, area, materialQuality, estimatedCost }: CostBreakdownChartProps) {
  // Calculate detailed cost breakdown based on project parameters
  const calculateBreakdown = () => {
    const multipliers = {
      budget: 0.8,
      standard: 1.0,
      premium: 1.3,
      luxury: 1.6
    };

    const multiplier = multipliers[materialQuality?.toLowerCase() as keyof typeof multipliers] || 1.0;
    
    // Base percentages for residential construction
    const baseBreakdown = {
      materials: 0.35,
      labor: 0.30,
      permits: 0.05,
      equipment: 0.10,
      overhead: 0.12,
      profit: 0.08
    };

    // Adjust percentages based on material quality
    if (materialQuality === 'luxury') {
      baseBreakdown.materials += 0.10;
      baseBreakdown.labor += 0.05;
      baseBreakdown.overhead -= 0.05;
      baseBreakdown.profit -= 0.10;
    } else if (materialQuality === 'budget') {
      baseBreakdown.materials -= 0.05;
      baseBreakdown.labor -= 0.03;
      baseBreakdown.overhead += 0.03;
      baseBreakdown.profit += 0.05;
    }

    return Object.entries(baseBreakdown).map(([category, percentage]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      amount: Math.round(estimatedCost * percentage),
      percentage: Math.round(percentage * 100),
      color: getCategoryColor(category)
    }));
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      materials: '#3b82f6',
      labor: '#ef4444',
      permits: '#f59e0b',
      equipment: '#10b981',
      overhead: '#8b5cf6',
      profit: '#06b6d4'
    };
    return colors[category as keyof typeof colors] || '#6b7280';
  };

  const breakdown = calculateBreakdown();

  // Prepare data for timeline breakdown
  const timelineData = [
    { phase: 'Planning & Permits', percentage: 15, amount: Math.round(estimatedCost * 0.15) },
    { phase: 'Foundation & Framing', percentage: 25, amount: Math.round(estimatedCost * 0.25) },
    { phase: 'Systems & Utilities', percentage: 20, amount: Math.round(estimatedCost * 0.20) },
    { phase: 'Interior & Finishes', percentage: 30, amount: Math.round(estimatedCost * 0.30) },
    { phase: 'Final & Cleanup', percentage: 10, amount: Math.round(estimatedCost * 0.10) }
  ];

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
          <TrendingUp className="h-5 w-5" />
          Interactive Cost Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="categories">By Category</TabsTrigger>
            <TabsTrigger value="timeline">By Phase</TabsTrigger>
          </TabsList>
          
          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="h-80">
                <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <PieChartIcon className="h-4 w-4" />
                  Cost Distribution
                </h4>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={breakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, percentage }) => `${category}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {breakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Detailed Breakdown Table */}
              <div className="space-y-3">
                <h4 className="text-lg font-medium">Detailed Breakdown</h4>
                <div className="space-y-2">
                  {breakdown.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-medium">{item.category}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(item.amount)}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{item.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <div className="h-80">
              <h4 className="text-lg font-medium mb-4">Cost by Construction Phase</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="phase" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value as number), 'Cost']}
                    labelFormatter={(label) => `Phase: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="amount" fill="#3b82f6" name="Cost" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Timeline Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {timelineData.map((phase, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h5 className="font-medium text-sm mb-2">{phase.phase}</h5>
                  <div className="text-xl font-semibold text-primary">{formatCurrency(phase.amount)}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{phase.percentage}% of total</div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
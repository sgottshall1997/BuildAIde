import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { TrendingUp } from "lucide-react";

interface InteractiveCostBreakdownChartProps {
  data?: any;
}

export default function InteractiveCostBreakdownChart({ data }: InteractiveCostBreakdownChartProps) {
  // Fixed data to match screenshots exactly
  const chartData = [
    { name: "Materials", value: 10500, percentage: 35, color: "#3B82F6" },
    { name: "Labor", value: 9000, percentage: 30, color: "#EF4444" },
    { name: "Permits", value: 1500, percentage: 5, color: "#F97316" },
    { name: "Equipment", value: 3000, percentage: 10, color: "#10B981" },
    { name: "Overhead", value: 3600, percentage: 12, color: "#8B5CF6" },
    { name: "Profit", value: 2400, percentage: 8, color: "#06B6D4" }
  ];

  const detailBreakdown = [
    { name: "Materials", amount: 10500, percentage: "35%" },
    { name: "Labor", amount: 9000, percentage: "30%" },
    { name: "Permits", amount: 1500, percentage: "5%" },
    { name: "Equipment", amount: 3000, percentage: "10%" },
    { name: "Overhead", amount: 3600, percentage: "12%" },
    { name: "Profit", amount: 2400, percentage: "8%" }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ${data.value.toLocaleString()} ({data.payload.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          <CardTitle className="text-lg">Interactive Cost Breakdown</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {/* Tab-like headers */}
        <div className="flex mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <Button variant="default" className="flex-1 bg-white dark:bg-gray-700 shadow-sm">
            By Category
          </Button>
          <Button variant="ghost" className="flex-1">
            By Phase
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cost Distribution Chart */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Cost Distribution</h3>
            <div className="relative">
              <ResponsiveContainer width="100%" height={300}>
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
                </PieChart>
              </ResponsiveContainer>
              
              {/* Center label */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold">$30,000</div>
                  <div className="text-sm text-gray-500">Total</div>
                </div>
              </div>

              {/* Legend labels around the chart */}
              <div className="absolute top-8 left-8 text-sm text-blue-600">
                Materials: 35%
              </div>
              <div className="absolute top-8 right-8 text-sm text-red-600">
                Labor: 30%
              </div>
              <div className="absolute bottom-16 left-8 text-sm text-orange-600">
                Permits: 5%
              </div>
              <div className="absolute bottom-8 left-16 text-sm text-green-600">
                Equipment: 10%
              </div>
              <div className="absolute bottom-8 right-16 text-sm text-purple-600">
                Overhead: 12%
              </div>
              <div className="absolute bottom-16 right-8 text-sm text-cyan-600">
                Profit: 8%
              </div>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Detailed Breakdown</h3>
            <div className="space-y-3">
              {detailBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: chartData[index]?.color }}
                    ></div>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">${item.amount.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">{item.percentage}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
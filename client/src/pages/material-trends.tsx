import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, BarChart3, Calendar, DollarSign } from "lucide-react";

interface MaterialPrice {
  id: string;
  name: string;
  category: string;
  currentPrice: number;
  previousPrice: number;
  unit: string;
  source: string;
  lastUpdated: string;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
}

interface PriceHistory {
  date: string;
  price: number;
  movingAverage?: number;
}

export default function MaterialTrends() {
  const [selectedMaterial, setSelectedMaterial] = useState("lumber-2x4");
  const [showMovingAverage, setShowMovingAverage] = useState(true);

  const { data: materialPrices, isLoading } = useQuery({
    queryKey: ["/api/material-prices"],
  });

  // Generate price history data (simulated for demo)
  const generatePriceHistory = (material: MaterialPrice): PriceHistory[] => {
    const history: PriceHistory[] = [];
    const days = 30;
    const basePrice = material.previousPrice;
    const finalPrice = material.currentPrice;
    const dailyChange = (finalPrice - basePrice) / days;
    
    for (let i = 0; i <= days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      
      // Add some realistic price volatility
      const volatility = Math.random() * 0.1 - 0.05; // ±5% daily volatility
      const trendPrice = basePrice + (dailyChange * i);
      const actualPrice = trendPrice * (1 + volatility);
      
      history.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: Math.max(0, Number(actualPrice.toFixed(2))),
      });
    }

    // Calculate 7-day moving average
    if (showMovingAverage) {
      history.forEach((point, index) => {
        if (index >= 6) {
          const sum = history.slice(index - 6, index + 1).reduce((acc, p) => acc + p.price, 0);
          point.movingAverage = Number((sum / 7).toFixed(2));
        }
      });
    }

    return history;
  };

  const selectedMaterialData = materialPrices?.find((m: MaterialPrice) => m.id === selectedMaterial);
  const chartData = selectedMaterialData ? generatePriceHistory(selectedMaterialData) : [];

  const categories = materialPrices ? 
    [...new Set(materialPrices.map((m: MaterialPrice) => m.category))] : [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center justify-center gap-3">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          Material Price Trends
        </h1>
        <p className="text-slate-600">
          Track pricing changes for key construction materials over time
        </p>
      </div>

      {/* Material Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Select Material to Analyze
          </CardTitle>
          <CardDescription>
            Choose a construction material to view its 30-day price trend
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Material</label>
              <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                <SelectTrigger>
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
                <SelectContent>
                  {materialPrices?.map((material: MaterialPrice) => (
                    <SelectItem key={material.id} value={material.id}>
                      {material.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedMaterialData && (
              <>
                <div>
                  <label className="text-sm font-medium mb-2 block">Current Price</label>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-lg font-bold text-slate-900">
                      ${selectedMaterialData.currentPrice}
                    </span>
                    <span className="text-sm text-slate-600 ml-1">
                      per {selectedMaterialData.unit}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">30-Day Change</label>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className={`text-lg font-bold ${
                      selectedMaterialData.changePercent > 0 ? 'text-red-600' : 
                      selectedMaterialData.changePercent < 0 ? 'text-green-600' : 'text-slate-600'
                    }`}>
                      {selectedMaterialData.changePercent > 0 ? '+' : ''}
                      {selectedMaterialData.changePercent}%
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Price Chart */}
      {selectedMaterialData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              30-Day Price History: {selectedMaterialData.name}
            </CardTitle>
            <CardDescription>
              Daily pricing data with optional 7-day moving average
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    domain={['dataMin - 1', 'dataMax + 1']}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    formatter={(value, name) => [`$${value}`, name === 'price' ? 'Price' : '7-Day Average']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                    name="Price"
                    dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  {showMovingAverage && (
                    <Line 
                      type="monotone" 
                      dataKey="movingAverage" 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="7-Day Average"
                      dot={false}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <span>Source: {selectedMaterialData.source}</span>
                <span>•</span>
                <span>Updated: {new Date(selectedMaterialData.lastUpdated).toLocaleDateString()}</span>
              </div>
              
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showMovingAverage}
                  onChange={(e) => setShowMovingAverage(e.target.checked)}
                  className="rounded"
                />
                Show 7-day moving average
              </label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-blue-600" />
            Price Changes by Category
          </CardTitle>
          <CardDescription>
            Overview of price movements across material categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category) => {
              const categoryMaterials = materialPrices?.filter((m: MaterialPrice) => m.category === category) || [];
              const avgChange = categoryMaterials.length > 0 
                ? (categoryMaterials.reduce((sum: number, m: MaterialPrice) => sum + m.changePercent, 0) / categoryMaterials.length).toFixed(1)
                : '0.0';
              
              return (
                <div key={category} className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-medium text-slate-900 capitalize mb-1">{category}</h4>
                  <p className="text-sm text-slate-600 mb-2">
                    {categoryMaterials.length} materials
                  </p>
                  <p className={`text-lg font-bold ${
                    Number(avgChange) > 0 ? 'text-red-600' : 
                    Number(avgChange) < 0 ? 'text-green-600' : 'text-slate-600'
                  }`}>
                    {Number(avgChange) > 0 ? '+' : ''}{avgChange}%
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading material data...</p>
        </div>
      )}
    </div>
  );
}
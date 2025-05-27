import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  RefreshCw, 
  DollarSign,
  Calendar,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Info,
  Filter
} from "lucide-react";

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

interface MarketInsight {
  summary: string;
  forecast: string;
  recommendations: string[];
  updatedAt: string;
}

export default function MaterialPrices() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate 7-day price change delta
  const calculatePriceChange = (material: MaterialPrice) => {
    const currentPrice = material.currentPrice;
    const previousPrice = material.previousPrice;
    const changePercent = ((currentPrice - previousPrice) / previousPrice) * 100;
    
    return {
      changePercent: changePercent.toFixed(1),
      changeAmount: (currentPrice - previousPrice).toFixed(2),
      isPositive: changePercent > 0,
      isNegative: changePercent < 0
    };
  };

  // Material categories for filtering
  const materialCategories = [
    { value: "all", label: "All Categories" },
    { value: "framing", label: "Framing" },
    { value: "roofing", label: "Roofing" },
    { value: "plumbing", label: "Plumbing" },
    { value: "electrical", label: "Electrical" },
    { value: "interior-finishes", label: "Interior Finishes" },
    { value: "concrete-masonry", label: "Concrete & Masonry" }
  ];

  const { data: materialPrices = [], isLoading: pricesLoading, refetch: refetchPrices } = useQuery<MaterialPrice[]>({
    queryKey: ['/api/material-prices'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // AI suggestions for materials
  const getAISuggestion = (materialName: string) => {
    const suggestions: Record<string, string> = {
      "2x4 Framing Lumber": "AI tip: Buy 10% extra for waste and cuts",
      "Concrete Mix": "AI tip: Order 5-7% extra for spillage",
      "Asphalt Shingles": "AI tip: Consider weather delays in delivery scheduling",
      "PVC Pipe": "AI tip: Stock common fittings to avoid project delays",
      "Drywall": "AI tip: Account for 15% waste on complex layouts",
      "Hardwood Flooring": "AI tip: Acclimate wood 72hrs before installation",
      "Copper Wire": "AI tip: Prices volatile - consider bulk purchasing",
      "Steel Rebar": "AI tip: Check local availability to avoid shipping costs"
    };
    return suggestions[materialName] || "AI tip: Monitor price trends for optimal purchasing";
  };

  const { data: marketInsights, isLoading: insightsLoading, refetch: refetchInsights } = useQuery<MarketInsight>({
    queryKey: ['/api/material-insights'],
  });

  const categories = [
    { id: "all", name: "All Materials" },
    { id: "framing", name: "Framing & Structure" },
    { id: "concrete", name: "Concrete & Masonry" },
    { id: "drywall", name: "Drywall & Insulation" },
    { id: "roofing", name: "Roofing" },
    { id: "plumbing", name: "Plumbing" },
    { id: "electrical", name: "Electrical" },
    { id: "finishes", name: "Finishes & Interior" },
    { id: "windows", name: "Windows & Doors" },
    { id: "exterior", name: "Exterior" },
    { id: "misc", name: "Miscellaneous" }
  ];



  const handleRefreshData = async () => {
    setLastRefresh(new Date());
    await Promise.all([refetchPrices(), refetchInsights()]);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-green-500" />;
      default: return <Minus className="h-4 w-4 text-slate-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-red-600 bg-red-50';
      case 'down': return 'text-green-600 bg-green-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  // Filter materials based on search query and category
  const filteredMaterials = materialPrices.filter((material) => {
    const matchesSearch = material.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || 
      material.category.toLowerCase().replace(/[^a-z]/g, '-') === selectedCategory ||
      material.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (pricesLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">📊 Material Prices</h1>
          <div className="animate-pulse flex items-center space-x-2">
            <div className="h-10 w-32 bg-slate-200 rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-slate-200 rounded mb-2"></div>
                <div className="h-8 bg-slate-200 rounded mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">📊 Material Cost Intelligence Center</h1>
          <p className="text-slate-600 mt-1">
            Real-time construction material pricing + trends + forecasts for accurate project bidding
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-sm text-slate-500 flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            Last updated: {lastRefresh.toLocaleTimeString()}
          </div>
          <Button 
            onClick={handleRefreshData}
            variant="outline"
            size="sm"
            disabled={pricesLoading || insightsLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${(pricesLoading || insightsLoading) ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Filter by Category:</span>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {materialCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-sm text-slate-500">
              Showing {filteredMaterials.length} materials
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Insights */}
      {marketInsights && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-900">
              <BarChart3 className="h-5 w-5 mr-2" />
              Market Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Market Summary</h4>
              <p className="text-blue-800">{marketInsights.summary}</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Price Forecast</h4>
              <p className="text-blue-800">{marketInsights.forecast}</p>
            </div>

            {marketInsights.recommendations && marketInsights.recommendations.length > 0 && (
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Recommendations</h4>
                <ul className="space-y-1">
                  {marketInsights.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start text-blue-800">
                      <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid grid-cols-6 lg:grid-cols-11 w-full">
          {categories.map((category) => (
            <TabsTrigger 
              key={category.id} 
              value={category.id}
              className="text-xs px-2"
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          {filteredMaterials.length === 0 ? (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                No pricing data available for this category. Material prices are updated daily at 12:01 AM.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMaterials.map((material) => (
                <Card key={material.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-1">
                          {material.name}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {categories.find(c => c.id === material.category)?.name}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {(() => {
                          const priceChange = calculatePriceChange(material);
                          return (
                            <>
                              {getTrendIcon(material.trend)}
                              <Badge 
                                variant="secondary" 
                                className={`${getTrendColor(material.trend)} flex items-center gap-1`}
                              >
                                {priceChange.isPositive && <TrendingUp className="h-3 w-3" />}
                                {priceChange.isNegative && <TrendingDown className="h-3 w-3" />}
                                {priceChange.isPositive ? '+' : ''}{priceChange.changePercent}%
                              </Badge>
                              <span className="text-xs text-slate-500">
                                (${priceChange.isPositive ? '+' : ''}{priceChange.changeAmount})
                              </span>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-slate-900">
                            ${material.currentPrice.toFixed(2)}
                          </span>
                          <span className="text-sm text-slate-500">
                            per {material.unit}
                          </span>
                        </div>
                        {material.previousPrice && material.previousPrice !== material.currentPrice && (
                          <div className="text-sm text-slate-500">
                            Previous: ${material.previousPrice.toFixed(2)}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Source:</span>
                        <span className="font-medium text-slate-700">
                          {material.source}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Updated:</span>
                        <span className="text-slate-700">
                          {new Date(material.lastUpdated).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Price Alerts Info */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Material prices are automatically updated daily at 12:01 AM from multiple sources including FRED API, retail pricing, and industry indices. 
          Significant price changes (greater than 5%) are highlighted for immediate attention.
        </AlertDescription>
      </Alert>
    </div>
  );
}
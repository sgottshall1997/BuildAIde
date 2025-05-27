import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Truck, Hammer, Wrench, Brain, CheckCircle, Clock, AlertTriangle, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface MarketInsight {
  id: string;
  title: string;
  subtitle: string;
  value: string;
  description: string;
  icon: any;
  color: string;
  borderColor: string;
  bgColor: string;
  status: 'good' | 'warning' | 'alert';
  statusText: string;
  statusIcon: any;
  lastUpdated: string;
}

interface AIOpinion {
  topic: string;
  analysis: string;
  implications: string[];
  recommendations: string[];
  marketContext: string;
  loadTime: number;
}

export default function ProMarketInsights() {
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  const [aiOpinions, setAiOpinions] = useState<Record<string, AIOpinion>>({});
  const queryClient = useQueryClient();

  interface MarketInsightsResponse {
    marketInsights: MarketInsight[];
    lastUpdated: string;
    source: string;
  }

  // Fetch dynamic market insights
  const { data: insights, isLoading } = useQuery<MarketInsightsResponse>({
    queryKey: ["/api/pro-insights"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // AI Opinion mutation
  const aiOpinionMutation = useMutation({
    mutationFn: async ({ topic, insightData }: { topic: string; insightData: MarketInsight }) => {
      const startTime = Date.now();
      const response = await fetch('/api/ai-opinion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          topic,
          insightData: {
            title: insightData.title,
            value: insightData.value,
            description: insightData.description,
            status: insightData.status,
            statusText: insightData.statusText
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const loadTime = Date.now() - startTime;
      return { ...data, loadTime };
    },
    onSuccess: (data, variables) => {
      setAiOpinions(prev => ({
        ...prev,
        [variables.topic]: data as AIOpinion
      }));
    }
  });

  const handleGetAIOpinion = (insight: MarketInsight) => {
    if (aiOpinions[insight.id]) {
      // Toggle if already exists
      setExpandedInsight(expandedInsight === insight.id ? null : insight.id);
    } else {
      // Fetch new AI opinion
      aiOpinionMutation.mutate({ topic: insight.id, insightData: insight });
      setExpandedInsight(insight.id);
    }
  };

  const defaultInsights: MarketInsight[] = [
    {
      id: 'permit-processing',
      title: 'Permit Processing',
      subtitle: 'Avg approval time',
      value: '10-14 days',
      description: 'Varies by county',
      icon: FileText,
      color: 'blue',
      borderColor: 'border-blue-200 hover:border-blue-400',
      bgColor: 'bg-blue-50',
      status: 'warning',
      statusText: 'Peak season delays',
      statusIcon: AlertTriangle,
      lastUpdated: 'Updated 2 hours ago'
    },
    {
      id: 'material-delivery',
      title: 'Material Delivery',
      subtitle: 'Drywall lead time',
      value: '6 days avg',
      description: 'Standard delivery',
      icon: Truck,
      color: 'green',
      borderColor: 'border-green-200 hover:border-green-400',
      bgColor: 'bg-green-50',
      status: 'good',
      statusText: 'In stock locally',
      statusIcon: CheckCircle,
      lastUpdated: 'Updated 1 hour ago'
    },
    {
      id: 'labor-market',
      title: 'Labor Market',
      subtitle: 'Masonry crews',
      value: 'Low supply',
      description: 'In your region',
      icon: Hammer,
      color: 'orange',
      borderColor: 'border-orange-200 hover:border-orange-400',
      bgColor: 'bg-orange-50',
      status: 'alert',
      statusText: 'Book 2-3 weeks ahead',
      statusIcon: Clock,
      lastUpdated: 'Updated 30 minutes ago'
    },
    {
      id: 'equipment-rental',
      title: 'Equipment Rental',
      subtitle: 'Excavator availability',
      value: 'Good supply',
      description: 'Multiple options',
      icon: Wrench,
      color: 'purple',
      borderColor: 'border-purple-200 hover:border-purple-400',
      bgColor: 'bg-purple-50',
      status: 'good',
      statusText: 'Same-day available',
      statusIcon: CheckCircle,
      lastUpdated: 'Updated 15 minutes ago'
    }
  ];

  const marketInsights = insights?.marketInsights || defaultInsights;

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'alert': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
          Pro Market Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-white/50 backdrop-blur-sm border-2 border-gray-200">
              <CardHeader className="pb-3">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 text-center flex-1">
          Pro Market Insights
        </h2>
        {insights?.lastUpdated && (
          <p className="text-sm text-slate-500">
            Last refresh: {new Date(insights.lastUpdated).toLocaleTimeString()}
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {marketInsights.map((insight) => {
          const Icon = insight.icon;
          const StatusIcon = insight.statusIcon;
          const isExpanded = expandedInsight === insight.id;
          const aiOpinion = aiOpinions[insight.id];
          const isLoadingAI = aiOpinionMutation.isPending && aiOpinionMutation.variables?.topic === insight.id;

          return (
            <Card key={insight.id} className={`bg-white/50 backdrop-blur-sm border-2 ${insight.borderColor} transition-all duration-300`}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${insight.bgColor} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${insight.color}-600`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-slate-900">{insight.title}</CardTitle>
                    <p className="text-sm text-slate-600">{insight.subtitle}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-2xl font-bold text-blue-600">{insight.value}</div>
                  <p className="text-sm text-slate-600">{insight.description}</p>
                  <Badge className={`${getStatusBadgeColor(insight.status)} text-xs`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {insight.statusText}
                  </Badge>
                  
                  {/* AI Opinion Button */}
                  <Button
                    onClick={() => handleGetAIOpinion(insight)}
                    variant="outline"
                    size="sm"
                    className="w-full mt-3 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 hover:from-purple-100 hover:to-blue-100 text-purple-700 hover:text-purple-800"
                    disabled={isLoadingAI}
                  >
                    {isLoadingAI ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        AI Analyzing...
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 mr-2" />
                        Get Detailed AI Opinion
                        {aiOpinion && (
                          <span className="ml-2">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </span>
                        )}
                      </>
                    )}
                  </Button>

                  {/* AI Opinion Expansion */}
                  {aiOpinion && isExpanded && (
                    <div className="mt-4 p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-purple-900 mb-2">AI Market Analysis</h4>
                          <p className="text-sm text-slate-700">{aiOpinion.analysis}</p>
                        </div>
                        
                        {aiOpinion.implications && aiOpinion.implications.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-purple-900 mb-2">Key Implications</h4>
                            <ul className="text-sm text-slate-700 space-y-1">
                              {aiOpinion.implications.map((implication, idx) => (
                                <li key={idx} className="flex items-start">
                                  <span className="text-purple-600 mr-2">•</span>
                                  {implication}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {aiOpinion.recommendations && aiOpinion.recommendations.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-purple-900 mb-2">Recommendations</h4>
                            <ul className="text-sm text-slate-700 space-y-1">
                              {aiOpinion.recommendations.map((rec, idx) => (
                                <li key={idx} className="flex items-start">
                                  <span className="text-blue-600 mr-2">→</span>
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div className="pt-2 border-t border-purple-200">
                          <p className="text-xs text-slate-500">
                            AI analysis completed in {aiOpinion.loadTime}ms • Generated by GPT-4o
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-xs text-slate-400 mt-2">{insight.lastUpdated}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
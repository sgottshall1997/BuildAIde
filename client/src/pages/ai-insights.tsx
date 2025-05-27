import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle, 
  Clock,
  Home,
  MessageSquare,
  Calendar,
  DollarSign,
  FileText,
  Target,
  Sparkles,
  RefreshCw,
  Eye
} from "lucide-react";
import { useLocation } from "wouter";
import FeedbackButton from "@/components/feedback-button";

interface FlipInsight {
  id: string;
  propertyAddress: string;
  roiPercentage: number;
  estimatedProfit: number;
  status: 'excellent' | 'good' | 'caution' | 'warning';
  analyzedAt: string;
  keyPoints: string[];
}

interface ScheduleInsight {
  id: string;
  projectName: string;
  issueType: 'delay' | 'optimization' | 'conflict';
  description: string;
  impact: string;
  suggestion: string;
  detectedAt: string;
}

interface ChatInsight {
  id: string;
  question: string;
  category: 'flip' | 'permits' | 'materials' | 'scheduling' | 'general';
  frequency: number;
  lastAsked: string;
}

interface TrendInsight {
  id: string;
  type: 'permit' | 'pricing' | 'market';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  trend: 'up' | 'down' | 'stable';
  updatedAt: string;
}

export default function AIInsights() {
  const [location] = useLocation();
  const isConsumerMode = sessionStorage.getItem('userMode') === 'consumer' || location.includes('consumer');
  
  const [flipInsights, setFlipInsights] = useState<FlipInsight[]>([]);
  const [scheduleInsights, setScheduleInsights] = useState<ScheduleInsight[]>([]);
  const [chatInsights, setChatInsights] = useState<ChatInsight[]>([]);
  const [trendInsights, setTrendInsights] = useState<TrendInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Mock data for demo (in production, this would come from API calls)
  const mockFlipInsights: FlipInsight[] = [
    {
      id: '1',
      propertyAddress: '123 Oak Street, Chicago, IL',
      roiPercentage: 34.5,
      estimatedProfit: 85000,
      status: 'excellent',
      analyzedAt: '2024-01-27T10:30:00Z',
      keyPoints: ['Below market purchase price', 'Strong ARV potential', 'Minimal permit requirements']
    },
    {
      id: '2',
      propertyAddress: '456 Maple Avenue, Evanston, IL',
      roiPercentage: 12.3,
      estimatedProfit: 22000,
      status: 'caution',
      analyzedAt: '2024-01-26T15:45:00Z',
      keyPoints: ['Low margin deal', 'Extended holding costs', 'Competitive market']
    }
  ];

  const mockScheduleInsights: ScheduleInsight[] = [
    {
      id: '1',
      projectName: 'Kitchen Remodel - Lincoln Park',
      issueType: 'delay',
      description: 'Electrical inspection delayed due to permit backlog',
      impact: '3-day project delay, $450 additional holding costs',
      suggestion: 'Consider expedited permit service for future projects',
      detectedAt: '2024-01-27T09:15:00Z'
    },
    {
      id: '2',
      projectName: 'Bathroom Renovation - Wicker Park',
      issueType: 'optimization',
      description: 'AI detected scheduling conflict between plumbing and flooring',
      impact: 'Potential 2-day delay avoided',
      suggestion: 'Reschedule flooring installation after plumbing inspection',
      detectedAt: '2024-01-26T14:20:00Z'
    }
  ];

  const mockChatInsights: ChatInsight[] = [
    {
      id: '1',
      question: 'What permits do I need for kitchen renovation?',
      category: 'permits',
      frequency: 23,
      lastAsked: '2024-01-27T11:30:00Z'
    },
    {
      id: '2',
      question: 'Best ROI renovation projects under $15K?',
      category: 'flip',
      frequency: 18,
      lastAsked: '2024-01-27T10:15:00Z'
    },
    {
      id: '3',
      question: 'Current lumber pricing trends?',
      category: 'materials',
      frequency: 15,
      lastAsked: '2024-01-26T16:45:00Z'
    }
  ];

  const mockTrendInsights: TrendInsight[] = [
    {
      id: '1',
      type: 'pricing',
      title: 'Lumber Prices Rising',
      description: 'Lumber costs up 8% this month, affecting renovation budgets',
      severity: 'medium',
      trend: 'up',
      updatedAt: '2024-01-27T08:00:00Z'
    },
    {
      id: '2',
      type: 'permit',
      title: 'Electrical Permit Delays',
      description: 'Chicago electrical permits taking 15+ days vs normal 7-10 days',
      severity: 'high',
      trend: 'up',
      updatedAt: '2024-01-26T12:00:00Z'
    }
  ];

  useEffect(() => {
    // Simulate loading insights
    setIsLoading(true);
    setTimeout(() => {
      setFlipInsights(mockFlipInsights);
      setScheduleInsights(mockScheduleInsights);
      setChatInsights(mockChatInsights);
      setTrendInsights(mockTrendInsights);
      setLastUpdated(new Date().toLocaleString());
      setIsLoading(false);
    }, 1500);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return '🔥';
      case 'good': return '✅';
      case 'caution': return '⚠️';
      case 'warning': return '❌';
      default: return '📊';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'caution': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'warning': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-red-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-green-600" />;
      default: return <Target className="w-4 h-4 text-blue-600" />;
    }
  };

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'flip': return '🏠';
      case 'permits': return '📋';
      case 'materials': return '🔨';
      case 'scheduling': return '📅';
      default: return '💬';
    }
  };

  const refreshInsights = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLastUpdated(new Date().toLocaleString());
      setIsLoading(false);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <h2 className="text-xl font-semibold text-slate-700">Analyzing AI Insights...</h2>
          <p className="text-slate-500">Gathering intelligence from across your projects</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            🧠 AI Insights Dashboard
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Your centralized intelligence hub - tracking patterns, opportunities, and optimizations across all your {isConsumerMode ? 'renovation projects' : 'construction business'}
          </p>
          
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Clock className="w-4 h-4" />
              Last updated: {lastUpdated}
            </div>
            <Button onClick={refreshInsights} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-4 text-center">
              <Home className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-800">{flipInsights.length}</div>
              <div className="text-sm text-green-600">Property Analyses</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-800">{scheduleInsights.length}</div>
              <div className="text-sm text-blue-600">Schedule Insights</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
            <CardContent className="p-4 text-center">
              <MessageSquare className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-800">{chatInsights.reduce((sum, insight) => sum + insight.frequency, 0)}</div>
              <div className="text-sm text-purple-600">AI Questions</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
            <CardContent className="p-4 text-center">
              <AlertTriangle className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-800">{trendInsights.filter(t => t.severity === 'high').length}</div>
              <div className="text-sm text-orange-600">High Priority Alerts</div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Insights */}
        <Tabs defaultValue="properties" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="properties">🏠 Properties</TabsTrigger>
            <TabsTrigger value="schedule">📅 Schedule</TabsTrigger>
            <TabsTrigger value="chat">💬 Chat Trends</TabsTrigger>
            <TabsTrigger value="alerts">⚠️ Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-green-600" />
                  Recent Property Analyses
                </CardTitle>
                <CardDescription>
                  AI-powered flip analysis results and ROI insights
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {flipInsights.map((insight) => (
                  <div key={insight.id} className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-1">{insight.propertyAddress}</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <span>ROI: {insight.roiPercentage.toFixed(1)}%</span>
                          <span>Profit: ${insight.estimatedProfit.toLocaleString()}</span>
                          <span>{new Date(insight.analyzedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(insight.status)} border`}>
                        {getStatusIcon(insight.status)} {insight.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      {insight.keyPoints.map((point, index) => (
                        <div key={index} className="text-sm text-slate-600 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                          {point}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Schedule Intelligence
                </CardTitle>
                <CardDescription>
                  AI-detected delays, optimizations, and conflicts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {scheduleInsights.map((insight) => (
                  <div key={insight.id} className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-1">{insight.projectName}</h3>
                        <div className="text-sm text-slate-600 mb-2">{insight.description}</div>
                      </div>
                      <Badge variant="outline" className={
                        insight.issueType === 'delay' ? 'border-red-200 text-red-700' :
                        insight.issueType === 'optimization' ? 'border-green-200 text-green-700' :
                        'border-yellow-200 text-yellow-700'
                      }>
                        {insight.issueType === 'delay' ? '⏰' : insight.issueType === 'optimization' ? '⚡' : '⚠️'} 
                        {insight.issueType.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div><strong>Impact:</strong> {insight.impact}</div>
                      <div><strong>AI Suggestion:</strong> {insight.suggestion}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                  Top AI Chat Questions
                </CardTitle>
                <CardDescription>
                  Most frequently asked questions and trending topics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {chatInsights.map((insight) => (
                  <div key={insight.id} className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{getCategoryEmoji(insight.category)}</span>
                          <h3 className="font-semibold text-slate-900">{insight.question}</h3>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <span>Asked {insight.frequency} times</span>
                          <span>Last: {new Date(insight.lastAsked).toLocaleDateString()}</span>
                          <Badge variant="secondary" className="text-xs">
                            {insight.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  Market & Permit Alerts
                </CardTitle>
                <CardDescription>
                  Important trends and warnings affecting your projects
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {trendInsights.map((insight) => (
                  <div key={insight.id} className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getTrendIcon(insight.trend)}
                          <h3 className="font-semibold text-slate-900">{insight.title}</h3>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{insight.description}</p>
                        <div className="text-xs text-slate-500">
                          Updated: {new Date(insight.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge className={
                        insight.severity === 'high' ? 'bg-red-100 text-red-800 border-red-200' :
                        insight.severity === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                        'bg-blue-100 text-blue-800 border-blue-200'
                      }>
                        {insight.severity === 'high' ? '🚨' : insight.severity === 'medium' ? '⚠️' : '📢'} 
                        {insight.severity.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* AI Beta Disclaimer */}
        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-700 italic text-center">
            ⚡ AI Insights are in beta. Data is analyzed from your project interactions and may vary in accuracy.
          </p>
        </div>

        {/* Feedback Button */}
        <FeedbackButton toolName="AI Insights Dashboard" />
      </div>
    </div>
  );
}
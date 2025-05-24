import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Loader2, Sparkles, RefreshCw } from "lucide-react";

export default function AIAssistant() {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: recommendations, isLoading: loadingRecommendations, refetch: refetchRecommendations } = useQuery({
    queryKey: ["/api/ai-recommendations"],
    enabled: isExpanded,
  });

  const { data: scheduleSummary, isLoading: loadingSummary, refetch: refetchSummary } = useQuery({
    queryKey: ["/api/summarize-schedule"],
    enabled: isExpanded,
  });

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleRefresh = () => {
    refetchRecommendations();
    refetchSummary();
  };

  if (!isExpanded) {
    return (
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-4">
          <Button 
            onClick={handleToggle}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Brain className="h-4 w-4 mr-2" />
            AI Assistant - What should I prioritize today?
            <Sparkles className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">AI Project Assistant</h3>
              <p className="text-sm text-slate-600">Intelligent insights for your construction projects</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={loadingRecommendations || loadingSummary}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleToggle}>
              Minimize
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {/* Priority Recommendations */}
          <div>
            <div className="flex items-center mb-2">
              <Badge variant="default" className="bg-blue-100 text-blue-800">
                Daily Priorities
              </Badge>
            </div>
            {loadingRecommendations ? (
              <div className="flex items-center text-slate-600">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Analyzing your projects...
              </div>
            ) : (
              <p className="text-slate-700 leading-relaxed">
                {recommendations?.recommendations || "No recommendations available."}
              </p>
            )}
          </div>

          {/* Schedule Summary */}
          <div>
            <div className="flex items-center mb-2">
              <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                Schedule Overview
              </Badge>
            </div>
            {loadingSummary ? (
              <div className="flex items-center text-slate-600">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Reviewing your schedule...
              </div>
            ) : (
              <p className="text-slate-700 leading-relaxed">
                {scheduleSummary?.summary || "No schedule summary available."}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-blue-200">
          <p className="text-xs text-slate-500 text-center">
            AI insights powered by GPT-4 • Updated in real-time
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
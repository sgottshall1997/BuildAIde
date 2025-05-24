import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, Search, Brain, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BenchmarkData {
  source: string;
  range: string;
  url: string;
}

interface BenchmarkAnalysisProps {
  projectType: string;
  area: number;
  materialQuality: string;
  timeline: string;
  estimatedCost: number;
  zipCode?: string;
}

export default function BenchmarkAnalysis({ 
  projectType, 
  area, 
  materialQuality, 
  timeline, 
  estimatedCost,
  zipCode = "20814" // Default to Maryland area
}: BenchmarkAnalysisProps) {
  const { toast } = useToast();
  const [benchmarks, setBenchmarks] = useState<BenchmarkData[]>([]);
  const [analysis, setAnalysis] = useState<string>("");
  const [showAnalysis, setShowAnalysis] = useState(false);

  const getBenchmarksMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/get-benchmark-costs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectType,
          zipCode,
          squareFootage: area
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get benchmark data");
      }

      return response.json();
    },
    onSuccess: (data) => {
      setBenchmarks(data.benchmarks || []);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Unable to retrieve market benchmarks at this time.",
        variant: "destructive",
      });
    },
  });

  const getAnalysisMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/analyze-estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          internalEstimate: estimatedCost,
          benchmarks,
          projectDetails: {
            projectType,
            area,
            materialQuality,
            timeline
          }
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze estimate");
      }

      return response.json();
    },
    onSuccess: (data) => {
      setAnalysis(data.analysis || "");
      setShowAnalysis(true);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Unable to generate analysis at this time.",
        variant: "destructive",
      });
    },
  });

  const handleGetBenchmarks = () => {
    getBenchmarksMutation.mutate();
  };

  const handleGetAnalysis = () => {
    if (benchmarks.length > 0) {
      getAnalysisMutation.mutate();
    }
  };

  if (estimatedCost === 0) {
    return null;
  }

  return (
    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Smart Estimate Benchmarking</h3>
              <p className="text-sm text-slate-600">Compare with real market data</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            AI-Powered
          </Badge>
        </div>

        {benchmarks.length === 0 && (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-blue-600" />
            </div>
            <h4 className="text-lg font-semibold text-slate-900 mb-2">
              Market Benchmark Analysis
            </h4>
            <p className="text-slate-600 mb-6">
              Get real-time market data and AI insights to see how your estimate compares to industry standards.
            </p>
            <Button 
              onClick={handleGetBenchmarks}
              disabled={getBenchmarksMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {getBenchmarksMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Analyzing Market...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Get Market Benchmarks
                </>
              )}
            </Button>
          </div>
        )}

        {benchmarks.length > 0 && (
          <div className="space-y-4">
            {/* Benchmark Cost Ranges */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-blue-600" />
                Market Benchmark Ranges
              </h4>
              <div className="space-y-2">
                {benchmarks.map((benchmark, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div className="flex items-center">
                      <span className="font-medium text-slate-900">{benchmark.source}</span>
                      {benchmark.url !== '#' && (
                        <ExternalLink className="h-3 w-3 ml-2 text-slate-400" />
                      )}
                    </div>
                    <span className="text-slate-700 font-mono">{benchmark.range}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Our Estimate Comparison */}
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">Shall's Construction Estimate</span>
                <span className="text-xl font-bold text-blue-600">${estimatedCost.toLocaleString()}</span>
              </div>
            </div>

            {/* AI Analysis */}
            {!showAnalysis && (
              <div className="text-center py-4">
                <Button 
                  onClick={handleGetAnalysis}
                  disabled={getAnalysisMutation.isPending}
                  variant="outline"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  {getAnalysisMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Generating Analysis...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Get AI-Powered Analysis
                    </>
                  )}
                </Button>
              </div>
            )}

            {showAnalysis && analysis && (
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-2 flex items-center">
                  <Brain className="h-4 w-4 mr-2 text-indigo-600" />
                  AI-Powered Market Analysis
                </h4>
                <p className="text-slate-700 leading-relaxed">{analysis}</p>
                <div className="mt-3 text-xs text-slate-500">
                  Analysis powered by GPT-4 • Generated from real market data
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
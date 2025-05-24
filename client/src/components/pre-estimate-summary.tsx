import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Clock, Loader2 } from "lucide-react";

interface PreEstimateSummaryProps {
  formData: any;
  onComplete?: (summary: string) => void;
}

export default function PreEstimateSummary({ formData, onComplete }: PreEstimateSummaryProps) {
  const [summary, setSummary] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (formData && Object.keys(formData).length > 3) {
      generateSummary();
    }
  }, [formData]);

  const generateSummary = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/pre-estimate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const data = await response.json();
        setSummary(data.summary);
        onComplete?.(data.summary);
      }
    } catch (error) {
      console.error("Error generating pre-estimate summary:", error);
      setSummary("Based on your selections, your estimate is being calculated with current market conditions in mind.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!summary && !isLoading) {
    return null;
  }

  return (
    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 dark:border-blue-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Brain className="h-4 w-4 text-white" />
          </div>
          Pre-Estimate Analysis
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            AI Insight
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-3 p-4">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Analyzing your project specifications...
            </div>
          </div>
        ) : (
          <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-blue-200 dark:border-blue-700">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {summary}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Final estimate calculating...
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
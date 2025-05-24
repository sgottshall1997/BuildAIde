import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Loader2 } from "lucide-react";

interface SmartSuggestionsProps {
  formData: {
    projectType?: string;
    area?: number;
    materialQuality?: string;
    materials?: any[];
    laborWorkers?: number;
    laborHours?: number;
    laborRate?: number;
    tradeType?: string;
    timeline?: string;
    siteAccess?: string;
  };
}

export default function SmartSuggestions({ formData }: SmartSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const generateSuggestions = async () => {
      if (!formData.projectType || !formData.area) return;

      setIsLoading(true);
      try {
        const response = await fetch("/api/smart-suggestions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const data = await response.json();
          setSuggestions(data.suggestions || []);
        }
      } catch (error) {
        console.error("Error getting smart suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce suggestions generation
    const timeoutId = setTimeout(generateSuggestions, 1000);
    return () => clearTimeout(timeoutId);
  }, [formData]);

  if (!formData.projectType || !formData.area) return null;

  return (
    <Card className="mt-4 border-blue-200 bg-blue-50 dark:bg-blue-950">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {isLoading ? (
              <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
            ) : (
              <Lightbulb className="h-5 w-5 text-blue-600" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium text-blue-900 dark:text-blue-100">Smart Suggestions</h4>
              <Badge variant="secondary" className="text-xs">AI-Powered</Badge>
            </div>
            
            {isLoading ? (
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Analyzing your project details...
              </p>
            ) : suggestions.length > 0 ? (
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="text-sm text-blue-800 dark:text-blue-200 bg-white dark:bg-blue-900 p-3 rounded border border-blue-200 dark:border-blue-800">
                    💡 {suggestion}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Complete more project details to get personalized suggestions.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
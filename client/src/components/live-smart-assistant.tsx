import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Lightbulb, TrendingUp, AlertTriangle } from "lucide-react";

interface LiveSmartAssistantProps {
  formData: any;
  currentField?: string;
}

export default function LiveSmartAssistant({ formData, currentField }: LiveSmartAssistantProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Generate smart suggestions when form data changes
    if (formData && Object.keys(formData).length > 2) {
      generateSuggestions();
    }
  }, [formData, currentField]);

  const generateSuggestions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/smart-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions || []);
      }
    } catch (error) {
      console.error("Error generating suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Field-specific smart tips
  const getFieldSpecificTip = () => {
    if (!currentField) return null;

    const getProjectSpecificTip = (field: string) => {
      const projectType = formData.projectType;
      
      if (field === "materialQuality") {
        switch (projectType) {
          case "kitchen-remodel":
            return "Quartz costs ~$40–60/sq ft but installs faster than marble. Consider cabinet grade impact on timeline.";
          case "bathroom-remodel":
            return "Tile quality dramatically affects labor time. Premium tile requires skilled installers.";
          case "roofing-replacement":
            return "Material choice affects both cost and warranty length. Asphalt shingles vs metal roofing.";
          case "deck-patio-construction":
            return "Composite decking costs 2x more upfront but eliminates maintenance costs.";
          case "hvac-upgrade":
            return "Higher efficiency units cost more but qualify for tax credits and lower utilities.";
          case "custom-home-build":
            return "Material selections drive 40-60% of total cost. Lock in pricing early.";
          default:
            return "Premium materials increase resale value but require skilled labor.";
        }
      }
      
      if (field === "timeline") {
        switch (projectType) {
          case "kitchen-remodel":
            return "Kitchen remodels typically take 6-12 weeks. Permit delays add 2-4 weeks.";
          case "roofing-replacement":
            return "Weather windows are critical. Winter work adds 20-30% to labor costs.";
          case "custom-home-build":
            return "Custom homes average 6-12 months. Foundation and framing weather-dependent.";
          case "electrical-rewiring":
            return "Electrical permits require inspection scheduling. Plan 2-3 week lead times.";
          default:
            return formData.materialQuality === "luxury" 
              ? "Luxury finishes typically require 20-30% longer installation time."
              : "Tight timelines may require premium labor rates.";
        }
      }

      return null;
    };

    const tips: Record<string, string | null> = {
      materialQuality: getProjectSpecificTip("materialQuality") || "",
      laborWorkers: formData.area && formData.laborWorkers && formData.timeline
        ? `${formData.laborWorkers} workers at ${formData.laborHours || 160} hrs may not meet the ${formData.timeline} timeline for ${formData.area} sq ft.`
        : "Consider labor availability for your timeline.",
      timeline: getProjectSpecificTip("timeline") || "",
      siteAccess: formData.siteAccess === "limited"
        ? "Limited access adds 15-25% to labor costs due to material handling."
        : null,
    };

    return tips[currentField];
  };

  const fieldTip = getFieldSpecificTip();

  if (!suggestions.length && !fieldTip && !isLoading) {
    return null;
  }

  return (
    <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/30 dark:border-blue-800">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Brain className="h-4 w-4 text-white" />
          </div>
          
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                AI Assistant
              </Badge>
              {isLoading && (
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>

            {/* Field-specific tip */}
            {fieldTip && (
              <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-blue-200 dark:border-blue-700">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-700 dark:text-slate-300">{fieldTip}</p>
                </div>
              </div>
            )}

            {/* Smart suggestions */}
            {suggestions.length > 0 && (
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="flex items-start gap-2">
                      {suggestion.toLowerCase().includes('risk') || suggestion.toLowerCase().includes('consider') ? (
                        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      )}
                      <p className="text-sm text-slate-700 dark:text-slate-300">{suggestion}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
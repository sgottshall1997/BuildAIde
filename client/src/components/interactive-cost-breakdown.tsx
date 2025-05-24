import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Calculator, HelpCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface InteractiveCostBreakdownProps {
  costBreakdown: {
    [key: string]: {
      amount: number;
      percentage: number;
    };
  };
  projectType: string;
  estimatedCost: number;
}

export default function InteractiveCostBreakdown({ 
  costBreakdown, 
  projectType, 
  estimatedCost 
}: InteractiveCostBreakdownProps) {
  const [explanation, setExplanation] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const generateExplanation = async () => {
    setIsLoading(true);
    setLoadingMessage("Analyzing cost breakdown...");
    
    const startTime = Date.now();
    
    // Update loading message periodically
    const loadingInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      if (elapsed < 3) {
        setLoadingMessage("Analyzing cost breakdown...");
      } else if (elapsed < 6) {
        setLoadingMessage("Processing categories...");
      } else {
        setLoadingMessage("Almost ready...");
      }
    }, 1000);

    try {
      const response = await apiRequest("POST", "/api/generate-cost-explanation", {
        costBreakdown,
        projectType,
        estimatedCost
      });
      
      const responseData = await response.json();
      console.log("Cost explanation response:", responseData); // Debug log
      
      if (responseData && responseData.explanation) {
        setExplanation(responseData.explanation);
      } else {
        console.error("Invalid response format:", responseData);
        setExplanation("I'm having trouble generating the cost explanation right now. The analysis is complete, but the response format seems unusual. Please try clicking 'Regenerate Explanation' below.");
      }
      setHasGenerated(true);
    } catch (error) {
      console.error("Error generating cost explanation:", error);
      setExplanation("Unable to generate cost explanation at this time. Please try again.");
      setHasGenerated(true); // Show error state
    } finally {
      clearInterval(loadingInterval);
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  const askFollowUp = async (category: string) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/cost-category-detail", {
        category,
        projectType,
        amount: costBreakdown[category]?.amount || 0,
        percentage: costBreakdown[category]?.percentage || 0
      });
      
      const responseData = await response.json();
      console.log("Category detail response:", responseData); // Debug log
      
      if (responseData && responseData.explanation) {
        setExplanation(responseData.explanation);
      } else {
        console.error("Invalid category response format:", responseData);
        setExplanation(`I'm having trouble getting details for the ${category} category right now. Please try another category or regenerate the explanation.`);
      }
    } catch (error) {
      console.error("Error getting category details:", error);
      setExplanation(`Unable to get details for ${category} category. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-slate-200 bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-700">
          <Calculator className="h-5 w-5" />
          Interactive Cost Breakdown Assistant
        </CardTitle>
        <p className="text-slate-600 text-sm">
          Get intelligent insights on cost allocation and optimization opportunities
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasGenerated ? (
          <div className="text-center">
            <Button 
              onClick={generateExplanation}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {loadingMessage || "Analyzing Cost Breakdown..."}
                </>
              ) : (
                <>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Explain My Cost Breakdown
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Generated Explanation */}
            <div className="bg-white p-4 rounded-lg border">
              {explanation ? (
                <div 
                  className="prose prose-slate max-w-none text-sm"
                  dangerouslySetInnerHTML={{ 
                    __html: explanation.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\n/g, '<br/>')
                  }}
                />
              ) : (
                <div className="text-center text-gray-500 py-4">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Category Buttons */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">
                Click on any category for more details:
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.keys(costBreakdown).map((category) => (
                  <Button
                    key={category}
                    variant="outline"
                    size="sm"
                    onClick={() => askFollowUp(category)}
                    disabled={isLoading}
                    className="text-xs"
                  >
                    <HelpCircle className="h-3 w-3 mr-1" />
                    {category} Details
                  </Button>
                ))}
              </div>
            </div>

            {/* Regenerate Button */}
            <div className="flex gap-2 pt-2 border-t">
              <Button 
                variant="outline" 
                size="sm"
                onClick={generateExplanation}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Regenerate Explanation"}
              </Button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && hasGenerated && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-slate-600">Generating explanation...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import DetailedEstimatorForm from "@/components/detailed-estimator-form";
import CostBreakdownChart from "@/components/cost-breakdown-chart";
import AIRiskAssessment from "@/components/ai-risk-assessment";
import PastProjectsComparison from "@/components/past-projects-comparison";
import ExportFunctionality from "@/components/export-functionality";
import EmailDraftModal from "@/components/email-draft-modal";
import SpenceBotChat, { SpenceBotFloatingButton } from "@/components/spencebot-chat";
import AIVisualPreview from "@/components/ai-visual-preview";
import HiddenCostInsights from "@/components/hidden-cost-insights";
import PersonalizedClientAssistant from "@/components/personalized-client-assistant";
import AIClientEmailGenerator from "@/components/ai-client-email-generator";
import InteractiveCostBreakdown from "@/components/interactive-cost-breakdown";
import ConversationalEstimator from "@/components/conversational-estimator";

export default function Estimator() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [finalEstimate, setFinalEstimate] = useState<any>(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [lastCreatedEstimate, setLastCreatedEstimate] = useState<any>(null);
  const [spenceBotOpen, setSpenceBotOpen] = useState(false);

  const createEstimateMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/estimates", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/estimates"] });
      toast({
        title: "Success!",
        description: "Your estimate has been generated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to generate estimate. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    console.log("Form submitted with data:", data); // Debug log
    setFinalEstimate(data);
    setLastCreatedEstimate(data);
    createEstimateMutation.mutate(data);
    
    // Scroll to top smoothly when estimate is generated
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {!finalEstimate ? (
          <div className="space-y-6">
            {/* Conversational Estimator Assistant */}
            <ConversationalEstimator 
              onEstimateGenerated={(estimateData) => {
                // Auto-trigger estimate generation when AI parses user input
                if (estimateData && typeof estimateData === 'object') {
                  onSubmit(estimateData);
                }
              }}
              currentEstimate={finalEstimate}
            />
            
            <DetailedEstimatorForm 
              onSubmit={onSubmit}
              isLoading={createEstimateMutation.isPending}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Results Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Professional Estimate Generated</h1>
              <p className="text-slate-600">Complete project analysis with detailed breakdowns</p>
            </div>

            {/* Cost Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Project Cost Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Materials</p>
                    <p className="text-xl font-bold text-blue-600">${finalEstimate.materialCost?.toLocaleString() || '0'}</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Labor</p>
                    <p className="text-xl font-bold text-green-600">${finalEstimate.laborCost?.toLocaleString() || '0'}</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <p className="text-sm text-gray-600">Permits</p>
                    <p className="text-xl font-bold text-orange-600">${finalEstimate.permitCost?.toLocaleString() || '0'}</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-purple-600">${finalEstimate.estimatedCost?.toLocaleString() || '0'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interactive Cost Breakdown */}
            <CostBreakdownChart
              projectType={finalEstimate.projectType}
              area={finalEstimate.area}
              materialQuality={finalEstimate.materialQuality}
              estimatedCost={finalEstimate.estimatedCost}
            />

            {/* Interactive Cost Breakdown Assistant */}
            <InteractiveCostBreakdown
              costBreakdown={{
                "Materials": { 
                  amount: Math.round(finalEstimate.estimatedCost * 0.35), 
                  percentage: 35 
                },
                "Labor": { 
                  amount: Math.round(finalEstimate.estimatedCost * 0.30), 
                  percentage: 30 
                },
                "Permits": { 
                  amount: Math.round(finalEstimate.estimatedCost * 0.05), 
                  percentage: 5 
                },
                "Equipment": { 
                  amount: Math.round(finalEstimate.estimatedCost * 0.10), 
                  percentage: 10 
                },
                "Overhead": { 
                  amount: Math.round(finalEstimate.estimatedCost * 0.12), 
                  percentage: 12 
                },
                "Profit": { 
                  amount: Math.round(finalEstimate.estimatedCost * 0.08), 
                  percentage: 8 
                }
              }}
              projectType={finalEstimate.projectType}
              estimatedCost={finalEstimate.estimatedCost}
            />

            {/* AI Risk Assessment */}
            <AIRiskAssessment
              projectType={finalEstimate.projectType}
              area={finalEstimate.area}
              materialQuality={finalEstimate.materialQuality}
              timeline={finalEstimate.timeline}
              estimatedCost={finalEstimate.estimatedCost}
            />

            {/* Past Projects Comparison */}
            <PastProjectsComparison
              projectType={finalEstimate.projectType}
              squareFootage={finalEstimate.area}
              materialQuality={finalEstimate.materialQuality}
              estimatedCost={finalEstimate.estimatedCost}
            />

            {/* Export Options */}
            <ExportFunctionality
              data={finalEstimate}
              onEmailDraft={() => {
                setLastCreatedEstimate(finalEstimate);
                setEmailModalOpen(true);
              }}
            />



            {/* Actions */}
            <div className="flex gap-4 justify-center">
              <Button 
                variant="outline"
                onClick={() => setFinalEstimate(null)}
              >
                Create New Estimate
              </Button>
              <Button 
                onClick={() => setLocation("/")}
              >
                Return to Dashboard
              </Button>
            </div>
          </div>
        )}

        {/* Email Draft Modal */}
        <EmailDraftModal
          isOpen={emailModalOpen}
          onClose={() => setEmailModalOpen(false)}
          type="estimate"
          data={lastCreatedEstimate}
        />
      </div>
    </div>
  );
}
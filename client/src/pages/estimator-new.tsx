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
import ClientFeedback from "@/components/client-feedback";
import EmailDraftModal from "@/components/email-draft-modal";
import SpenceBotChat, { SpenceBotFloatingButton } from "@/components/spencebot-chat";
import AIVisualPreview from "@/components/ai-visual-preview";
import HiddenCostInsights from "@/components/hidden-cost-insights";
import PersonalizedClientAssistant from "@/components/personalized-client-assistant";
import AIClientEmailGenerator from "@/components/ai-client-email-generator";
import InteractiveCostBreakdown from "@/components/interactive-cost-breakdown";

import EnhancedBidPreview from "@/components/enhanced-bid-preview";
import DetailedCostBreakdown from "@/components/detailed-cost-breakdown";
import EnhancedEstimateDisplay from "@/components/enhanced-estimate-display";
import EnhancedEstimateForm from "@/components/enhanced-estimate-form";
import { MessageCircle, ArrowLeft, Download, Mail, MessageSquare, Calculator } from "lucide-react";

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
      const response = await apiRequest("POST", "/api/estimates", data);
      return await response.json();
    },
    onSuccess: (savedEstimate: any) => {
      // Debug log to see what we're getting from the backend
      console.log("Received estimate data:", savedEstimate);
      console.log("Material Cost:", savedEstimate.materialCost);
      console.log("Labor Cost:", savedEstimate.laborCost);
      console.log("Permit Cost:", savedEstimate.permitCost);
      console.log("Total Cost:", savedEstimate.estimatedCost);
      
      // Update the display with the calculated costs from the backend
      setFinalEstimate(savedEstimate);
      setLastCreatedEstimate(savedEstimate);
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
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 sm:mb-3 px-2">🧮 Professional Project Estimator</h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto px-4">
            Generate detailed project estimates with AI-powered cost analysis, comprehensive breakdowns, and intelligent recommendations.
          </p>
        </div>

        {!finalEstimate ? (
          <div className="space-y-6">
            {/* Enhanced AI Estimator */}
            <EnhancedEstimateForm />
            
            <DetailedEstimatorForm 
              onSubmit={onSubmit}
              isLoading={createEstimateMutation.isPending}
            />
          </div>
        ) : (
          <div className="space-y-6">

            {/* Detailed Cost Breakdown */}
            <DetailedCostBreakdown
              projectType={finalEstimate.projectType}
              materialCost={finalEstimate.materialCost || Math.round(finalEstimate.estimatedCost * 0.35)}
              laborCost={finalEstimate.laborCost || Math.round(finalEstimate.estimatedCost * 0.30)}
              permitCost={finalEstimate.permitCost || Math.round(finalEstimate.estimatedCost * 0.05)}
              totalCost={finalEstimate.estimatedCost}
              area={finalEstimate.area}
              materialQuality={finalEstimate.materialQuality}
              timeline={finalEstimate.timeline}
              laborWorkers={finalEstimate.laborWorkers}
              laborRate={finalEstimate.laborRate}
            />



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

            {/* AI-Enhanced Bid Preview */}
            <EnhancedBidPreview estimateData={finalEstimate} />

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

            {/* Client Feedback Section */}
            <div className="mt-8">
              <ClientFeedback 
                estimateData={lastCreatedEstimate}
                onFeedbackSubmitted={(feedback) => {
                  console.log('Feedback submitted:', feedback);
                }}
              />
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
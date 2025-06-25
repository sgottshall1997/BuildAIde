import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import DetailedEstimatorForm from "@/components/detailed-estimator-form";
import CostBreakdownChart from "@/components/cost-breakdown-chart";
import ExportFunctionality from "@/components/export-functionality";
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
import ProfessionalEstimatorResults from "@/components/professional-estimator-results";
import ContinueConversation from "@/components/continue-conversation";
import InteractiveCostBreakdownChart from "@/components/interactive-cost-breakdown-chart";
import { 
  InteractiveCostBreakdownAssistant,
  AIPoweredRiskAssessment,
  PastProjectsComparison as AIPastProjectsComparison,
  ProfessionalBidPreview as AIProfessionalBidPreview,
  ExportAndShare,
  ClientFeedback as AIClientFeedback
} from "@/components/ai-sections";
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
            {/* 1. Detailed Cost Breakdown */}
            <DetailedCostBreakdown 
              projectType="Interior waterproofing and block wall repairs"
              materialCost={5000}
              laborCost={2160}
              permitCost={500}
              totalCost={30000}
              area={200}
              materialQuality="Standard"
            />

            {/* 2. Continue the Conversation */}
            <ContinueConversation originalRequest="Interior waterproofing and block wall repairs with steel column installation" />

            {/* 3. Interactive Cost Breakdown */}
            <InteractiveCostBreakdownChart />

            {/* 4. Interactive Cost Breakdown Assistant */}
            <InteractiveCostBreakdownAssistant />

            {/* 5. AI-Powered Risk Assessment */}
            <AIPoweredRiskAssessment />

            {/* 6. Past Projects Comparison */}
            <AIPastProjectsComparison />

            {/* 7. Professional Bid Preview */}
            <AIProfessionalBidPreview />

            {/* 8. Export & Share */}
            <ExportAndShare />

            {/* 9. Client Feedback */}
            <AIClientFeedback />
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
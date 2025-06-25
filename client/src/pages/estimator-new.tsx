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

            {/* Continue the Conversation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Continue the Conversation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="text-sm font-medium text-blue-900 mb-2">Your Original Request:</p>
                  <p className="text-blue-800 italic">"{finalEstimate.description}"</p>
                </div>
                <p className="text-gray-600 mb-4">Have questions about your estimate? Ask Spence the Builder!</p>
                
                {/* Conversational Estimator Assistant */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-green-900 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Conversational Estimator Assistant
                    </h3>
                    <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">AI Powered</div>
                  </div>
                  <p className="text-sm text-green-800 mb-4">
                    Great! I see you have your estimate ready. Feel free to ask me any questions about your project costs, timeline, or materials. For example: 'Why are materials so expensive?' or 'How can I reduce labor costs?'
                  </p>
                  
                  <div className="mb-4">
                    <p className="text-sm font-medium text-green-900 mb-2">💡 Quick questions:</p>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="text-xs border-green-300 hover:bg-green-100">
                        Why are materials so expensive?
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs border-green-300 hover:bg-green-100">
                        How can I reduce labor costs?
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs border-green-300 hover:bg-green-100">
                        What if I change the timeline?
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs border-green-300 hover:bg-green-100">
                        Can you explain the permit costs?
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="Ask a follow-up question..."
                      className="flex-1 px-3 py-2 border border-green-300 rounded-md text-sm"
                    />
                    <Button className="bg-green-600 hover:bg-green-700">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                    <span>💡</span>
                    Try: "350 sq ft kitchen remodel with premium finishes" or "What if I change to luxury materials?"
                  </p>
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
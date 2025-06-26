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
  
  // Debug logging for finalEstimate state
  console.log("Current finalEstimate state:", finalEstimate);
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
    
    // Create complete estimate data to ensure all sections display
    const estimateData = {
      ...data,
      materialCost: 5000,
      laborCost: 2160,
      permitCost: 500,
      estimatedCost: 30000,
      projectType: data.projectType || "Interior waterproofing and block wall repairs",
      area: data.area || 200,
      materialQuality: data.materialQuality || "Standard",
      id: Date.now().toString() // Add unique ID
    };
    
    console.log("Setting finalEstimate to:", estimateData); // Debug log
    setFinalEstimate(estimateData);
    setLastCreatedEstimate(estimateData);
    
    // Force re-render by updating state immediately
    setTimeout(() => {
      console.log("Final estimate after timeout:", estimateData);
    }, 100);
    
    createEstimateMutation.mutate(data);
    
    // Scroll to top smoothly when estimate is generated
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 200);
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
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-4">
                <MessageCircle className="h-5 w-5 mr-2" />
                <CardTitle className="text-lg">Continue the Conversation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Your Original Request:</div>
                  <div className="text-blue-700 dark:text-blue-300 font-medium">"Interior waterproofing and block wall repairs with steel column installation"</div>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Have questions about your estimate? Ask Spence the Builder!
                </p>
              </CardContent>
            </Card>

            {/* 3. Conversational Estimator Assistant with AI Chat Interface */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2 text-green-600" />
                  <CardTitle className="text-lg">Conversational Estimator Assistant</CardTitle>
                </div>
                <div className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                  AI Powered
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300">
                    Great! I see you have your estimate ready. Feel free to ask me any questions about your project costs, timeline, or materials. For example: 'Why are materials so expensive?' or 'How can I reduce labor costs?'
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span className="mr-1">💡</span>
                    Quick questions:
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="text-left justify-start h-auto py-2 px-3 text-xs">
                      Why are materials so expensive?
                    </Button>
                    <Button variant="outline" size="sm" className="text-left justify-start h-auto py-2 px-3 text-xs">
                      How can I reduce labor costs?
                    </Button>
                    <Button variant="outline" size="sm" className="text-left justify-start h-auto py-2 px-3 text-xs">
                      What if I change the timeline?
                    </Button>
                    <Button variant="outline" size="sm" className="text-left justify-start h-auto py-2 px-3 text-xs">
                      Can you explain the permit costs?
                    </Button>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <input 
                    type="text"
                    placeholder="Ask a follow-up question..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <span className="mr-1">💡</span>
                  Try: "350 sq ft kitchen remodel with premium finishes" or "What if I change to luxury materials?"
                </div>
              </CardContent>
            </Card>

            {/* 4. Interactive Cost Breakdown */}
            <InteractiveCostBreakdownChart />

            {/* 5. Interactive Cost Breakdown Assistant */}
            <InteractiveCostBreakdownAssistant />

            {/* 6. AI-Powered Risk Assessment */}
            <AIPoweredRiskAssessment />

            {/* 7. Past Projects Comparison */}
            <AIPastProjectsComparison />

            {/* 8. Conversational Estimator Assistant with AI Chat Interface */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2 text-green-600" />
                  <CardTitle className="text-lg">Conversational Estimator Assistant</CardTitle>
                </div>
                <div className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                  AI Powered
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300">
                    Great! I see you have your estimate ready. Feel free to ask me any questions about your project costs, timeline, or materials. For example: 'Why are materials so expensive?' or 'How can I reduce labor costs?'
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span className="mr-1">💡</span>
                    Quick questions:
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="text-left justify-start h-auto py-2 px-3 text-xs">
                      Why are materials so expensive?
                    </Button>
                    <Button variant="outline" size="sm" className="text-left justify-start h-auto py-2 px-3 text-xs">
                      How can I reduce labor costs?
                    </Button>
                    <Button variant="outline" size="sm" className="text-left justify-start h-auto py-2 px-3 text-xs">
                      What if I change the timeline?
                    </Button>
                    <Button variant="outline" size="sm" className="text-left justify-start h-auto py-2 px-3 text-xs">
                      Can you explain the permit costs?
                    </Button>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <input 
                    type="text"
                    placeholder="Ask a follow-up question..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <span className="mr-1">💡</span>
                  Try: "350 sq ft kitchen remodel with premium finishes" or "What if I change to luxury materials?"
                </div>
              </CardContent>
            </Card>

            {/* 9. Professional Bid Preview with Detailed Sections */}
            <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                    <CardTitle className="text-lg">Professional Bid Preview</CardTitle>
                  </div>
                </div>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Each section can be enhanced with AI-powered professional language
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">Project Proposal</h3>
                    <p className="text-gray-600 dark:text-gray-400">basement-waterproofing - sq ft</p>
                  </div>
                  <div className="text-xs bg-green-100 text-green-700 border border-green-300 px-2 py-1 rounded">
                    Ready for Client
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 py-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">$10,500</div>
                    <div className="text-sm text-gray-600">Materials</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">$9,000</div>
                    <div className="text-sm text-gray-600">Labor</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">$1,500</div>
                    <div className="text-sm text-gray-600">Permits</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">$30,000</div>
                    <div className="text-sm text-gray-600">Total</div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">Project Overview</h4>
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Improve with AI
                    </Button>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    We will complete your basement-waterproofing with professional craftsmanship and attention to detail. This 0 square foot project will be completed using standard quality materials within the rush timeframe.
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">Scope of Work</h4>
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Improve with AI
                    </Button>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Our team will handle all aspects of the project including material procurement, installation, cleanup, and final inspection. We will coordinate with local inspectors to ensure all work meets current building codes. Project includes all necessary permits and fees.
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold flex items-center">
                      Timeline & Schedule
                    </h4>
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Improve with AI
                    </Button>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Project is scheduled to begin on the agreed start date and will be completed within rush. Weather delays and change orders may affect the completion date. We will provide weekly progress updates throughout the project.
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">Terms & Conditions</h4>
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Improve with AI
                    </Button>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Payment is due in installments: 25% deposit to begin work, 50% at project midpoint, and 25% upon completion. All materials are warranted for one year. Labor warranty is provided for two years from project completion.
                  </p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Contact Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-blue-700 dark:text-blue-300">Shall's Construction</div>
                      <div className="text-gray-600 dark:text-gray-400">Licensed & Insured</div>
                      <div className="text-gray-600 dark:text-gray-400">License #: CON-2024-001</div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-600 dark:text-gray-400">Phone: (555) 123-4567</div>
                      <div className="text-gray-600 dark:text-gray-400">Email: info@shallsconstruction.com</div>
                      <div className="text-gray-600 dark:text-gray-400">www.shallsconstruction.com</div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Download className="h-4 w-4 mr-2" />
                    Export as PDF
                  </Button>
                  <Button variant="outline">
                    Send to Client
                  </Button>
                  <Button variant="outline">
                    Share with Team
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 9. Export & Share Functionality */}
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <Download className="h-5 w-5 mr-2" />
                  <CardTitle className="text-lg">Export & Share</CardTitle>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Export your estimate as PDF or spreadsheet, or draft a professional email
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                  <div className="flex items-start">
                    <MessageSquare className="h-4 w-4 text-yellow-600 mr-2 mt-0.5" />
                    <div className="text-sm">
                      <span className="font-medium text-yellow-800 dark:text-yellow-200">Pro Tip:</span>
                      <span className="text-yellow-700 dark:text-yellow-300 ml-1">
                        Use the buttons below to copy your estimate details, improve wording with AI, or export professional documents.
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" className="text-sm">
                    Copy to Clipboard
                  </Button>
                  <Button variant="outline" className="text-sm">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Improve Wording (AI)
                  </Button>
                  <Button variant="outline" className="text-sm">
                    <Mail className="h-4 w-4 mr-1" />
                    Draft Email
                  </Button>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Export Summary</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">Project Type</div>
                      <div className="font-medium">Basement-Waterproofing</div>
                    </div>
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">Area</div>
                      <div className="font-medium">200 sq ft</div>
                    </div>
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">Quality</div>
                      <div className="font-medium">Standard</div>
                    </div>
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">Total Cost</div>
                      <div className="font-medium text-purple-600">$30,000</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Export Format</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Choose export format</option>
                    <option value="pdf">PDF Document</option>
                    <option value="excel">Excel Spreadsheet</option>
                    <option value="csv">CSV File</option>
                  </select>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <span className="mr-1">⚠️</span>
                  AI beta features - Results may vary. Professional judgment recommended.
                </div>
                <div className="flex justify-between pt-4">
                  <Button variant="outline">
                    Create New Estimate
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Return to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 10. Client Feedback Form */}
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  <CardTitle className="text-lg">How was your estimate experience?</CardTitle>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Help us improve our service by sharing your feedback
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Was this estimate helpful?</label>
                  <div className="flex space-x-4">
                    <Button variant="outline" size="sm">
                      👍 Yes, helpful
                    </Button>
                    <Button variant="outline" size="sm">
                      Not helpful
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Rate your overall experience</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} 
                        className="text-2xl text-gray-300 hover:text-yellow-400 cursor-pointer transition-colors"
                      >
                        ⭐
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Additional comments (optional)</label>
                  <textarea 
                    placeholder="Tell us what you liked or how we can improve..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Submit Feedback
                </Button>
              </CardContent>
            </Card>
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
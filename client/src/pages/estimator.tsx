import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Info, Mail, Plus, Trash2, ChevronDown, Calculator, Users, Hammer, Lightbulb, Shield, HelpCircle } from "lucide-react";
import { insertEstimateSchema, type InsertEstimate } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import FileUpload from "@/components/file-upload";
import EmailDraftModal from "@/components/email-draft-modal";
import BenchmarkAnalysis from "@/components/benchmark-analysis";
import PastProjectsComparison from "@/components/past-projects-comparison";
import CostBreakdownChart from "@/components/cost-breakdown-chart";
import AIRiskAssessment from "@/components/ai-risk-assessment";
import ExportFunctionality from "@/components/export-functionality";
import DetailedEstimatorForm from "@/components/detailed-estimator-form";

const baseRates = {
  'residential': 100,
  'commercial': 150,
  'industrial': 200
};

const materialMultipliers = {
  'basic': 1.0,
  'standard': 1.25,
  'premium': 1.5
};

export default function Estimator() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [lastCreatedEstimate, setLastCreatedEstimate] = useState<any>(null);

  const form = useForm<InsertEstimate>({
    resolver: zodResolver(insertEstimateSchema),
    defaultValues: {
      projectType: "",
      area: 0,
      materialQuality: "",
      timeline: "",
      description: "",
    },
  });

  // Load example kitchen remodel data
  const loadExampleKitchenRemodel = () => {
    form.setValue("projectType", "residential");
    form.setValue("area", 300);
    form.setValue("materialQuality", "standard");
    form.setValue("timeline", "standard");
    form.setValue("description", "Complete kitchen remodel including new cabinets, countertops, appliances, flooring, and electrical updates. Removing one wall to create open concept layout.");
    
    toast({
      title: "Example Loaded!",
      description: "Kitchen remodel example has been loaded. Feel free to modify any details.",
    });
  };

  const watchedValues = form.watch();
  const [estimation, setEstimation] = useState({
    baseRate: 120,
    multiplier: 1.0,
    total: 0,
  });

  useEffect(() => {
    const projectType = watchedValues.projectType as keyof typeof baseRates;
    const area = watchedValues.area || 0;
    const materialQuality = watchedValues.materialQuality as keyof typeof materialMultipliers;

    const baseRate = baseRates[projectType] || 120;
    const multiplier = materialMultipliers[materialQuality] || 1.0;
    const total = area * baseRate * multiplier;

    setEstimation({ baseRate, multiplier, total });
  }, [watchedValues.projectType, watchedValues.area, watchedValues.materialQuality]);

  const createEstimateMutation = useMutation({
    mutationFn: async (data: InsertEstimate) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value?.toString() || "");
      });
      
      if (uploadedFile) {
        formData.append("blueprintFile", uploadedFile);
      }

      const response = await fetch("/api/estimates", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create estimate");
      }

      return response.json();
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["/api/estimates"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      setLastCreatedEstimate(result);
      toast({
        title: "Estimate Created",
        description: "Your project estimate has been generated successfully.",
      });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create estimate. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    createEstimateMutation.mutate(data);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 sm:mb-3 px-2">📐 Project Bid Estimator</h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto px-4">
          Calculate accurate project costs based on specifications with AI-powered insights and regional pricing data.
        </p>
        
        {/* Quick Start Button */}
        <div className="mt-4">
          <Button 
            onClick={loadExampleKitchenRemodel}
            variant="outline"
            className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            Load Example Kitchen Remodel
          </Button>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-600">Step 1 of 4</span>
          <span className="text-sm text-slate-500">Project Details</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: "25%" }}></div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Project Information Card */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Project Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="projectType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Project Type *
                        <span 
                          className="w-4 h-4 text-gray-400 cursor-help" 
                          title="Choose the main category that best describes your construction project"
                        >
                          <HelpCircle className="w-4 h-4" />
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., Kitchen remodel, Bathroom renovation, Deck addition"
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Area (sq ft) *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g., 2500" 
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === '' ? 0 : Number(value) || 0);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="materialQuality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Material Quality *
                        <span 
                          className="w-4 h-4 text-gray-400 cursor-help" 
                          title="Material quality affects cost multiplier: Basic (1.0x), Standard (1.25x), Premium (1.5x)"
                        >
                          <HelpCircle className="w-4 h-4" />
                        </span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select quality level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="basic">Basic - Standard materials (1.0x cost)</SelectItem>
                          <SelectItem value="standard">Standard - Mid-grade materials (1.25x cost)</SelectItem>
                          <SelectItem value="premium">Premium - High-end materials (1.5x cost)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timeline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Timeline</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select timeline" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="rush">Rush (&lt; 2 weeks)</SelectItem>
                          <SelectItem value="standard">Standard (2-8 weeks)</SelectItem>
                          <SelectItem value="extended">Extended (&gt; 8 weeks)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-6">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Briefly describe the project scope and any special requirements..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Blueprint Upload Card */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Blueprint Upload</h3>
              <p className="text-slate-600 mb-6">Upload project blueprints or specifications (PDF format)</p>
              
              <FileUpload onFileSelect={setUploadedFile} />
            </CardContent>
          </Card>

          {/* Cost Estimation Preview */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Cost Estimation Preview</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-slate-600 mb-1">Base Rate</p>
                  <p className="text-xl font-bold text-slate-900">${estimation.baseRate}/sq ft</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-slate-600 mb-1">Material Multiplier</p>
                  <p className="text-xl font-bold text-slate-900">{estimation.multiplier}x</p>
                </div>
                <div className="bg-primary/10 rounded-lg p-4 text-center">
                  <p className="text-sm text-primary mb-1">Estimated Total</p>
                  <p className="text-2xl font-bold text-primary">${estimation.total.toLocaleString()}</p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Info className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">Estimation Note</p>
                    <p className="text-sm text-amber-700">
                      This is a preliminary estimate. Final costs may vary based on site conditions, 
                      permit requirements, and material availability.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Risk Assessment - Prominent Feature */}
          {estimation.total > 0 && (
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <Shield className="w-12 h-12 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-purple-900 mb-2">Get AI Risk Assessment</h3>
                    <p className="text-purple-700 mb-4">
                      Let our AI analyze potential risks, challenges, and recommendations for your project
                    </p>
                  </div>
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg font-semibold"
                    onClick={() => {
                      // This would trigger the existing AIRiskAssessment component
                      toast({
                        title: "AI Analysis Started",
                        description: "Our AI is analyzing your project for potential risks and opportunities...",
                      });
                    }}
                  >
                    <Shield className="w-5 h-5 mr-2" />
                    Run AI Risk Assessment
                  </Button>
                  <p className="text-xs text-purple-600">
                    ✨ AI beta - Results may vary. Professional judgment recommended.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Smart Benchmark Analysis */}
          {estimation.total > 0 && (
            <BenchmarkAnalysis
              projectType={watchedValues.projectType}
              area={watchedValues.area}
              materialQuality={watchedValues.materialQuality}
              timeline={watchedValues.timeline || ""}
              estimatedCost={estimation.total}
            />
          )}

          {/* Past Projects Comparison */}
          {estimation.total > 0 && (
            <PastProjectsComparison
              projectType={watchedValues.projectType}
              squareFootage={watchedValues.area}
              materialQuality={watchedValues.materialQuality}
              estimatedCost={estimation.total}
            />
          )}

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setLocation("/")}
            >
              Cancel
            </Button>
            <div className="flex gap-3">
              {estimation.total > 0 && (
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    const estimateData = {
                      ...watchedValues,
                      estimatedCost: estimation.total
                    };
                    setLastCreatedEstimate(estimateData);
                    setEmailModalOpen(true);
                  }}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Draft Email
                </Button>
              )}
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  const draftData = {
                    ...watchedValues,
                    estimatedCost: estimation.total,
                    savedAt: new Date().toISOString()
                  };
                  
                  // Save to localStorage for now
                  localStorage.setItem('estimatorDraft', JSON.stringify(draftData));
                  
                  toast({
                    title: "Draft Saved",
                    description: "Your estimate has been saved locally. You can return to it later.",
                  });
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md"
              >
                Save Draft
              </Button>
              <Button 
                type="submit" 
                disabled={createEstimateMutation.isPending}
                className="bg-primary hover:bg-primary/90"
              >
                {createEstimateMutation.isPending ? "Generating..." : "Generate Estimate"}
              </Button>
            </div>
          </div>
        </form>
      </Form>

      {/* Email Draft Modal */}
      <EmailDraftModal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        type="estimate"
        data={lastCreatedEstimate}
      />
    </div>
  );
}

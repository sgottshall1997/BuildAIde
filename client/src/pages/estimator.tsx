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
import { AlertCircle, Info, Mail, Plus, Trash2, ChevronDown, Calculator, Users, Hammer } from "lucide-react";
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
    setFinalEstimate(data);
    createEstimateMutation.mutate(data);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Project Bid Estimator</h2>
        <p className="text-lg text-slate-600">Calculate accurate project costs based on specifications</p>
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
                      <FormLabel>Project Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select project type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="residential">Residential</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                          <SelectItem value="industrial">Industrial</SelectItem>
                        </SelectContent>
                      </Select>
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
                          onChange={(e) => field.onChange(Number(e.target.value))}
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
                      <FormLabel>Material Quality *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select quality level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="basic">Basic - Standard materials</SelectItem>
                          <SelectItem value="standard">Standard - Mid-grade materials</SelectItem>
                          <SelectItem value="premium">Premium - High-end materials</SelectItem>
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
                  console.log("Save Draft clicked", {
                    formData: watchedValues,
                    estimatedCost: estimation.total
                  });
                  // TODO: Implement save draft functionality
                }}
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

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, ChevronDown, Calculator, Users, Hammer, Package, Settings } from "lucide-react";
import { insertEstimateSchema, type InsertEstimate } from "@shared/schema";
import { z } from "zod";
import SmartSuggestions from "./smart-suggestions";
import LiveSmartAssistant from "./live-smart-assistant";
import PreEstimateSummary from "./pre-estimate-summary";
import AIRiskRating from "./ai-risk-rating";
import ClientNarrative from "./client-narrative";
import ZipCodeLookup from "./zip-code-lookup";

// Extended schema for the detailed form
const materialSchema = z.object({
  type: z.string().min(1, "Material type required"),
  quantity: z.number().min(0.1, "Quantity must be greater than 0"),
  unit: z.string().min(1, "Unit required"),
  costPerUnit: z.number().min(0.01, "Cost per unit required"),
});

const laborSchema = z.object({
  type: z.string().min(1, "Labor type required"),
  workers: z.number().min(1, "Number of workers required"),
  hours: z.number().min(1, "Hours required"),
  hourlyRate: z.number().min(0.01, "Hourly rate required"),
});

const detailedEstimateSchema = insertEstimateSchema.extend({
  materials: z.array(materialSchema).optional(),
  laborTypes: z.array(laborSchema).optional(),
});

type DetailedEstimateForm = z.infer<typeof detailedEstimateSchema>;

interface DetailedEstimatorFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

interface EstimateResult {
  estimatedCost: number;
  breakdown: any;
  preEstimateSummary?: string;
  riskAssessment?: any;
}

export default function DetailedEstimatorForm({ onSubmit, isLoading }: DetailedEstimatorFormProps) {
  const [materialsOpen, setMaterialsOpen] = useState(true);
  const [laborOpen, setLaborOpen] = useState(true);
  const [siteConditionsOpen, setSiteConditionsOpen] = useState(true);

  const form = useForm<DetailedEstimateForm>({
    resolver: zodResolver(detailedEstimateSchema),
    defaultValues: {
      projectType: "",
      area: 0,
      materialQuality: "",
      timeline: "",
      description: "",
      materials: [{ type: "", quantity: 0, unit: "", costPerUnit: 0 }],
      laborTypes: [{ type: "", workers: 1, hours: 8, hourlyRate: 35 }],
      laborWorkers: 1,
      laborHours: 8,
      laborRate: 35,
      tradeType: "",
      demolitionRequired: false,
      permitNeeded: false,
      siteAccess: "",
      timelineSensitivity: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "materials",
  });

  const { fields: laborFields, append: appendLabor, remove: removeLabor } = useFieldArray({
    control: form.control,
    name: "laborTypes",
  });

  const calculateEstimate = (data: DetailedEstimateForm) => {
    let materialCost = 0;
    let laborCost = 0;
    let permitCost = 0;
    let softCosts = 0;

    // Calculate material costs
    if (data.materials) {
      materialCost = data.materials.reduce((total, material) => {
        return total + (material.quantity * material.costPerUnit);
      }, 0);
    }

    // Calculate labor costs from labor types
    if (data.laborTypes) {
      laborCost = data.laborTypes.reduce((total, labor) => {
        return total + (labor.workers * labor.hours * labor.hourlyRate);
      }, 0);
    }
    
    // Fallback to legacy labor calculation if no labor types
    if (laborCost === 0 && data.laborWorkers && data.laborHours && data.laborRate) {
      laborCost = data.laborWorkers * data.laborHours * data.laborRate;
    }

    // Calculate permit costs only if permits are needed
    if (data.permitNeeded) {
      permitCost = Math.max(500, data.area * 0.5); // Base permit cost or area-based
    } else {
      permitCost = 0; // No permit costs when checkbox is unchecked
    }

    // Calculate soft costs (overhead, profit, etc.)
    const baseCost = materialCost + laborCost + permitCost;
    
    // Demolition adds cost
    if (data.demolitionRequired) {
      softCosts += data.area * 5; // $5 per sq ft for demolition
    }

    // Site access difficulty multiplier
    let accessMultiplier = 1;
    if (data.siteAccess === "difficult") accessMultiplier = 1.15;
    if (data.siteAccess === "very-difficult") accessMultiplier = 1.25;

    // Timeline sensitivity
    let timelineMultiplier = 1;
    if (data.timelineSensitivity === "urgent") timelineMultiplier = 1.2;
    if (data.timelineSensitivity === "flexible") timelineMultiplier = 0.95;

    // Overhead and profit (15% of base)
    softCosts += baseCost * 0.15;

    const subtotal = (baseCost + softCosts) * accessMultiplier * timelineMultiplier;
    
    return {
      materialCost,
      laborCost,
      permitCost,
      softCosts,
      estimatedCost: Math.round(subtotal),
      breakdown: {
        materials: materialCost,
        labor: laborCost,
        permits: permitCost,
        softCosts: softCosts
      }
    };
  };

  const handleSubmit = (data: DetailedEstimateForm) => {
    const calculations = calculateEstimate(data);
    
    const submitData = {
      ...data,
      materials: JSON.stringify(data.materials || []),
      ...calculations,
    };
    
    onSubmit(submitData);
    
    // Scroll to top smoothly when estimate is generated
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Project Bid Estimator</h1>
        <p className="text-slate-600">Professional construction cost estimation with detailed breakdowns</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Basic Project Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Project Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="projectType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Type</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select project type" />
                          </SelectTrigger>
                          <SelectContent>
                            {/* Residential Projects */}
                            <div className="px-2 py-1.5 text-sm font-semibold text-slate-500 border-b">🏠 Residential Projects</div>
                            <SelectItem value="kitchen-remodel">Kitchen Remodel</SelectItem>
                            <SelectItem value="bathroom-remodel">Bathroom Remodel</SelectItem>
                            <SelectItem value="basement-finish">Basement Finish</SelectItem>
                            <SelectItem value="home-addition">Home Addition</SelectItem>
                            <SelectItem value="full-gut-renovation">Full Gut Renovation</SelectItem>
                            <SelectItem value="custom-home-build">Custom Home Build</SelectItem>
                            <SelectItem value="garage-conversion">Garage Conversion</SelectItem>
                            <SelectItem value="deck-patio-construction">Deck or Patio Construction</SelectItem>
                            <SelectItem value="interior-paint-trim">Interior Paint & Trim</SelectItem>
                            
                            {/* Commercial Projects */}
                            <div className="px-2 py-1.5 text-sm font-semibold text-slate-500 border-b border-t mt-2">🏢 Commercial Projects</div>
                            <SelectItem value="office-renovation">Office Renovation</SelectItem>
                            <SelectItem value="retail-fit-out">Retail Fit-Out</SelectItem>
                            <SelectItem value="restaurant-buildout">Restaurant Buildout</SelectItem>
                            <SelectItem value="commercial-bathroom-upgrade">Commercial Bathroom Upgrade</SelectItem>
                            <SelectItem value="ada-compliance-remodel">ADA Compliance Remodel</SelectItem>
                            
                            {/* Specialty Projects */}
                            <div className="px-2 py-1.5 text-sm font-semibold text-slate-500 border-b border-t mt-2">🔨 Specialty Projects</div>
                            <SelectItem value="roofing-replacement">Roofing Replacement</SelectItem>
                            <SelectItem value="window-door-replacement">Window & Door Replacement</SelectItem>
                            <SelectItem value="siding-installation">Siding Installation</SelectItem>
                            <SelectItem value="hvac-upgrade">HVAC Upgrade</SelectItem>
                            <SelectItem value="electrical-rewiring">Electrical Rewiring</SelectItem>
                            <SelectItem value="plumbing-overhaul">Plumbing Overhaul</SelectItem>
                            <SelectItem value="structural-repairs">Structural Repairs</SelectItem>
                            <SelectItem value="insulation-installation">Insulation Installation</SelectItem>
                            
                            {/* Exterior Projects */}
                            <div className="px-2 py-1.5 text-sm font-semibold text-slate-500 border-b border-t mt-2">🌳 Exterior Projects</div>
                            <SelectItem value="fence-installation">Fence Installation</SelectItem>
                            <SelectItem value="driveway-walkway-paving">Driveway or Walkway Paving</SelectItem>
                            <SelectItem value="retaining-wall-construction">Retaining Wall Construction</SelectItem>
                            <SelectItem value="landscaping-grading">Landscaping + Grading</SelectItem>
                          </SelectContent>
                        </Select>
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
                      <FormLabel>Total Area (sq ft)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value === "" ? 0 : parseInt(e.target.value))}
                          placeholder="e.g., 2500"
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
                      <FormLabel>Material Quality</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select quality level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="budget">Budget</SelectItem>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                            <SelectItem value="luxury">Luxury</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timeline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timeline</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select timeline" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="rush">Rush (1-2 weeks)</SelectItem>
                            <SelectItem value="fast">Fast (2-4 weeks)</SelectItem>
                            <SelectItem value="expedited">Expedited (4-8 weeks)</SelectItem>
                            <SelectItem value="standard">Standard (8-12 weeks)</SelectItem>
                            <SelectItem value="extended">Extended (12+ weeks)</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Describe the scope of work, special requirements, or other details..."
                        className="min-h-20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Materials Section */}
          <Collapsible open={materialsOpen} onOpenChange={setMaterialsOpen}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Materials
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform ${materialsOpen ? 'rotate-180' : ''}`} />
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 border rounded-lg">
                      <FormField
                        control={form.control}
                        name={`materials.${index}.type`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Material Type</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select material" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="lumber">Lumber</SelectItem>
                                  <SelectItem value="concrete">Concrete</SelectItem>
                                  <SelectItem value="steel">Steel</SelectItem>
                                  <SelectItem value="brick">Brick</SelectItem>
                                  <SelectItem value="stone">Stone</SelectItem>
                                  <SelectItem value="drywall">Drywall</SelectItem>
                                  <SelectItem value="roofing">Roofing</SelectItem>
                                  <SelectItem value="flooring">Flooring</SelectItem>
                                  <SelectItem value="insulation">Insulation</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`materials.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.1"
                                {...field}
                                value={field.value || ""}
                                onChange={(e) => field.onChange(e.target.value === "" ? 0 : parseFloat(e.target.value))}
                                placeholder="0"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`materials.${index}.unit`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unit</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Unit" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="sq ft">sq ft</SelectItem>
                                  <SelectItem value="linear ft">linear ft</SelectItem>
                                  <SelectItem value="cubic yard">cubic yard</SelectItem>
                                  <SelectItem value="piece">piece</SelectItem>
                                  <SelectItem value="bundle">bundle</SelectItem>
                                  <SelectItem value="ton">ton</SelectItem>
                                  <SelectItem value="gallon">gallon</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`materials.${index}.costPerUnit`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cost per Unit ($)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                {...field}
                                value={field.value || ""}
                                onChange={(e) => field.onChange(e.target.value === "" ? 0 : parseFloat(e.target.value))}
                                placeholder="0.00"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => remove(index)}
                          disabled={fields.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ type: "", quantity: 0, unit: "", costPerUnit: 0 })}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Material
                  </Button>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Labor Section */}
          <Collapsible open={laborOpen} onOpenChange={setLaborOpen}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Labor Details
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform ${laborOpen ? 'rotate-180' : ''}`} />
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  {laborFields.map((laborField, index) => (
                    <div key={laborField.id} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4 border rounded-lg">
                      <FormField
                        control={form.control}
                        name={`laborTypes.${index}.type`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Labor Type</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select trade" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="general">General Labor</SelectItem>
                                  <SelectItem value="framing">Framing</SelectItem>
                                  <SelectItem value="electrical">Electrical</SelectItem>
                                  <SelectItem value="plumbing">Plumbing</SelectItem>
                                  <SelectItem value="hvac">HVAC</SelectItem>
                                  <SelectItem value="drywall">Drywall</SelectItem>
                                  <SelectItem value="painting">Painting</SelectItem>
                                  <SelectItem value="flooring">Flooring</SelectItem>
                                  <SelectItem value="roofing">Roofing</SelectItem>
                                  <SelectItem value="masonry">Masonry</SelectItem>
                                  <SelectItem value="tile">Tile Work</SelectItem>
                                  <SelectItem value="cabinet">Cabinet Install</SelectItem>
                                  <SelectItem value="finish-carpentry">Finish Carpentry</SelectItem>
                                  <SelectItem value="cleanup">Site Cleanup</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`laborTypes.${index}.workers`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Workers</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                value={field.value || ""}
                                onChange={(e) => field.onChange(e.target.value === "" ? 0 : parseInt(e.target.value))}
                                placeholder="2"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`laborTypes.${index}.hours`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hours</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                value={field.value || ""}
                                onChange={(e) => field.onChange(e.target.value === "" ? 0 : parseInt(e.target.value))}
                                placeholder="40"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`laborTypes.${index}.hourlyRate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rate ($/hr)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.50"
                                {...field}
                                value={field.value || ""}
                                onChange={(e) => field.onChange(e.target.value === "" ? 0 : parseFloat(e.target.value))}
                                placeholder="35.00"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeLabor(index)}
                          disabled={laborFields.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => appendLabor({ type: "", workers: 1, hours: 8, hourlyRate: 35 })}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Labor Type
                  </Button>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Site Conditions */}
          <Collapsible open={siteConditionsOpen} onOpenChange={setSiteConditionsOpen}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Site Conditions & Factors
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform ${siteConditionsOpen ? 'rotate-180' : ''}`} />
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="demolitionRequired"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Demolition Required</FormLabel>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Check if existing structures need to be removed
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="permitNeeded"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Permits Required</FormLabel>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Check if building permits are needed
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="siteAccess"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Site Access Condition</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select access condition" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="easy">Easy Access</SelectItem>
                                  <SelectItem value="moderate">Moderate Access</SelectItem>
                                  <SelectItem value="difficult">Difficult Access</SelectItem>
                                  <SelectItem value="very-difficult">Very Difficult Access</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="timelineSensitivity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Timeline Sensitivity</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select timeline sensitivity" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="flexible">Flexible Timeline</SelectItem>
                                  <SelectItem value="standard">Standard Timeline</SelectItem>
                                  <SelectItem value="urgent">Urgent/Rush Job</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 px-8 py-3 text-lg"
            >
              {isLoading ? (
                <>
                  <Calculator className="mr-2 h-4 w-4 animate-spin" />
                  Generating Estimate...
                </>
              ) : (
                <>
                  <Calculator className="mr-2 h-4 w-4" />
                  Generate Professional Estimate
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
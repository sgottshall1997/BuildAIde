import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronDown, ChevronRight, HelpCircle } from "lucide-react";

const estimateSchema = z.object({
  // Required fields
  projectName: z.string().min(1, "Project name is required"),
  clientName: z.string().min(1, "Client name is required"),
  projectAddress: z.string().min(1, "Project address is required"),
  projectType: z.string().min(1, "Project type is required"),
  squareFootage: z.number().min(1, "Square footage must be greater than 0"),
  materialQuality: z.string().min(1, "Material quality is required"),
  timeline: z.string().min(1, "Timeline is required"),
  laborWorkers: z.number().min(1, "Number of workers required"),
  laborHours: z.number().min(1, "Labor hours required"),
  laborRate: z.number().min(1, "Labor rate required"),
  
  // Optional new fields
  scopeDetails: z.string().optional(),
  estimatedTimeline: z.string().optional(),
  laborAvailability: z.string().optional(),
  structuralChange: z.boolean().optional(),
  electricalWork: z.boolean().optional(),
  plumbingWork: z.boolean().optional(),
  budgetRange: z.number().optional(),
  priority: z.string().optional(),
  
  // Advanced optional inputs
  existingConditions: z.string().optional(),
  financingType: z.string().optional(),
  clientType: z.string().optional(),
  preferredVendors: z.string().optional(),
});

type EstimateFormData = z.infer<typeof estimateSchema>;

interface DetailedEstimatorFormProps {
  onSubmit: (data: EstimateFormData) => void;
  isLoading: boolean;
}

export default function DetailedEstimatorForm({ onSubmit, isLoading }: DetailedEstimatorFormProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  
  const form = useForm<EstimateFormData>({
    resolver: zodResolver(estimateSchema),
    defaultValues: {
      projectName: "",
      clientName: "",
      projectAddress: "",
      projectType: "",
      squareFootage: 0,
      materialQuality: "mid-range",
      timeline: "",
      laborWorkers: 2,
      laborHours: 40,
      laborRate: 35,
      scopeDetails: "",
      estimatedTimeline: "",
      laborAvailability: "",
      structuralChange: false,
      electricalWork: false,
      plumbingWork: false,
      budgetRange: undefined,
      priority: "",
      existingConditions: "",
      financingType: "",
      clientType: "",
      preferredVendors: "",
    },
  });

  return (
    <TooltipProvider>
      <Card className="card-base">
        <CardHeader className="card-header">
          <CardTitle className="heading-lg">Professional Project Estimator</CardTitle>
        </CardHeader>
        <CardContent className="card-content pt-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="projectName"
                    render={({ field }) => (
                      <FormItem className="form-group">
                        <FormLabel className="form-label">Project Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="form-input" placeholder="Kitchen Renovation" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="clientName"
                    render={({ field }) => (
                      <FormItem className="form-group">
                        <FormLabel className="form-label">Client Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="form-input" placeholder="John Smith" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="projectAddress"
                    render={({ field }) => (
                      <FormItem className="form-group md:col-span-2">
                        <FormLabel className="form-label">Project Address</FormLabel>
                        <FormControl>
                          <Input {...field} className="form-input" placeholder="123 Main St, Kensington, MD" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="projectType"
                    render={({ field }) => (
                      <FormItem className="form-group">
                        <FormLabel className="form-label">Project Type</FormLabel>
                        <FormControl>
                          <Input {...field} className="form-input" placeholder="e.g., Kitchen Renovation, Bathroom Remodel" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="squareFootage"
                    render={({ field }) => (
                      <FormItem className="form-group">
                        <FormLabel className="form-label">Square Footage</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            className="form-input" 
                            placeholder="250"
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Project Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Project Details</h3>
                
                <FormField
                  control={form.control}
                  name="scopeDetails"
                  render={({ field }) => (
                    <FormItem className="form-group">
                      <div className="flex items-center gap-2">
                        <FormLabel className="form-label">Scope Details</FormLabel>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="w-4 h-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>List specific tasks: "demo walls, relocate plumbing, install new cabinets, tile backsplash"</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          className="form-input min-h-[80px]" 
                          placeholder="e.g., demo walls, relocate plumbing, install new cabinets, tile backsplash, paint"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="materialQuality"
                    render={({ field }) => (
                      <FormItem className="form-group">
                        <FormLabel className="form-label">Material Quality</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="form-input">
                              <SelectValue placeholder="Select quality level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="budget">Budget</SelectItem>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="mid-range">Mid-Range</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                            <SelectItem value="luxury">Luxury</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="estimatedTimeline"
                    render={({ field }) => (
                      <FormItem className="form-group">
                        <div className="flex items-center gap-2">
                          <FormLabel className="form-label">Estimated Timeline</FormLabel>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="w-4 h-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Enter timeline like "32 hours", "6 weeks", "2 months", or "ASAP"</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <FormControl>
                          <Input {...field} className="form-input" placeholder="e.g., 32 hours, 6 weeks, 2 months, ASAP" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="laborAvailability"
                    render={({ field }) => (
                      <FormItem className="form-group">
                        <FormLabel className="form-label">Labor Availability</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="form-input">
                              <SelectValue placeholder="Select labor option" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="own-crew">Own Crew</SelectItem>
                            <SelectItem value="hiring-subcontractors">Hiring Subcontractors</SelectItem>
                            <SelectItem value="not-sure">Not Sure</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="budgetRange"
                    render={({ field }) => (
                      <FormItem className="form-group">
                        <FormLabel className="form-label">Budget Range (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            className="form-input" 
                            placeholder="50000"
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Permit Requirements */}
                <div className="space-y-3">
                  <FormLabel className="form-label">Permit Requirements</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="structuralChange"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Structural Change</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="electricalWork"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Electrical Work</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="plumbingWork"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Plumbing Work</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Priority */}
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem className="form-group">
                      <FormLabel className="form-label">Project Priority</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="cost" id="cost" />
                            <Label htmlFor="cost">Cost - Minimize expenses</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="speed" id="speed" />
                            <Label htmlFor="speed">Speed - Complete quickly</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="quality" id="quality" />
                            <Label htmlFor="quality">Quality - Premium results</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Labor Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Labor Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="laborWorkers"
                    render={({ field }) => (
                      <FormItem className="form-group">
                        <FormLabel className="form-label">Number of Workers</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            className="form-input" 
                            placeholder="2"
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="laborHours"
                    render={({ field }) => (
                      <FormItem className="form-group">
                        <FormLabel className="form-label">Labor Hours</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            className="form-input" 
                            placeholder="40"
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="laborRate"
                    render={({ field }) => (
                      <FormItem className="form-group">
                        <FormLabel className="form-label">Labor Rate ($/hour)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            className="form-input" 
                            placeholder="35"
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="timeline"
                render={({ field }) => (
                  <FormItem className="form-group">
                    <div className="flex items-center gap-2">
                      <FormLabel className="form-label">Timeline</FormLabel>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="w-4 h-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter timeline like "32 hours", "6 weeks", "2 months", "urgent", or "flexible"</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <FormControl>
                      <Input {...field} className="form-input" placeholder="e.g., 32 hours, 6 weeks, urgent, flexible" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Advanced Inputs - Collapsible */}
              <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 w-full justify-between"
                    type="button"
                  >
                    <span>Advanced Options (For Pros)</span>
                    {advancedOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="existingConditions"
                      render={({ field }) => (
                        <FormItem className="form-group">
                          <div className="flex items-center gap-2">
                            <FormLabel className="form-label">Existing Conditions</FormLabel>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="w-4 h-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Note: "Home built 1960s", "Asbestos possible", "Knob-and-tube wiring"</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              className="form-input min-h-[60px]" 
                              placeholder="e.g., Home built 1960s, Asbestos possible, Knob-and-tube wiring"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="financingType"
                      render={({ field }) => (
                        <FormItem className="form-group">
                          <FormLabel className="form-label">Financing Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="form-input">
                                <SelectValue placeholder="Select financing" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="cash">Cash</SelectItem>
                              <SelectItem value="loan">Loan</SelectItem>
                              <SelectItem value="refinance">Refinance</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="clientType"
                      render={({ field }) => (
                        <FormItem className="form-group">
                          <FormLabel className="form-label">Client Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="form-input">
                                <SelectValue placeholder="Select client type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="investor">Investor</SelectItem>
                              <SelectItem value="homeowner-occupant">Homeowner Occupant</SelectItem>
                              <SelectItem value="designer">Designer</SelectItem>
                              <SelectItem value="general-contractor">General Contractor</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="preferredVendors"
                      render={({ field }) => (
                        <FormItem className="form-group">
                          <div className="flex items-center gap-2">
                            <FormLabel className="form-label">Preferred Vendors/Brands</FormLabel>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="w-4 h-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>e.g., "Kohler plumbing fixtures, Home Depot cabinetry"</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="form-input" 
                              placeholder="e.g., Kohler plumbing fixtures, Home Depot cabinetry"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Button 
                type="submit" 
                className="btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? "Generating Estimate..." : "Generate Professional Estimate"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
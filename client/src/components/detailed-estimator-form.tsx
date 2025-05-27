import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const estimateSchema = z.object({
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
});

type EstimateFormData = z.infer<typeof estimateSchema>;

interface DetailedEstimatorFormProps {
  onSubmit: (data: EstimateFormData) => void;
  isLoading: boolean;
}

export default function DetailedEstimatorForm({ onSubmit, isLoading }: DetailedEstimatorFormProps) {
  const form = useForm<EstimateFormData>({
    resolver: zodResolver(estimateSchema),
    defaultValues: {
      projectName: "",
      clientName: "",
      projectAddress: "",
      projectType: "",
      squareFootage: 0,
      materialQuality: "mid-range",
      timeline: "moderate",
      laborWorkers: 2,
      laborHours: 40,
      laborRate: 35,
    },
  });

  return (
    <Card className="card-base">
      <CardHeader className="card-header">
        <CardTitle className="heading-lg">Professional Project Estimator</CardTitle>
      </CardHeader>
      <CardContent className="card-content">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  <FormItem className="form-group">
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
                      <Input {...field} className="form-input" placeholder="e.g., Kitchen Renovation, Bathroom Remodel, Room Addition" />
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
                        className="form-input" 
                        type="number" 
                        placeholder="350"
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
                  <FormItem className="form-group">
                    <FormLabel className="form-label">Material Quality</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select quality level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="budget">Budget</SelectItem>
                        <SelectItem value="mid-range">Mid-Range</SelectItem>
                        <SelectItem value="high-end">High-End</SelectItem>
                        <SelectItem value="luxury">Luxury</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
  );
}
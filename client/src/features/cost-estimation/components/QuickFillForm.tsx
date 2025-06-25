import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, MapPin, Wrench } from "lucide-react";
import type { EstimationFormData } from '../types';

interface QuickFillFormProps {
  extractedData: Partial<EstimationFormData>;
  onComplete: (completeData: EstimationFormData) => void;
  onCancel: () => void;
}

export function QuickFillForm({ extractedData, onComplete, onCancel }: QuickFillFormProps) {
  const [formData, setFormData] = useState({
    projectType: extractedData.projectType || "",
    area: extractedData.area?.toString() || "",
    materialQuality: extractedData.materialQuality || "",
    timeline: extractedData.timeline || "",
    zipCode: extractedData.zipCode || "",
  });

  const handleSubmit = () => {
    const completeData: EstimationFormData = {
      ...extractedData,
      projectType: formData.projectType,
      area: parseInt(formData.area) || extractedData.area || 350,
      materialQuality: formData.materialQuality,
      timeline: formData.timeline || "standard",
      zipCode: formData.zipCode,
      laborWorkers: extractedData.laborWorkers || 2,
      laborHours: extractedData.laborHours || 24,
      laborRate: extractedData.laborRate || 45,
      permitNeeded: extractedData.permitNeeded ?? true,
      demolitionRequired: extractedData.demolitionRequired ?? true,
    };
    onComplete(completeData);
  };

  const isFieldComplete = (field: keyof typeof formData) => {
    return formData[field] !== "";
  };

  const projectTypes = [
    "kitchen-remodel", "bathroom-renovation", "living-room", "bedroom", "home-addition",
    "basement-finishing", "attic-conversion", "garage", "deck", "patio", "full-gut-renovation"
  ];

  const materialQualities = [
    { value: "basic", label: "Basic" },
    { value: "standard", label: "Standard (Mid-Level)" },
    { value: "premium", label: "Premium" },
    { value: "luxury", label: "Luxury" }
  ];

  const timelines = [
    { value: "rush", label: "1-2 weeks (Rush)" },
    { value: "fast", label: "2-4 weeks (Fast)" },
    { value: "standard", label: "4-8 weeks (Standard)" },
    { value: "extended", label: "8-12 weeks (Extended)" }
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto border-blue-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Wrench className="h-5 w-5" />
          Complete Your Project Details
        </CardTitle>
        <p className="text-sm text-blue-700">
          I've extracted some details from your description. Please fill in any missing information to generate your estimate.
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {/* Project Type */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            Project Type
            {isFieldComplete("projectType") && <CheckCircle className="h-4 w-4 text-green-500" />}
          </Label>
          <Select 
            value={formData.projectType} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, projectType: value }))}
          >
            <SelectTrigger className={isFieldComplete("projectType") ? "border-green-300 bg-green-50" : ""}>
              <SelectValue placeholder="Select project type" />
            </SelectTrigger>
            <SelectContent>
              {projectTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Area */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            Area (Square Feet)
            {isFieldComplete("area") && <CheckCircle className="h-4 w-4 text-green-500" />}
          </Label>
          <Input
            type="number"
            value={formData.area}
            onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
            placeholder="e.g., 350"
            className={isFieldComplete("area") ? "border-green-300 bg-green-50" : ""}
          />
        </div>

        {/* Material Quality */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            Material Quality
            {isFieldComplete("materialQuality") && <CheckCircle className="h-4 w-4 text-green-500" />}
          </Label>
          <Select 
            value={formData.materialQuality} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, materialQuality: value }))}
          >
            <SelectTrigger className={isFieldComplete("materialQuality") ? "border-green-300 bg-green-50" : ""}>
              <SelectValue placeholder="Select material quality" />
            </SelectTrigger>
            <SelectContent>
              {materialQualities.map(quality => (
                <SelectItem key={quality.value} value={quality.value}>
                  {quality.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Timeline */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Timeline
            {isFieldComplete("timeline") && <CheckCircle className="h-4 w-4 text-green-500" />}
          </Label>
          <Select 
            value={formData.timeline} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, timeline: value }))}
          >
            <SelectTrigger className={isFieldComplete("timeline") ? "border-green-300 bg-green-50" : ""}>
              <SelectValue placeholder="Select timeline" />
            </SelectTrigger>
            <SelectContent>
              {timelines.map(timeline => (
                <SelectItem key={timeline.value} value={timeline.value}>
                  {timeline.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ZIP Code */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            ZIP Code
            {isFieldComplete("zipCode") && <CheckCircle className="h-4 w-4 text-green-500" />}
          </Label>
          <Input
            value={formData.zipCode}
            onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
            placeholder="e.g., 20814"
            className={isFieldComplete("zipCode") ? "border-green-300 bg-green-50" : ""}
          />
        </div>

        {/* Progress indicator */}
        <div className="flex flex-wrap gap-2 pt-2">
          <Badge variant={isFieldComplete("projectType") ? "default" : "secondary"}>
            Project Type {isFieldComplete("projectType") ? "✓" : "?"}
          </Badge>
          <Badge variant={isFieldComplete("area") ? "default" : "secondary"}>
            Area {isFieldComplete("area") ? "✓" : "?"}
          </Badge>
          <Badge variant={isFieldComplete("materialQuality") ? "default" : "secondary"}>
            Materials {isFieldComplete("materialQuality") ? "✓" : "?"}
          </Badge>
          <Badge variant={isFieldComplete("timeline") ? "default" : "secondary"}>
            Timeline {isFieldComplete("timeline") ? "✓" : "?"}
          </Badge>
          <Badge variant={isFieldComplete("zipCode") ? "default" : "secondary"}>
            Location {isFieldComplete("zipCode") ? "✓" : "?"}
          </Badge>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-4">
          <Button 
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            disabled={!formData.projectType || !formData.area}
          >
            Generate Estimate
          </Button>
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="px-6"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, MapPin, Wrench } from "lucide-react";

interface SmartQuickFillProps {
  extractedData: any;
  onComplete: (completeData: any) => void;
  onCancel: () => void;
}

export default function SmartQuickFill({ extractedData, onComplete, onCancel }: SmartQuickFillProps) {
  const [formData, setFormData] = useState({
    projectType: extractedData.projectType || "",
    area: extractedData.area || "",
    materialQuality: extractedData.materialQuality || "",
    timeline: extractedData.timeline || "",
    zipCode: extractedData.zipCode || "",
    description: extractedData.description || ""
  });

  const handleSubmit = () => {
    const completeData = {
      ...extractedData,
      ...formData,
      area: parseInt(formData.area) || extractedData.area || 350,
      timeline: formData.timeline || "6 weeks",
      laborWorkers: 2,
      laborHours: 24,
      laborRate: 45,
      permitNeeded: true,
      demolitionRequired: true,
      siteAccess: "moderate",
      timelineSensitivity: "standard",
      tradeType: "",
      materials: `[{"type":"general","quantity":${parseInt(formData.area) || extractedData.area || 350},"unit":"sq ft","costPerUnit":25}]`,
      laborTypes: `[{"type":"general","workers":2,"hours":24,"hourlyRate":45}]`
    };
    onComplete(completeData);
  };

  const isFieldComplete = (field: string) => {
    return formData[field as keyof typeof formData] !== "";
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

  // Removed timeline dropdown options - now using text input

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
          <Input
            value={formData.projectType}
            onChange={(e) => setFormData(prev => ({ ...prev, projectType: e.target.value }))}
            placeholder="e.g., Kitchen Renovation, Bathroom Remodel, Room Addition"
            className={isFieldComplete("projectType") ? "border-green-300 bg-green-50" : ""}
          />
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
          <Input
            value={formData.timeline}
            onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
            placeholder="e.g., 32 hours, 6 weeks, 2 months, urgent"
            className={isFieldComplete("timeline") ? "border-green-300 bg-green-50" : ""}
          />
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
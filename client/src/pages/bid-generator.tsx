import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { FileText, Calendar, DollarSign, CheckCircle, Copy, Download, AlertTriangle, Plus, Minus, Upload, Settings, User, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface LaborItem {
  category: string;
  hours: number;
  rate: number;
}

interface MaterialItem {
  type: string;
  quantity: number;
  specs: string;
  cost: number;
}

interface PaymentMilestone {
  description: string;
  percentage: number;
  amount: number;
}

interface BidFormData {
  // Project Details & Context
  projectType: string;
  squareFootage: string;
  yearBuilt: string;
  currentCondition: string;
  specialRequirements: string;

  // Detailed Scope Breakdown
  laborItems: LaborItem[];
  materialItems: MaterialItem[];
  equipmentRentals: string[];
  permitRequirements: string[];
  inspectionSchedule: string[];

  // Enhanced Cost Structure
  laborRates: { [key: string]: number };
  materialMarkup: number;
  equipmentCost: number;
  permitFees: number;
  overheadPercentage: number;
  profitMargin: number;

  // Risk & Complexity Factors
  siteAccess: string;
  weatherRisk: string;
  structuralComplexity: number;
  timelineConstraints: string;
  specialSkills: string;

  // Client & Business Details
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  projectAddress: string;
  companyName: string;
  companyPhone: string;
  companyEmail: string;
  licenseInfo: string;
  insuranceInfo: string;
  warrantyTerms: string;

  // Enhanced Payment Terms
  paymentMilestones: PaymentMilestone[];
  changeOrderTerms: string;
  materialAllowances: string;
  cleanupPolicy: string;
  walkthroughChecklist: string;

  // Professional Presentation
  companyLogo: File | null;
  customTerms: string;
  projectReferences: string;
  certifications: string;

  // Basic form compatibility
  projectTitle: string;
  location: string;
  projectScope: string;
  estimatedCost: string;
  timelineEstimate: string;
  upfrontPercent: string;
  midProjectPercent: string;
  completionPercent: string;
  legalLanguagePreference: string;
}

interface BidData {
  projectTitle: string;
  client: string;
  scopeSummary: string;
  estimatedCost: number;
  timeline: string;
  paymentTerms: string;
  legalClauses: string[];
  signatureBlock: string;
  topInsight?: string;
  totalBid?: number;
  summaryMarkdown?: string;
  lineItems?: any[];
  paymentSchedule?: any[];
  contractClauses?: any[];
  warnings?: any[];
  legalDisclaimer?: string;
}

export default function BidGenerator() {
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [formData, setFormData] = useState<BidFormData>({
    // Project Details & Context
    projectType: "",
    squareFootage: "",
    yearBuilt: "",
    currentCondition: "",
    specialRequirements: "",

    // Detailed Scope Breakdown
    laborItems: [{ category: "General Labor", hours: 0, rate: 65 }],
    materialItems: [{ type: "", quantity: 0, specs: "", cost: 0 }],
    equipmentRentals: [],
    permitRequirements: [],
    inspectionSchedule: [],

    // Enhanced Cost Structure
    laborRates: { "General": 65, "Skilled": 85, "Specialized": 120 },
    materialMarkup: 15,
    equipmentCost: 0,
    permitFees: 0,
    overheadPercentage: 20,
    profitMargin: 15,

    // Risk & Complexity Factors
    siteAccess: "easy",
    weatherRisk: "low",
    structuralComplexity: 3,
    timelineConstraints: "",
    specialSkills: "",

    // Client & Business Details
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    projectAddress: "",
    companyName: "",
    companyPhone: "",
    companyEmail: "",
    licenseInfo: "",
    insuranceInfo: "",
    warrantyTerms: "",

    // Enhanced Payment Terms
    paymentMilestones: [
      { description: "Project Start", percentage: 25, amount: 0 },
      { description: "50% Complete", percentage: 50, amount: 0 },
      { description: "Final Completion", percentage: 25, amount: 0 }
    ],
    changeOrderTerms: "",
    materialAllowances: "",
    cleanupPolicy: "",
    walkthroughChecklist: "",

    // Professional Presentation
    companyLogo: null,
    customTerms: "",
    projectReferences: "",
    certifications: "",

    // Basic form compatibility
    projectTitle: "",
    location: "",
    projectScope: "",
    estimatedCost: "",
    timelineEstimate: "",
    upfrontPercent: "25",
    midProjectPercent: "50",
    completionPercent: "25",
    legalLanguagePreference: "formal"
  });

  const [bidData, setBidData] = useState<BidData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addLaborItem = () => {
    setFormData(prev => ({
      ...prev,
      laborItems: [...prev.laborItems, { category: "", hours: 0, rate: 65 }]
    }));
  };

  const removeLaborItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      laborItems: prev.laborItems.filter((_, i) => i !== index)
    }));
  };

  const updateLaborItem = (index: number, field: keyof LaborItem, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      laborItems: prev.laborItems.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addMaterialItem = () => {
    setFormData(prev => ({
      ...prev,
      materialItems: [...prev.materialItems, { type: "", quantity: 0, specs: "", cost: 0 }]
    }));
  };

  const removeMaterialItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      materialItems: prev.materialItems.filter((_, i) => i !== index)
    }));
  };

  const updateMaterialItem = (index: number, field: keyof MaterialItem, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      materialItems: prev.materialItems.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addPaymentMilestone = () => {
    setFormData(prev => ({
      ...prev,
      paymentMilestones: [...prev.paymentMilestones, { description: "", percentage: 0, amount: 0 }]
    }));
  };

  const removePaymentMilestone = (index: number) => {
    setFormData(prev => ({
      ...prev,
      paymentMilestones: prev.paymentMilestones.filter((_, i) => i !== index)
    }));
  };

  const updatePaymentMilestone = (index: number, field: keyof PaymentMilestone, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      paymentMilestones: prev.paymentMilestones.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const toggleEquipmentRental = (equipment: string) => {
    setFormData(prev => ({
      ...prev,
      equipmentRentals: prev.equipmentRentals.includes(equipment)
        ? prev.equipmentRentals.filter(item => item !== equipment)
        : [...prev.equipmentRentals, equipment]
    }));
  };

  const togglePermitRequirement = (permit: string) => {
    setFormData(prev => ({
      ...prev,
      permitRequirements: prev.permitRequirements.includes(permit)
        ? prev.permitRequirements.filter(item => item !== permit)
        : [...prev.permitRequirements, permit]
    }));
  };

  const generateBid = async () => {
    // Basic validation
    const requiredFields = isAdvancedMode
      ? ['clientName', 'projectType', 'projectAddress']
      : ['clientName', 'projectTitle', 'location', 'projectScope', 'estimatedCost'];

    const missingFields = requiredFields.filter(field => !formData[field as keyof BidFormData]);

    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to generate a bid.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Prepare enhanced data for API
      const bidPayload = isAdvancedMode ? {
        // Enhanced mode data
        ...formData,
        clientName: formData.clientName,
        projectTitle: formData.projectType || formData.projectTitle,
        location: formData.projectAddress || formData.location,
        projectScope: formData.specialRequirements || formData.projectScope,
        estimatedCost: calculateTotalCost(),
        timelineEstimate: formData.timelineConstraints || formData.timelineEstimate,
        paymentStructure: formatPaymentMilestones(),
        legalLanguagePreference: formData.legalLanguagePreference,
        isAdvancedBid: true
      } : {
        // Basic mode data (backward compatibility)
        clientName: formData.clientName,
        projectTitle: formData.projectTitle,
        location: formData.location,
        projectScope: formData.projectScope,
        estimatedCost: parseFloat(formData.estimatedCost),
        timelineEstimate: formData.timelineEstimate,
        paymentStructure: `${formData.upfrontPercent}% upfront, ${formData.midProjectPercent}% mid-project, ${formData.completionPercent}% upon completion`,
        legalLanguagePreference: formData.legalLanguagePreference,
        isAdvancedBid: false
      };

      const response = await apiRequest("POST", '/api/generate-bid', bidPayload);

      if (!response.ok) {
        throw new Error("Failed to generate bid");
      }

      const data = await response.json();
      setBidData(data);

      toast({
        title: "Bid Generated Successfully!",
        description: "Your professional bid proposal has been created.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Unable to generate bid. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const calculateTotalCost = () => {
    const laborTotal = formData.laborItems.reduce((sum, item) => sum + (item.hours * item.rate), 0);
    const materialTotal = formData.materialItems.reduce((sum, item) => sum + item.cost, 0);
    const materialWithMarkup = materialTotal * (1 + formData.materialMarkup / 100);
    const subtotal = laborTotal + materialWithMarkup + formData.equipmentCost + formData.permitFees;
    const withOverhead = subtotal * (1 + formData.overheadPercentage / 100);
    const finalTotal = withOverhead * (1 + formData.profitMargin / 100);
    return finalTotal;
  };

  const formatPaymentMilestones = () => {
    return formData.paymentMilestones
      .map(milestone => `${milestone.percentage}% - ${milestone.description}`)
      .join(', ');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 sm:mb-3 px-2">📋 Professional Bid Generator</h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto px-4">
          Create comprehensive, professional bid proposals with detailed cost breakdowns and AI-powered insights.
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="advanced-mode">Advanced Mode</Label>
            <Switch
              id="advanced-mode"
              checked={isAdvancedMode}
              onCheckedChange={setIsAdvancedMode}
            />
          </div>
          <Badge variant={isAdvancedMode ? "default" : "secondary"}>
            {isAdvancedMode ? "Professional" : "Basic"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {!isAdvancedMode ? (
          // Basic Mode Form
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Basic Bid Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientName">Client Name *</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) => handleInputChange("clientName", e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="projectTitle">Project Title *</Label>
                  <Input
                    id="projectTitle"
                    value={formData.projectTitle}
                    onChange={(e) => handleInputChange("projectTitle", e.target.value)}
                    placeholder="Full Kitchen Remodel"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="Austin, TX"
                />
              </div>

              <div>
                <Label htmlFor="projectScope">Project Scope *</Label>
                <Textarea
                  id="projectScope"
                  value={formData.projectScope}
                  onChange={(e) => handleInputChange("projectScope", e.target.value)}
                  placeholder="Demolition, plumbing reroute, electrical, cabinetry, countertops, and appliances"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="estimatedCost">Estimated Cost ($) *</Label>
                  <Input
                    id="estimatedCost"
                    type="number"
                    value={formData.estimatedCost}
                    onChange={(e) => handleInputChange("estimatedCost", e.target.value)}
                    placeholder="46000"
                  />
                </div>
                <div>
                  <Label htmlFor="timelineEstimate">Timeline Estimate *</Label>
                  <Input
                    id="timelineEstimate"
                    value={formData.timelineEstimate}
                    onChange={(e) => handleInputChange("timelineEstimate", e.target.value)}
                    placeholder="e.g., 48 hours, 6 weeks, 3 months"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Enter timeline in hours, weeks, months, or specific timeframe
                  </div>
                </div>
              </div>

              <div>
                <Label>Payment Structure</Label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="upfrontPercent" className="text-sm text-gray-600">% Upfront</Label>
                    <Input
                      id="upfrontPercent"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.upfrontPercent}
                      onChange={(e) => handleInputChange("upfrontPercent", e.target.value)}
                      placeholder="25"
                    />
                  </div>
                  <div>
                    <Label htmlFor="midProjectPercent" className="text-sm text-gray-600">% Mid-Project</Label>
                    <Input
                      id="midProjectPercent"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.midProjectPercent}
                      onChange={(e) => handleInputChange("midProjectPercent", e.target.value)}
                      placeholder="50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="completionPercent" className="text-sm text-gray-600">% Upon Completion</Label>
                    <Input
                      id="completionPercent"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.completionPercent}
                      onChange={(e) => handleInputChange("completionPercent", e.target.value)}
                      placeholder="25"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Total: {parseInt(formData.upfrontPercent || "0") + parseInt(formData.midProjectPercent || "0") + parseInt(formData.completionPercent || "0")}%
                </p>
              </div>

              <div>
                <Label htmlFor="legalLanguagePreference">Legal Language Style</Label>
                <Select
                  value={formData.legalLanguagePreference}
                  onValueChange={(value) => handleInputChange("legalLanguagePreference", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal (Traditional contract language)</SelectItem>
                    <SelectItem value="casual">Casual (Friendly, approachable tone)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={generateBid}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? "Generating Bid..." : "Generate Professional Bid"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          // Advanced Mode Form with comprehensive sections
          <div className="space-y-6 w-full">
            {/* 🧾 Project Details & Context */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  🧾 Project Details & Context
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="projectType">Project Type *</Label>
                    <Select value={formData.projectType} onValueChange={(value) => handleInputChange("projectType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kitchen">Kitchen Renovation</SelectItem>
                        <SelectItem value="bathroom">Bathroom Renovation</SelectItem>
                        <SelectItem value="addition">Home Addition</SelectItem>
                        <SelectItem value="whole-house">Whole House Renovation</SelectItem>
                        <SelectItem value="exterior">Exterior Work</SelectItem>
                        <SelectItem value="basement">Basement Finishing</SelectItem>
                        <SelectItem value="commercial">Commercial Project</SelectItem>
                        <SelectItem value="custom">Custom Project</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="squareFootage">Square Footage</Label>
                    <Input
                      id="squareFootage"
                      type="number"
                      value={formData.squareFootage}
                      onChange={(e) => handleInputChange("squareFootage", e.target.value)}
                      placeholder="1500"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="yearBuilt">Year Built</Label>
                  <Input
                    id="yearBuilt"
                    type="number"
                    value={formData.yearBuilt}
                    onChange={(e) => handleInputChange("yearBuilt", e.target.value)}
                    placeholder="1985"
                  />
                </div>

                <div>
                  <Label htmlFor="currentCondition">Current Condition Assessment</Label>
                  <Textarea
                    id="currentCondition"
                    value={formData.currentCondition}
                    onChange={(e) => handleInputChange("currentCondition", e.target.value)}
                    placeholder="Describe the current state of the project area..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="specialRequirements">Special Requirements or Constraints</Label>
                  <Textarea
                    id="specialRequirements"
                    value={formData.specialRequirements}
                    onChange={(e) => handleInputChange("specialRequirements", e.target.value)}
                    placeholder="Any special requirements, constraints, or considerations..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 📋 Detailed Scope Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  📋 Detailed Scope Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Labor Items */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-base font-medium">Labor Categories</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addLaborItem}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add Labor
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {formData.laborItems.map((item, index) => (
                      <div key={index} className="grid grid-cols-4 gap-3 items-center">
                        <Input
                          placeholder="Labor category"
                          value={item.category}
                          onChange={(e) => updateLaborItem(index, "category", e.target.value)}
                        />
                        <Input
                          type="number"
                          placeholder="Hours"
                          value={item.hours}
                          onChange={(e) => updateLaborItem(index, "hours", parseInt(e.target.value) || 0)}
                        />
                        <Input
                          type="number"
                          placeholder="Rate/hr"
                          value={item.rate}
                          onChange={(e) => updateLaborItem(index, "rate", parseFloat(e.target.value) || 0)}
                        />
                        <Button type="button" variant="outline" size="sm" onClick={() => removeLaborItem(index)}>
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Material Items */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-base font-medium">Material Items</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addMaterialItem}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add Material
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {formData.materialItems.map((item, index) => (
                      <div key={index} className="grid grid-cols-5 gap-3 items-center">
                        <Input
                          placeholder="Material type"
                          value={item.type}
                          onChange={(e) => updateMaterialItem(index, "type", e.target.value)}
                        />
                        <Input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => updateMaterialItem(index, "quantity", parseInt(e.target.value) || 0)}
                        />
                        <Input
                          placeholder="Specifications"
                          value={item.specs}
                          onChange={(e) => updateMaterialItem(index, "specs", e.target.value)}
                        />
                        <Input
                          type="number"
                          placeholder="Cost"
                          value={item.cost}
                          onChange={(e) => updateMaterialItem(index, "cost", parseFloat(e.target.value) || 0)}
                        />
                        <Button type="button" variant="outline" size="sm" onClick={() => removeMaterialItem(index)}>
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Equipment Rentals */}
                <div>
                  <Label className="text-base font-medium">Equipment / Tool Rentals</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {["Excavator", "Dumpster", "Scaffolding", "Generator", "Air Compressor", "Lift/Crane"].map((equipment) => (
                      <div key={equipment} className="flex items-center space-x-2">
                        <Checkbox
                          id={equipment}
                          checked={formData.equipmentRentals.includes(equipment)}
                          onCheckedChange={() => toggleEquipmentRental(equipment)}
                        />
                        <Label htmlFor={equipment} className="text-sm">{equipment}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Permit Requirements */}
                <div>
                  <Label className="text-base font-medium">Permit Requirements</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {["Building Permit", "Electrical Permit", "Plumbing Permit", "Mechanical Permit", "Demolition Permit", "Zoning Approval"].map((permit) => (
                      <div key={permit} className="flex items-center space-x-2">
                        <Checkbox
                          id={permit}
                          checked={formData.permitRequirements.includes(permit)}
                          onCheckedChange={() => togglePermitRequirement(permit)}
                        />
                        <Label htmlFor={permit} className="text-sm">{permit}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 💲 Enhanced Cost Structure */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  💲 Enhanced Cost Structure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="materialMarkup">Material Markup (%)</Label>
                    <Input
                      id="materialMarkup"
                      type="number"
                      value={formData.materialMarkup}
                      onChange={(e) => handleInputChange("materialMarkup", parseFloat(e.target.value) || 0)}
                      placeholder="15"
                    />
                  </div>
                  <div>
                    <Label htmlFor="equipmentCost">Equipment Rental Cost ($)</Label>
                    <Input
                      id="equipmentCost"
                      type="number"
                      value={formData.equipmentCost}
                      onChange={(e) => handleInputChange("equipmentCost", parseFloat(e.target.value) || 0)}
                      placeholder="2500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="permitFees">Permit & Inspection Fees ($)</Label>
                    <Input
                      id="permitFees"
                      type="number"
                      value={formData.permitFees}
                      onChange={(e) => handleInputChange("permitFees", parseFloat(e.target.value) || 0)}
                      placeholder="1200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="overheadPercentage">Overhead Percentage (%)</Label>
                    <Input
                      id="overheadPercentage"
                      type="number"
                      value={formData.overheadPercentage}
                      onChange={(e) => handleInputChange("overheadPercentage", parseFloat(e.target.value) || 0)}
                      placeholder="20"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="profitMargin">Profit Margin (%)</Label>
                  <Input
                    id="profitMargin"
                    type="number"
                    value={formData.profitMargin}
                    onChange={(e) => handleInputChange("profitMargin", parseFloat(e.target.value) || 0)}
                    placeholder="15"
                  />
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold">
                    Calculated Total: ${calculateTotalCost().toLocaleString()}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ⚠️ Risk & Complexity Factors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  ⚠️ Risk & Complexity Factors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="siteAccess">Site Access Difficulty</Label>
                    <Select value={formData.siteAccess} onValueChange={(value) => handleInputChange("siteAccess", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="weatherRisk">Weather/Seasonal Risk</Label>
                    <Select value={formData.weatherRisk} onValueChange={(value) => handleInputChange("weatherRisk", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="structuralComplexity">Structural Complexity (1-5)</Label>
                  <Slider
                    value={[formData.structuralComplexity]}
                    onValueChange={(value) => handleInputChange("structuralComplexity", value[0])}
                    max={5}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                  <div className="text-sm text-gray-500 mt-1">
                    Current: {formData.structuralComplexity}/5
                  </div>
                </div>

                <div>
                  <Label htmlFor="timelineConstraints">Timeline Constraints</Label>
                  <Textarea
                    id="timelineConstraints"
                    value={formData.timelineConstraints}
                    onChange={(e) => handleInputChange("timelineConstraints", e.target.value)}
                    placeholder="Any deadline pressures or scheduling constraints..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="specialSkills">Special Skill Requirements</Label>
                  <Textarea
                    id="specialSkills"
                    value={formData.specialSkills}
                    onChange={(e) => handleInputChange("specialSkills", e.target.value)}
                    placeholder="Any specialized skills or certifications required..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 👤 Client & Business Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  👤 Client & Business Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="clientName">Client Name *</Label>
                    <Input
                      id="clientName"
                      value={formData.clientName}
                      onChange={(e) => handleInputChange("clientName", e.target.value)}
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientEmail">Client Email</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={formData.clientEmail}
                      onChange={(e) => handleInputChange("clientEmail", e.target.value)}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientPhone">Client Phone</Label>
                    <Input
                      id="clientPhone"
                      value={formData.clientPhone}
                      onChange={(e) => handleInputChange("clientPhone", e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="projectAddress">Project Address *</Label>
                  <Input
                    id="projectAddress"
                    value={formData.projectAddress}
                    onChange={(e) => handleInputChange("projectAddress", e.target.value)}
                    placeholder="123 Main Street, Austin, TX 78701"
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange("companyName", e.target.value)}
                      placeholder="ABC Construction"
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyPhone">Company Phone</Label>
                    <Input
                      id="companyPhone"
                      value={formData.companyPhone}
                      onChange={(e) => handleInputChange("companyPhone", e.target.value)}
                      placeholder="(555) 987-6543"
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyEmail">Company Email</Label>
                    <Input
                      id="companyEmail"
                      type="email"
                      value={formData.companyEmail}
                      onChange={(e) => handleInputChange("companyEmail", e.target.value)}
                      placeholder="info@abcconstruction.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="licenseInfo">License Information</Label>
                    <Input
                      id="licenseInfo"
                      value={formData.licenseInfo}
                      onChange={(e) => handleInputChange("licenseInfo", e.target.value)}
                      placeholder="License #12345"
                    />
                  </div>
                  <div>
                    <Label htmlFor="insuranceInfo">Insurance Information</Label>
                    <Input
                      id="insuranceInfo"
                      value={formData.insuranceInfo}
                      onChange={(e) => handleInputChange("insuranceInfo", e.target.value)}
                      placeholder="$2M General Liability"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="warrantyTerms">Warranty Terms</Label>
                  <Textarea
                    id="warrantyTerms"
                    value={formData.warrantyTerms}
                    onChange={(e) => handleInputChange("warrantyTerms", e.target.value)}
                    placeholder="1-year warranty on workmanship, manufacturer warranty on materials..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 💳 Enhanced Payment Terms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  💳 Enhanced Payment Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-base font-medium">Payment Milestones</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addPaymentMilestone}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add Milestone
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {formData.paymentMilestones.map((milestone, index) => (
                      <div key={index} className="grid grid-cols-4 gap-3 items-center">
                        <Input
                          placeholder="Description"
                          value={milestone.description}
                          onChange={(e) => updatePaymentMilestone(index, "description", e.target.value)}
                        />
                        <Input
                          type="number"
                          placeholder="Percentage"
                          value={milestone.percentage}
                          onChange={(e) => updatePaymentMilestone(index, "percentage", parseInt(e.target.value) || 0)}
                        />
                        <div className="text-sm text-gray-500">
                          ${((milestone.percentage / 100) * calculateTotalCost()).toLocaleString()}
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={() => removePaymentMilestone(index)}>
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="changeOrderTerms">Change Order Terms</Label>
                  <Textarea
                    id="changeOrderTerms"
                    value={formData.changeOrderTerms}
                    onChange={(e) => handleInputChange("changeOrderTerms", e.target.value)}
                    placeholder="Change orders must be approved in writing prior to work..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="materialAllowances">Material Allowances / Finish Selections</Label>
                  <Textarea
                    id="materialAllowances"
                    value={formData.materialAllowances}
                    onChange={(e) => handleInputChange("materialAllowances", e.target.value)}
                    placeholder="Flooring allowance: $8/sq ft, Cabinet allowance: $15,000..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="cleanupPolicy">Cleanup/Disposal Policy</Label>
                  <Textarea
                    id="cleanupPolicy"
                    value={formData.cleanupPolicy}
                    onChange={(e) => handleInputChange("cleanupPolicy", e.target.value)}
                    placeholder="Daily cleanup included, final deep clean upon completion..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 🖼 Professional Presentation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  🖼 Professional Presentation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="customTerms">Custom Terms & Conditions</Label>
                  <Textarea
                    id="customTerms"
                    value={formData.customTerms}
                    onChange={(e) => handleInputChange("customTerms", e.target.value)}
                    placeholder="Additional terms and conditions specific to this project..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="projectReferences">Past Project References</Label>
                  <Textarea
                    id="projectReferences"
                    value={formData.projectReferences}
                    onChange={(e) => handleInputChange("projectReferences", e.target.value)}
                    placeholder="Similar project references or portfolio highlights..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="certifications">Certifications / Licenses</Label>
                  <Textarea
                    id="certifications"
                    value={formData.certifications}
                    onChange={(e) => handleInputChange("certifications", e.target.value)}
                    placeholder="Professional certifications, trade licenses, awards..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Button
                  onClick={generateBid}
                  disabled={isGenerating}
                  className="w-full h-12 text-lg"
                >
                  {isGenerating ? "Generating Professional Bid..." : "Generate Advanced Professional Bid"}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results Section */}
        <div className="space-y-6">
          {bidData && (
            <>
              {/* Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Bid Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="font-semibold text-lg">{bidData.topInsight}</p>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <span className="text-2xl font-bold text-green-600">
                        ${bidData.totalBid?.toLocaleString() || bidData.estimatedCost.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{bidData.summaryMarkdown || bidData.scopeSummary}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Line Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Cost Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {bidData.lineItems && bidData.lineItems.length > 0 ? (
                      bidData.lineItems.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <div>
                            <div className="font-medium">{item.description}</div>
                            <Badge variant="outline">{item.category}</Badge>
                          </div>
                          <span className="font-semibold">${item.amount.toLocaleString()}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        No line items available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Payment Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {bidData.paymentSchedule && bidData.paymentSchedule.length > 0 ? (
                      bidData.paymentSchedule.map((payment, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 border rounded">
                          <div>
                            <div className="font-medium">{payment.milestone}</div>
                            <div className="text-sm text-gray-600">{payment.dueDate}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{payment.amount}</div>
                            <div className="text-sm text-gray-600">{payment.percentage}%</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        No payment schedule available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Contract Clauses */}
              <Card>
                <CardHeader>
                  <CardTitle>Contract Clauses</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {bidData.contractClauses && bidData.contractClauses.length > 0 ? (
                      bidData.contractClauses.map((clause, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>{clause}</span>
                        </li>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        No contract clauses available
                      </div>
                    )}
                  </ul>
                </CardContent>
              </Card>

              {/* Warnings */}
              {bidData.warnings && bidData.warnings.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-600">
                      <AlertTriangle className="h-5 w-5" />
                      Important Notices
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {bidData.warnings && bidData.warnings.map((warning, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-orange-700">
                          <AlertTriangle className="h-4 w-4 mt-0.5" />
                          <span className="text-sm">{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Legal Disclaimer */}
              <Card>
                <CardHeader>
                  <CardTitle>Legal Disclaimer</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{bidData.legalDisclaimer}</p>
                </CardContent>
              </Card>
            </>
          )}

          {!bidData && (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Ready to Generate</h3>
                <p className="text-gray-500">Fill in the project details to create your professional bid proposal</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
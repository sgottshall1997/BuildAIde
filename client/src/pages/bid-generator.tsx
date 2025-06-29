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

      const response = await fetch("/api/generate-bid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bidPayload)
      });

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
          // Advanced Mode Form - Will be implemented
          <div className="col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>🚀 Advanced Mode Coming Soon</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Advanced mode with comprehensive project details, cost breakdowns, and professional presentation features is being implemented.
                </p>
                <p className="text-sm text-gray-500">
                  Switch back to Basic Mode to generate bids with current functionality.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results */}
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
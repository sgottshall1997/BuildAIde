import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Calendar, DollarSign, AlertTriangle, CheckCircle, Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BidData {
  projectTitle: string;
  client: string;
  scopeSummary: string;
  estimatedCost: number;
  timeline: string;
  paymentTerms: string;
  legalClauses: string[];
  signatureBlock: string;
}

export default function BidGenerator() {
  const [formData, setFormData] = useState({
    clientName: "",
    projectTitle: "",
    location: "",
    projectScope: "",
    estimatedCost: "",
    timelineEstimate: "",
    paymentStructure: "25% upfront, 50% mid-project, 25% upon completion",
    legalLanguagePreference: "formal"
  });

  const [bidData, setBidData] = useState<BidData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateBid = async () => {
    if (!formData.clientName || !formData.projectTitle || !formData.location || !formData.projectScope || !formData.estimatedCost) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to generate a bid.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-bid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: formData.clientName,
          projectTitle: formData.projectTitle,
          location: formData.location,
          projectScope: formData.projectScope,
          estimatedCost: parseFloat(formData.estimatedCost),
          timelineEstimate: formData.timelineEstimate,
          paymentStructure: formData.paymentStructure,
          legalLanguagePreference: formData.legalLanguagePreference
        })
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📄 Bid Generator Pro</h1>
          <p className="text-gray-600">Create professional bid proposals with structured payment schedules and legal clauses</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Bid Information
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
                  placeholder="6-8 weeks"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="paymentStructure">Payment Structure</Label>
              <Select 
                value={formData.paymentStructure} 
                onValueChange={(value) => handleInputChange("paymentStructure", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment structure" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25% upfront, 50% mid-project, 25% upon completion">25% upfront, 50% mid-project, 25% upon completion</SelectItem>
                  <SelectItem value="30% upfront, 40% mid-project, 30% upon completion">30% upfront, 40% mid-project, 30% upon completion</SelectItem>
                  <SelectItem value="50% upfront, 50% upon completion">50% upfront, 50% upon completion</SelectItem>
                  <SelectItem value="20% upfront, 30% at rough-in, 30% at drywall, 20% upon completion">20% upfront, 30% at rough-in, 30% at drywall, 20% upon completion</SelectItem>
                </SelectContent>
              </Select>
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
                        ${bidData.totalBid.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{bidData.summaryMarkdown}</p>
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
                    {bidData.lineItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <div className="font-medium">{item.description}</div>
                          <Badge variant="outline">{item.category}</Badge>
                        </div>
                        <span className="font-semibold">${item.amount.toLocaleString()}</span>
                      </div>
                    ))}
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
                    {bidData.paymentSchedule.map((payment, idx) => (
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
                    ))}
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
                    {bidData.contractClauses.map((clause, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>{clause}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Warnings */}
              {bidData.warnings.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-600">
                      <AlertTriangle className="h-5 w-5" />
                      Important Notices
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {bidData.warnings.map((warning, idx) => (
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
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Calendar, DollarSign, CheckCircle, Copy, Download } from "lucide-react";
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
        <div className="bg-blue-100 p-2 rounded-lg">
          <FileText className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">📝 Bid Generator Pro</h1>
          <p className="text-gray-600">Create professional, legally-sound bid proposals with AI assistance</p>
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
                <Label htmlFor="timelineEstimate">Timeline Estimate</Label>
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
              {/* Project Summary */}
              <Card className="bg-white rounded-lg shadow-md p-4 mb-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    {bidData.projectTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <strong>Client:</strong> {bidData.client}
                    </div>
                    <div>
                      <strong>Project Scope:</strong>
                      <p className="mt-1 text-gray-700">{bidData.scopeSummary}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <span className="text-2xl font-bold text-green-600">
                        ${bidData.estimatedCost.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline & Terms */}
              <Card className="bg-white rounded-lg shadow-md p-4 mb-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Timeline & Payment Terms
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <strong>Project Timeline:</strong> {bidData.timeline}
                    </div>
                    <div>
                      <strong>Payment Terms:</strong>
                      <p className="mt-1 text-gray-700">{bidData.paymentTerms}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Legal Clauses */}
              <Card className="bg-white rounded-lg shadow-md p-4 mb-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Contract Terms & Legal Clauses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {bidData.legalClauses.map((clause, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{clause}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Signature Section */}
              <Card className="bg-white rounded-lg shadow-md p-4 mb-4">
                <CardHeader>
                  <CardTitle>Signature Section</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 font-mono bg-gray-50 p-3 rounded">
                    {bidData.signatureBlock}
                  </p>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(bidData, null, 2));
                    toast({
                      title: "Copied to Clipboard",
                      description: "Bid proposal has been copied to your clipboard.",
                    });
                  }}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy to Clipboard
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    toast({
                      title: "Feature Coming Soon",
                      description: "PDF export will be available in the next update.",
                    });
                  }}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export PDF
                </Button>
              </div>
            </>
          )}

          {!bidData && (
            <Card className="bg-gray-50">
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Fill out the form and click "Generate Professional Bid" to create your proposal.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
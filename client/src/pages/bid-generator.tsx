import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Calendar, DollarSign, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BidData {
  topInsight: string;
  lineItems: Array<{
    description: string;
    amount: number;
    category: string;
  }>;
  paymentSchedule: Array<{
    milestone: string;
    dueDate: string;
    amount: string;
    percentage: number;
  }>;
  contractClauses: string[];
  totalBid: number;
  summaryMarkdown: string;
  warnings: string[];
  projectTimeline: string;
  legalDisclaimer: string;
}

export default function BidGenerator() {
  const [formData, setFormData] = useState({
    clientName: "",
    contractorName: "",
    projectDescription: "",
    totalBid: "",
    startDate: "",
    paymentTerms: "30% upfront, 40% mid-project, 30% on completion",
    inclusions: "All materials and labor as specified",
    exclusions: "Permits and inspections unless noted",
    optionalClauses: [] as string[]
  });

  const [bidData, setBidData] = useState<BidData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateBid = async () => {
    if (!formData.clientName || !formData.contractorName || !formData.projectDescription || !formData.totalBid || !formData.startDate) {
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
          ...formData,
          totalBid: parseFloat(formData.totalBid),
          optionalClauses: formData.optionalClauses || []
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
                  placeholder="ABC Company LLC"
                />
              </div>
              <div>
                <Label htmlFor="contractorName">Contractor Name *</Label>
                <Input
                  id="contractorName"
                  value={formData.contractorName}
                  onChange={(e) => handleInputChange("contractorName", e.target.value)}
                  placeholder="Your Construction Company"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="projectDescription">Project Description *</Label>
              <Textarea
                id="projectDescription"
                value={formData.projectDescription}
                onChange={(e) => handleInputChange("projectDescription", e.target.value)}
                placeholder="Complete kitchen renovation including cabinets, countertops, flooring..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="totalBid">Total Bid Amount *</Label>
                <Input
                  id="totalBid"
                  type="number"
                  value={formData.totalBid}
                  onChange={(e) => handleInputChange("totalBid", e.target.value)}
                  placeholder="50000"
                />
              </div>
              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="paymentTerms">Payment Terms</Label>
              <Input
                id="paymentTerms"
                value={formData.paymentTerms}
                onChange={(e) => handleInputChange("paymentTerms", e.target.value)}
                placeholder="30% upfront, 40% mid-project, 30% on completion"
              />
            </div>

            <div>
              <Label htmlFor="inclusions">Inclusions</Label>
              <Textarea
                id="inclusions"
                value={formData.inclusions}
                onChange={(e) => handleInputChange("inclusions", e.target.value)}
                placeholder="All materials, labor, permits, cleanup..."
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="exclusions">Exclusions</Label>
              <Textarea
                id="exclusions"
                value={formData.exclusions}
                onChange={(e) => handleInputChange("exclusions", e.target.value)}
                placeholder="Electrical permits, structural modifications..."
                rows={2}
              />
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
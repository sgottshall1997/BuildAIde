import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calculator, 
  Shield, 
  History, 
  FileText, 
  Download,
  Mail,
  Users,
  Copy,
  Wand2,
  Clock,
  Phone,
  ChevronRight,
  MessageSquare,
  Star,
  ThumbsUp
} from "lucide-react";

export function InteractiveCostBreakdownAssistant() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <Calculator className="h-5 w-5 mr-2" />
          <CardTitle className="text-lg">Interactive Cost Breakdown Assistant</CardTitle>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Get intelligent insights on cost allocation and optimization opportunities
        </p>
      </CardHeader>
      <CardContent>
        <Button className="w-full bg-blue-600 hover:bg-blue-700">
          <Calculator className="h-4 w-4 mr-2" />
          Explain My Cost Breakdown
        </Button>
      </CardContent>
    </Card>
  );
}

export function AIPoweredRiskAssessment() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          <CardTitle className="text-lg">AI-Powered Risk Assessment</CardTitle>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Get intelligent insights on potential project risks and mitigation strategies
        </p>
      </CardHeader>
      <CardContent>
        <Button className="w-full bg-blue-600 hover:bg-blue-700">
          <Shield className="h-4 w-4 mr-2" />
          Generate Risk Assessment
        </Button>
      </CardContent>
    </Card>
  );
}

export function PastProjectsComparison() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <History className="h-5 w-5 mr-2" />
          <CardTitle className="text-lg">Past Projects with Similar Specs</CardTitle>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Compare this estimate with Spence the Builder previous similar projects
        </p>
      </CardHeader>
      <CardContent>
        <Button className="w-full bg-blue-600 hover:bg-blue-700">
          Find Similar Past Projects
        </Button>
      </CardContent>
    </Card>
  );
}

export function ProfessionalBidPreview() {
  return (
    <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            <CardTitle className="text-lg">Professional Bid Preview</CardTitle>
          </div>
        </div>
        <p className="text-sm text-blue-600 dark:text-blue-400">
          Each section can be enhanced with AI-powered professional language
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Project Proposal Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Project Proposal</h3>
            <p className="text-gray-600 dark:text-gray-400">basement-waterproofing - sq ft</p>
          </div>
          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
            Ready for Client
          </Badge>
        </div>

        {/* Cost Summary */}
        <div className="grid grid-cols-4 gap-4 py-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">$10,500</div>
            <div className="text-sm text-gray-600">Materials</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">$9,000</div>
            <div className="text-sm text-gray-600">Labor</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">$1,500</div>
            <div className="text-sm text-gray-600">Permits</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">$30,000</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
        </div>

        {/* Project Overview */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">Project Overview</h4>
            <Button variant="ghost" size="sm">
              <Wand2 className="h-4 w-4 mr-1" />
              Improve with AI
            </Button>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            We will complete your basement-waterproofing with professional craftsmanship and attention to detail. This 0 square foot project will be completed using standard quality materials within the rush timeframe.
          </p>
        </div>

        {/* Scope of Work */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">Scope of Work</h4>
            <Button variant="ghost" size="sm">
              <Wand2 className="h-4 w-4 mr-1" />
              Improve with AI
            </Button>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            Our team will handle all aspects of the project including material procurement, installation, cleanup, and final inspection. We will coordinate with local inspectors to ensure all work meets current building codes. Project includes all necessary permits and fees.
          </p>
        </div>

        {/* Timeline & Schedule */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Timeline & Schedule
            </h4>
            <Button variant="ghost" size="sm">
              <Wand2 className="h-4 w-4 mr-1" />
              Improve with AI
            </Button>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            Project is scheduled to begin on the agreed start date and will be completed within rush. Weather delays and change orders may affect the completion date. We will provide weekly progress updates throughout the project.
          </p>
        </div>

        {/* Terms & Conditions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">Terms & Conditions</h4>
            <Button variant="ghost" size="sm">
              <Wand2 className="h-4 w-4 mr-1" />
              Improve with AI
            </Button>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            Payment is due in installments: 25% deposit to begin work, 50% at project midpoint, and 25% upon completion. All materials are warranted for one year. Labor warranty is provided for two years from project completion.
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Contact Information</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium text-blue-700 dark:text-blue-300">Shall's Construction</div>
              <div className="text-gray-600 dark:text-gray-400">Licensed & Insured</div>
              <div className="text-gray-600 dark:text-gray-400">License #: CON-2024-001</div>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end text-gray-600 dark:text-gray-400">
                <Phone className="h-4 w-4 mr-1" />
                Phone: (555) 123-4567
              </div>
              <div className="text-gray-600 dark:text-gray-400">Email: info@shallsconstruction.com</div>
              <div className="text-gray-600 dark:text-gray-400">www.shallsconstruction.com</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Export as PDF
          </Button>
          <Button variant="outline">
            <Clock className="h-4 w-4 mr-2" />
            Send to Client
          </Button>
          <Button variant="outline">
            <Users className="h-4 w-4 mr-2" />
            Share with Team
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function ExportAndShare() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <Download className="h-5 w-5 mr-2" />
          <CardTitle className="text-lg">Export & Share</CardTitle>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Export your estimate as PDF or spreadsheet, or draft a professional email
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pro Tip */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
          <div className="flex items-start">
            <Wand2 className="h-4 w-4 text-yellow-600 mr-2 mt-0.5" />
            <div className="text-sm">
              <span className="font-medium text-yellow-800 dark:text-yellow-200">Pro Tip:</span>
              <span className="text-yellow-700 dark:text-yellow-300 ml-1">
                Use the buttons below to copy your estimate details, improve wording with AI, or export professional documents.
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" className="text-sm">
            <Copy className="h-4 w-4 mr-1" />
            Copy to Clipboard
          </Button>
          <Button variant="outline" className="text-sm">
            <Wand2 className="h-4 w-4 mr-1" />
            Improve Wording (AI)
          </Button>
          <Button variant="outline" className="text-sm">
            <Mail className="h-4 w-4 mr-1" />
            Draft Email
          </Button>
        </div>

        {/* Export Summary */}
        <div className="space-y-3">
          <h4 className="font-medium">Export Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-600 dark:text-gray-400">Project Type</div>
              <div className="font-medium">Basement-Waterproofing</div>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-400">Area</div>
              <div className="font-medium">200 sq ft</div>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-400">Quality</div>
              <div className="font-medium">Standard</div>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-400">Total Cost</div>
              <div className="font-medium text-purple-600">$30,000</div>
            </div>
          </div>
        </div>

        {/* Export Format */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Export Format</label>
          <Select defaultValue="">
            <SelectTrigger>
              <SelectValue placeholder="Choose export format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF Document</SelectItem>
              <SelectItem value="excel">Excel Spreadsheet</SelectItem>
              <SelectItem value="csv">CSV File</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full bg-blue-600 hover:bg-blue-700">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>

        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
          <Wand2 className="h-3 w-3 mr-1" />
          AI beta features - Results may vary. Professional judgment recommended.
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <Button variant="outline">
            Create New Estimate
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Return to Dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function ClientFeedback() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          <CardTitle className="text-lg">How was your estimate experience?</CardTitle>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Help us improve our service by sharing your feedback
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Helpfulness */}
        <div>
          <label className="text-sm font-medium mb-2 block">Was this estimate helpful?</label>
          <div className="flex space-x-4">
            <Button variant="outline" size="sm">
              <ThumbsUp className="h-4 w-4 mr-1" />
              Yes, helpful
            </Button>
            <Button variant="outline" size="sm">
              Not helpful
            </Button>
          </div>
        </div>

        {/* Rating */}
        <div>
          <label className="text-sm font-medium mb-2 block">Rate your overall experience</label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className="h-5 w-5 text-gray-300 hover:text-yellow-400 cursor-pointer"
              />
            ))}
          </div>
        </div>

        {/* Comments */}
        <div>
          <label className="text-sm font-medium mb-2 block">Additional comments (optional)</label>
          <Textarea 
            placeholder="Tell us what you liked or how we can improve..."
            rows={3}
          />
        </div>

        <Button className="w-full bg-blue-600 hover:bg-blue-700">
          <MessageSquare className="h-4 w-4 mr-2" />
          Submit Feedback
        </Button>
      </CardContent>
    </Card>
  );
}
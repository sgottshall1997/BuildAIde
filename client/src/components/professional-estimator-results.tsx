import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChevronDown, 
  ChevronRight, 
  Calculator, 
  MessageCircle, 
  TrendingUp, 
  AlertTriangle, 
  FileText, 
  Download, 
  Mail, 
  Share2, 
  Clock, 
  DollarSign,
  PieChart,
  BarChart3,
  Target,
  Send,
  Copy,
  Wand2,
  ThumbsUp,
  ThumbsDown,
  Star,
  MessageSquare
} from "lucide-react";

interface EstimateData {
  id?: number;
  projectType: string;
  area: number;
  materialQuality: string;
  timeline: string;
  description: string;
  zipCode?: string;
  estimatedCost: number;
  materialCost: number;
  laborCost: number;
  permitCost: number;
  softCosts: number;
  demolitionRequired: boolean;
  permitNeeded: boolean;
  laborWorkers: number;
  laborRate: number;
  createdAt?: string;
}

interface ProfessionalEstimatorResultsProps {
  estimate: EstimateData;
  onBackToForm: () => void;
}

export default function ProfessionalEstimatorResults({ estimate, onBackToForm }: ProfessionalEstimatorResultsProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['materials']);
  const [activeTab, setActiveTab] = useState('category');
  const [chatInput, setChatInput] = useState('');
  const [exportFormat, setExportFormat] = useState('');
  const [feedbackRating, setFeedbackRating] = useState<number | null>(null);
  const [feedbackComment, setFeedbackComment] = useState('');

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  // Calculate detailed breakdowns
  const equipmentCost = Math.round(estimate.estimatedCost * 0.10);
  const overheadCost = Math.round(estimate.estimatedCost * 0.12);
  const profitCost = Math.round(estimate.estimatedCost * 0.08);

  // Material breakdown
  const materialBreakdown = [
    { name: "Lumber & Framing", cost: 1250, description: "500 board feet • Structural lumber and framing materials" },
    { name: "Drywall & Insulation", cost: 1000, description: "400 sq ft • Drywall sheets, mud, tape, insulation" },
    { name: "Flooring Materials", cost: 1000, description: "200 sq ft • Flooring and underlayment" },
    { name: "Paint & Finishes", cost: 750, description: "10 gallons • Primer, paint, trim materials" },
    { name: "Hardware & Fasteners", cost: 500, description: "1 misc • Nails, screws, brackets" },
    { name: "Electrical Materials", cost: 500, description: "1 misc • Wire, outlets, switches, fixtures" }
  ];

  // Labor breakdown
  const laborBreakdown = [
    { name: "Framing & Structural", cost: 648, description: "24 hours • Rough framing and structural work" },
    { name: "Drywall Installation", cost: 540, description: "16 hours • Hang, mud, sand, prime" },
    { name: "Finish Carpentry", cost: 432, description: "12 hours • Trim, doors, baseboards" },
    { name: "Painting", cost: 324, description: "10 hours • Prime and paint all surfaces" },
    { name: "Final Installation", cost: 216, description: "8 hours • Hardware, fixtures, cleanup" }
  ];

  // Permit breakdown
  const permitBreakdown = [
    { name: "Building Permit", cost: 300, description: "1 permit • Main construction permit" },
    { name: "Electrical Permit", cost: 125, description: "1 permit • Electrical work permit" },
    { name: "Plumbing Permit", cost: 75, description: "1 permit • Plumbing work permit" }
  ];

  // Equipment & Overhead breakdown
  const equipmentBreakdown = [
    { name: "Tool Rental", cost: 6702, description: "10 days • Equipment and tool rental" },
    { name: "Waste Disposal", cost: 4468, description: "3 loads • Dumpster and disposal fees" },
    { name: "Project Management", cost: 5585, description: "20 hours • Supervision and coordination" },
    { name: "Insurance & Overhead", cost: 5585, description: "1 project • Insurance, overhead, profit margin" }
  ];

  const costDistribution = [
    { name: "Materials", amount: estimate.materialCost, percentage: 35, color: "bg-blue-500" },
    { name: "Labor", amount: estimate.laborCost, percentage: 30, color: "bg-red-500" },
    { name: "Permits", amount: estimate.permitCost, percentage: 5, color: "bg-orange-500" },
    { name: "Equipment", amount: equipmentCost, percentage: 10, color: "bg-green-500" },
    { name: "Overhead", amount: overheadCost, percentage: 12, color: "bg-purple-500" },
    { name: "Profit", amount: profitCost, percentage: 8, color: "bg-cyan-500" }
  ];

  const quickQuestions = [
    "Why are materials so expensive?",
    "How can I reduce labor costs?",
    "What if I change the timeline?",
    "Can you explain the permit costs?"
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Professional Project Estimator</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Generate detailed project estimates with AI-powered cost analysis, comprehensive 
          breakdowns, and intelligent recommendations.
        </p>
      </div>

      {/* Detailed Cost Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Detailed Cost Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Materials Section */}
          <div className="rounded-lg border border-blue-200 bg-blue-50">
            <Button
              variant="ghost"
              onClick={() => toggleSection('materials')}
              className="w-full justify-between p-4 h-auto hover:bg-transparent"
            >
              <div className="flex items-center gap-3">
                {expandedSections.includes('materials') ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                <span className="font-medium">Materials</span>
              </div>
              <span className="font-bold text-lg text-blue-600">
                ${estimate.materialCost.toLocaleString()}
              </span>
            </Button>

            {expandedSections.includes('materials') && (
              <div className="px-4 pb-4 space-y-2">
                {materialBreakdown.map((item, index) => (
                  <div key={index} className="flex justify-between items-start py-2 border-t border-gray-200 first:border-t-0">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm">{item.name}</span>
                        <span className="font-semibold">${item.cost.toLocaleString()}</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        {item.description}
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="pt-2 mt-3 border-t-2 border-gray-300">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Subtotal</span>
                    <span className="font-bold text-lg text-blue-600">
                      ${estimate.materialCost.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Labor Section */}
          <div className="rounded-lg border border-green-200 bg-green-50">
            <Button
              variant="ghost"
              onClick={() => toggleSection('labor')}
              className="w-full justify-between p-4 h-auto hover:bg-transparent"
            >
              <div className="flex items-center gap-3">
                {expandedSections.includes('labor') ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                <span className="font-medium">Labor</span>
              </div>
              <span className="font-bold text-lg text-green-600">
                ${estimate.laborCost.toLocaleString()}
              </span>
            </Button>

            {expandedSections.includes('labor') && (
              <div className="px-4 pb-4 space-y-2">
                {laborBreakdown.map((item, index) => (
                  <div key={index} className="flex justify-between items-start py-2 border-t border-gray-200 first:border-t-0">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm">{item.name}</span>
                        <span className="font-semibold">${item.cost.toLocaleString()}</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        {item.description}
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="pt-2 mt-3 border-t-2 border-gray-300">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Subtotal</span>
                    <span className="font-bold text-lg text-green-600">
                      ${estimate.laborCost.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Permits & Fees Section */}
          <div className="rounded-lg border border-orange-200 bg-orange-50">
            <Button
              variant="ghost"
              onClick={() => toggleSection('permits')}
              className="w-full justify-between p-4 h-auto hover:bg-transparent"
            >
              <div className="flex items-center gap-3">
                {expandedSections.includes('permits') ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                <span className="font-medium">Permits & Fees</span>
              </div>
              <span className="font-bold text-lg text-orange-600">
                ${estimate.permitCost.toLocaleString()}
              </span>
            </Button>

            {expandedSections.includes('permits') && (
              <div className="px-4 pb-4 space-y-2">
                {permitBreakdown.map((item, index) => (
                  <div key={index} className="flex justify-between items-start py-2 border-t border-gray-200 first:border-t-0">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm">{item.name}</span>
                        <span className="font-semibold">${item.cost.toLocaleString()}</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        {item.description}
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="pt-2 mt-3 border-t-2 border-gray-300">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Subtotal</span>
                    <span className="font-bold text-lg text-orange-600">
                      ${estimate.permitCost.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Equipment & Overhead Section */}
          <div className="rounded-lg border border-purple-200 bg-purple-50">
            <Button
              variant="ghost"
              onClick={() => toggleSection('equipment')}
              className="w-full justify-between p-4 h-auto hover:bg-transparent"
            >
              <div className="flex items-center gap-3">
                {expandedSections.includes('equipment') ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                <span className="font-medium">Equipment & Overhead</span>
              </div>
              <span className="font-bold text-lg text-purple-600">
                ${(equipmentCost + overheadCost + profitCost).toLocaleString()}
              </span>
            </Button>

            {expandedSections.includes('equipment') && (
              <div className="px-4 pb-4 space-y-2">
                {equipmentBreakdown.map((item, index) => (
                  <div key={index} className="flex justify-between items-start py-2 border-t border-gray-200 first:border-t-0">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm">{item.name}</span>
                        <span className="font-semibold">${item.cost.toLocaleString()}</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        {item.description}
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="pt-2 mt-3 border-t-2 border-gray-300">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Subtotal</span>
                    <span className="font-bold text-lg text-purple-600">
                      ${(equipmentCost + overheadCost + profitCost).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Project Total */}
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">Project Total</span>
              <span className="text-2xl font-bold text-purple-600">
                ${estimate.estimatedCost.toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Continue the Conversation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Continue the Conversation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <p className="text-sm font-medium text-blue-900 mb-2">Your Original Request:</p>
            <p className="text-blue-800 italic">"{estimate.description}"</p>
          </div>
          <p className="text-gray-600 mb-4">Have questions about your estimate? Ask Spence the Builder!</p>
          
          {/* Conversational Estimator Assistant */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-green-900 flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Conversational Estimator Assistant
              </h3>
              <Badge variant="secondary" className="bg-green-100 text-green-800">AI Powered</Badge>
            </div>
            <p className="text-sm text-green-800 mb-4">
              Great! I see you have your estimate ready. Feel free to ask me any questions about your project costs, timeline, or materials. For example: 'Why are materials so expensive?' or 'How can I reduce labor costs?'
            </p>
            
            <div className="mb-4">
              <p className="text-sm font-medium text-green-900 mb-2">💡 Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question, index) => (
                  <Button 
                    key={index}
                    variant="outline" 
                    size="sm"
                    className="text-xs border-green-300 hover:bg-green-100"
                    onClick={() => setChatInput(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Textarea
                placeholder="Ask a follow-up question..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1"
                rows={1}
              />
              <Button className="bg-green-600 hover:bg-green-700">
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
              <span>💡</span>
              Try: "350 sq ft kitchen remodel with premium finishes" or "What if I change to luxury materials?"
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Cost Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Interactive Cost Breakdown
          </CardTitle>
          <p className="text-sm text-gray-600">Get intelligent insights on cost allocation and optimization opportunities</p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="category">By Category</TabsTrigger>
              <TabsTrigger value="phase">By Phase</TabsTrigger>
            </TabsList>
            
            <TabsContent value="category" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Cost Distribution Pie Chart */}
                <div>
                  <h3 className="font-semibold mb-4">Cost Distribution</h3>
                  <div className="relative w-64 h-64 mx-auto mb-4">
                    {/* Simplified pie chart representation */}
                    <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-500 via-red-500 via-orange-500 via-green-500 via-purple-500 to-cyan-500 flex items-center justify-center">
                      <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-xl font-bold">0 : ${estimate.estimatedCost.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Legend labels around the circle */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
                      <span className="text-xs text-blue-600">Materials: 35%</span>
                    </div>
                    <div className="absolute top-1/4 right-0 transform translate-x-4">
                      <span className="text-xs text-red-600">Labor: 30%</span>
                    </div>
                    <div className="absolute bottom-1/4 right-0 transform translate-x-4">
                      <span className="text-xs text-orange-600">Permits: 5%</span>
                    </div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-4">
                      <span className="text-xs text-green-600">Equipment: 10%</span>
                    </div>
                    <div className="absolute bottom-1/4 left-0 transform -translate-x-4">
                      <span className="text-xs text-purple-600">Overhead: 12%</span>
                    </div>
                    <div className="absolute top-1/4 left-0 transform -translate-x-4">
                      <span className="text-xs text-cyan-600">Profit: 8%</span>
                    </div>
                  </div>
                </div>
                
                {/* Detailed Breakdown */}
                <div>
                  <h3 className="font-semibold mb-4">Detailed Breakdown</h3>
                  <div className="space-y-3">
                    {costDistribution.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                          <span className="text-sm font-medium">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${item.amount.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">{item.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Interactive Cost Breakdown Assistant */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Interactive Cost Breakdown Assistant
          </CardTitle>
          <p className="text-sm text-gray-600">Get intelligent insights on cost allocation and optimization opportunities</p>
        </CardHeader>
        <CardContent>
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            <Calculator className="w-4 h-4 mr-2" />
            Explain My Cost Breakdown
          </Button>
        </CardContent>
      </Card>

      {/* AI-Powered Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            AI-Powered Risk Assessment
          </CardTitle>
          <p className="text-sm text-gray-600">Get intelligent insights on potential project risks and mitigation strategies</p>
        </CardHeader>
        <CardContent>
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Generate Risk Assessment
          </Button>
        </CardContent>
      </Card>

      {/* Past Projects with Similar Specs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Past Projects with Similar Specs
          </CardTitle>
          <p className="text-sm text-gray-600">Compare this estimate with Spence the Builder previous similar projects</p>
        </CardHeader>
        <CardContent>
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            Find Similar Past Projects
          </Button>
        </CardContent>
      </Card>

      {/* Professional Bid Preview */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Professional Bid Preview
          </CardTitle>
          <p className="text-sm text-blue-600">Each section can be enhanced with AI-powered professional language</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Project Proposal Header */}
          <div className="bg-white p-6 rounded-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold">Project Proposal</h3>
                <p className="text-sm text-gray-600">{estimate.projectType} - {estimate.area} sq ft</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Ready for Client</Badge>
            </div>
            
            {/* Cost Summary */}
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">${(estimate.materialCost / 1000).toFixed(1)}k</div>
                <div className="text-sm text-gray-600">Materials</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">${(estimate.laborCost / 1000).toFixed(1)}k</div>
                <div className="text-sm text-gray-600">Labor</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">${(estimate.permitCost / 1000).toFixed(1)}k</div>
                <div className="text-sm text-gray-600">Permits</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">${(estimate.estimatedCost / 1000).toFixed(0)}k</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
          </div>

          {/* Project Overview */}
          <div className="bg-white p-6 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold">Project Overview</h4>
              <Button variant="ghost" size="sm">
                <Wand2 className="w-3 h-3 mr-1" />
                Improve with AI
              </Button>
            </div>
            <p className="text-sm text-gray-700">
              We will complete your {estimate.projectType} with professional craftsmanship and attention to detail. 
              This {estimate.area} square foot project will be completed using {estimate.materialQuality} quality materials 
              within the {estimate.timeline} timeframe.
            </p>
          </div>

          {/* Scope of Work */}
          <div className="bg-white p-6 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold">Scope of Work</h4>
              <Button variant="ghost" size="sm">
                <Wand2 className="w-3 h-3 mr-1" />
                Improve with AI
              </Button>
            </div>
            <p className="text-sm text-gray-700">
              Our team will handle all aspects of the project including material procurement, installation, cleanup, 
              and final inspection. We will coordinate with local inspectors to ensure all work meets current building codes. 
              Project includes all necessary permits and fees.
            </p>
          </div>

          {/* Timeline & Schedule */}
          <div className="bg-white p-6 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold">Timeline & Schedule</h4>
              <Button variant="ghost" size="sm">
                <Wand2 className="w-3 h-3 mr-1" />
                Improve with AI
              </Button>
            </div>
            <p className="text-sm text-gray-700">
              Project is scheduled to begin on the agreed start date and will be completed within {estimate.timeline}. 
              Weather delays and change orders may affect the completion date. We will provide weekly progress updates 
              throughout the project.
            </p>
          </div>

          {/* Terms & Conditions */}
          <div className="bg-white p-6 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold">Terms & Conditions</h4>
              <Button variant="ghost" size="sm">
                <Wand2 className="w-3 h-3 mr-1" />
                Improve with AI
              </Button>
            </div>
            <p className="text-sm text-gray-700">
              Payment is due in installments: 25% deposit to begin work, 50% at project midpoint, and 25% upon completion. 
              All materials are warranted for one year. Labor warranty is provided for two years from project completion.
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-blue-100 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Contact Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-blue-800">Shall's Construction</p>
                <p className="text-blue-700">Licensed & Insured</p>
                <p className="text-blue-700">License #: CON-2024-001</p>
              </div>
              <div className="text-right">
                <p className="text-blue-700">Phone: (555) 123-4567</p>
                <p className="text-blue-700">Email: info@shallsconstruction.com</p>
                <p className="text-blue-700">www.shallsconstruction.com</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Export as PDF
            </Button>
            <Button variant="outline" className="flex-1">
              <Clock className="w-4 h-4 mr-2" />
              Send to Client
            </Button>
            <Button variant="outline" className="flex-1">
              <Share2 className="w-4 h-4 mr-2" />
              Share with Team
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Export & Share */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export & Share
          </CardTitle>
          <p className="text-sm text-gray-600">Export your estimate as PDF or spreadsheet, or draft a professional email</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
            <p className="text-sm text-yellow-800 flex items-center gap-2">
              <span>💡</span>
              <strong>Pro Tip:</strong> Use the buttons below to copy your estimate details, improve wording with AI, or export professional documents.
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1">
              <Copy className="w-4 h-4 mr-2" />
              Copy to Clipboard
            </Button>
            <Button variant="outline" className="flex-1">
              <Wand2 className="w-4 h-4 mr-2" />
              Improve Wording (AI)
            </Button>
            <Button variant="outline" className="flex-1">
              <Mail className="w-4 h-4 mr-2" />
              Draft Email
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium mb-2">Export Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Project Type</span>
                  <span className="capitalize">{estimate.projectType.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Area</span>
                  <span>{estimate.area} sq ft</span>
                </div>
                <div className="flex justify-between">
                  <span>Quality</span>
                  <span className="capitalize">{estimate.materialQuality}</span>
                </div>
                <div className="flex justify-between font-semibold text-blue-600">
                  <span>Total Cost</span>
                  <span>${estimate.estimatedCost.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Export Format</h4>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose export format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                  <SelectItem value="word">Word Document</SelectItem>
                  <SelectItem value="email">Email Draft</SelectItem>
                </SelectContent>
              </Select>
              <Button className="w-full mt-2 bg-blue-600 hover:bg-blue-700">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="text-center text-xs text-gray-500">
            <span>⚠️</span> AI beta features - Results may vary. Professional judgment recommended.
          </div>

          <div className="flex gap-3">
            <Button onClick={onBackToForm} className="bg-gray-600 hover:bg-gray-700">
              Create New Estimate
            </Button>
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
              Return to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            How was your estimate experience?
          </CardTitle>
          <p className="text-sm text-gray-600">Help us improve our service by sharing your feedback</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Was this estimate helpful?</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <ThumbsUp className="w-4 h-4 mr-1" />
                Yes, helpful
              </Button>
              <Button variant="outline" size="sm">
                <ThumbsDown className="w-4 h-4 mr-1" />
                Not helpful
              </Button>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Rate your overall experience</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  variant="ghost"
                  size="sm"
                  className="p-1"
                  onClick={() => setFeedbackRating(star)}
                >
                  <Star className={`w-5 h-5 ${feedbackRating && star <= feedbackRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                </Button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Additional comments (optional)</p>
            <Textarea
              placeholder="Tell us what you liked or how we can improve..."
              value={feedbackComment}
              onChange={(e) => setFeedbackComment(e.target.value)}
              rows={3}
            />
          </div>

          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            <Send className="w-4 h-4 mr-2" />
            Submit Feedback
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
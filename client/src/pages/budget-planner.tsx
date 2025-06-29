import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  PieChart,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Target,
  Sparkles,
  MessageCircle,
  Send,
  Bot
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ResultsExport } from "@/components/ui/results-export";
import { 
  useFieldValidation, 
  validationRules, 
  FormValidationWrapper, 
  FieldError 
} from "@/components/ui/form-validation";
import DemoFeedback from "@/components/demo-feedback";
import FeedbackButton from "@/components/feedback-button";
import { useDemoMode } from "@/hooks/useDemoMode";

interface BudgetEstimate {
  totalCost: number;
  breakdown: {
    materials: number;
    labor: number;
    permits: number;
    upgrades: number;
    contingency: number;
  };
  monthlyForecast: {
    month: number;
    description: string;
    cost: number;
    cumulative: number;
  }[];
  recommendations: string[];
  timeline: number; // weeks
}

interface Upgrade {
  id: string;
  name: string;
  cost: number;
  description: string;
  category: string;
}

export default function BudgetPlanner() {
  const [estimate, setEstimate] = useState<BudgetEstimate | null>(null);
  const [selectedUpgrades, setSelectedUpgrades] = useState<string[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string>('');
  const [isGeneratingExplanation, setIsGeneratingExplanation] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{type: 'user' | 'ai', content: string}>>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const { toast } = useToast();
  const { isDemoMode } = useDemoMode();

  // Form validation setup
  const validationSchema = {
    projectType: [
      { validator: validationRules.required, message: 'Please select a project type' }
    ],
    squareFootage: [
      { validator: validationRules.required, message: 'Square footage is required' },
      { validator: validationRules.positiveNumber, message: 'Please enter a valid square footage' },
      { validator: validationRules.range(10, 50000), message: 'Square footage must be between 10 and 50,000' }
    ],
    materialQuality: [
      { validator: validationRules.required, message: 'Please select material quality' }
    ]
  };

  // Pre-filled demo values for better user experience
  const demoValues = isDemoMode ? {
    projectType: 'kitchen-midrange',
    squareFootage: '250',
    materialQuality: 'standard',
    timeline: 'moderate'
  } : {
    projectType: '',
    squareFootage: '',
    materialQuality: '',
    timeline: 'moderate'
  };

  const {
    values: formData,
    errors,
    touched,
    updateField,
    touchField,
    validateAllFields,
    reset
  } = useFieldValidation(demoValues);

  const projectTypes = [
    // Interior Renovations
    { id: 'kitchen-basic', name: 'Kitchen Remodel (Basic)', baseRate: 120, timeline: 6, category: 'Interior Renovations' },
    { id: 'kitchen-midrange', name: 'Kitchen Remodel (Midrange)', baseRate: 150, timeline: 8, category: 'Interior Renovations' },
    { id: 'kitchen-luxury', name: 'Kitchen Remodel (Luxury)', baseRate: 250, timeline: 12, category: 'Interior Renovations' },
    { id: 'bathroom-half', name: 'Half Bathroom Remodel', baseRate: 180, timeline: 4, category: 'Interior Renovations' },
    { id: 'bathroom-full', name: 'Full Bathroom Remodel', baseRate: 200, timeline: 6, category: 'Interior Renovations' },
    { id: 'bathroom-ensuite', name: 'Ensuite Bathroom Remodel', baseRate: 220, timeline: 8, category: 'Interior Renovations' },
    { id: 'full-interior', name: 'Full Interior Renovation', baseRate: 95, timeline: 16, category: 'Interior Renovations' },
    { id: 'basement-finishing', name: 'Basement Finishing', baseRate: 75, timeline: 10, category: 'Interior Renovations' },
    { id: 'basement-apartment', name: 'Basement Apartment', baseRate: 85, timeline: 12, category: 'Interior Renovations' },
    { id: 'attic-conversion', name: 'Attic Conversion', baseRate: 90, timeline: 8, category: 'Interior Renovations' },
    { id: 'garage-conversion', name: 'Garage Conversion', baseRate: 65, timeline: 6, category: 'Interior Renovations' },
    { id: 'home-office', name: 'Home Office Build-Out', baseRate: 80, timeline: 4, category: 'Interior Renovations' },
    { id: 'closet-expansion', name: 'Closet Expansion / Walk-In', baseRate: 45, timeline: 3, category: 'Interior Renovations' },
    { id: 'flooring-hardwood', name: 'Hardwood Flooring', baseRate: 15, timeline: 2, category: 'Interior Renovations' },
    { id: 'flooring-tile', name: 'Tile Flooring', baseRate: 12, timeline: 2, category: 'Interior Renovations' },
    { id: 'flooring-carpet', name: 'Carpet Installation', baseRate: 8, timeline: 1, category: 'Interior Renovations' },
    { id: 'interior-painting', name: 'Interior Painting', baseRate: 3, timeline: 2, category: 'Interior Renovations' },
    { id: 'drywall-repair', name: 'Drywall / Wall Reconfiguration', baseRate: 8, timeline: 3, category: 'Interior Renovations' },
    
    // Additions & Structural
    { id: 'room-addition', name: 'Room Addition', baseRate: 180, timeline: 14, category: 'Additions & Structural' },
    { id: 'second-story', name: 'Second Story Addition', baseRate: 220, timeline: 20, category: 'Additions & Structural' },
    { id: 'sunroom', name: 'Sunroom / Enclosed Porch', baseRate: 150, timeline: 8, category: 'Additions & Structural' },
    { id: 'adu-construction', name: 'ADU / Guest House Construction', baseRate: 200, timeline: 16, category: 'Additions & Structural' },
    { id: 'wall-removal', name: 'Load-Bearing Wall Removal', baseRate: 125, timeline: 2, category: 'Additions & Structural' },
    { id: 'foundation-repair', name: 'Foundation Repair', baseRate: 85, timeline: 6, category: 'Additions & Structural' },
    { id: 'roof-replacement', name: 'Roof Replacement', baseRate: 12, timeline: 3, category: 'Additions & Structural' },
    
    // Outdoor & Exterior Projects
    { id: 'deck-build', name: 'Deck / Patio Build', baseRate: 35, timeline: 4, category: 'Outdoor & Exterior' },
    { id: 'fence-installation', name: 'Fence Installation', baseRate: 25, timeline: 2, category: 'Outdoor & Exterior' },
    { id: 'exterior-painting', name: 'Exterior Painting / Siding', baseRate: 4, timeline: 3, category: 'Outdoor & Exterior' },
    { id: 'landscaping', name: 'Landscaping Overhaul', baseRate: 15, timeline: 4, category: 'Outdoor & Exterior' },
    { id: 'driveway', name: 'Driveway / Walkway Resurfacing', baseRate: 8, timeline: 2, category: 'Outdoor & Exterior' },
    { id: 'garage-build', name: 'Garage Build', baseRate: 45, timeline: 8, category: 'Outdoor & Exterior' },
    { id: 'outdoor-kitchen', name: 'Outdoor Kitchen / Firepit', baseRate: 95, timeline: 6, category: 'Outdoor & Exterior' },
    { id: 'pool-installation', name: 'Pool / Hot Tub Installation', baseRate: 165, timeline: 12, category: 'Outdoor & Exterior' },
    
    // Energy Efficiency & Systems
    { id: 'hvac-replacement', name: 'HVAC System Replacement', baseRate: 25, timeline: 3, category: 'Energy & Systems' },
    { id: 'window-replacement', name: 'Window / Door Replacement', baseRate: 18, timeline: 4, category: 'Energy & Systems' },
    { id: 'solar-installation', name: 'Solar Panel Installation', baseRate: 8, timeline: 2, category: 'Energy & Systems' },
    { id: 'insulation-upgrade', name: 'Insulation Upgrade', baseRate: 5, timeline: 2, category: 'Energy & Systems' },
    { id: 'electrical-upgrade', name: 'Electrical Panel / Rewiring', baseRate: 12, timeline: 4, category: 'Energy & Systems' },
    { id: 'plumbing-upgrade', name: 'Plumbing Upgrade', baseRate: 15, timeline: 6, category: 'Energy & Systems' },
    { id: 'smart-home', name: 'Smart Home System Installation', baseRate: 8, timeline: 3, category: 'Energy & Systems' }
  ];

  const materialQualities = [
    { id: 'basic', name: 'Basic / Budget-Friendly', multiplier: 0.8, description: 'Good quality, cost-effective choices' },
    { id: 'standard', name: 'Standard / Mid-Range', multiplier: 1.0, description: 'Quality materials, balanced approach' },
    { id: 'premium', name: 'Premium / High-End', multiplier: 1.4, description: 'Top-tier materials and finishes' },
    { id: 'luxury', name: 'Luxury / Custom', multiplier: 1.8, description: 'Custom work and luxury materials' }
  ];

  const availableUpgrades: Upgrade[] = [
    { id: 'smart-home', name: 'Smart Home Integration', cost: 3500, description: 'Smart lighting, thermostats, and security', category: 'Technology' },
    { id: 'energy-efficient', name: 'Energy Efficiency Package', cost: 5000, description: 'High-efficiency appliances and insulation', category: 'Efficiency' },
    { id: 'premium-fixtures', name: 'Premium Fixtures Upgrade', cost: 2800, description: 'High-end plumbing and electrical fixtures', category: 'Fixtures' },
    { id: 'custom-storage', name: 'Custom Storage Solutions', cost: 4200, description: 'Built-in storage and organization systems', category: 'Storage' },
    { id: 'extended-warranty', name: 'Extended Warranty Package', cost: 1200, description: '5-year extended warranty on materials and labor', category: 'Protection' }
  ];

  // Auto-calculate on page load in demo mode
  useEffect(() => {
    if (isDemoMode && formData.projectType && formData.squareFootage && formData.materialQuality) {
      // Delay calculation slightly to allow form to render
      setTimeout(() => {
        calculateBudget();
      }, 1000);
    }
  }, [isDemoMode]);

  const calculateBudget = async () => {
    if (!validateAllFields(validationSchema)) {
      toast({
        title: "Please complete all required fields",
        description: "Fill in project type, square footage, and material quality to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsCalculating(true);

    try {
      const selectedProject = projectTypes.find(p => p.id === formData.projectType);
      const selectedQuality = materialQualities.find(q => q.id === formData.materialQuality);
      
      if (!selectedProject || !selectedQuality) {
        throw new Error('Invalid project or quality selection');
      }

      const sqft = parseFloat(formData.squareFootage);
      const baseRate = selectedProject.baseRate;
      const qualityMultiplier = selectedQuality.multiplier;
      
      // Calculate base costs
      const baseCost = sqft * baseRate * qualityMultiplier;
      const materials = Math.round(baseCost * 0.45);
      const labor = Math.round(baseCost * 0.35);
      const permits = Math.round(baseCost * 0.08);
      const contingency = Math.round(baseCost * 0.12);
      
      // Add selected upgrades
      const upgradesCost = selectedUpgrades.reduce((total, upgradeId) => {
        const upgrade = availableUpgrades.find(u => u.id === upgradeId);
        return total + (upgrade ? upgrade.cost : 0);
      }, 0);

      const totalCost = materials + labor + permits + contingency + upgradesCost;
      const timeline = selectedProject.timeline;

      // Generate monthly forecast
      const monthlyForecast = [];
      const totalMonths = Math.ceil(timeline / 4); // Convert weeks to months
      
      // Planning phase
      monthlyForecast.push({
        month: 1,
        description: 'Planning & Permits',
        cost: permits + Math.round(totalCost * 0.05),
        cumulative: permits + Math.round(totalCost * 0.05)
      });

      // Construction phases
      const remainingCost = totalCost - monthlyForecast[0].cost;
      const monthlyConstructionCost = Math.round(remainingCost / (totalMonths - 1));
      
      for (let i = 2; i <= totalMonths; i++) {
        const isLastMonth = i === totalMonths;
        const monthCost: number = isLastMonth 
          ? totalCost - monthlyForecast[monthlyForecast.length - 1].cumulative
          : monthlyConstructionCost;
          
        monthlyForecast.push({
          month: i,
          description: i === totalMonths ? 'Final Phase & Completion' : `Construction Phase ${i - 1}`,
          cost: monthCost,
          cumulative: monthlyForecast[monthlyForecast.length - 1].cumulative + monthCost
        });
      }

      const budgetEstimate: BudgetEstimate = {
        totalCost,
        breakdown: {
          materials,
          labor,
          permits,
          upgrades: upgradesCost,
          contingency
        },
        monthlyForecast,
        recommendations: [
          'Set aside an additional 10-15% for unexpected costs',
          'Get multiple contractor quotes before starting',
          'Schedule permits 2-3 weeks before construction begins',
          'Consider phasing the project to spread costs over time'
        ],
        timeline
      };

      setEstimate(budgetEstimate);
      
      // Generate AI explanation
      generateAiExplanation(budgetEstimate, selectedProject, selectedQuality);
      
      toast({
        title: "Budget Plan Ready!",
        description: "Your comprehensive budget and timeline have been calculated.",
      });

    } catch (error) {
      toast({
        title: "Calculation Error",
        description: "Unable to calculate budget. Please check your inputs and try again.",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const handleUpgradeToggle = (upgradeId: string) => {
    setSelectedUpgrades(prev => 
      prev.includes(upgradeId) 
        ? prev.filter(id => id !== upgradeId)
        : [...prev, upgradeId]
    );
  };

  const generateAiExplanation = async (budgetEstimate: BudgetEstimate, project: any, quality: any) => {
    setIsGeneratingExplanation(true);
    setAiExplanation('');
    
    try {
      const response = await fetch('/api/budget-explanation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectType: project.name,
          totalCost: budgetEstimate.totalCost,
          squareFootage: formData.squareFootage,
          materialQuality: quality.name,
          breakdown: budgetEstimate.breakdown,
          timeline: budgetEstimate.timeline
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiExplanation(data.explanation);
      } else {
        throw new Error('Failed to generate explanation');
      }
    } catch (error) {
      console.error('AI explanation error:', error);
      setAiExplanation('Cost estimate generated successfully. Your project budget reflects current market rates for materials, labor, and typical project requirements. Consider getting multiple contractor quotes for final pricing.');
    } finally {
      setIsGeneratingExplanation(false);
    }
  };

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/homeowner-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: userMessage
        })
      });

      if (response.ok) {
        const data = await response.json();
        setChatMessages(prev => [...prev, { type: 'ai', content: data.response }]);
      } else {
        throw new Error('Failed to get AI response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages(prev => [...prev, { 
        type: 'ai', 
        content: 'I apologize, but I\'m having trouble responding right now. Please try asking your question again or contact support if the issue persists.' 
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const resetForm = () => {
    reset();
    setEstimate(null);
    setSelectedUpgrades([]);
    setAiExplanation('');
    setChatMessages([]);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 p-3 sm:p-6">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 sm:mb-3 px-2">💰 Unified Budget Planner</h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto px-4">
          Get detailed cost estimates and monthly budget forecasts for your renovation project in one comprehensive tool.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Input Form */}
        <div className="lg:col-span-2 space-y-6">
          <FormValidationWrapper errors={errors}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-blue-600" />
                  Project Details
                </CardTitle>
                <CardDescription>
                  Tell us about your project to get accurate budget planning
                </CardDescription>
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    💡 Enter your details to get an instant estimate with timeline and cost breakdown
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 md:col-span-1">
                    <Label htmlFor="project-type" className="text-sm font-medium">Project Type</Label>
                    <Input
                      id="project-type"
                      placeholder="e.g., Kitchen Renovation, Bathroom Remodel, Home Addition"
                      value={formData.projectType}
                      onChange={(e) => updateField('projectType', e.target.value)}
                      className="w-full mt-1"
                    />
                    <FieldError error={errors.projectType} touched={touched.projectType} />
                  </div>

                  <div className="sm:col-span-2 md:col-span-1">
                    <Label htmlFor="square-footage" className="text-sm font-medium">Square Footage</Label>
                    <Input
                      id="square-footage"
                      type="number"
                      placeholder="250"
                      className="w-full mt-1"
                      value={formData.squareFootage}
                      onChange={(e) => updateField('squareFootage', e.target.value)}
                      onBlur={() => touchField('squareFootage')}
                    />
                    <FieldError error={errors.squareFootage} touched={touched.squareFootage} />
                  </div>
                </div>

                <div>
                  <Label htmlFor="material-quality">Material Quality</Label>
                  <Select 
                    value={formData.materialQuality} 
                    onValueChange={(value) => updateField('materialQuality', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select quality level" />
                    </SelectTrigger>
                    <SelectContent>
                      {materialQualities.map((quality) => (
                        <SelectItem key={quality.id} value={quality.id}>
                          <div>
                            <div className="font-medium">{quality.name}</div>
                            <div className="text-xs text-slate-500">{quality.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError error={errors.materialQuality} touched={touched.materialQuality} />
                </div>
              </CardContent>
            </Card>

            {/* Conversational Project Assistant */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  💬 Conversational Budget Assistant
                </CardTitle>
                <CardDescription>
                  Describe your project in detail to get personalized budget insights and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Chat Messages */}
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {chatMessages.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <Bot className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                      <p className="text-sm">Ask me anything about your renovation budget!</p>
                      <p className="text-xs mt-1">Example: "What should I budget for electrical work in a kitchen remodel?"</p>
                    </div>
                  ) : (
                    chatMessages.map((message, index) => (
                      <div key={index} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg ${
                          message.type === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-slate-100 text-slate-900'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                  {isChatLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="bg-slate-100 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask about costs, materials, timeline, or any budget questions..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isChatLoading && handleChatSubmit()}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleChatSubmit}
                    disabled={!chatInput.trim() || isChatLoading}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Optional Upgrades */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-600" />
                  Optional Upgrades
                </CardTitle>
                <CardDescription>
                  Select additional features to include in your budget
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {availableUpgrades.map((upgrade) => (
                    <div key={upgrade.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-slate-50">
                      <Checkbox
                        id={upgrade.id}
                        checked={selectedUpgrades.includes(upgrade.id)}
                        onCheckedChange={() => handleUpgradeToggle(upgrade.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <Label htmlFor={upgrade.id} className="font-medium">
                            {upgrade.name}
                          </Label>
                          <Badge variant="outline">
                            ${upgrade.cost.toLocaleString()}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">{upgrade.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={calculateBudget}
              disabled={isCalculating}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-lg"
            >
              {isCalculating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate Budget Plan
                </>
              )}
            </Button>
          </FormValidationWrapper>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {estimate ? (
            <>
              {/* Total Cost */}
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <DollarSign className="w-5 h-5" />
                    Total Project Cost
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-900 mb-2">
                      ${estimate.totalCost.toLocaleString()}
                    </div>
                    <div className="text-sm text-blue-600">
                      {estimate.timeline} week timeline
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cost Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-green-600" />
                    Cost Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(estimate.breakdown).map(([category, amount]) => {
                    const percentage = (amount / estimate.totalCost) * 100;
                    return (
                      <div key={category}>
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="font-medium">${amount.toLocaleString()}</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Monthly Forecast */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    Monthly Budget Forecast
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {estimate.monthlyForecast.map((month) => (
                    <div key={month.month} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <div>
                        <div className="font-medium">Month {month.month}</div>
                        <div className="text-sm text-slate-600">{month.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${month.cost.toLocaleString()}</div>
                        <div className="text-xs text-slate-500">
                          Total: ${month.cumulative.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card className="bg-amber-50 border-amber-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-800">
                    <Lightbulb className="w-5 h-5" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {estimate.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-amber-700 text-sm">
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Export Tools */}
              <ResultsExport 
                data={{
                  title: "Budget Planning Report",
                  data: estimate,
                  projectDetails: {
                    "Project Type": projectTypes.find(p => p.id === formData.projectType)?.name || 'N/A',
                    "Square Footage": formData.squareFootage + ' sq ft',
                    "Material Quality": materialQualities.find(q => q.id === formData.materialQuality)?.name || 'N/A',
                    "Selected Upgrades": selectedUpgrades.length.toString()
                  },
                  timestamp: new Date()
                }}
              />
              
              {/* AI Cost Explanation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    AI Cost Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isGeneratingExplanation ? (
                    <div className="flex items-center gap-3 p-4">
                      <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-slate-600">Analyzing your project costs...</span>
                    </div>
                  ) : aiExplanation ? (
                    <div className="bg-gray-100 p-4 rounded-md">
                      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{aiExplanation}</p>
                    </div>
                  ) : (
                    <div className="bg-gray-100 p-4 rounded-md">
                      <p className="text-sm text-slate-700 leading-relaxed">
                        Your cost estimate reflects current market rates for <strong>materials, labor, and project requirements</strong>. 
                        Regional variations and specific project details may affect the final total. Consider getting multiple contractor quotes for accurate pricing.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* AI Beta Disclaimer */}
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-700 italic">
                  ⚡ AI beta - results may vary. Cost estimates are for planning purposes only.
                </p>
              </div>

              {/* Demo Feedback */}
              {isDemoMode && (
                <DemoFeedback 
                  toolName="Budget Planner" 
                  className="mt-6"
                />
              )}
            </>
          ) : (
            <Card className="bg-slate-50">
              <CardContent className="flex items-center justify-center h-64 text-center py-12">
                <div className="space-y-4">
                  <Calculator className="w-16 h-16 text-slate-400 mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">
                      Ready to Plan Your Budget?
                    </h3>
                    <p className="text-slate-500">
                      Complete the project details to get your comprehensive budget plan with monthly forecasts
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Feedback Button */}
      <FeedbackButton toolName="Budget Planner" />
    </div>
  );
}
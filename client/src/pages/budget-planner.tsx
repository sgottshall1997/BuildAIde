import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  PieChart,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ResultsExport } from "@/components/ui/results-export";
import { 
  useFieldValidation, 
  validationRules, 
  FormValidationWrapper, 
  FieldError 
} from "@/components/ui/form-validation";

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
  const { toast } = useToast();

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

  const {
    values: formData,
    errors,
    touched,
    updateField,
    touchField,
    validateAllFields,
    reset
  } = useFieldValidation({
    projectType: '',
    squareFootage: '',
    materialQuality: '',
    timeline: 'moderate'
  });

  const projectTypes = [
    { id: 'kitchen', name: 'Kitchen Renovation', baseRate: 180, timeline: 8 },
    { id: 'bathroom', name: 'Bathroom Renovation', baseRate: 220, timeline: 6 },
    { id: 'basement', name: 'Basement Finishing', baseRate: 85, timeline: 10 },
    { id: 'addition', name: 'Home Addition', baseRate: 200, timeline: 16 },
    { id: 'whole-house', name: 'Whole House Renovation', baseRate: 150, timeline: 20 },
    { id: 'deck', name: 'Deck/Patio Construction', baseRate: 35, timeline: 4 }
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
        const monthCost = isLastMonth 
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

  const resetForm = () => {
    reset();
    setEstimate(null);
    setSelectedUpgrades([]);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Unified Budget Planner</h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          Get detailed cost estimates and monthly budget forecasts for your renovation project in one comprehensive tool.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="project-type">Project Type</Label>
                    <Select 
                      value={formData.projectType} 
                      onValueChange={(value) => updateField('projectType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose project type" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectTypes.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError error={errors.projectType} touched={touched.projectType} />
                  </div>

                  <div>
                    <Label htmlFor="square-footage">Square Footage</Label>
                    <Input
                      id="square-footage"
                      type="number"
                      placeholder="250"
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
    </div>
  );
}
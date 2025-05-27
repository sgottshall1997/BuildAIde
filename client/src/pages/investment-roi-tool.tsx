import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Target, 
  Home,
  Repeat,
  Clock,
  PieChart,
  AlertTriangle,
  CheckCircle
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

interface FlipAnalysis {
  purchasePrice: number;
  rehabBudget: number;
  afterRepairValue: number;
  totalInvestment: number;
  estimatedProfit: number;
  roiPercentage: number;
  breakevenSalePrice: number;
  marginOfSafety: number;
  holdingCosts: number;
  recommendations: string[];
}

interface RentalAnalysis {
  purchasePrice: number;
  rehabBudget: number;
  totalInvestment: number;
  monthlyRent: number;
  monthlyExpenses: number;
  netCashFlow: number;
  capRate: number;
  cashOnCashReturn: number;
  onePercentRule: boolean;
  breakEvenRatio: number;
  annualReturn: number;
  recommendations: string[];
}

type InvestmentMode = 'flip' | 'rental';

export default function ROICalculator() {
  const [mode, setMode] = useState<InvestmentMode>('flip');
  const [flipAnalysis, setFlipAnalysis] = useState<FlipAnalysis | null>(null);
  const [rentalAnalysis, setRentalAnalysis] = useState<RentalAnalysis | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();
  const { isDemoMode } = useDemoMode();

  // Shared validation schema
  const sharedValidationSchema = {
    purchasePrice: [
      { validator: validationRules.required, message: 'Purchase price is required' },
      { validator: validationRules.positiveNumber, message: 'Please enter a valid purchase price' }
    ],
    rehabBudget: [
      { validator: validationRules.required, message: 'Rehab budget is required' },
      { validator: validationRules.number, message: 'Please enter a valid rehab budget' }
    ]
  };

  // Mode-specific validation
  const flipValidationSchema = {
    ...sharedValidationSchema,
    afterRepairValue: [
      { validator: validationRules.required, message: 'After repair value is required' },
      { validator: validationRules.positiveNumber, message: 'Please enter a valid ARV' }
    ]
  };

  const rentalValidationSchema = {
    ...sharedValidationSchema,
    monthlyRent: [
      { validator: validationRules.required, message: 'Monthly rent is required' },
      { validator: validationRules.positiveNumber, message: 'Please enter a valid monthly rent' }
    ]
  };

  // Pre-filled demo values for better user experience
  const demoValues = isDemoMode ? {
    purchasePrice: '285000',
    rehabBudget: '35000',
    afterRepairValue: '375000',
    closingCosts: '8500',
    holdingCosts: '12000',
    monthlyRent: '2800',
    monthlyExpenses: '950',
    downPayment: '57000',
    loanAmount: '228000'
  } : {
    purchasePrice: '',
    rehabBudget: '',
    afterRepairValue: '',
    closingCosts: '',
    holdingCosts: '',
    monthlyRent: '',
    monthlyExpenses: '',
    downPayment: '',
    loanAmount: ''
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

  const calculateFlipROI = () => {
    if (!validateAllFields(flipValidationSchema)) {
      toast({
        title: "Please complete all required fields",
        description: "Fill in purchase price, rehab budget, and ARV to continue.",
        variant: "destructive"
      });
      return;
    }

    const purchasePrice = parseFloat(formData.purchasePrice);
    const rehabBudget = parseFloat(formData.rehabBudget);
    const afterRepairValue = parseFloat(formData.afterRepairValue);
    const closingCosts = parseFloat(formData.closingCosts) || purchasePrice * 0.06;
    const holdingCosts = parseFloat(formData.holdingCosts) || purchasePrice * 0.02;

    const totalInvestment = purchasePrice + rehabBudget + closingCosts + holdingCosts;
    const estimatedProfit = afterRepairValue - totalInvestment;
    const roiPercentage = (estimatedProfit / totalInvestment) * 100;
    const breakevenSalePrice = totalInvestment;
    const marginOfSafety = ((afterRepairValue - breakevenSalePrice) / afterRepairValue) * 100;

    const recommendations = [];
    if (roiPercentage < 20) {
      recommendations.push("Consider looking for properties with higher profit potential");
    }
    if (marginOfSafety < 15) {
      recommendations.push("This deal has limited safety margin - proceed with caution");
    }
    if (rehabBudget > afterRepairValue * 0.2) {
      recommendations.push("Rehab budget seems high relative to ARV - verify estimates");
    }
    if (roiPercentage >= 25) {
      recommendations.push("Excellent ROI potential - this looks like a strong deal");
    }

    const analysis: FlipAnalysis = {
      purchasePrice,
      rehabBudget,
      afterRepairValue,
      totalInvestment,
      estimatedProfit,
      roiPercentage,
      breakevenSalePrice,
      marginOfSafety,
      holdingCosts,
      recommendations
    };

    setFlipAnalysis(analysis);
  };

  const calculateRentalROI = () => {
    if (!validateAllFields(rentalValidationSchema)) {
      toast({
        title: "Please complete all required fields",
        description: "Fill in purchase price, rehab budget, and monthly rent to continue.",
        variant: "destructive"
      });
      return;
    }

    const purchasePrice = parseFloat(formData.purchasePrice);
    const rehabBudget = parseFloat(formData.rehabBudget);
    const monthlyRent = parseFloat(formData.monthlyRent);
    const monthlyExpenses = parseFloat(formData.monthlyExpenses) || monthlyRent * 0.5;
    const downPayment = parseFloat(formData.downPayment) || purchasePrice * 0.25;

    const totalInvestment = downPayment + rehabBudget;
    const netCashFlow = monthlyRent - monthlyExpenses;
    const annualNetIncome = netCashFlow * 12;
    const totalPropertyValue = purchasePrice + rehabBudget;
    
    const capRate = (annualNetIncome / totalPropertyValue) * 100;
    const cashOnCashReturn = (annualNetIncome / totalInvestment) * 100;
    const onePercentRule = monthlyRent >= totalPropertyValue * 0.01;
    const breakEvenRatio = monthlyExpenses / monthlyRent;
    const annualReturn = annualNetIncome;

    const recommendations = [];
    if (capRate < 8) {
      recommendations.push("Cap rate is below market average - consider negotiating price");
    }
    if (cashOnCashReturn < 12) {
      recommendations.push("Cash-on-cash return could be improved with better financing");
    }
    if (!onePercentRule) {
      recommendations.push("Property doesn't meet 1% rule - may indicate poor cash flow");
    }
    if (netCashFlow < 0) {
      recommendations.push("Negative cash flow - this property will require monthly contributions");
    }
    if (capRate >= 10 && cashOnCashReturn >= 15) {
      recommendations.push("Excellent rental property with strong returns!");
    }

    const analysis: RentalAnalysis = {
      purchasePrice,
      rehabBudget,
      totalInvestment,
      monthlyRent,
      monthlyExpenses,
      netCashFlow,
      capRate,
      cashOnCashReturn,
      onePercentRule,
      breakEvenRatio,
      annualReturn,
      recommendations
    };

    setRentalAnalysis(analysis);
  };

  // Auto-calculate on page load in demo mode
  useEffect(() => {
    if (isDemoMode && formData.purchasePrice && formData.rehabBudget && 
        ((mode === 'flip' && formData.afterRepairValue) || 
         (mode === 'rental' && formData.monthlyRent))) {
      // Delay calculation slightly to allow form to render
      setTimeout(() => {
        handleCalculate();
      }, 1000);
    }
  }, [isDemoMode, mode]);

  const handleCalculate = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      if (mode === 'flip') {
        calculateFlipROI();
      } else {
        calculateRentalROI();
      }
      
      toast({
        title: "Analysis Complete!",
        description: `Your ${mode} investment analysis is ready.`,
      });
      setIsCalculating(false);
    }, 1000);
  };

  const resetAnalysis = () => {
    reset();
    setFlipAnalysis(null);
    setRentalAnalysis(null);
  };

  const currentAnalysis = mode === 'flip' ? flipAnalysis : rentalAnalysis;

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 p-3 sm:p-6">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 sm:mb-3 px-2">📈 ROI Calculator</h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto px-4">
          Analyze both house flipping and rental property investments with comprehensive ROI calculations and market insights.
        </p>
      </div>

      {/* Mode Toggle */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={mode} onValueChange={(value) => setMode(value as InvestmentMode)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="flip" className="flex items-center gap-2">
                <Repeat className="w-4 h-4" />
                House Flipping
              </TabsTrigger>
              <TabsTrigger value="rental" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Rental Property
              </TabsTrigger>
            </TabsList>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              {/* Input Form */}
              <div className="space-y-4 sm:space-y-6">
                <FormValidationWrapper errors={errors}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                        <Calculator className="w-5 h-5 text-blue-600" />
                        {mode === 'flip' ? 'Flip Investment Details' : 'Rental Property Details'}
                      </CardTitle>
                      <CardDescription className="text-sm sm:text-base">
                        Enter your {mode} investment parameters for analysis
                      </CardDescription>
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-700">
                          💡 Enter your property details to get instant ROI analysis with profit projections
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Shared Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="purchase-price">Purchase Price</Label>
                          <Input
                            id="purchase-price"
                            type="number"
                            placeholder="425,000"
                            value={formData.purchasePrice}
                            onChange={(e) => updateField('purchasePrice', e.target.value)}
                            onBlur={() => touchField('purchasePrice')}
                          />
                          <FieldError error={errors.purchasePrice} touched={touched.purchasePrice} />
                        </div>

                        <div>
                          <Label htmlFor="rehab-budget">Rehab Budget</Label>
                          <Input
                            id="rehab-budget"
                            type="number"
                            placeholder="65,000"
                            value={formData.rehabBudget}
                            onChange={(e) => updateField('rehabBudget', e.target.value)}
                            onBlur={() => touchField('rehabBudget')}
                          />
                          <FieldError error={errors.rehabBudget} touched={touched.rehabBudget} />
                        </div>
                      </div>

                      <TabsContent value="flip" className="mt-4 space-y-4">
                        <div>
                          <Label htmlFor="arv">After Repair Value (ARV)</Label>
                          <Input
                            id="arv"
                            type="number"
                            placeholder="580,000"
                            value={formData.afterRepairValue}
                            onChange={(e) => updateField('afterRepairValue', e.target.value)}
                            onBlur={() => touchField('afterRepairValue')}
                          />
                          <FieldError error={errors.afterRepairValue} touched={touched.afterRepairValue} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="closing-costs">Closing Costs (optional)</Label>
                            <Input
                              id="closing-costs"
                              type="number"
                              placeholder="25,500"
                              value={formData.closingCosts}
                              onChange={(e) => updateField('closingCosts', e.target.value)}
                            />
                            <p className="text-xs text-slate-500 mt-1">Defaults to 6% of purchase price</p>
                          </div>

                          <div>
                            <Label htmlFor="holding-costs">Holding Costs (optional)</Label>
                            <Input
                              id="holding-costs"
                              type="number"
                              placeholder="8,500"
                              value={formData.holdingCosts}
                              onChange={(e) => updateField('holdingCosts', e.target.value)}
                            />
                            <p className="text-xs text-slate-500 mt-1">Utilities, taxes, financing</p>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="rental" className="mt-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="monthly-rent">Monthly Rent</Label>
                            <Input
                              id="monthly-rent"
                              type="number"
                              placeholder="3,200"
                              value={formData.monthlyRent}
                              onChange={(e) => updateField('monthlyRent', e.target.value)}
                              onBlur={() => touchField('monthlyRent')}
                            />
                            <FieldError error={errors.monthlyRent} touched={touched.monthlyRent} />
                          </div>

                          <div>
                            <Label htmlFor="monthly-expenses">Monthly Expenses (optional)</Label>
                            <Input
                              id="monthly-expenses"
                              type="number"
                              placeholder="1,600"
                              value={formData.monthlyExpenses}
                              onChange={(e) => updateField('monthlyExpenses', e.target.value)}
                            />
                            <p className="text-xs text-slate-500 mt-1">Defaults to 50% of rent</p>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="down-payment">Down Payment (optional)</Label>
                          <Input
                            id="down-payment"
                            type="number"
                            placeholder="106,250"
                            value={formData.downPayment}
                            onChange={(e) => updateField('downPayment', e.target.value)}
                          />
                          <p className="text-xs text-slate-500 mt-1">Defaults to 25% of purchase price</p>
                        </div>
                      </TabsContent>

                      <Button
                        onClick={handleCalculate}
                        disabled={isCalculating}
                        className="w-full bg-blue-600 hover:bg-blue-700 py-3"
                      >
                        {isCalculating ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <TrendingUp className="w-5 h-5 mr-2" />
                            Calculate {mode === 'flip' ? 'Flip' : 'Rental'} ROI
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </FormValidationWrapper>
              </div>

              {/* Results */}
              <div className="space-y-6">
                {currentAnalysis ? (
                  <>
                    {mode === 'flip' && flipAnalysis && (
                      <>
                        {/* Flip Results */}
                        <div className="grid grid-cols-2 gap-4">
                          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                            <CardContent className="p-4 text-center">
                              <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
                              <div className="text-2xl font-bold text-green-800">
                                ${flipAnalysis.estimatedProfit.toLocaleString()}
                              </div>
                              <div className="text-sm text-green-600">Estimated Profit</div>
                            </CardContent>
                          </Card>

                          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                            <CardContent className="p-4 text-center">
                              <TrendingUp className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                              <div className="text-2xl font-bold text-blue-800">
                                {flipAnalysis.roiPercentage.toFixed(1)}%
                              </div>
                              <div className="text-sm text-blue-600">ROI</div>
                            </CardContent>
                          </Card>
                        </div>

                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Target className="w-5 h-5 text-purple-600" />
                              Investment Breakdown
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex justify-between">
                              <span>Total Investment:</span>
                              <span className="font-bold">${flipAnalysis.totalInvestment.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>After Repair Value:</span>
                              <span className="font-bold">${flipAnalysis.afterRepairValue.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Margin of Safety:</span>
                              <span className={`font-bold ${flipAnalysis.marginOfSafety > 15 ? 'text-green-600' : 'text-red-600'}`}>
                                {flipAnalysis.marginOfSafety.toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Break-even Sale Price:</span>
                              <span className="font-bold">${flipAnalysis.breakevenSalePrice.toLocaleString()}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </>
                    )}

                    {mode === 'rental' && rentalAnalysis && (
                      <>
                        {/* Rental Results */}
                        <div className="grid grid-cols-2 gap-4">
                          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                            <CardContent className="p-4 text-center">
                              <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
                              <div className="text-2xl font-bold text-green-800">
                                ${rentalAnalysis.netCashFlow.toLocaleString()}
                              </div>
                              <div className="text-sm text-green-600">Monthly Cash Flow</div>
                            </CardContent>
                          </Card>

                          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                            <CardContent className="p-4 text-center">
                              <TrendingUp className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                              <div className="text-2xl font-bold text-blue-800">
                                {rentalAnalysis.capRate.toFixed(1)}%
                              </div>
                              <div className="text-sm text-blue-600">Cap Rate</div>
                            </CardContent>
                          </Card>
                        </div>

                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <PieChart className="w-5 h-5 text-purple-600" />
                              Rental Analysis
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex justify-between">
                              <span>Cash-on-Cash Return:</span>
                              <span className="font-bold">{rentalAnalysis.cashOnCashReturn.toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Annual Net Income:</span>
                              <span className="font-bold">${rentalAnalysis.annualReturn.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>1% Rule:</span>
                              <Badge variant={rentalAnalysis.onePercentRule ? "default" : "destructive"}>
                                {rentalAnalysis.onePercentRule ? "Passes" : "Fails"}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Expense Ratio:</span>
                              <span className="font-bold">{(rentalAnalysis.breakEvenRatio * 100).toFixed(1)}%</span>
                            </div>
                          </CardContent>
                        </Card>
                      </>
                    )}

                    {/* Recommendations */}
                    <Card className="bg-amber-50 border-amber-200">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-amber-800">
                          <CheckCircle className="w-5 h-5" />
                          Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {currentAnalysis.recommendations.map((rec, index) => (
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
                        title: `${mode === 'flip' ? 'House Flip' : 'Rental Property'} ROI Analysis`,
                        data: currentAnalysis,
                        projectDetails: {
                          "Investment Type": mode === 'flip' ? 'House Flipping' : 'Rental Property',
                          "Purchase Price": `$${formData.purchasePrice ? parseFloat(formData.purchasePrice).toLocaleString() : 'N/A'}`,
                          "Rehab Budget": `$${formData.rehabBudget ? parseFloat(formData.rehabBudget).toLocaleString() : 'N/A'}`,
                          "Analysis Date": new Date().toLocaleDateString()
                        },
                        timestamp: new Date()
                      }}
                    />
                    
                    {/* AI Beta Disclaimer */}
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm text-amber-700 italic">
                        ⚡ AI beta - results may vary. Investment calculations are for planning purposes only.
                      </p>
                    </div>

                    {/* Demo Feedback */}
                    {isDemoMode && (
                      <DemoFeedback 
                        toolName={`${mode === 'flip' ? 'House Flip' : 'Rental Property'} ROI Tool`}
                        className="mt-6"
                      />
                    )}
                  </>
                ) : (
                  <Card className="bg-slate-50">
                    <CardContent className="flex items-center justify-center h-96 text-center py-12">
                      <div className="space-y-4">
                        <Calculator className="w-16 h-16 text-slate-400 mx-auto" />
                        <div>
                          <h3 className="text-lg font-semibold text-slate-700 mb-2">
                            Ready to Analyze Your Investment?
                          </h3>
                          <p className="text-slate-500">
                            Enter your {mode} investment details to get comprehensive ROI analysis and recommendations
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Feedback Button */}
      <FeedbackButton toolName={`${mode === 'flip' ? 'House Flip' : 'Rental Property'} ROI Tool`} />
    </div>
  );
}
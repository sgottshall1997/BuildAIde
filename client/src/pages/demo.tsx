import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  Play,
  Sparkles,
  ArrowRight,
  Home,
  Building,
  Lightbulb,
  Target
} from "lucide-react";
import { Link } from "wouter";

interface DemoTool {
  id: string;
  title: string;
  description: string;
  icon: any;
  sampleInput: Record<string, any>;
  sampleOutput: Record<string, any>;
  path: string;
  highlight: string;
  category: 'homeowner' | 'professional';
}

export default function Demo() {
  const [selectedView, setSelectedView] = useState<'homeowner' | 'professional'>('homeowner');
  const [highlightedTool, setHighlightedTool] = useState<string | null>(null);

  const demoTools: DemoTool[] = [
    // Homeowner Tools
    {
      id: 'budget-estimator',
      title: 'Renovation Cost Estimator',
      description: 'Get instant cost estimates for your home improvement projects',
      icon: Calculator,
      sampleInput: {
        projectType: 'Kitchen Remodel',
        squareFootage: '250',
        finishLevel: 'Mid-Range'
      },
      sampleOutput: {
        lowEnd: 45000,
        highEnd: 65000,
        perSqFt: 220,
        explanation: 'Your kitchen remodel with mid-range finishes is estimated between $45,000 and $65,000.',
        keyFactors: [
          'Material quality affects 40-50% of total cost',
          'Labor costs vary by region and contractor',
          'Permits and inspections may add 5-10%'
        ]
      },
      path: '/consumer-estimator',
      highlight: 'See instant cost estimates with detailed breakdowns',
      category: 'homeowner'
    },
    {
      id: 'quote-analyzer',
      title: 'Quote Comparison Tool',
      description: 'Compare contractor quotes and get expert analysis',
      icon: DollarSign,
      sampleInput: {
        quotes: [
          { contractor: 'ABC Renovations', cost: 52000, timeline: '8 weeks' },
          { contractor: 'Pro Kitchen Co', cost: 48000, timeline: '6 weeks' },
          { contractor: 'Elite Builders', cost: 67000, timeline: '10 weeks' }
        ]
      },
      sampleOutput: {
        analysis: [
          {
            contractor: 'Pro Kitchen Co',
            recommendation: 'Best value with competitive pricing and reasonable timeline',
            priceReasonableness: 'fair',
            strengths: ['Competitive pricing', 'Good timeline'],
            redFlags: []
          }
        ]
      },
      path: '/quote-compare',
      highlight: 'Identify red flags and find the best contractor',
      category: 'homeowner'
    },
    {
      id: 'renovation-planner',
      title: 'Smart Project Planner',
      description: 'Plan your renovation with AI-powered insights',
      icon: Lightbulb,
      sampleInput: {
        projectScope: 'Full kitchen renovation',
        budget: '$55,000',
        timeline: '8 weeks'
      },
      sampleOutput: {
        phases: [
          { name: 'Planning & Permits', weeks: 2, cost: 5500 },
          { name: 'Demo & Electrical', weeks: 2, cost: 12000 },
          { name: 'Installation', weeks: 3, cost: 28000 },
          { name: 'Finishing', weeks: 1, cost: 9500 }
        ],
        recommendations: [
          'Schedule electrical work during demo phase',
          'Order cabinets 6 weeks in advance'
        ]
      },
      path: '/smart-project-estimator',
      highlight: 'Get detailed project timelines and expert tips',
      category: 'homeowner'
    },

    // Professional Tools
    {
      id: 'advanced-estimator',
      title: 'Professional Bid Calculator',
      description: 'Create detailed estimates with material pricing and labor costs',
      icon: Calculator,
      sampleInput: {
        projectType: 'Custom Kitchen',
        area: 300,
        materialQuality: 'Premium',
        laborRate: 85
      },
      sampleOutput: {
        total: 78000,
        breakdown: {
          materials: 35100,
          labor: 31200,
          permits: 3900,
          overhead: 7800
        },
        profitMargin: '22%'
      },
      path: '/estimator',
      highlight: 'Professional-grade estimates with profit calculations',
      category: 'professional'
    },
    {
      id: 'roi-calculator',
      title: 'Investment ROI Calculator',
      description: 'Analyze house flipping and investment opportunities',
      icon: TrendingUp,
      sampleInput: {
        purchasePrice: 425000,
        rehabBudget: 65000,
        afterRepairValue: 580000
      },
      sampleOutput: {
        estimatedProfit: 65000,
        roiPercentage: 13.2,
        marginOfSafety: 18.5,
        recommendation: 'Good investment opportunity with solid returns'
      },
      path: '/roi-calculator',
      highlight: 'Maximize your investment returns with data-driven analysis',
      category: 'professional'
    },
    {
      id: 'project-scheduler',
      title: 'Project Timeline Manager',
      description: 'Schedule multiple projects and track progress',
      icon: Clock,
      sampleInput: {
        activeProjects: 3,
        upcomingDeadlines: 2
      },
      sampleOutput: {
        projects: [
          { name: 'Bethesda Kitchen', status: 'In Progress', completion: 65 },
          { name: 'Silver Spring Bathroom', status: 'Starting Soon', completion: 0 },
          { name: 'Rockville Addition', status: 'Planning', completion: 15 }
        ]
      },
      path: '/project-scheduler',
      highlight: 'Keep all your projects on track and profitable',
      category: 'professional'
    }
  ];

  const currentTools = demoTools.filter(tool => tool.category === selectedView);

  useEffect(() => {
    // Auto-highlight tools every 3 seconds for demo effect
    const interval = setInterval(() => {
      const randomTool = currentTools[Math.floor(Math.random() * currentTools.length)];
      setHighlightedTool(randomTool.id);
      
      setTimeout(() => setHighlightedTool(null), 2000);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentTools]);

  const ToolCard = ({ tool }: { tool: DemoTool }) => {
    const isHighlighted = highlightedTool === tool.id;
    
    return (
      <Card className={`transition-all duration-300 hover:shadow-lg border-2 ${
        isHighlighted 
          ? 'border-blue-400 shadow-lg ring-2 ring-blue-200 bg-blue-50' 
          : 'border-slate-200 hover:border-blue-300'
      }`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                isHighlighted ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
              }`}>
                <tool.icon className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">{tool.title}</CardTitle>
                <CardDescription className="text-sm">
                  {tool.description}
                </CardDescription>
              </div>
            </div>
            {isHighlighted && (
              <Badge className="bg-blue-600 text-white animate-pulse">
                <Sparkles className="h-3 w-3 mr-1" />
                Try This!
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Sample Input */}
          <div className="bg-slate-50 p-3 rounded-lg">
            <h4 className="font-medium text-slate-700 mb-2 text-sm">Sample Input:</h4>
            <div className="space-y-1">
              {Object.entries(tool.sampleInput).map(([key, value]) => (
                <div key={key} className="flex justify-between text-xs">
                  <span className="text-slate-600 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                  </span>
                  <span className="font-medium text-slate-800">
                    {Array.isArray(value) ? `${value.length} items` : value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Output Preview */}
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-800 mb-2 text-sm">Sample Result:</h4>
            <div className="text-sm text-green-700">
              {tool.id === 'budget-estimator' && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-800">
                    ${tool.sampleOutput.lowEnd.toLocaleString()} - ${tool.sampleOutput.highEnd.toLocaleString()}
                  </div>
                  <div className="text-xs">About ${tool.sampleOutput.perSqFt}/sq ft</div>
                </div>
              )}
              
              {tool.id === 'roi-calculator' && (
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div>
                    <div className="font-bold text-green-800">${tool.sampleOutput.estimatedProfit.toLocaleString()}</div>
                    <div className="text-xs">Profit</div>
                  </div>
                  <div>
                    <div className="font-bold text-green-800">{tool.sampleOutput.roiPercentage}%</div>
                    <div className="text-xs">ROI</div>
                  </div>
                </div>
              )}
              
              {tool.id === 'advanced-estimator' && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-800">
                    ${tool.sampleOutput.total.toLocaleString()}
                  </div>
                  <div className="text-xs">Total Project Cost</div>
                </div>
              )}
              
              {!['budget-estimator', 'roi-calculator', 'advanced-estimator'].includes(tool.id) && (
                <div className="text-sm">{tool.highlight}</div>
              )}
            </div>
          </div>

          {/* Highlight */}
          <div className="text-center">
            <p className="text-xs text-blue-600 font-medium mb-3">
              💡 {tool.highlight}
            </p>
            
            <Link href={tool.path}>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Play className="h-4 w-4 mr-2" />
                Try This Tool
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Experience ConstructionSmartTools
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-6">
            See how our AI-powered platform transforms construction planning, estimation, and project management with real sample data
          </p>
          
          {/* View Selector */}
          <div className="flex justify-center gap-4 mb-8">
            <Button
              variant={selectedView === 'homeowner' ? 'default' : 'outline'}
              onClick={() => setSelectedView('homeowner')}
              className="px-6 py-3"
            >
              <Home className="h-4 w-4 mr-2" />
              Homeowner View
            </Button>
            <Button
              variant={selectedView === 'professional' ? 'default' : 'outline'}
              onClick={() => setSelectedView('professional')}
              className="px-6 py-3"
            >
              <Building className="h-4 w-4 mr-2" />
              Professional View
            </Button>
          </div>
        </div>

        {/* Demo Tools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {currentTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        {/* Key Benefits */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Why Choose ConstructionSmartTools?</h2>
              <p className="text-blue-100">
                Join thousands of {selectedView === 'homeowner' ? 'homeowners' : 'professionals'} who trust our platform
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-white/20 rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="font-semibold mb-2">Accurate Estimates</h3>
                <p className="text-sm text-blue-100">
                  AI-powered calculations based on real market data
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-white/20 rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <Target className="h-8 w-8" />
                </div>
                <h3 className="font-semibold mb-2">Smart Analysis</h3>
                <p className="text-sm text-blue-100">
                  Get insights that help you make better decisions
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-white/20 rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <Clock className="h-8 w-8" />
                </div>
                <h3 className="font-semibold mb-2">Save Time</h3>
                <p className="text-sm text-blue-100">
                  Complete tasks in minutes, not hours
                </p>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Link href={selectedView === 'homeowner' ? '/consumer-dashboard' : '/dashboard'}>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100">
                  Start Using ConstructionSmartTools
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-slate-600 mb-4">
            Ready to transform your {selectedView === 'homeowner' ? 'home renovation' : 'construction business'}?
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/">
              <Button variant="outline">
                Back to Homepage
              </Button>
            </Link>
            <Link href={selectedView === 'homeowner' ? '/consumer-dashboard' : '/dashboard'}>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
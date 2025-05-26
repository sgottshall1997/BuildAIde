import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  Target,
  ThumbsUp,
  ThumbsDown,
  X,
  Info,
  Users,
  HardHat
} from "lucide-react";
import { Link } from "wouter";
import { DemoTourOverlay } from "@/components/demo-tour-overlay";

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

export default function EnhancedDemo() {
  const [selectedView, setSelectedView] = useState<'homeowner' | 'professional'>('homeowner');
  const [highlightedTool, setHighlightedTool] = useState<string | null>(null);
  const [showTooltips, setShowTooltips] = useState(true);
  const [feedbackTool, setFeedbackTool] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [isDemoUser] = useState(true);
  const [showTour, setShowTour] = useState(false);

  // Set demo flag in global context for other components to use
  useEffect(() => {
    (window as any).isDemoMode = true;
    (window as any).suppressGPTRequests = true;
    
    return () => {
      (window as any).isDemoMode = false;
      (window as any).suppressGPTRequests = false;
    };
  }, []);

  const demoTools: DemoTool[] = [
    // Homeowner Tools
    {
      id: 'budget-estimator',
      title: 'Renovation Cost Estimator',
      description: 'Get instant cost estimates for your home improvement projects',
      icon: Calculator,
      sampleInput: {
        projectType: 'Kitchen Remodel',
        squareFootage: '350',
        finishLevel: 'Mid-Range',
        timeline: '8-10 weeks',
        location: 'Bethesda, MD',
        specificDetails: 'New cabinets, granite countertops, stainless appliances'
      },
      sampleOutput: {
        lowEnd: 52000,
        highEnd: 78000,
        perSqFt: 220,
        explanation: 'Your kitchen remodel with mid-range finishes is estimated between $52,000 and $78,000.',
        keyFactors: [
          'Cabinet replacement accounts for 35-40% of total cost',
          'Granite countertops add $3,000-5,000 to project',
          'Electrical updates may require permits',
          'Timeline allows for better contractor scheduling'
        ]
      },
      path: '/budget-planner?demo=true&preset=kitchen',
      highlight: 'Most popular homeowner tool',
      category: 'homeowner'
    },
    {
      id: 'renovation-planner',
      title: 'Smart Project Timeline',
      description: 'AI-powered project scheduling with realistic timelines',
      icon: Clock,
      sampleInput: {
        projectType: 'Bathroom Renovation',
        squareFootage: '120',
        complexity: 'Medium',
        startDate: '2024-03-15',
        constraints: 'Only one bathroom in house'
      },
      sampleOutput: {
        totalDuration: '6-8 weeks',
        phases: [
          { name: 'Planning & Permits', duration: '1-2 weeks', dependencies: [] },
          { name: 'Demolition', duration: '3-5 days', dependencies: ['Planning'] },
          { name: 'Plumbing & Electrical', duration: '1 week', dependencies: ['Demolition'] },
          { name: 'Installation', duration: '2-3 weeks', dependencies: ['Plumbing'] }
        ],
        criticalPath: 'Plumbing inspection must pass before tile work begins'
      },
      path: '/investment-roi-tool?demo=true&preset=bathroom',
      highlight: 'Prevents costly delays',
      category: 'homeowner'
    },
    {
      id: 'ai-advisor',
      title: 'Spencer The Builder AI',
      description: 'Chat with our AI construction expert for personalized advice',
      icon: Sparkles,
      sampleInput: {
        question: 'Should I renovate my kitchen before selling my house?',
        houseValue: '$450,000',
        location: 'Suburban Maryland',
        timeframe: 'Selling within 6 months'
      },
      sampleOutput: {
        recommendation: 'Moderate kitchen refresh recommended',
        reasoning: 'A $15,000-20,000 kitchen refresh could add $25,000-30,000 to your home value in your market. Focus on paint, hardware, and countertops rather than full renovation.',
        actionItems: [
          'Get quotes for countertop replacement',
          'Consider cabinet refacing vs replacement',
          'Update lighting fixtures for modern appeal',
          'Fresh paint in neutral colors'
        ]
      },
      path: '/ai-assistant?demo=true&preset=selling',
      highlight: 'Expert guidance 24/7',
      category: 'homeowner'
    },

    // Professional Tools
    {
      id: 'professional-estimator',
      title: 'Advanced Bid Calculator',
      description: 'Comprehensive project estimation with material pricing',
      icon: Calculator,
      sampleInput: {
        projectType: 'Commercial Office Renovation',
        squareFootage: '2500',
        floors: '2',
        complexity: 'High',
        clientBudget: '$125,000',
        timeline: '12 weeks',
        laborCrew: '6 workers'
      },
      sampleOutput: {
        totalEstimate: 118500,
        breakdown: {
          materials: 45000,
          labor: 52000,
          permits: 8500,
          equipment: 7500,
          overhead: 5500
        },
        profitMargin: '18%',
        competitiveAnalysis: 'Your bid is 7% below market average, providing competitive advantage'
      },
      path: '/budget-planner?demo=true&preset=commercial',
      highlight: 'Win more profitable bids',
      category: 'professional'
    },
    {
      id: 'material-tracker',
      title: 'Material Price Intelligence',
      description: 'Real-time material costs and market trends',
      icon: TrendingUp,
      sampleInput: {
        materials: ['Lumber', 'Steel', 'Concrete', 'Copper'],
        projectLocation: 'Washington DC Metro',
        projectSize: 'Large',
        timeline: 'Q2 2024'
      },
      sampleOutput: {
        currentPrices: {
          lumber: '$485/1000 board feet (-8% from last month)',
          steel: '$720/ton (+3% from last month)',
          concrete: '$125/cubic yard (stable)',
          copper: '$8.50/lb (+12% from last month)'
        },
        forecast: 'Lumber prices expected to stabilize, copper continues upward trend',
        recommendations: 'Lock in lumber pricing now, consider copper alternatives'
      },
      path: '/material-tracker?demo=true&preset=commercial',
      highlight: 'Save 10-15% on materials',
      category: 'professional'
    },
    {
      id: 'project-manager',
      title: 'Multi-Project Dashboard',
      description: 'Manage multiple jobs with AI-powered insights',
      icon: Building,
      sampleInput: {
        activeProjects: 5,
        totalValue: '$850,000',
        teamSize: 15,
        avgProjectDuration: '8 weeks'
      },
      sampleOutput: {
        efficiency: '94% on-time completion',
        profitability: '22% average margin',
        riskAlerts: [
          'Project #3 behind schedule - weather delays',
          'Material shortage risk for Project #5'
        ],
        opportunities: 'Crew availability for new project starting April 1st'
      },
      path: '/project-dashboard?demo=true&preset=multi',
      highlight: 'Manage 3x more projects',
      category: 'professional'
    }
  ];

  const filteredTools = demoTools.filter(tool => tool.category === selectedView);

  const handleFeedback = (toolId: string, type: 'positive' | 'negative') => {
    // In demo mode, just show success message
    alert(`Thanks for your feedback on ${toolId}! This helps us improve the demo experience.`);
  };

  const submitFeedback = () => {
    // In demo mode, just show success message
    alert('Thank you for your detailed feedback! This helps us improve ConstructionSmartTools.');
    setFeedbackTool(null);
    setFeedbackText('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Demo Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="bg-yellow-400 text-yellow-900 mb-4">
              🚀 INTERACTIVE DEMO MODE
            </Badge>
            <h1 className="text-4xl font-bold mb-2">ConstructionSmartTools Demo</h1>
            <p className="text-xl text-blue-100 mb-6">
              Experience the power of AI-driven construction management
            </p>
            
            {/* Mode Toggle */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="flex items-center gap-3 bg-white/10 rounded-full p-2" data-tour="mode-toggle">
                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  <span className={selectedView === 'homeowner' ? 'font-semibold' : 'opacity-75'}>
                    Homeowner
                  </span>
                </div>
                <Switch
                  checked={selectedView === 'professional'}
                  onCheckedChange={(checked) => setSelectedView(checked ? 'professional' : 'homeowner')}
                  className="data-[state=checked]:bg-orange-500"
                />
                <div className="flex items-center gap-2">
                  <HardHat className="w-5 h-5" />
                  <span className={selectedView === 'professional' ? 'font-semibold' : 'opacity-75'}>
                    Professional
                  </span>
                </div>
              </div>
              
              <Button
                onClick={() => setShowTour(true)}
                variant="outline"
                size="sm"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                <Target className="w-4 h-4 mr-2" />
                Start Tour
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="font-semibold">✓ Pre-filled Sample Data</div>
                <div className="text-blue-200">Real project scenarios</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="font-semibold">✓ Interactive Tooltips</div>
                <div className="text-blue-200">Guided experience</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="font-semibold">✓ No API Calls</div>
                <div className="text-blue-200">Instant responses</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Tools Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {selectedView === 'homeowner' ? '🏠 Homeowner Tools' : '👷 Professional Tools'}
          </h2>
          <p className="text-gray-600">
            {selectedView === 'homeowner' 
              ? 'Simple tools for planning your home renovation projects'
              : 'Advanced tools for construction professionals and contractors'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12" data-tour="tool-cards">
          {filteredTools.map((tool) => (
            <Card 
              key={tool.id} 
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                highlightedTool === tool.id ? 'ring-2 ring-blue-500 shadow-lg' : ''
              }`}
              onMouseEnter={() => setHighlightedTool(tool.id)}
              onMouseLeave={() => setHighlightedTool(null)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <tool.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{tool.title}</CardTitle>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {tool.highlight}
                      </Badge>
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-2">
                  {tool.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Sample Input Preview */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Sample Input:</h4>
                  <div className="space-y-1 text-xs text-gray-600">
                    {Object.entries(tool.sampleInput).slice(0, 3).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sample Output Preview */}
                <div className="bg-green-50 rounded-lg p-3">
                  <h4 className="font-semibold text-sm text-green-700 mb-2">Expected Output:</h4>
                  <div className="text-xs text-green-600">
                    {typeof tool.sampleOutput === 'object' && tool.sampleOutput.explanation ? (
                      <p>{tool.sampleOutput.explanation}</p>
                    ) : (
                      <p>Detailed analysis with actionable insights</p>
                    )}
                  </div>
                </div>

                {/* Try Tool Button */}
                <Link href={tool.path}>
                  <Button className="w-full group">
                    <Play className="w-4 h-4 mr-2" />
                    Try This Tool
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                {/* Quick Feedback */}
                <div className="flex items-center justify-center gap-2 pt-2 border-t">
                  <span className="text-xs text-gray-500">Helpful?</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleFeedback(tool.id, 'positive')}
                    className="h-8 w-8 p-0"
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleFeedback(tool.id, 'negative')}
                    className="h-8 w-8 p-0"
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>

              {/* Tooltip for highlighted tool */}
              {showTooltips && highlightedTool === tool.id && (
                <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs rounded px-2 py-1 z-10">
                  Click to explore!
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Demo Features */}
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <Info className="w-5 h-5" />
              Demo Experience Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900">Realistic Data</h4>
                <p className="text-sm text-gray-600">All tools pre-filled with authentic project scenarios</p>
              </div>
              <div className="text-center">
                <Sparkles className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900">AI Responses</h4>
                <p className="text-sm text-gray-600">Mock AI insights show platform capabilities</p>
              </div>
              <div className="text-center">
                <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900">User Journey</h4>
                <p className="text-sm text-gray-600">Experience complete workflows end-to-end</p>
              </div>
              <div className="text-center">
                <Users className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900">Dual Modes</h4>
                <p className="text-sm text-gray-600">Switch between homeowner and professional views</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedback Section */}
        <Card>
          <CardHeader>
            <CardTitle>Demo Feedback</CardTitle>
            <CardDescription>
              Help us improve the demo experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="What did you think of this demo? Any features you'd like to see?"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="mb-4"
            />
            <Button onClick={submitFeedback} disabled={!feedbackText.trim()}>
              Submit Feedback
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Demo Tour Overlay */}
      <DemoTourOverlay
        isActive={showTour}
        onClose={() => setShowTour(false)}
        isDemoUser={isDemoUser}
      />
    </div>
  );
}
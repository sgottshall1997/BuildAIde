import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CheckCircle, Download, Mail, Calendar, DollarSign, Users, FileText, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { ModeSwitcher } from "@/components/mode-toggle";

interface ChecklistItem {
  id: string;
  category: string;
  task: string;
  description: string;
  timeframe: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

export default function RenovationChecklist() {
  const [projectType, setProjectType] = useState("kitchen-remodel");
  const [userLocation, setUserLocation] = useState("Kensington, MD");
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    generateChecklist();
  }, [projectType, userLocation]);

  useEffect(() => {
    const completed = checklist.filter(item => item.completed).length;
    setCompletedCount(completed);
  }, [checklist]);

  const generateChecklist = () => {
    const baseItems: Record<string, ChecklistItem[]> = {
      "kitchen-remodel": [
        {
          id: "k1",
          category: "Planning",
          task: "Set your budget range",
          description: "Determine how much you can spend, including 15-20% buffer",
          timeframe: "Week 1",
          priority: "high",
          completed: false
        },
        {
          id: "k2",
          category: "Planning",
          task: "Research kitchen layouts",
          description: "Look at galley, L-shaped, and island designs that fit your space",
          timeframe: "Week 1",
          priority: "medium",
          completed: false
        },
        {
          id: "k3",
          category: "Contractors",
          task: `Contact 3-4 contractors in ${userLocation}`,
          description: "Get quotes from licensed, insured contractors with good reviews",
          timeframe: "Week 2-3",
          priority: "high",
          completed: false
        },
        {
          id: "k4",
          category: "Legal",
          task: `Research permits required in ${userLocation}`,
          description: "Most kitchen remodels need electrical and plumbing permits",
          timeframe: "Week 2",
          priority: "high",
          completed: false
        },
        {
          id: "k5",
          category: "Materials",
          task: "Choose cabinet style and finish",
          description: "Decide between stock, semi-custom, or custom cabinets",
          timeframe: "Week 3-4",
          priority: "medium",
          completed: false
        },
        {
          id: "k6",
          category: "Materials",
          task: "Select countertop material",
          description: "Compare quartz, granite, marble, and butcher block options",
          timeframe: "Week 3-4",
          priority: "medium",
          completed: false
        },
        {
          id: "k7",
          category: "Financial",
          task: "Secure financing if needed",
          description: "Explore home equity loans, personal loans, or cash-out refinancing",
          timeframe: "Week 2-3",
          priority: "high",
          completed: false
        },
        {
          id: "k8",
          category: "Timeline",
          task: "Plan temporary kitchen setup",
          description: "Arrange microwave, mini-fridge, and dining space during renovation",
          timeframe: "Week 4",
          priority: "medium",
          completed: false
        }
      ],
      "bathroom-remodel": [
        {
          id: "b1",
          category: "Planning",
          task: "Measure your bathroom space",
          description: "Get exact dimensions for accurate quotes and planning",
          timeframe: "Week 1",
          priority: "high",
          completed: false
        },
        {
          id: "b2",
          category: "Planning",
          task: "Decide on layout changes",
          description: "Determine if you're keeping existing plumbing locations",
          timeframe: "Week 1",
          priority: "high",
          completed: false
        },
        {
          id: "b3",
          category: "Contractors",
          task: `Get quotes from 3 contractors in ${userLocation}`,
          description: "Focus on contractors experienced with bathroom remodels",
          timeframe: "Week 2",
          priority: "high",
          completed: false
        },
        {
          id: "b4",
          category: "Legal",
          task: `Check permit requirements in ${userLocation}`,
          description: "Electrical and plumbing changes typically require permits",
          timeframe: "Week 2",
          priority: "high",
          completed: false
        },
        {
          id: "b5",
          category: "Materials",
          task: "Choose tile and flooring",
          description: "Select slip-resistant, water-resistant materials",
          timeframe: "Week 3",
          priority: "medium",
          completed: false
        },
        {
          id: "b6",
          category: "Materials",
          task: "Select fixtures and fittings",
          description: "Choose toilet, vanity, faucets, and shower/tub",
          timeframe: "Week 3",
          priority: "medium",
          completed: false
        },
        {
          id: "b7",
          category: "Timeline",
          task: "Plan alternative bathroom arrangements",
          description: "Identify backup bathroom or temporary solutions",
          timeframe: "Week 1",
          priority: "medium",
          completed: false
        }
      ]
    };

    const items = baseItems[projectType] || baseItems["kitchen-remodel"];
    setChecklist(items);
  };

  const toggleTask = (id: string) => {
    setChecklist(prev => 
      prev.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const downloadChecklist = () => {
    const checklistText = `${projectType.replace('-', ' ').toUpperCase()} RENOVATION CHECKLIST\n\n` +
      checklist.map(item => 
        `[${item.completed ? 'X' : ' '}] ${item.task}\n    ${item.description}\n    Timeline: ${item.timeframe}\n    Priority: ${item.priority.toUpperCase()}\n`
      ).join('\n');
    
    const blob = new Blob([checklistText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'renovation-checklist.txt';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Checklist Downloaded!",
      description: "Your personalized checklist has been saved as a text file.",
    });
  };

  const emailChecklist = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to receive the checklist.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/email-checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          projectType,
          checklist,
          userLocation
        }),
      });

      if (response.ok) {
        toast({
          title: "Email Sent!",
          description: "Your checklist has been sent to your email address.",
        });
        setEmail("");
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Email Error",
        description: "We couldn't send the email. Please try downloading instead.",
        variant: "destructive",
      });
    }
  };

  const categories = [...new Set(checklist.map(item => item.category))];
  const progressPercentage = checklist.length > 0 ? (completedCount / checklist.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/consumer-dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Your Renovation Checklist</h1>
              <p className="text-slate-600">Stay organized with your personalized action plan</p>
            </div>
          </div>
          <ModeSwitcher currentMode="consumer" />
        </div>

        {/* Progress Overview */}
        <Card className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-green-900">
                  {projectType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Checklist
                </h2>
                <p className="text-green-700">
                  {completedCount} of {checklist.length} tasks completed ({Math.round(progressPercentage)}%)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <span className="text-3xl font-bold text-green-900">{completedCount}/{checklist.length}</span>
              </div>
            </div>
            <div className="w-full bg-green-200 rounded-full h-3">
              <div 
                className="bg-green-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Download className="w-8 h-8 text-blue-600" />
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900">Download</h3>
                  <p className="text-sm text-blue-700">Save as text file</p>
                </div>
                <Button onClick={downloadChecklist} size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Mail className="w-8 h-8 text-purple-600" />
                <div className="flex-1">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
                <Button onClick={emailChecklist} size="sm" className="bg-purple-600 hover:bg-purple-700">
                  Email
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-orange-600" />
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-900">Timeline</h3>
                  <p className="text-sm text-orange-700">Plan your schedule</p>
                </div>
                <Link href="/project-timeline">
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                    View
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Checklist by Category */}
        <div className="space-y-6">
          {categories.map(category => {
            const categoryItems = checklist.filter(item => item.category === category);
            const categoryCompleted = categoryItems.filter(item => item.completed).length;
            
            return (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {category === 'Planning' && <FileText className="w-5 h-5 text-blue-600" />}
                      {category === 'Contractors' && <Users className="w-5 h-5 text-green-600" />}
                      {category === 'Legal' && <AlertTriangle className="w-5 h-5 text-red-600" />}
                      {category === 'Materials' && <DollarSign className="w-5 h-5 text-purple-600" />}
                      {category === 'Financial' && <DollarSign className="w-5 h-5 text-yellow-600" />}
                      {category === 'Timeline' && <Calendar className="w-5 h-5 text-orange-600" />}
                      <span className="text-xl">{category}</span>
                    </div>
                    <Badge variant="outline" className="bg-white">
                      {categoryCompleted}/{categoryItems.length} done
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {categoryItems.map(item => (
                    <div
                      key={item.id}
                      className={`p-4 border rounded-lg transition-all ${
                        item.completed 
                          ? 'bg-green-50 border-green-200 opacity-75' 
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={item.completed}
                          onCheckedChange={() => toggleTask(item.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className={`font-semibold ${item.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                              {item.task}
                            </h4>
                            <div className="flex items-center gap-2">
                              <Badge className={getPriorityColor(item.priority)} variant="outline">
                                {item.priority}
                              </Badge>
                              <Badge variant="outline" className="bg-slate-50">
                                {item.timeframe}
                              </Badge>
                            </div>
                          </div>
                          <p className={`text-sm ${item.completed ? 'text-slate-400' : 'text-slate-600'}`}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Completion Message */}
        {completedCount === checklist.length && checklist.length > 0 && (
          <Card className="mt-8 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
              <p className="text-lg mb-4">You've completed all items on your renovation checklist!</p>
              <div className="flex justify-center gap-4">
                <Link href="/quote-compare">
                  <Button variant="outline" className="bg-white text-green-600 hover:bg-slate-50">
                    Compare Quotes
                  </Button>
                </Link>
                <Link href="/ai-assistant">
                  <Button variant="outline" className="bg-white text-green-600 hover:bg-slate-50">
                    Ask Questions
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock, CheckCircle, Calendar, AlertTriangle, Download } from "lucide-react";
import { Link } from "wouter";
import { ModeSwitcher } from "@/components/mode-toggle";

interface TimelinePhase {
  id: string;
  name: string;
  description: string;
  duration: string;
  order: number;
  critical: boolean;
  tasks: string[];
}

export default function ProjectTimeline() {
  const [selectedProject, setSelectedProject] = useState("kitchen-remodel");
  const [finishLevel, setFinishLevel] = useState("midrange");

  const getProjectPhases = (projectType: string, finish: string): TimelinePhase[] => {
    const basePhases: Record<string, TimelinePhase[]> = {
      "kitchen-remodel": [
        {
          id: "planning",
          name: "Planning & Design",
          description: "Finalize plans, order materials, secure permits",
          duration: "1-2 weeks",
          order: 1,
          critical: true,
          tasks: ["Design approval", "Material selection", "Permit application", "Contractor contract"]
        },
        {
          id: "permits",
          name: "Permits & Prep",
          description: "Wait for permit approval, prepare workspace",
          duration: "1-2 weeks",
          order: 2,
          critical: true,
          tasks: ["Permit approval", "Material delivery", "Workspace prep", "Utility shutdown"]
        },
        {
          id: "demo",
          name: "Demolition",
          description: "Remove old cabinets, countertops, and fixtures",
          duration: "2-3 days",
          order: 3,
          critical: false,
          tasks: ["Cabinet removal", "Countertop removal", "Appliance removal", "Cleanup"]
        },
        {
          id: "rough",
          name: "Rough Work",
          description: "Electrical, plumbing, and structural changes",
          duration: "3-5 days",
          order: 4,
          critical: true,
          tasks: ["Electrical rough-in", "Plumbing rough-in", "Drywall repairs", "Inspection"]
        },
        {
          id: "finishes",
          name: "Installation",
          description: "Install cabinets, countertops, and appliances",
          duration: "1-2 weeks",
          order: 5,
          critical: false,
          tasks: ["Cabinet installation", "Countertop installation", "Appliance installation", "Backsplash"]
        },
        {
          id: "final",
          name: "Final Details",
          description: "Painting, trim work, and final inspection",
          duration: "3-5 days",
          order: 6,
          critical: false,
          tasks: ["Paint touch-ups", "Hardware installation", "Final cleanup", "Final inspection"]
        }
      ],
      "bathroom-remodel": [
        {
          id: "planning",
          name: "Planning & Design",
          description: "Design finalization and material ordering",
          duration: "1 week",
          order: 1,
          critical: true,
          tasks: ["Design approval", "Fixture selection", "Tile selection", "Permit application"]
        },
        {
          id: "demo",
          name: "Demolition",
          description: "Remove old fixtures and finishes",
          duration: "1-2 days",
          order: 2,
          critical: false,
          tasks: ["Fixture removal", "Tile removal", "Vanity removal", "Cleanup"]
        },
        {
          id: "rough",
          name: "Rough Work",
          description: "Plumbing and electrical updates",
          duration: "2-3 days",
          order: 3,
          critical: true,
          tasks: ["Plumbing rough-in", "Electrical work", "Ventilation", "Inspection"]
        },
        {
          id: "waterproof",
          name: "Waterproofing",
          description: "Install shower pan and waterproof membrane",
          duration: "1-2 days",
          order: 4,
          critical: true,
          tasks: ["Shower pan installation", "Membrane installation", "Backer board", "Inspection"]
        },
        {
          id: "finishes",
          name: "Tile & Fixtures",
          description: "Install tile, vanity, and fixtures",
          duration: "3-5 days",
          order: 5,
          critical: false,
          tasks: ["Tile installation", "Vanity installation", "Fixture installation", "Grouting"]
        },
        {
          id: "final",
          name: "Final Details",
          description: "Paint, accessories, and final touches",
          duration: "1-2 days",
          order: 6,
          critical: false,
          tasks: ["Paint touch-ups", "Accessory installation", "Caulking", "Final cleanup"]
        }
      ]
    };

    let phases = basePhases[projectType] || basePhases["kitchen-remodel"];
    
    // Adjust durations based on finish level
    if (finish === "premium") {
      phases = phases.map(phase => ({
        ...phase,
        duration: phase.duration.includes("week") 
          ? phase.duration.replace(/(\d+)/g, (match) => String(parseInt(match) + 1))
          : phase.duration.includes("day") 
            ? phase.duration.replace(/(\d+)/g, (match) => String(parseInt(match) + 1))
            : phase.duration
      }));
    }
    
    return phases;
  };

  const phases = getProjectPhases(selectedProject, finishLevel);
  
  const getTotalDuration = () => {
    // Simple calculation - in a real app would be more sophisticated
    const projectDurations: Record<string, Record<string, string>> = {
      "kitchen-remodel": {
        "basic": "4-6 weeks",
        "midrange": "6-8 weeks",
        "premium": "8-12 weeks"
      },
      "bathroom-remodel": {
        "basic": "2-3 weeks",
        "midrange": "3-4 weeks", 
        "premium": "4-6 weeks"
      }
    };
    
    return projectDurations[selectedProject]?.[finishLevel] || "4-8 weeks";
  };

  const downloadTimeline = () => {
    // In a real app, this would generate a PDF
    const timelineText = phases.map(phase => 
      `${phase.name} (${phase.duration}): ${phase.description}\nTasks: ${phase.tasks.join(', ')}\n`
    ).join('\n');
    
    const blob = new Blob([timelineText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'renovation-timeline.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

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
              <h1 className="text-3xl font-bold text-slate-900">Your Project Timeline</h1>
              <p className="text-slate-600">See what to expect during your renovation</p>
            </div>
          </div>
          <ModeSwitcher currentMode="consumer" />
        </div>

        {/* Project Info */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-blue-900 mb-2">
                  {selectedProject.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Timeline
                </h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-700 font-medium">Total Duration: {getTotalDuration()}</span>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {finishLevel.charAt(0).toUpperCase() + finishLevel.slice(1)} Finish
                  </Badge>
                </div>
              </div>
              <Button onClick={downloadTimeline} variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download Timeline
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Timeline Phases */}
        <div className="space-y-4 mb-8">
          {phases.map((phase, index) => (
            <Card key={phase.id} className={`${phase.critical ? 'border-orange-200 bg-orange-50' : 'border-slate-200'}`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Phase Number */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                    phase.critical ? 'bg-orange-500' : 'bg-blue-500'
                  }`}>
                    {phase.order}
                  </div>
                  
                  {/* Phase Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                          {phase.name}
                          {phase.critical && (
                            <AlertTriangle className="w-5 h-5 text-orange-500" title="Critical phase" />
                          )}
                        </h3>
                        <p className="text-slate-600">{phase.description}</p>
                      </div>
                      <Badge variant="outline" className="bg-white">
                        {phase.duration}
                      </Badge>
                    </div>
                    
                    {/* Task List */}
                    <div className="grid md:grid-cols-2 gap-2">
                      {phase.tasks.map((task, taskIndex) => (
                        <div key={taskIndex} className="flex items-center gap-2 text-sm text-slate-700">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {task}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Timeline Tips */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Timeline Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-green-700 text-sm">
                <li>• Critical phases (marked with ⚠️) can't be rushed</li>
                <li>• Weather can delay exterior work</li>
                <li>• Material delays add 1-2 weeks typically</li>
                <li>• Permit approval varies by location</li>
                <li>• Premium finishes add extra time</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-amber-50 border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-800 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Best Times to Start
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-amber-700 text-sm">
                <li>• <strong>Fall/Winter:</strong> Better contractor availability</li>
                <li>• <strong>Spring:</strong> Good for outdoor projects</li>
                <li>• <strong>Avoid:</strong> December holidays</li>
                <li>• <strong>Plan ahead:</strong> 2-3 months minimum</li>
                <li>• <strong>Book early:</strong> Good contractors get busy</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Ready to Get Started?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Link href="/renovation-checklist">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Get Your Checklist
                </Button>
              </Link>
              <Link href="/quote-compare">
                <Button variant="outline">
                  Compare Contractor Quotes
                </Button>
              </Link>
              <Link href="/ai-assistant">
                <Button variant="outline">
                  Ask Questions
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
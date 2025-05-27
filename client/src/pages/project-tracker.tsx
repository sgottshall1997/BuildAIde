import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Circle, Calendar, DollarSign, FileText, Hammer, Trophy, Plus, Edit2, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProjectStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  completedDate?: string;
  notes?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  budget: number;
  startDate: string;
  estimatedEndDate: string;
  steps: ProjectStep[];
  createdAt: string;
}

const defaultSteps: Omit<ProjectStep, 'id'>[] = [
  {
    title: "Estimate Sent",
    description: "Get initial cost estimates from contractors",
    completed: false
  },
  {
    title: "Contractor Selected",
    description: "Choose your preferred contractor and sign contract",
    completed: false
  },
  {
    title: "Permit Filed",
    description: "Submit necessary permits to local authorities",
    completed: false
  },
  {
    title: "In Progress",
    description: "Active construction and renovation work",
    completed: false
  },
  {
    title: "Complete",
    description: "Final inspection and project completion",
    completed: false
  }
];

export default function ProjectTracker() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingStep, setEditingStep] = useState<string | null>(null);
  const [stepNotes, setStepNotes] = useState("");
  const { toast } = useToast();

  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    budget: "",
    estimatedEndDate: ""
  });

  useEffect(() => {
    // Load projects from localStorage
    const storedProjects = localStorage.getItem('renovation-projects');
    if (storedProjects) {
      try {
        const parsed = JSON.parse(storedProjects);
        setProjects(parsed);
        if (parsed.length > 0) {
          setSelectedProject(parsed[0]);
        }
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    }
  }, []);

  const saveProjects = (updatedProjects: Project[]) => {
    localStorage.setItem('renovation-projects', JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
  };

  const createProject = () => {
    if (!newProject.name.trim()) {
      toast({
        title: "Project name required",
        description: "Please enter a name for your project",
        variant: "destructive"
      });
      return;
    }

    // Check if in demo mode
    if (import.meta.env.VITE_DEMO_MODE) {
      toast({
        title: "🔒 Demo Mode",
        description: "Project creation is disabled in demo mode. In production, this would save to your project database.",
      });
      return;
    }

    const project: Project = {
      id: `project-${Date.now()}`,
      name: newProject.name,
      description: newProject.description,
      budget: parseFloat(newProject.budget) || 0,
      startDate: new Date().toISOString().split('T')[0],
      estimatedEndDate: newProject.estimatedEndDate,
      steps: defaultSteps.map((step, index) => ({
        ...step,
        id: `step-${Date.now()}-${index}`
      })),
      createdAt: new Date().toISOString()
    };

    const updatedProjects = [...projects, project];
    saveProjects(updatedProjects);
    setSelectedProject(project);
    setIsCreating(false);
    setNewProject({ name: "", description: "", budget: "", estimatedEndDate: "" });

    toast({
      title: "Project created!",
      description: "Your renovation project has been added to the tracker."
    });
  };

  const toggleStep = (stepId: string) => {
    if (!selectedProject) return;

    // Check if in demo mode
    if (import.meta.env.VITE_DEMO_MODE) {
      toast({
        title: "🔒 Demo Mode",
        description: "Step updates are disabled in demo mode. In production, this would track your progress.",
      });
      return;
    }

    const updatedSteps = selectedProject.steps.map(step => {
      if (step.id === stepId) {
        return {
          ...step,
          completed: !step.completed,
          completedDate: !step.completed ? new Date().toISOString().split('T')[0] : undefined
        };
      }
      return step;
    });

    const updatedProject = { ...selectedProject, steps: updatedSteps };
    const updatedProjects = projects.map(p => p.id === selectedProject.id ? updatedProject : p);
    
    saveProjects(updatedProjects);
    setSelectedProject(updatedProject);

    toast({
      title: updatedSteps.find(s => s.id === stepId)?.completed ? "Step completed!" : "Step reopened",
      description: "Project progress updated"
    });
  };

  const saveStepNotes = (stepId: string) => {
    if (!selectedProject) return;

    // Check if in demo mode
    if (import.meta.env.VITE_DEMO_MODE) {
      toast({
        title: "🔒 Demo Mode",
        description: "Note saving is disabled in demo mode. In production, this would save to your project database.",
      });
      return;
    }

    const updatedSteps = selectedProject.steps.map(step => {
      if (step.id === stepId) {
        return { ...step, notes: stepNotes };
      }
      return step;
    });

    const updatedProject = { ...selectedProject, steps: updatedSteps };
    const updatedProjects = projects.map(p => p.id === selectedProject.id ? updatedProject : p);
    
    saveProjects(updatedProjects);
    setSelectedProject(updatedProject);
    setEditingStep(null);
    setStepNotes("");

    toast({
      title: "Notes saved",
      description: "Step notes have been updated"
    });
  };

  const getCompletionPercentage = (project: Project) => {
    const completed = project.steps.filter(step => step.completed).length;
    return Math.round((completed / project.steps.length) * 100);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Project Tracker</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Keep track of your renovation progress with our step-by-step checklist system.
        </p>
      </div>

      {/* Project Selection & Creation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Your Projects</CardTitle>
                <Button
                  onClick={() => setIsCreating(true)}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  New
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {projects.length === 0 && !isCreating && (
                <div className="text-center py-8 text-slate-500">
                  <Hammer className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p>No projects yet</p>
                  <p className="text-sm">Create your first renovation project to get started</p>
                </div>
              )}

              {isCreating && (
                <Card className="border-2 border-blue-200">
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <Label htmlFor="project-name">Project Name</Label>
                      <Input
                        id="project-name"
                        placeholder="Kitchen Renovation"
                        value={newProject.name}
                        onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="project-description">Description</Label>
                      <Textarea
                        id="project-description"
                        placeholder="Brief description of your project"
                        value={newProject.description}
                        onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="project-budget">Budget ($)</Label>
                      <Input
                        id="project-budget"
                        type="number"
                        placeholder="25000"
                        value={newProject.budget}
                        onChange={(e) => setNewProject(prev => ({ ...prev, budget: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="project-end-date">Target Completion</Label>
                      <Input
                        id="project-end-date"
                        type="date"
                        value={newProject.estimatedEndDate}
                        onChange={(e) => setNewProject(prev => ({ ...prev, estimatedEndDate: e.target.value }))}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={createProject} size="sm" className="flex-1">
                        <Save className="w-4 h-4 mr-1" />
                        Create
                      </Button>
                      <Button 
                        onClick={() => setIsCreating(false)} 
                        variant="outline" 
                        size="sm"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {projects.map((project) => (
                <Card
                  key={project.id}
                  className={`cursor-pointer transition-all ${
                    selectedProject?.id === project.id
                      ? 'border-2 border-blue-500 bg-blue-50'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedProject(project)}
                >
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-slate-900 mb-1">{project.name}</h3>
                    <p className="text-sm text-slate-600 mb-2">{project.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">
                        {getCompletionPercentage(project)}% Complete
                      </Badge>
                      <span className="text-xs text-slate-500">
                        ${project.budget.toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Project Details */}
        <div className="lg:col-span-2">
          {selectedProject ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{selectedProject.name}</CardTitle>
                    <CardDescription>{selectedProject.description}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {getCompletionPercentage(selectedProject)}%
                    </div>
                    <div className="text-sm text-slate-500">Complete</div>
                  </div>
                </div>
                <Progress value={getCompletionPercentage(selectedProject)} className="mt-4" />
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Project Info */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
                  <div className="text-center">
                    <DollarSign className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <div className="text-sm text-slate-600">Budget</div>
                    <div className="font-semibold">${selectedProject.budget.toLocaleString()}</div>
                  </div>
                  <div className="text-center">
                    <Calendar className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <div className="text-sm text-slate-600">Started</div>
                    <div className="font-semibold">{new Date(selectedProject.startDate).toLocaleDateString()}</div>
                  </div>
                  <div className="text-center">
                    <Trophy className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                    <div className="text-sm text-slate-600">Target</div>
                    <div className="font-semibold">
                      {selectedProject.estimatedEndDate 
                        ? new Date(selectedProject.estimatedEndDate).toLocaleDateString()
                        : 'Not set'
                      }
                    </div>
                  </div>
                </div>

                {/* Steps */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-slate-900 mb-3">Project Steps</h3>
                  {selectedProject.steps.map((step, index) => (
                    <Card key={step.id} className={step.completed ? 'bg-green-50 border-green-200' : ''}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleStep(step.id)}
                            className="mt-1 transition-colors"
                          >
                            {step.completed ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                            )}
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className={`font-medium ${step.completed ? 'text-green-800' : 'text-slate-900'}`}>
                                {step.title}
                              </h4>
                              <div className="flex items-center gap-2">
                                {step.completedDate && (
                                  <Badge variant="secondary" className="text-xs">
                                    Completed {new Date(step.completedDate).toLocaleDateString()}
                                  </Badge>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditingStep(step.id);
                                    setStepNotes(step.notes || "");
                                  }}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-slate-600 mt-1">{step.description}</p>
                            
                            {editingStep === step.id ? (
                              <div className="mt-3 space-y-2">
                                <Textarea
                                  placeholder="Add notes about this step..."
                                  value={stepNotes}
                                  onChange={(e) => setStepNotes(e.target.value)}
                                  rows={2}
                                />
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => saveStepNotes(step.id)}
                                  >
                                    Save Notes
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setEditingStep(null);
                                      setStepNotes("");
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : step.notes && (
                              <div className="mt-2 p-2 bg-slate-100 rounded text-sm text-slate-700">
                                <FileText className="w-3 h-3 inline mr-1" />
                                {step.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Hammer className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <h3 className="text-xl font-semibold text-slate-600 mb-2">Select a Project</h3>
                <p className="text-slate-500">
                  Choose a project from the list or create a new one to start tracking your renovation progress.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
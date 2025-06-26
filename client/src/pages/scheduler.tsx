import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import FeedbackButton from "@/components/feedback-button";
import PaymentTimeline from "@/components/payment-timeline";
import { Calendar, Clock, Users, AlertTriangle, Zap, Edit, CheckCircle, Plus, BarChart3, Brain, TrendingUp, Timer, DollarSign, FileText } from "lucide-react";
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

const sampleBathroomSchedule = [
  { id: '1', task: 'Demo old fixtures', start: '2025-06-01', end: '2025-06-03', status: 'completed', crew: 'John D.', dependency: null, conflict: false },
  { id: '2', task: 'Rough plumbing', start: '2025-06-04', end: '2025-06-07', status: 'in-progress', crew: 'Mike R.', dependency: 'Demo old fixtures', conflict: false },
  { id: '3', task: 'Electrical rough-in', start: '2025-06-06', end: '2025-06-08', status: 'pending', crew: 'Sarah L.', dependency: 'Demo old fixtures', conflict: true },
  { id: '4', task: 'Drywall installation', start: '2025-06-09', end: '2025-06-11', status: 'pending', crew: 'Tom W.', dependency: 'Electrical rough-in', conflict: false },
  { id: '5', task: 'Tile installation', start: '2025-06-12', end: '2025-06-16', status: 'pending', crew: 'Lisa K.', dependency: 'Drywall installation', conflict: false },
  { id: '6', task: 'Fixture installation', start: '2025-06-17', end: '2025-06-19', status: 'pending', crew: 'Mike R.', dependency: 'Tile installation', conflict: false },
  { id: '7', task: 'Final inspection', start: '2025-06-20', end: '2025-06-20', status: 'pending', crew: 'Inspector', dependency: 'Fixture installation', conflict: false }
];

const mockSchedules = [
  {
    id: '1',
    projectName: 'Kitchen Renovation - 123 Oak St',
    startDate: '2025-06-01',
    endDate: '2025-06-15',
    status: 'In Progress',
    crew: ['John D.', 'Mike R.', 'Sarah L.'],
    phase: 'Demolition',
    tasks: []
  },
  {
    id: '2',
    projectName: 'Bathroom Remodel - 456 Pine Ave',
    startDate: '2025-06-08',
    endDate: '2025-06-22',
    status: 'Planning',
    crew: ['Tom W.', 'Lisa K.'],
    phase: 'Planning',
    tasks: []
  }
];

export default function Scheduler() {
  const [schedules, setSchedules] = useState(mockSchedules);
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
  const [taskSchedule, setTaskSchedule] = useState<any[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResults, setOptimizationResults] = useState<any>(null);
  const [showOptimizationDialog, setShowOptimizationDialog] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [processingTime, setProcessingTime] = useState<string>("");
  const [isGeneratingTimeline, setIsGeneratingTimeline] = useState(false);
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const [viewingProject, setViewingProject] = useState<any>(null);
  const { toast } = useToast();

  // Project form state
  const [projectForm, setProjectForm] = useState({
    projectName: '',
    projectType: '',
    size: '',
    startDate: '',
    budget: '',
    majorTasks: [] as string[],
    clientName: '',
    propertyAddress: '',
    estimatedDuration: 0,
    crewMembers: 2,
    estimatedBudget: 0,
    projectedProfit: 0,
    notes: '',
    upfrontPercent: 25,
    midProjectPercent: 50,
    finalPercent: 25,
    paymentTerms: 'Net 30',
    useDetailedSteps: false,
    projectSteps: [] as any[]
  });

  const [showStepsDialog, setShowStepsDialog] = useState(false);
  const [editingStep, setEditingStep] = useState<any>(null);
  const [showStepEditDialog, setShowStepEditDialog] = useState(false);

  // Load sample bathroom remodel schedule for demo
  const loadBathroomRemodel = () => {
    setTaskSchedule(sampleBathroomSchedule);
    setSelectedSchedule('bathroom-demo');
    toast({
      title: "Sample Schedule Loaded! 🛁",
      description: "Bathroom remodel timeline with 7 tasks and conflict detection",
    });
  };

  // AI Timeline Generation Mutation
  const generateTimelineMutation = useMutation({
    mutationFn: async (projectData: any) => {
      const response = await fetch('/api/generate-project-timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate timeline');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      // Convert AI timeline to task schedule format
      const generatedTasks = data.timeline.map((task: any, index: number) => ({
        id: `task-${index + 1}`,
        task: task.task,
        start: calculateStartDate(projectForm.startDate, task.startWeek),
        end: calculateEndDate(projectForm.startDate, task.endWeek),
        status: 'pending',
        crew: 'TBD',
        dependency: task.dependencies?.[0] || null,
        conflict: false,
        category: task.category,
        criticalPath: task.criticalPath
      }));

      setTaskSchedule(generatedTasks);
      setCurrentProject({
        ...projectForm,
        timeline: data,
        estimatedCost: calculateProjectCost(projectForm.projectType, projectForm.size, projectForm.budget)
      });
      setSelectedSchedule(`custom-${Date.now()}`);
      setIsGeneratingTimeline(false);
      setShowProjectForm(false);
      
      toast({
        title: "Timeline Generated Successfully!",
        description: `Created ${generatedTasks.length} tasks with ${data.totalDuration} week duration`,
      });
    },
    onError: (error) => {
      setIsGeneratingTimeline(false);
      toast({
        title: "Timeline Generation Failed",
        description: "Unable to generate project timeline. Please try again.",
        variant: "destructive"
      });
    }
  });

  // AI Schedule Optimization Mutation
  const optimizeMutation = useMutation({
    mutationFn: async ({ tasks, projectDeadline }: { tasks: any[], projectDeadline: string }) => {
      const startTime = Date.now();
      const response = await fetch('/api/optimize-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks, projectDeadline })
      });
      
      if (!response.ok) {
        throw new Error('Failed to optimize schedule');
      }
      
      const data = await response.json();
      const endTime = Date.now();
      setProcessingTime(`${((endTime - startTime) / 1000).toFixed(1)}s`);
      return data;
    },
    onSuccess: (data) => {
      setOptimizationResults(data.optimization);
      setShowOptimizationDialog(true);
      setIsOptimizing(false);
      
      toast({
        title: "AI Schedule Analysis Complete!",
        description: `Found ${data.optimization.conflicts?.length || 0} conflicts and ${data.optimization.improvements?.length || 0} optimizations`,
      });
    },
    onError: (error) => {
      setIsOptimizing(false);
      toast({
        title: "Analysis Failed",
        description: "Unable to optimize schedule. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Helper functions for date calculations
  const calculateStartDate = (projectStart: string, weekNumber: number) => {
    const start = new Date(projectStart);
    start.setDate(start.getDate() + (weekNumber - 1) * 7);
    return start.toISOString().split('T')[0];
  };

  const calculateEndDate = (projectStart: string, weekNumber: number) => {
    const start = new Date(projectStart);
    start.setDate(start.getDate() + weekNumber * 7 - 1);
    return start.toISOString().split('T')[0];
  };

  const calculateProjectCost = (projectType: string, size: string, budget: string) => {
    const budgetNum = parseFloat(budget) || 0;
    if (budgetNum > 0) return budgetNum;
    
    // Fallback estimation based on project type and size
    const baseCosts: any = {
      'kitchen': 25000,
      'bathroom': 15000,
      'addition': 50000,
      'basement': 30000,
      'whole-house': 150000,
      'exterior': 20000
    };
    
    const sizeMultipliers: any = {
      'small': 0.7,
      'medium': 1.0,
      'large': 1.5,
      'extra-large': 2.0
    };
    
    return (baseCosts[projectType] || 25000) * (sizeMultipliers[size] || 1.0);
  };

  // Project form handlers
  const handleCreateProject = () => {
    if (!projectForm.projectName || !projectForm.projectType || !projectForm.startDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in project name, type, and start date",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingTimeline(true);
    generateTimelineMutation.mutate({
      projectType: projectForm.projectType,
      size: projectForm.size || 'medium',
      startDate: projectForm.startDate,
      majorTasks: projectForm.majorTasks.length > 0 ? projectForm.majorTasks : []
    });
  };

  const addMajorTask = (task: string) => {
    if (task.trim() && !projectForm.majorTasks.includes(task.trim())) {
      setProjectForm(prev => ({
        ...prev,
        majorTasks: [...prev.majorTasks, task.trim()]
      }));
    }
  };

  const removeMajorTask = (taskToRemove: string) => {
    setProjectForm(prev => ({
      ...prev,
      majorTasks: prev.majorTasks.filter(task => task !== taskToRemove)
    }));
  };

  const optimizeSchedule = () => {
    if (taskSchedule.length === 0) return;
    
    setIsOptimizing(true);
    optimizeMutation.mutate({
      tasks: taskSchedule,
      projectDeadline: "2025-06-25"
    });
  };

  const applyOptimizations = () => {
    if (!optimizationResults) return;
    
    const optimizedTasks = taskSchedule.map(task => ({
      ...task,
      optimized: true,
      conflict: false,
      aiRecommendation: optimizationResults.improvements?.find((imp: any) => 
        imp.taskId === task.id
      )?.recommendation || null
    }));
    
    setTaskSchedule(optimizedTasks);
    setShowOptimizationDialog(false);
    
    toast({
      title: "✅ Optimizations Applied!",
      description: "Schedule updated with AI recommendations",
    });
  };

  // Project management functions
  const openEditProject = (project: any) => {
    setEditingProject(project);
    setProjectForm({
      ...projectForm,
      projectName: project.projectName || '',
      projectType: project.projectType || '',
      size: project.size || '',
      startDate: project.startDate || '',
      budget: project.estimatedBudget?.toString() || '',
      clientName: project.clientName || '',
      propertyAddress: project.propertyAddress || '',
      estimatedDuration: project.estimatedDuration || 0,
      crewMembers: project.crewMembers || 2,
      estimatedBudget: project.estimatedBudget || 0,
      projectedProfit: project.projectedProfit || 0,
      notes: project.notes || '',
      upfrontPercent: project.upfrontPercent || 25,
      midProjectPercent: project.midProjectPercent || 50,
      finalPercent: project.finalPercent || 25,
      paymentTerms: project.paymentTerms || 'Net 30'
    });
    setShowEditDialog(true);
  };

  const openViewProject = (project: any) => {
    setViewingProject(project);
    setShowViewDialog(true);
  };

  const openDeleteDialog = (projectId: string) => {
    setDeletingProjectId(projectId);
    setShowDeleteDialog(true);
  };

  const deleteProject = () => {
    if (!deletingProjectId) return;
    
    setSchedules(prev => prev.filter(p => p.id !== deletingProjectId));
    setShowDeleteDialog(false);
    setDeletingProjectId(null);
    
    toast({
      title: "Project Deleted",
      description: "Project has been successfully removed",
    });
  };

  const saveProjectEdit = () => {
    if (!editingProject) return;
    
    const updatedProject = {
      ...editingProject,
      ...projectForm,
      estimatedBudget: parseFloat(projectForm.budget) || 0,
      profitMargin: projectForm.estimatedBudget > 0 ? 
        ((projectForm.projectedProfit / projectForm.estimatedBudget) * 100).toFixed(1) : '0'
    };
    
    setSchedules(prev => prev.map(p => 
      p.id === editingProject.id ? updatedProject : p
    ));
    
    setShowEditDialog(false);
    setEditingProject(null);
    
    toast({
      title: "Project Updated",
      description: "Project details have been saved successfully",
    });
  };

  // Step management functions
  const addProjectStep = () => {
    const newStep = {
      id: Date.now().toString(),
      name: '',
      description: '',
      estimatedDuration: 1,
      cost: 0,
      paymentPercent: 0,
      startDate: '',
      endDate: '',
      status: 'pending',
      subtasks: [],
      notes: '',
      dependencies: []
    };
    
    setProjectForm(prev => ({
      ...prev,
      projectSteps: [...prev.projectSteps, newStep]
    }));
  };

  const removeProjectStep = (stepId: string) => {
    setProjectForm(prev => ({
      ...prev,
      projectSteps: prev.projectSteps.filter(step => step.id !== stepId)
    }));
  };

  const editProjectStep = (step: any) => {
    setEditingStep(step);
    setShowStepEditDialog(true);
  };

  const saveStepEdit = (updatedStep: any) => {
    setProjectForm(prev => ({
      ...prev,
      projectSteps: prev.projectSteps.map(step => 
        step.id === updatedStep.id ? updatedStep : step
      )
    }));
    setShowStepEditDialog(false);
    setEditingStep(null);
    
    toast({
      title: "Step Updated",
      description: "Project step has been saved successfully",
    });
  };

  const addSubtask = (stepId: string, subtaskName: string) => {
    if (!subtaskName.trim()) return;
    
    setProjectForm(prev => ({
      ...prev,
      projectSteps: prev.projectSteps.map(step => 
        step.id === stepId 
          ? {
              ...step,
              subtasks: [...(step.subtasks || []), {
                id: Date.now().toString(),
                name: subtaskName.trim(),
                completed: false,
                notes: ''
              }]
            }
          : step
      )
    }));
  };

  const removeSubtask = (stepId: string, subtaskId: string) => {
    setProjectForm(prev => ({
      ...prev,
      projectSteps: prev.projectSteps.map(step => 
        step.id === stepId 
          ? {
              ...step,
              subtasks: (step.subtasks || []).filter(subtask => subtask.id !== subtaskId)
            }
          : step
      )
    }));
  };

  const calculateStepPayments = () => {
    const totalPercent = projectForm.projectSteps.reduce((sum, step) => sum + (step.paymentPercent || 0), 0);
    return {
      totalPercent,
      isValid: totalPercent === 100,
      remaining: 100 - totalPercent
    };
  };

  // Get task status styling
  const getTaskStatusColor = (status: string, conflict: boolean) => {
    if (conflict) return 'bg-red-500 text-white';
    switch (status) {
      case 'completed': return 'bg-green-500 text-white';
      case 'in-progress': return 'bg-blue-500 text-white';
      case 'pending': return 'bg-slate-300 text-slate-700';
      default: return 'bg-slate-200 text-slate-600';
    }
  };

  // Edit task details
  const openTaskEditor = (task: any) => {
    toast({
      title: `Edit: ${task.task}`,
      description: "Task editor would open here for detailed modifications",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 sm:mb-3 px-2">📅 Project Timeline Planner</h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto px-4">
            Create optimized project schedules with crew assignments, resource planning, and AI-powered timeline optimization.
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <Button 
            onClick={() => setShowProjectForm(true)} 
            className="bg-green-600 hover:bg-green-700"
          >
            <FileText className="w-4 h-4 mr-2" />
            Create New Project
          </Button>
          <Button onClick={loadBathroomRemodel} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Load Sample Project
          </Button>
          {taskSchedule.length > 0 && (
            <Button 
              onClick={optimizeSchedule} 
              disabled={isOptimizing}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Brain className={`w-4 h-4 mr-2 ${isOptimizing ? 'animate-pulse' : ''}`} />
              {isOptimizing ? 'Analyzing...' : 'Optimize Schedule'}
            </Button>
          )}
        </div>

        {/* Project Management View with Tabs */}
        {taskSchedule.length > 0 && (
          <Card className="mb-6 border-2 border-blue-200 bg-blue-50/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Project Management - Bathroom Remodel Demo
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  {taskSchedule.filter(task => task.conflict).length} conflicts detected
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="timeline" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="timeline" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Task Timeline
                  </TabsTrigger>
                  <TabsTrigger value="payments" className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Payment Schedule
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="timeline" className="mt-6">
                  <div className="space-y-3">
                    {taskSchedule.map((task, index) => (
                      <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg border bg-white">
                        <div className="flex-shrink-0">
                          <Badge className={getTaskStatusColor(task.status, task.conflict)}>
                            {task.conflict ? '⚠️' : task.status === 'completed' ? '✅' : task.status === 'in-progress' ? '🔵' : '⏳'}
                          </Badge>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className={`font-medium ${
                              new Date(task.end) > new Date('2025-06-25') ? 'text-red-600' : 'text-slate-900'
                            }`}>
                              {task.task}
                              {new Date(task.end) > new Date('2025-06-25') && (
                                <span className="ml-2 text-red-500 text-xs font-bold">⚠️ OVERFLOWS DEADLINE</span>
                              )}
                            </h4>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => openTaskEditor(task)}
                              className="opacity-60 hover:opacity-100"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {task.start} to {task.end}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {task.crew}
                            </span>
                            {task.dependency && (
                              <span className="text-xs text-slate-500">
                                Depends on: {task.dependency}
                              </span>
                            )}
                          </div>
                          
                          {task.conflict && (
                            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                              ⚠️ <strong>AI Warning:</strong> {task.id === '3' ? 'Extending plumbing will delay tile installation by 3 days' : 'Schedule conflict detected - overlaps with other work'}
                            </div>
                          )}
                          
                          {task.optimized && (
                            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                              ✅ AI Optimized: Schedule adjusted for better flow
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                    <h4 className="font-medium text-slate-700 mb-2">AI Schedule Insights</h4>
                    <p className="text-sm text-slate-600">
                      💡 Total project duration: 20 days • Critical path identified • 
                      {taskSchedule.filter(task => task.conflict).length > 0 
                        ? ' Conflicts need resolution for optimal timeline' 
                        : ' Schedule optimized with no conflicts'
                      }
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="payments" className="mt-6">
                  <PaymentTimeline 
                    projectCost={currentProject?.estimatedCost || 18500}
                    startDate={currentProject?.startDate || "2025-06-01"}
                    endDate={taskSchedule.length > 0 ? taskSchedule[taskSchedule.length - 1].end : "2025-06-20"}
                    tasks={taskSchedule}
                    onPaymentUpdate={(milestoneId, status) => {
                      toast({
                        title: `Payment ${status}`,
                        description: `Milestone "${milestoneId}" marked as ${status}`,
                      });
                    }}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Project Creation Form Dialog */}
        <Dialog open={showProjectForm} onOpenChange={setShowProjectForm}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-600" />
                Create New Project Timeline
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name *</Label>
                  <Input
                    id="projectName"
                    placeholder="Kitchen Renovation - 123 Main St"
                    value={projectForm.projectName}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, projectName: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="projectType">Project Type *</Label>
                  <Input
                    id="projectType"
                    placeholder="Kitchen Renovation"
                    value={projectForm.projectType}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, projectType: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="size">Project Size (sq ft)</Label>
                  <Input
                    id="size"
                    type="number"
                    placeholder="350"
                    value={projectForm.size}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, size: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={projectForm.startDate}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="budget">Estimated Budget (Optional)</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="25000"
                    value={projectForm.budget}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, budget: e.target.value }))}
                  />
                  <p className="text-xs text-gray-500">Leave blank for AI estimation based on project type and size</p>
                </div>
              </div>

              {/* Project Planning Options */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="useDetailedSteps"
                    checked={projectForm.useDetailedSteps}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, useDetailedSteps: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="useDetailedSteps" className="text-sm font-medium">
                    Use detailed project steps with custom payment schedule
                  </Label>
                </div>
                <p className="text-xs text-gray-500">
                  Enable this to define specific project phases with individual payment schedules and subtasks
                </p>
              </div>

              {!projectForm.useDetailedSteps ? (
                <div className="space-y-3">
                  <Label>Major Tasks (Optional)</Label>
                  <p className="text-sm text-gray-600">Add specific tasks for your project. If left empty, AI will generate standard tasks.</p>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter a task (e.g., Install cabinets)"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addMajorTask((e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(e) => {
                        const input = e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement;
                        if (input) {
                          addMajorTask(input.value);
                          input.value = '';
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>

                  {projectForm.majorTasks.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Added Tasks:</p>
                      <div className="flex flex-wrap gap-2">
                        {projectForm.majorTasks.map((task, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => removeMajorTask(task)}
                          >
                            {task} ×
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">Click to remove tasks</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Project Steps</Label>
                    <Button
                      type="button"
                      size="sm"
                      onClick={addProjectStep}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Step
                    </Button>
                  </div>
                  
                  {projectForm.projectSteps.length === 0 ? (
                    <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                      <p className="text-gray-500">No project steps defined</p>
                      <p className="text-xs text-gray-400">Click "Add Step" to create detailed project phases</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {projectForm.projectSteps.map((step, index) => (
                        <div key={step.id} className="p-3 border rounded-lg bg-gray-50">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">Step {index + 1}</span>
                              <Badge variant="outline">{step.paymentPercent}% payment</Badge>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => editProjectStep(step)}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => removeProjectStep(step.id)}
                              >
                                <AlertTriangle className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">
                            {step.name || 'Unnamed step'} - {step.description || 'No description'}
                          </p>
                          {step.subtasks && step.subtasks.length > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              {step.subtasks.length} subtask(s) defined
                            </p>
                          )}
                        </div>
                      ))}
                      
                      {(() => {
                        const payments = calculateStepPayments();
                        return (
                          <div className={`p-3 rounded-lg text-sm ${
                            payments.isValid ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
                          }`}>
                            Payment allocation: {payments.totalPercent}% of total budget
                            {!payments.isValid && (
                              <span className="ml-2">
                                ({payments.remaining > 0 ? `${payments.remaining}% remaining` : `${Math.abs(payments.remaining)}% over budget`})
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowProjectForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateProject}
                  disabled={isGeneratingTimeline}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {isGeneratingTimeline ? (
                    <>
                      <Timer className="w-4 h-4 mr-2 animate-spin" />
                      Generating Timeline...
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4 mr-2" />
                      Generate Timeline
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Project List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {schedules.map((schedule) => (
            <Card key={schedule.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{schedule.projectName}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <Calendar className="w-4 h-4" />
                      {schedule.startDate} to {schedule.endDate}
                    </CardDescription>
                  </div>
                  <Badge variant={schedule.status === 'In Progress' ? 'default' : 'secondary'}>
                    {schedule.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users className="w-4 h-4" />
                    <span>Crew: {schedule.crew.map((member, idx) => (
                      <span key={idx} className="ml-1">
                        {member}{idx < schedule.crew.length - 1 ? ',' : ''}
                      </span>
                    ))}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="w-4 h-4" />
                    <span>Current Phase: {schedule.phase}</span>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => openEditProject(schedule)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => openViewProject(schedule)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => openDeleteDialog(schedule.id)}
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Optimization Results Dialog */}
        <Dialog open={showOptimizationDialog} onOpenChange={setShowOptimizationDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                AI Schedule Optimization Results
                {processingTime && (
                  <Badge variant="secondary" className="ml-2">
                    {processingTime}
                  </Badge>
                )}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {optimizationResults && (
                <>
                  {/* Conflicts */}
                  {optimizationResults.conflicts && optimizationResults.conflicts.length > 0 && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Conflicts Detected ({optimizationResults.conflicts.length})
                      </h3>
                      <ul className="space-y-1 text-sm text-red-700">
                        {optimizationResults.conflicts.map((conflict: any, idx: number) => (
                          <li key={idx}>• {conflict.description}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Improvements */}
                  {optimizationResults.improvements && optimizationResults.improvements.length > 0 && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Optimization Opportunities ({optimizationResults.improvements.length})
                      </h3>
                      <ul className="space-y-1 text-sm text-green-700">
                        {optimizationResults.improvements.map((improvement: any, idx: number) => (
                          <li key={idx}>• {improvement.description}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Summary */}
                  {optimizationResults.summary && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h3 className="font-semibold text-blue-800 mb-2">Summary</h3>
                      <p className="text-sm text-blue-700">{optimizationResults.summary}</p>
                    </div>
                  )}
                </>
              )}
              
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowOptimizationDialog(false)}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button 
                  onClick={applyOptimizations}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  Apply Recommendations
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Project Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-blue-600" />
                Edit Project Details
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="financial">Financial Details</TabsTrigger>
                  <TabsTrigger value="payment">Payment Schedule</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-projectName">Project Name *</Label>
                      <Input
                        id="edit-projectName"
                        value={projectForm.projectName}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, projectName: e.target.value }))}
                        placeholder="Kitchen Renovation"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-clientName">Client Name</Label>
                      <Input
                        id="edit-clientName"
                        value={projectForm.clientName}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, clientName: e.target.value }))}
                        placeholder="John Smith"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="edit-propertyAddress">Property Address</Label>
                    <Input
                      id="edit-propertyAddress"
                      value={projectForm.propertyAddress}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, propertyAddress: e.target.value }))}
                      placeholder="123 Main St, Austin, TX"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="edit-projectType">Project Type</Label>
                      <Input
                        id="edit-projectType"
                        value={projectForm.projectType}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, projectType: e.target.value }))}
                        placeholder="Kitchen renovation"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-size">Project Size</Label>
                      <Input
                        id="edit-size"
                        value={projectForm.size}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, size: e.target.value }))}
                        placeholder="300 sq ft"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-startDate">Start Date</Label>
                      <Input
                        id="edit-startDate"
                        type="date"
                        value={projectForm.startDate}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, startDate: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="edit-estimatedDuration">Duration (weeks)</Label>
                      <Input
                        id="edit-estimatedDuration"
                        type="number"
                        value={projectForm.estimatedDuration}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) || 0 }))}
                        placeholder="4"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-crewMembers">Crew Members</Label>
                      <Input
                        id="edit-crewMembers"
                        type="number"
                        value={projectForm.crewMembers}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, crewMembers: parseInt(e.target.value) || 2 }))}
                        placeholder="2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-paymentTerms">Payment Terms</Label>
                      <Select
                        value={projectForm.paymentTerms}
                        onValueChange={(value) => setProjectForm(prev => ({ ...prev, paymentTerms: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select terms" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Net 15">Net 15</SelectItem>
                          <SelectItem value="Net 30">Net 30</SelectItem>
                          <SelectItem value="Due on completion">Due on completion</SelectItem>
                          <SelectItem value="50% upfront, 50% completion">50% upfront, 50% completion</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="edit-notes">Project Notes</Label>
                    <Textarea
                      id="edit-notes"
                      value={projectForm.notes}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Additional project details, special requirements, etc."
                      rows={3}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="financial" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-estimatedBudget">Estimated Budget ($)</Label>
                      <Input
                        id="edit-estimatedBudget"
                        type="number"
                        value={projectForm.estimatedBudget}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, estimatedBudget: parseFloat(e.target.value) || 0 }))}
                        placeholder="25000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-projectedProfit">Projected Profit ($)</Label>
                      <Input
                        id="edit-projectedProfit"
                        type="number"
                        value={projectForm.projectedProfit}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, projectedProfit: parseFloat(e.target.value) || 0 }))}
                        placeholder="5000"
                      />
                    </div>
                  </div>
                  
                  {projectForm.estimatedBudget > 0 && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-800">Financial Summary</span>
                      </div>
                      <div className="text-sm text-green-700 space-y-1">
                        <div>Total Budget: ${projectForm.estimatedBudget.toLocaleString()}</div>
                        <div>Projected Profit: ${projectForm.projectedProfit.toLocaleString()}</div>
                        <div>Profit Margin: {projectForm.estimatedBudget > 0 ? ((projectForm.projectedProfit / projectForm.estimatedBudget) * 100).toFixed(1) : '0'}%</div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="payment" className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="edit-upfrontPercent">Upfront Payment (%)</Label>
                      <Input
                        id="edit-upfrontPercent"
                        type="number"
                        min="0"
                        max="100"
                        value={projectForm.upfrontPercent}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, upfrontPercent: parseInt(e.target.value) || 0 }))}
                        placeholder="25"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-midProjectPercent">Mid-Project Payment (%)</Label>
                      <Input
                        id="edit-midProjectPercent"
                        type="number"
                        min="0"
                        max="100"
                        value={projectForm.midProjectPercent}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, midProjectPercent: parseInt(e.target.value) || 0 }))}
                        placeholder="50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-finalPercent">Final Payment (%)</Label>
                      <Input
                        id="edit-finalPercent"
                        type="number"
                        min="0"
                        max="100"
                        value={projectForm.finalPercent}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, finalPercent: parseInt(e.target.value) || 0 }))}
                        placeholder="25"
                      />
                    </div>
                  </div>

                  {projectForm.estimatedBudget > 0 && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-800">Payment Schedule Preview</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Upfront Payment:</span>
                          <span className="font-medium">${((projectForm.estimatedBudget * projectForm.upfrontPercent) / 100).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mid-Project Payment:</span>
                          <span className="font-medium">${((projectForm.estimatedBudget * projectForm.midProjectPercent) / 100).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Final Payment:</span>
                          <span className="font-medium">${((projectForm.estimatedBudget * projectForm.finalPercent) / 100).toLocaleString()}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-semibold">
                          <span>Total:</span>
                          <span>${projectForm.estimatedBudget.toLocaleString()}</span>
                        </div>
                        {(projectForm.upfrontPercent + projectForm.midProjectPercent + projectForm.finalPercent) !== 100 && (
                          <div className="text-orange-600 text-xs">
                            ⚠ Percentages don't add up to 100% ({projectForm.upfrontPercent + projectForm.midProjectPercent + projectForm.finalPercent}%)
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowEditDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={saveProjectEdit}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Project Dialog */}
        <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-600" />
                Project Details: {viewingProject?.projectName}
              </DialogTitle>
            </DialogHeader>
            {viewingProject && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Project Name</Label>
                        <p className="text-sm">{viewingProject.projectName}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Client</Label>
                        <p className="text-sm">{viewingProject.clientName || 'Not specified'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Property Address</Label>
                        <p className="text-sm">{viewingProject.propertyAddress || 'Not specified'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Project Type</Label>
                        <p className="text-sm">{viewingProject.projectType || 'Not specified'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Timeline</Label>
                        <p className="text-sm">{viewingProject.startDate} to {viewingProject.endDate}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Status</Label>
                        <Badge variant={viewingProject.status === 'In Progress' ? 'default' : 'secondary'}>
                          {viewingProject.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Financial Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Financial Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Estimated Budget</Label>
                        <p className="text-lg font-semibold text-green-600">
                          ${(viewingProject.estimatedBudget || 0).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Projected Profit</Label>
                        <p className="text-lg font-semibold text-blue-600">
                          ${(viewingProject.projectedProfit || 0).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Profit Margin</Label>
                        <p className="text-sm">
                          {viewingProject.estimatedBudget > 0 ? 
                            (((viewingProject.projectedProfit || 0) / viewingProject.estimatedBudget) * 100).toFixed(1) : 
                            '0'}%
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Payment Terms</Label>
                        <p className="text-sm">{viewingProject.paymentTerms || 'Net 30'}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Payment Schedule */}
                {viewingProject.estimatedBudget > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Payment Schedule
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="text-sm font-medium text-blue-800">Upfront Payment</div>
                          <div className="text-lg font-semibold text-blue-600">
                            ${((viewingProject.estimatedBudget * (viewingProject.upfrontPercent || 25)) / 100).toLocaleString()}
                          </div>
                          <div className="text-xs text-blue-600">{viewingProject.upfrontPercent || 25}% of total</div>
                        </div>
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="text-sm font-medium text-yellow-800">Mid-Project Payment</div>
                          <div className="text-lg font-semibold text-yellow-600">
                            ${((viewingProject.estimatedBudget * (viewingProject.midProjectPercent || 50)) / 100).toLocaleString()}
                          </div>
                          <div className="text-xs text-yellow-600">{viewingProject.midProjectPercent || 50}% of total</div>
                        </div>
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="text-sm font-medium text-green-800">Final Payment</div>
                          <div className="text-lg font-semibold text-green-600">
                            ${((viewingProject.estimatedBudget * (viewingProject.finalPercent || 25)) / 100).toLocaleString()}
                          </div>
                          <div className="text-xs text-green-600">{viewingProject.finalPercent || 25}% of total</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Project Team & Notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Project Team
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Crew Members</Label>
                          <p className="text-sm">{viewingProject.crewMembers || 2} workers</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Team</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {viewingProject.crew?.map((member: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {member}
                              </Badge>
                            )) || <span className="text-sm text-gray-500">Team not assigned</span>}
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Current Phase</Label>
                          <p className="text-sm">{viewingProject.phase}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Project Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700">
                        {viewingProject.notes || 'No additional notes provided for this project.'}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowViewDialog(false)}
                    className="flex-1"
                  >
                    Close
                  </Button>
                  <Button 
                    onClick={() => {
                      setShowViewDialog(false);
                      openEditProject(viewingProject);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Project
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                Delete Project
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Are you sure you want to delete this project? This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDeleteDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive"
                  onClick={deleteProject}
                  className="flex-1"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Delete Project
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Step Edit Dialog */}
        <Dialog open={showStepEditDialog} onOpenChange={setShowStepEditDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-blue-600" />
                Edit Project Step
              </DialogTitle>
            </DialogHeader>
            {editingStep && (
              <StepEditForm
                step={editingStep}
                onSave={saveStepEdit}
                onCancel={() => setShowStepEditDialog(false)}
                addSubtask={addSubtask}
                removeSubtask={removeSubtask}
                projectBudget={projectForm.estimatedBudget}
              />
            )}
          </DialogContent>
        </Dialog>

        <FeedbackButton />
      </div>
    </div>
  );
}

// Step Edit Form Component
function StepEditForm({ 
  step, 
  onSave, 
  onCancel, 
  addSubtask, 
  removeSubtask, 
  projectBudget 
}: {
  step: any;
  onSave: (step: any) => void;
  onCancel: () => void;
  addSubtask: (stepId: string, subtaskName: string) => void;
  removeSubtask: (stepId: string, subtaskId: string) => void;
  projectBudget: number;
}) {
  const [editForm, setEditForm] = useState({
    ...step,
    subtasks: step.subtasks || []
  });
  const [newSubtaskName, setNewSubtaskName] = useState('');

  const handleSave = () => {
    onSave(editForm);
  };

  const addNewSubtask = () => {
    if (!newSubtaskName.trim()) return;
    
    const newSubtask = {
      id: Date.now().toString(),
      name: newSubtaskName.trim(),
      completed: false,
      notes: ''
    };
    
    setEditForm(prev => ({
      ...prev,
      subtasks: [...prev.subtasks, newSubtask]
    }));
    setNewSubtaskName('');
  };

  const removeSubtaskLocal = (subtaskId: string) => {
    setEditForm(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter((task: any) => task.id !== subtaskId)
    }));
  };

  const updateSubtask = (subtaskId: string, updates: any) => {
    setEditForm(prev => ({
      ...prev,
      subtasks: prev.subtasks.map((task: any) => 
        task.id === subtaskId ? { ...task, ...updates } : task
      )
    }));
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Details</TabsTrigger>
          <TabsTrigger value="subtasks">Subtasks</TabsTrigger>
          <TabsTrigger value="payment">Payment & Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="step-name">Step Name *</Label>
              <Input
                id="step-name"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Kitchen Demolition"
              />
            </div>
            <div>
              <Label htmlFor="step-status">Status</Label>
              <Select
                value={editForm.status}
                onValueChange={(value) => setEditForm(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="step-description">Description</Label>
            <Textarea
              id="step-description"
              value={editForm.description}
              onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Detailed description of this project step"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="step-duration">Duration (days)</Label>
              <Input
                id="step-duration"
                type="number"
                min="1"
                value={editForm.estimatedDuration}
                onChange={(e) => setEditForm(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) || 1 }))}
                placeholder="3"
              />
            </div>
            <div>
              <Label htmlFor="step-startDate">Start Date</Label>
              <Input
                id="step-startDate"
                type="date"
                value={editForm.startDate}
                onChange={(e) => setEditForm(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="step-endDate">End Date</Label>
              <Input
                id="step-endDate"
                type="date"
                value={editForm.endDate}
                onChange={(e) => setEditForm(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="subtasks" className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Subtasks for this step</Label>
            <Badge variant="outline">{editForm.subtasks.length} subtask(s)</Badge>
          </div>

          <div className="flex gap-2">
            <Input
              value={newSubtaskName}
              onChange={(e) => setNewSubtaskName(e.target.value)}
              placeholder="Enter subtask name (e.g., Remove cabinets)"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addNewSubtask();
                }
              }}
            />
            <Button onClick={addNewSubtask} disabled={!newSubtaskName.trim()}>
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>

          <div className="space-y-3">
            {editForm.subtasks.length === 0 ? (
              <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">No subtasks defined</p>
                <p className="text-xs text-gray-400">Add subtasks to break down this step into smaller tasks</p>
              </div>
            ) : (
              editForm.subtasks.map((subtask: any) => (
                <div key={subtask.id} className="p-3 border rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        onChange={(e) => updateSubtask(subtask.id, { completed: e.target.checked })}
                        className="rounded border-gray-300"
                      />
                      <Input
                        value={subtask.name}
                        onChange={(e) => updateSubtask(subtask.id, { name: e.target.value })}
                        className="font-medium"
                        placeholder="Subtask name"
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeSubtaskLocal(subtask.id)}
                    >
                      <AlertTriangle className="w-3 h-3" />
                    </Button>
                  </div>
                  <Textarea
                    value={subtask.notes}
                    onChange={(e) => updateSubtask(subtask.id, { notes: e.target.value })}
                    placeholder="Notes for this subtask (optional)"
                    rows={2}
                    className="text-sm"
                  />
                </div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="step-cost">Estimated Cost ($)</Label>
              <Input
                id="step-cost"
                type="number"
                min="0"
                value={editForm.cost}
                onChange={(e) => setEditForm(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
                placeholder="5000"
              />
            </div>
            <div>
              <Label htmlFor="step-payment">Payment Percentage (%)</Label>
              <Input
                id="step-payment"
                type="number"
                min="0"
                max="100"
                value={editForm.paymentPercent}
                onChange={(e) => setEditForm(prev => ({ ...prev, paymentPercent: parseInt(e.target.value) || 0 }))}
                placeholder="25"
              />
            </div>
          </div>

          {projectBudget > 0 && editForm.paymentPercent > 0 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-800">Payment Calculation</span>
              </div>
              <div className="text-sm text-blue-700">
                <div>Step Payment: ${((projectBudget * editForm.paymentPercent) / 100).toLocaleString()}</div>
                <div>Percentage of Total: {editForm.paymentPercent}%</div>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="step-notes">Step Notes</Label>
            <Textarea
              id="step-notes"
              value={editForm.notes}
              onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes, special requirements, or important information for this step"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="step-dependencies">Dependencies</Label>
            <Input
              id="step-dependencies"
              value={editForm.dependencies ? editForm.dependencies.join(', ') : ''}
              onChange={(e) => setEditForm(prev => ({ 
                ...prev, 
                dependencies: e.target.value.split(',').map(dep => dep.trim()).filter(dep => dep)
              }))}
              placeholder="List steps that must be completed first (comma-separated)"
            />
            <p className="text-xs text-gray-500 mt-1">
              e.g., "Foundation work, Electrical rough-in"
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex gap-3 pt-4">
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
          disabled={!editForm.name.trim()}
        >
          Save Step
        </Button>
      </div>
    </div>
  );
}
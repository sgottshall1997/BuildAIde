import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import FeedbackButton from "@/components/feedback-button";
import PaymentTimeline from "@/components/payment-timeline";
import { Calendar, Clock, Users, AlertTriangle, Zap, Edit, CheckCircle, Plus, BarChart3, Brain, TrendingUp, Timer, DollarSign } from "lucide-react";
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
  const [processingTime, setProcessingTime] = useState<string>("");
  const { toast } = useToast();

  // Load sample bathroom remodel schedule for demo
  const loadBathroomRemodel = () => {
    setTaskSchedule(sampleBathroomSchedule);
    setSelectedSchedule('bathroom-demo');
    toast({
      title: "Sample Schedule Loaded! 🛁",
      description: "Bathroom remodel timeline with 7 tasks and conflict detection",
    });
  };

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
        title: "🧠 AI Schedule Analysis Complete!",
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
        
        {/* Demo Actions */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <Button onClick={loadBathroomRemodel} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Load Sample Bathroom Remodel
          </Button>
          {taskSchedule.length > 0 && (
            <Button 
              onClick={optimizeSchedule} 
              disabled={isOptimizing}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Brain className={`w-4 h-4 mr-2 ${isOptimizing ? 'animate-pulse' : ''}`} />
              {isOptimizing ? 'Analyzing...' : '🧠 Optimize Schedule'}
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
                    projectCost={18500}
                    startDate="2025-06-01"
                    endDate="2025-06-20"
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
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button size="sm" className="flex-1">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      View Details
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

        <FeedbackButton />
      </div>
    </div>
  );
}
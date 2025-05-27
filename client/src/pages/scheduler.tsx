import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import FeedbackButton from "@/components/feedback-button";
import { Calendar, Clock, Users, AlertTriangle, Zap, Edit, CheckCircle, Plus, BarChart3 } from "lucide-react";

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

  // AI Schedule Optimization
  const optimizeSchedule = async () => {
    setIsOptimizing(true);
    // Simulate AI processing time
    setTimeout(() => {
      // Update tasks to resolve conflicts and optimize timing
      const optimizedTasks = taskSchedule.map(task => ({
        ...task,
        conflict: false, // AI resolved conflicts
        optimized: true
      }));
      setTaskSchedule(optimizedTasks);
      setIsOptimizing(false);
      toast({
        title: "🧠 AI Optimized Your Schedule!",
        description: "Reduced idle time by 2 days and resolved all conflicts",
      });
    }, 2500);
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3 mb-4">
            <Calendar className="w-8 h-8 text-blue-600" />
            Schedule Builder
          </h1>
          <p className="text-slate-600 mb-6">
            Manage project timelines, crew assignments, and resource scheduling with AI optimization
          </p>
          
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
                <Zap className={`w-4 h-4 mr-2 ${isOptimizing ? 'animate-spin' : ''}`} />
                {isOptimizing ? 'Optimizing...' : 'Optimize Schedule (AI)'}
              </Button>
            )}
          </div>
        </div>

        {/* Task Timeline View - Shows when sample schedule is loaded */}
        {taskSchedule.length > 0 && (
          <Card className="mb-6 border-2 border-blue-200 bg-blue-50/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Task Timeline - Bathroom Remodel Demo
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  {taskSchedule.filter(task => task.conflict).length} conflicts detected
                </div>
              </div>
            </CardHeader>
            <CardContent>
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
                        <h4 className="font-medium text-slate-900">{task.task}</h4>
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
                          ⚠️ Schedule conflict: Overlaps with plumbing work timeline
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
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {schedules.map((schedule) => (
            <Card key={schedule.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{schedule.projectName}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <Clock className="w-4 h-4" />
                      {schedule.startDate} - {schedule.endDate}
                    </CardDescription>
                  </div>
                  <Badge variant={schedule.status === 'In Progress' ? 'default' : 'secondary'}>
                    {schedule.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-slate-700 mb-2">Current Phase</h4>
                  <p className="text-slate-600">{schedule.phase}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm text-slate-700 mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Crew Assignment
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {schedule.crew.map((member, idx) => (
                      <Badge key={idx} variant="outline">{member}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    Edit Schedule
                  </Button>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Calendar className="w-5 h-5 mr-2" />
            Create New Schedule
          </Button>
        </div>
      </div>
      
      <FeedbackButton toolName="Schedule Builder" />
    </div>
  );
}
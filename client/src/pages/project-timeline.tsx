import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, DollarSign, Users, AlertTriangle } from "lucide-react";

interface Project {
  id: number;
  projectName: string;
  clientName: string;
  startDate: string;
  endDate: string;
  status: string;
  estimatedCost?: number;
  progress?: number;
}

export default function ProjectTimeline() {
  const { data: schedules, isLoading } = useQuery({
    queryKey: ["/api/schedules"],
  });

  // Calculate project metrics
  const calculateProjectDuration = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const calculateProgress = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    const totalDuration = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-500';
      case 'in progress': return 'bg-blue-500';
      case 'delayed': return 'bg-red-500';
      case 'scheduled': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'default';
      case 'in progress': return 'secondary';
      case 'delayed': return 'destructive';
      case 'scheduled': return 'outline';
      default: return 'outline';
    }
  };

  const isProjectDelayed = (endDate: string, status: string): boolean => {
    const end = new Date(endDate);
    const now = new Date();
    return now > end && status.toLowerCase() !== 'completed';
  };

  // Generate timeline visualization
  const generateTimelineBar = (project: Project) => {
    const progress = calculateProgress(project.startDate, project.endDate);
    const duration = calculateProjectDuration(project.startDate, project.endDate);
    const isDelayed = isProjectDelayed(project.endDate, project.status);
    
    return (
      <div className="relative">
        <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
          <span>{new Date(project.startDate).toLocaleDateString()}</span>
          <span>{duration} days</span>
          <span>{new Date(project.endDate).toLocaleDateString()}</span>
        </div>
        
        <div className="relative h-6 bg-slate-200 rounded-full overflow-hidden">
          {/* Progress bar */}
          <div 
            className={`h-full ${getStatusColor(project.status)} transition-all duration-300`}
            style={{ width: `${progress}%` }}
          />
          
          {/* Today indicator */}
          <div 
            className="absolute top-0 w-0.5 h-full bg-slate-800 opacity-60"
            style={{ 
              left: `${Math.min(100, progress)}%`,
              display: progress > 0 && progress < 100 ? 'block' : 'none'
            }}
          />
        </div>
        
        {isDelayed && (
          <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
            <AlertTriangle className="h-3 w-3" />
            <span>Overdue</span>
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading project timeline...</p>
        </div>
      </div>
    );
  }

  const projects = schedules || [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center justify-center gap-3">
          <Calendar className="h-8 w-8 text-blue-600" />
          Project Timeline Overview
        </h1>
        <p className="text-slate-600">
          Track all active construction projects in a visual Gantt-style timeline
        </p>
      </div>

      {/* Timeline Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Projects</p>
                <p className="text-xl font-bold text-slate-900">{projects.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">In Progress</p>
                <p className="text-xl font-bold text-slate-900">
                  {projects.filter((p: Project) => p.status.toLowerCase() === 'in progress').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Delayed</p>
                <p className="text-xl font-bold text-slate-900">
                  {projects.filter((p: Project) => isProjectDelayed(p.endDate, p.status)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Value</p>
                <p className="text-xl font-bold text-slate-900">
                  ${projects.reduce((sum: number, p: Project) => sum + (p.estimatedCost || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Project Gantt Timeline
          </CardTitle>
          <CardDescription>
            Visual timeline showing project progress, deadlines, and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {projects.length > 0 ? (
            <div className="space-y-6">
              {projects.map((project: Project) => (
                <div key={project.id} className="border-b border-slate-200 pb-6 last:border-b-0">
                  {/* Project Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-slate-900">{project.projectName}</h3>
                      <p className="text-sm text-slate-600">Client: {project.clientName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusBadgeVariant(project.status)}>
                        {project.status}
                      </Badge>
                      {project.estimatedCost && (
                        <span className="text-sm font-medium text-slate-700">
                          ${project.estimatedCost.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Timeline Bar */}
                  {generateTimelineBar(project)}

                  {/* Project Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
                    <div>
                      <span className="text-slate-600">Duration: </span>
                      <span className="font-medium">
                        {calculateProjectDuration(project.startDate, project.endDate)} days
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-600">Progress: </span>
                      <span className="font-medium">
                        {Math.round(calculateProgress(project.startDate, project.endDate))}%
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-600">Days Remaining: </span>
                      <span className="font-medium">
                        {Math.max(0, Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-700 mb-2">No Projects Scheduled</h3>
              <p className="text-slate-600">When you schedule projects, they'll appear here in timeline view</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Timeline Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>Delayed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span>Scheduled</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-600">
            <div className="w-0.5 h-4 bg-slate-800"></div>
            <span>Current date indicator</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
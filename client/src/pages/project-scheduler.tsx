import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Plus, Users, DollarSign, Clock, TrendingUp, MapPin, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: string;
  projectName: string;
  propertyAddress: string;
  startDate: string;
  estimatedDuration: number;
  crewMembers: number;
  estimatedBudget: number;
  projectedProfit: number;
  status: 'not-started' | 'in-progress' | 'delayed' | 'completed';
  notes?: string;
  createdAt: string;
  projectedEndDate: string;
  profitMargin: number;
}

interface NewProject {
  projectName: string;
  propertyAddress: string;
  startDate: string;
  estimatedDuration: string;
  crewMembers: string;
  estimatedBudget: string;
  projectedProfit: string;
  status: string;
  notes: string;
}

export default function ProjectScheduler() {
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [sortBy, setSortBy] = useState<'startDate' | 'status'>('startDate');
  const [newProject, setNewProject] = useState<NewProject>({
    projectName: '',
    propertyAddress: '',
    startDate: '',
    estimatedDuration: '',
    crewMembers: '',
    estimatedBudget: '',
    projectedProfit: '',
    status: 'not-started',
    notes: ''
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: projects, isLoading } = useQuery({
    queryKey: ['/api/schedule']
  });

  const addProjectMutation = useMutation({
    mutationFn: async (project: any) => {
      const response = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
      });
      if (!response.ok) throw new Error('Failed to add project');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schedule'] });
      setIsAddingProject(false);
      resetForm();
      toast({
        title: "Project Added",
        description: "New project has been scheduled successfully",
      });
    }
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await fetch(`/api/schedule/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error('Failed to update project');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schedule'] });
      toast({
        title: "Status Updated",
        description: "Project status has been updated",
      });
    }
  });

  const resetForm = () => {
    setNewProject({
      projectName: '',
      propertyAddress: '',
      startDate: '',
      estimatedDuration: '',
      crewMembers: '',
      estimatedBudget: '',
      projectedProfit: '',
      status: 'not-started',
      notes: ''
    });
  };

  const calculateProjectData = (startDate: string, duration: number, budget: number, profit: number) => {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + duration);
    
    const profitMargin = budget > 0 ? (profit / budget) * 100 : 0;
    
    return {
      projectedEndDate: end.toISOString().split('T')[0],
      profitMargin: Math.round(profitMargin * 100) / 100
    };
  };

  const handleAddProject = async () => {
    const duration = parseInt(newProject.estimatedDuration) || 0;
    const budget = parseFloat(newProject.estimatedBudget) || 0;
    const profit = parseFloat(newProject.projectedProfit) || 0;
    
    const { projectedEndDate, profitMargin } = calculateProjectData(
      newProject.startDate, 
      duration, 
      budget, 
      profit
    );

    const projectData = {
      projectName: newProject.projectName,
      propertyAddress: newProject.propertyAddress,
      startDate: newProject.startDate,
      estimatedDuration: duration,
      crewMembers: parseInt(newProject.crewMembers) || 0,
      estimatedBudget: budget,
      projectedProfit: profit,
      status: newProject.status,
      notes: newProject.notes,
      projectedEndDate,
      profitMargin
    };
    
    addProjectMutation.mutate(projectData);
  };

  const handleStatusUpdate = (projectId: string, newStatus: string) => {
    updateProjectMutation.mutate({ id: projectId, status: newStatus });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not-started': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'not-started': return 'Not Started';
      case 'in-progress': return 'In Progress';
      case 'delayed': return 'Delayed';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const sortedProjects = projects ? [...projects].sort((a: Project, b: Project) => {
    if (sortBy === 'startDate') {
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    } else {
      const statusOrder = { 'in-progress': 0, 'delayed': 1, 'not-started': 2, 'completed': 3 };
      return (statusOrder[a.status] || 4) - (statusOrder[b.status] || 4);
    }
  }) : [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Calendar className="h-8 w-8 text-blue-600" />
            Project Scheduler
          </h1>
          <p className="text-slate-600 mt-2">
            Manage active construction jobs and track project progress
          </p>
        </div>
        <Dialog open={isAddingProject} onOpenChange={setIsAddingProject}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    value={newProject.projectName}
                    onChange={(e) => setNewProject(prev => ({ ...prev, projectName: e.target.value }))}
                    placeholder="Columbia Kitchen Remodel"
                  />
                </div>
                <div>
                  <Label htmlFor="propertyAddress">Property Address</Label>
                  <Input
                    id="propertyAddress"
                    value={newProject.propertyAddress}
                    onChange={(e) => setNewProject(prev => ({ ...prev, propertyAddress: e.target.value }))}
                    placeholder="123 Main St, Kensington, MD"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newProject.startDate}
                    onChange={(e) => setNewProject(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="estimatedDuration">Estimated Duration (days)</Label>
                  <Input
                    id="estimatedDuration"
                    type="number"
                    value={newProject.estimatedDuration}
                    onChange={(e) => setNewProject(prev => ({ ...prev, estimatedDuration: e.target.value }))}
                    placeholder="45"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="crewMembers">Number of Crew Members</Label>
                  <Input
                    id="crewMembers"
                    type="number"
                    value={newProject.crewMembers}
                    onChange={(e) => setNewProject(prev => ({ ...prev, crewMembers: e.target.value }))}
                    placeholder="4"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Project Status</Label>
                  <Select value={newProject.status} onValueChange={(value) => setNewProject(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not-started">Not Started</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="delayed">Delayed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="estimatedBudget">Estimated Budget</Label>
                  <Input
                    id="estimatedBudget"
                    type="number"
                    value={newProject.estimatedBudget}
                    onChange={(e) => setNewProject(prev => ({ ...prev, estimatedBudget: e.target.value }))}
                    placeholder="75000"
                  />
                </div>
                <div>
                  <Label htmlFor="projectedProfit">Projected Profit</Label>
                  <Input
                    id="projectedProfit"
                    type="number"
                    value={newProject.projectedProfit}
                    onChange={(e) => setNewProject(prev => ({ ...prev, projectedProfit: e.target.value }))}
                    placeholder="18000"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={newProject.notes}
                  onChange={(e) => setNewProject(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Special requirements, client preferences, etc."
                  className="min-h-20"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddingProject(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddProject} disabled={addProjectMutation.isPending}>
                  {addProjectMutation.isPending ? "Adding..." : "Add Project"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Project Stats */}
      {projects && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{projects.length}</div>
              <div className="text-sm text-slate-600">Total Projects</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {projects.filter((p: Project) => p.status === 'in-progress').length}
              </div>
              <div className="text-sm text-slate-600">Active</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {projects.filter((p: Project) => p.status === 'delayed').length}
              </div>
              <div className="text-sm text-slate-600">Delayed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {projects.filter((p: Project) => p.status === 'completed').length}
              </div>
              <div className="text-sm text-slate-600">Completed</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sort Controls */}
      {projects && projects.length > 0 && (
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-slate-800">Current Projects</h2>
          <div className="flex items-center gap-2">
            <Label className="text-sm">Sort by:</Label>
            <Select value={sortBy} onValueChange={(value: 'startDate' | 'status') => setSortBy(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="startDate">Start Date</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Projects List */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading projects...</p>
        </div>
      )}

      {sortedProjects && sortedProjects.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {sortedProjects.map((project: Project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-start">
                  {/* Project Info */}
                  <div className="lg:col-span-2">
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">
                      {project.projectName}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-slate-600 mb-2">
                      <MapPin className="h-4 w-4" />
                      {project.propertyAddress}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(project.status)}>
                        {getStatusLabel(project.status)}
                      </Badge>
                      <Select 
                        value={project.status} 
                        onValueChange={(value) => handleStatusUpdate(project.id, value)}
                      >
                        <SelectTrigger className="w-24 h-6 text-xs">
                          <Edit className="h-3 w-3" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not-started">Not Started</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="delayed">Delayed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="text-sm">
                    <div className="flex items-center gap-1 mb-1">
                      <Calendar className="h-4 w-4 text-slate-500" />
                      <span className="font-medium">Timeline</span>
                    </div>
                    <div className="text-slate-600">
                      Start: {new Date(project.startDate).toLocaleDateString()}
                    </div>
                    <div className="text-slate-600">
                      End: {new Date(project.projectedEndDate).toLocaleDateString()}
                    </div>
                    <div className="text-slate-600">
                      Duration: {project.estimatedDuration} days
                    </div>
                  </div>

                  {/* Team */}
                  <div className="text-sm">
                    <div className="flex items-center gap-1 mb-1">
                      <Users className="h-4 w-4 text-slate-500" />
                      <span className="font-medium">Team</span>
                    </div>
                    <div className="text-slate-600">
                      {project.crewMembers} crew members
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="text-sm">
                    <div className="flex items-center gap-1 mb-1">
                      <DollarSign className="h-4 w-4 text-slate-500" />
                      <span className="font-medium">Budget</span>
                    </div>
                    <div className="text-slate-600">
                      ${project.estimatedBudget.toLocaleString()}
                    </div>
                  </div>

                  {/* Profit */}
                  <div className="text-sm">
                    <div className="flex items-center gap-1 mb-1">
                      <TrendingUp className="h-4 w-4 text-slate-500" />
                      <span className="font-medium">Profit</span>
                    </div>
                    <div className="text-slate-600">
                      ${project.projectedProfit.toLocaleString()}
                    </div>
                    <div className="text-green-600 font-medium">
                      {project.profitMargin}% margin
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {project.notes && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="text-sm font-medium text-slate-700 mb-1">Notes</h4>
                    <p className="text-sm text-slate-600">{project.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {projects && projects.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No projects scheduled</h3>
            <p className="text-slate-600 mb-6">Start by adding your first construction project.</p>
            <Button onClick={() => setIsAddingProject(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Project
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
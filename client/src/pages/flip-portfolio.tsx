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
import { Camera, Upload, TrendingUp, Calendar, DollarSign, FileDown, Plus, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FlipProject {
  id: string;
  address: string;
  startDate: string;
  finishDate?: string;
  beforePhotos: string[];
  afterPhotos: string[];
  scopeOfWork: string[];
  budgetPlanned: number;
  budgetActual: number;
  salePrice?: number;
  roi?: number;
  timeline: number; // days
  status: 'planning' | 'in-progress' | 'completed' | 'sold';
  aiSummary?: string;
}

export default function FlipPortfolio() {
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProject, setNewProject] = useState({
    address: '',
    startDate: '',
    finishDate: '',
    scopeOfWork: '',
    budgetPlanned: '',
    budgetActual: '',
    salePrice: '',
    status: 'planning'
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: projects, isLoading } = useQuery({
    queryKey: ['/api/flip-projects']
  });

  const addProjectMutation = useMutation({
    mutationFn: async (project: any) => {
      const response = await fetch('/api/flip-projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
      });
      if (!response.ok) throw new Error('Failed to add project');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/flip-projects'] });
      setIsAddingProject(false);
      setNewProject({
        address: '',
        startDate: '',
        finishDate: '',
        scopeOfWork: '',
        budgetPlanned: '',
        budgetActual: '',
        salePrice: '',
        status: 'planning'
      });
      toast({
        title: "Project Added",
        description: "New flip project added to your portfolio",
      });
    }
  });

  const generateProjectAnalysis = async (project: FlipProject) => {
    try {
      const response = await fetch("/api/analyze-flip-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project }),
      });
      
      if (response.ok) {
        const data = await response.json();
        queryClient.invalidateQueries({ queryKey: ['/api/flip-projects'] });
        toast({
          title: "Analysis Complete",
          description: "Project performance analysis generated",
        });
      }
    } catch (error) {
      toast({
        title: "Analysis Error",
        description: "Failed to generate project analysis",
        variant: "destructive",
      });
    }
  };

  const exportPortfolio = async () => {
    try {
      const response = await fetch("/api/export-portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects }),
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `flip-portfolio-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        toast({
          title: "Export Complete",
          description: "Portfolio PDF downloaded successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Export Error",
        description: "Failed to export portfolio",
        variant: "destructive",
      });
    }
  };

  const handleAddProject = () => {
    const projectData = {
      ...newProject,
      budgetPlanned: parseFloat(newProject.budgetPlanned) || 0,
      budgetActual: parseFloat(newProject.budgetActual) || 0,
      salePrice: parseFloat(newProject.salePrice) || 0,
      scopeOfWork: newProject.scopeOfWork.split(',').map(s => s.trim()).filter(Boolean),
      beforePhotos: [],
      afterPhotos: [],
      timeline: newProject.finishDate && newProject.startDate ? 
        Math.ceil((new Date(newProject.finishDate).getTime() - new Date(newProject.startDate).getTime()) / (1000 * 60 * 60 * 24)) : 0
    };
    
    addProjectMutation.mutate(projectData);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'sold': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateROI = (project: FlipProject) => {
    if (!project.salePrice || !project.budgetActual) return null;
    return ((project.salePrice - project.budgetActual) / project.budgetActual * 100).toFixed(1);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Home className="h-8 w-8 text-blue-600" />
            Flip Portfolio
          </h1>
          <p className="text-slate-600 mt-2">
            Track your house flipping projects from start to finish
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportPortfolio} variant="outline" className="flex items-center gap-2">
            <FileDown className="h-4 w-4" />
            Export Portfolio
          </Button>
          <Dialog open={isAddingProject} onOpenChange={setIsAddingProject}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Flip Project</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="address">Property Address</Label>
                    <Input
                      id="address"
                      value={newProject.address}
                      onChange={(e) => setNewProject(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="1234 Main St, Kensington, MD"
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Project Status</Label>
                    <Select value={newProject.status} onValueChange={(value) => setNewProject(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="sold">Sold</SelectItem>
                      </SelectContent>
                    </Select>
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
                    <Label htmlFor="finishDate">Finish Date</Label>
                    <Input
                      id="finishDate"
                      type="date"
                      value={newProject.finishDate}
                      onChange={(e) => setNewProject(prev => ({ ...prev, finishDate: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="scopeOfWork">Scope of Work (comma-separated)</Label>
                  <Textarea
                    id="scopeOfWork"
                    value={newProject.scopeOfWork}
                    onChange={(e) => setNewProject(prev => ({ ...prev, scopeOfWork: e.target.value }))}
                    placeholder="Kitchen remodel, bathroom renovation, flooring, painting"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="budgetPlanned">Planned Budget</Label>
                    <Input
                      id="budgetPlanned"
                      type="number"
                      value={newProject.budgetPlanned}
                      onChange={(e) => setNewProject(prev => ({ ...prev, budgetPlanned: e.target.value }))}
                      placeholder="75000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="budgetActual">Actual Budget</Label>
                    <Input
                      id="budgetActual"
                      type="number"
                      value={newProject.budgetActual}
                      onChange={(e) => setNewProject(prev => ({ ...prev, budgetActual: e.target.value }))}
                      placeholder="82000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="salePrice">Sale Price</Label>
                    <Input
                      id="salePrice"
                      type="number"
                      value={newProject.salePrice}
                      onChange={(e) => setNewProject(prev => ({ ...prev, salePrice: e.target.value }))}
                      placeholder="650000"
                    />
                  </div>
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
      </div>

      {/* Portfolio Stats */}
      {projects && Array.isArray(projects) && projects.length > 0 && (
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
                {projects.filter((p: FlipProject) => p.status === 'completed' || p.status === 'sold').length}
              </div>
              <div className="text-sm text-slate-600">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {projects.filter((p: FlipProject) => p.roi).reduce((avg, p) => avg + (parseFloat(calculateROI(p) || '0')), 0) / projects.filter(p => p.roi).length || 0}%
              </div>
              <div className="text-sm text-slate-600">Avg ROI</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(projects.filter((p: FlipProject) => p.timeline).reduce((avg, p) => avg + p.timeline, 0) / projects.filter(p => p.timeline).length || 0)}
              </div>
              <div className="text-sm text-slate-600">Avg Days</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Projects Grid */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading portfolio...</p>
        </div>
      )}

      {projects && Array.isArray(projects) && projects.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project: FlipProject) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{project.address}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(project.startDate).toLocaleDateString()}
                      {project.finishDate && ` - ${new Date(project.finishDate).toLocaleDateString()}`}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Project Metrics */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Budget:</span>
                    <div className="font-medium">${project.budgetActual?.toLocaleString() || project.budgetPlanned?.toLocaleString()}</div>
                  </div>
                  {project.salePrice && (
                    <div>
                      <span className="text-slate-600">Sale Price:</span>
                      <div className="font-medium">${project.salePrice.toLocaleString()}</div>
                    </div>
                  )}
                  {project.timeline > 0 && (
                    <div>
                      <span className="text-slate-600">Timeline:</span>
                      <div className="font-medium">{project.timeline} days</div>
                    </div>
                  )}
                  {calculateROI(project) && (
                    <div>
                      <span className="text-slate-600">ROI:</span>
                      <div className="font-medium text-green-600">{calculateROI(project)}%</div>
                    </div>
                  )}
                </div>

                {/* Scope of Work */}
                {project.scopeOfWork && project.scopeOfWork.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Scope of Work</h4>
                    <div className="flex flex-wrap gap-1">
                      {project.scopeOfWork.map((scope, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {scope}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Photos */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Before Photos</h4>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center">
                      <Camera className="h-6 w-6 text-slate-400 mx-auto mb-2" />
                      <Button variant="outline" size="sm" className="text-xs">
                        <Upload className="h-3 w-3 mr-1" />
                        Upload
                      </Button>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-2">After Photos</h4>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center">
                      <Camera className="h-6 w-6 text-slate-400 mx-auto mb-2" />
                      <Button variant="outline" size="sm" className="text-xs">
                        <Upload className="h-3 w-3 mr-1" />
                        Upload
                      </Button>
                    </div>
                  </div>
                </div>

                {/* AI Analysis */}
                {project.aiSummary ? (
                  <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Project Analysis</span>
                    </div>
                    <p className="text-sm text-blue-700">{project.aiSummary}</p>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generateProjectAnalysis(project)}
                    className="w-full flex items-center gap-2"
                  >
                    <TrendingUp className="h-4 w-4" />
                    Generate Project Analysis
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {projects && Array.isArray(projects) && projects.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-12">
            <Home className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No projects yet</h3>
            <p className="text-slate-600 mb-6">Start building your flip portfolio by adding your first project.</p>
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
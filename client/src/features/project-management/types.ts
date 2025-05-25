// Project Management Feature Types
export interface Project {
  id: string;
  name: string;
  type: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  startDate: string;
  endDate?: string;
  estimatedDuration: number;
  budget: number;
  actualCost?: number;
  location: string;
  description?: string;
  progress: number;
  milestones: Milestone[];
  team: TeamMember[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  completedDate?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  contact: string;
}

export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalBudget: number;
  averageCompletion: number;
}

export interface ScheduleItem {
  id: string;
  projectId: string;
  title: string;
  type: 'task' | 'inspection' | 'delivery' | 'meeting';
  date: string;
  duration: number;
  assignee?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}
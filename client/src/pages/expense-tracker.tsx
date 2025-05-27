import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import FeedbackButton from "@/components/feedback-button";
import { useLocation } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Receipt, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Upload,
  Search,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  PieChart,
  BarChart3,
  Lightbulb,
  Plus,
  Trash2,
  Edit,
  Building,
  Hammer,
  FileText,
  Users,
  Package
} from "lucide-react";

interface ExpenseEntry {
  id: string;
  category: 'Materials' | 'Labor' | 'Permits' | 'Subs' | 'Misc';
  description: string;
  amount: number;
  date: string;
  vendor?: string;
  projectId?: string;
  projectName?: string;
  receiptUrl?: string;
  createdAt: string;
}

interface ExpenseSummary {
  totalSpent: number;
  categoryBreakdown: {
    Materials: number;
    Labor: number;
    Permits: number;
    Subs: number;
    Misc: number;
  };
  monthlyTrend: Array<{
    month: string;
    amount: number;
  }>;
  topVendors: Array<{
    vendor: string;
    amount: number;
    count: number;
  }>;
}

interface ProjectComparison {
  projectId: string;
  projectName: string;
  estimated: {
    Materials: number;
    Labor: number;
    Permits: number;
    Subs: number;
    Misc: number;
    total: number;
  };
  actual: {
    Materials: number;
    Labor: number;
    Permits: number;
    Subs: number;
    Misc: number;
    total: number;
  };
  variance: {
    Materials: number;
    Labor: number;
    Permits: number;
    Subs: number;
    Misc: number;
    total: number;
  };
  variancePercent: {
    Materials: number;
    Labor: number;
    Permits: number;
    Subs: number;
    Misc: number;
    total: number;
  };
}

interface CostSavingTip {
  category: string;
  tip: string;
  potentialSavings: string;
  priority: 'high' | 'medium' | 'low';
}

const categoryIcons = {
  Materials: Package,
  Labor: Hammer,
  Permits: FileText,
  Subs: Users,
  Misc: Building
};

const categoryColors = {
  Materials: 'bg-blue-100 text-blue-800',
  Labor: 'bg-green-100 text-green-800',
  Permits: 'bg-yellow-100 text-yellow-800',
  Subs: 'bg-purple-100 text-purple-800',
  Misc: 'bg-gray-100 text-gray-800'
};

export default function ExpenseTracker() {
  const [location] = useLocation();
  const isConsumerMode = sessionStorage.getItem('userMode') === 'consumer' || location.includes('consumer');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // State management
  const [activeTab, setActiveTab] = useState('tracker');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Form state
  const [newExpense, setNewExpense] = useState({
    category: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    vendor: '',
    projectId: '',
    projectName: ''
  });

  // Fetch expenses
  const { data: expenses = [], isLoading: expensesLoading } = useQuery({
    queryKey: ['/api/expenses'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/expenses');
      return await response.json() as ExpenseEntry[];
    }
  });

  // Fetch expense summary
  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['/api/expenses/summary'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/expenses/summary');
      return await response.json() as ExpenseSummary;
    }
  });

  // Fetch project comparisons
  const { data: projectComparisons = [], isLoading: comparisonsLoading } = useQuery({
    queryKey: ['/api/expenses/project-comparisons'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/expenses/project-comparisons');
      return await response.json() as ProjectComparison[];
    }
  });

  // Fetch AI cost-saving tips
  const { data: costSavingTips = [], isLoading: tipsLoading } = useQuery({
    queryKey: ['/api/expenses/cost-saving-tips'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/expenses/cost-saving-tips');
      return await response.json() as CostSavingTip[];
    }
  });

  // Add expense mutation
  const addExpenseMutation = useMutation({
    mutationFn: async (expense: Omit<ExpenseEntry, 'id' | 'createdAt'>) => {
      const response = await apiRequest('POST', '/api/expenses', expense);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/expenses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/expenses/summary'] });
      queryClient.invalidateQueries({ queryKey: ['/api/expenses/project-comparisons'] });
      queryClient.invalidateQueries({ queryKey: ['/api/expenses/cost-saving-tips'] });
      setShowAddExpense(false);
      setNewExpense({
        category: '',
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        vendor: '',
        projectId: '',
        projectName: ''
      });
      toast({
        title: "Expense Added",
        description: "Your expense has been successfully tracked."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add expense. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Delete expense mutation
  const deleteExpenseMutation = useMutation({
    mutationFn: async (expenseId: string) => {
      const response = await apiRequest('DELETE', `/api/expenses/${expenseId}`);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/expenses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/expenses/summary'] });
      queryClient.invalidateQueries({ queryKey: ['/api/expenses/project-comparisons'] });
      queryClient.invalidateQueries({ queryKey: ['/api/expenses/cost-saving-tips'] });
      toast({
        title: "Expense Deleted",
        description: "The expense has been removed from tracking."
      });
    }
  });

  // Export expenses
  const exportExpensesMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/expenses/export', {
        projectId: selectedProject,
        category: filterCategory,
        dateRange
      });
      return await response.blob();
    },
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `expense-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({
        title: "Export Complete",
        description: "Your expense report has been downloaded."
      });
    }
  });

  // Filter expenses
  const filteredExpenses = expenses.filter(expense => {
    const matchesProject = selectedProject === 'all' || expense.projectId === selectedProject;
    const matchesCategory = filterCategory === 'all' || expense.category === filterCategory;
    const matchesSearch = !searchQuery || 
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.vendor?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDateRange = (!dateRange.start || expense.date >= dateRange.start) &&
                            (!dateRange.end || expense.date <= dateRange.end);
    
    return matchesProject && matchesCategory && matchesSearch && matchesDateRange;
  });

  const handleAddExpense = () => {
    if (!newExpense.category || !newExpense.description || !newExpense.amount) {
      toast({
        title: "Missing Information",
        description: "Please fill in category, description, and amount.",
        variant: "destructive"
      });
      return;
    }

    addExpenseMutation.mutate({
      category: newExpense.category as any,
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      date: newExpense.date,
      vendor: newExpense.vendor || undefined,
      projectId: newExpense.projectId || undefined,
      projectName: newExpense.projectName || undefined
    });
  };

  const getVarianceStatus = (variance: number) => {
    if (variance <= 0) return { icon: CheckCircle, color: 'text-green-600', label: 'On Budget' };
    if (variance <= 20) return { icon: AlertTriangle, color: 'text-yellow-600', label: 'Over Budget' };
    return { icon: XCircle, color: 'text-red-600', label: 'Critical Overage' };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3 mb-4">
              <Receipt className="w-8 h-8 text-blue-600" />
              💰 AI Expense Tracker
            </h1>
            <p className="text-slate-600 mb-6">
              Track project expenses in real-time with intelligent cost analysis and budget monitoring
            </p>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tracker">Expense Tracker</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="comparisons">Project Comparisons</TabsTrigger>
            <TabsTrigger value="ai-tips">AI Cost Advisor</TabsTrigger>
          </TabsList>

          {/* Expense Tracker Tab */}
          <TabsContent value="tracker" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Spent</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${summary?.totalSpent?.toLocaleString() || '0'}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">This Month</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${summary?.monthlyTrend?.[0]?.amount?.toLocaleString() || '0'}
                      </p>
                    </div>
                    <Calendar className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Entries</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {filteredExpenses.length}
                      </p>
                    </div>
                    <Receipt className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Top Category</p>
                      <p className="text-lg font-bold text-gray-900">
                        {summary && Object.entries(summary.categoryBreakdown).sort(([,a], [,b]) => b - a)[0]?.[0] || 'Materials'}
                      </p>
                    </div>
                    <PieChart className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Controls */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Expense Management</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => exportExpensesMutation.mutate()}
                      variant="outline"
                      disabled={exportExpensesMutation.isPending}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Report
                    </Button>
                    <Dialog open={showAddExpense} onOpenChange={setShowAddExpense}>
                      <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Expense
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Expense</DialogTitle>
                          <DialogDescription>
                            Track a new expense for your construction project
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="category">Category *</Label>
                              <Select value={newExpense.category} onValueChange={(value) => setNewExpense(prev => ({ ...prev, category: value }))}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Materials">Materials</SelectItem>
                                  <SelectItem value="Labor">Labor</SelectItem>
                                  <SelectItem value="Permits">Permits</SelectItem>
                                  <SelectItem value="Subs">Subcontractors</SelectItem>
                                  <SelectItem value="Misc">Miscellaneous</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="amount">Amount *</Label>
                              <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={newExpense.amount}
                                onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="description">Description *</Label>
                            <Input
                              id="description"
                              placeholder="Describe the expense"
                              value={newExpense.description}
                              onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="date">Date</Label>
                              <Input
                                id="date"
                                type="date"
                                value={newExpense.date}
                                onChange={(e) => setNewExpense(prev => ({ ...prev, date: e.target.value }))}
                              />
                            </div>
                            <div>
                              <Label htmlFor="vendor">Vendor</Label>
                              <Input
                                id="vendor"
                                placeholder="Vendor name"
                                value={newExpense.vendor}
                                onChange={(e) => setNewExpense(prev => ({ ...prev, vendor: e.target.value }))}
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="projectName">Project Name</Label>
                            <Input
                              id="projectName"
                              placeholder="Associated project"
                              value={newExpense.projectName}
                              onChange={(e) => setNewExpense(prev => ({ ...prev, projectName: e.target.value }))}
                            />
                          </div>
                          <div className="flex gap-2 pt-4">
                            <Button
                              onClick={handleAddExpense}
                              disabled={addExpenseMutation.isPending}
                              className="flex-1"
                            >
                              {addExpenseMutation.isPending ? 'Adding...' : 'Add Expense'}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setShowAddExpense(false)}
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <Label>Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search expenses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Materials">Materials</SelectItem>
                        <SelectItem value="Labor">Labor</SelectItem>
                        <SelectItem value="Permits">Permits</SelectItem>
                        <SelectItem value="Subs">Subcontractors</SelectItem>
                        <SelectItem value="Misc">Miscellaneous</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Expense List */}
                <div className="space-y-4">
                  {filteredExpenses.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Receipt className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No expenses found matching your filters</p>
                    </div>
                  ) : (
                    filteredExpenses.map((expense) => {
                      const CategoryIcon = categoryIcons[expense.category];
                      return (
                        <div key={expense.id} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                          <div className="flex items-center gap-4">
                            <div className="p-2 rounded-lg bg-gray-100">
                              <CategoryIcon className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium text-gray-900">{expense.description}</h3>
                                <Badge className={categoryColors[expense.category]}>
                                  {expense.category}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">
                                {expense.vendor && `${expense.vendor} • `}
                                {new Date(expense.date).toLocaleDateString()}
                                {expense.projectName && ` • ${expense.projectName}`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-lg font-semibold text-gray-900">
                              ${expense.amount.toLocaleString()}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteExpenseMutation.mutate(expense.id)}
                              disabled={deleteExpenseMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Category Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {summary && Object.entries(summary.categoryBreakdown).map(([category, amount]) => {
                      const percentage = summary.totalSpent > 0 ? (amount / summary.totalSpent) * 100 : 0;
                      const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons];
                      return (
                        <div key={category} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CategoryIcon className="w-4 h-4 text-gray-600" />
                            <span className="font-medium">{category}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">${amount.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">{percentage.toFixed(1)}%</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Monthly Spending Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {summary?.monthlyTrend?.map((month, index) => (
                      <div key={month.month} className="flex items-center justify-between">
                        <span className="font-medium">{month.month}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ 
                                width: `${summary.monthlyTrend.length > 0 ? (month.amount / Math.max(...summary.monthlyTrend.map(m => m.amount))) * 100 : 0}%` 
                              }}
                            />
                          </div>
                          <span className="font-semibold">${month.amount.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Vendors */}
            <Card>
              <CardHeader>
                <CardTitle>Top Vendors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {summary?.topVendors?.map((vendor, index) => (
                    <div key={vendor.vendor} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{vendor.vendor}</span>
                        <Badge variant="secondary">#{index + 1}</Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        ${vendor.amount.toLocaleString()} • {vendor.count} transactions
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Project Comparisons Tab */}
          <TabsContent value="comparisons" className="space-y-6">
            {projectComparisons.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Building className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">No project comparisons available yet</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Link expenses to projects to see budget variance analysis
                  </p>
                </CardContent>
              </Card>
            ) : (
              projectComparisons.map((project) => (
                <Card key={project.projectId}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{project.projectName}</CardTitle>
                      <div className="flex items-center gap-2">
                        {(() => {
                          const status = getVarianceStatus(project.variancePercent.total);
                          const StatusIcon = status.icon;
                          return (
                            <>
                              <StatusIcon className={`w-5 h-5 ${status.color}`} />
                              <span className={`text-sm font-medium ${status.color}`}>
                                {status.label}
                              </span>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Overall Summary */}
                    <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Estimated</p>
                        <p className="text-xl font-bold text-gray-900">
                          ${project.estimated.total.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Actual</p>
                        <p className="text-xl font-bold text-gray-900">
                          ${project.actual.total.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Variance</p>
                        <p className={`text-xl font-bold ${project.variance.total >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {project.variance.total >= 0 ? '+' : ''}${project.variance.total.toLocaleString()}
                        </p>
                        <p className={`text-sm ${project.variancePercent.total >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                          ({project.variancePercent.total >= 0 ? '+' : ''}{project.variancePercent.total.toFixed(1)}%)
                        </p>
                      </div>
                    </div>

                    {/* Category Breakdown */}
                    <div className="space-y-3">
                      {Object.entries(project.estimated).filter(([category]) => category !== 'total').map(([category, estimated]) => {
                        const actual = project.actual[category as keyof typeof project.actual];
                        const variance = project.variance[category as keyof typeof project.variance];
                        const variancePercent = project.variancePercent[category as keyof typeof project.variancePercent];
                        const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons];
                        
                        return (
                          <div key={category} className="flex items-center justify-between p-3 bg-white rounded border">
                            <div className="flex items-center gap-3">
                              <CategoryIcon className="w-4 h-4 text-gray-600" />
                              <span className="font-medium">{category}</span>
                            </div>
                            <div className="grid grid-cols-4 gap-4 text-sm">
                              <div className="text-right">
                                <div className="text-gray-600">Est: ${estimated.toLocaleString()}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-gray-900">Act: ${actual.toLocaleString()}</div>
                              </div>
                              <div className="text-right">
                                <div className={variance >= 0 ? 'text-red-600' : 'text-green-600'}>
                                  {variance >= 0 ? '+' : ''}${variance.toLocaleString()}
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge 
                                  className={
                                    variancePercent <= 0 ? 'bg-green-100 text-green-800' :
                                    variancePercent <= 20 ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }
                                >
                                  {variancePercent >= 0 ? '+' : ''}{variancePercent.toFixed(1)}%
                                </Badge>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* AI Cost Advisor Tab */}
          <TabsContent value="ai-tips" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Smart Cost-Saving Tips
                </CardTitle>
                <CardDescription>
                  AI-powered recommendations to optimize your project budget
                </CardDescription>
              </CardHeader>
              <CardContent>
                {costSavingTips.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Lightbulb className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No cost-saving recommendations available yet</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Add more expenses to get personalized AI suggestions
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {costSavingTips.map((tip, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge className={getPriorityColor(tip.priority)}>
                            {tip.priority} priority
                          </Badge>
                          <span className="font-medium text-gray-700">{tip.category}</span>
                        </div>
                        <p className="text-gray-900 mb-2">{tip.tip}</p>
                        <p className="text-sm text-green-600 font-medium">
                          💰 Potential savings: {tip.potentialSavings}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Feedback Button */}
      <FeedbackButton toolName="AI Expense Tracker" />
    </div>
  );
}
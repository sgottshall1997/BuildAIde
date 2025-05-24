import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Calculator, CalendarCheck, DollarSign, ArrowUp, Check, FileText } from "lucide-react";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: estimates } = useQuery({
    queryKey: ["/api/estimates"],
  });

  const { data: schedules } = useQuery({
    queryKey: ["/api/schedules"],
  });

  return (
    <div>
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">Construction Project Management</h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Streamline your construction projects with our intelligent bid estimation and permit scheduling tools. 
          Built for contractors who value precision and efficiency.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">Total Estimates</p>
                <p className="text-3xl font-bold text-slate-900">
                  {isLoading ? "..." : stats?.totalEstimates || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUp className="h-4 w-4 text-emerald-500 mr-1" />
              <span className="text-emerald-500 text-sm font-medium">12% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">Scheduled Inspections</p>
                <p className="text-3xl font-bold text-slate-900">
                  {isLoading ? "..." : stats?.scheduledInspections || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <CalendarCheck className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUp className="h-4 w-4 text-emerald-500 mr-1" />
              <span className="text-emerald-500 text-sm font-medium">8% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">Total Project Value</p>
                <p className="text-3xl font-bold text-slate-900">
                  {isLoading ? "..." : stats?.totalValue || "$0"}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUp className="h-4 w-4 text-emerald-500 mr-1" />
              <span className="text-emerald-500 text-sm font-medium">15% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tools Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Project Bid Estimator Card */}
        <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
          <img 
            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300" 
            alt="Construction site with blueprints and tools" 
            className="w-full h-48 object-cover"
          />
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Project Bid Estimator</h3>
                <p className="text-slate-500">Calculate accurate project costs</p>
              </div>
            </div>
            
            <p className="text-slate-600 mb-6 leading-relaxed">
              Generate precise cost estimates based on project type, area, and material quality. 
              Factor in labor costs, material expenses, and overhead to deliver competitive bids.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-slate-600">
                <Check className="h-4 w-4 text-emerald-500 mr-3" />
                Multi-project type support (Residential, Commercial, Industrial)
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <Check className="h-4 w-4 text-emerald-500 mr-3" />
                Material quality multipliers (Basic, Standard, Premium)
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <Check className="h-4 w-4 text-emerald-500 mr-3" />
                Blueprint PDF upload and preview
              </div>
            </div>
            
            <Button 
              onClick={() => setLocation("/estimator")} 
              className="w-full bg-primary hover:bg-primary/90"
            >
              Start New Estimate
            </Button>
          </CardContent>
        </Card>

        {/* Permit & Inspection Scheduler Card */}
        <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300" 
            alt="Modern office building representing permit and inspection scheduling" 
            className="w-full h-48 object-cover"
          />
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mr-4">
                <CalendarCheck className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Permit & Inspection Scheduler</h3>
                <p className="text-slate-500">Schedule permits and inspections</p>
              </div>
            </div>
            
            <p className="text-slate-600 mb-6 leading-relaxed">
              Streamline your permit applications and inspection scheduling with automated 
              validation and notification systems. Never miss a critical deadline again.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-slate-600">
                <Check className="h-4 w-4 text-emerald-500 mr-3" />
                ZIP code validation and location verification
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <Check className="h-4 w-4 text-emerald-500 mr-3" />
                Automated email and SMS notifications
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <Check className="h-4 w-4 text-emerald-500 mr-3" />
                Integration with local permit offices
              </div>
            </div>
            
            <Button 
              onClick={() => setLocation("/scheduler")} 
              className="w-full bg-amber-500 hover:bg-amber-600"
            >
              Schedule Inspection
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Recent Activity</h3>
          
          <div className="space-y-4">
            {estimates?.slice(0, 3).map((estimate, index) => (
              <div key={estimate.id} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calculator className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">
                    New estimate created for {estimate.projectType} project - ${estimate.estimatedCost.toLocaleString()}
                  </p>
                  <p className="text-sm text-slate-500">
                    {new Date(estimate.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
                  Completed
                </span>
              </div>
            )) || []}
            
            {schedules?.slice(0, 2).map((schedule) => (
              <div key={schedule.id} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CalendarCheck className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">
                    Inspection scheduled for {schedule.address}
                  </p>
                  <p className="text-sm text-slate-500">
                    {new Date(schedule.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                  Scheduled
                </span>
              </div>
            )) || []}

            {(!estimates?.length && !schedules?.length) && (
              <div className="text-center py-8 text-slate-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <p>No recent activity. Start by creating an estimate or scheduling an inspection.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react";

interface PaymentMilestone {
  id: string;
  name: string;
  percentage: number;
  amount: number;
  dueDate: string;
  status: 'pending' | 'due' | 'paid' | 'overdue';
  description: string;
  associatedTasks: string[];
}

interface PaymentTimelineProps {
  projectCost: number;
  startDate: string;
  endDate: string;
  tasks?: any[];
  onPaymentUpdate?: (milestoneId: string, status: string) => void;
}

export default function PaymentTimeline({ 
  projectCost, 
  startDate, 
  endDate, 
  tasks = [],
  onPaymentUpdate 
}: PaymentTimelineProps) {
  const [paymentMilestones, setPaymentMilestones] = useState<PaymentMilestone[]>(() => {
    // Generate payment schedule based on project timeline
    const start = new Date(startDate);
    const end = new Date(endDate);
    const projectDuration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    return [
      {
        id: 'deposit',
        name: 'Project Deposit',
        percentage: 25,
        amount: Math.round(projectCost * 0.25),
        dueDate: startDate,
        status: 'paid',
        description: 'Initial deposit to secure project start',
        associatedTasks: ['Project Planning', 'Permit Applications']
      },
      {
        id: 'materials',
        name: 'Materials & Setup',
        percentage: 30,
        amount: Math.round(projectCost * 0.30),
        dueDate: new Date(start.getTime() + (projectDuration * 0.2 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        status: 'due',
        description: 'Materials procurement and site preparation',
        associatedTasks: ['Demolition', 'Material Delivery', 'Site Setup']
      },
      {
        id: 'progress',
        name: 'Progress Payment',
        percentage: 30,
        amount: Math.round(projectCost * 0.30),
        dueDate: new Date(start.getTime() + (projectDuration * 0.6 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        status: 'pending',
        description: 'Milestone payment for major construction progress',
        associatedTasks: ['Rough Construction', 'Major Installation']
      },
      {
        id: 'completion',
        name: 'Final Payment',
        percentage: 15,
        amount: Math.round(projectCost * 0.15),
        dueDate: endDate,
        status: 'pending',
        description: 'Final payment upon project completion',
        associatedTasks: ['Final Inspection', 'Cleanup', 'Walkthrough']
      }
    ];
  });

  const updatePaymentStatus = (milestoneId: string, newStatus: string) => {
    setPaymentMilestones(prev => 
      prev.map(milestone => 
        milestone.id === milestoneId 
          ? { ...milestone, status: newStatus as any }
          : milestone
      )
    );
    onPaymentUpdate?.(milestoneId, newStatus);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'due':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'due':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const totalPaid = paymentMilestones
    .filter(m => m.status === 'paid')
    .reduce((sum, m) => sum + m.amount, 0);

  const totalDue = paymentMilestones
    .filter(m => m.status === 'due')
    .reduce((sum, m) => sum + m.amount, 0);

  const progressPercentage = (totalPaid / projectCost) * 100;

  return (
    <div className="space-y-6">
      {/* Payment Overview */}
      <Card className="card-base">
        <CardHeader className="card-header">
          <CardTitle className="heading-lg flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Payment Schedule Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-700">
                ${projectCost.toLocaleString()}
              </div>
              <div className="text-sm text-blue-600">Total Project Cost</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-700">
                ${totalPaid.toLocaleString()}
              </div>
              <div className="text-sm text-green-600">Payments Received</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-700">
                ${totalDue.toLocaleString()}
              </div>
              <div className="text-sm text-orange-600">Amount Due</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-700">
                {Math.round(progressPercentage)}%
              </div>
              <div className="text-sm text-gray-600">Payment Progress</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Payment Progress</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Timeline */}
      <Card className="card-base">
        <CardHeader className="card-header">
          <CardTitle className="heading-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Payment Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="card-content">
          <div className="space-y-4">
            {paymentMilestones.map((milestone, index) => (
              <div key={milestone.id} className="relative">
                {/* Timeline Line */}
                {index < paymentMilestones.length - 1 && (
                  <div className="absolute left-4 top-12 w-0.5 h-16 bg-gray-200" />
                )}
                
                <div className="flex items-start gap-4">
                  {/* Timeline Dot */}
                  <div className={`
                    w-8 h-8 rounded-full border-2 flex items-center justify-center
                    ${milestone.status === 'paid' 
                      ? 'bg-green-100 border-green-500' 
                      : milestone.status === 'due'
                      ? 'bg-orange-100 border-orange-500'
                      : 'bg-gray-100 border-gray-300'
                    }
                  `}>
                    {getStatusIcon(milestone.status)}
                  </div>

                  {/* Payment Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900">{milestone.name}</h3>
                        <Badge className={getStatusColor(milestone.status)}>
                          {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          ${milestone.amount.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {milestone.percentage}% of total
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4" />
                        Due: {new Date(milestone.dueDate).toLocaleDateString()}
                      </div>
                      <p>{milestone.description}</p>
                      {milestone.associatedTasks.length > 0 && (
                        <div className="mt-2">
                          <span className="text-xs font-medium text-gray-500">Associated Tasks: </span>
                          <span className="text-xs text-gray-600">
                            {milestone.associatedTasks.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {milestone.status !== 'paid' && (
                      <div className="mt-3 flex gap-2">
                        {milestone.status === 'due' && (
                          <Button 
                            size="sm" 
                            onClick={() => updatePaymentStatus(milestone.id, 'paid')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Mark as Paid
                          </Button>
                        )}
                        {milestone.status === 'pending' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updatePaymentStatus(milestone.id, 'due')}
                          >
                            Request Payment
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cash Flow Chart */}
      <Card className="card-base">
        <CardHeader className="card-header">
          <CardTitle className="heading-lg">Cash Flow Visualization</CardTitle>
        </CardHeader>
        <CardContent className="card-content">
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              Timeline showing expected payment receipts vs project expenses
            </div>
            
            {/* Simple Timeline Chart */}
            <div className="relative h-32 bg-gray-50 rounded-lg p-4 overflow-x-auto">
              <div className="flex items-end justify-between h-full min-w-full">
                {paymentMilestones.map((milestone, index) => (
                  <div key={milestone.id} className="flex flex-col items-center min-w-0 flex-1">
                    <div 
                      className={`
                        w-8 rounded-t transition-all duration-300
                        ${milestone.status === 'paid' 
                          ? 'bg-green-500' 
                          : milestone.status === 'due'
                          ? 'bg-orange-500'
                          : 'bg-gray-300'
                        }
                      `}
                      style={{ 
                        height: `${(milestone.amount / projectCost) * 100}%`,
                        minHeight: '20px'
                      }}
                    />
                    <div className="text-xs text-center mt-2 px-1">
                      <div className="font-medium truncate">${(milestone.amount / 1000).toFixed(0)}k</div>
                      <div className="text-gray-500">
                        {new Date(milestone.dueDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded" />
                <span>Paid</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded" />
                <span>Due</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded" />
                <span>Pending</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
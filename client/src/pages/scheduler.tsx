import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FeedbackButton from "@/components/feedback-button";
import { Calendar, Clock, Users, AlertCircle } from "lucide-react";

const mockSchedules = [
  {
    id: '1',
    projectName: 'Kitchen Renovation - 123 Oak St',
    startDate: '2025-06-01',
    endDate: '2025-06-15',
    status: 'In Progress',
    crew: ['John D.', 'Mike R.', 'Sarah L.'],
    phase: 'Demolition'
  },
  {
    id: '2',
    projectName: 'Bathroom Remodel - 456 Pine Ave',
    startDate: '2025-06-08',
    endDate: '2025-06-22',
    status: 'Planning',
    crew: ['Tom W.', 'Lisa K.'],
    phase: 'Planning'
  }
];

export default function Scheduler() {
  const [schedules] = useState(mockSchedules);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3 mb-4">
            <Calendar className="w-8 h-8 text-blue-600" />
            Schedule Builder
          </h1>
          <p className="text-slate-600 mb-6">
            Manage project timelines, crew assignments, and resource scheduling
          </p>
        </div>

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
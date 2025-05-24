import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LeadInputForm from "@/components/lead-input-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  TrendingUp, 
  Users, 
  Lightbulb, 
  ExternalLink, 
  Plus, 
  Calendar,
  MapPin,
  Phone,
  Mail,
  DollarSign
} from "lucide-react";
import { insertInternalIdeaSchema, type InsertInternalIdea } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

const leadSources = [
  {
    name: "BuildZoom",
    url: "https://www.buildzoom.com/contractor",
    description: "Professional contractor network and leads"
  },
  {
    name: "Angi Leads", 
    url: "https://www.angi.com/contractors/",
    description: "High-quality home improvement leads"
  },
  {
    name: "HomeAdvisor Pro",
    url: "https://pro.homeadvisor.com/",
    description: "Instant project notifications and leads"
  },
  {
    name: "Thumbtack",
    url: "https://www.thumbtack.com/pro/",
    description: "Local service professional marketplace"
  },
  {
    name: "Maryland RFP Board",
    url: "https://www.maryland.gov/Pages/business.aspx",
    description: "Government and public construction projects"
  }
];

export default function Opportunities() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedLeadStatus, setSelectedLeadStatus] = useState<string>("all");

  // Fetch leads from estimate submissions
  const { data: leads = [] } = useQuery({
    queryKey: ["/api/leads"],
  });

  // Fetch internal ideas
  const { data: internalIdeas = [] } = useQuery({
    queryKey: ["/api/internal-ideas"],
  });

  // Update lead status mutation
  const updateLeadMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return apiRequest("PATCH", `/api/leads/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      toast({
        title: "Success!",
        description: "Lead status updated successfully.",
      });
    },
  });

  // Create internal idea mutation
  const createIdeaMutation = useMutation({
    mutationFn: async (data: InsertInternalIdea) => {
      return apiRequest("POST", "/api/internal-ideas", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/internal-ideas"] });
      ideaForm.reset();
      toast({
        title: "Success!",
        description: "Internal idea added successfully.",
      });
    },
  });

  // Internal idea form
  const ideaForm = useForm<InsertInternalIdea>({
    resolver: zodResolver(insertInternalIdeaSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      status: "idea",
      priority: "medium",
      assignedTo: "",
      targetDate: "",
      notes: "",
    },
  });

  const onSubmitIdea = (data: InsertInternalIdea) => {
    createIdeaMutation.mutate(data);
  };

  // Filter leads by status
  const filteredLeads = selectedLeadStatus === "all" 
    ? leads 
    : leads.filter((lead: any) => lead.status === selectedLeadStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'follow-up': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'in-review': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'cold': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">New Business Opportunities</h1>
        <p className="text-slate-600">Track leads, explore new sources, and organize growth ideas</p>
      </div>

      <Tabs defaultValue="leads" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="leads">Inbound Leads</TabsTrigger>
          <TabsTrigger value="sources">Lead Sources</TabsTrigger>
          <TabsTrigger value="ideas">Internal Ideas</TabsTrigger>
        </TabsList>

        {/* Inbound Estimate Leads */}
        <TabsContent value="leads" className="space-y-6">
          {/* Lead Input Form */}
          <LeadInputForm />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Inbound Estimate Leads
              </CardTitle>
              <CardDescription>
                Track and manage leads from estimate form submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filter Controls */}
              <div className="flex gap-4 mb-6">
                <Select value={selectedLeadStatus} onValueChange={setSelectedLeadStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Leads</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                    <SelectItem value="in-review">In Review</SelectItem>
                    <SelectItem value="cold">Cold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Leads List */}
              <div className="space-y-4">
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead: any) => (
                    <div key={lead.id} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-lg">{lead.name}</h3>
                            <Badge className={getStatusColor(lead.status)}>
                              {lead.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {lead.zipCode}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(lead.createdAt).toLocaleDateString()}
                            </div>
                            <div className="capitalize">
                              {lead.projectType}
                            </div>
                          </div>

                          {lead.email && (
                            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                              <Mail className="h-4 w-4" />
                              {lead.email}
                            </div>
                          )}

                          {lead.phone && (
                            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                              <Phone className="h-4 w-4" />
                              {lead.phone}
                            </div>
                          )}

                          {lead.estimatedValue && (
                            <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                              <DollarSign className="h-4 w-4" />
                              Estimated Value: ${lead.estimatedValue.toLocaleString()}
                            </div>
                          )}
                        </div>

                        {/* Status Update Buttons */}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateLeadMutation.mutate({ id: lead.id, status: "follow-up" })}
                            disabled={updateLeadMutation.isPending}
                          >
                            Follow-up
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateLeadMutation.mutate({ id: lead.id, status: "in-review" })}
                            disabled={updateLeadMutation.isPending}
                          >
                            In Review
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateLeadMutation.mutate({ id: lead.id, status: "cold" })}
                            disabled={updateLeadMutation.isPending}
                          >
                            Cold
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      No leads found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedLeadStatus === "all" 
                        ? "New leads will appear here when customers submit estimate requests."
                        : `No leads with status "${selectedLeadStatus}" found.`
                      }
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lead Source Links */}
        <TabsContent value="sources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Lead Source Links
              </CardTitle>
              <CardDescription>
                Quick access to external platforms for finding new business opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {leadSources.map((source, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg">{source.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {source.description}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(source.url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Internal Ideas Tracker */}
        <TabsContent value="ideas" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add New Idea Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Idea
                </CardTitle>
                <CardDescription>
                  Track internal business development ideas and opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...ideaForm}>
                  <form onSubmit={ideaForm.handleSubmit(onSubmitIdea)} className="space-y-4">
                    <FormField
                      control={ideaForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Follow up with Johnson family about deck addition" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={ideaForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Detailed description of the opportunity..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={ideaForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="follow-up">Follow-up</SelectItem>
                                  <SelectItem value="referral">Referral</SelectItem>
                                  <SelectItem value="marketing">Marketing</SelectItem>
                                  <SelectItem value="networking">Networking</SelectItem>
                                  <SelectItem value="partnership">Partnership</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={ideaForm.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Priority</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="low">Low</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={ideaForm.control}
                      name="assignedTo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assigned To (Optional)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Team member name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={createIdeaMutation.isPending} className="w-full">
                      {createIdeaMutation.isPending ? "Adding..." : "Add Idea"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Ideas List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Internal Ideas Tracker
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {internalIdeas.length > 0 ? (
                    internalIdeas.map((idea: any) => (
                      <div key={idea.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">{idea.title}</h4>
                          <div className="flex gap-2">
                            <Badge className={getPriorityColor(idea.priority)}>
                              {idea.priority}
                            </Badge>
                            <Badge variant="outline">
                              {idea.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {idea.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="capitalize">{idea.category}</span>
                          {idea.assignedTo && <span>Assigned: {idea.assignedTo}</span>}
                          <span>{new Date(idea.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        No ideas yet
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Add your first business development idea to get started.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
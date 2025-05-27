import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, User, Phone, Mail, MapPin, Calendar, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQueryClient } from "@tanstack/react-query";

interface LeadInputFormProps {
  onSuccess?: () => void;
  className?: string;
}

export default function LeadInputForm({ onSuccess, className }: LeadInputFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientName: "",
    phone: "",
    email: "",
    projectType: "",
    address: "",
    zipCode: "",
    estimatedBudget: "",
    timeline: "",
    source: "",
    description: "",
    priority: "medium"
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clientName || !formData.phone || !formData.projectType) {
      toast({
        title: "Missing Information",
        description: "Please fill in client name, phone, and project type at minimum.",
        variant: "destructive",
      });
      return;
    }

    // Check if in demo mode
    if (import.meta.env.VITE_DEMO_MODE) {
      toast({
        title: "🔒 Demo Mode",
        description: "Lead saving is disabled in demo mode. In production, this would save to your CRM.",
      });
      return;
    }

    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/leads", {
        ...formData,
        status: "new",
        createdAt: new Date().toISOString()
      });

      toast({
        title: "Lead Added Successfully!",
        description: `${formData.clientName}'s ${formData.projectType} project has been saved.`,
      });

      // Reset form
      setFormData({
        clientName: "",
        phone: "",
        email: "",
        projectType: "",
        address: "",
        zipCode: "",
        estimatedBudget: "",
        timeline: "",
        source: "",
        description: "",
        priority: "medium"
      });

      // Refresh leads data
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      
      if (onSuccess) onSuccess();

    } catch (error) {
      console.error("Error saving lead:", error);
      toast({
        title: "Error",
        description: "Failed to save lead. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`border-green-200 bg-green-50/30 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-green-600" />
          Add New Inbound Lead
          <Badge variant="secondary" className="bg-green-100 text-green-700 ml-auto">
            Quick Entry
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Client Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clientName" className="flex items-center gap-1">
                <User className="h-4 w-4" />
                Client Name *
              </Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => handleInputChange("clientName", e.target.value)}
                placeholder="Full name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="phone" className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                Phone Number *
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="(555) 123-4567"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email" className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="client@email.com"
              />
            </div>

            <div>
              <Label htmlFor="projectType">Project Type *</Label>
              <Select value={formData.projectType} onValueChange={(value) => handleInputChange("projectType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kitchen">Kitchen Renovation</SelectItem>
                  <SelectItem value="bathroom">Bathroom Renovation</SelectItem>
                  <SelectItem value="addition">Home Addition</SelectItem>
                  <SelectItem value="deck">Deck/Patio</SelectItem>
                  <SelectItem value="flooring">Flooring</SelectItem>
                  <SelectItem value="roofing">Roofing</SelectItem>
                  <SelectItem value="siding">Siding</SelectItem>
                  <SelectItem value="basement">Basement Finishing</SelectItem>
                  <SelectItem value="commercial">Commercial Renovation</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="address" className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                Project Address
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="123 Main St, City, State"
              />
            </div>
            
            <div>
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => handleInputChange("zipCode", e.target.value)}
                placeholder="20814"
                maxLength={5}
              />
            </div>
          </div>

          {/* Project Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="estimatedBudget" className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                Estimated Budget
              </Label>
              <Select value={formData.estimatedBudget} onValueChange={(value) => handleInputChange("estimatedBudget", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-10k">Under $10,000</SelectItem>
                  <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                  <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                  <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                  <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
                  <SelectItem value="over-250k">Over $250,000</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="timeline" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Desired Timeline
              </Label>
              <Select value={formData.timeline} onValueChange={(value) => handleInputChange("timeline", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="When to start" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asap">ASAP (Rush)</SelectItem>
                  <SelectItem value="1-2-weeks">Within 1-2 weeks</SelectItem>
                  <SelectItem value="1-month">Within 1 month</SelectItem>
                  <SelectItem value="2-3-months">2-3 months</SelectItem>
                  <SelectItem value="flexible">Flexible timing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Lead Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Lead Source */}
          <div>
            <Label htmlFor="source">Lead Source</Label>
            <Select value={formData.source} onValueChange={(value) => handleInputChange("source", value)}>
              <SelectTrigger>
                <SelectValue placeholder="How did they find you?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
                <SelectItem value="google">Google Search</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="nextdoor">Nextdoor</SelectItem>
                <SelectItem value="angie">Angie's List</SelectItem>
                <SelectItem value="homeadvisor">HomeAdvisor</SelectItem>
                <SelectItem value="thumbtack">Thumbtack</SelectItem>
                <SelectItem value="phone">Phone Call</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Project Description */}
          <div>
            <Label htmlFor="description">Project Description & Notes</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Additional details about the project, specific requirements, or conversation notes..."
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving Lead...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Lead to Pipeline
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
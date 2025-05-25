import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Mail, Star, CheckCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usageTracker } from "@/lib/usage-tracker";

interface EmailSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmailSubmitted: (email: string) => void;
  remainingUses: number;
}

export default function EmailSignupModal({ 
  isOpen, 
  onClose, 
  onEmailSubmitted, 
  remainingUses 
}: EmailSignupModalProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }

    if (!email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save email locally
      usageTracker.saveUserEmail(email);
      
      // Call the callback
      onEmailSubmitted(email);
      
      toast({
        title: "Welcome to Construction Smart Tools!",
        description: "Thanks for signing up! You now have unlimited access to all tools."
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Signup failed",
        description: "There was an error saving your information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-6 h-6 text-blue-600" />
              <DialogTitle>Unlock Full Access</DialogTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <DialogDescription>
            You've used {3 - remainingUses} of your 3 free tool uses. 
            Enter your email to continue using all our renovation tools for free!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Benefits */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
              <Star className="w-4 h-4" />
              What you get with free access:
            </h4>
            <ul className="space-y-1 text-sm text-blue-800">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3" />
                Unlimited cost estimates
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3" />
                AI renovation assistant
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3" />
                Project tracking tools
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3" />
                Contractor comparison
              </li>
            </ul>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="signup-email">Email Address</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Getting you set up..." : "Continue for Free"}
            </Button>
          </form>

          {/* Pro Upgrade Teaser */}
          <div className="border-t pt-4">
            <div className="text-center">
              <Badge variant="outline" className="mb-2">
                Coming Soon
              </Badge>
              <p className="text-sm text-slate-600">
                Want even more features? Pro accounts with advanced analytics, 
                team collaboration, and priority support will be available soon.
              </p>
            </div>
          </div>

          {/* Privacy Note */}
          <p className="text-xs text-slate-500 text-center">
            We'll only use your email to send you helpful renovation tips and product updates. 
            No spam, unsubscribe anytime.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
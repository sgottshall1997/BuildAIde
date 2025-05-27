import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Star, Send, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FeedbackFormProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function FeedbackForm({ isOpen, onOpenChange }: FeedbackFormProps) {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [usage, setUsage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const usageOptions = [
    { value: "bid-estimation", label: "Creating project estimates" },
    { value: "scheduling", label: "Project scheduling" },
    { value: "material-pricing", label: "Material price research" },
    { value: "flip-analysis", label: "Property flip analysis" },
    { value: "consumer-tools", label: "Homeowner renovation tools" },
    { value: "ai-assistant", label: "AI guidance and recommendations" },
    { value: "other", label: "Other" }
  ];

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a star rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    // Check if in demo mode
    if (import.meta.env.VITE_DEMO_MODE) {
      toast({
        title: "🔒 Demo Mode",
        description: "Feedback submission is disabled in demo mode. In production, this would be sent to our team.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          comment,
          usage,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.pathname
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        toast({
          title: "Thank You!",
          description: "Your feedback helps us improve the platform.",
        });
        
        // Reset form after a delay
        setTimeout(() => {
          setRating(0);
          setComment("");
          setUsage("");
          setSubmitted(false);
          if (onOpenChange) onOpenChange(false);
        }, 2000);
      } else {
        throw new Error("Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Submission Error",
        description: "We couldn't submit your feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setRating(0);
    setComment("");
    setUsage("");
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Feedback Submitted!
          </h3>
          <p className="text-green-700">
            Thank you for helping us improve ConstructionSmartTools.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          Share Your Feedback
        </CardTitle>
        <p className="text-sm text-slate-600">
          Help us improve your experience with ConstructionSmartTools
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Star Rating */}
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">
            How would you rate your experience? *
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Button
                key={star}
                variant="ghost"
                size="sm"
                className="p-1"
                onClick={() => handleStarClick(star)}
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </Button>
            ))}
          </div>
          {rating > 0 && (
            <Badge variant="secondary" className="mt-2">
              {rating} star{rating !== 1 ? 's' : ''} - {
                rating === 1 ? 'Poor' :
                rating === 2 ? 'Fair' :
                rating === 3 ? 'Good' :
                rating === 4 ? 'Very Good' :
                'Excellent'
              }
            </Badge>
          )}
        </div>

        {/* Usage Type */}
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">
            What did you use this for?
          </label>
          <Select value={usage} onValueChange={setUsage}>
            <SelectTrigger>
              <SelectValue placeholder="Select primary use case" />
            </SelectTrigger>
            <SelectContent>
              {usageOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Comment */}
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">
            Comments or suggestions (optional)
          </label>
          <Textarea
            placeholder="Tell us what you liked or how we can improve..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={resetForm}
            variant="outline"
            className="flex-1"
          >
            <X className="w-4 h-4 mr-2" />
            Clear
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? (
              "Submitting..."
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Feedback
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Floating Feedback Button Component
export function FloatingFeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg z-50"
          size="icon"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>We'd love your feedback!</DialogTitle>
          <DialogDescription>
            Help us improve ConstructionSmartTools
          </DialogDescription>
        </DialogHeader>
        <FeedbackForm isOpen={isOpen} onOpenChange={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
}
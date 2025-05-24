import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Star, ThumbsUp, MessageSquare, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ClientFeedbackProps {
  estimateData: any;
  onFeedbackSubmitted?: (feedback: any) => void;
}

export default function ClientFeedback({ estimateData, onFeedbackSubmitted }: ClientFeedbackProps) {
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState("");
  const [helpfulness, setHelpfulness] = useState<"helpful" | "not-helpful" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { toast } = useToast();

  const handleStarClick = (starValue: number) => {
    setRating(starValue);
  };

  const handleSubmitFeedback = async () => {
    if (rating === 0 && !helpfulness) return;
    
    setIsSubmitting(true);
    try {
      const feedbackData = {
        rating,
        helpfulness,
        feedback,
        estimateData: {
          projectType: estimateData.projectType,
          estimatedCost: estimateData.estimatedCost,
          timeline: estimateData.timeline
        },
        timestamp: new Date().toISOString()
      };

      const response = await fetch("/api/client-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      });

      if (response.ok) {
        setHasSubmitted(true);
        toast({
          title: "Thank You!",
          description: "Your feedback helps us improve our estimates and service.",
        });
        onFeedbackSubmitted?.(feedbackData);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasSubmitted) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <ThumbsUp className="h-12 w-12 text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-green-800">Thank You!</h3>
            <p className="text-green-700">Your feedback has been submitted and helps us serve you better.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          How was your estimate experience?
        </CardTitle>
        <CardDescription>
          Help us improve our service by sharing your feedback
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Helpfulness Check */}
        <div>
          <p className="text-sm font-medium mb-3">Was this estimate helpful?</p>
          <div className="flex gap-3">
            <Button
              variant={helpfulness === "helpful" ? "default" : "outline"}
              size="sm"
              onClick={() => setHelpfulness("helpful")}
              className="flex items-center gap-2"
            >
              <ThumbsUp className="h-4 w-4" />
              Yes, helpful
            </Button>
            <Button
              variant={helpfulness === "not-helpful" ? "destructive" : "outline"}
              size="sm"
              onClick={() => setHelpfulness("not-helpful")}
            >
              Not helpful
            </Button>
          </div>
        </div>

        {/* Star Rating */}
        <div>
          <p className="text-sm font-medium mb-3">Rate your overall experience</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleStarClick(star)}
                className="transition-colors"
              >
                <Star
                  className={`h-6 w-6 ${
                    star <= rating 
                      ? "fill-yellow-400 text-yellow-400" 
                      : "text-gray-300 hover:text-yellow-400"
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <Badge variant="secondary" className="mt-2">
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </Badge>
          )}
        </div>

        {/* Optional Comments */}
        <div>
          <p className="text-sm font-medium mb-3">Additional comments (optional)</p>
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Tell us what you liked or how we can improve..."
            className="min-h-[80px]"
          />
        </div>

        {/* Submit Button */}
        <Button 
          onClick={handleSubmitFeedback} 
          disabled={rating === 0 && !helpfulness || isSubmitting}
          className="w-full flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Submit Feedback
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
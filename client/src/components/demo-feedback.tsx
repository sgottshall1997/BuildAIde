import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, Send, X } from "lucide-react";

interface DemoFeedbackProps {
  toolName: string;
  className?: string;
}

export default function DemoFeedback({ toolName, className = "" }: DemoFeedbackProps) {
  const [feedbackGiven, setFeedbackGiven] = useState<'positive' | 'negative' | null>(null);
  const [showTextarea, setShowTextarea] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handlePositiveFeedback = () => {
    setFeedbackGiven('positive');
    // Log positive feedback
    console.log(`Positive feedback for ${toolName}:`, { 
      tool: toolName, 
      feedback: 'positive',
      timestamp: new Date().toISOString()
    });
    setIsSubmitted(true);
  };

  const handleNegativeFeedback = () => {
    setFeedbackGiven('negative');
    setShowTextarea(true);
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim()) return;
    
    setIsSubmitting(true);
    
    // Log feedback to console (in real app, this would go to your feedback endpoint)
    console.log(`Negative feedback for ${toolName}:`, { 
      tool: toolName, 
      feedback: 'negative',
      details: feedbackText,
      timestamp: new Date().toISOString()
    });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleCloseFeedback = () => {
    setShowTextarea(false);
    setFeedbackGiven(null);
    setFeedbackText("");
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <Card className={`bg-green-50 border-green-200 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-green-700">
              <ThumbsUp className="w-4 h-4" />
              <span className="text-sm font-medium">Thanks for your feedback!</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCloseFeedback}
              className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-blue-50 border-blue-200 ${className}`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Feedback Question */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Was this helpful?</span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePositiveFeedback}
                className="h-8 px-2 text-green-600 hover:text-green-700 hover:bg-green-100"
                disabled={feedbackGiven !== null}
              >
                <ThumbsUp className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNegativeFeedback}
                className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-100"
                disabled={feedbackGiven !== null}
              >
                <ThumbsDown className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Feedback Textarea */}
          {showTextarea && (
            <div className="space-y-2">
              <Textarea
                placeholder="What could we improve? (optional)"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="min-h-[80px] text-sm resize-none"
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseFeedback}
                  className="h-8 px-3 text-slate-600"
                >
                  Skip
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmitFeedback}
                  disabled={isSubmitting}
                  className="h-8 px-3 bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Send className="w-3 h-3" />
                      <span>Send</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
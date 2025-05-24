import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, Star, MessageSquare, CheckCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface AIFlipFeedbackProps {
  listingId: string;
  listingAddress: string;
  onFeedbackSubmitted?: (feedback: any) => void;
}

export default function AIFlipFeedback({ 
  listingId, 
  listingAddress, 
  onFeedbackSubmitted 
}: AIFlipFeedbackProps) {
  const [feedbackType, setFeedbackType] = useState<'thumbs' | 'stars' | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [thumbsRating, setThumbsRating] = useState<'up' | 'down' | null>(null);
  const [comment, setComment] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const submitFeedbackMutation = useMutation({
    mutationFn: async (feedbackData: any) => {
      const response = await fetch("/api/ai-flip-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackData),
      });
      if (!response.ok) throw new Error("Failed to submit feedback");
      return response.json();
    },
    onSuccess: (data) => {
      setSubmitted(true);
      toast({
        title: "Feedback Submitted",
        description: "Thank you for helping us improve our AI analysis!",
      });
      onFeedbackSubmitted?.(data);
      queryClient.invalidateQueries({ queryKey: ["/api/ai-flip-feedback"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmitFeedback = () => {
    const feedbackData = {
      listingId,
      listingAddress,
      feedbackType,
      rating: feedbackType === 'stars' ? rating : null,
      thumbsRating: feedbackType === 'thumbs' ? thumbsRating : null,
      comment: comment.trim() || null,
      timestamp: new Date().toISOString(),
    };

    submitFeedbackMutation.mutate(feedbackData);
  };

  const canSubmit = () => {
    if (feedbackType === 'stars') return rating !== null;
    if (feedbackType === 'thumbs') return thumbsRating !== null;
    return false;
  };

  if (submitted) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 text-green-700">
            <CheckCircle className="h-5 w-5" />
            <div>
              <p className="font-medium">Feedback Submitted</p>
              <p className="text-sm text-green-600">Thank you for helping us improve!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-purple-200 bg-purple-50">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="text-center">
            <h4 className="font-medium text-slate-900 mb-2">Was this AI analysis helpful?</h4>
            <p className="text-sm text-slate-600">
              Your feedback helps us improve our property evaluation AI
            </p>
          </div>

          {/* Feedback Type Selection */}
          {!feedbackType && (
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => setFeedbackType('thumbs')}
                className="flex items-center gap-2 hover:bg-blue-50"
              >
                <ThumbsUp className="h-4 w-4" />
                Quick Rating
              </Button>
              <Button
                variant="outline"
                onClick={() => setFeedbackType('stars')}
                className="flex items-center gap-2 hover:bg-yellow-50"
              >
                <Star className="h-4 w-4" />
                Detailed Rating
              </Button>
            </div>
          )}

          {/* Thumbs Up/Down Rating */}
          {feedbackType === 'thumbs' && (
            <div className="space-y-4">
              <div className="flex justify-center gap-4">
                <Button
                  variant={thumbsRating === 'up' ? 'default' : 'outline'}
                  onClick={() => setThumbsRating('up')}
                  className="flex items-center gap-2"
                >
                  <ThumbsUp className="h-4 w-4" />
                  Helpful
                </Button>
                <Button
                  variant={thumbsRating === 'down' ? 'destructive' : 'outline'}
                  onClick={() => setThumbsRating('down')}
                  className="flex items-center gap-2"
                >
                  <ThumbsDown className="h-4 w-4" />
                  Not Helpful
                </Button>
              </div>
            </div>
          )}

          {/* Star Rating */}
          {feedbackType === 'stars' && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-slate-600 mb-3">Rate the quality of this analysis:</p>
                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          rating && star <= rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-slate-300 hover:text-yellow-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {rating && (
                  <p className="text-sm text-slate-600 mt-2">
                    {rating === 1 && "Poor - Not useful"}
                    {rating === 2 && "Fair - Somewhat useful"}
                    {rating === 3 && "Good - Moderately useful"}
                    {rating === 4 && "Very Good - Quite useful"}
                    {rating === 5 && "Excellent - Extremely useful"}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Optional Comment */}
          {feedbackType && !showCommentBox && (
            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCommentBox(true)}
                className="text-slate-600 hover:text-slate-900"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Add a comment (optional)
              </Button>
            </div>
          )}

          {showCommentBox && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Additional Comments (Optional)
              </label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us more about what was helpful or what could be improved..."
                className="min-h-[80px]"
              />
            </div>
          )}

          {/* Submit Actions */}
          {feedbackType && (
            <div className="flex justify-center gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setFeedbackType(null);
                  setRating(null);
                  setThumbsRating(null);
                  setComment("");
                  setShowCommentBox(false);
                }}
                disabled={submitFeedbackMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitFeedback}
                disabled={!canSubmit() || submitFeedbackMutation.isPending}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {submitFeedbackMutation.isPending ? "Submitting..." : "Submit Feedback"}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
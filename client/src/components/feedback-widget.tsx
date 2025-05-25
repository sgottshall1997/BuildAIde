import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  X, 
  Send, 
  ThumbsUp, 
  AlertTriangle,
  Heart,
  Sparkles
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";

interface FeedbackData {
  workingWell: string;
  needsImprovement: string;
  userMode: 'pro' | 'consumer';
  currentPage: string;
  timestamp: string;
}

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [workingWell, setWorkingWell] = useState("");
  const [needsImprovement, setNeedsImprovement] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { userMode } = useAppContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!workingWell.trim() && !needsImprovement.trim()) {
      return;
    }

    setIsSubmitting(true);

    const feedbackData: FeedbackData = {
      workingWell: workingWell.trim(),
      needsImprovement: needsImprovement.trim(),
      userMode,
      currentPage: window.location.pathname,
      timestamp: new Date().toISOString()
    };

    // Log feedback to console (will be replaced with backend integration later)
    console.log("=== USER FEEDBACK SUBMITTED ===");
    console.log("User Mode:", feedbackData.userMode);
    console.log("Current Page:", feedbackData.currentPage);
    console.log("Timestamp:", feedbackData.timestamp);
    console.log("What's working well:", feedbackData.workingWell);
    console.log("What needs improvement:", feedbackData.needsImprovement);
    console.log("================================");

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after 2 seconds and close
    setTimeout(() => {
      setWorkingWell("");
      setNeedsImprovement("");
      setIsSubmitted(false);
      setIsOpen(false);
    }, 2000);
  };

  const handleClose = () => {
    setIsOpen(false);
    setWorkingWell("");
    setNeedsImprovement("");
    setIsSubmitted(false);
  };

  return (
    <>
      {/* Feedback Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 h-12 px-4 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-full flex items-center space-x-2"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="hidden sm:inline">Feedback</span>
        </Button>
      )}

      {/* Feedback Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={handleClose}
          />
          
          {/* Modal Card */}
          <Card className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] shadow-2xl border-2 border-blue-200 bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Heart className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-slate-900">We'd love your feedback!</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {userMode === 'pro' ? 'Pro Mode' : 'Consumer Mode'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="p-1 h-auto text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* What's Working Well */}
                  <div className="space-y-2">
                    <Label className="flex items-center space-x-2 text-sm font-medium text-slate-700">
                      <ThumbsUp className="h-4 w-4 text-green-600" />
                      <span>What's working well?</span>
                    </Label>
                    <Textarea
                      value={workingWell}
                      onChange={(e) => setWorkingWell(e.target.value)}
                      placeholder="Tell us what you love about ConstructionSmartTools..."
                      className="min-h-[80px] resize-none text-sm"
                    />
                  </div>

                  {/* What Needs Improvement */}
                  <div className="space-y-2">
                    <Label className="flex items-center space-x-2 text-sm font-medium text-slate-700">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <span>What's confusing or needs fixing?</span>
                    </Label>
                    <Textarea
                      value={needsImprovement}
                      onChange={(e) => setNeedsImprovement(e.target.value)}
                      placeholder="Share any issues, confusion, or suggestions for improvement..."
                      className="min-h-[80px] resize-none text-sm"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-slate-500">
                      Your feedback helps us build better tools
                    </p>
                    <Button
                      type="submit"
                      disabled={isSubmitting || (!workingWell.trim() && !needsImprovement.trim())}
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>Send Feedback</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                /* Success State */
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Thank you!</h3>
                  <p className="text-sm text-slate-600">
                    Your feedback has been received and will help us improve ConstructionSmartTools.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
}

export default FeedbackWidget;
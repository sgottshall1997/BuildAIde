import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, ExternalLink, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FeedbackButtonProps {
  toolName?: string;
  className?: string;
}

export default function FeedbackButton({ toolName = "", className = "" }: FeedbackButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Configurable feedback URL - can be updated to Google Form, Airtable, etc.
  const feedbackBaseUrl = "https://forms.gle/your-form-id"; // Replace with actual form URL
  const feedbackUrl = toolName 
    ? `${feedbackBaseUrl}?tool=${encodeURIComponent(toolName)}`
    : feedbackBaseUrl;

  const handleFeedbackClick = () => {
    // Log feedback interaction
    console.log(`Feedback button clicked for tool: ${toolName || 'General'}`);
    
    // Open feedback form in new tab
    window.open(feedbackUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      {isExpanded ? (
        <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm max-w-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-slate-900">Help Us Improve!</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="h-6 w-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Your feedback helps us build better tools for construction professionals and homeowners.
            </p>
            <Button 
              onClick={handleFeedbackClick}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Share Feedback
              <ExternalLink className="w-3 h-3 ml-2" />
            </Button>
            {toolName && (
              <p className="text-xs text-slate-500 mt-2">
                Feedback for: {toolName}
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <Button
          onClick={() => setIsExpanded(true)}
          className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-full h-12 px-4"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Leave Feedback</span>
          <span className="sm:hidden">Feedback</span>
        </Button>
      )}
    </div>
  );
}
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ChevronDown, ChevronUp, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIResultBoxProps {
  content?: string;
  isLoading?: boolean;
  error?: string | null;
  title?: string;
  maxLength?: number;
  showAnimation?: boolean;
  className?: string;
  variant?: "default" | "compact" | "highlighted";
}

export function AIResultBox({
  content,
  isLoading = false,
  error = null,
  title,
  maxLength = 500,
  showAnimation = true,
  className,
  variant = "default"
}: AIResultBoxProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [displayedContent, setDisplayedContent] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Typing animation effect
  useEffect(() => {
    if (content && showAnimation && !isLoading && !error) {
      setIsTyping(true);
      setDisplayedContent("");
      
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex < content.length) {
          setDisplayedContent(content.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(interval);
        }
      }, 20); // Adjust typing speed

      return () => clearInterval(interval);
    } else if (content && !showAnimation) {
      setDisplayedContent(content);
    }
  }, [content, showAnimation, isLoading, error]);

  const shouldTruncate = content && content.length > maxLength;
  const truncatedContent = shouldTruncate && !isExpanded 
    ? content.slice(0, maxLength) + "..."
    : content;

  const displayContent = showAnimation ? displayedContent : truncatedContent;

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-3 animate-pulse">
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
        <div className="h-4 bg-slate-200 rounded w-24"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 rounded w-full"></div>
        <div className="h-4 bg-slate-200 rounded w-4/5"></div>
        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
      </div>
    </div>
  );

  // Error component
  const ErrorDisplay = () => (
    <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
      <div>
        <h4 className="text-sm font-medium text-red-800 mb-1">
          Something went wrong
        </h4>
        <p className="text-sm text-red-700">
          {error || "We couldn't process your request. Please try again."}
        </p>
      </div>
    </div>
  );

  const getVariantClasses = () => {
    switch (variant) {
      case "compact":
        return "p-4";
      case "highlighted":
        return "p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200";
      default:
        return "card-content";
    }
  };

  return (
    <Card className={cn(
      "card-base transition-all duration-300",
      showAnimation && !isLoading && content && "animate-in fade-in slide-in-from-bottom-2",
      className
    )}>
      {title && (
        <div className="card-header">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <h3 className="heading-sm text-slate-900">{title}</h3>
          </div>
        </div>
      )}
      
      <CardContent className={getVariantClasses()}>
        {isLoading && <LoadingSkeleton />}
        
        {error && <ErrorDisplay />}
        
        {!isLoading && !error && content && (
          <div className="space-y-4">
            <div className={cn(
              "body-lg text-slate-700 leading-relaxed",
              isTyping && "border-r-2 border-blue-500 animate-pulse"
            )}>
              {/* Format the AI response with proper line breaks and styling */}
              <div className="whitespace-pre-wrap">
                {displayContent.split('\n').map((line, index) => {
                  // Handle bullet points
                  if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                    return (
                      <div key={index} className="flex items-start gap-2 mb-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>{line.replace(/^[•\-]\s*/, '')}</span>
                      </div>
                    );
                  }
                  // Handle headers (lines that end with :)
                  if (line.trim().endsWith(':') && line.trim().length < 50) {
                    return (
                      <h4 key={index} className="font-semibold text-slate-800 mt-4 mb-2">
                        {line}
                      </h4>
                    );
                  }
                  // Regular paragraphs
                  return line.trim() ? (
                    <p key={index} className="mb-3">{line}</p>
                  ) : (
                    <div key={index} className="h-2"></div>
                  );
                })}
              </div>
            </div>

            {/* Show more/less toggle */}
            {shouldTruncate && !showAnimation && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-blue-600 hover:text-blue-700 p-0 h-auto font-medium"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Show more
                  </>
                )}
              </Button>
            )}
          </div>
        )}

        {!isLoading && !error && !content && (
          <div className="text-center py-8 text-slate-500">
            <Sparkles className="h-12 w-12 mx-auto mb-3 text-slate-300" />
            <p className="body-md">AI response will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default AIResultBox;
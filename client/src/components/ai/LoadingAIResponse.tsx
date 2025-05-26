import { Card, CardContent } from "@/components/ui/card";
import { Bot, Sparkles } from "lucide-react";

interface LoadingAIResponseProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export default function LoadingAIResponse({ 
  message = "AI is analyzing your project...", 
  size = 'medium' 
}: LoadingAIResponseProps) {
  const sizeClasses = {
    small: "p-4",
    medium: "p-6", 
    large: "p-8"
  };

  const iconSizes = {
    small: "w-5 h-5",
    medium: "w-6 h-6",
    large: "w-8 h-8"
  };

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 animate-pulse">
      <CardContent className={sizeClasses[size]}>
        <div className="flex items-center justify-center space-x-3">
          <div className="relative">
            <Bot className={`${iconSizes[size]} text-blue-600 animate-bounce`} />
            <Sparkles className="w-3 h-3 text-yellow-500 absolute -top-1 -right-1 animate-ping" />
          </div>
          <div className="flex flex-col items-center">
            <p className="text-blue-800 font-medium text-center">{message}</p>
            <div className="flex space-x-1 mt-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
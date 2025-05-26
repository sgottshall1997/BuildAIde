import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Copy, 
  CheckCircle, 
  Bot, 
  AlertTriangle, 
  RefreshCw,
  Sparkles 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIResponseBoxProps {
  content: string | null;
  title?: string;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  variant?: 'default' | 'success' | 'warning' | 'insight';
  showCopy?: boolean;
  className?: string;
}

interface ParsedContent {
  title?: string;
  sections: Array<{
    heading?: string;
    content: string;
    type: 'text' | 'list' | 'numbered';
  }>;
}

function parseAIContent(content: string): ParsedContent {
  if (!content) return { sections: [] };

  // Try to parse as JSON first
  try {
    const parsed = JSON.parse(content);
    if (parsed.title || parsed.sections) {
      return parsed;
    }
  } catch {
    // Not JSON, parse as markdown-style text
  }

  const sections: ParsedContent['sections'] = [];
  const lines = content.split('\n').filter(line => line.trim());
  
  let currentSection: { heading?: string; content: string; type: 'text' | 'list' | 'numbered' } = {
    content: '',
    type: 'text'
  };

  for (const line of lines) {
    const trimmed = line.trim();
    
    // Check for headings
    if (trimmed.startsWith('# ') || trimmed.startsWith('## ') || trimmed.startsWith('### ')) {
      if (currentSection.content) {
        sections.push({ ...currentSection });
      }
      currentSection = {
        heading: trimmed.replace(/^#+\s*/, ''),
        content: '',
        type: 'text'
      };
    }
    // Check for bullet points
    else if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (currentSection.type !== 'list') {
        if (currentSection.content) {
          sections.push({ ...currentSection });
        }
        currentSection = { content: '', type: 'list' };
      }
      currentSection.content += (currentSection.content ? '\n' : '') + trimmed.replace(/^[•\-*]\s*/, '');
    }
    // Check for numbered lists
    else if (/^\d+\.\s/.test(trimmed)) {
      if (currentSection.type !== 'numbered') {
        if (currentSection.content) {
          sections.push({ ...currentSection });
        }
        currentSection = { content: '', type: 'numbered' };
      }
      currentSection.content += (currentSection.content ? '\n' : '') + trimmed.replace(/^\d+\.\s*/, '');
    }
    // Regular text
    else {
      if (currentSection.type !== 'text') {
        if (currentSection.content) {
          sections.push({ ...currentSection });
        }
        currentSection = { content: '', type: 'text' };
      }
      currentSection.content += (currentSection.content ? '\n' : '') + trimmed;
    }
  }

  if (currentSection.content) {
    sections.push({ ...currentSection });
  }

  return { sections };
}

export default function AIResponseBox({
  content,
  title = "AI Analysis",
  isLoading = false,
  error = null,
  onRetry,
  variant = 'default',
  showCopy = true,
  className = ""
}: AIResponseBoxProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    if (!content) return;
    
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "AI response has been copied successfully.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive"
      });
    }
  };

  const variantStyles = {
    default: "border-blue-200 bg-blue-50/50",
    success: "border-green-200 bg-green-50/50",
    warning: "border-amber-200 bg-amber-50/50",
    insight: "border-purple-200 bg-purple-50/50"
  };

  const variantIcons = {
    default: Bot,
    success: CheckCircle,
    warning: AlertTriangle,
    insight: Sparkles
  };

  const Icon = variantIcons[variant];

  if (isLoading) {
    return (
      <Card className={`${variantStyles[variant]} animate-pulse ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="relative">
              <Bot className="w-6 h-6 text-blue-600 animate-bounce" />
              <Sparkles className="w-3 h-3 text-yellow-500 absolute -top-1 -right-1 animate-ping" />
            </div>
            <div className="flex flex-col items-center">
              <p className="text-blue-800 font-medium">AI is analyzing your project...</p>
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

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <div>
                <p className="font-medium text-red-800">AI Analysis Failed</p>
                <p className="text-sm text-red-600 mt-1">
                  {error || "Unable to generate analysis. Please try again."}
                </p>
              </div>
            </div>
            {onRetry && (
              <Button
                onClick={onRetry}
                variant="outline"
                size="sm"
                className="ml-4"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!content) return null;

  const parsedContent = parseAIContent(content);

  return (
    <Card className={`${variantStyles[variant]} transition-all duration-300 ease-in-out ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-lg">{title}</CardTitle>
            <Badge variant="secondary" className="text-xs">
              AI Generated
            </Badge>
          </div>
          {showCopy && (
            <Button
              onClick={handleCopy}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              {copied ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {parsedContent.sections.map((section, index) => (
            <div key={index} className="animate-fade-in">
              {section.heading && (
                <h4 className="font-semibold text-gray-800 mb-2">
                  {section.heading}
                </h4>
              )}
              
              {section.type === 'list' && (
                <ul className="space-y-1 ml-4">
                  {section.content.split('\n').map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-gray-700">{item.trim()}</span>
                    </li>
                  ))}
                </ul>
              )}
              
              {section.type === 'numbered' && (
                <ol className="space-y-1 ml-4">
                  {section.content.split('\n').map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-3">
                      <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                        {itemIndex + 1}
                      </span>
                      <span className="text-gray-700">{item.trim()}</span>
                    </li>
                  ))}
                </ol>
              )}
              
              {section.type === 'text' && (
                <div className="text-gray-700 leading-relaxed">
                  {section.content.split('\n').map((line, lineIndex) => (
                    <p key={lineIndex} className={lineIndex > 0 ? 'mt-2' : ''}>
                      {line.trim()}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
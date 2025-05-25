import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIResultBoxProps {
  title: string;
  content: string;
  isLoading?: boolean;
  error?: string;
  showCopyButton?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export function AIResultBox({
  title,
  content,
  isLoading = false,
  error,
  showCopyButton = true,
  className = "",
  icon
}: AIResultBoxProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <Card className={`border-red-200 bg-red-50 ${className}`}>
        <CardHeader>
          <CardTitle className="text-red-700 flex items-center gap-2">
            {icon || <Sparkles className="w-5 h-5" />}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-blue-200 bg-blue-50 ${className}`}>
      <CardHeader>
        <CardTitle className="text-blue-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon || <Sparkles className="w-5 h-5" />}
            {title}
          </div>
          {showCopyButton && content && !isLoading && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="h-8 w-8 p-0"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-2 text-blue-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Generating AI response...</span>
          </div>
        ) : (
          <div className="text-blue-800 whitespace-pre-wrap">
            {content || "No content available"}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
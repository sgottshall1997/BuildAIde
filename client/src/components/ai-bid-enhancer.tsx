import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Brain, Sparkles, Scale, Copy, Check, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';

interface AIBidEnhancerProps {
  originalText: string;
  section: string;
  onTextImproved?: (improvedText: string) => void;
  className?: string;
}

export default function AIBidEnhancer({ originalText, section, onTextImproved, className }: AIBidEnhancerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [improvedText, setImprovedText] = useState('');
  const [selectedImprovementType, setSelectedImprovementType] = useState<string>('professional');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const improveMutation = useMutation({
    mutationFn: async (improvementType: string) => {
      const response = await fetch('/api/improve-bid-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: originalText,
          section,
          improvementType
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to improve text');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setImprovedText(data.improvedText);
      toast({
        title: "🧠 AI Enhancement Complete!",
        description: `Improved ${section} with professional language`,
      });
    },
    onError: () => {
      toast({
        title: "Enhancement Failed",
        description: "Unable to improve text. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleImprove = (improvementType: string) => {
    setSelectedImprovementType(improvementType);
    improveMutation.mutate(improvementType);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(improvedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "📋 Copied!",
        description: "Improved text copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const handleApply = () => {
    if (onTextImproved) {
      onTextImproved(improvedText);
    }
    setIsOpen(false);
    toast({
      title: "✅ Applied!",
      description: "Enhanced text has been applied to your bid",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`h-8 text-xs ${className}`}
        >
          <Brain className="w-3 h-3 mr-1" />
          Improve with AI
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI Bid Enhancement - {section}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Original Text */}
          <div>
            <h3 className="font-medium text-slate-700 mb-2">Original Text:</h3>
            <div className="p-3 bg-slate-50 rounded-lg border">
              <p className="text-sm text-slate-600">{originalText}</p>
            </div>
          </div>

          {/* Enhancement Options */}
          <div>
            <h3 className="font-medium text-slate-700 mb-3">Choose Enhancement Type:</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedImprovementType === 'professional' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleImprove('professional')}
                disabled={improveMutation.isPending}
                className="flex items-center gap-2"
              >
                {improveMutation.isPending && selectedImprovementType === 'professional' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Brain className="w-4 h-4" />
                )}
                Professional Rewrite
              </Button>
              
              <Button
                variant={selectedImprovementType === 'strengthen' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleImprove('strengthen')}
                disabled={improveMutation.isPending}
                className="flex items-center gap-2"
              >
                {improveMutation.isPending && selectedImprovementType === 'strengthen' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                🧠 Strengthen Value Language
              </Button>
              
              <Button
                variant={selectedImprovementType === 'legal' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleImprove('legal')}
                disabled={improveMutation.isPending}
                className="flex items-center gap-2"
              >
                {improveMutation.isPending && selectedImprovementType === 'legal' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Scale className="w-4 h-4" />
                )}
                ⚖️ Add Legal Disclaimer
              </Button>
            </div>
          </div>

          {/* Improved Text */}
          {improvedText && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-green-700">AI Enhanced Text:</h3>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  {selectedImprovementType === 'professional' ? 'Professional' : 
                   selectedImprovementType === 'strengthen' ? 'Value Enhanced' : 'Legal Protected'}
                </Badge>
              </div>
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <Textarea
                    value={improvedText}
                    onChange={(e) => setImprovedText(e.target.value)}
                    className="min-h-[120px] bg-white border-green-200"
                    placeholder="AI enhanced text will appear here..."
                  />
                </CardContent>
              </Card>
              
              <div className="flex justify-end gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="flex items-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Text'}
                </Button>
                <Button
                  onClick={handleApply}
                  className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Apply Enhancement
                </Button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {improveMutation.isPending && (
            <div className="text-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-purple-600" />
              <p className="text-sm text-slate-600">AI is enhancing your bid text...</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Mail, Copy, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmailDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'estimate' | 'permit';
  data: any;
}

export default function EmailDraftModal({ isOpen, onClose, type, data }: EmailDraftModalProps) {
  const { toast } = useToast();
  const [emailContent, setEmailContent] = useState("");

  const draftEmailMutation = useMutation({
    mutationFn: async ({ type, data }: { type: string; data: any }) => {
      const response = await fetch("/api/draft-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, data }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate email draft");
      }

      return response.json();
    },
    onSuccess: (result) => {
      setEmailContent(result.emailDraft);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate email draft. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenerateDraft = () => {
    draftEmailMutation.mutate({ type, data });
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(emailContent);
      toast({
        title: "Copied!",
        description: "Email draft copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setEmailContent("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            AI Email Draft Generator
            <Badge variant="secondary" className="ml-2">
              {type === 'estimate' ? 'Estimate' : 'Permit Update'}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!emailContent && !draftEmailMutation.isPending && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Generate Professional Email
              </h3>
              <p className="text-slate-600 mb-6">
                Let AI create a professional email draft for your {type === 'estimate' ? 'project estimate' : 'permit update'}.
              </p>
              <Button 
                onClick={handleGenerateDraft}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Email Draft
              </Button>
            </div>
          )}

          {draftEmailMutation.isPending && (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-slate-600">Generating professional email...</p>
            </div>
          )}

          {emailContent && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-slate-900">Generated Email Draft</h4>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleGenerateDraft}
                    disabled={draftEmailMutation.isPending}
                  >
                    Regenerate
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCopyToClipboard}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </div>
              </div>

              <Textarea
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
                placeholder="Email content will appear here..."
              />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> You can edit the email content above before copying. 
                  The AI has generated a professional template that you can customize as needed.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
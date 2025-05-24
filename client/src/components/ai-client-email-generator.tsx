import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Copy, Loader2, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface AIClientEmailGeneratorProps {
  estimateData: any;
  onEmailGenerated?: (email: string) => void;
}

export default function AIClientEmailGenerator({ estimateData, onEmailGenerated }: AIClientEmailGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const generateClientEmail = async () => {
    if (!estimateData) {
      toast({
        title: "Error",
        description: "No estimate data available to generate email.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await apiRequest("POST", "/api/generate-client-email", {
        estimateData: estimateData
      });
      
      const emailContent = response.email || response.content || "Unable to generate email content.";
      setGeneratedEmail(emailContent);
      
      if (onEmailGenerated) {
        onEmailGenerated(emailContent);
      }
      
      toast({
        title: "Email Generated!",
        description: "Professional client email ready to send.",
      });
    } catch (error: any) {
      console.error("Email generation error:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "Unable to generate client email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedEmail);
      setIsCopied(true);
      toast({
        title: "Copied!",
        description: "Email content copied to clipboard.",
      });
      
      // Reset the copied state after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard. Please select and copy manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-blue-600" />
          AI Client Email Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!generatedEmail ? (
          <div className="text-center">
            <p className="text-slate-600 mb-4">
              Generate a professional email to send this estimate to your client.
            </p>
            <Button 
              onClick={generateClientEmail}
              disabled={isGenerating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Email...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Generate Client Email
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Generated Email Content:
              </label>
              <Textarea
                value={generatedEmail}
                onChange={(e) => setGeneratedEmail(e.target.value)}
                className="min-h-[200px] resize-none"
                placeholder="Email content will appear here..."
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={copyToClipboard}
                variant="outline"
                className="flex-1"
              >
                {isCopied ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Email
                  </>
                )}
              </Button>
              
              <Button 
                onClick={generateClientEmail}
                disabled={isGenerating}
                variant="outline"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Regenerate"
                )}
              </Button>
            </div>
            
            <div className="p-3 bg-blue-100 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                💡 You can edit the email content above before copying. The AI generates a professional starting point that you can customize as needed.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
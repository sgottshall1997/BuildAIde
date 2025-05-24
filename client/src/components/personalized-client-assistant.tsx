import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Mail, MessageSquare, Copy, Check, Loader2, Wand2 } from "lucide-react";

interface PersonalizedClientAssistantProps {
  estimateData: any;
  onMessageGenerated?: (message: string, type: string) => void;
}

export default function PersonalizedClientAssistant({ estimateData, onMessageGenerated }: PersonalizedClientAssistantProps) {
  const [clientName, setClientName] = useState("");
  const [projectLocation, setProjectLocation] = useState("");
  const [messageType, setMessageType] = useState<"email" | "text">("email");
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generatePersonalizedMessage = async () => {
    if (!clientName.trim()) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-personalized-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          estimateData,
          clientName: clientName.trim(),
          projectLocation: projectLocation.trim(),
          messageType
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedMessage(data.message);
        onMessageGenerated?.(data.message, messageType);
      } else {
        throw new Error("Failed to generate message");
      }
    } catch (error) {
      console.error("Error generating personalized message:", error);
      // Generate a professional fallback message
      const fallbackMessage = messageType === "email" 
        ? `Hi ${clientName},

Here's your detailed estimate for the ${estimateData.projectType?.toLowerCase()} ${projectLocation ? `in ${projectLocation}` : 'project'}.

Project Summary:
• ${estimateData.area} sq ft with ${estimateData.materialQuality} finishes
• Total estimate: $${estimateData.estimatedCost?.toLocaleString()}
• Timeline: ${estimateData.timeline || 'Standard schedule'}

This estimate includes all labor, materials, and permits based on current market pricing. The breakdown shows materials at $${estimateData.materialCost?.toLocaleString()}, labor at $${estimateData.laborCost?.toLocaleString()}, and other project costs.

I'd be happy to discuss any adjustments to scope, timeline, or materials to better fit your needs and budget.

Best regards,
Spence the Builder Team

Questions? Give us a call - we're here to help bring your vision to life.`
        : `Hi ${clientName}! Your ${estimateData.projectType?.toLowerCase()} estimate is ready. Total: $${estimateData.estimatedCost?.toLocaleString()} for ${estimateData.area} sq ft with ${estimateData.materialQuality} finishes. Includes all materials, labor & permits. Happy to discuss options - call anytime!`;
      
      setGeneratedMessage(fallbackMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <Card className="border-indigo-200 bg-indigo-50/50 dark:bg-indigo-950/30 dark:border-indigo-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Mail className="h-4 w-4 text-white" />
          </div>
          Personalized Client Message
          <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
            AI Generated
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="clientName">Client Name *</Label>
            <Input
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g., Sarah Johnson"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="projectLocation">Project Location (Optional)</Label>
            <Input
              id="projectLocation"
              value={projectLocation}
              onChange={(e) => setProjectLocation(e.target.value)}
              placeholder="e.g., Bethesda, MD"
              className="mt-1"
            />
          </div>
        </div>

        {/* Message Type Selection */}
        <div>
          <Label>Message Type</Label>
          <div className="flex gap-2 mt-1">
            <Button
              variant={messageType === "email" ? "default" : "outline"}
              size="sm"
              onClick={() => setMessageType("email")}
              className="flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Email
            </Button>
            <Button
              variant={messageType === "text" ? "default" : "outline"}
              size="sm"
              onClick={() => setMessageType("text")}
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Text Message
            </Button>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={generatePersonalizedMessage}
          disabled={!clientName.trim() || isGenerating}
          className="w-full bg-indigo-600 hover:bg-indigo-700"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Personalized {messageType === "email" ? "Email" : "Text"}...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Custom {messageType === "email" ? "Email" : "Text"} for {clientName || "Client"}
            </>
          )}
        </Button>

        {/* Generated Message */}
        {generatedMessage && (
          <div className="space-y-3">
            <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-indigo-200 dark:border-indigo-700">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                  Generated {messageType === "email" ? "Email" : "Text Message"}
                </h4>
                <Badge variant="outline" className="text-xs">
                  {messageType === "email" ? "Email Ready" : "SMS Ready"}
                </Badge>
              </div>
              
              {messageType === "email" ? (
                <div className="space-y-2">
                  <div className="text-xs text-slate-500 border-b border-slate-200 pb-2">
                    <strong>To:</strong> {clientName} • <strong>Subject:</strong> Your Construction Estimate - {estimateData.projectType}
                  </div>
                  <pre className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                    {generatedMessage}
                  </pre>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded border-l-4 border-indigo-600">
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {generatedMessage}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
              >
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? "Copied!" : `Copy ${messageType === "email" ? "Email" : "Text"}`}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={generatePersonalizedMessage}
                disabled={isGenerating}
                className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
            </div>

            {/* Usage Tips */}
            <div className="p-3 bg-indigo-100 dark:bg-indigo-950/50 rounded-lg border border-indigo-200 dark:border-indigo-700">
              <p className="text-xs text-indigo-800 dark:text-indigo-300">
                💡 <strong>Pro Tip:</strong> {messageType === "email" 
                  ? "This email is ready to copy into your email client. You can customize it further before sending."
                  : "This text is optimized for SMS length. You can send it directly or use it as a starting point."}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
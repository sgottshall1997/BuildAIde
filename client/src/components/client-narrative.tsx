import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Copy, Check, Mail, Loader2 } from "lucide-react";

interface ClientNarrativeProps {
  estimateData: any;
  pastProjects?: any[];
  onEmailDraft?: () => void;
}

export default function ClientNarrative({ estimateData, pastProjects, onEmailDraft }: ClientNarrativeProps) {
  const [narrative, setNarrative] = useState<string>("");
  const [emailDraft, setEmailDraft] = useState<string>("");
  const [isGeneratingNarrative, setIsGeneratingNarrative] = useState(false);
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showEmailDraft, setShowEmailDraft] = useState(false);

  useEffect(() => {
    if (estimateData && estimateData.estimatedCost) {
      generateNarrative();
    }
  }, [estimateData]);

  const generateNarrative = async () => {
    setIsGeneratingNarrative(true);
    try {
      const response = await fetch("/api/explain-estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(estimateData),
      });
      
      if (response.ok) {
        const data = await response.json();
        setNarrative(data.explanation);
      }
    } catch (error) {
      console.error("Error generating narrative:", error);
      setNarrative(`This proposal includes ${estimateData.projectType?.toLowerCase()} covering ${estimateData.area} sq ft using ${estimateData.materialQuality} finishes. Labor costs reflect the project scope and timeline requirements. The estimate aligns with current market conditions and similar project benchmarks.`);
    } finally {
      setIsGeneratingNarrative(false);
    }
  };

  const generateEmailDraft = async () => {
    setIsGeneratingEmail(true);
    setShowEmailDraft(true);
    try {
      const response = await fetch("/api/draft-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: 'estimate',
          data: estimateData
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setEmailDraft(data.email);
      }
    } catch (error) {
      console.error("Error generating email draft:", error);
      setEmailDraft(`Hi there,

Attached is your detailed construction estimate based on the specifications we discussed for your ${estimateData.projectType?.toLowerCase()}.

Project Summary:
• ${estimateData.area} sq ft with ${estimateData.materialQuality} finishes
• Estimated cost: $${estimateData.estimatedCost?.toLocaleString()}
• Timeline: ${estimateData.timeline || 'Standard schedule'}

This estimate includes all labor, materials, and permits based on current market pricing. We've also included comparisons to similar past projects to ensure accuracy and competitive pricing.

Please review the attached detailed breakdown and let us know if you'd like to discuss any adjustments to scope or timeline.

Best regards,
Spence the Builder Team

Questions? Call us anytime - we're here to help bring your project to life.`);
    } finally {
      setIsGeneratingEmail(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  if (!narrative && !isGeneratingNarrative) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Client-Facing Narrative */}
      <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/30 dark:border-green-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <FileText className="h-4 w-4 text-white" />
            </div>
            Client Proposal Narrative
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
              PDF Ready
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isGeneratingNarrative ? (
            <div className="flex items-center gap-3 p-4">
              <Loader2 className="h-5 w-5 animate-spin text-green-600" />
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Crafting professional proposal narrative...
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-green-200 dark:border-green-700">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {narrative}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(narrative)}
                  className="border-green-300 text-green-700 hover:bg-green-50"
                >
                  {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  {copied ? "Copied!" : "Copy Text"}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateEmailDraft}
                  disabled={isGeneratingEmail}
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  {isGeneratingEmail ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4 mr-2" />
                  )}
                  Draft Client Email
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Auto-Drafted Email */}
      {showEmailDraft && (
        <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/30 dark:border-blue-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Mail className="h-4 w-4 text-white" />
              </div>
              Auto-Drafted Client Email
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                AI Generated
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isGeneratingEmail ? (
              <div className="flex items-center gap-3 p-4">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Drafting professional client email...
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-blue-200 dark:border-blue-700">
                  <pre className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                    {emailDraft}
                  </pre>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(emailDraft)}
                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    Copy Email
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
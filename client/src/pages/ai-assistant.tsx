import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Copy, Send, Bot, FileText, Mail, Download, History, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ChatMessage {
  id: string;
  question: string;
  answer: string;
  timestamp: Date;
}

const predefinedPrompts = [
  {
    icon: "🛠",
    text: "Why is this estimate so high?",
    prompt: "Analyze why a construction estimate might be higher than expected. Consider factors like material costs, labor rates, timeline constraints, site conditions, and market conditions. Provide practical advice on how to communicate value to clients."
  },
  {
    icon: "🧾",
    text: "Write a professional email to a client explaining our pricing",
    prompt: "Write a professional email template to send to a client explaining construction pricing. Include reasons for costs, value proposition, and maintain a confident but understanding tone. Make it suitable for residential or commercial projects."
  },
  {
    icon: "🪚",
    text: "What are the pros and cons of composite vs wood siding?",
    prompt: "Compare composite siding vs wood siding for residential construction. Include cost differences, durability, maintenance requirements, installation considerations, and when to recommend each option to clients."
  },
  {
    icon: "🕒",
    text: "What should I check before a final inspection?",
    prompt: "Create a comprehensive final inspection checklist for construction projects. Include common issues inspectors look for, last-minute items to verify, and tips to ensure projects pass inspection on the first try."
  },
  {
    icon: "🧑‍🔧",
    text: "What permits do I need for a basement renovation in Maryland?",
    prompt: "List the typical permits required for basement renovations in Maryland. Include building permits, electrical permits, plumbing permits, and any special considerations for basement conversions or finishing work."
  },
  {
    icon: "💬",
    text: "Follow up with a client who hasn't replied to an estimate",
    prompt: "Write a professional follow-up email template for clients who haven't responded to a construction estimate. Strike a balance between being persistent and respectful, and include a call to action."
  },
  {
    icon: "🔁",
    text: "Write a change order request for additional demo work",
    prompt: "Create a professional change order template for additional demolition work discovered during a project. Include cost justification, timeline impact, and clear language that protects the contractor while being fair to the client."
  },
  {
    icon: "📋",
    text: "Make a punch list for a bathroom remodel",
    prompt: "Generate a comprehensive punch list template for bathroom remodel projects. Include common items that need final touches, quality checks, and items clients typically notice during final walkthrough."
  }
];

export default function AIAssistant() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const { toast } = useToast();

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    const currentInput = input;
    setInput("");

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: currentInput,
          context: "construction_assistant"
        }),
      });

      const data = await response.json();

      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        question: currentInput,
        answer: data.response,
        timestamp: new Date()
      };

      setChatHistory(prev => [newMessage, ...prev]);

      toast({
        title: "Response Generated",
        description: "SpenceBot has provided your answer!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from AI assistant. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Response copied to clipboard",
    });
  };

  const exportToPDF = (message: ChatMessage) => {
    // This would integrate with your existing PDF export functionality
    toast({
      title: "PDF Export",
      description: "PDF export functionality would be implemented here",
    });
  };

  const emailResponse = (message: ChatMessage) => {
    const subject = `SpenceBot Response: ${message.question.substring(0, 50)}...`;
    const body = `Question: ${message.question}\n\nAnswer: ${message.answer}`;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Bot className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-slate-900">Ask SpenceBot</h1>
        </div>
        <p className="text-slate-600 text-lg">
          Your 24/7 construction assistant for estimates, permits, client communication, and project advice
        </p>
      </div>

      {/* Pre-written Prompt Buttons */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Quick Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {predefinedPrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                className="text-left justify-start h-auto p-4 whitespace-normal"
                onClick={() => handlePromptClick(prompt.prompt)}
              >
                <span className="mr-2 text-lg">{prompt.icon}</span>
                <span className="text-sm">{prompt.text}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Input Interface */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Ask Your Question</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about a project, client email, permit, cost, timeline, or any construction question..."
            className="min-h-[120px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                handleSubmit();
              }
            }}
          />
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-500">
              Tip: Use Ctrl+Enter to submit quickly
            </p>
            <Button 
              onClick={handleSubmit} 
              disabled={!input.trim() || isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Thinking...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Ask SpenceBot
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Chat History Toggle */}
      {chatHistory.length > 0 && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Conversations</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
          >
            <History className="h-4 w-4 mr-2" />
            {showHistory ? 'Hide' : 'Show'} History ({chatHistory.length})
          </Button>
        </div>
      )}

      {/* Chat History */}
      {showHistory && chatHistory.length > 0 && (
        <div className="space-y-4 mb-6">
          {chatHistory.map((message) => (
            <Card key={message.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                {/* Question */}
                <div className="mb-4">
                  <Badge variant="secondary" className="mb-2">Question</Badge>
                  <p className="text-slate-700 font-medium">{message.question}</p>
                </div>

                <Separator className="my-4" />

                {/* Answer */}
                <div className="mb-4">
                  <Badge variant="default" className="mb-2">SpenceBot Answer</Badge>
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {message.answer}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(message.answer)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => emailResponse(message)}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportToPDF(message)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                  <div className="ml-auto text-sm text-slate-500">
                    {message.timestamp.toLocaleString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {chatHistory.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Bot className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              Ready to Help!
            </h3>
            <p className="text-slate-500 mb-4">
              Click a quick question above or type your own construction question to get started.
            </p>
            <Badge variant="outline">
              Powered by GPT-4 for construction expertise
            </Badge>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
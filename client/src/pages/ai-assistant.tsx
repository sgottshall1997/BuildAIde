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
    icon: "📄",
    text: "Add payment clause to contract",
    prompt: "Write a professional payment clause for construction contracts that protects the contractor while being fair to clients. Include progress payment schedule, terms, and late payment policies."
  },
  {
    icon: "⏳",
    text: "Client delay response template",
    prompt: "Create a professional email template to send to clients when project delays are caused by client decisions or approvals. Maintain professionalism while clearly communicating timeline impacts."
  },
  {
    icon: "📐",
    text: "Ideal profit margin for kitchen remodel?",
    prompt: "What's the ideal profit margin for kitchen remodeling projects? Consider material costs, labor complexity, project timeline, and market positioning for residential contractors."
  },
  {
    icon: "🛠",
    text: "Why is this estimate so high?",
    prompt: "Analyze why a construction estimate might be higher than expected. Consider factors like material costs, labor rates, timeline constraints, site conditions, and market conditions. Provide practical advice on how to communicate value to clients."
  },
  {
    icon: "💬",
    text: "Follow up with a client who hasn't replied to an estimate",
    prompt: "Write a professional follow-up email template for clients who haven't responded to a construction estimate. Strike a balance between being persistent and respectful, and include a call to action."
  },
  {
    icon: "🧑‍🔧",
    text: "What permits do I need for a basement renovation in Maryland?",
    prompt: "List the typical permits required for basement renovations in Maryland. Include building permits, electrical permits, plumbing permits, and any special considerations for basement conversions or finishing work."
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
  const [showHistory, setShowHistory] = useState(true);
  const { toast } = useToast();

  const handlePromptClick = async (prompt: string) => {
    if (isLoading) return;
    
    // Set the input and immediately submit it
    setInput(prompt);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: prompt,
          context: "construction_assistant"
        }),
      });

      const data = await response.json();

      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        question: prompt,
        answer: data.response,
        timestamp: new Date()
      };

      setChatHistory(prev => [newMessage, ...prev]);

      // Auto-scroll to bottom of chat
      setTimeout(() => {
        const chatContainer = document.querySelector('.max-h-96.overflow-y-auto');
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 100);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from AI assistant. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setInput("");
    }
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

      // Auto-scroll to bottom of chat
      setTimeout(() => {
        const chatContainer = document.querySelector('.max-h-96.overflow-y-auto');
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 100);
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
    const subject = `Spence the Builder Response: ${message.question.substring(0, 50)}...`;
    const body = `Question: ${message.question}\n\nAnswer: ${message.answer}`;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 sm:mb-3 px-2">🤖 Construction AI Assistant</h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto px-4">
          Get instant expert advice on pricing, permits, materials, and project guidance from your AI construction specialist.
        </p>
      </div>

      {/* Quick Suggestion Chips */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-orange-500" />
            Quick Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              "🏗 How do I handle permit delays?",
              "📅 How should I schedule subcontractors?", 
              "💰 Ways to cut material costs",
              "📋 What's a fair markup for my work?",
              "⚠️ Common construction red flags?",
              "📧 How to follow up with clients?"
            ].map((suggestion, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                className="text-sm h-auto py-2 px-3 hover:bg-blue-50 hover:border-blue-300"
                onClick={() => setInput(suggestion.substring(2))} // Remove emoji
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Live Chat Interface */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
            Chat with Virtual Assistant
            <Badge variant="secondary" className="text-xs">Powered by GPT-4</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Chat Messages */}
          <div className="max-h-96 overflow-y-auto space-y-3 p-4 bg-gray-50 rounded-lg border">
            {chatHistory.length === 0 && (
              <div className="text-center py-8">
                <Bot className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  👋 Hi! I'm your Virtual Construction Assistant
                </h3>
                <p className="text-slate-600 mb-3">
                  Ask me anything about construction, estimates, permits, or project management!
                </p>
                <Badge variant="outline" className="text-xs text-blue-600 border-blue-300">
                  🧠 Powered by GPT-4 AI
                </Badge>
              </div>
            )}
            {chatHistory.slice().reverse().map((message) => (
              <div key={message.id} className="space-y-3">
                {/* User Question */}
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white p-3 rounded-lg max-w-xs">
                    <p className="text-sm">{message.question}</p>
                  </div>
                </div>
                {/* AI Response */}
                <div className="flex justify-start">
                  <div className="bg-white border p-3 rounded-lg max-w-md">
                    <div className="flex items-center gap-2 mb-1">
                      <Bot className="h-4 w-4 text-blue-600" />
                      <span className="text-xs font-medium text-blue-600">Virtual Assistant</span>
                    </div>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{message.answer}</p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-blue-600 animate-pulse" />
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-slate-600">🤖 AI is thinking</span>
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a project, client email, permit, cost, timeline, or any construction question..."
              className="flex-1 min-h-[60px]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  handleSubmit();
                }
              }}
            />
            <Button 
              onClick={handleSubmit} 
              disabled={!input.trim() || isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-slate-500 text-center">
            Tip: Use Ctrl+Enter to submit quickly
          </p>
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
            <Card key={message.id} id={`message-${message.id}`} className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                {/* Question */}
                <div className="mb-4">
                  <Badge variant="secondary" className="mb-2">Question</Badge>
                  <p className="text-slate-700 font-medium">{message.question}</p>
                </div>

                <Separator className="my-4" />

                {/* Answer */}
                <div className="mb-4">
                  <Badge variant="default" className="mb-2">Spence the Builder Answer</Badge>
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
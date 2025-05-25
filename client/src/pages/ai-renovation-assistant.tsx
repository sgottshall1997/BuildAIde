import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send, Copy, Bot, User, Lightbulb, Clock, DollarSign, FileText, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { ModeSwitcher } from "@/components/mode-toggle";

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIRenovationAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const suggestedQuestions = [
    {
      category: "Budget",
      icon: DollarSign,
      color: "green",
      questions: [
        "How much should I budget for unexpected costs?",
        "What's the cheapest way to update my kitchen?",
        "How do I finance a major renovation?",
        "What renovations give the best ROI?"
      ]
    },
    {
      category: "Timeline",
      icon: Clock,
      color: "blue",
      questions: [
        "How long does a typical bathroom remodel take?",
        "What's the best time of year to renovate?",
        "How can I minimize disruption during renovation?",
        "What happens if my project runs over schedule?"
      ]
    },
    {
      category: "Permits",
      icon: FileText,
      color: "purple",
      questions: [
        "Do I need permits for my kitchen remodel?",
        "How do I apply for renovation permits?",
        "What happens if I renovate without permits?",
        "How long do permits take to approve?"
      ]
    },
    {
      category: "Problems",
      icon: AlertCircle,
      color: "red",
      questions: [
        "How do I deal with a difficult contractor?",
        "What if I find asbestos during demolition?",
        "My renovation is over budget - what now?",
        "How do I handle change orders?"
      ]
    }
  ];

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai-renovation-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          chatHistory: messages
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error("Failed to get AI response");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Chat Error",
        description: "I couldn't process your question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Response copied to clipboard.",
    });
  };

  const getCategoryColor = (color: string) => {
    switch (color) {
      case "green": return "bg-green-50 border-green-200 text-green-800";
      case "blue": return "bg-blue-50 border-blue-200 text-blue-800";
      case "purple": return "bg-purple-50 border-purple-200 text-purple-800";
      case "red": return "bg-red-50 border-red-200 text-red-800";
      default: return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/consumer-dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">AI Renovation Assistant</h1>
              <p className="text-slate-600">Get expert answers to your renovation questions</p>
            </div>
          </div>
          <ModeSwitcher currentMode="consumer" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-6 h-6 text-blue-600" />
                  Chat with Your Renovation Expert
                </CardTitle>
              </CardHeader>
              
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <Bot className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">
                      Hi! I'm your renovation assistant
                    </h3>
                    <p className="text-slate-500 mb-4">
                      Ask me anything about permits, budgets, timelines, materials, or contractors.
                    </p>
                    <p className="text-sm text-slate-400">
                      Choose a suggested question or type your own below
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.type === 'assistant' && (
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Bot className="w-5 h-5 text-blue-600" />
                          </div>
                        )}
                        
                        <div className={`max-w-[80%] rounded-lg p-4 ${
                          message.type === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white border border-slate-200'
                        }`}>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.content}
                          </p>
                          {message.type === 'assistant' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(message.content)}
                              className="mt-2 h-6 text-xs opacity-70 hover:opacity-100"
                            >
                              <Copy className="w-3 h-3 mr-1" />
                              Copy
                            </Button>
                          )}
                        </div>
                        
                        {message.type === 'user' && (
                          <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-slate-600" />
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {isLoading && (
                      <div className="flex gap-3 justify-start">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="bg-white border border-slate-200 rounded-lg p-4">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>
              
              {/* Input */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask about permits, budgets, timelines, or anything else..."
                    className="flex-1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage(inputMessage);
                      }
                    }}
                    disabled={isLoading}
                  />
                  <Button 
                    onClick={() => sendMessage(inputMessage)}
                    disabled={isLoading || !inputMessage.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Suggested Questions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  Popular Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {suggestedQuestions.map((category) => {
                  const Icon = category.icon;
                  return (
                    <div key={category.category}>
                      <div className={`flex items-center gap-2 mb-3 p-2 rounded-lg ${getCategoryColor(category.color)}`}>
                        <Icon className="w-4 h-4" />
                        <span className="font-medium text-sm">{category.category}</span>
                      </div>
                      <div className="space-y-2 ml-2">
                        {category.questions.map((question, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSuggestedQuestion(question)}
                            className="w-full text-left justify-start text-xs h-auto p-2 hover:bg-slate-100"
                            disabled={isLoading}
                          >
                            {question}
                          </Button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/estimate-wizard">
                  <Button variant="outline" className="w-full">
                    Get Cost Estimate
                  </Button>
                </Link>
                <Link href="/renovation-checklist">
                  <Button variant="outline" className="w-full">
                    View Checklist
                  </Button>
                </Link>
                <Link href="/quote-compare">
                  <Button variant="outline" className="w-full">
                    Compare Quotes
                  </Button>
                </Link>
                <Link href="/project-timeline">
                  <Button variant="outline" className="w-full">
                    See Timeline
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
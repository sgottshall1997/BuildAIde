import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import FeedbackButton from "@/components/feedback-button";
import { useLocation } from "wouter";
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  Home,
  DollarSign,
  Calendar,
  FileText,
  CheckCircle,
  Clock
} from "lucide-react";

export default function HomeownerChat() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Array<{id: string, type: 'user' | 'assistant', content: string, loadTime?: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [, navigate] = useLocation();

  // Convert phrases to smart links
  const linkifyAIResponse = (text: string) => {
    let linkedText = text.replace(/search your local city site/i, '<a href="https://www.google.com/search?q=city+permit+office" target="_blank" class="text-blue-600 underline">search your local city site</a>');
    linkedText = linkedText.replace(/permit office/i, '<a href="https://www.google.com/search?q=local+permit+office" target="_blank" class="text-blue-600 underline">permit office</a>');
    return linkedText;
  };

  const starterPrompts = [
    "🛠 What renovation yields the best ROI?",
    "🧽 DIY tip for removing tile?", 
    "🔧 How to choose a general contractor?",
    "💰 Typical cost for kitchen remodel?",
    "📋 Do I need permits for bathroom work?",
    "⏰ How long does flooring take?"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    const userMessage = { id: Date.now().toString(), type: 'user' as const, content: question };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/homeowner-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.trim() })
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage = { 
          id: (Date.now() + 1).toString(), 
          type: 'assistant' as const, 
          content: data.response 
        };
        setMessages(prev => [...prev, aiMessage]);
        
        // Easter egg: Check if AI mentions Permit Tool
        if (data.response.includes("permit") || data.response.includes("Permit")) {
          setTimeout(() => {
            const toolSuggestion = { 
              id: (Date.now() + 2).toString(), 
              type: 'assistant' as const, 
              content: "💡 Want me to open the Permit Research Tool? It can help you find specific permit requirements for your city!" 
            };
            setMessages(prev => [...prev, toolSuggestion]);
          }, 2000);
        }
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      const errorMessage = { 
        id: (Date.now() + 1).toString(), 
        type: 'assistant' as const, 
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later or contact support if the issue persists." 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setQuestion("");
    }
  };

  const handleExampleClick = (prompt: string) => {
    setQuestion(prompt);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            🏠 Home Renovation Assistant
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Get instant answers to all your renovation questions. From permits to best practices, ask anything!
          </p>
          
          {/* AI Beta Disclaimer */}
          <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg inline-block">
            <p className="text-sm text-amber-700 italic">
              ⚡ AI beta - responses may vary. For complex projects, consider consulting a professional.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* First-time Greeting & Starter Prompts */}
          {messages.length === 0 && (
            <Card className="mb-6 shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Sparkles className="w-5 h-5 text-green-600" />
                  Welcome! Let's get started
                </CardTitle>
                <div className="text-slate-600 mb-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  👋 Hi! I'm your home renovation assistant. Ask me anything — from budgeting tips to finding the right contractor.
                </div>
                <CardDescription>
                  Click any example below or type your own question
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap mb-4">
                  {starterPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleExampleClick(prompt)}
                      className="text-sm px-3 py-2 rounded-lg border border-green-300 hover:bg-green-50 transition-colors text-green-700 hover:text-green-800"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Chat Messages */}
          {messages.length > 0 && (
            <Card className="mb-6 shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                  Conversation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.type === 'user' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-slate-100 text-slate-900'
                    }`}>
                      {message.type === 'assistant' ? (
                        <div 
                          className="text-sm whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{ __html: linkifyAIResponse(message.content) }}
                        />
                      ) : (
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      )}
                      
                      {/* Easter egg: Permit Tool button */}
                      {message.content.includes("Want me to open the Permit Research Tool?") && (
                        <Button
                          onClick={() => navigate("/permit-research")}
                          size="sm"
                          className="mt-3 bg-blue-600 hover:bg-blue-700 text-white w-full"
                        >
                          Open Permit Research Tool
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 text-slate-900 px-4 py-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Chat Input */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask a question, e.g. 'How do I remodel a small bathroom?'"
                  className="min-h-[100px] resize-none"
                  disabled={isLoading}
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">
                    {question.length}/500 characters
                  </span>
                  <Button 
                    type="submit" 
                    disabled={!question.trim() || isLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Thinking...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Ask Question
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Features Overview */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <Card className="text-center p-6 bg-white/60 backdrop-blur">
              <Home className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 mb-2">Project Planning</h3>
              <p className="text-sm text-slate-600">Get advice on renovation scope, timelines, and priorities</p>
            </Card>
            <Card className="text-center p-6 bg-white/60 backdrop-blur">
              <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 mb-2">Cost Guidance</h3>
              <p className="text-sm text-slate-600">Understand typical costs and budgeting strategies</p>
            </Card>
            <Card className="text-center p-6 bg-white/60 backdrop-blur">
              <FileText className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 mb-2">Permits & Codes</h3>
              <p className="text-sm text-slate-600">Learn about permit requirements and building codes</p>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Feedback Button */}
      <FeedbackButton toolName="Homeowner Chat Assistant" />
    </div>
  );
}
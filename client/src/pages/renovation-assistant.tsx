import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Bot, 
  Send, 
  Lightbulb, 
  MessageCircle, 
  Sparkles,
  Clock,
  DollarSign,
  Home,
  Wrench
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFreemium } from "@/hooks/use-freemium";

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function RenovationAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your AI renovation assistant. I can help you with project planning, budgeting, material selection, and answer any construction questions you have. What would you like to know?",
      timestamp: new Date().toISOString()
    }
  ]);
  
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { trackToolUsage, showSignupModal, handleEmailSubmitted, closeSignupModal } = useFreemium();
  const { toast } = useToast();

  const suggestedQuestions = [
    {
      icon: DollarSign,
      text: "What's a good budget for a bathroom remodel?",
      category: "Budget"
    },
    {
      icon: Clock,
      text: "How long does a kitchen renovation typically take?",
      category: "Timeline"
    },
    {
      icon: Home,
      text: "Should I renovate before selling my house?",
      category: "ROI"
    },
    {
      icon: Wrench,
      text: "What permits do I need for a home addition?",
      category: "Permits"
    },
    {
      icon: Lightbulb,
      text: "How can I increase my home's value on a budget?",
      category: "Value"
    },
    {
      icon: Sparkles,
      text: "What are the latest home design trends?",
      category: "Design"
    }
  ];

  const sendMessage = async (messageText?: string) => {
    const inputText = messageText || userInput.trim();
    
    if (!inputText) return;

    if (!trackToolUsage('renovation-assistant')) {
      return; // Will show signup modal
    }

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setUserInput("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/renovation-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: inputText,
          chatHistory: messages 
        })
      });

      const data = await response.json();

      if (response.ok) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: data.response,
          timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      toast({
        title: "Assistant Error",
        description: "Unable to get response. Please try again.",
        variant: "destructive"
      });
      
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I'm having trouble responding right now. Please try asking your question again.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        type: 'assistant',
        content: "Hi! I'm your AI renovation assistant. I can help you with project planning, budgeting, material selection, and answer any construction questions you have. What would you like to know?",
        timestamp: new Date().toISOString()
      }
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-3 flex items-center justify-center gap-2">
          <Bot className="w-8 h-8 text-blue-600" />
          Renovation Assistant (AI)
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Get expert renovation advice, project guidance, and answers to all your construction questions from our AI assistant.
        </p>
      </div>

      {/* Suggested Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Popular Questions
          </CardTitle>
          <CardDescription>Click any question to get started, or ask your own below</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {suggestedQuestions.map((question, index) => {
              const Icon = question.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start gap-2 hover:bg-blue-50 hover:border-blue-200 text-left"
                  onClick={() => sendMessage(question.text)}
                  disabled={isLoading}
                >
                  <div className="flex items-center gap-2 w-full">
                    <Icon className="w-4 h-4 text-blue-600" />
                    <Badge variant="secondary" className="text-xs">
                      {question.category}
                    </Badge>
                  </div>
                  <span className="text-sm">{question.text}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <CardTitle>Chat with Assistant</CardTitle>
            </div>
            <Button variant="outline" size="sm" onClick={clearChat}>
              Clear Chat
            </Button>
          </div>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-900'
                }`}
              >
                {message.type === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="w-4 h-4" />
                    <span className="text-xs font-medium">AI Assistant</span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-70 mt-2">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 rounded-lg p-3 max-w-[80%]">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-4 h-4" />
                  <span className="text-xs font-medium">AI Assistant</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-slate-600">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Textarea
              placeholder="Ask me anything about your renovation project..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1 min-h-[60px] resize-none"
              rows={2}
            />
            <Button
              onClick={() => sendMessage()}
              disabled={!userInput.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </Card>

      {/* Features Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Lightbulb className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <h3 className="font-medium mb-1">Expert Advice</h3>
            <p className="text-sm text-slate-600">Get professional renovation guidance and best practices</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-medium mb-1">Budget Planning</h3>
            <p className="text-sm text-slate-600">Smart budgeting tips and cost-saving strategies</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-medium mb-1">Project Planning</h3>
            <p className="text-sm text-slate-600">Timeline guidance and project sequencing advice</p>
          </CardContent>
        </Card>
      </div>

      {/* Email Signup Modal */}
      {showSignupModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Unlock AI Assistant</h3>
            <p className="text-slate-600 mb-4">
              Get unlimited access to our AI renovation assistant and all expert advice.
            </p>
            <div className="flex gap-2">
              <Button onClick={closeSignupModal} variant="outline" className="flex-1">
                Maybe Later
              </Button>
              <Button onClick={() => handleEmailSubmitted("user@example.com")} className="flex-1">
                Continue Free
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
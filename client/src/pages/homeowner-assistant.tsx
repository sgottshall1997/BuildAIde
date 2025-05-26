import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  Home,
  DollarSign,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function HomeownerAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your AI renovation assistant. I can help you with project planning, budgeting, timeline questions, contractor advice, and more. What would you like to know about your home project?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const suggestedQuestions = [
    "How much should I budget for a kitchen renovation?",
    "What permits do I need for a bathroom remodel?",
    "How long does a typical flooring project take?",
    "Should I hire a contractor or DIY my deck?",
    "What's the ROI on different home improvements?"
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "Thanks for your question! This is a demo version of our AI assistant. In the full version, I'll provide detailed, personalized advice for your specific renovation needs including cost estimates, timeline planning, and contractor recommendations.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputMessage(question);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MessageSquare className="w-8 h-8 text-green-600" />
            <h1 className="text-4xl font-bold text-slate-900">Ask Your AI Assistant</h1>
          </div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Get instant answers to your renovation questions from our AI expert
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Chat Interface */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur mb-6">
            <CardHeader className="border-b bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                AI Renovation Expert
              </CardTitle>
              <CardDescription className="text-green-100">
                Ask anything about your home improvement project
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {/* Messages */}
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-green-600 text-white'
                          : 'bg-slate-100 text-slate-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.type === 'user' ? 'text-green-100' : 'text-slate-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 text-slate-900 px-4 py-2 rounded-lg">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your renovation question..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Suggested Questions */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Popular Questions</CardTitle>
              <CardDescription>Click on any question to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="text-left h-auto p-3 justify-start hover:bg-green-50 hover:border-green-300"
                    onClick={() => handleSuggestedQuestion(question)}
                  >
                    <MessageSquare className="w-4 h-4 mr-2 text-green-600 flex-shrink-0" />
                    <span className="text-sm">{question}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {[
              {
                icon: DollarSign,
                title: "Budget Planning",
                description: "Get cost estimates and budget breakdowns",
                color: "text-green-600"
              },
              {
                icon: Calendar,
                title: "Timeline Help",
                description: "Understand project schedules and phases",
                color: "text-blue-600"
              },
              {
                icon: Home,
                title: "Design Ideas",
                description: "Explore styles, materials, and layouts",
                color: "text-purple-600"
              }
            ].map((feature, index) => (
              <Card key={index} className="shadow-md border-0 bg-white/70 backdrop-blur">
                <CardContent className="p-4 text-center">
                  <feature.icon className={`w-8 h-8 mx-auto mb-2 ${feature.color}`} />
                  <h4 className="font-semibold text-slate-900 mb-1">{feature.title}</h4>
                  <p className="text-xs text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Coming Soon Notice */}
          <Card className="shadow-lg border-0 bg-gradient-to-r from-green-600 to-teal-600 text-white">
            <CardContent className="py-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Clock className="w-5 h-5" />
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  Demo Mode
                </Badge>
              </div>
              <h3 className="text-xl font-bold mb-2">Full AI Assistant Coming Soon</h3>
              <p className="text-green-100 text-sm">
                Experience the demo now, and get early access to our full AI-powered renovation assistant!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
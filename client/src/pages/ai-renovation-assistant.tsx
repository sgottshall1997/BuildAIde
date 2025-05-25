import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Bot, 
  Send, 
  Home, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Lightbulb,
  MessageCircle,
  Star,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Calculator,
  FileSearch,
  Shield
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  suggestions?: string[];
}

export default function AIRenovationAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your renovation assistant. I can help you with project planning, cost estimates, ROI analysis, permit requirements, and much more. What would you like to know about your renovation?",
      sender: 'ai',
      timestamp: new Date(),
      suggestions: [
        "What's the best ROI remodel for my home?",
        "How much should I budget for a kitchen renovation?",
        "What permits do I need for a bathroom remodel?",
        "How long does a typical renovation take?"
      ]
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    {
      category: "ROI & Value",
      icon: <TrendingUp className="w-5 h-5" />,
      questions: [
        "Which renovations add the most home value?",
        "What's the ROI on kitchen vs bathroom remodels?",
        "Should I renovate before selling my home?"
      ]
    },
    {
      category: "Budgeting",
      icon: <DollarSign className="w-5 h-5" />,
      questions: [
        "How much should I budget for unexpected costs?",
        "What's the average cost of a kitchen remodel?",
        "How can I save money on my renovation?"
      ]
    },
    {
      category: "Planning",
      icon: <Clock className="w-5 h-5" />,
      questions: [
        "What's the best time of year to renovate?",
        "How long does a typical bathroom renovation take?",
        "What should I do first in a whole-house remodel?"
      ]
    },
    {
      category: "Permits & Legal",
      icon: <Shield className="w-5 h-5" />,
      questions: [
        "Do I need permits for my renovation?",
        "What happens if I renovate without permits?",
        "How do I find my local building codes?"
      ]
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(text.trim());
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userQuestion: string): Message => {
    const lowerQ = userQuestion.toLowerCase();
    
    let response = "";
    let suggestions: string[] = [];

    if (lowerQ.includes('roi') || lowerQ.includes('return') || lowerQ.includes('value')) {
      response = "Great question about ROI! Here's what typically adds the most value:\n\n🏠 **Kitchen Remodels**: 60-80% ROI, especially mid-range updates\n🛁 **Bathroom Renovations**: 60-70% ROI, focus on fixtures and tile\n🚪 **Front Door Replacement**: 75-80% ROI, huge curb appeal impact\n🎨 **Fresh Paint**: 100%+ ROI, most cost-effective update\n\nFor your specific situation, I'd recommend starting with a kitchen estimate to see exact numbers for your area.";
      suggestions = [
        "Get a kitchen renovation estimate",
        "Compare bathroom vs kitchen ROI",
        "What about exterior renovations?"
      ];
    } else if (lowerQ.includes('kitchen') && (lowerQ.includes('cost') || lowerQ.includes('budget'))) {
      response = "Kitchen renovation costs vary significantly based on scope and finishes:\n\n💡 **Minor Updates**: $10,000-$25,000\n- Paint, hardware, countertops\n- Keep existing layout\n\n🎯 **Mid-Range Remodel**: $25,000-$50,000\n- New cabinets, appliances, flooring\n- Minor layout changes\n\n⭐ **High-End Renovation**: $50,000-$100,000+\n- Custom cabinets, premium appliances\n- Major layout changes, structural work\n\n**Pro tip**: Always budget 15-20% extra for unexpected costs!";
      suggestions = [
        "Get a detailed kitchen estimate",
        "What's included in a mid-range remodel?",
        "How to save money on kitchen renovation?"
      ];
    } else if (lowerQ.includes('permit') || lowerQ.includes('legal')) {
      response = "Permits are crucial for safe, legal renovations! Here's when you typically need them:\n\n✅ **Always Need Permits**:\n- Electrical work\n- Plumbing changes\n- Structural modifications\n- HVAC installations\n\n❓ **Sometimes Need Permits**:\n- Kitchen remodels (depends on scope)\n- Bathroom renovations\n- Deck construction\n\n🚫 **Usually No Permits**:\n- Painting\n- Flooring replacement\n- Cabinet refacing\n\n**Next step**: Check with your local building department or use our permit research tool!";
      suggestions = [
        "Research permits for my specific project",
        "What happens without permits?",
        "How much do permits cost?"
      ];
    } else if (lowerQ.includes('timeline') || lowerQ.includes('long') || lowerQ.includes('time')) {
      response = "Great planning question! Here are typical renovation timelines:\n\n⚡ **Quick Projects** (1-4 weeks):\n- Painting, flooring, fixtures\n- Cabinet refacing\n\n🎯 **Medium Projects** (4-12 weeks):\n- Kitchen remodel\n- Bathroom renovation\n- Basement finishing\n\n🏗️ **Major Projects** (3-12 months):\n- Whole house renovation\n- Room additions\n- Structural changes\n\n**Pro tip**: Add 25-50% buffer time for unexpected delays - they're more common than you think!";
      suggestions = [
        "Create a timeline for my project",
        "How to minimize renovation delays?",
        "Best time of year to renovate?"
      ];
    } else if (lowerQ.includes('contractor') || lowerQ.includes('hire')) {
      response = "Finding the right contractor is crucial! Here's how to hire smart:\n\n🔍 **Research Process**:\n- Get 3-5 quotes minimum\n- Check licenses and insurance\n- Read recent reviews\n- Ask for local references\n\n💰 **Red Flags to Avoid**:\n- Door-to-door sales\n- Quotes significantly higher/lower than others\n- No written contract\n- Demands full payment upfront\n\n✅ **Green Flags**:\n- Detailed written estimates\n- Local references\n- Proper licensing\n- Professional communication\n\nWant help comparing contractor quotes?";
      suggestions = [
        "Compare contractor quotes",
        "What questions to ask contractors?",
        "How to check contractor licenses?"
      ];
    } else {
      response = "I'd be happy to help with that! Based on your question, here are some key insights:\n\n🏠 **General Renovation Tips**:\n- Always plan for 15-20% cost overruns\n- Get multiple quotes from licensed contractors\n- Consider ROI when choosing projects\n- Factor in timeline disruptions to your daily life\n\n💡 **Smart Next Steps**:\n- Get detailed cost estimates for your specific project\n- Research local permit requirements\n- Create a realistic timeline\n- Build a contingency fund\n\nWhat specific aspect would you like to dive deeper into?";
      suggestions = [
        "Get cost estimates for my project",
        "Research permit requirements",
        "Find qualified contractors"
      ];
    }

    return {
      id: Date.now().toString(),
      text: response,
      sender: 'ai',
      timestamp: new Date(),
      suggestions
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleQuickQuestionClick = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-3">AI Renovation Assistant</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Get expert renovation advice, cost insights, and project guidance powered by AI
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Link href="/smart-project-estimator">
              <Card className="hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-200 cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Calculator className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-slate-900">Get Estimate</h3>
                  <p className="text-sm text-slate-600 mt-1">Calculate project costs</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/quote-compare">
              <Card className="hover:shadow-lg transition-all duration-200 border-2 hover:border-green-200 cursor-pointer">
                <CardContent className="p-4 text-center">
                  <FileSearch className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-slate-900">Compare Quotes</h3>
                  <p className="text-sm text-slate-600 mt-1">Find best contractors</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/permit-research">
              <Card className="hover:shadow-lg transition-all duration-200 border-2 hover:border-purple-200 cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-slate-900">Check Permits</h3>
                  <p className="text-sm text-slate-600 mt-1">Research requirements</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/renovation-concierge">
              <Card className="hover:shadow-lg transition-all duration-200 border-2 hover:border-orange-200 cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Lightbulb className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-slate-900">Get Guidance</h3>
                  <p className="text-sm text-slate-600 mt-1">Personalized planning</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Questions Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  Popular Questions
                </CardTitle>
                <CardDescription>Click any question to ask it</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {quickQuestions.map((category, idx) => (
                  <div key={idx}>
                    <div className="flex items-center gap-2 mb-2">
                      {category.icon}
                      <h4 className="font-semibold text-slate-900">{category.category}</h4>
                    </div>
                    <div className="space-y-2">
                      {category.questions.map((question, questionIdx) => (
                        <button
                          key={questionIdx}
                          onClick={() => handleQuickQuestionClick(question)}
                          className="w-full text-left p-3 text-sm bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors duration-200 border border-slate-200 hover:border-slate-300"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Chat with AI Expert
                </CardTitle>
                <CardDescription>
                  Ask me anything about renovations, costs, timelines, permits, and more!
                </CardDescription>
              </CardHeader>
              
              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                      {message.sender === 'ai' && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Bot className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium text-slate-700">AI Assistant</span>
                        </div>
                      )}
                      
                      <div className={`p-4 rounded-lg ${
                        message.sender === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-slate-100 text-slate-900'
                      }`}>
                        <div className="whitespace-pre-line">{message.text}</div>
                      </div>
                      
                      <div className="text-xs text-slate-500 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </div>

                      {/* AI Suggestions */}
                      {message.sender === 'ai' && message.suggestions && message.suggestions.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <p className="text-sm text-slate-600">Try asking:</p>
                          <div className="space-y-1">
                            {message.suggestions.map((suggestion, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="block w-full text-left p-2 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-blue-300 transition-all duration-200"
                              >
                                <div className="flex items-center gap-2">
                                  <Sparkles className="w-3 h-3 text-blue-500" />
                                  <span>{suggestion}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%]">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">AI Assistant</span>
                      </div>
                      <div className="p-4 rounded-lg bg-slate-100">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </CardContent>

              {/* Input */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ask about renovation costs, timelines, permits, ROI..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => handleSendMessage(inputText)}
                    disabled={!inputText.trim() || isTyping}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Expert Tips */}
        <Card className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Star className="w-6 h-6" />
              Pro Tips for Smart Renovations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-green-800 mb-3">💰 Budget Smart</h4>
                <ul className="space-y-2 text-sm text-green-700">
                  <li>• Always budget 15-20% extra for surprises</li>
                  <li>• Get 3-5 contractor quotes before deciding</li>
                  <li>• Consider doing demo work yourself to save</li>
                  <li>• Time renovations for off-peak contractor seasons</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-green-800 mb-3">🏠 Maximize ROI</h4>
                <ul className="space-y-2 text-sm text-green-700">
                  <li>• Kitchen and bathroom remodels offer best returns</li>
                  <li>• Focus on finishes over major layout changes</li>
                  <li>• Fresh paint and new fixtures go a long way</li>
                  <li>• Don't over-improve for your neighborhood</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
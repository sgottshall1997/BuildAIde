import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send } from "lucide-react";

interface ContinueConversationProps {
  originalRequest?: string;
}

export default function ContinueConversation({ originalRequest = "Interior waterproofing and block wall repairs with steel column installation" }: ContinueConversationProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{id: string, text: string, sender: 'user' | 'ai'}>>([]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user' as const
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessage("");
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your question! I can help you understand the cost breakdown and explore optimization opportunities.",
        sender: 'ai' as const
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const quickQuestions = [
    "Why are materials so expensive?",
    "How can I reduce labor costs?", 
    "What if I change the timeline?",
    "Can you explain the permit costs?"
  ];

  return (
    <div className="space-y-6">
      {/* Continue the Conversation Section */}
      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-4">
          <MessageCircle className="h-5 w-5 mr-2" />
          <CardTitle className="text-lg">Continue the Conversation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Your Original Request:</div>
            <div className="text-blue-700 dark:text-blue-300 font-medium">"{originalRequest}"</div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Have questions about your estimate? Ask Spence the Builder!
          </p>
        </CardContent>
      </Card>

      {/* Conversational Estimator Assistant */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-2 text-green-600" />
            <CardTitle className="text-lg">Conversational Estimator Assistant</CardTitle>
          </div>
          <div className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">
            AI Powered
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* AI Welcome Message */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300">
              Great! I see you have your estimate ready. Feel free to ask me any questions about your project costs, timeline, or materials. For example: 'Why are materials so expensive?' or 'How can I reduce labor costs?'
            </p>
          </div>

          {/* Quick Questions */}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span className="mr-1">💡</span>
              Quick questions:
            </div>
            <div className="grid grid-cols-2 gap-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-left justify-start h-auto py-2 px-3 text-xs"
                  onClick={() => setMessage(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          {messages.length > 0 && (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Message Input */}
          <div className="flex space-x-2">
            <Input
              placeholder="Ask a follow-up question..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="sm" className="bg-green-600 hover:bg-green-700">
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Try Examples */}
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
            <span className="mr-1">💡</span>
            Try: "350 sq ft kitchen remodel with premium finishes" or "What if I change to luxury materials?"
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
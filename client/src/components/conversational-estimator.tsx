import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Loader2, Lightbulb, Calculator, HelpCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import SmartQuickFill from "./smart-quick-fill";

interface ConversationalEstimatorProps {
  onEstimateGenerated?: (estimateData: any) => void;
  currentEstimate?: any;
}

interface ChatMessage {
  type: 'user' | 'assistant';
  content: string;
  estimateData?: any;
  timestamp: Date;
}

export default function ConversationalEstimator({ 
  onEstimateGenerated, 
  currentEstimate 
}: ConversationalEstimatorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      type: 'assistant',
      content: "Hi! I'm your construction estimator assistant. You can describe your project in plain English, ask about form fields, or explore what-if scenarios. Try saying something like: 'I want to remodel a 350 sq ft kitchen with mid-level finishes in Bethesda.'",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickFill, setShowQuickFill] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/conversational-estimator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInput: input.trim(),
          currentEstimate: currentEstimate,
          chatHistory: messages.slice(-5) // Send last 5 messages for context
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      console.log("Conversational AI response:", result);

      const assistantMessage: ChatMessage = {
        type: 'assistant',
        content: result.response || "I understand! Let me help you with that.",
        estimateData: result.updatedEstimateInput,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // If we got updated estimate data, check if it's complete or needs more info
      if (result.updatedEstimateInput) {
        const data = result.updatedEstimateInput;
        
        // Check if we have enough information to generate an estimate
        const hasRequiredFields = data.projectType && data.area && data.materialQuality && data.timeline && data.zipCode;
        
        if (hasRequiredFields && onEstimateGenerated) {
          // Complete data - generate estimate immediately
          const completeEstimateData = {
            ...data,
            laborWorkers: data.laborWorkers || 2,
            laborHours: data.laborHours || 24,
            laborRate: data.laborRate || 45,
            permitNeeded: data.permitNeeded !== false,
            demolitionRequired: data.demolitionRequired !== false,
            siteAccess: data.siteAccess || "moderate",
            timelineSensitivity: data.timelineSensitivity || "standard",
            tradeType: data.tradeType || "",
            materials: data.materials || `[{"type":"general","quantity":${data.area || 350},"unit":"sq ft","costPerUnit":25}]`,
            laborTypes: data.laborTypes || `[{"type":"general","workers":2,"hours":24,"hourlyRate":45}]`
          };

          // Ensure materials is a string (JSON format)
          if (Array.isArray(completeEstimateData.materials)) {
            completeEstimateData.materials = JSON.stringify(completeEstimateData.materials);
          }

          // Ensure laborTypes is a string (JSON format)
          if (Array.isArray(completeEstimateData.laborTypes)) {
            completeEstimateData.laborTypes = JSON.stringify(completeEstimateData.laborTypes);
          }
          
          console.log("Triggering estimate generation with:", completeEstimateData);
          onEstimateGenerated(completeEstimateData);
        } else {
          // Partial data - show smart quick-fill form
          setExtractedData(data);
          setShowQuickFill(true);
        }
      }

    } catch (error) {
      console.error("Conversational estimator error:", error);
      const errorMessage: ChatMessage = {
        type: 'assistant',
        content: "I'm having trouble processing that right now. Could you try rephrasing your question or being more specific about your project?",
        timestamp: new Date()
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

  const quickPrompts = [
    "What's the difference between premium and luxury finish?",
    "What if I go with a rushed timeline?",
    "Explain material quality options",
    "How does timeline affect cost?"
  ];

  return (
    <div className="space-y-6">
      {showQuickFill && extractedData ? (
        <SmartQuickFill
          extractedData={extractedData}
          onComplete={(completeData) => {
            setShowQuickFill(false);
            setExtractedData(null);
            if (onEstimateGenerated) {
              onEstimateGenerated(completeData);
            }
          }}
          onCancel={() => {
            setShowQuickFill(false);
            setExtractedData(null);
          }}
        />
      ) : (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-600" />
              Conversational Estimator Assistant
              <Badge variant="secondary" className="bg-green-100 text-green-700 ml-auto">
                AI Powered
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Chat Messages */}
            <div className="max-h-64 overflow-y-auto space-y-3 p-4 bg-white rounded-lg border">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    {message.estimateData && (
                      <div className="mt-2 p-2 bg-white/20 rounded text-xs">
                        <Calculator className="h-3 w-3 inline mr-1" />
                        Estimate data updated
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick prompts */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Lightbulb className="h-4 w-4" />
                Quick questions:
              </p>
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setInput(prompt)}
                    className="text-xs"
                    disabled={isLoading}
                  >
                    <HelpCircle className="h-3 w-3 mr-1" />
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your project or ask a question..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="text-xs text-gray-500 text-center">
              💡 Try: "350 sq ft kitchen remodel with premium finishes" or "What if I change to luxury materials?"
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Thinking...
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
            <Lightbulb className="h-4 w-4" />
            Quick questions:
          </p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setInput(prompt)}
                className="text-xs"
                disabled={isLoading}
              >
                <HelpCircle className="h-3 w-3 mr-1" />
                {prompt}
              </Button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe your project or ask a question..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="text-xs text-gray-500 text-center">
          💡 Try: "350 sq ft kitchen remodel with premium finishes" or "What if I change to luxury materials?"
        </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
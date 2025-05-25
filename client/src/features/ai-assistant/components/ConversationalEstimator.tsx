import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, Loader2, Lightbulb } from "lucide-react";
import { AIResultBox } from "@/features/shared";
import type { ChatMessage } from '../types';

interface ConversationalEstimatorProps {
  onEstimateGenerated?: (estimate: any) => void;
}

export function ConversationalEstimator({ onEstimateGenerated }: ConversationalEstimatorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [estimateResult, setEstimateResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setUserInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/conversational-estimator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInput: userInput,
          currentEstimate: estimateResult,
          chatHistory: messages
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, assistantMessage]);

        if (data.estimateData) {
          setEstimateResult(data.estimateData);
          onEstimateGenerated?.(data.estimateData);
        }
      }
    } catch (error) {
      console.error("Error in conversational estimator:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const examplePrompts = [
    "I want to remodel a 350 sq ft kitchen with mid-level finishes",
    "What would it cost to renovate a 200 sq ft bathroom?",
    "I need an estimate for adding a 400 sq ft deck to my house"
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          AI-Powered Conversational Estimator
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Describe your project in natural language and get an instant estimate
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Chat Messages */}
        {messages.length > 0 && (
          <div className="max-h-96 overflow-y-auto space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-700 border'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-700 border p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Analyzing your project...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Example Prompts */}
        {messages.length === 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Try these examples:
            </h4>
            <div className="grid gap-2">
              {examplePrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setUserInput(prompt)}
                  className="text-left justify-start h-auto p-3"
                >
                  "{prompt}"
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Describe your project... (e.g., 'I want to remodel my kitchen with granite countertops and custom cabinets')"
            className="min-h-[60px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button 
            type="submit" 
            disabled={isLoading || !userInput.trim()}
            className="h-[60px] px-4"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>

        {/* Estimate Result */}
        {estimateResult && (
          <AIResultBox
            title="Generated Estimate"
            content={`Total Estimated Cost: $${estimateResult.estimatedCost?.toLocaleString() || 'N/A'}`}
            isLoading={false}
            showCopyButton={true}
          />
        )}
      </CardContent>
    </Card>
  );
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Clock, Zap } from "lucide-react";
import { Link } from "wouter";

interface ToolCardProps {
  tool: {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    icon?: any;
    href: string;
    emoji: string;
    tagline: string;
    features: string[];
    isPro?: boolean;
    isNew?: boolean;
    estimatedTime?: string;
  };
  categoryColor: string;
  onToolClick?: (toolId: string) => void;
}

export default function ToolCard({ tool, categoryColor, onToolClick }: ToolCardProps) {
  const handleClick = () => {
    if (onToolClick) {
      onToolClick(tool.id);
    }
  };

  // Apply color coding: Blue for Pro, Green for Consumer, Purple for Shared
  const getBorderColor = () => {
    if (categoryColor === 'blue') return 'border-l-4 border-blue-500';
    if (categoryColor === 'green') return 'border-l-4 border-green-500';
    if (categoryColor === 'purple') return 'border-l-4 border-purple-500';
    return 'border-l-4 border-blue-500';
  };

  const getButtonColor = () => {
    if (categoryColor === 'blue') return 'bg-blue-600 hover:bg-blue-700';
    if (categoryColor === 'green') return 'bg-green-600 hover:bg-green-700';
    if (categoryColor === 'purple') return 'bg-purple-600 hover:bg-purple-700';
    return 'bg-blue-600 hover:bg-blue-700';
  };

  return (
    <Card className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 ${getBorderColor()} h-full flex flex-col`}>
      <div className="flex items-center mb-4">
        <span className="w-6 h-6 text-2xl mr-3">{tool.emoji || "🔧"}</span>
        <h3 className="text-lg font-semibold text-gray-900">{tool.title}</h3>
        <div className="flex gap-1 ml-auto">
          {tool.isNew && (
            <Badge className="bg-green-100 text-green-800 text-xs">NEW</Badge>
          )}
          {tool.isPro && (
            <Badge className="bg-blue-100 text-blue-800 text-xs">PRO</Badge>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-4 flex-grow">{tool.description}</p>
      <Link href={tool.href}>
        <Button 
          className={`w-full ${getButtonColor()}`}
          onClick={handleClick}
        >
          Launch Tool
        </Button>
      </Link>
    </Card>
  );
}
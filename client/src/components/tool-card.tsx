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

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return {
          bg: "bg-blue-50",
          border: "border-blue-200 hover:border-blue-400",
          icon: "text-blue-600",
          badge: "bg-blue-100 text-blue-800",
          button: "bg-blue-600 hover:bg-blue-700"
        };
      case "green":
        return {
          bg: "bg-green-50",
          border: "border-green-200 hover:border-green-400",
          icon: "text-green-600",
          badge: "bg-green-100 text-green-800",
          button: "bg-green-600 hover:bg-green-700"
        };
      case "orange":
        return {
          bg: "bg-orange-50",
          border: "border-orange-200 hover:border-orange-400",
          icon: "text-orange-600",
          badge: "bg-orange-100 text-orange-800",
          button: "bg-orange-600 hover:bg-orange-700"
        };
      case "purple":
        return {
          bg: "bg-purple-50",
          border: "border-purple-200 hover:border-purple-400",
          icon: "text-purple-600",
          badge: "bg-purple-100 text-purple-800",
          button: "bg-purple-600 hover:bg-purple-700"
        };
      case "teal":
        return {
          bg: "bg-teal-50",
          border: "border-teal-200 hover:border-teal-400",
          icon: "text-teal-600",
          badge: "bg-teal-100 text-teal-800",
          button: "bg-teal-600 hover:bg-teal-700"
        };
      default:
        return {
          bg: "bg-slate-50",
          border: "border-slate-200 hover:border-slate-400",
          icon: "text-slate-600",
          badge: "bg-slate-100 text-slate-800",
          button: "bg-slate-600 hover:bg-slate-700"
        };
    }
  };

  const colors = getColorClasses(categoryColor);

  return (
    <Card 
      className={`group transition-all duration-300 hover:shadow-lg border-2 ${colors.border} cursor-pointer bg-white/50 backdrop-blur-sm overflow-hidden h-full flex flex-col min-h-[280px]`}
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
              <span className="text-2xl">{tool.emoji || "🔧"}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-2 mb-1">
                <CardTitle className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-tight">
                  {tool.title}
                </CardTitle>
                <div className="flex gap-1 flex-shrink-0">
                  {tool.isNew && (
                    <Badge className="bg-emerald-100 text-emerald-700 text-xs px-1.5 py-0.5 font-medium">
                      <Zap className="w-3 h-3 mr-1" />
                      New
                    </Badge>
                  )}
                  {tool.isPro && (
                    <Badge className="bg-amber-100 text-amber-700 text-xs px-1.5 py-0.5 font-medium">
                      <Star className="w-3 h-3 mr-1" />
                      Pro
                    </Badge>
                  )}
                </div>
              </div>
              <CardDescription className="text-sm text-slate-600 font-medium mb-1">
                {tool.subtitle}
              </CardDescription>
              <p className="text-xs text-blue-600 font-medium italic">
                💡 {tool.tagline}
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 ml-2" />
        </div>
      </CardHeader>

      <CardContent className="pt-0 flex-1 flex flex-col">
        <div className="flex-1 space-y-4">
          <p className="text-sm text-slate-700 leading-relaxed">
            {tool.description}
          </p>

          {/* Features List */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Key Features
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {tool.features.map((feature, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className={`${colors.badge} text-xs px-2 py-1 border-0`}
                >
                  {feature}
                </Badge>
              ))}
            </div>
          </div>

          {/* Estimated Time */}
          {tool.estimatedTime && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="w-3 h-3" />
              <span>Est. {tool.estimatedTime}</span>
            </div>
          )}
        </div>

        {/* Action Button - Always at bottom */}
        <div className="mt-4">
          <Link href={tool.href}>
            <Button 
              className={`w-full ${colors.button} text-white py-2.5 text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200`}
            >
              {tool.isPro ? 'Access Pro Tool' : 'Start Planning'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
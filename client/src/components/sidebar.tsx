import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ModeSwitcher } from "@/components/mode-toggle";
import { 
  Building,
  Calculator, 
  CalendarCheck,
  FileText,
  Users,
  Bot,
  TrendingUp,
  Lightbulb,
  DollarSign,
  Search,
  Home,
  Menu,
  X,
  Phone
} from "lucide-react";

interface SidebarProps {
  currentMode: 'pro' | 'consumer';
  onModeChange?: (mode: 'pro' | 'consumer') => void;
}

interface ToolItem {
  id: string;
  title: string;
  icon: any;
  href: string;
  emoji: string;
  isNew?: boolean;
}

export default function Sidebar({ currentMode, onModeChange }: SidebarProps) {
  const [location, setLocation] = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const consumerTools: ToolItem[] = [
    {
      id: 'budget-planner',
      title: 'Budget Planner',
      icon: Lightbulb,
      href: '/budget-planner',
      emoji: '🧮'
    },
    {
      id: 'investment-roi-tool',
      title: 'ROI Calculator',
      icon: TrendingUp,
      href: '/investment-roi-tool',
      emoji: '📈'
    },
    {
      id: 'permit-research',
      title: 'Permit Research Tool',
      icon: Search,
      href: '/permit-research',
      emoji: '🗺'
    },
    {
      id: 'renovation-concierge',
      title: 'Renovation Concierge',
      icon: Bot,
      href: '/renovation-concierge',
      emoji: '🧞'
    },
    {
      id: 'homeowner-chat',
      title: 'Homeowner AI Chat',
      icon: Bot,
      href: '/homeowner-chat',
      emoji: '💬'
    },
    {
      id: 'properties',
      title: 'Property Search + Flip Analyzer',
      icon: Building,
      href: '/properties',
      emoji: '🏠'
    }
  ];

  const proTools: ToolItem[] = [
    {
      id: 'estimator',
      title: 'Project Estimator',
      icon: Calculator,
      href: '/estimator',
      emoji: '🏗'
    },
    {
      id: 'bid-estimator',
      title: 'Bid Generator',
      icon: FileText,
      href: '/bid-estimator',
      emoji: '📝'
    },
    {
      id: 'scheduler',
      title: 'Schedule Builder',
      icon: CalendarCheck,
      href: '/scheduler',
      emoji: '📅'
    },
    {
      id: 'material-prices',
      title: 'Material Price Center',
      icon: DollarSign,
      href: '/material-prices',
      emoji: '📦'
    },
    {
      id: 'ai-assistant',
      title: 'Construction AI Assistant',
      icon: Bot,
      href: '/ai-assistant',
      emoji: '💬'
    },
    {
      id: 'subcontractors',
      title: 'Subcontractor Tracker',
      icon: Users,
      href: '/subcontractors',
      emoji: '🔍'
    },
    {
      id: 'leads',
      title: 'Lead Finder',
      icon: Search,
      href: '/leads',
      emoji: '📬'
    }
  ];

  const currentTools = currentMode === 'consumer' ? consumerTools : proTools;
  const isActiveTool = (href: string) => {
    if (href.includes('?')) {
      return location.startsWith(href.split('?')[0]);
    }
    return location === href || location.startsWith(href + '/');
  };

  const handleToolClick = (href: string) => {
    setLocation(href);
  };

  const sidebarWidth = isCollapsed ? 'w-16' : 'w-64';

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-white border-r border-slate-200 z-50 transition-all duration-300 ${sidebarWidth}`}>
        {/* Header */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <Building className="w-6 h-6 text-blue-600" />
                <span className="font-bold text-slate-900">CST</span>
                <Badge variant={currentMode === 'pro' ? 'default' : 'secondary'} className="text-xs">
                  {currentMode === 'pro' ? 'Pro' : 'Home'}
                </Badge>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 hover:bg-slate-100"
            >
              {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-2">
            {currentTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => handleToolClick(tool.href)}
                title={isCollapsed ? tool.title : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  isActiveTool(tool.href)
                    ? currentMode === 'pro' 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-green-50 text-green-700 border border-green-200'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex-shrink-0">
                  {isCollapsed ? (
                    <span className="text-lg">{tool.emoji}</span>
                  ) : (
                    <tool.icon className="w-5 h-5" />
                  )}
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{tool.title}</span>
                      {tool.isNew && (
                        <Badge variant="secondary" className="text-xs">New</Badge>
                      )}
                    </div>
                  </div>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Mode Switcher at Bottom */}
        <div className="p-4 border-t border-slate-200">
          {!isCollapsed && (
            <div className="space-y-3">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Switch Mode
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onModeChange?.(currentMode === 'pro' ? 'consumer' : 'pro')}
                className="w-full"
                title={`Switch to ${currentMode === 'pro' ? 'Homeowner' : 'Professional Contractor'} Mode`}
              >
                Switch to {currentMode === 'pro' ? 'Consumer' : 'Pro'} Mode
              </Button>
            </div>
          )}
          {isCollapsed && (
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation(currentMode === 'pro' ? '/dashboard' : '/consumer-dashboard')}
                className="w-full"
                title={`Go to ${currentMode === 'pro' ? 'Pro' : 'Homeowner'} Dashboard`}
              >
                {currentMode === 'pro' ? (
                  <Phone className="w-4 h-4" />
                ) : (
                  <Home className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onModeChange?.(currentMode === 'pro' ? 'consumer' : 'pro')}
                className="w-full"
                title={`Switch to ${currentMode === 'pro' ? 'Homeowner' : 'Professional Contractor'} Mode`}
              >
                {currentMode === 'pro' ? (
                  <Home className="w-4 h-4 text-green-600" />
                ) : (
                  <Phone className="w-4 h-4 text-blue-600" />
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Spacer */}
      <div className={`${sidebarWidth} flex-shrink-0`} />
    </>
  );
}
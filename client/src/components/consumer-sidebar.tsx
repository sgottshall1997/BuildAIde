import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Home, 
  Calculator, 
  CheckSquare, 
  Bot, 
  PaintBucket, 
  DollarSign, 
  Users, 
  FileText, 
  Lightbulb, 
  Menu, 
  X,
  Building,
  BarChart3,
  Clock,
  Wrench,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navigationItems = [
  {
    title: "Planning & Estimation",
    items: [
      {
        title: "Dashboard",
        href: "/consumer-dashboard",
        icon: Home,
        description: "Your renovation overview"
      },
      {
        title: "Cost Estimator",
        href: "/consumer-estimator",
        icon: Calculator,
        description: "Get project estimates"
      },
      {
        title: "Estimate Wizard",
        href: "/estimate-wizard",
        icon: Wrench,
        description: "Step-by-step guidance"
      },
      {
        title: "Budget Forecasting",
        href: "/budget-forecasting",
        icon: TrendingUp,
        description: "Personalized cost predictions"
      },
      {
        title: "Quote Compare",
        href: "/quote-compare",
        icon: BarChart3,
        description: "Compare contractor bids"
      }
    ]
  },
  {
    title: "Project Management",
    items: [
      {
        title: "Project Tracker",
        href: "/project-tracker",
        icon: CheckSquare,
        description: "Track your progress"
      },
      {
        title: "Renovation Checklist",
        href: "/renovation-checklist",
        icon: FileText,
        description: "Detailed task lists"
      },
      {
        title: "AI Assistant",
        href: "/ai-renovation-assistant",
        icon: Bot,
        description: "Get expert advice"
      },
      {
        title: "Renovation Concierge",
        href: "/renovation-concierge",
        icon: Users,
        description: "Professional guidance"
      }
    ]
  },
  {
    title: "Resources",
    items: [
      {
        title: "Material Prices",
        href: "/material-prices",
        icon: DollarSign,
        description: "Current pricing info"
      },
      {
        title: "Design Ideas",
        href: "/design-ideas",
        icon: Lightbulb,
        description: "Inspiration gallery"
      },
      {
        title: "Permits Guide",
        href: "/permits-guide",
        icon: FileText,
        description: "Permit requirements"
      }
    ]
  }
];

export default function ConsumerSidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [location, setLocation] = useLocation();

  const isActiveRoute = (href: string) => {
    if (href === '/consumer-dashboard') {
      return location === '/consumer-dashboard' || location === '/';
    }
    return location === href;
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="bg-white shadow-md"
        >
          {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full w-72 bg-white border-r border-slate-200 z-40 transform transition-transform duration-300 ease-in-out",
        isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-slate-900">Homeowner Tools</h2>
              <p className="text-sm text-slate-500">Smart renovation planning</p>
            </div>
          </div>
          
          {/* Mode Switch */}
          <div className="mt-4">
            <Button 
              onClick={() => setLocation("/")}
              variant="outline"
              size="sm"
              className="w-full flex items-center gap-2 bg-slate-50 border-slate-200 hover:bg-slate-100"
            >
              <Building className="w-4 h-4" />
              Switch to Pro Mode
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {navigationItems.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActiveRoute(item.href);
                  
                  return (
                    <Link key={item.href} href={item.href}>
                      <div
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                          isActive
                            ? "bg-blue-100 text-blue-700 border border-blue-200"
                            : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                        )}
                        onClick={() => setIsMobileOpen(false)}
                      >
                        <Icon className={cn("h-4 w-4", isActive ? "text-blue-600" : "text-slate-500")} />
                        <div className="flex-1">
                          <div className="font-medium">{item.title}</div>
                          <div className="text-xs text-slate-500">{item.description}</div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Bot className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Need Help?</span>
            </div>
            <p className="text-xs text-blue-700 mb-2">
              Chat with Spence the Builder for expert renovation advice
            </p>
            <Link href="/ai-renovation-assistant">
              <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-xs">
                Ask Spence
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Calendar, 
  Calculator, 
  CalendarCheck, 
  TrendingUp, 
  Home, 
  DollarSign, 
  BarChart3, 
  Clock, 
  Bot,
  Menu,
  X,
  Building,
  Search,
  PieChart
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigationItems = [
    {
      title: "Core Tools",
      items: [
        {
          title: "Dashboard",
          href: "/",
          icon: LayoutDashboard,
          description: "Overview & metrics"
        },
        {
          title: "Smart Project Manager",
          href: "/project-scheduler",
          icon: Calendar,
          description: "Projects + scheduling + timeline"
        },
        {
          title: "Professional Estimator",
          href: "/estimator",
          icon: Calculator,
          description: "Advanced cost estimates"
        },
        {
          title: "Permit & Inspection Hub",
          href: "/scheduler",
          icon: CalendarCheck,
          description: "Permits + inspections + lookup"
        },
        {
          title: "Construction AI Assistant",
          href: "/ai-assistant",
          icon: Bot,
          description: "Spence the Builder Pro"
        }
      ]
    },
    {
      title: "Market Intelligence",
      items: [
        {
          title: "Material Cost Intelligence Center",
          href: "/material-prices",
          icon: DollarSign,
          description: "Live pricing + trends + forecasts"
        }
      ]
    },
    {
      title: "Real Estate & Flipping",
      items: [
        {
          title: "Property Intelligence Hub",
          href: "/real-estate-listings",
          icon: Home,
          description: "Listings + ROI + permits + portfolio"
        }
      ]
    }
  ];

  const isActiveRoute = (href: string) => {
    if (href === "/") {
      return location === "/";
    }
    return location.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Spence the Builder</h2>
            <p className="text-xs text-slate-600">Smart Construction Tools</p>
          </div>
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
        <div className="text-xs text-slate-500 text-center">
          Built for construction professionals
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full w-72 bg-white border-r border-slate-200 z-40 transform transition-transform duration-200 ease-in-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0 md:static md:z-auto",
          className
        )}
      >
        <SidebarContent />
      </div>
    </>
  );
}
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, 
  CalendarCheck, 
  TrendingUp, 
  Building, 
  Home, 
  Settings, 
  User,
  Menu,
  X
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  description: string;
  proOnly?: boolean;
}

const proModeNavigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/",
    icon: Building,
    description: "Smart Construction Command Center"
  },
  {
    name: "Bid Estimator",
    href: "/bid-estimator",
    icon: Calculator,
    description: "AI-powered project estimates"
  },
  {
    name: "Schedule Manager",
    href: "/schedule-manager",
    icon: CalendarCheck,
    description: "Inspection & project scheduling"
  },
  {
    name: "Material Price Center",
    href: "/material-prices",
    icon: TrendingUp,
    description: "Live market data & trends"
  },
  {
    name: "Property Intelligence Hub",
    href: "/real-estate-listings",
    icon: Building,
    description: "Flipping tools & analysis",
    proOnly: true
  }
];

const consumerModeNavigation: NavigationItem[] = [
  {
    name: "Renovation Planner",
    href: "/",
    icon: Home,
    description: "Plan your dream renovation"
  },
  {
    name: "Cost Calculator",
    href: "/bid-estimator",
    icon: Calculator,
    description: "Estimate renovation costs"
  },
  {
    name: "Material Guide",
    href: "/material-prices",
    icon: TrendingUp,
    description: "Current material prices"
  },
  {
    name: "Expert Assistant",
    href: "/ai-assistant",
    icon: User,
    description: "Get professional advice"
  }
];

export function UnifiedNavigation() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { userMode, setUserMode } = useAppContext();

  const currentNavigation = userMode === 'pro' ? proModeNavigation : consumerModeNavigation;

  const toggleMode = () => {
    const newMode = userMode === 'pro' ? 'consumer' : 'pro';
    setUserMode(newMode);
    setMobileMenuOpen(false);
  };

  const isActiveRoute = (href: string) => {
    if (href === '/') return location === '/';
    return location.startsWith(href);
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-slate-900">ConstructionSmartTools</span>
                <div className="flex items-center space-x-2 mt-0.5">
                  <Badge 
                    variant={userMode === 'pro' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {userMode === 'pro' ? 'Pro Mode' : 'Consumer Mode'}
                  </Badge>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {currentNavigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActiveRoute(item.href) ? "default" : "ghost"}
                  className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-colors ${
                    isActiveRoute(item.href)
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Button>
              </Link>
            ))}
          </div>

          {/* Mode Toggle & Mobile Menu */}
          <div className="flex items-center space-x-3">
            {/* Mode Toggle Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleMode}
              className="hidden sm:flex items-center space-x-2 border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              {userMode === 'pro' ? (
                <>
                  <Home className="h-4 w-4" />
                  <span>Switch to Consumer</span>
                </>
              ) : (
                <>
                  <Building className="h-4 w-4" />
                  <span>Switch to Pro</span>
                </>
              )}
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {currentNavigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start space-x-3 ${
                      isActiveRoute(item.href)
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.description}</div>
                    </div>
                  </Button>
                </Link>
              ))}
              
              {/* Mobile Mode Toggle */}
              <div className="pt-3 border-t border-slate-200">
                <Button
                  variant="outline"
                  className="w-full justify-start space-x-3"
                  onClick={toggleMode}
                >
                  {userMode === 'pro' ? (
                    <>
                      <Home className="h-5 w-5" />
                      <span>Switch to Consumer Mode</span>
                    </>
                  ) : (
                    <>
                      <Building className="h-5 w-5" />
                      <span>Switch to Pro Mode</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default UnifiedNavigation;
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  Home, 
  ArrowLeft, 
  RotateCcw, 
  Menu, 
  X,
  ChevronRight,
  Hammer,
  Users
} from "lucide-react";
import { Link, useLocation } from "wouter";

interface UnifiedLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  currentMode?: 'consumer' | 'pro' | 'demo';
  showModeSwitch?: boolean;
  showBackButton?: boolean;
}

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function UnifiedLayout({ 
  children, 
  pageTitle, 
  currentMode = 'consumer', 
  showModeSwitch = true,
  showBackButton = true 
}: UnifiedLayoutProps) {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Check if we're in demo mode
  const isDemoMode = location.includes('demo=true') || location.startsWith('/demo');
  
  // Generate breadcrumbs based on current location
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];
    
    // Always start with appropriate dashboard
    if (currentMode === 'consumer') {
      breadcrumbs.push({ label: 'Consumer Dashboard', href: '/consumer-dashboard' });
    } else if (currentMode === 'pro') {
      breadcrumbs.push({ label: 'Professional Dashboard', href: '/dashboard' });
    } else if (isDemoMode) {
      breadcrumbs.push({ label: 'Demo Mode', href: '/demo' });
    }
    
    // Add current page if it's not the dashboard
    if (pageTitle && !pageTitle.includes('Dashboard')) {
      breadcrumbs.push({ label: pageTitle });
    }
    
    return breadcrumbs;
  };

  const handleModeSwitch = () => {
    if (currentMode === 'consumer') {
      setLocation('/pro');
    } else {
      setLocation('/consumer');
    }
  };

  const handleBackToDashboard = () => {
    if (isDemoMode) {
      setLocation('/demo');
    } else if (currentMode === 'consumer') {
      setLocation('/consumer-dashboard');
    } else {
      setLocation('/dashboard');
    }
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Left Section - Logo & Title */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Hammer className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg sm:text-xl font-bold text-slate-900">ConstructionSmartTools</h1>
                  <p className="text-xs text-slate-500">
                    {currentMode === 'consumer' ? 'Homeowner Edition' : 'Professional Suite'}
                  </p>
                </div>
              </div>
            </div>

            {/* Center Section - Breadcrumbs (Desktop) */}
            <div className="hidden md:flex items-center space-x-2 flex-1 justify-center max-w-md">
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {index > 0 && <ChevronRight className="h-4 w-4 text-slate-400" />}
                  {crumb.href ? (
                    <Link href={crumb.href}>
                      <Button variant="ghost" size="sm" className="text-sm text-slate-600 hover:text-slate-900">
                        {crumb.label}
                      </Button>
                    </Link>
                  ) : (
                    <span className="text-sm font-medium text-slate-900">{crumb.label}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center space-x-2">
              {/* Demo Mode Badge */}
              {isDemoMode && (
                <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1">
                  🎭 Demo
                </Badge>
              )}

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
              </div>

              {/* Desktop Actions */}
              <div className="hidden md:flex items-center space-x-2">
                {showBackButton && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBackToDashboard}
                    className="text-xs"
                  >
                    <ArrowLeft className="h-3 w-3 mr-1" />
                    Back to Dashboard
                  </Button>
                )}

                {showModeSwitch && !isDemoMode && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleModeSwitch}
                    className="text-xs"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Switch to {currentMode === 'consumer' ? 'Pro' : 'Consumer'}
                  </Button>
                )}

                {isDemoMode && (
                  <Link href="/">
                    <Button variant="outline" size="sm" className="text-xs">
                      Return to App
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Breadcrumbs */}
          <div className="md:hidden pb-3 border-t border-slate-100 pt-2">
            <div className="flex items-center space-x-2 overflow-x-auto">
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center space-x-2 flex-shrink-0">
                  {index > 0 && <ChevronRight className="h-3 w-3 text-slate-400" />}
                  {crumb.href ? (
                    <Link href={crumb.href}>
                      <Button variant="ghost" size="sm" className="text-xs text-slate-600 hover:text-slate-900 px-2 py-1">
                        {crumb.label}
                      </Button>
                    </Link>
                  ) : (
                    <span className="text-xs font-medium text-slate-900">{crumb.label}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-slate-100 py-3">
              <div className="flex flex-col space-y-2">
                {showBackButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      handleBackToDashboard();
                      setMobileMenuOpen(false);
                    }}
                    className="justify-start text-sm"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                )}

                {showModeSwitch && !isDemoMode && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      handleModeSwitch();
                      setMobileMenuOpen(false);
                    }}
                    className="justify-start text-sm"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Switch to {currentMode === 'consumer' ? 'Pro' : 'Consumer'} Mode
                  </Button>
                )}

                {isDemoMode && (
                  <Link href="/">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="justify-start text-sm w-full"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Return to Real App
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Page Content */}
      <main className="max-w-7xl mx-auto p-3 sm:p-6">
        {children}
      </main>
    </div>
  );
}
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Home, 
  RefreshCw,
  Menu,
  X,
  Building,
  Users,
  ChevronRight
} from "lucide-react";
import { useLocation } from "wouter";

interface PersistentNavbarProps {
  pageTitle?: string;
  showBackButton?: boolean;
  showModeSwitch?: boolean;
  currentMode?: 'consumer' | 'pro';
}

export default function PersistentNavbar({ 
  pageTitle,
  showBackButton = true,
  showModeSwitch = true,
  currentMode = 'pro'
}: PersistentNavbarProps) {
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleHomeClick = () => {
    setLocation("/");
    setMobileMenuOpen(false);
  };

  const handleBackToDashboard = () => {
    if (currentMode === 'consumer') {
      setLocation("/consumer-dashboard");
    } else {
      setLocation("/dashboard");
    }
    setMobileMenuOpen(false);
  };

  const handleSwitchMode = () => {
    if (currentMode === 'consumer') {
      setLocation("/pro");
    } else {
      setLocation("/consumer");
    }
    setMobileMenuOpen(false);
  };

  const getBreadcrumb = () => {
    if (currentMode === 'consumer') {
      return "Consumer Tools";
    } else {
      return "Professional Tools";
    }
  };

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Logo/Brand */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleHomeClick}
              className="flex items-center space-x-2 hover:opacity-75 transition-opacity"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 hidden sm:block">
                ConstructionSmartTools
              </span>
              <span className="text-xl font-bold text-slate-900 sm:hidden">
                CST
              </span>
            </button>

            {/* Breadcrumb */}
            {pageTitle && (
              <div className="hidden md:flex items-center space-x-2 text-sm text-slate-500">
                <span>{getBreadcrumb()}</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-slate-900 font-medium">{pageTitle}</span>
              </div>
            )}
          </div>

          {/* Center Section - Page Title (Mobile) */}
          {pageTitle && (
            <div className="md:hidden">
              <h1 className="text-lg font-semibold text-slate-900 truncate">
                {pageTitle}
              </h1>
            </div>
          )}

          {/* Right Section - Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {showBackButton && (
              <Button
                onClick={handleBackToDashboard}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Dashboard</span>
              </Button>
            )}

            {showModeSwitch && (
              <Button
                onClick={handleSwitchMode}
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2"
              >
                {currentMode === 'consumer' ? (
                  <>
                    <Building className="w-4 h-4" />
                    <span>Pro Mode</span>
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4" />
                    <span>Consumer Mode</span>
                  </>
                )}
              </Button>
            )}

            {/* Mode Indicator */}
            <Badge 
              variant={currentMode === 'consumer' ? 'default' : 'secondary'}
              className={currentMode === 'consumer' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}
            >
              {currentMode === 'consumer' ? 'Consumer' : 'Professional'}
            </Badge>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              variant="ghost"
              size="sm"
              className="p-2"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4">
            <div className="space-y-3">
              {showBackButton && (
                <Button
                  onClick={handleBackToDashboard}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              )}

              {showModeSwitch && (
                <Button
                  onClick={handleSwitchMode}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                >
                  {currentMode === 'consumer' ? (
                    <>
                      <Building className="w-4 h-4 mr-2" />
                      Switch to Pro Mode
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4 mr-2" />
                      Switch to Consumer Mode
                    </>
                  )}
                </Button>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-slate-600">Current Mode:</span>
                <Badge 
                  variant={currentMode === 'consumer' ? 'default' : 'secondary'}
                  className={currentMode === 'consumer' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}
                >
                  {currentMode === 'consumer' ? 'Consumer' : 'Professional'}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
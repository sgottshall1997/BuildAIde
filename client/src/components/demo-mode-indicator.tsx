import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  Eye,
  ArrowLeft,
  AlertCircle
} from "lucide-react";
import { useLocation } from "wouter";

interface DemoModeIndicatorProps {
  isDemoMode?: boolean;
  onExitDemo?: () => void;
}

export function DemoModeIndicator({ isDemoMode = false, onExitDemo }: DemoModeIndicatorProps) {
  const [, setLocation] = useLocation();

  const handleExitDemo = () => {
    // Clear demo state
    localStorage.removeItem('demo-tour-completed');
    if (window && (window as any).isDemoMode) {
      (window as any).isDemoMode = false;
      (window as any).suppressGPTRequests = false;
    }
    
    // Call provided exit handler if available
    if (onExitDemo) {
      onExitDemo();
    }
    
    // Navigate to root
    setLocation('/');
  };

  if (!isDemoMode) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
      {/* Demo Mode Badge */}
      <Badge className="bg-orange-500 text-white border-orange-600 px-3 py-1.5 text-sm font-medium shadow-lg">
        <Eye className="w-4 h-4 mr-2" />
        Demo Mode
      </Badge>

      {/* Exit Demo Button */}
      <Button
        onClick={handleExitDemo}
        variant="outline"
        size="sm"
        className="bg-white/90 hover:bg-white border-gray-300 shadow-lg"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Exit Demo
      </Button>
    </div>
  );
}

// Alternative floating notification style
export function DemoModeFloatingNotification({ isDemoMode = false, onExitDemo }: DemoModeIndicatorProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [, setLocation] = useLocation();

  const handleExitDemo = () => {
    // Clear demo state
    localStorage.removeItem('demo-tour-completed');
    if (window && (window as any).isDemoMode) {
      (window as any).isDemoMode = false;
      (window as any).suppressGPTRequests = false;
    }
    
    // Call provided exit handler if available
    if (onExitDemo) {
      onExitDemo();
    }
    
    // Navigate to root
    setLocation('/');
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isDemoMode || !isVisible) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md">
      <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-lg shadow-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-orange-400" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm text-orange-700">
              <span className="font-medium">Demo Mode Active</span> - 
              You're exploring sample data and features
            </p>
          </div>
          <div className="ml-4 flex-shrink-0 flex gap-2">
            <Button
              onClick={handleExitDemo}
              variant="ghost"
              size="sm"
              className="text-orange-700 hover:text-orange-900 text-xs"
            >
              Exit Demo
            </Button>
            <Button
              onClick={handleDismiss}
              variant="ghost"
              size="sm"
              className="text-orange-700 hover:text-orange-900 h-5 w-5 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Navbar integrated demo indicator
export function NavbarDemoIndicator({ isDemoMode = false, onExitDemo }: DemoModeIndicatorProps) {
  const [, setLocation] = useLocation();

  const handleExitDemo = () => {
    // Clear demo state
    localStorage.removeItem('demo-tour-completed');
    if (window && (window as any).isDemoMode) {
      (window as any).isDemoMode = false;
      (window as any).suppressGPTRequests = false;
    }
    
    // Call provided exit handler if available
    if (onExitDemo) {
      onExitDemo();
    }
    
    // Navigate to root
    setLocation('/');
  };

  if (!isDemoMode) return null;

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
        <Eye className="w-3 h-3 mr-1" />
        Demo
      </Badge>
      <Button
        onClick={handleExitDemo}
        variant="ghost"
        size="sm"
        className="text-orange-700 hover:text-orange-900 h-8 px-3"
      >
        Exit
      </Button>
    </div>
  );
}
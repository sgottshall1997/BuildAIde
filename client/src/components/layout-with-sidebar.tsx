import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Sidebar from "@/components/sidebar";
import Footer from "@/components/footer";

interface LayoutWithSidebarProps {
  children: React.ReactNode;
}

export default function LayoutWithSidebar({ children }: LayoutWithSidebarProps) {
  const [location, setLocation] = useLocation();
  const [currentMode, setCurrentMode] = useState<'pro' | 'consumer'>('consumer');

  // Determine mode based on current route
  useEffect(() => {
    if (location === '/' || location.startsWith('/dashboard')) {
      setCurrentMode('pro');
    } else if (location.startsWith('/consumer') || location.startsWith('/budget-planner') || location.startsWith('/investment-roi') || location.startsWith('/renovation-concierge') || location.startsWith('/homeowner-assistant')) {
      setCurrentMode('consumer');
    }
  }, [location]);

  const handleModeChange = (mode: 'pro' | 'consumer') => {
    setCurrentMode(mode);
    if (mode === 'consumer') {
      setLocation('/consumer-dashboard');
    } else {
      setLocation('/dashboard');
    }
  };

  // Only show sidebar on tool pages, not landing or demo pages
  const showSidebar = location !== '/landing' && location !== '/demo' && location !== '/mode-select';

  if (!showSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <Sidebar 
          currentMode={currentMode}
          onModeChange={handleModeChange}
        />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
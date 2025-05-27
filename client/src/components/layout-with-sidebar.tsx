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
    // Professional tool routes
    const proRoutes = [
      '/dashboard',
      '/estimator',
      '/bid-estimator', 
      '/scheduler',
      '/material-prices',
      '/ai-assistant',
      '/subcontractors',
      '/lead-finder',
      '/leads'
    ];
    
    // Consumer/Homeowner tool routes
    const consumerRoutes = [
      '/consumer',
      '/budget-planner',
      '/investment-roi',
      '/investment-roi-tool',
      '/renovation-concierge',
      '/homeowner-assistant',
      '/homeowner-chat',
      '/permit-research',
      '/properties',
      '/compare-contractors',
      '/quote-compare'
    ];
    
    // Check if current location matches any professional routes
    if (location === '/' || proRoutes.some(route => location.startsWith(route))) {
      setCurrentMode('pro');
    } 
    // Check if current location matches any consumer routes  
    else if (consumerRoutes.some(route => location.startsWith(route))) {
      setCurrentMode('consumer');
    }
    // Default to pro mode for unmatched routes (like landing, demo, etc.)
    else {
      setCurrentMode('pro');
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
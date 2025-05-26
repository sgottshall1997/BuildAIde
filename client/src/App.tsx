import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "./context/AppContext";
import UnifiedLayout from "@/components/unified-layout";
import LayoutWithSidebar from "@/components/layout-with-sidebar";
import { useLocation } from "wouter";
import { useEffect } from "react";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import ConsumerDashboard from "@/pages/consumer-dashboard";
import ConsumerDashboardFixed from "@/pages/consumer-dashboard-fixed";
import ConsumerDashboardEnhanced from "@/pages/consumer-dashboard-enhanced";
import Estimator from "@/pages/estimator-new";
import MaterialPrices from "@/pages/material-prices";
import AIAssistant from "@/pages/ai-assistant";
import RenovationConcierge from "@/pages/renovation-concierge";
import HomeownerChat from "@/pages/homeowner-chat";
import PermitResearch from "@/pages/permit-research";
import BudgetPlanner from "@/pages/budget-planner";
import InvestmentROITool from "@/pages/investment-roi-tool";
import EnhancedDemo from "@/pages/enhanced-demo";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function Router() {
  const [location] = useLocation();
  const isLandingOrDemo = location === '/' || location.startsWith('/demo');

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location]);

  return (
    <Switch>
      {/* Landing Page - No Layout */}
      <Route path="/" component={Landing} />
      
      {/* Demo Route - No Layout */}
      <Route path="/demo" component={() => {
        import("@/pages/demo").then(module => module.default);
        const Demo = require("@/pages/demo").default;
        return <Demo />;
      }} />
      
      {/* Consumer Routes - With Sidebar Layout */}
      <Route path="/consumer" component={() => (
        <LayoutWithSidebar>
          <ConsumerDashboardEnhanced />
        </LayoutWithSidebar>
      )} />
      
      <Route path="/consumer-dashboard" component={() => (
        <LayoutWithSidebar>
          <ConsumerDashboardEnhanced />
        </LayoutWithSidebar>
      )} />
      
      {/* Professional Routes - With Sidebar Layout */}
      <Route path="/pro" component={() => (
        <LayoutWithSidebar>
          <Dashboard />
        </LayoutWithSidebar>
      )} />
      
      <Route path="/dashboard" component={() => (
        <LayoutWithSidebar>
          <Dashboard />
        </LayoutWithSidebar>
      )} />
        
        <Route path="/bid-estimator" component={() => (
          <LayoutWithSidebar>
            <Estimator />
          </LayoutWithSidebar>
        )} />
        
        <Route path="/material-prices" component={() => (
          <LayoutWithSidebar>
            <MaterialPrices />
          </LayoutWithSidebar>
        )} />
        
        <Route path="/ai-assistant" component={() => (
          <LayoutWithSidebar>
            <AIAssistant />
          </LayoutWithSidebar>
        )} />
        
        <Route path="/renovation-concierge" component={() => (
          <LayoutWithSidebar>
            <RenovationConcierge />
          </LayoutWithSidebar>
        )} />
        
        <Route path="/homeowner-chat" component={() => (
          <LayoutWithSidebar>
            <HomeownerChat />
          </LayoutWithSidebar>
        )} />
        
        <Route path="/permit-research" component={() => (
          <LayoutWithSidebar>
            <PermitResearch />
          </LayoutWithSidebar>
        )} />
        
        {/* New Unified Tools */}
        <Route path="/budget-planner" component={() => (
          <LayoutWithSidebar>
            <BudgetPlanner />
          </LayoutWithSidebar>
        )} />
        
        <Route path="/investment-roi-tool" component={() => (
          <LayoutWithSidebar>
            <InvestmentROITool />
          </LayoutWithSidebar>
        )} />
      </Switch>
    );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}
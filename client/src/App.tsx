import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "./context/AppContext";
import UnifiedLayout from "@/components/unified-layout";
import { useLocation } from "wouter";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import ConsumerDashboard from "@/pages/consumer-dashboard";
import Estimator from "@/pages/estimator-new";
import MaterialPrices from "@/pages/material-prices";
import AIAssistant from "@/pages/ai-assistant";
import RenovationConcierge from "@/pages/renovation-concierge";
import AIRenovationAssistant from "@/pages/ai-renovation-assistant";
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
      
      {/* Consumer Routes - With Unified Layout */}
      <Route path="/consumer" component={() => (
        <UnifiedLayout pageTitle="Consumer Dashboard" currentMode="consumer">
          <ConsumerDashboard />
        </UnifiedLayout>
      )} />
      
      <Route path="/consumer-dashboard" component={() => (
        <UnifiedLayout pageTitle="Consumer Dashboard" currentMode="consumer">
          <ConsumerDashboard />
        </UnifiedLayout>
      )} />
      
      {/* Professional Routes - With Unified Layout */}
      <Route path="/pro" component={() => (
        <UnifiedLayout pageTitle="Professional Dashboard" currentMode="pro">
          <Dashboard />
        </UnifiedLayout>
      )} />
      
      <Route path="/dashboard" component={() => (
        <UnifiedLayout pageTitle="Professional Dashboard" currentMode="pro">
          <Dashboard />
        </UnifiedLayout>
      )} />
        
        <Route path="/bid-estimator" component={() => (
          <UnifiedLayout pageTitle="Bid Estimator" currentMode="pro">
            <Estimator />
          </UnifiedLayout>
        )} />
        
        <Route path="/material-prices" component={() => (
          <UnifiedLayout pageTitle="Material Prices" currentMode="pro">
            <MaterialPrices />
          </UnifiedLayout>
        )} />
        
        <Route path="/ai-assistant" component={() => (
          <UnifiedLayout pageTitle="AI Assistant" currentMode="pro">
            <AIAssistant />
          </UnifiedLayout>
        )} />
        
        <Route path="/renovation-concierge" component={() => (
          <UnifiedLayout pageTitle="Renovation Concierge" currentMode="consumer">
            <RenovationConcierge />
          </UnifiedLayout>
        )} />
        
        <Route path="/ai-renovation-assistant" component={() => (
          <UnifiedLayout pageTitle="AI Renovation Assistant" currentMode="consumer">
            <AIRenovationAssistant />
          </UnifiedLayout>
        )} />
        
        <Route path="/permit-research" component={() => (
          <UnifiedLayout pageTitle="Permit Research" currentMode="consumer">
            <PermitResearch />
          </UnifiedLayout>
        )} />
        
        {/* New Unified Tools */}
        <Route path="/budget-planner" component={() => (
          <UnifiedLayout pageTitle="Budget Planner" currentMode="consumer">
            <BudgetPlanner />
          </UnifiedLayout>
        )} />
        
        <Route path="/investment-roi-tool" component={() => (
          <UnifiedLayout pageTitle="Investment ROI Tool" currentMode="pro">
            <InvestmentROITool />
          </UnifiedLayout>
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
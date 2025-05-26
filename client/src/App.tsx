import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "./context/AppContext";
import DemoModeBanner from "@/components/demo-mode-banner";
import PageLayout from "@/components/page-layout";
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
  const isLandingPage = location === '/';

  return (
    <>
      {/* Demo Mode Banner */}
      <DemoModeBanner />
      
      {/* Main Content */}
      <Switch>
        {/* Landing Page - No Layout */}
        <Route path="/" component={Landing} />
        
        {/* Demo Route - No Layout */}
        <Route path="/demo" component={() => {
          import("@/pages/demo").then(module => module.default);
          const Demo = require("@/pages/demo").default;
          return <Demo />;
        }} />
        
        {/* Consumer Routes - With Layout */}
        <Route path="/consumer" component={() => (
          <PageLayout pageTitle="Consumer Dashboard" currentMode="consumer">
            <ConsumerDashboard />
          </PageLayout>
        )} />
        
        <Route path="/consumer-dashboard" component={() => (
          <PageLayout pageTitle="Consumer Dashboard" currentMode="consumer">
            <ConsumerDashboard />
          </PageLayout>
        )} />
        
        {/* Professional Routes - With Layout */}
        <Route path="/pro" component={() => (
          <PageLayout pageTitle="Professional Dashboard" currentMode="pro">
            <Dashboard />
          </PageLayout>
        )} />
        
        <Route path="/dashboard" component={() => (
          <PageLayout pageTitle="Professional Dashboard" currentMode="pro">
            <Dashboard />
          </PageLayout>
        )} />
        
        <Route path="/bid-estimator" component={() => (
          <PageLayout pageTitle="Bid Estimator" currentMode="pro">
            <Estimator />
          </PageLayout>
        )} />
        
        <Route path="/material-prices" component={() => (
          <PageLayout pageTitle="Material Prices" currentMode="pro">
            <MaterialPrices />
          </PageLayout>
        )} />
        
        <Route path="/ai-assistant" component={() => (
          <PageLayout pageTitle="AI Assistant" currentMode="pro">
            <AIAssistant />
          </PageLayout>
        )} />
        
        <Route path="/renovation-concierge" component={() => (
          <PageLayout pageTitle="Renovation Concierge" currentMode="consumer">
            <RenovationConcierge />
          </PageLayout>
        )} />
        
        <Route path="/ai-renovation-assistant" component={() => (
          <PageLayout pageTitle="AI Renovation Assistant" currentMode="consumer">
            <AIRenovationAssistant />
          </PageLayout>
        )} />
        
        <Route path="/permit-research" component={() => (
          <PageLayout pageTitle="Permit Research" currentMode="consumer">
            <PermitResearch />
          </PageLayout>
        )} />
        
        {/* New Unified Tools */}
        <Route path="/budget-planner" component={() => (
          <PageLayout pageTitle="Unified Budget Planner" currentMode="consumer">
            <BudgetPlanner />
          </PageLayout>
        )} />
        
        <Route path="/investment-roi-tool" component={() => (
          <PageLayout pageTitle="Smart Investment ROI Tool" currentMode="pro">
            <InvestmentROITool />
          </PageLayout>
        )} />
      </Switch>
    </>
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
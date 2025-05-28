import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AppProvider } from "./context/AppContext";
import { ModeProvider } from "./hooks/use-mode";
import { useAuth } from "@/hooks/useAuth";
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
import ROICalculator from "@/pages/investment-roi-tool";
import Properties from "@/pages/properties";
import EnhancedDemo from "@/pages/enhanced-demo";
import Scheduler from "@/pages/scheduler";
import SubcontractorTracker from "@/pages/subcontractor-tracker";
import LeadManager from "@/pages/lead-manager";
import LeadFinder from "@/pages/lead-finder";
import ClientProjects from "@/pages/client-projects";
import ContractorComparison from "@/pages/contractor-comparison";
import AIInsights from "@/pages/ai-insights";
import BidGenerator from "@/pages/bid-generator";
import ExpenseTracker from "@/pages/expense-tracker";
import About from "@/pages/static/about";
import PrivacyPolicy from "@/pages/static/privacy-policy";
import TermsOfService from "@/pages/static/terms-of-service";
import HowItWorks from "@/pages/static/how-it-works";

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
      
      {/* Static Pages - With Footer */}
      <Route path="/about" component={About} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/how-it-works" component={HowItWorks} />
      
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
            <ROICalculator />
          </LayoutWithSidebar>
        )} />
        
        <Route path="/properties" component={() => (
          <LayoutWithSidebar>
            <Properties />
          </LayoutWithSidebar>
        )} />
        
        {/* Missing Pro Mode Tool Routes */}
        <Route path="/estimator" component={() => (
          <LayoutWithSidebar>
            <Estimator />
          </LayoutWithSidebar>
        )} />
        
        <Route path="/estimator-new" component={() => (
          <LayoutWithSidebar>
            <Estimator />
          </LayoutWithSidebar>
        )} />
        
        <Route path="/scheduler" component={() => (
          <LayoutWithSidebar>
            <Scheduler />
          </LayoutWithSidebar>
        )} />
        
        <Route path="/subcontractors" component={() => (
          <LayoutWithSidebar>
            <SubcontractorTracker />
          </LayoutWithSidebar>
        )} />
        
        <Route path="/leads" component={() => (
          <LayoutWithSidebar>
            <LeadManager />
          </LayoutWithSidebar>
        )} />
        
        <Route path="/lead-finder" component={() => (
          <LayoutWithSidebar>
            <LeadFinder />
          </LayoutWithSidebar>
        )} />
        
        <Route path="/client-projects" component={() => (
          <LayoutWithSidebar>
            <ClientProjects />
          </LayoutWithSidebar>
        )} />
        
        <Route path="/compare-contractors" component={() => (
          <LayoutWithSidebar>
            <ContractorComparison />
          </LayoutWithSidebar>
        )} />
        
        <Route path="/ai-insights" component={() => (
          <LayoutWithSidebar>
            <AIInsights />
          </LayoutWithSidebar>
        )} />
        
        <Route path="/bid-generator" component={() => (
          <LayoutWithSidebar>
            <BidGenerator />
          </LayoutWithSidebar>
        )} />
        
        <Route path="/expense-tracker" component={() => (
          <LayoutWithSidebar>
            <ExpenseTracker />
          </LayoutWithSidebar>
        )} />
      </Switch>
    );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="buildaide-ui-theme">
      <QueryClientProvider client={queryClient}>
        <ModeProvider>
          <AppProvider>
            <TooltipProvider>
              <Router />
              <Toaster />
            </TooltipProvider>
          </AppProvider>
        </ModeProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "./context/AppContext";
import UnifiedNavigation from "@/components/unified-navigation";
import FeedbackWidget from "@/components/feedback-widget";
import OnboardingTooltip from "@/components/onboarding-tooltip";
import DemoModeBanner from "@/components/demo-mode-banner";
import Footer from "@/components/footer";
import PageLayout from "@/components/page-layout";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useLocation } from "wouter";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Estimator from "@/pages/estimator-new";
import Scheduler from "@/pages/scheduler";
import Opportunities from "@/pages/opportunities";
import About from "@/pages/about";
import AIAssistant from "@/pages/ai-assistant";
import MaterialPrices from "@/pages/material-prices";
import MaterialTrends from "@/pages/material-trends";
import RealEstateListings from "@/pages/real-estate-listings";
import ROICalculator from "@/pages/roi-calculator";
import PermitLookup from "@/pages/permit-lookup";
import FlipPortfolio from "@/pages/flip-portfolio";
import ProjectScheduler from "@/pages/project-scheduler";
import ProjectTimeline from "@/pages/project-timeline";
import ConsumerDashboard from "@/pages/consumer-dashboard";
import ConsumerEstimator from "@/pages/consumer-estimator";
import QuoteCompare from "@/pages/quote-compare";
import EstimateWizard from "@/pages/estimate-wizard";
import RenovationChecklist from "@/pages/renovation-checklist";
import AIRenovationAssistant from "@/pages/ai-renovation-assistant";
import RenovationConcierge from "@/pages/renovation-concierge";
import ProjectTracker from "@/pages/project-tracker";
import BudgetForecasting from "@/pages/budget-forecasting";
import SmartProjectEstimator from "@/pages/smart-project-estimator";
import RenovationAssistant from "@/pages/renovation-assistant";
import PermitResearch from "@/pages/permit-research";

function Router() {
  const { showOnboarding, steps, completeOnboarding, skipOnboarding } = useOnboarding();
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
        
        <Route path="/schedule-manager" component={() => (
          <PageLayout pageTitle="Schedule Manager" currentMode="pro">
            <Scheduler />
          </PageLayout>
        )} />
        
        <Route path="/material-prices" component={() => (
          <PageLayout pageTitle="Material Prices" currentMode="pro">
            <MaterialPrices />
          </PageLayout>
        )} />
        
        <Route path="/real-estate-listings" component={() => (
          <PageLayout pageTitle="Property Listings" currentMode="pro">
            <RealEstateListings />
          </PageLayout>
        )} />
        
        <Route path="/ai-assistant" component={() => (
          <PageLayout pageTitle="AI Assistant" currentMode="pro">
            <AIAssistant />
          </PageLayout>
        )} />
        
        <Route path="/opportunities" component={() => (
          <PageLayout pageTitle="Opportunities" currentMode="pro">
            <Opportunities />
          </PageLayout>
        )} />
        
        <Route path="/about" component={() => (
          <PageLayout pageTitle="About" showBackButton={false} showModeSwitch={false}>
            <About />
          </PageLayout>
        )} />
            
            {/* Property Intelligence Hub Sub-routes */}
            <Route path="/roi-calculator" component={ROICalculator} />
            <Route path="/permit-lookup" component={PermitLookup} />
            <Route path="/flip-portfolio" component={FlipPortfolio} />
            
            {/* Additional routes */}
            <Route path="/material-trends" component={MaterialTrends} />
            <Route path="/project-scheduler" component={ProjectScheduler} />
            <Route path="/project-timeline" component={ProjectTimeline} />
            
            {/* Consumer Routes */}
            <Route path="/consumer-dashboard" component={ConsumerDashboard} />
            <Route path="/consumer-estimator" component={ConsumerEstimator} />
            <Route path="/quote-compare" component={QuoteCompare} />
            <Route path="/estimate-wizard" component={EstimateWizard} />
            <Route path="/smart-project-estimator" component={SmartProjectEstimator} />
            <Route path="/renovation-checklist" component={RenovationChecklist} />
            <Route path="/ai-renovation-assistant" component={AIRenovationAssistant} />
            <Route path="/renovation-concierge" component={RenovationConcierge} />
            <Route path="/project-tracker" component={ProjectTracker} />
            <Route path="/budget-forecasting" component={BudgetForecasting} />
            <Route path="/renovation-assistant" component={RenovationAssistant} />
            <Route path="/permit-research" component={PermitResearch} />
          </Switch>
        </div>
      </main>
      
      {/* Feedback Widget */}
      {!isLandingPage && (
        <div data-onboarding="feedback-button">
          <FeedbackWidget />
        </div>
      )}
      
      {/* Footer */}
      <Footer />
    </div>
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
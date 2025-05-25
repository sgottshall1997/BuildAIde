import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "./context/AppContext";
import UnifiedNavigation from "@/components/unified-navigation";
import FeedbackWidget from "@/components/feedback-widget";
import OnboardingTooltip from "@/components/onboarding-tooltip";
import { useOnboarding } from "@/hooks/useOnboarding";
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

function Router() {
  const { showOnboarding, steps, completeOnboarding, skipOnboarding } = useOnboarding();

  return (
    <>
      {/* Unified Navigation */}
      <UnifiedNavigation />
      
      {/* Onboarding System */}
      <OnboardingTooltip
        steps={steps}
        isVisible={showOnboarding}
        onComplete={completeOnboarding}
        onSkip={skipOnboarding}
      />
      
      {/* Main Content */}
      <main className="min-h-screen bg-slate-50 pt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Switch>
            {/* Main Routes */}
            <Route path="/" component={Dashboard} />
            <Route path="/bid-estimator" component={Estimator} />
            <Route path="/schedule-manager" component={Scheduler} />
            <Route path="/material-prices" component={MaterialPrices} />
            <Route path="/real-estate-listings" component={RealEstateListings} />
            <Route path="/ai-assistant" component={AIAssistant} />
            <Route path="/opportunities" component={Opportunities} />
            <Route path="/about" component={About} />
            
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
          </Switch>
        </div>
      </main>
      
      {/* Feedback Widget */}
      <div data-onboarding="feedback-button">
        <FeedbackWidget />
      </div>
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
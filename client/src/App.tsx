import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Sidebar from "@/components/sidebar";
import ConsumerSidebar from "@/components/consumer-sidebar";
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
import ModeToggle from "@/components/mode-toggle";
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
import { FloatingFeedbackButton } from "@/components/feedback-form";

function Router() {
  return (
    <Switch>
      {/* Mode Selection */}
      <Route path="/mode-select" component={ModeToggle} />
      
      {/* Consumer Mode Routes - With Consumer Sidebar */}
      <Route path="/consumer-dashboard">
        <div className="min-h-screen bg-slate-50 flex">
          <ConsumerSidebar />
          <main className="flex-1 ml-0 md:ml-72 p-6">
            <ConsumerDashboard />
          </main>
        </div>
      </Route>
      <Route path="/consumer-estimator">
        <div className="min-h-screen bg-slate-50 flex">
          <ConsumerSidebar />
          <main className="flex-1 ml-0 md:ml-72 p-6">
            <ConsumerEstimator />
          </main>
        </div>
      </Route>
      <Route path="/quote-compare">
        <div className="min-h-screen bg-slate-50 flex">
          <ConsumerSidebar />
          <main className="flex-1 ml-0 md:ml-72 p-6">
            <QuoteCompare />
          </main>
        </div>
      </Route>
      <Route path="/estimate-wizard">
        <div className="min-h-screen bg-slate-50 flex">
          <ConsumerSidebar />
          <main className="flex-1 ml-0 md:ml-72 p-6">
            <EstimateWizard />
          </main>
        </div>
      </Route>
      <Route path="/smart-project-estimator">
        <div className="min-h-screen bg-slate-50 flex">
          <ConsumerSidebar />
          <main className="flex-1 ml-0 md:ml-72 p-6">
            <SmartProjectEstimator />
          </main>
        </div>
      </Route>
      <Route path="/budget-forecasting">
        <div className="min-h-screen bg-slate-50 flex">
          <ConsumerSidebar />
          <main className="flex-1 ml-0 md:ml-72 p-6">
            <BudgetForecasting />
          </main>
        </div>
      </Route>
      <Route path="/project-tracker">
        <div className="min-h-screen bg-slate-50 flex">
          <ConsumerSidebar />
          <main className="flex-1 ml-0 md:ml-72 p-6">
            <ProjectTracker />
          </main>
        </div>
      </Route>
      <Route path="/renovation-checklist">
        <div className="min-h-screen bg-slate-50 flex">
          <ConsumerSidebar />
          <main className="flex-1 ml-0 md:ml-72 p-6">
            <RenovationChecklist />
          </main>
        </div>
      </Route>
      <Route path="/ai-renovation-assistant">
        <div className="min-h-screen bg-slate-50 flex">
          <ConsumerSidebar />
          <main className="flex-1 ml-0 md:ml-72 p-6">
            <AIRenovationAssistant />
          </main>
        </div>
      </Route>
      <Route path="/renovation-concierge">
        <div className="min-h-screen bg-slate-50 flex">
          <ConsumerSidebar />
          <main className="flex-1 ml-0 md:ml-72 p-6">
            <RenovationConcierge />
          </main>
        </div>
      </Route>
      
      {/* Professional Mode Routes - With Sidebar */}
      <Route>
        <div className="min-h-screen bg-slate-50 flex">
          <Sidebar />
          <main className="flex-1 ml-0 md:ml-72 p-6">
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/estimator" component={Estimator} />
              <Route path="/scheduler" component={Scheduler} />
              <Route path="/opportunities" component={Opportunities} />
              <Route path="/ai-assistant" component={AIAssistant} />
              <Route path="/material-prices" component={MaterialPrices} />
              <Route path="/material-trends" component={MaterialTrends} />
              <Route path="/real-estate-listings" component={RealEstateListings} />
              <Route path="/roi-calculator" component={ROICalculator} />
              <Route path="/permit-lookup" component={PermitLookup} />
              <Route path="/flip-portfolio" component={FlipPortfolio} />
              <Route path="/project-scheduler" component={ProjectScheduler} />
              <Route path="/project-timeline" component={ProjectTimeline} />
              <Route path="/about" component={About} />
              <Route component={Dashboard} />
            </Switch>
          </main>
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <FloatingFeedbackButton />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

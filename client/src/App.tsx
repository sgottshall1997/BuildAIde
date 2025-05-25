import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Sidebar from "@/components/sidebar";
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
import { FloatingFeedbackButton } from "@/components/feedback-form";

function Router() {
  return (
    <Switch>
      {/* Consumer Mode Routes - Full Screen */}
      <Route path="/mode-select" component={ModeToggle} />
      <Route path="/consumer-dashboard" component={ConsumerDashboard} />
      <Route path="/consumer-estimator" component={ConsumerEstimator} />
      <Route path="/quote-compare" component={QuoteCompare} />
      
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
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

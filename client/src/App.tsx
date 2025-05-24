import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/navigation";
import Dashboard from "@/pages/dashboard";
import Estimator from "@/pages/estimator-new";
import Scheduler from "@/pages/scheduler";
import Opportunities from "@/pages/opportunities";
import About from "@/pages/about";
import AIAssistant from "@/pages/ai-assistant";
import RealEstateListings from "@/pages/real-estate-listings";
import ROICalculator from "@/pages/roi-calculator";
import PermitLookup from "@/pages/permit-lookup";
import FlipPortfolio from "@/pages/flip-portfolio";
import ProjectScheduler from "@/pages/project-scheduler";

function Router() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/estimator" component={Estimator} />
          <Route path="/scheduler" component={Scheduler} />
          <Route path="/opportunities" component={Opportunities} />
          <Route path="/ai-assistant" component={AIAssistant} />
          <Route path="/real-estate-listings" component={RealEstateListings} />
          <Route path="/roi-calculator" component={ROICalculator} />
          <Route path="/permit-lookup" component={PermitLookup} />
          <Route path="/flip-portfolio" component={FlipPortfolio} />
          <Route path="/project-scheduler" component={ProjectScheduler} />
          <Route path="/about" component={About} />
          <Route component={Dashboard} />
        </Switch>
      </main>
    </div>
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

import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink } from "lucide-react";

const waitlistUrl = import.meta.env.VITE_WAITLIST_URL || "#";

export default function Footer() {
  const handleWaitlistClick = () => {
    if (waitlistUrl !== "#") {
      window.open(waitlistUrl, '_blank');
    }
  };

  return (
    <footer className="bg-slate-900 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-slate-300">
              © 2025 ConstructionSmartTools – Built by Spencer
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Empowering smarter construction decisions with AI
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              onClick={handleWaitlistClick}
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Join Waitlist
              {waitlistUrl !== "#" ? (
                <ExternalLink className="ml-2 w-4 h-4" />
              ) : (
                <ArrowRight className="ml-2 w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
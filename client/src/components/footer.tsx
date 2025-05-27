import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "wouter";

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
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-bold text-white mb-4">
              BuildAIde
            </h3>
            <p className="text-sm text-slate-300 mb-4 max-w-md">
              AI-powered construction planning and estimation tools for professionals and homeowners. 
              Making project planning smarter, faster, and more accurate.
            </p>
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

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">
              Learn More
            </h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/about" 
                  className="text-sm text-slate-300 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/how-it-works" 
                  className="text-sm text-slate-300 hover:text-white transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <a 
                  href="/#features" 
                  className="text-sm text-slate-300 hover:text-white transition-colors"
                >
                  Features
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Tools */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">
              Legal & Tools
            </h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/privacy-policy" 
                  className="text-sm text-slate-300 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms-of-service" 
                  className="text-sm text-slate-300 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard" 
                  className="text-sm text-slate-300 hover:text-white transition-colors"
                >
                  Professional Tools
                </Link>
              </li>
              <li>
                <Link 
                  href="/consumer-dashboard" 
                  className="text-sm text-slate-300 hover:text-white transition-colors"
                >
                  Homeowner Tools
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-xs text-slate-400 mb-4 sm:mb-0">
              © 2025 BuildAIde – Built with AI technology to revolutionize construction planning.
            </p>
            <p className="text-xs text-slate-400">
              Built by Spencer G
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
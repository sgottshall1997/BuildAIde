import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, 
  TrendingUp, 
  FileCheck, 
  Bot, 
  ArrowRight, 
  CheckCircle,
  Users,
  Building,
  DollarSign,
  Home,
  Hammer,
  Target,
  Sparkles,
  Play
} from "lucide-react";
import { useLocation } from "wouter";

const waitlistUrl = import.meta.env.VITE_WAITLIST_URL || "#";

export default function Landing() {
  const [, setLocation] = useLocation();
  const [submitted, setSubmitted] = useState(false);

  const handleWaitlistSignup = () => {
    if (waitlistUrl !== "#") {
      window.open(waitlistUrl, '_blank');
    } else {
      // Fallback for demo - simulate signup
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  const handleConsumerMode = () => {
    setLocation("/consumer");
  };

  const handleProMode = () => {
    setLocation("/pro");
  };

  const handleDemoAccess = () => {
    setLocation("/dashboard?demo=true");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <Badge className="mb-6 bg-blue-100 text-blue-800 border-blue-200 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Now in Early Access
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Smart Tools for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Smarter Construction
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              AI-powered estimating, ROI insights, and permit planning — all in one place.
              Stop guessing, start knowing.
            </p>

            <div className="flex flex-col items-center mb-12">
              {/* Mode Selection */}
              <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl mb-8">
                <Card className="border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                      <Home className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">I'm a Homeowner/Investor</h3>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                      Planning renovations, evaluating ROI, or managing property investments. Get smart insights for better decisions.
                    </p>
                    <Button
                      onClick={handleConsumerMode}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                    >
                      Explore Consumer Tools
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-orange-200 hover:border-orange-400 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                      <Hammer className="w-8 h-8 text-orange-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">I'm a Contractor/Pro</h3>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                      Professional contractor, builder, or industry expert. Access advanced tools for bidding, scheduling, and project management.
                    </p>
                    <Button
                      onClick={handleProMode}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-lg font-semibold"
                    >
                      Access Pro Tools
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Secondary Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/demo">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-slate-300 hover:border-blue-500 px-6 py-3 text-base font-semibold transition-all duration-300"
                  >
                    <Play className="mr-2 w-4 h-4" />
                    Try Interactive Demo
                  </Button>
                </Link>
                
                <Button
                  onClick={handleWaitlistSignup}
                  variant="ghost"
                  size="lg"
                  className="text-blue-600 hover:text-blue-700 px-6 py-3 text-base font-semibold"
                >
                  Join Early Access List
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-8 text-sm text-slate-500">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                No Credit Card
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                Free Trial
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                Early Access Pricing
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Everything You Need in One Platform
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            From first estimate to final inspection, we've got the tools that actually work.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="border-2 border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Smart Estimating</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                AI-powered cost calculations with real market data. No more guessing on bids.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-slate-200 hover:border-green-300 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">ROI Analysis</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Instant profit projections and market insights for every project decision.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileCheck className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Permit Planning</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Automated permit research and requirements for any location.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-slate-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Bot className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">AI Assistant</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Expert construction advice and insights, available 24/7.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Social Proof */}
      <div className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Trusted by Construction Professionals
            </h2>
            <p className="text-xl text-slate-600">
              Join contractors, homeowners, and investors who are building smarter.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">85%</div>
              <div className="text-slate-600">More Accurate Estimates</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">3x</div>
              <div className="text-slate-600">Faster Bid Preparation</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">$50k+</div>
              <div className="text-slate-600">Average Annual Savings</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Build Smarter?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our early access program and get premium features at launch pricing.
            Limited spots available.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handleWaitlistSignup}
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {submitted ? (
                <>
                  <CheckCircle className="mr-2 w-5 h-5" />
                  Thanks! We'll be in touch
                </>
              ) : (
                <>
                  Get Early Access
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
          </div>

          <p className="text-sm text-blue-200 mt-4">
            No spam, just updates on your early access status
          </p>
        </div>
      </div>
    </div>
  );
}
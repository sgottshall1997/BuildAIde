import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { Building, Home, ArrowRight, Users, Calculator, TrendingUp } from "lucide-react";

interface ModeToggleProps {
  currentMode?: 'pro' | 'consumer';
  onModeChange?: (mode: 'pro' | 'consumer') => void;
}

export default function ModeToggle({ currentMode, onModeChange }: ModeToggleProps) {
  const [, setLocation] = useLocation();

  const handleModeSelect = (mode: 'pro' | 'consumer') => {
    // Store mode preference in session storage
    sessionStorage.setItem('userMode', mode);
    
    if (onModeChange) {
      onModeChange(mode);
    }
    
    if (mode === 'consumer') {
      setLocation('/consumer-dashboard');
    } else {
      setLocation('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Shall's Construction Smart Tools
          </h1>
          <p className="text-xl text-slate-600 mb-2">
            Choose your experience
          </p>
          <p className="text-slate-500">
            Professional construction management or homeowner-friendly tools
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Professional Mode */}
          <Card className="hover:shadow-lg transition-shadow border-2 hover:border-blue-200">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Building className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-slate-900">For Professionals</CardTitle>
              <CardDescription className="text-lg">
                Full-featured construction management platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calculator className="w-5 h-5 text-blue-600" />
                  <span className="text-slate-700">Advanced bid estimating</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-slate-700">Project scheduling & crews</span>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span className="text-slate-700">Material price tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <Home className="w-5 h-5 text-blue-600" />
                  <span className="text-slate-700">House flipping analysis</span>
                </div>
              </div>
              
              <Button 
                onClick={() => handleModeSelect('pro')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
              >
                Access Pro Tools
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <div className="text-center">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Full Feature Access
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Consumer Mode */}
          <Card className="hover:shadow-lg transition-shadow border-2 hover:border-green-200">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Home className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-slate-900">For Homeowners</CardTitle>
              <CardDescription className="text-lg">
                Simple, AI-powered renovation guidance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calculator className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700">Renovation cost estimates</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700">Contractor quote analysis</span>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700">Property flip potential</span>
                </div>
                <div className="flex items-center gap-3">
                  <Home className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700">AI-powered advice</span>
                </div>
              </div>
              
              <Button 
                onClick={() => handleModeSelect('consumer')}
                className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <div className="text-center">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Homeowner Friendly
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8 text-slate-500">
          <p>Not sure which to choose? Start with Homeowner mode - you can always switch later!</p>
        </div>
      </div>
    </div>
  );
}

// Simple mode switcher for navigation
export function ModeSwitcher({ currentMode }: { currentMode: 'pro' | 'consumer' }) {
  const [, setLocation] = useLocation();

  const switchMode = () => {
    if (currentMode === 'pro') {
      setLocation('/consumer-dashboard');
    } else {
      setLocation('/');
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={switchMode}
      className="flex items-center gap-2"
    >
      {currentMode === 'pro' ? (
        <>
          <Home className="w-4 h-4" />
          Homeowner Mode
        </>
      ) : (
        <>
          <Building className="w-4 h-4" />
          Pro Mode
        </>
      )}
    </Button>
  );
}
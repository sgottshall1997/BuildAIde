import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  MousePointer2, 
  Eye,
  Target,
  CheckCircle
} from "lucide-react";

interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  highlight: boolean;
}

interface DemoTourOverlayProps {
  isActive: boolean;
  onClose: () => void;
  isDemoUser: boolean;
}

export function DemoTourOverlay({ isActive, onClose, isDemoUser }: DemoTourOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const tourSteps: TourStep[] = [
    {
      id: 'mode-switch',
      title: 'Switch Between Modes',
      description: 'Toggle between Homeowner and Professional views to see different tools and features tailored to your needs.',
      target: '[data-tour="mode-toggle"]',
      position: 'bottom',
      highlight: true
    },
    {
      id: 'tool-selection',
      title: 'Explore Smart Tools',
      description: 'Each tool comes pre-filled with realistic sample data. Click any tool card to see instant results.',
      target: '[data-tour="tool-cards"]',
      position: 'top',
      highlight: true
    },
    {
      id: 'sample-data',
      title: 'Pre-filled Sample Data',
      description: 'All forms are pre-populated with realistic project scenarios so you can see results immediately.',
      target: '[data-tour="sample-preview"]',
      position: 'right',
      highlight: true
    },
    {
      id: 'result-interpretation',
      title: 'Understand Results',
      description: 'Results include detailed breakdowns, AI insights, and actionable recommendations for your projects.',
      target: '[data-tour="results-section"]',
      position: 'left',
      highlight: true
    },
    {
      id: 'export-options',
      title: 'Export & Share',
      description: 'Copy results, download as CSV, or print professional reports to share with clients or save for records.',
      target: '[data-tour="export-buttons"]',
      position: 'top',
      highlight: true
    }
  ];

  useEffect(() => {
    if (isActive && isDemoUser) {
      setIsVisible(true);
      // Add highlight classes to tour targets
      tourSteps.forEach(step => {
        const element = document.querySelector(step.target);
        if (element && step.highlight) {
          element.classList.add('tour-highlight');
        }
      });
    } else {
      setIsVisible(false);
      // Remove highlight classes
      document.querySelectorAll('.tour-highlight').forEach(el => {
        el.classList.remove('tour-highlight');
      });
    }

    return () => {
      document.querySelectorAll('.tour-highlight').forEach(el => {
        el.classList.remove('tour-highlight');
      });
    };
  }, [isActive, isDemoUser]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeTour = () => {
    setIsVisible(false);
    onClose();
    // Store tour completion in localStorage
    localStorage.setItem('demo-tour-completed', 'true');
  };

  const skipTour = () => {
    completeTour();
  };

  if (!isVisible || !isDemoUser) return null;

  const currentTourStep = tourSteps[currentStep];
  const targetElement = document.querySelector(currentTourStep.target);

  if (!targetElement) return null;

  const rect = targetElement.getBoundingClientRect();
  
  // Calculate tooltip position
  const getTooltipPosition = () => {
    const tooltipOffset = 20;
    const tooltipWidth = 320;
    const tooltipHeight = 200;

    switch (currentTourStep.position) {
      case 'top':
        return {
          top: rect.top - tooltipHeight - tooltipOffset,
          left: rect.left + (rect.width / 2) - (tooltipWidth / 2),
        };
      case 'bottom':
        return {
          top: rect.bottom + tooltipOffset,
          left: rect.left + (rect.width / 2) - (tooltipWidth / 2),
        };
      case 'left':
        return {
          top: rect.top + (rect.height / 2) - (tooltipHeight / 2),
          left: rect.left - tooltipWidth - tooltipOffset,
        };
      case 'right':
        return {
          top: rect.top + (rect.height / 2) - (tooltipHeight / 2),
          left: rect.right + tooltipOffset,
        };
      default:
        return {
          top: rect.bottom + tooltipOffset,
          left: rect.left,
        };
    }
  };

  const tooltipPosition = getTooltipPosition();

  return (
    <>
      {/* Overlay backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50 pointer-events-none">
        {/* Highlight cutout */}
        <div 
          className="absolute border-4 border-blue-400 rounded-lg shadow-2xl pointer-events-none"
          style={{
            top: rect.top - 4,
            left: rect.left - 4,
            width: rect.width + 8,
            height: rect.height + 8,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
          }}
        />
      </div>

      {/* Tour tooltip */}
      <Card 
        className="fixed z-50 w-80 shadow-2xl border-2 border-blue-200 pointer-events-auto"
        style={{
          top: Math.max(10, tooltipPosition.top),
          left: Math.max(10, Math.min(window.innerWidth - 330, tooltipPosition.left)),
        }}
      >
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Step {currentStep + 1} of {tourSteps.length}
              </Badge>
              <Target className="w-4 h-4 text-blue-600" />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={skipTour}
              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 text-lg">
              {currentTourStep.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {currentTourStep.description}
            </p>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-1 my-4">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full flex-1 ${
                  index <= currentStep ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={skipTour}
                className="text-gray-500"
              >
                Skip Tour
              </Button>
              
              <Button
                onClick={handleNext}
                size="sm"
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700"
              >
                {currentStep === tourSteps.length - 1 ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Done
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Tip */}
          <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700 flex items-center gap-2">
            <MousePointer2 className="w-3 h-3 flex-shrink-0" />
            <span>Click the highlighted area to interact with this feature</span>
          </div>
        </CardContent>
      </Card>

      {/* Add tour highlight styles */}
      <style>{`
        .tour-highlight {
          position: relative;
          z-index: 51;
        }
        
        .tour-highlight::before {
          content: '';
          position: absolute;
          inset: -4px;
          border: 2px solid #3b82f6;
          border-radius: 8px;
          background: rgba(59, 130, 246, 0.1);
          pointer-events: none;
          animation: tour-pulse 2s infinite;
        }
        
        @keyframes tour-pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.02);
          }
        }
      `}</style>
    </>
  );
}
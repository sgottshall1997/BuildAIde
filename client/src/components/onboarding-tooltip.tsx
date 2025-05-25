import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, ArrowRight, ArrowLeft, Lightbulb, Sparkles } from "lucide-react";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  targetSelector?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  highlight?: boolean;
}

interface OnboardingTooltipProps {
  steps: OnboardingStep[];
  isVisible: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export function OnboardingTooltip({ steps, isVisible, onComplete, onSkip }: OnboardingTooltipProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!isVisible || !steps[currentStep]?.targetSelector) return;

    const updatePosition = () => {
      const targetElement = document.querySelector(steps[currentStep].targetSelector!);
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const tooltipPosition = steps[currentStep].position || 'bottom';
        
        let top = 0;
        let left = 0;

        switch (tooltipPosition) {
          case 'top':
            top = rect.top - 10;
            left = rect.left + rect.width / 2;
            break;
          case 'bottom':
            top = rect.bottom + 10;
            left = rect.left + rect.width / 2;
            break;
          case 'left':
            top = rect.top + rect.height / 2;
            left = rect.left - 10;
            break;
          case 'right':
            top = rect.top + rect.height / 2;
            left = rect.right + 10;
            break;
        }

        setPosition({ top, left });

        // Add highlight effect to target element
        if (steps[currentStep].highlight) {
          targetElement.classList.add('onboarding-highlight');
        }
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
      
      // Remove highlight from all elements
      document.querySelectorAll('.onboarding-highlight').forEach(el => {
        el.classList.remove('onboarding-highlight');
      });
    };
  }, [currentStep, isVisible, steps]);

  if (!isVisible || steps.length === 0) return null;

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    // Remove highlights before skipping
    document.querySelectorAll('.onboarding-highlight').forEach(el => {
      el.classList.remove('onboarding-highlight');
    });
    onSkip();
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-20 z-40" onClick={handleSkip} />
      
      {/* Tooltip card */}
      <Card 
        className="fixed z-50 w-80 max-w-sm shadow-lg border-2 border-blue-200 bg-white"
        style={{
          top: currentStepData.targetSelector ? position.top : '50%',
          left: currentStepData.targetSelector ? position.left : '50%',
          transform: currentStepData.targetSelector 
            ? 'translate(-50%, 0)' 
            : 'translate(-50%, -50%)'
        }}
      >
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Lightbulb className="h-4 w-4 text-blue-600" />
              </div>
              <Badge variant="secondary" className="text-xs">
                Step {currentStep + 1} of {steps.length}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="p-1 h-auto text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="mb-4">
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-blue-500" />
              <span>{currentStepData.title}</span>
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {currentStepData.description}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={isFirstStep}
              className="flex items-center space-x-1"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>Previous</span>
            </Button>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-slate-500 hover:text-slate-700"
              >
                Skip Tour
              </Button>
              <Button
                onClick={handleNext}
                size="sm"
                className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700"
              >
                <span>{isLastStep ? 'Finish' : 'Next'}</span>
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add custom CSS for highlighting */}
      <style jsx global>{`
        .onboarding-highlight {
          position: relative;
          z-index: 30;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3), 0 0 0 8px rgba(59, 130, 246, 0.1);
          border-radius: 8px;
          animation: pulse-highlight 2s infinite;
        }
        
        @keyframes pulse-highlight {
          0%, 100% {
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3), 0 0 0 8px rgba(59, 130, 246, 0.1);
          }
          50% {
            box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.4), 0 0 0 12px rgba(59, 130, 246, 0.15);
          }
        }
      `}</style>
    </>
  );
}

export default OnboardingTooltip;
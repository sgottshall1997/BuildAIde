import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  targetSelector?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  highlight?: boolean;
}

const proModeSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Pro Mode!',
    description: 'You\'re using the professional construction management suite. Let\'s explore the key features that will streamline your business.',
    position: 'bottom'
  },
  {
    id: 'nav-dashboard',
    title: 'Smart Command Center',
    description: 'Your central hub showing project stats, upcoming inspections, and AI-powered insights.',
    targetSelector: '[data-onboarding="dashboard-nav"]',
    position: 'bottom',
    highlight: true
  },
  {
    id: 'bid-estimator',
    title: 'AI-Powered Estimating',
    description: 'Generate professional estimates with regional cost data and intelligent material calculations.',
    targetSelector: '[data-onboarding="estimator-nav"]',
    position: 'bottom',
    highlight: true
  },
  {
    id: 'property-hub',
    title: 'Property Intelligence Hub',
    description: 'Analyze flip opportunities, track ROI, and get AI-powered property insights all in one place.',
    targetSelector: '[data-onboarding="property-nav"]',
    position: 'bottom',
    highlight: true
  },
  {
    id: 'feedback',
    title: 'Share Your Feedback',
    description: 'Found something useful or need improvements? Use the feedback button to help us build better tools.',
    targetSelector: '[data-onboarding="feedback-button"]',
    position: 'left',
    highlight: true
  }
];

const consumerModeSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Your Renovation Assistant!',
    description: 'You\'re using the homeowner-friendly version. Let\'s show you how to plan and estimate your renovation projects.',
    position: 'bottom'
  },
  {
    id: 'renovation-planner',
    title: 'Renovation Planner',
    description: 'Start here to plan your dream renovation with step-by-step guidance and cost estimates.',
    targetSelector: '[data-onboarding="planner-nav"]',
    position: 'bottom',
    highlight: true
  },
  {
    id: 'cost-calculator',
    title: 'Cost Calculator',
    description: 'Get realistic cost estimates for your renovation projects with our intelligent calculator.',
    targetSelector: '[data-onboarding="calculator-nav"]',
    position: 'bottom',
    highlight: true
  },
  {
    id: 'expert-assistant',
    title: 'Expert Assistant',
    description: 'Chat with our AI assistant for professional advice and guidance on your renovation questions.',
    targetSelector: '[data-onboarding="assistant-nav"]',
    position: 'bottom',
    highlight: true
  }
];

export function useOnboarding() {
  const { userMode } = useAppContext();
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const storageKey = `onboarding-completed-${userMode}`;
  
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem(storageKey);
    if (!hasCompletedOnboarding) {
      // Small delay to ensure page is fully loaded
      setTimeout(() => setShowOnboarding(true), 1000);
    }
  }, [storageKey]);

  const completeOnboarding = () => {
    localStorage.setItem(storageKey, 'true');
    setShowOnboarding(false);
  };

  const skipOnboarding = () => {
    localStorage.setItem(storageKey, 'true');
    setShowOnboarding(false);
  };

  const restartOnboarding = () => {
    localStorage.removeItem(storageKey);
    setShowOnboarding(true);
  };

  const steps = userMode === 'pro' ? proModeSteps : consumerModeSteps;

  return {
    showOnboarding,
    steps,
    completeOnboarding,
    skipOnboarding,
    restartOnboarding,
  };
}

export default useOnboarding;
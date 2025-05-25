import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { getIsDemoMode, demoUserJourney } from '@/lib/demo-mode';

export type DemoUserType = 'first-time-homeowner' | 'experienced-contractor' | 'house-flipper';

interface DemoUserState {
  userType: DemoUserType | null;
  currentStep: number;
  completedSteps: number[];
  isActive: boolean;
}

export function useDemoUser() {
  const [location, setLocation] = useLocation();
  const [demoState, setDemoState] = useState<DemoUserState>({
    userType: null,
    currentStep: 0,
    completedSteps: [],
    isActive: false
  });

  const isDemoMode = getIsDemoMode();

  // Initialize demo user from sessionStorage
  useEffect(() => {
    if (!isDemoMode) return;

    const savedState = sessionStorage.getItem('demo_user_state');
    if (savedState) {
      try {
        setDemoState(JSON.parse(savedState));
      } catch (error) {
        console.error('Error parsing demo user state:', error);
      }
    }
  }, [isDemoMode]);

  // Save state to sessionStorage
  useEffect(() => {
    if (isDemoMode && demoState.isActive) {
      sessionStorage.setItem('demo_user_state', JSON.stringify(demoState));
    }
  }, [demoState, isDemoMode]);

  const startDemoUser = (userType: DemoUserType) => {
    const newState = {
      userType,
      currentStep: 0,
      completedSteps: [],
      isActive: true
    };
    setDemoState(newState);
    
    // Log demo start
    logUserInteraction('demo_user_started', { userType });
    
    // Navigate to first step
    const journey = demoUserJourney[userType];
    if (journey.journey.length > 0) {
      const firstStep = journey.journey[0];
      navigateToTool(firstStep.tool);
    }
  };

  const nextStep = () => {
    if (!demoState.userType || !demoState.isActive) return;

    const journey = demoUserJourney[demoState.userType];
    const currentStepIndex = demoState.currentStep;
    
    // Mark current step as completed
    const newCompletedSteps = [...demoState.completedSteps, currentStepIndex];
    
    // Move to next step
    const nextStepIndex = currentStepIndex + 1;
    
    if (nextStepIndex < journey.journey.length) {
      setDemoState(prev => ({
        ...prev,
        currentStep: nextStepIndex,
        completedSteps: newCompletedSteps
      }));
      
      const nextStepData = journey.journey[nextStepIndex];
      logUserInteraction('demo_step_completed', { 
        userType: demoState.userType,
        step: currentStepIndex,
        tool: nextStepData.tool
      });
      
      // Auto-navigate after a delay
      setTimeout(() => {
        navigateToTool(nextStepData.tool);
      }, 1000);
    } else {
      // Demo completed
      setDemoState(prev => ({
        ...prev,
        completedSteps: newCompletedSteps,
        isActive: false
      }));
      
      logUserInteraction('demo_user_completed', { 
        userType: demoState.userType,
        totalSteps: journey.journey.length
      });
    }
  };

  const skipToStep = (stepIndex: number) => {
    if (!demoState.userType || !demoState.isActive) return;

    const journey = demoUserJourney[demoState.userType];
    if (stepIndex >= 0 && stepIndex < journey.journey.length) {
      setDemoState(prev => ({
        ...prev,
        currentStep: stepIndex
      }));
      
      const stepData = journey.journey[stepIndex];
      navigateToTool(stepData.tool);
    }
  };

  const resetDemo = () => {
    setDemoState({
      userType: null,
      currentStep: 0,
      completedSteps: [],
      isActive: false
    });
    sessionStorage.removeItem('demo_user_state');
  };

  const getCurrentUserData = () => {
    if (!demoState.userType) return null;
    return demoUserJourney[demoState.userType];
  };

  const getCurrentStepData = () => {
    if (!demoState.userType) return null;
    const journey = demoUserJourney[demoState.userType];
    return journey.journey[demoState.currentStep];
  };

  const navigateToTool = (tool: string) => {
    const toolRoutes: Record<string, string> = {
      'dashboard': '/',
      'consumer-dashboard': '/consumer-dashboard',
      'concierge': '/renovation-concierge',
      'estimator': '/smart-project-estimator',
      'bid-estimator': '/bid-estimator',
      'permit-research': '/permit-research',
      'ai-assistant': '/ai-renovation-assistant',
      'material-prices': '/material-prices',
      'scheduler': '/schedule-manager',
      'real-estate-listings': '/real-estate-listings',
      'roi-calculator': '/roi-calculator',
      'material-trends': '/material-trends',
      'flip-portfolio': '/flip-portfolio'
    };

    const route = toolRoutes[tool];
    if (route) {
      setLocation(route);
    }
  };

  return {
    isDemoMode,
    demoState,
    startDemoUser,
    nextStep,
    skipToStep,
    resetDemo,
    getCurrentUserData,
    getCurrentStepData,
    isComplete: demoState.completedSteps.length === getCurrentUserData()?.journey.length
  };
}

// Analytics and logging utilities
export function logUserInteraction(event: string, data: any = {}) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    event,
    data,
    url: window.location.href,
    userAgent: navigator.userAgent,
    isDemoMode: getIsDemoMode()
  };

  // Store in localStorage for demo purposes
  const existingLogs = JSON.parse(localStorage.getItem('demo_analytics') || '[]');
  existingLogs.push(logEntry);
  
  // Keep only last 100 entries
  if (existingLogs.length > 100) {
    existingLogs.splice(0, existingLogs.length - 100);
  }
  
  localStorage.setItem('demo_analytics', JSON.stringify(existingLogs));
  
  // Also log to console in development
  if (import.meta.env.DEV) {
    console.log('📊 User Interaction:', event, data);
  }
}

export function getDemoAnalytics() {
  return JSON.parse(localStorage.getItem('demo_analytics') || '[]');
}

export function clearDemoAnalytics() {
  localStorage.removeItem('demo_analytics');
}
// Onboarding Feature Types
export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component?: string;
  completed: boolean;
  optional: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'contractor' | 'homeowner' | 'investor';
  experience: 'beginner' | 'intermediate' | 'expert';
  interests: string[];
  onboardingCompleted: boolean;
}

export interface TooltipConfig {
  id: string;
  target: string;
  title: string;
  content: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
  trigger: 'hover' | 'click' | 'auto';
}
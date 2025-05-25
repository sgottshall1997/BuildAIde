import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // User Mode
  userMode: 'professional' | 'consumer';
  setUserMode: (mode: 'professional' | 'consumer') => void;
  
  // Demo Mode
  isDemoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
  
  // Current Project Context
  currentProject: {
    id?: string;
    name?: string;
    type?: string;
    location?: string;
  } | null;
  setCurrentProject: (project: AppState['currentProject']) => void;
  
  // Global Loading States
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  
  // Error State
  globalError: string | null;
  setGlobalError: (error: string | null) => void;
  
  // Feature Flags
  features: {
    aiAssistant: boolean;
    materialPricing: boolean;
    propertyAnalysis: boolean;
  };
  setFeatureFlag: (feature: keyof AppState['features'], enabled: boolean) => void;
}

export const useAppState = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      userMode: 'professional',
      isDemoMode: false,
      currentProject: null,
      isLoading: false,
      globalError: null,
      features: {
        aiAssistant: true,
        materialPricing: true,
        propertyAnalysis: true,
      },
      
      // Actions
      setUserMode: (mode) => set({ userMode: mode }),
      setDemoMode: (enabled) => set({ isDemoMode: enabled }),
      setCurrentProject: (project) => set({ currentProject: project }),
      setLoading: (loading) => set({ isLoading: loading }),
      setGlobalError: (error) => set({ globalError: error }),
      setFeatureFlag: (feature, enabled) =>
        set((state) => ({
          features: { ...state.features, [feature]: enabled },
        })),
    }),
    {
      name: 'construction-smart-tools-state',
      partialize: (state) => ({
        userMode: state.userMode,
        isDemoMode: state.isDemoMode,
        features: state.features,
      }),
    }
  )
);
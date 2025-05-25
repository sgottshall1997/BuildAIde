import React, { createContext, useContext, useState, ReactNode } from 'react';

// App State Types
interface AppState {
  // Demo mode flag
  isDemoMode: boolean;
  setIsDemoMode: (value: boolean) => void;
  
  // User mode (Pro vs Consumer)
  userMode: 'pro' | 'consumer';
  setUserMode: (mode: 'pro' | 'consumer') => void;
  
  // Current project info
  currentProject: {
    id?: string;
    name?: string;
    address?: string;
    type?: string;
  } | null;
  setCurrentProject: (project: any) => void;
  
  // Usage tracking for freemium logic
  usageCount: number;
  incrementUsage: () => void;
  resetUsage: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [userMode, setUserMode] = useState<'pro' | 'consumer'>('pro');
  const [currentProject, setCurrentProject] = useState(null);
  const [usageCount, setUsageCount] = useState(0);

  const incrementUsage = () => {
    setUsageCount(prev => prev + 1);
  };

  const resetUsage = () => {
    setUsageCount(0);
  };

  const value: AppState = {
    isDemoMode,
    setIsDemoMode,
    userMode,
    setUserMode,
    currentProject,
    setCurrentProject,
    usageCount,
    incrementUsage,
    resetUsage,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
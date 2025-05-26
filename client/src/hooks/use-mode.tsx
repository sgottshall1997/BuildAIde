import { createContext, useContext, useState, ReactNode } from 'react';

type Mode = 'pro' | 'consumer';

interface ModeContextType {
  currentMode: Mode;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: ReactNode }) {
  const [currentMode, setCurrentMode] = useState<Mode>('consumer');

  const setMode = (mode: Mode) => {
    setCurrentMode(mode);
  };

  const toggleMode = () => {
    setCurrentMode(currentMode === 'pro' ? 'consumer' : 'pro');
  };

  return (
    <ModeContext.Provider value={{ currentMode, setMode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
}
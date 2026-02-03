import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FloatingJournalVisibilityContextType {
  isVisible: boolean;
  hide: () => void;
  show: () => void;
}

const FloatingJournalVisibilityContext = createContext<FloatingJournalVisibilityContextType | undefined>(undefined);

export function FloatingJournalVisibilityProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <FloatingJournalVisibilityContext.Provider
      value={{
        isVisible,
        hide: () => setIsVisible(false),
        show: () => setIsVisible(true),
      }}
    >
      {children}
    </FloatingJournalVisibilityContext.Provider>
  );
}

export function useFloatingJournalVisibility() {
  const context = useContext(FloatingJournalVisibilityContext);
  if (!context) {
    throw new Error('useFloatingJournalVisibility must be used within FloatingJournalVisibilityProvider');
  }
  return context;
}

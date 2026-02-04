import { createContext, useContext, useState, ReactNode } from 'react';

interface JournalOverlayController {
  isOpen: boolean;
  resetToToday: boolean;
  openJournal: (options?: { resetToToday?: boolean }) => void;
  closeJournal: () => void;
}

const JournalOverlayControllerContext = createContext<JournalOverlayController | null>(null);

export function JournalOverlayControllerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [resetToToday, setResetToToday] = useState(false);

  const openJournal = (options?: { resetToToday?: boolean }) => {
    setResetToToday(options?.resetToToday ?? false);
    setIsOpen(true);
  };

  const closeJournal = () => {
    setIsOpen(false);
    setResetToToday(false);
  };

  return (
    <JournalOverlayControllerContext.Provider
      value={{ isOpen, resetToToday, openJournal, closeJournal }}
    >
      {children}
    </JournalOverlayControllerContext.Provider>
  );
}

export function useJournalOverlayController() {
  const context = useContext(JournalOverlayControllerContext);
  if (!context) {
    throw new Error('useJournalOverlayController must be used within JournalOverlayControllerProvider');
  }
  return context;
}

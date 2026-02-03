import { useState } from 'react';
import { Outlet } from '@tanstack/react-router';
import AppHeader from './AppHeader';
import BottomNav from './BottomNav';
import FloatingJournalFab from './FloatingJournalFab';
import JournalOverlay from '../journal/JournalOverlay';
import { FloatingJournalVisibilityProvider } from '@/contexts/FloatingJournalVisibilityContext';

export default function AppLayout() {
  const [isJournalOpen, setIsJournalOpen] = useState(false);

  return (
    <FloatingJournalVisibilityProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <AppHeader onOpenJournal={() => setIsJournalOpen(true)} />
        <main className="flex-1 pb-16">
          <Outlet />
        </main>
        <BottomNav />
        <FloatingJournalFab />
        <JournalOverlay isOpen={isJournalOpen} onClose={() => setIsJournalOpen(false)} />
      </div>
    </FloatingJournalVisibilityProvider>
  );
}

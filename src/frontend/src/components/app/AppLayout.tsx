import { Outlet } from '@tanstack/react-router';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import BottomNav from './BottomNav';
import FloatingJournalFab from './FloatingJournalFab';
import JournalOverlay from '../journal/JournalOverlay';
import SoundEffectsManager from '../sound/SoundEffectsManager';
import { FloatingJournalVisibilityProvider } from '@/contexts/FloatingJournalVisibilityContext';
import { JournalOverlayControllerProvider, useJournalOverlayController } from '@/contexts/JournalOverlayControllerContext';

function AppLayoutContent() {
  const { isOpen, resetToToday, closeJournal } = useJournalOverlayController();

  return (
    <FloatingJournalVisibilityProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <AppHeader />
        <main className="flex-1 pb-safe-offset-16">
          <Outlet />
        </main>
        <AppFooter />
        <BottomNav />
        <FloatingJournalFab />
        <JournalOverlay isOpen={isOpen} onClose={closeJournal} resetToToday={resetToToday} />
        <SoundEffectsManager />
      </div>
    </FloatingJournalVisibilityProvider>
  );
}

export default function AppLayout() {
  return (
    <JournalOverlayControllerProvider>
      <AppLayoutContent />
    </JournalOverlayControllerProvider>
  );
}

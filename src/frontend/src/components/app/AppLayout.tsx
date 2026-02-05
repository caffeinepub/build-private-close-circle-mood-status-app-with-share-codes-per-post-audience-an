import { Outlet } from '@tanstack/react-router';
import AppHeader from './AppHeader';
import BottomNav from './BottomNav';
import FloatingJournalFab from './FloatingJournalFab';
import JournalOverlay from '../journal/JournalOverlay';
import SoundEffectsManager from '../sound/SoundEffectsManager';
import { FloatingJournalVisibilityProvider } from '@/contexts/FloatingJournalVisibilityContext';
import { JournalOverlayControllerProvider, useJournalOverlayController } from '@/contexts/JournalOverlayControllerContext';

interface AppLayoutProps {
  children?: React.ReactNode;
}

function AppLayoutContent({ children }: AppLayoutProps) {
  const { isOpen, resetToToday, closeJournal } = useJournalOverlayController();

  return (
    <FloatingJournalVisibilityProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <AppHeader />
        <main className="flex-1 pb-safe-offset-16">
          {children || <Outlet />}
        </main>
        <BottomNav />
        <FloatingJournalFab />
        <JournalOverlay isOpen={isOpen} onClose={closeJournal} resetToToday={resetToToday} />
        <SoundEffectsManager />
      </div>
    </FloatingJournalVisibilityProvider>
  );
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <JournalOverlayControllerProvider>
      <AppLayoutContent children={children} />
    </JournalOverlayControllerProvider>
  );
}

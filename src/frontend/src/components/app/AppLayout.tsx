import { useEffect } from 'react';
import { Outlet, useNavigate } from '@tanstack/react-router';
import AppHeader from './AppHeader';
import BottomNav from './BottomNav';
import AppFooter from './AppFooter';
import FloatingJournalFab from './FloatingJournalFab';
import JournalOverlay from '../journal/JournalOverlay';
import SoundEffectsManager from '../sound/SoundEffectsManager';
import { FloatingJournalVisibilityProvider } from '@/contexts/FloatingJournalVisibilityContext';
import { JournalOverlayControllerProvider, useJournalOverlayController } from '@/contexts/JournalOverlayControllerContext';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';

interface AppLayoutProps {
  children?: React.ReactNode;
}

function AppLayoutContent({ children }: AppLayoutProps) {
  const { isOpen, resetToToday, closeJournal } = useJournalOverlayController();
  const { identity, isInitializing } = useInternetIdentity();
  const navigate = useNavigate();

  // Redirect to homepage if user logs out while on an authenticated route
  useEffect(() => {
    if (!identity && !isInitializing) {
      navigate({ to: '/', replace: true });
    }
  }, [identity, isInitializing, navigate]);

  return (
    <FloatingJournalVisibilityProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <AppHeader />
        <main className="flex-1 pb-bottom-bars-safe">
          {children || <Outlet />}
        </main>
        <div className="fixed bottom-0 left-0 right-0 z-40">
          <BottomNav />
          <AppFooter />
        </div>
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

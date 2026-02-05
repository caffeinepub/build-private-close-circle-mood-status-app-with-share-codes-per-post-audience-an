import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import PublicHomePage from './PublicHomePage';
import FeedPage from './FeedPage';
import AppLayout from '@/components/app/AppLayout';
import ProfileGate from '@/components/profile/ProfileGate';

export default function HomeRoutePage() {
  const { identity, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return <PublicHomePage />;
  }

  return (
    <ProfileGate>
      <AppLayout>
        <FeedPage />
      </AppLayout>
    </ProfileGate>
  );
}

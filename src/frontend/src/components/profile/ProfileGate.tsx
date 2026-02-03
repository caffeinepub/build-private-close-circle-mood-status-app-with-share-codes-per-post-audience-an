import { useGetCallerUserProfile } from '@/hooks/useQueries';
import ProfileSetupDialog from './ProfileSetupDialog';

interface ProfileGateProps {
  children: React.ReactNode;
}

export default function ProfileGate({ children }: ProfileGateProps) {
  const { data: userProfile, isLoading, isFetched } = useGetCallerUserProfile();

  const showProfileSetup = !isLoading && isFetched && userProfile === null;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Preparing your space...</p>
        </div>
      </div>
    );
  }

  if (showProfileSetup) {
    return <ProfileSetupDialog />;
  }

  return <>{children}</>;
}

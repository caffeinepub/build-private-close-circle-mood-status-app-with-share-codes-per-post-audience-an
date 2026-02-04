import { useGetCallerUserProfile } from '@/hooks/useQueries';
import { useActorWithError } from '@/hooks/useActorWithError';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import ProfileSetupDialog from './ProfileSetupDialog';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface ProfileGateProps {
  children: React.ReactNode;
}

export default function ProfileGate({ children }: ProfileGateProps) {
  const { data: userProfile, isLoading: profileLoading, isFetched, isError: profileError } = useGetCallerUserProfile();
  const { isError: actorError, refetch: refetchActor } = useActorWithError();
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isLoading = profileLoading;
  const showProfileSetup = !isLoading && isFetched && userProfile === null && !profileError && !actorError;
  const hasError = profileError || actorError;

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

  if (hasError) {
    const handleTryAgain = async () => {
      // Refetch actor initialization first
      await refetchActor();
      // Then invalidate and refetch profile
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    };

    const handleLogout = async () => {
      await clear();
      queryClient.clear();
    };

    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="flex max-w-md flex-col items-center gap-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Something went wrong</h2>
            <p className="text-sm text-muted-foreground">
              We couldn't load your profile. This might be a temporary connection issue.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <Button onClick={handleTryAgain} className="flex-1">
              Try again
            </Button>
            <Button onClick={handleLogout} variant="outline" className="flex-1">
              Log out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (showProfileSetup) {
    return <ProfileSetupDialog />;
  }

  return <>{children}</>;
}

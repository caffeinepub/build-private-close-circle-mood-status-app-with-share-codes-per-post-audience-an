import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useJoinCircleFromShareCode } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, AlertCircle } from 'lucide-react';
import { APP_NAME } from '@/constants/branding';
import { getStoredInviteCode, clearStoredInviteCode, storeInviteCode } from '@/utils/inviteCodeSession';
import { toast } from 'sonner';

export default function InviteCodeAuthStepPage() {
  const navigate = useNavigate();
  const { identity, login, isLoggingIn, isLoginError, loginError } = useInternetIdentity();
  const joinMutation = useJoinCircleFromShareCode();
  const [inviteCode, setInviteCode] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  useEffect(() => {
    const stored = getStoredInviteCode();
    if (stored) {
      setInviteCode(stored);
    } else {
      // No code stored, redirect back to homepage using replace to avoid stale history entry
      navigate({ to: '/', replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    // After successful login, attempt to join the circle
    if (identity && inviteCode && !joinMutation.isPending && !joinMutation.isSuccess) {
      handleJoinCircle();
    }
  }, [identity, inviteCode]);

  const handleJoinCircle = async () => {
    if (!inviteCode) return;

    try {
      setJoinError(null);
      await joinMutation.mutateAsync(inviteCode);
      clearStoredInviteCode();
      toast.success('Successfully joined the circle!');
      // Use replace to remove invite-auth page from history after successful join
      navigate({ to: '/', replace: true });
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to join circle. Please check your code and try again.';
      setJoinError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  const handleEditCode = () => {
    setIsEditing(true);
  };

  const handleSaveCode = () => {
    if (inviteCode.trim()) {
      storeInviteCode(inviteCode);
      setIsEditing(false);
      setJoinError(null);
    }
  };

  const handleClearAndRestart = () => {
    clearStoredInviteCode();
    navigate({ to: '/', replace: true });
  };

  if (!inviteCode) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Heart className="h-12 w-12 text-primary" fill="currentColor" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{APP_NAME}</h1>
          <p className="mt-2 text-muted-foreground">
            {identity ? 'Joining your circle...' : 'One more step'}
          </p>
        </div>

        <Card className="border-2">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">
              {identity ? 'Almost there' : 'Sign in to continue'}
            </CardTitle>
            <CardDescription>
              {identity ? 'Connecting you to the circle' : 'You need to log in or create an account'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="codeDisplay">Your invite code</Label>
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    id="codeDisplay"
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    className="uppercase font-mono"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveCode}
                      size="sm"
                      className="flex-1"
                      disabled={!inviteCode.trim()}
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => {
                        setInviteCode(getStoredInviteCode() || '');
                        setIsEditing(false);
                      }}
                      size="sm"
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Input
                    id="codeDisplay"
                    type="text"
                    value={inviteCode}
                    readOnly
                    className="uppercase font-mono"
                  />
                  <Button
                    onClick={handleEditCode}
                    size="sm"
                    variant="outline"
                  >
                    Edit
                  </Button>
                </div>
              )}
            </div>

            {joinError && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p>{joinError}</p>
                </div>
              </div>
            )}

            {isLoginError && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {loginError?.message || 'Login failed. Try again.'}
              </div>
            )}

            {!identity ? (
              <Button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="w-full"
                size="lg"
              >
                {isLoggingIn ? 'Logging in...' : 'Log in or create account'}
              </Button>
            ) : joinMutation.isPending ? (
              <div className="flex items-center justify-center py-4">
                <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : joinError ? (
              <div className="space-y-2">
                <Button
                  onClick={handleJoinCircle}
                  className="w-full"
                  size="lg"
                >
                  Retry
                </Button>
                <Button
                  onClick={handleEditCode}
                  variant="outline"
                  className="w-full"
                >
                  Edit code
                </Button>
              </div>
            ) : null}

            <Button
              onClick={handleClearAndRestart}
              variant="ghost"
              className="w-full"
            >
              Start over
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

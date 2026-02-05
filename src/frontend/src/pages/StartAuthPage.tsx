import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { APP_NAME } from '@/constants/branding';

export default function StartAuthPage() {
  const navigate = useNavigate();
  const { identity, login, isLoggingIn, isLoginError, loginError } = useInternetIdentity();

  useEffect(() => {
    // After successful login, redirect to the main app using replace to remove auth page from history
    if (identity) {
      navigate({ to: '/', replace: true });
    }
  }, [identity, navigate]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  const handleBack = () => {
    navigate({ to: '/', replace: true });
  };

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
            Create your account
          </p>
        </div>

        <Card className="border-2">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Get started</CardTitle>
            <CardDescription>
              Log in or create a new account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoginError && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {loginError?.message || 'Login failed. Try again.'}
              </div>
            )}

            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full"
              size="lg"
            >
              {isLoggingIn ? 'Logging in...' : 'Log in or create account'}
            </Button>

            <Button
              onClick={handleBack}
              variant="ghost"
              className="w-full"
            >
              Back
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              By signing in, you agree to keep this space safe
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

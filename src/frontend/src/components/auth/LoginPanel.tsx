import { useMemo } from 'react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Lock, Users } from 'lucide-react';
import { APP_NAME } from '@/constants/branding';
import { heroSubtexts, cardSubheadings, pickRandomPhrase } from '@/constants/loginCopy';

export default function LoginPanel() {
  const { login, isLoggingIn, isLoginError, loginError } = useInternetIdentity();

  // Pick random phrases once on mount, stable during session
  const heroSubtext = useMemo(() => pickRandomPhrase(heroSubtexts), []);
  const cardSubheading = useMemo(() => pickRandomPhrase(cardSubheadings), []);

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
            {heroSubtext}
          </p>
        </div>

        <Card className="border-2">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Welcome</CardTitle>
            <CardDescription>
              {cardSubheading}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                <Lock className="mt-0.5 h-5 w-5 text-primary" />
                <div className="flex-1 text-sm">
                  <p className="font-medium">Private & Secure</p>
                  <p className="text-muted-foreground">Invite-only access with your personal share code</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                <Users className="mt-0.5 h-5 w-5 text-primary" />
                <div className="flex-1 text-sm">
                  <p className="font-medium">Your Trusted Circle</p>
                  <p className="text-muted-foreground">Share moods and updates with selected loved ones</p>
                </div>
              </div>
            </div>

            {isLoginError && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {loginError?.message || 'Login failed. Please try again.'}
              </div>
            )}

            <Button
              onClick={login}
              disabled={isLoggingIn}
              className="w-full"
              size="lg"
            >
              {isLoggingIn ? 'Logging you in...' : 'Log in to your safe space'}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              By signing in, you agree to keep this space safe and respectful
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, Lock, Users } from 'lucide-react';
import { APP_NAME } from '@/constants/branding';
import { storeInviteCode } from '@/utils/inviteCodeSession';
import { FOUNDATION_PROMISE, FOUNDATION_BOUNDARY } from '@/constants/foundationCopy';
import ProgressiveDisclosure from '@/components/common/ProgressiveDisclosure';

export default function PublicHomePage() {
  const navigate = useNavigate();
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [inviteCode, setInviteCode] = useState('');

  const handlePrimaryCTA = () => {
    setShowCodeInput(true);
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    
    storeInviteCode(inviteCode);
    navigate({ to: '/invite-auth' });
  };

  const handleCreateAccount = () => {
    navigate({ to: '/start-auth' });
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
          <p className="mt-1 text-[10px] text-muted-foreground/60">
            Built by Abel Odoh
          </p>
          <p className="mt-2 text-muted-foreground">
            Share what you choose, when you choose.
          </p>
        </div>

        <Card className="border-2">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Welcome</CardTitle>
            <CardDescription>
              Your circle's here
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                <Lock className="mt-0.5 h-5 w-5 text-primary" />
                <div className="flex-1 text-sm">
                  <p className="font-medium">Private & Secure</p>
                  <p className="text-muted-foreground">Invite-only with your code</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                <Users className="mt-0.5 h-5 w-5 text-primary" />
                <div className="flex-1 text-sm">
                  <p className="font-medium">Your Circle</p>
                  <p className="text-muted-foreground">Share with chosen people</p>
                </div>
              </div>
            </div>

            <ProgressiveDisclosure trigger="More">
              <div className="space-y-2 rounded-lg border border-primary/20 bg-primary/5 p-4">
                <p className="text-sm leading-relaxed text-foreground/90">
                  {FOUNDATION_PROMISE}
                </p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {FOUNDATION_BOUNDARY}
                </p>
              </div>
            </ProgressiveDisclosure>

            {!showCodeInput ? (
              <>
                <Button
                  onClick={handlePrimaryCTA}
                  className="w-full"
                  size="lg"
                >
                  Have an invite code? Join circle
                </Button>

                <div className="text-center">
                  <button
                    onClick={handleCreateAccount}
                    className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
                  >
                    No code? Create an account/Login
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleCodeSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="inviteCode">Enter invite code</Label>
                  <Input
                    id="inviteCode"
                    type="text"
                    placeholder="ABC123"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    className="uppercase"
                    autoFocus
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the code shared by your circle member
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={!inviteCode.trim()}
                >
                  Continue
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setShowCodeInput(false);
                    setInviteCode('');
                  }}
                >
                  Back
                </Button>
              </form>
            )}

            <p className="text-center text-xs text-muted-foreground">
              By signing in, you agree to keep this space safe
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

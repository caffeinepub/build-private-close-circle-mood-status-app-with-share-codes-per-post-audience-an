import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGetSafePeople, usePostSilentSignal } from '@/hooks/useQueries';
import { Mood } from '@/backend';
import { CloudOff, Info } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';

const SILENT_SIGNALS = [
  { mood: Mood.tired, content: 'Low energy today' },
  { mood: Mood.calm, content: 'Okay, just quiet' },
];

export default function SilentSignalComposerCard() {
  const { data: safePeople = [], isLoading } = useGetSafePeople();
  const postSilentSignal = usePostSilentSignal();
  const navigate = useNavigate();
  const [sending, setSending] = useState<string | null>(null);

  const hasSafePeople = safePeople.length > 0;

  const handleSend = async (mood: Mood, content: string) => {
    if (!hasSafePeople) {
      toast.error('Please set up Safe People first');
      return;
    }

    setSending(content);
    try {
      await postSilentSignal.mutateAsync({ mood, content });
      toast.success('Silent signal sent to your Safe People');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send silent signal');
    } finally {
      setSending(null);
    }
  };

  return (
    <Card className="border-primary/10 bg-gradient-to-br from-background to-muted/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <CloudOff className="h-5 w-5 text-muted-foreground" />
          Silent Signal
        </CardTitle>
        <CardDescription>
          Low-pressure check-ins for your Safe People only
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {!hasSafePeople ? (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between gap-2">
              <span className="text-sm">Set up Safe People to send silent signals</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate({ to: '/circle', search: { tab: 'safe' } })}
              >
                Set Up
              </Button>
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {SILENT_SIGNALS.map((signal) => (
                <Button
                  key={signal.content}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSend(signal.mood, signal.content)}
                  disabled={sending !== null || isLoading}
                  className="flex-1 min-w-[140px]"
                >
                  {sending === signal.content ? (
                    <span className="flex items-center gap-2">
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Sending...
                    </span>
                  ) : (
                    signal.content
                  )}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Visible only to your {safePeople.length} Safe {safePeople.length === 1 ? 'Person' : 'People'}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

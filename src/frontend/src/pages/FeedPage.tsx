import { useState, useEffect } from 'react';
import { useGetFeed } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import StatusCard from '@/components/status/StatusCard';
import MoodCheckInReminderCard from '@/components/feed/MoodCheckInReminderCard';
import { RefreshCw, PlusCircle } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { shouldShowReminder } from '@/utils/moodReminder';

export default function FeedPage() {
  const { data: feed = [], isLoading, refetch, isRefetching } = useGetFeed();
  const navigate = useNavigate();
  const [showReminder, setShowReminder] = useState(false);

  useEffect(() => {
    setShowReminder(shouldShowReminder());
  }, []);

  const handleRefresh = () => {
    refetch();
  };

  const handleReminderDismiss = () => {
    setShowReminder(false);
  };

  return (
    <div className="container max-w-2xl py-8 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Feed</h1>
          <p className="text-muted-foreground">Updates from your circle</p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          disabled={isRefetching}
        >
          <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {showReminder && <MoodCheckInReminderCard onDismiss={handleReminderDismiss} />}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : feed.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <p className="text-muted-foreground">No status updates yet</p>
            <p className="text-sm text-muted-foreground/80">Quiet days are okay too.</p>
            <Button onClick={() => navigate({ to: '/compose' })}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Post Your First Status
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {feed.map((status) => (
            <StatusCard key={status.id} status={status} hideAudience />
          ))}
        </div>
      )}
    </div>
  );
}

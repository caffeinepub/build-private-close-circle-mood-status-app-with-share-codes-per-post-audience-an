import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, X } from 'lucide-react';
import { shouldShowReminder, dismissReminderForToday } from '@/utils/moodReminder';

interface MoodCheckInReminderCardProps {
  onDismiss?: () => void;
}

export default function MoodCheckInReminderCard({ onDismiss }: MoodCheckInReminderCardProps) {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(shouldShowReminder());
  }, []);

  const handleDismiss = () => {
    dismissReminderForToday();
    setIsVisible(false);
    onDismiss?.();
  };

  const handleCheckIn = () => {
    navigate({ to: '/compose', search: { from: 'mood-reminder' } });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardContent className="py-4 px-5">
        <div className="flex items-start gap-3">
          <div className="shrink-0 mt-0.5">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold mb-1">Ready to check in?</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Choose a mood to share with your circle today.
            </p>
            <Button size="sm" onClick={handleCheckIn} className="h-8 text-xs">
              Select a Mood
            </Button>
          </div>
          <button
            onClick={handleDismiss}
            className="shrink-0 h-6 w-6 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
            aria-label="Dismiss reminder"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

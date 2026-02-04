import { useGetUserProfile } from '@/hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getMoodOption } from '@/constants/moods';
import { getMoodColorClasses } from '@/utils/moodColors';
import type { SilentSignal } from '@/backend';
import { formatDistanceToNow } from 'date-fns';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { CloudOff } from 'lucide-react';

interface SilentSignalCardProps {
  signal: SilentSignal;
}

export default function SilentSignalCard({ signal }: SilentSignalCardProps) {
  const { identity } = useInternetIdentity();
  const { data: authorProfile } = useGetUserProfile(signal.author);

  const moodOption = getMoodOption(signal.mood);
  const isOwnSignal = identity?.getPrincipal().toString() === signal.author.toString();

  const authorName = authorProfile?.name || `User ${signal.author.toString().slice(0, 8)}...`;

  const moodColorClasses = moodOption ? getMoodColorClasses(moodOption.category) : null;

  return (
    <Card className={`border-muted/50 bg-muted/20 ${moodColorClasses ? `${moodColorClasses.border} border-l-4` : ''}`}>
      <CardContent className="pt-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CloudOff className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">Silent Signal</p>
              {isOwnSignal && <Badge variant="secondary" className="text-xs">You</Badge>}
            </div>
            <p className="text-xs text-muted-foreground">
              {authorName} · {formatDistanceToNow(Number(signal.createdAt) / 1_000_000, { addSuffix: true })}
            </p>
          </div>
        </div>

        <div className={`flex items-center gap-3 rounded-lg p-3 ${moodColorClasses ? moodColorClasses.bg : 'bg-background/50'}`}>
          <span className="text-2xl">{moodOption?.emoji || '😐'}</span>
          <div className="flex-1">
            <p className={`text-sm font-medium ${moodColorClasses ? moodColorClasses.text : ''}`}>
              {signal.content}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

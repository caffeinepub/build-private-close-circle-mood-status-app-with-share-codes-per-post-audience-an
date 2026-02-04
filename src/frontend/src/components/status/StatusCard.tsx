import { useGetUserProfile } from '@/hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getMoodOption } from '@/constants/moods';
import { getMoodColorClasses } from '@/utils/moodColors';
import type { StatusPost } from '@/backend';
import { formatDistanceToNow } from 'date-fns';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';

interface StatusCardProps {
  status: StatusPost;
  hideAudience?: boolean;
}

export default function StatusCard({ status, hideAudience = false }: StatusCardProps) {
  const { identity } = useInternetIdentity();
  const { data: authorProfile } = useGetUserProfile(status.author);

  const moodOption = getMoodOption(status.mood);
  const isOwnStatus = identity?.getPrincipal().toString() === status.author.toString();

  const authorName = authorProfile?.name || `User ${status.author.toString().slice(0, 8)}...`;

  const moodColorClasses = moodOption ? getMoodColorClasses(moodOption.category) : null;

  return (
    <Card className={moodColorClasses ? `${moodColorClasses.border} border-l-4` : ''}>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <p className="font-semibold">{authorName}</p>
              {isOwnStatus && <Badge variant="secondary">You</Badge>}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(Number(status.createdAt) / 1_000_000, { addSuffix: true })}
            </p>
          </div>
        </div>

        <div className={`flex items-center gap-3 rounded-lg p-4 ${moodColorClasses ? moodColorClasses.bg : 'bg-muted/50'}`}>
          <span className="text-4xl">{moodOption?.emoji || '😐'}</span>
          <div className="flex-1">
            <p className={`font-medium text-lg ${moodColorClasses ? moodColorClasses.text : ''}`}>
              {moodOption?.label || 'Neutral'}
            </p>
            {status.content && <p className="text-sm text-muted-foreground mt-1">{status.content}</p>}
          </div>
        </div>

        {!hideAudience && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>
              Shared with {status.audience.length} {status.audience.length === 1 ? 'person' : 'people'}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

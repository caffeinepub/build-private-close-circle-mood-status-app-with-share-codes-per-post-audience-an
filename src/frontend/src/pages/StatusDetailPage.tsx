import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetStatus } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import StatusCard from '@/components/status/StatusCard';
import { ArrowLeft } from 'lucide-react';
import { FOUNDATION_BOUNDARY } from '@/constants/foundationCopy';

export default function StatusDetailPage() {
  const { statusId } = useParams({ from: '/status/$statusId' });
  const navigate = useNavigate();
  const { data: status, isLoading, error } = useGetStatus(statusId);

  if (isLoading) {
    return (
      <div className="container max-w-2xl py-8 px-4">
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (error || !status) {
    return (
      <div className="container max-w-2xl py-8 px-4 space-y-6">
        <Button variant="ghost" onClick={() => navigate({ to: '/' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Feed
        </Button>
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <p className="text-muted-foreground">
              {error ? 'You do not have permission to view this status' : 'Status not found'}
            </p>
            <div className="mx-auto max-w-md space-y-2 rounded-lg border border-primary/20 bg-primary/5 p-4 text-left">
              <p className="text-xs leading-relaxed text-muted-foreground">
                {FOUNDATION_BOUNDARY}
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate({ to: '/' })}>
              Return to Feed
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-8 px-4 space-y-6">
      <Button variant="ghost" onClick={() => navigate({ to: '/' })}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Feed
      </Button>
      <StatusCard status={status} />
    </div>
  );
}

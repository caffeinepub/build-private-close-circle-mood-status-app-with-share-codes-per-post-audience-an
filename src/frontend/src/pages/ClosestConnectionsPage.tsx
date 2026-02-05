import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useGetClosestConnections } from '@/hooks/useQueries';
import { Sparkles, AlertCircle } from 'lucide-react';
import ProgressiveDisclosure from '@/components/common/ProgressiveDisclosure';
import { getAvatarSrc } from '@/utils/profileAvatar';

export default function ClosestConnectionsPage() {
  const { data: connections = [], isLoading, error } = useGetClosestConnections();

  if (isLoading) {
    return (
      <div className="container max-w-2xl mx-auto p-4 space-y-4">
        <Card>
          <CardContent className="py-12 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
            <p className="text-sm text-muted-foreground mt-4">Loading connections...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-2xl mx-auto p-4 space-y-4">
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Failed to load connections</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Closest Connections
          </CardTitle>
          <CardDescription>
            Ranked by circle overlap and interaction
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {connections.length === 0 ? (
            <Alert>
              <AlertDescription>
                No connections yet. Join or create a circle to see recommendations.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              {connections.map((connection, index) => {
                const avatarSrc = getAvatarSrc(null);
                const initials = connection.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2);

                return (
                  <div
                    key={connection.principal.toString()}
                    className="border rounded-lg p-4 space-y-3 bg-card hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          {avatarSrc && <AvatarImage src={avatarSrc} alt={connection.name} />}
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        {index === 0 && (
                          <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-xs font-bold text-primary-foreground">1</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{connection.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {connection.principal.toString().slice(0, 16)}...
                        </p>
                      </div>
                    </div>

                    <ProgressiveDisclosure trigger="Why this person?">
                      <div className="space-y-2 pt-2">
                        <Alert>
                          <AlertDescription className="text-sm">
                            {connection.why}
                          </AlertDescription>
                        </Alert>
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <div>
                            <span className="font-medium">Shared connections:</span>{' '}
                            {Number(connection.sharedConnections)}
                          </div>
                          <div>
                            <span className="font-medium">Interactions:</span>{' '}
                            {Number(connection.interaction)}
                          </div>
                        </div>
                      </div>
                    </ProgressiveDisclosure>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import React from 'react';
import { useGetCirclesImInOwners } from '@/hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users } from 'lucide-react';
import { getAvatarSrc } from '@/utils/profileAvatar';

export default function CirclesImInPage() {
  const { data: ownersData, isLoading, error } = useGetCirclesImInOwners();

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Circles I'm in
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-5 w-32" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load circles. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const owners = ownersData || [];

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Circles I'm in
          </CardTitle>
        </CardHeader>
        <CardContent>
          {owners.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-sm text-muted-foreground">
                You're not currently in any circles.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {owners.map((owner) => {
                const avatarSrc = owner.profile.avatar
                  ? getAvatarSrc(owner.profile.avatar)
                  : undefined;
                const initials = owner.profile.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2);

                return (
                  <div
                    key={owner.principal.toString()}
                    className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
                  >
                    <Avatar className="h-12 w-12">
                      {avatarSrc && <AvatarImage src={avatarSrc} alt={owner.profile.name} />}
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{owner.profile.name}</p>
                    </div>
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

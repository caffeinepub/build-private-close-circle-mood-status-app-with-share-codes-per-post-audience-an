import { useGetUnprocessedJoinRequests, useAcceptJoinRequest, useDeclineJoinRequest, useGetUserProfiles } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Check, X, UserCheck } from 'lucide-react';
import { Gender, RelationshipIntent } from '@/backend';
import { calculateAge } from '@/utils/age';

export default function PendingRequestsPanel() {
  const { data: requests = [], isLoading } = useGetUnprocessedJoinRequests();
  const acceptRequest = useAcceptJoinRequest();
  const declineRequest = useDeclineJoinRequest();

  const requesters = requests.map((r) => r.from);
  const { data: profiles = {} } = useGetUserProfiles(requesters);

  const handleAccept = async (request: typeof requests[0]) => {
    try {
      await acceptRequest.mutateAsync({ from: request.from, code: request.shareCode });
      toast.success('Request accepted!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to accept request');
    }
  };

  const handleDecline = async (request: typeof requests[0]) => {
    try {
      await declineRequest.mutateAsync({ user: request.from, code: request.shareCode });
      toast.success('Request declined');
    } catch (error: any) {
      toast.error(error.message || 'Failed to decline request');
    }
  };

  const getGenderLabel = (g: Gender) => {
    switch (g) {
      case Gender.male: return 'Male';
      case Gender.female: return 'Female';
      case Gender.nonBinary: return 'Non-Binary';
      case Gender.other: return 'Other';
    }
  };

  const getIntentLabel = (intent: RelationshipIntent) => {
    switch (intent) {
      case RelationshipIntent.friendship: return 'Friendship';
      case RelationshipIntent.romantic: return 'Romantic';
      case RelationshipIntent.both: return 'Both';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Pending Requests</CardTitle>
            <CardDescription>People who want to join your circle</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-4">
            No pending requests
          </p>
        ) : (
          <div className="space-y-3">
            {requests.map((request) => {
              const principalStr = request.from.toString();
              const profile = profiles[principalStr];
              const displayName = profile?.name || 'Unknown user';
              const age = profile?.dateOfBirth ? calculateAge(profile.dateOfBirth) : null;
              const showAge = profile?.showAge && age !== null;

              return (
                <div
                  key={principalStr}
                  className="flex items-start justify-between gap-3 rounded-lg border p-3"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{displayName}</p>
                      {showAge && (
                        <span className="text-xs text-muted-foreground">• {age}</span>
                      )}
                    </div>
                    {profile && (
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span>{getGenderLabel(profile.gender)}</span>
                        <span>•</span>
                        <span>{getIntentLabel(profile.relationshipIntent)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleAccept(request)}
                      disabled={acceptRequest.isPending || declineRequest.isPending}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDecline(request)}
                      disabled={acceptRequest.isPending || declineRequest.isPending}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import { useGetCircleMembers, useRemoveCircleMember, useGetUserProfiles, useGetUserPulseScores } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { UserMinus, Users, Zap } from 'lucide-react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { calculateAge } from '@/utils/age';
import { Gender } from '@/backend';

export default function CircleMembersList() {
  const { identity } = useInternetIdentity();
  const { data: members = [], isLoading } = useGetCircleMembers();
  const removeMember = useRemoveCircleMember();
  const { data: profiles = {} } = useGetUserProfiles(members);
  const { data: pulseScores = {}, isLoading: pulseLoading } = useGetUserPulseScores(members);

  const currentUserPrincipal = identity?.getPrincipal().toString();
  const otherMembers = members.filter((m) => m.toString() !== currentUserPrincipal);

  const handleRemove = async (member: typeof members[0]) => {
    try {
      await removeMember.mutateAsync(member);
      toast.success('Member removed from your circle');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove member');
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
          <Users className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Circle Members</CardTitle>
            <CardDescription>
              {otherMembers.length} {otherMembers.length === 1 ? 'person' : 'people'} in your circle
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {otherMembers.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-4">
            No members yet. Share your code to invite people.
          </p>
        ) : (
          <div className="space-y-3">
            {otherMembers.map((member) => {
              const principalStr = member.toString();
              const profile = profiles[principalStr];
              const displayName = profile?.name || `User ${principalStr.slice(0, 8)}...`;
              const age = profile?.dateOfBirth ? calculateAge(profile.dateOfBirth) : null;
              const showAge = profile?.showAge && age !== null;
              const pulse = pulseScores[principalStr] ?? 0;

              return (
                <div
                  key={principalStr}
                  className="flex items-start justify-between gap-3 rounded-lg border p-4"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{displayName}</p>
                      {showAge && (
                        <span className="text-xs text-muted-foreground">• {age}</span>
                      )}
                    </div>
                    {profile && (
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span>{getGenderLabel(profile.gender)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      {pulseLoading ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      ) : (
                        <Badge variant="outline" className="text-xs font-medium">
                          <Zap className="h-3 w-3 mr-1 text-primary" />
                          {pulse}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="ghost">
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove {displayName}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          They will no longer see your future updates and won't be able to view posts where they're not in the audience.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleRemove(member)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGetEligibleSafePeopleCandidates, useGetSafePeople, useSetSafePerson, useUnsetSafePerson, useGetUserProfiles, useGetClosestConnections } from '@/hooks/useQueries';
import { Heart, Info, Sparkles, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from '@tanstack/react-router';
import ProgressiveDisclosure from '@/components/common/ProgressiveDisclosure';
import { Principal } from '@dfinity/principal';

export default function SafePeoplePanel() {
  const { data: candidates = [], isLoading: candidatesLoading } = useGetEligibleSafePeopleCandidates();
  const { data: safePeople = [], isLoading: safePeopleLoading } = useGetSafePeople();
  const { data: profiles = {} } = useGetUserProfiles(candidates);
  const { data: recommendations = [] } = useGetClosestConnections();
  const setSafePerson = useSetSafePerson();
  const unsetSafePerson = useUnsetSafePerson();

  const [pendingChanges, setPendingChanges] = useState<Set<string>>(new Set());

  const isLoading = candidatesLoading || safePeopleLoading;

  // Get top 2 recommended principals
  const recommendedPrincipals = recommendations.slice(0, 2).map((r) => r.principal.toString());

  const handleToggle = async (principal: string, isCurrentlySelected: boolean) => {
    if (pendingChanges.has(principal)) return;

    if (!isCurrentlySelected && safePeople.length >= 2) {
      toast.error('Max 2 Safe People');
      return;
    }

    setPendingChanges((prev) => new Set(prev).add(principal));

    try {
      // Convert string to Principal before calling backend
      const principalObj = Principal.fromText(principal);
      
      if (isCurrentlySelected) {
        await unsetSafePerson.mutateAsync(principalObj);
        toast.success('Removed');
      } else {
        await setSafePerson.mutateAsync(principalObj);
        toast.success('Added');
      }
    } catch (error: any) {
      // Handle Principal conversion errors gracefully
      if (error.message?.includes('Invalid principal')) {
        toast.error('Invalid principal format');
      } else {
        toast.error(error.message || 'Update failed');
      }
    } finally {
      setPendingChanges((prev) => {
        const next = new Set(prev);
        next.delete(principal);
        return next;
      });
    }
  };

  const getDisplayName = (principal: string) => {
    const profile = profiles[principal];
    if (profile?.name) return profile.name;
    return `${principal.slice(0, 8)}...`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
        </CardContent>
      </Card>
    );
  }

  // Separate recommended and other candidates
  const recommendedCandidates = candidates.filter((c) =>
    recommendedPrincipals.includes(c.toString())
  );
  const otherCandidates = candidates.filter(
    (c) => !recommendedPrincipals.includes(c.toString())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          Safe People
        </CardTitle>
        <CardDescription>
          Pick up to 2 for silent signals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ProgressiveDisclosure trigger="What's this?">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Safe People are global across circles. Silent signals go only to them (unless you share with full circle).
            </AlertDescription>
          </Alert>
        </ProgressiveDisclosure>

        {candidates.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No connections. Join or create a circle first.
          </p>
        ) : (
          <div className="space-y-4">
            {/* Recommended section */}
            {recommendedCandidates.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold">Recommended</h3>
                </div>
                {recommendedCandidates.map((candidate) => {
                  const principalStr = candidate.toString();
                  const isSelected = safePeople.some((p) => p.toString() === principalStr);
                  const isPending = pendingChanges.has(principalStr);
                  const isDisabled = !isSelected && safePeople.length >= 2;

                  return (
                    <div
                      key={principalStr}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                        isSelected ? 'bg-primary/5 border-primary/20' : 'bg-accent/5 border-primary/30'
                      } ${isDisabled ? 'opacity-50' : ''}`}
                    >
                      <Checkbox
                        checked={isSelected}
                        disabled={isPending || isDisabled}
                        onCheckedChange={() => handleToggle(principalStr, isSelected)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{getDisplayName(principalStr)}</p>
                          <Badge variant="secondary" className="text-xs">
                            Suggested
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{principalStr.slice(0, 16)}...</p>
                      </div>
                      {isSelected && (
                        <Heart className="h-4 w-4 text-primary fill-primary" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Other candidates section */}
            {otherCandidates.length > 0 && (
              <div className="space-y-2">
                {recommendedCandidates.length > 0 && (
                  <h3 className="text-sm font-semibold text-muted-foreground">Other connections</h3>
                )}
                {otherCandidates.map((candidate) => {
                  const principalStr = candidate.toString();
                  const isSelected = safePeople.some((p) => p.toString() === principalStr);
                  const isPending = pendingChanges.has(principalStr);
                  const isDisabled = !isSelected && safePeople.length >= 2;

                  return (
                    <div
                      key={principalStr}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                        isSelected ? 'bg-primary/5 border-primary/20' : 'bg-background border-border'
                      } ${isDisabled ? 'opacity-50' : ''}`}
                    >
                      <Checkbox
                        checked={isSelected}
                        disabled={isPending || isDisabled}
                        onCheckedChange={() => handleToggle(principalStr, isSelected)}
                      />
                      <div className="flex-1">
                        <p className="font-medium">{getDisplayName(principalStr)}</p>
                        <p className="text-xs text-muted-foreground">{principalStr.slice(0, 16)}...</p>
                      </div>
                      {isSelected && (
                        <Heart className="h-4 w-4 text-primary fill-primary" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {safePeople.length >= 2 && (
          <Alert>
            <AlertDescription>
              Max 2 selected. Remove one to add someone else.
            </AlertDescription>
          </Alert>
        )}

        {/* Navigation to Closest Connections viewer */}
        {candidates.length > 0 && (
          <Link to="/closest-connections">
            <Button variant="outline" className="w-full" size="sm">
              <Sparkles className="h-4 w-4 mr-2" />
              View all connection insights
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}

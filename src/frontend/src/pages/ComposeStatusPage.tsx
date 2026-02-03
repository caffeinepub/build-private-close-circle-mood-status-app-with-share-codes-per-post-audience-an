import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { usePostStatus, useGetCircleMembers, useGetUserProfiles } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import MoodPicker from '@/components/status/MoodPicker';
import type { Mood } from '@/backend';
import { Principal } from '@dfinity/principal';
import { calculateAge } from '@/utils/age';

export default function ComposeStatusPage() {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [content, setContent] = useState('');
  const [selectedAudience, setSelectedAudience] = useState<Set<string>>(new Set());

  const { data: circleMembers = [], isLoading: loadingMembers } = useGetCircleMembers();
  const { data: profiles = {} } = useGetUserProfiles(circleMembers);
  const postStatus = usePostStatus();

  const handleAudienceToggle = (principalStr: string) => {
    const newSet = new Set(selectedAudience);
    if (newSet.has(principalStr)) {
      newSet.delete(principalStr);
    } else {
      newSet.add(principalStr);
    }
    setSelectedAudience(newSet);
  };

  const handleSubmit = async () => {
    if (!selectedMood) {
      toast.error('Please select a mood');
      return;
    }

    if (selectedAudience.size === 0) {
      toast.error('Please select at least one person to share with');
      return;
    }

    try {
      const audiencePrincipals = Array.from(selectedAudience).map((p) => Principal.fromText(p));

      await postStatus.mutateAsync({
        id: '',
        author: Principal.anonymous(),
        mood: selectedMood,
        content: content.trim(),
        audience: audiencePrincipals,
        createdAt: BigInt(0),
      });

      toast.success('Status posted successfully!');
      navigate({ to: '/' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to post status');
    }
  };

  return (
    <div className="container max-w-2xl py-8 px-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Share Your Mood</h1>
        <p className="text-muted-foreground">Let your circle know how you're feeling</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How are you feeling?</CardTitle>
          <CardDescription>Select a mood and optionally add a note</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Mood *</Label>
            <MoodPicker selectedMood={selectedMood} onSelectMood={setSelectedMood} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Add a note (optional)</Label>
            <Textarea
              id="content"
              placeholder="Share more about how you're feeling..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={300}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">{content.length}/300</p>
          </div>

          <div className="space-y-3">
            <Label>Who can see this? *</Label>
            {loadingMembers ? (
              <div className="py-4 text-center text-sm text-muted-foreground">Loading your circle...</div>
            ) : circleMembers.length === 0 ? (
              <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                You don't have any circle members yet. Add people to your circle first!
              </div>
            ) : (
              <div className="space-y-2 rounded-lg border p-4 max-h-64 overflow-y-auto">
                {circleMembers.map((member) => {
                  const principalStr = member.toString();
                  const profile = profiles[principalStr];
                  const displayName = profile?.name || `User ${principalStr.slice(0, 8)}...`;
                  const age = profile?.dateOfBirth ? calculateAge(profile.dateOfBirth) : null;
                  const showAge = profile?.showAge && age !== null;

                  return (
                    <div key={principalStr} className="flex items-center space-x-2">
                      <Checkbox
                        id={principalStr}
                        checked={selectedAudience.has(principalStr)}
                        onCheckedChange={() => handleAudienceToggle(principalStr)}
                      />
                      <label
                        htmlFor={principalStr}
                        className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5">
                          {displayName}
                          {showAge && <span className="text-xs text-muted-foreground font-normal">• {age}</span>}
                        </span>
                      </label>
                    </div>
                  );
                })}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {selectedAudience.size} {selectedAudience.size === 1 ? 'person' : 'people'} selected
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={postStatus.isPending || !selectedMood || selectedAudience.size === 0}
              className="flex-1"
            >
              {postStatus.isPending ? 'Posting...' : 'Post Status'}
            </Button>
            <Button variant="outline" onClick={() => navigate({ to: '/' })}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

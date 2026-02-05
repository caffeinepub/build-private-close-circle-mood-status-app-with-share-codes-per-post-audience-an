import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { usePostStatus, useGetCircleMembers, useGetUserProfiles } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import MoodPicker from '@/components/status/MoodPicker';
import ContextTagsPicker from '@/components/status/ContextTagsPicker';
import PostStatusPrivateNotePrompt from '@/components/status/PostStatusPrivateNotePrompt';
import ProgressiveDisclosure from '@/components/common/ProgressiveDisclosure';
import type { Mood } from '@/backend';
import { Principal } from '@dfinity/principal';
import { calculateAge } from '@/utils/age';
import { useJournalOverlayController } from '@/contexts/JournalOverlayControllerContext';
import { getMoodOption } from '@/constants/moods';
import { getMoodGradientClasses, getMoodColorClasses } from '@/utils/moodColors';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { buildAudienceWithAuthor } from '@/utils/audience';

export default function ComposeStatusPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { from?: string };
  const { identity } = useInternetIdentity();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [content, setContent] = useState('');
  const [selectedAudience, setSelectedAudience] = useState<Set<string>>(new Set());
  const [contextTags, setContextTags] = useState<string[]>([]);
  const [showPrivateNotePrompt, setShowPrivateNotePrompt] = useState(false);
  const moodPickerRef = useRef<HTMLDivElement>(null);

  const { data: circleMembers = [], isLoading: loadingMembers } = useGetCircleMembers();
  const { data: profiles = {} } = useGetUserProfiles(circleMembers);
  const postStatus = usePostStatus();
  const { openJournal } = useJournalOverlayController();

  const currentUserPrincipal = identity?.getPrincipal().toString();

  // Filter out the current user from circle members
  const selectableMembers = circleMembers.filter(
    (member) => member.toString() !== currentUserPrincipal
  );

  // Prune selectedAudience when selectableMembers changes to prevent stale selections
  useEffect(() => {
    if (selectableMembers.length === 0) {
      setSelectedAudience(new Set());
    } else {
      const validPrincipals = new Set(selectableMembers.map(m => m.toString()));
      setSelectedAudience(prev => {
        const filtered = new Set(Array.from(prev).filter(p => validPrincipals.has(p)));
        return filtered.size !== prev.size ? filtered : prev;
      });
    }
  }, [selectableMembers.length]);

  useEffect(() => {
    if (search.from === 'mood-reminder' && moodPickerRef.current) {
      setTimeout(() => {
        moodPickerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const searchInput = moodPickerRef.current?.querySelector('input[type="text"]') as HTMLInputElement;
        searchInput?.focus();
      }, 100);
    }
  }, [search.from]);

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
      toast.error('Pick a mood');
      return;
    }

    if (!identity) {
      toast.error('Not authenticated');
      return;
    }

    try {
      const selectedRecipients = Array.from(selectedAudience).map((p) => Principal.fromText(p));
      const audienceWithAuthor = buildAudienceWithAuthor(selectedRecipients, identity.getPrincipal());

      await postStatus.mutateAsync({
        id: '',
        author: Principal.anonymous(),
        mood: selectedMood,
        content: content.trim(),
        contextTags: contextTags.length > 0 ? contextTags : undefined,
        audience: audienceWithAuthor,
        createdAt: BigInt(0),
      });

      toast.success('Shared!');
      setShowPrivateNotePrompt(true);
    } catch (error: any) {
      toast.error(error.message || 'Failed to share');
    }
  };

  const handleOpenJournal = () => {
    setShowPrivateNotePrompt(false);
    openJournal({ resetToToday: true });
    navigate({ to: '/' });
  };

  const handleDismissPrompt = () => {
    setShowPrivateNotePrompt(false);
    navigate({ to: '/' });
  };

  const moodOption = selectedMood ? getMoodOption(selectedMood) : null;
  const moodColorClasses = moodOption ? getMoodColorClasses(moodOption.category) : null;
  const moodGradient = moodOption ? getMoodGradientClasses(moodOption.category) : '';

  return (
    <>
      <div className="container max-w-2xl py-8 px-4 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Check-In</h1>
          <p className="text-muted-foreground">Share a mood</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pick a mood</CardTitle>
            <CardDescription>Add an optional note</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2" ref={moodPickerRef}>
              <Label>Mood *</Label>
              <MoodPicker selectedMood={selectedMood} onSelectMood={setSelectedMood} autoFocus={search.from === 'mood-reminder'} />
            </div>

            {selectedMood && (
              <>
                <Separator />
                <ProgressiveDisclosure trigger="More options">
                  <div className="space-y-6">
                    <ContextTagsPicker
                      selectedTags={contextTags}
                      onTagsChange={setContextTags}
                    />

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="content">Note (optional)</Label>
                      <Textarea
                        id="content"
                        placeholder="Add context..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        maxLength={300}
                        rows={4}
                      />
                      <p className="text-xs text-muted-foreground">{content.length}/300</p>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Label>Who sees this? (optional)</Label>
                      {loadingMembers ? (
                        <div className="py-4 text-center text-sm text-muted-foreground">Loading...</div>
                      ) : selectableMembers.length === 0 ? (
                        <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                          No circle members yet — this post will be private (only you can see it)
                        </div>
                      ) : (
                        <div className="space-y-2 rounded-lg border p-4 max-h-64 overflow-y-auto">
                          {selectableMembers.map((member) => {
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
                        {selectableMembers.length === 0 
                          ? 'Posts stay private until you join a circle'
                          : 'You always see your own posts'}
                      </p>
                    </div>
                  </div>
                </ProgressiveDisclosure>
              </>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handleSubmit}
                disabled={postStatus.isPending || !selectedMood}
                className={`flex-1 ${moodGradient} ${moodColorClasses?.border} border-2 shadow-md hover:shadow-lg transition-all`}
              >
                {postStatus.isPending ? 'Sharing...' : 'Share'}
              </Button>
              <Button variant="outline" onClick={() => navigate({ to: '/' })}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <PostStatusPrivateNotePrompt
        isOpen={showPrivateNotePrompt}
        onOpenJournal={handleOpenJournal}
        onDismiss={handleDismissPrompt}
      />
    </>
  );
}

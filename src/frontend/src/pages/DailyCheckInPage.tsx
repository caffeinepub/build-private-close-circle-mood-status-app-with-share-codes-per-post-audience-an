import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
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
import { consumeDailyCheckInGuard } from '@/utils/dailyCheckInEntry';
import { useMoodHistory } from '@/hooks/useMoodHistory';
import { getMoodOption } from '@/constants/moods';
import { getMoodGradientClasses, getMoodColorClasses } from '@/utils/moodColors';

export default function DailyCheckInPage() {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [content, setContent] = useState('');
  const [selectedAudience, setSelectedAudience] = useState<Set<string>>(new Set());
  const [contextTags, setContextTags] = useState<string[]>([]);
  const [showPrivateNotePrompt, setShowPrivateNotePrompt] = useState(false);

  const { data: circleMembers = [], isLoading: loadingMembers } = useGetCircleMembers();
  const { data: profiles = {} } = useGetUserProfiles(circleMembers);
  const postStatus = usePostStatus();
  const { openJournal } = useJournalOverlayController();
  const { moodHistory } = useMoodHistory(14);

  // Guard: redirect if not coming from reminder
  useEffect(() => {
    const hasGuard = consumeDailyCheckInGuard();
    if (!hasGuard) {
      navigate({ to: '/compose' });
    }
  }, [navigate]);

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

    if (selectedAudience.size === 0) {
      toast.error('Pick at least one person');
      return;
    }

    try {
      const audiencePrincipals = Array.from(selectedAudience).map((p) => Principal.fromText(p));

      await postStatus.mutateAsync({
        id: '',
        author: Principal.anonymous(),
        mood: selectedMood,
        content: content.trim(),
        contextTags: contextTags.length > 0 ? contextTags : undefined,
        audience: audiencePrincipals,
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
          <h1 className="text-3xl font-bold">How are you?</h1>
          <p className="text-muted-foreground">Pick a mood</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your mood</CardTitle>
            <CardDescription>What feels right?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <MoodPicker selectedMood={selectedMood} onSelectMood={setSelectedMood} autoFocus />
            </div>

            {selectedMood && (
              <>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="content">One sentence?</Label>
                  <Textarea
                    id="content"
                    placeholder="No words is okay too."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    maxLength={300}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">{content.length}/300</p>
                </div>

                <Separator />

                <ProgressiveDisclosure trigger="More options">
                  <div className="space-y-6">
                    <ContextTagsPicker
                      selectedTags={contextTags}
                      onTagsChange={setContextTags}
                    />

                    <Separator />

                    <div className="space-y-3">
                      <Label>Who sees this? *</Label>
                      {loadingMembers ? (
                        <div className="py-4 text-center text-sm text-muted-foreground">Loading...</div>
                      ) : circleMembers.length === 0 ? (
                        <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                          No circle members yet
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
                        Only selected people see this
                      </p>
                    </div>
                  </div>
                </ProgressiveDisclosure>

                <div className="flex gap-2 pt-2">
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
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <PostStatusPrivateNotePrompt
        isOpen={showPrivateNotePrompt}
        onOpenJournal={handleOpenJournal}
        onDismiss={handleDismissPrompt}
        moodHistory={moodHistory}
      />
    </>
  );
}

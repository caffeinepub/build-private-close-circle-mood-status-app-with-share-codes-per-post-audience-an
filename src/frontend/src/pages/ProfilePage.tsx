import { useState, useEffect } from 'react';
import { useGetCallerUserProfile, useUpdateProfile, useUploadAvatar, useSelectSystemAvatar, useGetCallerPulseScore } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { User, Zap } from 'lucide-react';
import IconActionButton from '@/components/common/IconActionButton';
import { Edit2, Save, X } from 'lucide-react';
import ShareCodeCard from '@/components/circle/ShareCodeCard';
import MoodAnalyzerCard from '@/components/profile/MoodAnalyzerCard';
import ProfileAvatarEditor from '@/components/profile/ProfileAvatarEditor';
import { Gender } from '@/backend';
import type { Avatar as AvatarType } from '@/backend';
import { calculateAge, formatDateForInput } from '@/utils/age';
import { useFloatingJournalVisibility } from '@/contexts/FloatingJournalVisibilityContext';
import { useSound } from '@/hooks/useSound';
import { getAvatarSrc } from '@/utils/profileAvatar';

export default function ProfilePage() {
  const { data: userProfile, isLoading } = useGetCallerUserProfile();
  const { data: pulseScore = 0, isLoading: pulseLoading } = useGetCallerPulseScore();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const selectSystemAvatar = useSelectSystemAvatar();
  const [isEditing, setIsEditing] = useState(false);
  const [showAge, setShowAge] = useState(true);
  const [preferredGender, setPreferredGender] = useState<Gender | null>(null);
  const [editingAvatar, setEditingAvatar] = useState<AvatarType | null>(null);

  const { hide, show } = useFloatingJournalVisibility();
  const { enabled: soundsEnabled, setEnabled: setSoundsEnabled } = useSound();

  useEffect(() => {
    if (isEditing) {
      hide();
    } else {
      show();
    }
  }, [isEditing, hide, show]);

  const handleEdit = () => {
    if (userProfile) {
      setShowAge(userProfile.showAge);
      setPreferredGender(userProfile.preferences.gender);
      setEditingAvatar(userProfile.avatar || null);
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingAvatar(null);
  };

  const handleSave = async () => {
    if (!preferredGender) {
      toast.error('Complete all fields');
      return;
    }

    if (!userProfile) return;

    try {
      // Update only the mutable profile fields, preserving existing relationshipIntent
      await updateProfile.mutateAsync({
        showAge,
        relationshipIntent: userProfile.relationshipIntent,
        preferences: {
          intent: userProfile.relationshipIntent,
          gender: preferredGender,
        },
        shareCode: userProfile.shareCode,
      });

      // Then, handle avatar changes if any
      if (editingAvatar) {
        if (editingAvatar.__kind__ === 'uploaded') {
          await uploadAvatar.mutateAsync(editingAvatar.uploaded);
        } else if (editingAvatar.__kind__ === 'systemAvatar') {
          await selectSystemAvatar.mutateAsync(editingAvatar.systemAvatar);
        }
      }

      toast.success('Saved');
      setIsEditing(false);
      setEditingAvatar(null);
    } catch (error: any) {
      toast.error(error.message || 'Save failed');
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
      <div className="container max-w-2xl py-8 px-4">
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="container max-w-2xl py-8 px-4">
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Profile not found
          </CardContent>
        </Card>
      </div>
    );
  }

  const age = calculateAge(userProfile.dateOfBirth);
  const avatarSrc = getAvatarSrc(userProfile.avatar);

  return (
    <div className="container max-w-2xl py-8 px-4 space-y-6">
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          {avatarSrc ? (
            <AvatarImage src={avatarSrc} alt={userProfile.name} />
          ) : (
            <AvatarFallback className="bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <h1 className="text-2xl font-semibold">Profile</h1>
          <p className="text-sm text-muted-foreground">Your info</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Details</CardTitle>
              <CardDescription>Visible to your circle</CardDescription>
            </div>
            {!isEditing && (
              <IconActionButton
                icon={<Edit2 className="h-4 w-4" />}
                label="Edit profile"
                variant="outline"
                size="sm"
                onClick={handleEdit}
              />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {isEditing ? (
            <>
              <ProfileAvatarEditor
                currentAvatar={editingAvatar}
                onAvatarChange={setEditingAvatar}
              />

              <Separator />

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Name</Label>
                <p className="mt-1 text-base font-medium text-muted-foreground">
                  {userProfile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Name cannot be changed
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Gender</Label>
                <p className="mt-1 text-base text-muted-foreground">
                  {getGenderLabel(userProfile.gender)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Gender cannot be changed
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Birthday</Label>
                <p className="mt-1 text-base text-muted-foreground">
                  {formatDateForInput(userProfile.dateOfBirth)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Birthday cannot be changed
                </p>
              </div>

              <Separator />

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="show-age">Show age</Label>
                  <p className="text-xs text-muted-foreground">
                    Visible to circle
                  </p>
                </div>
                <Switch
                  id="show-age"
                  checked={showAge}
                  onCheckedChange={setShowAge}
                />
              </div>

              <div className="space-y-2">
                <Label>Interested In</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={preferredGender === Gender.male ? 'default' : 'outline'}
                    onClick={() => setPreferredGender(Gender.male)}
                    size="sm"
                  >
                    Male
                  </Button>
                  <Button
                    type="button"
                    variant={preferredGender === Gender.female ? 'default' : 'outline'}
                    onClick={() => setPreferredGender(Gender.female)}
                    size="sm"
                  >
                    Female
                  </Button>
                  <Button
                    type="button"
                    variant={preferredGender === Gender.nonBinary ? 'default' : 'outline'}
                    onClick={() => setPreferredGender(Gender.nonBinary)}
                    size="sm"
                  >
                    Non-Binary
                  </Button>
                  <Button
                    type="button"
                    variant={preferredGender === Gender.other ? 'default' : 'outline'}
                    onClick={() => setPreferredGender(Gender.other)}
                    size="sm"
                  >
                    Everyone
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <IconActionButton
                  icon={<Save className="h-4 w-4" />}
                  label="Save changes"
                  onClick={handleSave}
                  disabled={updateProfile.isPending || uploadAvatar.isPending || selectSystemAvatar.isPending}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {updateProfile.isPending || uploadAvatar.isPending || selectSystemAvatar.isPending ? 'Saving...' : 'Save'}
                </IconActionButton>
                <IconActionButton
                  icon={<X className="h-4 w-4" />}
                  label="Cancel editing"
                  variant="outline"
                  onClick={handleCancel}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </IconActionButton>
              </div>
            </>
          ) : (
            <>
              <div className="grid gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Name</Label>
                  <p className="mt-1 text-base font-medium">{userProfile.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Gender</Label>
                    <p className="mt-1 text-base">{getGenderLabel(userProfile.gender)}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Age</Label>
                    <p className="mt-1 text-base">
                      {age !== null ? `${age}` : 'Not set'}
                      {!userProfile.showAge && (
                        <span className="ml-2 text-xs text-muted-foreground">(hidden)</span>
                      )}
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Interested In</Label>
                  <p className="mt-1 text-base">{getGenderLabel(userProfile.preferences.gender)}</p>
                </div>

                <Separator />

                <div>
                  <Label className="text-xs text-muted-foreground">Pulse</Label>
                  <div className="mt-2 flex items-center gap-2">
                    {pulseLoading ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    ) : (
                      <>
                        <Badge variant="secondary" className="text-base font-semibold px-3 py-1">
                          <Zap className="h-4 w-4 mr-1.5 text-primary" />
                          {pulseScore}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          Earned by sharing moods with your circle
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>App preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="sounds-toggle">Sounds</Label>
              <p className="text-xs text-muted-foreground">
                Play sounds for new activity
              </p>
            </div>
            <Switch
              id="sounds-toggle"
              checked={soundsEnabled}
              onCheckedChange={setSoundsEnabled}
            />
          </div>
        </CardContent>
      </Card>

      <Separator />

      <ShareCodeCard />

      <Separator />

      <MoodAnalyzerCard />
    </div>
  );
}

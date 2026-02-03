import { useState, useEffect } from 'react';
import { useGetCallerUserProfile, useUpdateProfile } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Edit2, Save, X, User } from 'lucide-react';
import ShareCodeCard from '@/components/circle/ShareCodeCard';
import MoodAnalyzerCard from '@/components/profile/MoodAnalyzerCard';
import { Gender, RelationshipIntent } from '@/backend';
import { calculateAge, formatDateForInput, parseDateInput } from '@/utils/age';
import { useFloatingJournalVisibility } from '@/contexts/FloatingJournalVisibilityContext';

export default function ProfilePage() {
  const { data: userProfile, isLoading } = useGetCallerUserProfile();
  const updateProfile = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [showAge, setShowAge] = useState(true);
  const [relationshipIntent, setRelationshipIntent] = useState<RelationshipIntent | null>(null);
  const [preferredGender, setPreferredGender] = useState<Gender | null>(null);

  const { hide, show } = useFloatingJournalVisibility();

  useEffect(() => {
    if (isEditing) {
      hide();
    } else {
      show();
    }
  }, [isEditing, hide, show]);

  const handleEdit = () => {
    if (userProfile) {
      setName(userProfile.name);
      setGender(userProfile.gender);
      setDateOfBirth(formatDateForInput(userProfile.dateOfBirth));
      setShowAge(userProfile.showAge);
      setRelationshipIntent(userProfile.relationshipIntent);
      setPreferredGender(userProfile.preferences.gender);
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    if (!gender || !dateOfBirth || !relationshipIntent || !preferredGender) {
      toast.error('Please complete all fields');
      return;
    }

    if (!userProfile) return;

    try {
      await updateProfile.mutateAsync({
        name: name.trim(),
        gender,
        dateOfBirth: parseDateInput(dateOfBirth),
        showAge,
        relationshipIntent,
        preferences: {
          intent: relationshipIntent,
          gender: preferredGender,
        },
        shareCode: userProfile.shareCode,
        createdAt: userProfile.createdAt,
      });
      toast.success('Profile updated');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
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
      case RelationshipIntent.romantic: return 'Romantic Connection';
      case RelationshipIntent.both: return 'Open to Both';
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

  return (
    <div className="container max-w-2xl py-8 px-4 space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-primary/10 p-3">
          <User className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Your Profile</h1>
          <p className="text-sm text-muted-foreground">Manage your personal information</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Personal Details</CardTitle>
              <CardDescription>Information visible to your circle</CardDescription>
            </div>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {isEditing ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={50}
                />
              </div>

              <div className="space-y-2">
                <Label>Gender</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={gender === Gender.male ? 'default' : 'outline'}
                    onClick={() => setGender(Gender.male)}
                    size="sm"
                  >
                    Male
                  </Button>
                  <Button
                    type="button"
                    variant={gender === Gender.female ? 'default' : 'outline'}
                    onClick={() => setGender(Gender.female)}
                    size="sm"
                  >
                    Female
                  </Button>
                  <Button
                    type="button"
                    variant={gender === Gender.nonBinary ? 'default' : 'outline'}
                    onClick={() => setGender(Gender.nonBinary)}
                    size="sm"
                  >
                    Non-Binary
                  </Button>
                  <Button
                    type="button"
                    variant={gender === Gender.other ? 'default' : 'outline'}
                    onClick={() => setGender(Gender.other)}
                    size="sm"
                  >
                    Other
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-dob">Date of Birth</Label>
                <Input
                  id="edit-dob"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="show-age">Show my age to circle members</Label>
                  <p className="text-xs text-muted-foreground">
                    Your age will be visible to people in your circle
                  </p>
                </div>
                <Switch
                  id="show-age"
                  checked={showAge}
                  onCheckedChange={setShowAge}
                />
              </div>

              <div className="space-y-2">
                <Label>Looking For</Label>
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant={relationshipIntent === RelationshipIntent.friendship ? 'default' : 'outline'}
                    onClick={() => setRelationshipIntent(RelationshipIntent.friendship)}
                    className="w-full"
                    size="sm"
                  >
                    Friendship
                  </Button>
                  <Button
                    type="button"
                    variant={relationshipIntent === RelationshipIntent.romantic ? 'default' : 'outline'}
                    onClick={() => setRelationshipIntent(RelationshipIntent.romantic)}
                    className="w-full"
                    size="sm"
                  >
                    Romantic Connection
                  </Button>
                  <Button
                    type="button"
                    variant={relationshipIntent === RelationshipIntent.both ? 'default' : 'outline'}
                    onClick={() => setRelationshipIntent(RelationshipIntent.both)}
                    className="w-full"
                    size="sm"
                  >
                    Open to Both
                  </Button>
                </div>
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
                <Button onClick={handleSave} disabled={updateProfile.isPending}>
                  <Save className="mr-2 h-4 w-4" />
                  {updateProfile.isPending ? 'Saving...' : 'Save'}
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
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
                      {age !== null ? `${age} years` : 'Not set'}
                      {!userProfile.showAge && (
                        <span className="ml-2 text-xs text-muted-foreground">(hidden)</span>
                      )}
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Looking For</Label>
                  <p className="mt-1 text-base">{getIntentLabel(userProfile.relationshipIntent)}</p>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Interested In</Label>
                  <p className="mt-1 text-base">{getGenderLabel(userProfile.preferences.gender)}</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Separator />

      <ShareCodeCard />

      <Separator />

      <MoodAnalyzerCard />
    </div>
  );
}

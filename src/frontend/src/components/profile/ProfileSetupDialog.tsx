import { useState } from 'react';
import { useSaveCallerUserProfile } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Heart, Copy, Check } from 'lucide-react';
import { Gender, RelationshipIntent } from '@/backend';
import { generateShareCode } from '@/utils/shareCode';
import { parseDateInput } from '@/utils/age';
import { FOUNDATION_PROMISE, FOUNDATION_BOUNDARY } from '@/constants/foundationCopy';

type OnboardingStep = 'name' | 'gender' | 'dob' | 'intent' | 'preferences' | 'shareCode';

export default function ProfileSetupDialog() {
  const [step, setStep] = useState<OnboardingStep>('name');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [relationshipIntent, setRelationshipIntent] = useState<RelationshipIntent | null>(null);
  const [preferredGender, setPreferredGender] = useState<Gender | null>(null);
  const [shareCode] = useState(generateShareCode());
  const [copied, setCopied] = useState(false);

  const saveProfile = useSaveCallerUserProfile();

  const handleCopyShareCode = () => {
    navigator.clipboard.writeText(shareCode);
    setCopied(true);
    toast.success('Share code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNext = () => {
    if (step === 'name') {
      if (!name.trim()) {
        toast.error('Please enter your name');
        return;
      }
      setStep('gender');
    } else if (step === 'gender') {
      if (!gender) {
        toast.error('Please select your gender');
        return;
      }
      setStep('dob');
    } else if (step === 'dob') {
      if (!dateOfBirth) {
        toast.error('Please enter your date of birth');
        return;
      }
      const dobDate = new Date(dateOfBirth);
      if (dobDate > new Date()) {
        toast.error('Date of birth cannot be in the future');
        return;
      }
      setStep('intent');
    } else if (step === 'intent') {
      if (!relationshipIntent) {
        toast.error('Please select your relationship intent');
        return;
      }
      setStep('preferences');
    } else if (step === 'preferences') {
      if (!preferredGender) {
        toast.error('Please select your preference');
        return;
      }
      setStep('shareCode');
    }
  };

  const handleFinish = async () => {
    if (!name.trim() || !gender || !dateOfBirth || !relationshipIntent || !preferredGender) {
      toast.error('Please complete all steps');
      return;
    }

    try {
      await saveProfile.mutateAsync({
        name: name.trim(),
        gender,
        dateOfBirth: parseDateInput(dateOfBirth),
        showAge: true,
        relationshipIntent,
        preferences: {
          intent: relationshipIntent,
          gender: preferredGender,
        },
        shareCode: shareCode,
        createdAt: BigInt(Date.now()) * BigInt(1_000_000),
      });
      toast.success('Welcome! Your profile is ready.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create profile');
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 'name':
        return (
          <>
            <CardHeader className="space-y-2 text-center">
              <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Heart className="h-8 w-8 text-primary" fill="currentColor" />
              </div>
              <CardTitle className="text-2xl">Welcome</CardTitle>
              <CardDescription className="text-base">
                Let's start with your name
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
                <p className="text-sm leading-relaxed text-foreground/90">
                  {FOUNDATION_PROMISE}
                </p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {FOUNDATION_BOUNDARY}
                </p>
              </div>
              <div className="space-y-3">
                <Label htmlFor="name" className="text-base">What should we call you?</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={50}
                  className="text-base h-12"
                  autoFocus
                />
              </div>
              <Button onClick={handleNext} className="w-full h-12 text-base" size="lg">
                Continue
              </Button>
            </CardContent>
          </>
        );

      case 'gender':
        return (
          <>
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl">Your Gender</CardTitle>
              <CardDescription className="text-base">
                Help us personalize your experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={gender === Gender.male ? 'default' : 'outline'}
                  className="h-20 text-base"
                  onClick={() => setGender(Gender.male)}
                >
                  Male
                </Button>
                <Button
                  variant={gender === Gender.female ? 'default' : 'outline'}
                  className="h-20 text-base"
                  onClick={() => setGender(Gender.female)}
                >
                  Female
                </Button>
                <Button
                  variant={gender === Gender.nonBinary ? 'default' : 'outline'}
                  className="h-20 text-base"
                  onClick={() => setGender(Gender.nonBinary)}
                >
                  Non-Binary
                </Button>
                <Button
                  variant={gender === Gender.other ? 'default' : 'outline'}
                  className="h-20 text-base"
                  onClick={() => setGender(Gender.other)}
                >
                  Other
                </Button>
              </div>
              <Button onClick={handleNext} className="w-full h-12 text-base" size="lg">
                Continue
              </Button>
            </CardContent>
          </>
        );

      case 'dob':
        return (
          <>
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl">Your Birthday</CardTitle>
              <CardDescription className="text-base">
                Your age will be visible to your circle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="dob" className="text-base">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="text-base h-12"
                />
                <p className="text-sm text-muted-foreground">
                  You can hide your age later in settings
                </p>
              </div>
              <Button onClick={handleNext} className="w-full h-12 text-base" size="lg">
                Continue
              </Button>
            </CardContent>
          </>
        );

      case 'intent':
        return (
          <>
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl">What are you looking for?</CardTitle>
              <CardDescription className="text-base">
                This helps us understand your intentions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Button
                  variant={relationshipIntent === RelationshipIntent.friendship ? 'default' : 'outline'}
                  className="w-full h-16 text-base"
                  onClick={() => setRelationshipIntent(RelationshipIntent.friendship)}
                >
                  Friendship
                </Button>
                <Button
                  variant={relationshipIntent === RelationshipIntent.romantic ? 'default' : 'outline'}
                  className="w-full h-16 text-base"
                  onClick={() => setRelationshipIntent(RelationshipIntent.romantic)}
                >
                  Romantic Connection
                </Button>
                <Button
                  variant={relationshipIntent === RelationshipIntent.both ? 'default' : 'outline'}
                  className="w-full h-16 text-base"
                  onClick={() => setRelationshipIntent(RelationshipIntent.both)}
                >
                  Open to Both
                </Button>
              </div>
              <Button onClick={handleNext} className="w-full h-12 text-base" size="lg">
                Continue
              </Button>
            </CardContent>
          </>
        );

      case 'preferences':
        return (
          <>
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl">Your Preferences</CardTitle>
              <CardDescription className="text-base">
                Who would you like to connect with?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={preferredGender === Gender.male ? 'default' : 'outline'}
                  className="h-20 text-base"
                  onClick={() => setPreferredGender(Gender.male)}
                >
                  Male
                </Button>
                <Button
                  variant={preferredGender === Gender.female ? 'default' : 'outline'}
                  className="h-20 text-base"
                  onClick={() => setPreferredGender(Gender.female)}
                >
                  Female
                </Button>
                <Button
                  variant={preferredGender === Gender.nonBinary ? 'default' : 'outline'}
                  className="h-20 text-base"
                  onClick={() => setPreferredGender(Gender.nonBinary)}
                >
                  Non-Binary
                </Button>
                <Button
                  variant={preferredGender === Gender.other ? 'default' : 'outline'}
                  className="h-20 text-base"
                  onClick={() => setPreferredGender(Gender.other)}
                >
                  Everyone
                </Button>
              </div>
              <Button onClick={handleNext} className="w-full h-12 text-base" size="lg">
                Continue
              </Button>
            </CardContent>
          </>
        );

      case 'shareCode':
        return (
          <>
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl">Your Share Code</CardTitle>
              <CardDescription className="text-base">
                Save this code to invite trusted people to your circle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-6 text-center">
                  <p className="mb-2 text-sm font-medium text-muted-foreground">Your Code</p>
                  <p className="mb-4 text-3xl font-bold tracking-wider text-primary">{shareCode}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyShareCode}
                    className="gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy Code
                      </>
                    )}
                  </Button>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">
                    Keep this code private. Only share it with people you trust. You can change it later in your profile settings.
                  </p>
                </div>
              </div>
              <Button
                onClick={handleFinish}
                disabled={saveProfile.isPending}
                className="w-full h-12 text-base"
                size="lg"
              >
                {saveProfile.isPending ? 'Creating Your Space...' : 'Complete Setup'}
              </Button>
            </CardContent>
          </>
        );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background via-background to-muted/10 p-4">
      <Card className="w-full max-w-md border shadow-lg">
        {renderStepContent()}
      </Card>
    </div>
  );
}

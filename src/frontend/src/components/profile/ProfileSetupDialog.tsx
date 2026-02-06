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
import ProgressiveDisclosure from '@/components/common/ProgressiveDisclosure';

// Default relationship intent for all new profiles
const DEFAULT_RELATIONSHIP_INTENT = RelationshipIntent.friendship;

type OnboardingStep = 'name' | 'gender' | 'dob' | 'preferences' | 'shareCode';

export default function ProfileSetupDialog() {
  const [step, setStep] = useState<OnboardingStep>('name');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [preferredGender, setPreferredGender] = useState<Gender | null>(null);
  const [shareCode] = useState(generateShareCode());
  const [copied, setCopied] = useState(false);

  const saveProfile = useSaveCallerUserProfile();

  const handleCopyShareCode = () => {
    navigator.clipboard.writeText(shareCode);
    setCopied(true);
    toast.success('Copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNext = () => {
    if (step === 'name') {
      if (!name.trim()) {
        toast.error('Enter your name');
        return;
      }
      setStep('gender');
    } else if (step === 'gender') {
      if (!gender) {
        toast.error('Select your gender');
        return;
      }
      setStep('dob');
    } else if (step === 'dob') {
      if (!dateOfBirth) {
        toast.error('Enter your birthday');
        return;
      }
      const dobDate = new Date(dateOfBirth);
      if (dobDate > new Date()) {
        toast.error('Birthday cannot be in the future');
        return;
      }
      setStep('preferences');
    } else if (step === 'preferences') {
      if (!preferredGender) {
        toast.error('Select your preference');
        return;
      }
      setStep('shareCode');
    }
  };

  const handleFinish = async () => {
    if (!name.trim() || !gender || !dateOfBirth || !preferredGender) {
      toast.error('Complete all steps');
      return;
    }

    try {
      await saveProfile.mutateAsync({
        name: name.trim(),
        gender,
        dateOfBirth: parseDateInput(dateOfBirth),
        showAge: true,
        relationshipIntent: DEFAULT_RELATIONSHIP_INTENT,
        preferences: {
          intent: DEFAULT_RELATIONSHIP_INTENT,
          gender: preferredGender,
        },
        shareCode: shareCode,
        createdAt: BigInt(Date.now()) * BigInt(1_000_000),
      });
      toast.success('Welcome! You are all set.');
    } catch (error: any) {
      toast.error(error.message || 'Setup failed');
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
                What should we call you?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ProgressiveDisclosure trigger="What's this?">
                <div className="space-y-2 rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {FOUNDATION_PROMISE}
                  </p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {FOUNDATION_BOUNDARY}
                  </p>
                </div>
              </ProgressiveDisclosure>
              <div className="space-y-3">
                <Label htmlFor="name" className="text-base">Your name</Label>
                <Input
                  id="name"
                  placeholder="Name"
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
                Helps personalize your experience
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
                Visible to your circle
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
                  Hide it later in settings
                </p>
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
              <CardTitle className="text-2xl">Interested In</CardTitle>
              <CardDescription className="text-base">
                Who you would like to connect with
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
              <CardTitle className="text-2xl">Your Code</CardTitle>
              <CardDescription className="text-base">
                Invite trusted people
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-6 text-center">
                  <p className="mb-2 text-sm font-medium text-muted-foreground">Share Code</p>
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
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">
                    Keep private. Share only with people you trust. Change it later in settings.
                  </p>
                </div>
              </div>
              <Button
                onClick={handleFinish}
                disabled={saveProfile.isPending}
                className="w-full h-12 text-base"
                size="lg"
              >
                {saveProfile.isPending ? 'Setting up...' : 'Done'}
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

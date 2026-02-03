import { useState } from 'react';
import { useJoinCircleFromShareCode } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { UserPlus } from 'lucide-react';

export default function JoinByCodeForm() {
  const [code, setCode] = useState('');
  const joinCircle = useJoinCircleFromShareCode();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      toast.error('Please enter a share code');
      return;
    }

    try {
      // Normalize: trim and uppercase for consistency
      const normalizedCode = code.trim().toUpperCase();
      await joinCircle.mutateAsync(normalizedCode);
      toast.success('Request sent. Waiting for approval.');
      setCode('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send request');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Join a Circle</CardTitle>
            <CardDescription>Enter a share code to request access</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="join-code">Share Code</Label>
            <Input
              id="join-code"
              placeholder="Enter code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={100}
            />
          </div>
          <Button type="submit" disabled={joinCircle.isPending} className="w-full">
            {joinCircle.isPending ? 'Sending...' : 'Send Request'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

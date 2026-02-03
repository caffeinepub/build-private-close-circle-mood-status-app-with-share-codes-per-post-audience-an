import { useState } from 'react';
import { useGetCallerUserProfile, useUpdateShareCode } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Copy, Edit2, Save, X, Key } from 'lucide-react';

export default function ShareCodeCard() {
  const { data: userProfile } = useGetCallerUserProfile();
  const updateShareCode = useUpdateShareCode();
  const [isEditing, setIsEditing] = useState(false);
  const [newCode, setNewCode] = useState('');

  const handleCopy = () => {
    if (userProfile?.shareCode) {
      navigator.clipboard.writeText(userProfile.shareCode);
      toast.success('Share code copied!');
    }
  };

  const handleEdit = () => {
    setNewCode('');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewCode('');
  };

  const handleSave = async () => {
    if (!newCode.trim()) {
      toast.error('Share code cannot be empty');
      return;
    }

    try {
      // Normalize: trim and uppercase for consistency
      const normalizedCode = newCode.trim().toUpperCase();
      await updateShareCode.mutateAsync(normalizedCode);
      toast.success('Share code updated');
      setIsEditing(false);
      setNewCode('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update share code');
    }
  };

  if (!userProfile) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Your Share Code</CardTitle>
              <CardDescription>Share with trusted people only</CardDescription>
            </div>
          </div>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit2 className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="new-code">New Share Code</Label>
              <Input
                id="new-code"
                placeholder="Enter new code"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                maxLength={30}
              />
              <p className="text-xs text-muted-foreground">
                Changing your code will invalidate pending requests
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={updateShareCode.isPending} size="sm">
                <Save className="mr-2 h-4 w-4" />
                {updateShareCode.isPending ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="outline" onClick={handleCancel} size="sm">
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-3">
              <code className="flex-1 text-sm font-mono tracking-wide">{userProfile.shareCode}</code>
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Keep this private. Only share with people you trust.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

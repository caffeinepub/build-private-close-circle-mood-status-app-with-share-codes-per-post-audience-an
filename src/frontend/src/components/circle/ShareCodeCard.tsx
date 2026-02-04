import { useState } from 'react';
import { useGetCallerUserProfile, useUpdateShareCode } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Copy, Key } from 'lucide-react';
import IconActionButton from '@/components/common/IconActionButton';
import { Edit2, Save, X } from 'lucide-react';
import ProgressiveDisclosure from '@/components/common/ProgressiveDisclosure';

export default function ShareCodeCard() {
  const { data: userProfile } = useGetCallerUserProfile();
  const updateShareCode = useUpdateShareCode();
  const [isEditing, setIsEditing] = useState(false);
  const [newCode, setNewCode] = useState('');

  const handleCopy = () => {
    if (userProfile?.shareCode) {
      navigator.clipboard.writeText(userProfile.shareCode);
      toast.success('Copied!');
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
      toast.error('Code required');
      return;
    }

    try {
      // Normalize: trim and uppercase for consistency
      const normalizedCode = newCode.trim().toUpperCase();
      await updateShareCode.mutateAsync(normalizedCode);
      toast.success('Code updated');
      setIsEditing(false);
      setNewCode('');
    } catch (error: any) {
      toast.error(error.message || 'Update failed');
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
              <CardTitle>Share Code</CardTitle>
              <CardDescription>Invite trusted people</CardDescription>
            </div>
          </div>
          {!isEditing && (
            <IconActionButton
              icon={<Edit2 className="h-4 w-4" />}
              label="Edit code"
              variant="outline"
              size="sm"
              onClick={handleEdit}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="new-code">New Code</Label>
              <Input
                id="new-code"
                placeholder="Enter code"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                maxLength={30}
              />
            </div>
            <ProgressiveDisclosure trigger="What happens?">
              <p className="text-xs text-muted-foreground">
                Changing your code invalidates pending requests.
              </p>
            </ProgressiveDisclosure>
            <div className="flex gap-2">
              <IconActionButton
                icon={<Save className="h-4 w-4" />}
                label="Save code"
                onClick={handleSave}
                disabled={updateShareCode.isPending}
                size="sm"
              >
                <Save className="mr-2 h-4 w-4" />
                {updateShareCode.isPending ? 'Saving...' : 'Save'}
              </IconActionButton>
              <IconActionButton
                icon={<X className="h-4 w-4" />}
                label="Cancel"
                variant="outline"
                onClick={handleCancel}
                size="sm"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </IconActionButton>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-3">
              <code className="flex-1 text-sm font-mono tracking-wide">{userProfile.shareCode}</code>
              <IconActionButton
                icon={<Copy className="h-4 w-4" />}
                label="Copy code"
                variant="ghost"
                size="sm"
                onClick={handleCopy}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Keep private. Share only with trusted people.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

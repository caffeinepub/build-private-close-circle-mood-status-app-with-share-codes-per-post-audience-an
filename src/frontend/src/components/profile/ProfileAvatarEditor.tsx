import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { User, Upload } from 'lucide-react';
import { SYSTEM_AVATARS } from '@/constants/systemAvatars';
import { isValidAvatarType, isValidAvatarSize, fileToUint8Array, getAvatarSrc, revokeAvatarUrl } from '@/utils/profileAvatar';
import type { Avatar as AvatarType } from '@/backend';

interface ProfileAvatarEditorProps {
  currentAvatar: AvatarType | undefined | null;
  onAvatarChange: (avatar: AvatarType | null) => void;
}

export default function ProfileAvatarEditor({ currentAvatar, onAvatarChange }: ProfileAvatarEditorProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarType | null>(currentAvatar || null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview when selected avatar changes
  useEffect(() => {
    // Clean up previous preview URL
    if (previewUrl) {
      revokeAvatarUrl(previewUrl);
    }

    const newUrl = getAvatarSrc(selectedAvatar);
    setPreviewUrl(newUrl);

    // Notify parent of change
    onAvatarChange(selectedAvatar);

    // Cleanup on unmount
    return () => {
      if (newUrl && newUrl.startsWith('blob:')) {
        revokeAvatarUrl(newUrl);
      }
    };
  }, [selectedAvatar]);

  const handleSystemAvatarSelect = (avatarId: string) => {
    setSelectedAvatar({
      __kind__: 'systemAvatar',
      systemAvatar: avatarId,
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!isValidAvatarType(file)) {
      toast.error('Invalid file type. Only PNG and JPEG images are supported.');
      return;
    }

    // Validate file size
    if (!isValidAvatarSize(file)) {
      toast.error('Image size exceeds the maximum allowed size of 1000KB.');
      return;
    }

    try {
      const imageBytes = await fileToUint8Array(file);
      setSelectedAvatar({
        __kind__: 'uploaded',
        uploaded: {
          contentType: file.type,
          image: imageBytes,
        },
      });
      toast.success('Image selected');
    } catch (error) {
      toast.error('Failed to read image file');
    }

    // Reset input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          {previewUrl ? (
            <AvatarImage src={previewUrl} alt="Avatar preview" />
          ) : (
            <AvatarFallback>
              <User className="h-10 w-10" />
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex-1">
          <Label className="text-sm font-medium">Avatar</Label>
          <p className="text-xs text-muted-foreground mt-1">
            Pick a system avatar or upload your own
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-sm">System Avatars</Label>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {SYSTEM_AVATARS.map((avatar) => (
              <button
                key={avatar.id}
                type="button"
                onClick={() => handleSystemAvatarSelect(avatar.id)}
                className={`relative rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                  selectedAvatar?.__kind__ === 'systemAvatar' && selectedAvatar.systemAvatar === avatar.id
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <img
                  src={avatar.path}
                  alt={`System avatar ${avatar.id}`}
                  className="w-full h-full object-cover aspect-square"
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm">Upload Custom</Label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleUploadClick}
            className="w-full mt-2"
          >
            <Upload className="mr-2 h-4 w-4" />
            Choose File (PNG/JPEG, max 1000KB)
          </Button>
        </div>
      </div>
    </div>
  );
}

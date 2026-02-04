import type { Avatar } from '@/backend';
import { getSystemAvatarPath } from '@/constants/systemAvatars';

/**
 * Derives a renderable avatar src from a UserProfile avatar value.
 * - System avatar -> static asset path
 * - Uploaded -> browser object URL from bytes
 * - null/undefined -> null (caller should use fallback)
 */
export function getAvatarSrc(avatar: Avatar | undefined | null): string | null {
  if (!avatar) return null;

  if (avatar.__kind__ === 'systemAvatar') {
    return getSystemAvatarPath(avatar.systemAvatar);
  }

  if (avatar.__kind__ === 'uploaded') {
    // Convert to standard Uint8Array to satisfy TypeScript's Blob constructor type requirements
    const imageData = new Uint8Array(avatar.uploaded.image);
    const blob = new Blob([imageData], { type: avatar.uploaded.contentType });
    return URL.createObjectURL(blob);
  }

  return null;
}

/**
 * Cleanup helper for uploaded avatar object URLs.
 * Call this when unmounting or when the avatar changes to prevent memory leaks.
 */
export function revokeAvatarUrl(url: string | null) {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

/**
 * Validates file type for avatar upload.
 */
export function isValidAvatarType(file: File): boolean {
  return file.type === 'image/png' || file.type === 'image/jpeg';
}

/**
 * Validates file size for avatar upload (max 1000KB).
 */
export function isValidAvatarSize(file: File): boolean {
  const maxSizeBytes = 1000 * 1024; // 1000 KB
  return file.size <= maxSizeBytes;
}

/**
 * Converts a File to Uint8Array for backend upload.
 */
export async function fileToUint8Array(file: File): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

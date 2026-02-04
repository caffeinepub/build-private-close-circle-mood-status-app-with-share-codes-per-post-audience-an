// Fixed system avatar catalog with stable identifiers
export const SYSTEM_AVATARS = [
  {
    id: 'system-avatar-01',
    path: '/assets/generated/system-avatar-01.dim_256x256.png',
  },
  {
    id: 'system-avatar-02',
    path: '/assets/generated/system-avatar-02.dim_256x256.png',
  },
  {
    id: 'system-avatar-03',
    path: '/assets/generated/system-avatar-03.dim_256x256.png',
  },
  {
    id: 'system-avatar-04',
    path: '/assets/generated/system-avatar-04.dim_256x256.png',
  },
  {
    id: 'system-avatar-05',
    path: '/assets/generated/system-avatar-05.dim_256x256.png',
  },
  {
    id: 'system-avatar-06',
    path: '/assets/generated/system-avatar-06.dim_256x256.png',
  },
  {
    id: 'system-avatar-07',
    path: '/assets/generated/system-avatar-07.dim_256x256.png',
  },
  {
    id: 'system-avatar-08',
    path: '/assets/generated/system-avatar-08.dim_256x256.png',
  },
] as const;

export type SystemAvatarId = typeof SYSTEM_AVATARS[number]['id'];

export function getSystemAvatarPath(id: string): string | null {
  const avatar = SYSTEM_AVATARS.find((a) => a.id === id);
  return avatar ? avatar.path : null;
}

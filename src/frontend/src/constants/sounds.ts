// Sound cue asset paths - single source of truth
export const SOUND_ASSETS = {
  notification: '/assets/generated/ui-sound-notification-calm.mp3',
  newFeed: '/assets/generated/ui-sound-new-feed-calm.mp3',
  circleActivity: '/assets/generated/ui-sound-circle-activity-calm.mp3',
} as const;

export type SoundCue = keyof typeof SOUND_ASSETS;

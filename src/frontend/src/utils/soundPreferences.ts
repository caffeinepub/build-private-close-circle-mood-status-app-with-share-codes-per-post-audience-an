const SOUND_PREFERENCE_KEY = 'closecircle_sounds_enabled';

export function getSoundPreference(): boolean {
  try {
    const stored = localStorage.getItem(SOUND_PREFERENCE_KEY);
    // Default to true (enabled) if not set
    return stored === null ? true : stored === 'true';
  } catch {
    // If localStorage is unavailable, default to enabled
    return true;
  }
}

export function setSoundPreference(enabled: boolean): void {
  try {
    localStorage.setItem(SOUND_PREFERENCE_KEY, enabled.toString());
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

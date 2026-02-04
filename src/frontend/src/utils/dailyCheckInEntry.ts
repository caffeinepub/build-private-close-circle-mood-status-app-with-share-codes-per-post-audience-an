const DAILY_CHECKIN_GUARD_KEY = 'daily-checkin-entry-guard';

/**
 * Set a one-time guard flag to indicate the user is entering daily check-in mode
 */
export function setDailyCheckInGuard(): void {
  sessionStorage.setItem(DAILY_CHECKIN_GUARD_KEY, 'true');
}

/**
 * Check and consume the daily check-in guard flag (one-time use)
 * Returns true if the guard was set, false otherwise
 */
export function consumeDailyCheckInGuard(): boolean {
  const hasGuard = sessionStorage.getItem(DAILY_CHECKIN_GUARD_KEY) === 'true';
  if (hasGuard) {
    sessionStorage.removeItem(DAILY_CHECKIN_GUARD_KEY);
  }
  return hasGuard;
}

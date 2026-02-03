/**
 * Utilities for managing the once-per-day mood check-in reminder.
 * Uses localStorage to persist dismissal state keyed by local calendar day.
 */

const REMINDER_STORAGE_KEY = 'moodReminderDismissed';

/**
 * Get the current local date as a stable YYYY-MM-DD string.
 */
export function getCurrentLocalDay(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Check if the reminder has been dismissed for today.
 */
export function isReminderDismissedToday(): boolean {
  try {
    const dismissedDay = localStorage.getItem(REMINDER_STORAGE_KEY);
    const today = getCurrentLocalDay();
    return dismissedDay === today;
  } catch (error) {
    console.error('Failed to read reminder dismissal state:', error);
    return false;
  }
}

/**
 * Mark the reminder as dismissed for today.
 */
export function dismissReminderForToday(): void {
  try {
    const today = getCurrentLocalDay();
    localStorage.setItem(REMINDER_STORAGE_KEY, today);
  } catch (error) {
    console.error('Failed to save reminder dismissal state:', error);
  }
}

/**
 * Check if the reminder should be shown.
 * Returns true if not dismissed today.
 */
export function shouldShowReminder(): boolean {
  return !isReminderDismissedToday();
}

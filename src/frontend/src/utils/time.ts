/**
 * Converts backend Time (bigint nanoseconds) to JS Date
 */
export function timeToDate(time: bigint): Date {
  // Backend Time is in nanoseconds, convert to milliseconds
  return new Date(Number(time / BigInt(1_000_000)));
}

/**
 * Converts JS Date to backend Time (bigint nanoseconds)
 */
export function dateToTime(date: Date): bigint {
  return BigInt(date.getTime()) * BigInt(1_000_000);
}

/**
 * Gets the start of day (00:00:00) for a given date in local timezone
 */
export function getStartOfDay(date: Date): Date {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
}

/**
 * Gets the end of day (23:59:59.999) for a given date in local timezone
 */
export function getEndOfDay(date: Date): Date {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
}

/**
 * Checks if a date is today in local timezone
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Checks if a date is in the past (before today)
 */
export function isPastDate(date: Date): boolean {
  const today = getStartOfDay(new Date());
  const compareDate = getStartOfDay(date);
  return compareDate < today;
}

/**
 * Formats a date for display (e.g., "Jan 15, 2026")
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Formats a date for input field (YYYY-MM-DD)
 */
export function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

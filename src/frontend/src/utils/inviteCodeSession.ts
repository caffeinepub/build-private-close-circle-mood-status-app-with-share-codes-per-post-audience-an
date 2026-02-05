/**
 * Utilities for managing invite code in sessionStorage across the auth flow.
 * Normalizes codes (trim + uppercase) before storing.
 */

const INVITE_CODE_KEY = 'closecircle_invite_code';

export function normalizeInviteCode(code: string): string {
  return code.trim().toUpperCase();
}

export function storeInviteCode(code: string): void {
  const normalized = normalizeInviteCode(code);
  sessionStorage.setItem(INVITE_CODE_KEY, normalized);
}

export function getStoredInviteCode(): string | null {
  return sessionStorage.getItem(INVITE_CODE_KEY);
}

export function clearStoredInviteCode(): void {
  sessionStorage.removeItem(INVITE_CODE_KEY);
}

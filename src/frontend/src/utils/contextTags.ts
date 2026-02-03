import { MAX_CUSTOM_TAG_LENGTH } from '@/constants/contextTags';

export interface TagValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Normalize a custom tag by trimming whitespace and converting to lowercase for comparison
 */
export function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase();
}

/**
 * Validate a custom tag before adding it
 */
export function validateCustomTag(
  tag: string,
  existingTags: string[]
): TagValidationResult {
  const trimmed = tag.trim();

  // Check if empty
  if (trimmed.length === 0) {
    return { valid: false, error: 'Tag cannot be empty' };
  }

  // Check length
  if (trimmed.length > MAX_CUSTOM_TAG_LENGTH) {
    return { valid: false, error: `Tag must be ${MAX_CUSTOM_TAG_LENGTH} characters or less` };
  }

  // Check for duplicates (case-insensitive)
  const normalized = normalizeTag(trimmed);
  const isDuplicate = existingTags.some(
    (existing) => normalizeTag(existing) === normalized
  );

  if (isDuplicate) {
    return { valid: false, error: 'This tag is already selected' };
  }

  return { valid: true };
}

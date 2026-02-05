import { Principal } from '@dfinity/principal';

/**
 * Builds the final audience array for posting a status.
 * Always includes the author so they can see their own post,
 * even when no recipients are selected.
 */
export function buildAudienceWithAuthor(
  selectedRecipients: Principal[],
  authorPrincipal: Principal
): Principal[] {
  const audienceSet = new Set<string>();
  
  // Always include author
  audienceSet.add(authorPrincipal.toString());
  
  // Add selected recipients
  selectedRecipients.forEach((recipient) => {
    audienceSet.add(recipient.toString());
  });
  
  // Convert back to Principal array
  return Array.from(audienceSet).map((p) => Principal.fromText(p));
}

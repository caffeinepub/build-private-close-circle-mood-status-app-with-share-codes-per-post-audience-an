/**
 * Curated emotional copy for login screen rotation.
 * Phrases are calm, reassuring, and consistent with CloseCircle's private, emotional tone.
 */

export const heroSubtexts = [
  "A private space to share the moods you choose with your closest circle",
  "Your safe space to share what you want to share",
  "A quiet place for the check-ins you choose",
  "Share what you want with those who understand",
  "Where the moods you select are held with care",
  "A gentle space for you and your circle",
];

export const cardSubheadings = [
  "Log in to share the moods you choose with those who matter most",
  "Welcome back. Take a breath.",
  "Your space is waiting",
  "Step into your safe space",
  "Your circle is here for you",
  "Ready when you are",
];

/**
 * Picks a random phrase from an array.
 * Selection happens once per component mount (stable during session).
 */
export function pickRandomPhrase(phrases: string[]): string {
  return phrases[Math.floor(Math.random() * phrases.length)];
}

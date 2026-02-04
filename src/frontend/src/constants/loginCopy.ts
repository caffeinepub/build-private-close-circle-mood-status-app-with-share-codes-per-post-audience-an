/**
 * Curated emotional copy for login screen rotation.
 * Gen Z text-light: short, punchy cues.
 */

export const heroSubtexts = [
  "Private space. Your moods. Your circle.",
  "Share what you choose, when you choose.",
  "Quiet check-ins with those who get it.",
  "Your safe space. Your rules.",
  "Moods you pick. People you trust.",
];

export const cardSubheadings = [
  "Log in to your space",
  "Welcome back",
  "Your circle's here",
  "Ready when you are",
];

/**
 * Picks a random phrase from an array.
 * Selection happens once per component mount (stable during session).
 */
export function pickRandomPhrase(phrases: string[]): string {
  return phrases[Math.floor(Math.random() * phrases.length)];
}

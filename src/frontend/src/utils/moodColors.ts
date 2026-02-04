import type { MoodOption } from '@/constants/moods';

/**
 * Maps mood categories to consistent Tailwind className strings for styling
 * Uses the new mood color tokens from the theme
 */
export function getMoodColorClasses(category: MoodOption['category']): {
  border: string;
  bg: string;
  text: string;
  ring: string;
} {
  const colorMap: Record<MoodOption['category'], { border: string; bg: string; text: string; ring: string }> = {
    positive: {
      border: 'border-mood-positive/40',
      bg: 'bg-mood-positive/10',
      text: 'text-mood-positive',
      ring: 'ring-mood-positive/30',
    },
    calm: {
      border: 'border-mood-calm/40',
      bg: 'bg-mood-calm/10',
      text: 'text-mood-calm',
      ring: 'ring-mood-calm/30',
    },
    'low-energy': {
      border: 'border-mood-low-energy/40',
      bg: 'bg-mood-low-energy/10',
      text: 'text-mood-low-energy',
      ring: 'ring-mood-low-energy/30',
    },
    stressed: {
      border: 'border-mood-stressed/40',
      bg: 'bg-mood-stressed/10',
      text: 'text-mood-stressed',
      ring: 'ring-mood-stressed/30',
    },
    neutral: {
      border: 'border-mood-neutral/40',
      bg: 'bg-mood-neutral/10',
      text: 'text-mood-neutral',
      ring: 'ring-mood-neutral/30',
    },
    other: {
      border: 'border-mood-other/40',
      bg: 'bg-mood-other/10',
      text: 'text-mood-other',
      ring: 'ring-mood-other/30',
    },
  };

  return colorMap[category];
}

/**
 * Get gradient classes for selected mood state
 */
export function getMoodGradientClasses(category: MoodOption['category']): string {
  const gradientMap: Record<MoodOption['category'], string> = {
    positive: 'bg-gradient-to-br from-mood-positive/20 to-mood-positive/5',
    calm: 'bg-gradient-to-br from-mood-calm/20 to-mood-calm/5',
    'low-energy': 'bg-gradient-to-br from-mood-low-energy/20 to-mood-low-energy/5',
    stressed: 'bg-gradient-to-br from-mood-stressed/20 to-mood-stressed/5',
    neutral: 'bg-gradient-to-br from-mood-neutral/20 to-mood-neutral/5',
    other: 'bg-gradient-to-br from-mood-other/20 to-mood-other/5',
  };

  return gradientMap[category];
}

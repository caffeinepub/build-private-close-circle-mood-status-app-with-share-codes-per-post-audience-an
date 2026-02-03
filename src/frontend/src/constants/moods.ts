import { Mood } from '@/backend';

export interface MoodOption {
  value: Mood;
  label: string;
  emoji: string;
  category: 'positive' | 'calm' | 'low-energy' | 'stressed' | 'neutral' | 'other';
}

export const MOODS: MoodOption[] = [
  // Positive (high energy, uplifting)
  { value: Mood.happy, label: 'Happy', emoji: '😊', category: 'positive' },
  { value: Mood.excited, label: 'Excited', emoji: '🤩', category: 'positive' },
  { value: Mood.joy, label: 'Joyful', emoji: '😄', category: 'positive' },
  { value: Mood.grateful, label: 'Grateful', emoji: '🙏', category: 'positive' },
  { value: Mood.optimistic, label: 'Optimistic', emoji: '🌟', category: 'positive' },
  { value: Mood.confident, label: 'Confident', emoji: '💪', category: 'positive' },
  { value: Mood.hopeful, label: 'Hopeful', emoji: '🌈', category: 'positive' },
  { value: Mood.inspiration, label: 'Inspired', emoji: '✨', category: 'positive' },
  { value: Mood.triumph, label: 'Triumphant', emoji: '🏆', category: 'positive' },
  { value: Mood.passionate, label: 'Passionate', emoji: '🔥', category: 'positive' },
  { value: Mood.motivate, label: 'Motivated', emoji: '🚀', category: 'positive' },
  { value: Mood.curious, label: 'Curious', emoji: '🤔', category: 'positive' },
  { value: Mood.courage, label: 'Courageous', emoji: '🦁', category: 'positive' },

  // Calm (peaceful, content)
  { value: Mood.calm, label: 'Calm', emoji: '😌', category: 'calm' },
  { value: Mood.relaxed, label: 'Relaxed', emoji: '😎', category: 'calm' },
  { value: Mood.content, label: 'Content', emoji: '☺️', category: 'calm' },
  { value: Mood.zen, label: 'Zen', emoji: '🧘', category: 'calm' },
  { value: Mood.satisfy, label: 'Satisfied', emoji: '😊', category: 'calm' },
  { value: Mood.relieved, label: 'Relieved', emoji: '😮‍💨', category: 'calm' },
  { value: Mood.secure, label: 'Secure', emoji: '🛡️', category: 'calm' },
  { value: Mood.humbled, label: 'Humbled', emoji: '🙇', category: 'calm' },

  // Low Energy (tired, sad, withdrawn)
  { value: Mood.sad, label: 'Sad', emoji: '😢', category: 'low-energy' },
  { value: Mood.tired, label: 'Tired', emoji: '😴', category: 'low-energy' },
  { value: Mood.bore, label: 'Bored', emoji: '😑', category: 'low-energy' },
  { value: Mood.lonely, label: 'Lonely', emoji: '😔', category: 'low-energy' },
  { value: Mood.melancholy, label: 'Melancholy', emoji: '🌧️', category: 'low-energy' },
  { value: Mood.disappoint, label: 'Disappointed', emoji: '😞', category: 'low-energy' },
  { value: Mood.apathetic, label: 'Apathetic', emoji: '😶', category: 'low-energy' },
  { value: Mood.indifferen, label: 'Indifferent', emoji: '🤷', category: 'low-energy' },

  // Stressed (anxious, tense, negative high energy)
  { value: Mood.stressed, label: 'Stressed', emoji: '😰', category: 'stressed' },
  { value: Mood.anxious, label: 'Anxious', emoji: '😟', category: 'stressed' },
  { value: Mood.nervous, label: 'Nervous', emoji: '😬', category: 'stressed' },
  { value: Mood.worry, label: 'Worried', emoji: '😥', category: 'stressed' },
  { value: Mood.overwhelm, label: 'Overwhelmed', emoji: '😵', category: 'stressed' },
  { value: Mood.frustrate, label: 'Frustrated', emoji: '😤', category: 'stressed' },
  { value: Mood.angry, label: 'Angry', emoji: '😠', category: 'stressed' },
  { value: Mood.irritate, label: 'Irritated', emoji: '😒', category: 'stressed' },
  { value: Mood.fear, label: 'Fearful', emoji: '😨', category: 'stressed' },
  { value: Mood.unsafe, label: 'Unsafe', emoji: '⚠️', category: 'stressed' },

  // Neutral
  { value: Mood.neutral, label: 'Neutral', emoji: '😐', category: 'neutral' },

  // Other (complex/mixed emotions)
  { value: Mood.embarrass, label: 'Embarrassed', emoji: '😳', category: 'other' },
  { value: Mood.shy, label: 'Shy', emoji: '🙈', category: 'other' },
  { value: Mood.guilty, label: 'Guilty', emoji: '😓', category: 'other' },
  { value: Mood.ashamed, label: 'Ashamed', emoji: '😖', category: 'other' },
  { value: Mood.disgust, label: 'Disgusted', emoji: '🤢', category: 'other' },
];

export const MOOD_CATEGORIES = {
  positive: { label: 'Positive', description: 'Uplifting and energizing' },
  calm: { label: 'Calm', description: 'Peaceful and content' },
  'low-energy': { label: 'Low Energy', description: 'Tired or withdrawn' },
  stressed: { label: 'Stressed', description: 'Anxious or tense' },
  neutral: { label: 'Neutral', description: 'Balanced or even' },
  other: { label: 'Other', description: 'Complex emotions' },
} as const;

/**
 * Get mood option by value
 */
export function getMoodOption(mood: Mood): MoodOption | undefined {
  return MOODS.find((m) => m.value === mood);
}

/**
 * Get mood label
 */
export function getMoodLabel(mood: Mood): string {
  return getMoodOption(mood)?.label || 'Unknown';
}

/**
 * Get mood emoji
 */
export function getMoodEmoji(mood: Mood): string {
  return getMoodOption(mood)?.emoji || '😐';
}

/**
 * Get moods by category
 */
export function getMoodsByCategory(category: MoodOption['category']): MoodOption[] {
  return MOODS.filter((m) => m.category === category);
}

/**
 * Safely present a mood with label and emoji, with fallback for unknown moods
 */
export function presentMood(mood: Mood): { label: string; emoji: string } {
  const option = getMoodOption(mood);
  if (option) {
    return { label: option.label, emoji: option.emoji };
  }
  // Fallback for unknown moods
  return { label: 'Unknown', emoji: '😐' };
}

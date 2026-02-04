import type { Mood } from '@/backend';
import { MOODS } from '@/constants/moods';

export interface MicroAction {
  id: string;
  text: string;
  category: 'breathing' | 'reflection' | 'connection' | 'movement' | 'grounding';
}

export interface MoodHistoryEntryWithTags {
  mood: Mood;
  date: Date;
  content: string;
  contextTags?: string[];
}

export interface MicroActionSuggestion {
  actions: MicroAction[];
  reason: string;
}

// Micro-action library (≤2 minutes, non-clinical)
const MICRO_ACTIONS: MicroAction[] = [
  {
    id: 'breathing-3',
    text: 'Pause and take 3 slow breaths',
    category: 'breathing',
  },
  {
    id: 'write-sentence',
    text: 'Write one private sentence',
    category: 'reflection',
  },
  {
    id: 'quiet-signal',
    text: 'Send a quiet signal to someone you trust',
    category: 'connection',
  },
  {
    id: 'stretch-30s',
    text: 'Stand up and stretch for 30 seconds',
    category: 'movement',
  },
  {
    id: 'water-sip',
    text: 'Drink a glass of water slowly',
    category: 'grounding',
  },
  {
    id: 'window-look',
    text: 'Look out a window for one minute',
    category: 'grounding',
  },
  {
    id: 'feet-ground',
    text: 'Notice your feet on the ground',
    category: 'grounding',
  },
  {
    id: 'walk-2min',
    text: 'Take a 2-minute walk',
    category: 'movement',
  },
  {
    id: 'list-3-things',
    text: 'List 3 things you can see right now',
    category: 'grounding',
  },
  {
    id: 'music-pause',
    text: 'Listen to one song you like',
    category: 'grounding',
  },
];

/**
 * Classify mood into sentiment category
 */
function classifyMood(mood: Mood): 'positive' | 'negative' | 'neutral' {
  const moodOption = MOODS.find((m) => m.value === mood);
  if (!moodOption) return 'neutral';

  switch (moodOption.category) {
    case 'positive':
      return 'positive';
    case 'calm':
      return 'positive';
    case 'low-energy':
      return 'negative';
    case 'stressed':
      return 'negative';
    case 'neutral':
      return 'neutral';
    case 'other':
      return 'neutral';
    default:
      return 'neutral';
  }
}

/**
 * Get mood category from backend Mood enum
 */
function getMoodCategory(mood: Mood): string {
  const moodOption = MOODS.find((m) => m.value === mood);
  return moodOption?.category || 'neutral';
}

/**
 * Conservative rule engine that maps multi-signal patterns to micro-actions
 * Requires BOTH mood history signals AND context tags for most rules
 */
export function generateMicroActionSuggestions(
  moodHistory: MoodHistoryEntryWithTags[]
): MicroActionSuggestion | null {
  // Insufficient data guard
  if (moodHistory.length === 0) {
    return null;
  }

  // Analyze recent mood patterns (last 7 entries or all if fewer)
  const recentEntries = moodHistory.slice(-7);
  const recentMoods = recentEntries.map((e) => e.mood);
  
  // Collect all context tags from recent entries
  const allTags = recentEntries
    .flatMap((e) => e.contextTags || [])
    .map((tag) => tag.toLowerCase());
  const uniqueTags = Array.from(new Set(allTags));

  // Calculate sentiment distribution
  let negativeCount = 0;
  let positiveCount = 0;
  let stressedCount = 0;
  let lowEnergyCount = 0;

  recentMoods.forEach((mood) => {
    const sentiment = classifyMood(mood);
    const category = getMoodCategory(mood);
    
    if (sentiment === 'negative') negativeCount++;
    if (sentiment === 'positive') positiveCount++;
    if (category === 'stressed') stressedCount++;
    if (category === 'low-energy') lowEnergyCount++;
  });

  const negativePercentage = (negativeCount / recentMoods.length) * 100;
  const stressedPercentage = (stressedCount / recentMoods.length) * 100;
  const lowEnergyPercentage = (lowEnergyCount / recentMoods.length) * 100;

  // RULE 1: Stressed moods + work/health tags → breathing + grounding
  if (
    stressedPercentage >= 50 &&
    (uniqueTags.includes('work') || uniqueTags.includes('health'))
  ) {
    return {
      actions: [
        MICRO_ACTIONS.find((a) => a.id === 'breathing-3')!,
        MICRO_ACTIONS.find((a) => a.id === 'feet-ground')!,
        MICRO_ACTIONS.find((a) => a.id === 'water-sip')!,
      ],
      reason: 'When stress shows up around work or health',
    };
  }

  // RULE 2: Low energy moods + sleep/health tags → movement + grounding
  if (
    lowEnergyPercentage >= 50 &&
    (uniqueTags.includes('sleep') || uniqueTags.includes('health'))
  ) {
    return {
      actions: [
        MICRO_ACTIONS.find((a) => a.id === 'stretch-30s')!,
        MICRO_ACTIONS.find((a) => a.id === 'water-sip')!,
        MICRO_ACTIONS.find((a) => a.id === 'window-look')!,
      ],
      reason: 'When energy feels low around sleep or health',
    };
  }

  // RULE 3: Negative moods + relationships/family tags → connection + reflection
  if (
    negativePercentage >= 50 &&
    (uniqueTags.includes('relationships') ||
      uniqueTags.includes('family') ||
      uniqueTags.includes('friends'))
  ) {
    return {
      actions: [
        MICRO_ACTIONS.find((a) => a.id === 'quiet-signal')!,
        MICRO_ACTIONS.find((a) => a.id === 'write-sentence')!,
        MICRO_ACTIONS.find((a) => a.id === 'breathing-3')!,
      ],
      reason: 'When things feel hard around relationships',
    };
  }

  // RULE 4: Stressed moods + finances/personal tags → grounding + breathing
  if (
    stressedPercentage >= 40 &&
    (uniqueTags.includes('finances') || uniqueTags.includes('personal'))
  ) {
    return {
      actions: [
        MICRO_ACTIONS.find((a) => a.id === 'breathing-3')!,
        MICRO_ACTIONS.find((a) => a.id === 'list-3-things')!,
        MICRO_ACTIONS.find((a) => a.id === 'walk-2min')!,
      ],
      reason: 'When stress appears around personal or financial matters',
    };
  }

  // RULE 5: Mixed negative moods with any tags → general support
  if (negativePercentage >= 60 && uniqueTags.length > 0) {
    return {
      actions: [
        MICRO_ACTIONS.find((a) => a.id === 'breathing-3')!,
        MICRO_ACTIONS.find((a) => a.id === 'write-sentence')!,
        MICRO_ACTIONS.find((a) => a.id === 'quiet-signal')!,
      ],
      reason: 'When low moods show up across different areas',
    };
  }

  // RULE 6: Stressed without specific tags → breathing focus
  if (stressedPercentage >= 60) {
    return {
      actions: [
        MICRO_ACTIONS.find((a) => a.id === 'breathing-3')!,
        MICRO_ACTIONS.find((a) => a.id === 'feet-ground')!,
        MICRO_ACTIONS.find((a) => a.id === 'window-look')!,
      ],
      reason: 'When stress is present',
    };
  }

  // RULE 7: Low energy without specific tags → gentle movement
  if (lowEnergyPercentage >= 60) {
    return {
      actions: [
        MICRO_ACTIONS.find((a) => a.id === 'stretch-30s')!,
        MICRO_ACTIONS.find((a) => a.id === 'water-sip')!,
        MICRO_ACTIONS.find((a) => a.id === 'music-pause')!,
      ],
      reason: 'When energy feels low',
    };
  }

  // RULE 8: General negative pattern → reflection + connection
  if (negativePercentage >= 50) {
    return {
      actions: [
        MICRO_ACTIONS.find((a) => a.id === 'write-sentence')!,
        MICRO_ACTIONS.find((a) => a.id === 'quiet-signal')!,
        MICRO_ACTIONS.find((a) => a.id === 'breathing-3')!,
      ],
      reason: 'When things feel difficult',
    };
  }

  // RULE 9: Positive pattern with tags → maintain practices
  if (positiveCount >= recentMoods.length * 0.7 && uniqueTags.length > 0) {
    return {
      actions: [
        MICRO_ACTIONS.find((a) => a.id === 'list-3-things')!,
        MICRO_ACTIONS.find((a) => a.id === 'write-sentence')!,
        MICRO_ACTIONS.find((a) => a.id === 'breathing-3')!,
      ],
      reason: 'Small practices to keep going',
    };
  }

  // No strong pattern detected
  return null;
}

/**
 * Get guardrail/disclaimer text for micro-actions
 */
export function getMicroActionsDisclaimer(): string {
  return 'These are small, optional ideas — not medical advice. If you need support, please reach out to someone you trust or a professional.';
}

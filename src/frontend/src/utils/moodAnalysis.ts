import type { Mood } from '@/backend';
import { MOODS, presentMood } from '@/constants/moods';

export type MoodDistribution = Record<string, number>;

export interface MoodAnalysisResult {
  distribution: MoodDistribution;
  totalEntries: number;
  dominantMood: Mood | null;
  trend: 'improving' | 'declining' | 'stable' | 'insufficient_data';
  concernLevel: 'none' | 'mild' | 'moderate' | 'elevated';
  guidance: string;
  disclaimer: string;
}

const DISCLAIMER =
  '⚠️ This analysis reflects patterns in the moods you selected. It is not a diagnosis or substitute for professional support. If you need help, please reach out to a trusted person or professional.';

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
    case 'physical-state':
      return 'neutral';
    case 'other':
      return 'neutral';
    default:
      return 'neutral';
  }
}

/**
 * Analyzes mood patterns from status posts
 */
export function analyzeMoodPatterns(moods: Mood[], timeframeDays: number): MoodAnalysisResult {
  const totalEntries = moods.length;

  // Initialize distribution with all catalog moods set to 0
  const distribution: MoodDistribution = {};
  MOODS.forEach((mood) => {
    distribution[mood.value] = 0;
  });

  // Count mood occurrences
  moods.forEach((mood) => {
    if (distribution[mood] !== undefined) {
      distribution[mood]++;
    } else {
      // Handle any mood not in our catalog (track as unknown)
      if (!distribution['__unknown__']) {
        distribution['__unknown__'] = 0;
      }
      distribution['__unknown__']++;
    }
  });

  // Calculate sentiment percentages
  let positiveCount = 0;
  let negativeCount = 0;
  let neutralCount = 0;

  moods.forEach((mood) => {
    const sentiment = classifyMood(mood);
    if (sentiment === 'positive') positiveCount++;
    else if (sentiment === 'negative') negativeCount++;
    else neutralCount++;
  });

  const positivePercentage = totalEntries > 0 ? (positiveCount / totalEntries) * 100 : 0;
  const negativePercentage = totalEntries > 0 ? (negativeCount / totalEntries) * 100 : 0;
  const neutralPercentage = totalEntries > 0 ? (neutralCount / totalEntries) * 100 : 0;

  // Determine dominant mood
  let dominantMood: Mood | null = null;
  let maxCount = 0;
  Object.keys(distribution).forEach((moodKey) => {
    if (moodKey !== '__unknown__' && distribution[moodKey] > maxCount) {
      maxCount = distribution[moodKey];
      dominantMood = moodKey as Mood;
    }
  });

  // Analyze trend (compare first half vs second half)
  const trend = analyzeTrend(moods);

  // Determine concern level based on conservative thresholds
  const concernLevel = determineConcernLevel(
    positivePercentage,
    negativePercentage,
    totalEntries,
    timeframeDays
  );

  // Generate guidance
  const guidance = generateGuidance(
    positivePercentage,
    negativePercentage,
    neutralPercentage,
    dominantMood,
    trend,
    concernLevel,
    totalEntries,
    timeframeDays
  );

  return {
    distribution,
    totalEntries,
    dominantMood,
    trend,
    concernLevel,
    guidance,
    disclaimer: DISCLAIMER,
  };
}

function analyzeTrend(moods: Mood[]): 'improving' | 'declining' | 'stable' | 'insufficient_data' {
  if (moods.length < 6) {
    return 'insufficient_data';
  }

  const midpoint = Math.floor(moods.length / 2);
  const firstHalf = moods.slice(0, midpoint);
  const secondHalf = moods.slice(midpoint);

  const firstHalfScore = calculateMoodScore(firstHalf);
  const secondHalfScore = calculateMoodScore(secondHalf);

  const difference = secondHalfScore - firstHalfScore;

  if (Math.abs(difference) < 0.3) {
    return 'stable';
  } else if (difference > 0) {
    return 'improving';
  } else {
    return 'declining';
  }
}

function calculateMoodScore(moods: Mood[]): number {
  // Assign scores based on sentiment classification
  const total = moods.reduce((sum, mood) => {
    const sentiment = classifyMood(mood);
    if (sentiment === 'positive') return sum + 1;
    if (sentiment === 'negative') return sum - 1;
    return sum; // neutral = 0
  }, 0);

  return moods.length > 0 ? total / moods.length : 0;
}

function determineConcernLevel(
  positivePercentage: number,
  negativePercentage: number,
  totalEntries: number,
  timeframeDays: number
): 'none' | 'mild' | 'moderate' | 'elevated' {
  // Conservative thresholds - only flag if patterns are sustained
  if (totalEntries < 5 || timeframeDays < 7) {
    return 'none'; // Insufficient data
  }

  // Elevated: sustained negative mood over extended period
  if (timeframeDays >= 14 && negativePercentage >= 70 && positivePercentage < 15) {
    return 'elevated';
  }

  // Moderate: significant negative mood pattern
  if (timeframeDays >= 10 && negativePercentage >= 60 && positivePercentage < 20) {
    return 'moderate';
  }

  // Mild: noticeable negative trend
  if (negativePercentage >= 50 && positivePercentage < 30) {
    return 'mild';
  }

  return 'none';
}

function generateGuidance(
  positivePercentage: number,
  negativePercentage: number,
  neutralPercentage: number,
  dominantMood: Mood | null,
  trend: string,
  concernLevel: string,
  totalEntries: number,
  timeframeDays: number
): string {
  if (totalEntries === 0) {
    return 'No entries yet. Select moods to check in and see patterns over time.';
  }

  if (totalEntries < 5) {
    return `Based on ${totalEntries} entries over ${timeframeDays} days. Keep checking in to see more patterns.`;
  }

  let guidance = '';

  // Pattern-based observations with agency-preserving language
  if (concernLevel === 'elevated') {
    guidance = `Based on your selected moods over the past ${timeframeDays} days, you've chosen low moods frequently (${Math.round(negativePercentage)}% of entries).\n\n`;
    guidance += `This pattern might be worth noticing. If you're finding things difficult, reaching out to someone you trust or a professional could help.\n\n`;
    guidance += `You're not alone, and support is available when you're ready.`;
  } else if (concernLevel === 'moderate') {
    guidance = `Looking at your selected moods over ${timeframeDays} days, you've chosen low moods often (${Math.round(negativePercentage)}% of entries).\n\n`;
    guidance += `If this pattern continues or things feel harder, consider talking to someone you trust or reaching out for support.\n\n`;
    guidance += `Taking care of yourself matters.`;
  } else if (concernLevel === 'mild') {
    guidance = `Based on your selected moods over ${timeframeDays} days, you've chosen low moods somewhat frequently (${Math.round(negativePercentage)}% of entries).\n\n`;
    guidance += `If you notice this continuing, it might help to check in with yourself about what's going on. Reaching out to someone you trust can make a difference.\n\n`;
    guidance += `Small steps toward support can help.`;
  } else {
    // No concern - provide neutral feedback
    if (trend === 'improving') {
      guidance = `Based on your selected moods over ${timeframeDays} days, your entries show an upward trend. `;
    } else if (trend === 'stable') {
      guidance = `Based on your selected moods over ${timeframeDays} days, your entries have been fairly consistent. `;
    } else if (trend === 'declining') {
      guidance = `Based on your selected moods over ${timeframeDays} days, your entries show a slight downward trend. `;
    } else {
      guidance = `Based on ${totalEntries} entries over ${timeframeDays} days. `;
    }

    if (dominantMood) {
      const sentiment = classifyMood(dominantMood);
      const { label: moodLabel } = presentMood(dominantMood);
      const moodPercentage = Math.round(positivePercentage);

      if (sentiment === 'positive') {
        guidance += `You've selected ${moodLabel} most often (${moodPercentage}% positive overall). Keep noticing what supports you.`;
      } else if (sentiment === 'neutral') {
        guidance += `You've selected neutral moods most often (${Math.round(neutralPercentage)}%). This might reflect steadiness, or it might be worth checking in with yourself about how you're really doing.`;
      } else {
        guidance += `You've selected ${moodLabel} most often (${Math.round(negativePercentage)}% low moods overall). If this continues, consider reaching out to someone you trust.`;
      }
    }
  }

  return guidance;
}

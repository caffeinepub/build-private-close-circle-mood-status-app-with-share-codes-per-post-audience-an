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
  '⚠️ Important: This analysis is not a medical diagnosis and is not a substitute for professional mental health care. If you are experiencing persistent distress, please consult a qualified healthcare provider.';

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
    return 'No mood data available for the selected timeframe. Start sharing your feelings to see insights.';
  }

  if (totalEntries < 5) {
    return `Limited data available (${totalEntries} entries over ${timeframeDays} days). Continue tracking your moods for more meaningful insights.`;
  }

  let guidance = '';

  // Clinical-style analysis with conservative language
  if (concernLevel === 'elevated') {
    guidance = `**Pattern Analysis:** Over the past ${timeframeDays} days, your mood data indicates a sustained pattern of distress (${Math.round(negativePercentage)}% negative affect). This pattern may warrant professional attention.\n\n`;
    guidance += `**Clinical Consideration:** Persistent low mood or elevated stress lasting two weeks or more can be indicative of underlying mental health concerns. While this analysis cannot diagnose conditions, the pattern observed suggests you may benefit from consultation with a mental health professional.\n\n`;
    guidance += `**Recommendation:** Strongly consider scheduling an appointment with a licensed therapist, counselor, or psychiatrist. Many evidence-based treatments are available and effective.`;
  } else if (concernLevel === 'moderate') {
    guidance = `**Pattern Analysis:** Your mood tracking over ${timeframeDays} days shows a notable pattern of negative affect (${Math.round(negativePercentage)}% negative entries).\n\n`;
    guidance += `**Observation:** While brief periods of low mood are part of normal human experience, sustained patterns may benefit from intervention. Consider whether external stressors, life changes, or other factors may be contributing.\n\n`;
    guidance += `**Suggestion:** If this pattern continues or worsens, consider reaching out to a mental health professional. Early intervention can be highly effective.`;
  } else if (concernLevel === 'mild') {
    guidance = `**Pattern Analysis:** Your recent mood data (${timeframeDays} days) shows a tendency toward negative affect (${Math.round(negativePercentage)}% negative entries).\n\n`;
    guidance += `**Context:** Fluctuations in mood are normal, especially during challenging periods. However, if you notice this pattern persisting or interfering with daily functioning, it may be worth exploring further.\n\n`;
    guidance += `**Self-Care:** Consider stress management techniques, social connection, physical activity, and adequate sleep. If concerns persist, professional support is available.`;
  } else {
    // No concern - provide positive or neutral feedback
    if (trend === 'improving') {
      guidance = `**Positive Trend:** Your mood appears to be improving over the past ${timeframeDays} days. `;
    } else if (trend === 'stable') {
      guidance = `**Stable Pattern:** Your mood has been relatively consistent over ${timeframeDays} days. `;
    } else if (trend === 'declining') {
      guidance = `**Observation:** Your mood shows a slight downward trend over ${timeframeDays} days. `;
    } else {
      guidance = `**Current Status:** Based on ${totalEntries} entries over ${timeframeDays} days. `;
    }

    if (dominantMood) {
      const sentiment = classifyMood(dominantMood);
      const { label: moodLabel } = presentMood(dominantMood);
      const moodPercentage = Math.round(positivePercentage);

      if (sentiment === 'positive') {
        guidance += `Your dominant mood is ${moodLabel} (${moodPercentage}% positive overall), which suggests generally positive emotional well-being. Continue practices that support your mental health.`;
      } else if (sentiment === 'neutral') {
        guidance += `Your mood is predominantly neutral (${Math.round(neutralPercentage)}%). This may indicate emotional stability or, alternatively, emotional numbing. Reflect on whether you feel engaged with your experiences.`;
      } else {
        guidance += `Your dominant mood is ${moodLabel} (${Math.round(negativePercentage)}% negative overall). While temporary periods of difficult emotions are normal, monitor this pattern. If it persists or worsens, consider seeking support.`;
      }
    }
  }

  return guidance;
}

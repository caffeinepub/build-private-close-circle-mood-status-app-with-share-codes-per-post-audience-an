import type { StatusPost, Mood } from '@/backend';
import { MOODS } from '@/constants/moods';
import { timeToDate } from './time';

/**
 * Filters status posts to only those from the last 7 days
 */
export function filterLast7Days(posts: StatusPost[]): StatusPost[] {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  return posts.filter((post) => {
    const postDate = timeToDate(post.createdAt);
    return postDate >= sevenDaysAgo;
  });
}

/**
 * Categorizes moods into high-level sentiment buckets using MOODS catalog
 */
function getMoodSentiment(mood: Mood): 'positive' | 'calm' | 'low' | 'stressed' | 'neutral' | 'mixed' {
  const moodOption = MOODS.find((m) => m.value === mood);
  if (!moodOption) return 'mixed';

  switch (moodOption.category) {
    case 'positive':
      return 'positive';
    case 'calm':
      return 'calm';
    case 'low-energy':
      return 'low';
    case 'stressed':
      return 'stressed';
    case 'neutral':
      return 'neutral';
    case 'physical-state':
      return 'neutral';
    case 'other':
      return 'mixed';
    default:
      return 'mixed';
  }
}

/**
 * Analyzes recent posts and determines the overall vibe bucket
 */
function analyzeCircleVibe(posts: StatusPost[]): 'calm' | 'mixed' | 'tender' | 'heavy' | 'steady' | 'empty' {
  if (posts.length === 0) return 'empty';
  
  const sentiments = posts.map(post => getMoodSentiment(post.mood));
  const counts = {
    positive: 0,
    calm: 0,
    low: 0,
    stressed: 0,
    neutral: 0,
    mixed: 0,
  };
  
  sentiments.forEach(s => counts[s]++);
  
  const total = posts.length;
  const calmRatio = (counts.calm + counts.positive) / total;
  const lowRatio = counts.low / total;
  const stressedRatio = counts.stressed / total;
  
  // Determine vibe bucket based on dominant sentiment patterns
  if (calmRatio >= 0.6) return 'calm';
  if (stressedRatio >= 0.4) return 'heavy';
  if (lowRatio >= 0.4) return 'tender';
  if (counts.neutral / total >= 0.5) return 'steady';
  
  return 'mixed';
}

/**
 * Generates a stable seed from the time window and vibe bucket
 */
function generateSeed(vibe: string): number {
  const now = new Date();
  const weekNumber = Math.floor(now.getTime() / (7 * 24 * 60 * 60 * 1000));
  const seedStr = `${weekNumber}-${vibe}`;
  
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    const char = seedStr.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return Math.abs(hash);
}

/**
 * Selects a phrase from an array using a stable seed
 */
function selectPhrase(phrases: string[], seed: number): string {
  return phrases[seed % phrases.length];
}

/**
 * Banned terms filter - ensures no clinical/diagnostic language
 */
const BANNED_TERMS = [
  'depression', 'anxiety disorder', 'symptoms', 'clinical', 'diagnosis',
  'disorder', 'condition', 'treatment', 'therapy', 'medication', 'patient',
  'feel', 'feels', 'feeling'
];

function containsBannedTerms(text: string): boolean {
  const lowerText = text.toLowerCase();
  return BANNED_TERMS.some(term => lowerText.includes(term));
}

/**
 * Generates a soft, abstract Circle Energy summary sentence
 */
export function generateCircleEnergySummary(posts: StatusPost[]): string {
  const last7Days = filterLast7Days(posts);
  const vibe = analyzeCircleVibe(last7Days);
  
  if (vibe === 'empty') {
    const emptyPhrases = [
      'Your circle is quiet this week.',
      'Posts have been still in your circle lately.',
      'Your circle has been resting this week.',
      'A peaceful pause in your circle this week.',
    ];
    const seed = generateSeed('empty');
    return selectPhrase(emptyPhrases, seed);
  }
  
  const templates: Record<string, string[]> = {
    calm: [
      'Posts this week leaned calm and steady.',
      'This week\'s posts had a gentle, settled tone.',
      'Posts shared this week carried a peaceful quality.',
      'The moods shared this week were mostly soft and calm.',
      'Posts this week showed a quiet ease.',
    ],
    mixed: [
      'Posts this week covered a lot of different moods.',
      'This week\'s posts had a varied mix of moods.',
      'The moods shared this week were quite diverse.',
      'Posts this week showed a range of different tones.',
      'This week\'s posts reflected many different moods.',
    ],
    tender: [
      'Posts this week leaned tender and low.',
      'This week\'s posts had a soft, vulnerable quality.',
      'The moods shared this week were gentle and low.',
      'Posts this week carried some quiet heaviness.',
      'This week\'s posts showed a tender, delicate tone.',
    ],
    heavy: [
      'Posts this week leaned intense and charged.',
      'This week\'s posts had a heavier, more intense tone.',
      'The moods shared this week were strong and full.',
      'Posts this week carried a lot of weight.',
      'This week\'s posts showed some intense energy.',
    ],
    steady: [
      'Posts this week were steady and even.',
      'This week\'s posts had a balanced, consistent tone.',
      'The moods shared this week were grounded and steady.',
      'Posts this week showed an even rhythm.',
      'This week\'s posts were steady and present.',
    ],
  };
  
  const phrases = templates[vibe] || templates.mixed;
  const seed = generateSeed(vibe);
  const sentence = selectPhrase(phrases, seed);
  
  // Safety check
  if (containsBannedTerms(sentence)) {
    return 'Your circle shared posts this week.';
  }
  
  return sentence;
}

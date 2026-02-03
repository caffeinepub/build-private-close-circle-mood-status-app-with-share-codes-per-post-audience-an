// Predefined context tags configuration
export const PREDEFINED_CONTEXT_TAGS = [
  'work',
  'family',
  'health',
  'relationships',
  'friends',
  'personal',
  'finances',
  'hobbies',
  'exercise',
  'sleep',
  'social',
  'travel',
] as const;

export type PredefinedContextTag = typeof PREDEFINED_CONTEXT_TAGS[number];

// Configuration
export const CONTEXT_TAG_SOFT_LIMIT = 3;
export const MAX_CUSTOM_TAG_LENGTH = 20;

import type { WorryCategory } from '../types';

/**
 * Phrase keywords (multi-word) - checked against full text
 * Worth 3 points each for stronger signal
 */
const CATEGORY_PHRASES: Partial<Record<WorryCategory, string[]>> = {
  work: ['performance review', 'pay rise', 'pay raise'],
  health: ['panic attack', 'mental health'],
  finance: ['credit card', 'bank account', 'late fee'],
};

/**
 * Single-word keywords - checked against tokenized text
 * Worth 1 point each
 */
const CATEGORY_KEYWORDS: Record<Exclude<WorryCategory, 'personal' | 'other'>, string[]> = {
  work: [
    'work',
    'job',
    'boss',
    'coworker',
    'colleague',
    'meeting',
    'deadline',
    'project',
    'office',
    'career',
    'promotion',
    'interview',
    'client',
    'manager',
    'employee',
    'salary',
    'fired',
    'layoff',
    'presentation',
    'email',
    'slack',
    'teams',
    'performance',
    'review',
    'workload',
    'burnout',
  ],
  health: [
    'health',
    'doctor',
    'hospital',
    'sick',
    'illness',
    'pain',
    'symptom',
    'medicine',
    'treatment',
    'diagnosis',
    'appointment',
    'surgery',
    'anxiety',
    'depression',
    'therapy',
    'exercise',
    'weight',
    'sleep',
    'tired',
    'fatigue',
    'panic',
    'insomnia',
  ],
  relationships: [
    'relationship',
    'partner',
    'spouse',
    'husband',
    'wife',
    'boyfriend',
    'girlfriend',
    'friend',
    'family',
    'parent',
    'child',
    'kid',
    'kids',
    'mother',
    'father',
    'mom',
    'dad',
    'brother',
    'sister',
    'son',
    'daughter',
    'dating',
    'breakup',
    'divorce',
    'marriage',
    'argument',
    'fight',
    'roommate',
    'flatmate',
    'communication',
  ],
  finance: [
    'money',
    'finance',
    'debt',
    'loan',
    'mortgage',
    'rent',
    'bills',
    'payment',
    'credit',
    'bank',
    'savings',
    'invest',
    'budget',
    'expense',
    'taxes',
    'income',
    'afford',
    'overdraft',
    'interest',
    'fees',
    'paid',
    'payday',
    'invoice',
  ],
};

/**
 * Auto-categorize worry content based on keyword matching
 * Uses tokenization to avoid substring false-positives
 * 'personal' is only used as fallback when no other category matches
 */
export function autoCategorize(content: string): WorryCategory {
  // Normalize: lowercase and extract word tokens
  const normalizedText = content.toLowerCase();
  const tokens = new Set(normalizedText.match(/\b[a-z]+\b/g) || []);

  // Score each category
  const scores: Record<string, number> = {};

  // Check phrase matches (worth 3 points each)
  for (const [category, phrases] of Object.entries(CATEGORY_PHRASES)) {
    scores[category] = scores[category] || 0;
    for (const phrase of phrases) {
      if (normalizedText.includes(phrase)) {
        scores[category] += 3;
      }
    }
  }

  // Check token matches (worth 1 point each)
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    scores[category] = scores[category] || 0;
    for (const keyword of keywords) {
      if (tokens.has(keyword)) {
        scores[category] += 1;
      }
    }
  }

  // Find highest scoring category (excluding personal)
  let bestCategory: WorryCategory = 'personal';
  let bestScore = 0;

  for (const [category, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category as WorryCategory;
    }
  }

  return bestCategory;
}

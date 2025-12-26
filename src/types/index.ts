// Core types for Worry Box app

export type WorryStatus = 'locked' | 'unlocked' | 'resolved' | 'dismissed';

export type WorryCategory = 'work' | 'health' | 'relationships' | 'finance' | 'personal' | 'other';

export interface Worry {
  id: string; // UUID v4
  content: string; // What the user is worried about
  action?: string; // Optional: what to do when unlocked
  context?: string; // Optional: why they're worried

  createdAt: string; // ISO 8601
  unlockAt: string; // ISO 8601 - when notification fires
  unlockedAt?: string; // ISO 8601 - when user actually opened it
  resolvedAt?: string; // ISO 8601 - when marked as done
  releasedAt?: string; // ISO 8601 - when released (dismissed as uncontrollable)
  resolutionNote?: string; // What the user did to resolve it

  status: WorryStatus;
  notificationId: number; // Capacitor notification ID

  // Categorization and reflection
  category?: WorryCategory; // Life area category
  tags?: string[]; // Optional custom tags
  bestOutcome?: string; // What's the best possible outcome?
  talkedToSomeone?: boolean; // Have you discussed this with someone?
}

export interface UserPreferences {
  defaultUnlockTime: string; // e.g., "09:00" - default time of day
  quietHoursStart?: string; // e.g., "22:00"
  quietHoursEnd?: string; // e.g., "08:00"
  hapticFeedback: boolean;
  encouragingMessages: boolean; // Show supportive text in notifications
  showCategoryField: boolean; // Show category selector in worry form
  showBestOutcomeField: boolean; // Show best outcome field in worry form
  showTalkedToSomeoneField: boolean; // Show talked to someone toggle in worry form
}

export interface WorryStats {
  totalWorries: number;
  resolvedWorries: number;
  dismissedWorries: number;
  averageTimeToResolve?: number; // in milliseconds
}

export const STORAGE_KEYS = {
  WORRIES: 'worry_box_worries',
  PREFERENCES: 'worry_box_prefs',
  STATS: 'worry_box_stats',
  ONBOARDING: 'worry_box_onboarding_complete',
} as const;

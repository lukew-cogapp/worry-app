import { Preferences } from '@capacitor/preferences';
import type { UserPreferences, Worry, WorryStats } from '../types';
import { STORAGE_KEYS } from '../types';

const defaultPreferences: UserPreferences = {
  defaultUnlockTime: '09:00',
  hapticFeedback: true,
  encouragingMessages: true,
};

const defaultStats: WorryStats = {
  totalWorries: 0,
  resolvedWorries: 0,
  dismissedWorries: 0,
};

// Worries
export async function getWorries(): Promise<Worry[]> {
  const { value } = await Preferences.get({ key: STORAGE_KEYS.WORRIES });
  if (!value) return [];

  try {
    return JSON.parse(value);
  } catch (error) {
    console.error('Failed to parse worries from storage:', error);
    return [];
  }
}

export async function saveWorries(worries: Worry[]): Promise<void> {
  try {
    console.log('[Storage] Attempting to save worries, count:', worries.length);
    const serialized = JSON.stringify(worries);
    console.log('[Storage] Serialized data length:', serialized.length);

    await Preferences.set({
      key: STORAGE_KEYS.WORRIES,
      value: serialized,
    });

    console.log('[Storage] Successfully saved worries');
  } catch (error) {
    console.error('[Storage] Failed to save worries:', error);
    throw error;
  }
}

// Preferences
export async function getPreferences(): Promise<UserPreferences> {
  const { value } = await Preferences.get({ key: STORAGE_KEYS.PREFERENCES });
  if (!value) return defaultPreferences;

  try {
    return JSON.parse(value);
  } catch (error) {
    console.error('Failed to parse preferences from storage:', error);
    return defaultPreferences;
  }
}

export async function savePreferences(preferences: UserPreferences): Promise<void> {
  try {
    console.log('[Storage] Attempting to save preferences');
    await Preferences.set({
      key: STORAGE_KEYS.PREFERENCES,
      value: JSON.stringify(preferences),
    });
    console.log('[Storage] Successfully saved preferences');
  } catch (error) {
    console.error('[Storage] Failed to save preferences:', error);
    throw error;
  }
}

// Stats
export async function getStats(): Promise<WorryStats> {
  const { value } = await Preferences.get({ key: STORAGE_KEYS.STATS });
  if (!value) return defaultStats;

  try {
    return JSON.parse(value);
  } catch (error) {
    console.error('Failed to parse stats from storage:', error);
    return defaultStats;
  }
}

export async function saveStats(stats: WorryStats): Promise<void> {
  try {
    console.log('[Storage] Attempting to save stats');
    await Preferences.set({
      key: STORAGE_KEYS.STATS,
      value: JSON.stringify(stats),
    });
    console.log('[Storage] Successfully saved stats');
  } catch (error) {
    console.error('[Storage] Failed to save stats:', error);
    throw error;
  }
}

// Clear all data
export async function clearAllData(): Promise<void> {
  await Preferences.remove({ key: STORAGE_KEYS.WORRIES });
  await Preferences.remove({ key: STORAGE_KEYS.PREFERENCES });
  await Preferences.remove({ key: STORAGE_KEYS.STATS });
}

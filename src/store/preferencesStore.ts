import { create } from 'zustand';
import * as storage from '../services/storage';
import type { UserPreferences } from '../types';

interface PreferencesStore {
  preferences: UserPreferences;
  isLoading: boolean;

  loadPreferences: () => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
}

export const usePreferencesStore = create<PreferencesStore>((set, get) => ({
  preferences: {
    defaultUnlockTime: '09:00',
    hapticFeedback: true,
    encouragingMessages: true,
    theme: 'system',
  },
  isLoading: true,

  loadPreferences: async () => {
    const preferences = await storage.getPreferences();
    set({ preferences, isLoading: false });
  },

  updatePreferences: async (updates) => {
    const preferences = { ...get().preferences, ...updates };
    set({ preferences });
    await storage.savePreferences(preferences);
  },
}));

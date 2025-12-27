import { create } from 'zustand';
import * as storage from '../services/storage';
import type { UserPreferences } from '../types';

interface PreferencesStore {
  preferences: UserPreferences;
  isLoading: boolean;
  isSaving: boolean;

  loadPreferences: () => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
}

export const usePreferencesStore = create<PreferencesStore>((set, get) => ({
  preferences: {
    defaultUnlockTime: '09:00',
    hapticFeedback: true,
    encouragingMessages: true,
    showBestOutcomeField: true,
  },
  isLoading: true,
  isSaving: false,

  loadPreferences: async () => {
    const preferences = await storage.getPreferences();
    set({ preferences, isLoading: false });
  },

  updatePreferences: async (updates) => {
    set({ isSaving: true });
    try {
      const preferences = { ...get().preferences, ...updates };
      set({ preferences });
      await storage.savePreferences(preferences);
    } finally {
      set({ isSaving: false });
    }
  },
}));

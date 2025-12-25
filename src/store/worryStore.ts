import { create } from 'zustand';
import * as notifications from '../services/notifications';
import * as storage from '../services/storage';
import type { Worry } from '../types';
import { logger } from '../utils/logger';
import { generateUUID } from '../utils/uuid';

interface WorryStore {
  worries: Worry[];
  isLoading: boolean;

  // Actions
  loadWorries: () => Promise<void>;
  checkAndUnlockExpired: () => Promise<void>;
  addWorry: (
    worry: Omit<Worry, 'id' | 'createdAt' | 'status' | 'notificationId'>
  ) => Promise<Worry>;
  editWorry: (
    id: string,
    updates: { content?: string; action?: string; unlockAt?: string }
  ) => Promise<void>;
  resolveWorry: (id: string, note?: string) => Promise<void>;
  dismissWorry: (id: string) => Promise<void>;
  releaseWorry: (content: string) => Promise<void>;
  snoozeWorry: (id: string, duration: number) => Promise<void>;
  unlockWorryNow: (id: string) => Promise<void>;
  deleteWorry: (id: string) => Promise<void>;

  // Computed
  lockedWorries: () => Worry[];
  unlockedWorries: () => Worry[];
  resolvedWorries: () => Worry[];
  dismissedWorries: () => Worry[];
  releasedWorries: () => Worry[];
}

export const useWorryStore = create<WorryStore>((set, get) => ({
  worries: [],
  isLoading: true,

  loadWorries: async () => {
    const worries = await storage.getWorries();
    // Check for any that should now be unlocked
    const now = new Date();
    const updated = worries.map((w) => {
      if (w.status === 'locked' && new Date(w.unlockAt) <= now) {
        return { ...w, status: 'unlocked' as const, unlockedAt: now.toISOString() };
      }
      return w;
    });
    set({ worries: updated, isLoading: false });
    await storage.saveWorries(updated);
  },

  checkAndUnlockExpired: async () => {
    const now = new Date();
    const worries = get().worries;
    const updated = worries.map((w) => {
      if (w.status === 'locked' && new Date(w.unlockAt) <= now) {
        logger.log('[Store] Auto-unlocking expired worry:', w.id);
        return { ...w, status: 'unlocked' as const, unlockedAt: now.toISOString() };
      }
      return w;
    });

    // Only update if there are changes
    const hasChanges = updated.some((w, i) => w.status !== worries[i].status);
    if (hasChanges) {
      set({ worries: updated });
      await storage.saveWorries(updated);
    }
  },

  addWorry: async (worryData) => {
    try {
      logger.log('[Store] Creating worry...');
      const worry: Worry = {
        ...worryData,
        id: generateUUID(),
        createdAt: new Date().toISOString(),
        status: 'locked',
        notificationId: 0, // Will be set after scheduling
      };
      logger.log('[Store] Worry created with ID:', worry.id);

      logger.log('[Store] Scheduling notification...');
      worry.notificationId = await notifications.scheduleWorryNotification(worry);
      logger.log('[Store] Notification scheduled with ID:', worry.notificationId);

      const worries = [...get().worries, worry];
      set({ worries });

      logger.log('[Store] Saving to storage...');
      await storage.saveWorries(worries);
      logger.log('[Store] Save complete');

      return worry;
    } catch (error) {
      logger.error('[Store] Failed to add worry:', error);
      throw error;
    }
  },

  editWorry: async (id, updates) => {
    const worry = get().worries.find((w) => w.id === id);
    if (!worry) return;

    // Cancel existing notification if unlockAt is being changed
    if (updates.unlockAt && updates.unlockAt !== worry.unlockAt) {
      await notifications.cancelNotification(worry.notificationId);
    }

    const updatedWorry = {
      ...worry,
      content: updates.content ?? worry.content,
      action: updates.action ?? worry.action,
      unlockAt: updates.unlockAt ?? worry.unlockAt,
    };

    // Reschedule notification if unlockAt changed
    if (updates.unlockAt && updates.unlockAt !== worry.unlockAt) {
      updatedWorry.notificationId = await notifications.scheduleWorryNotification(updatedWorry);
    }

    const worries = get().worries.map((w) => (w.id === id ? updatedWorry : w));
    set({ worries });
    await storage.saveWorries(worries);
  },

  resolveWorry: async (id, note) => {
    const worries = get().worries.map((w) =>
      w.id === id
        ? {
            ...w,
            status: 'resolved' as const,
            resolvedAt: new Date().toISOString(),
            resolutionNote: note || undefined,
          }
        : w
    );
    set({ worries });
    await storage.saveWorries(worries);
  },

  dismissWorry: async (id) => {
    const worry = get().worries.find((w) => w.id === id);
    if (worry) {
      await notifications.cancelNotification(worry.notificationId);
    }
    const worries = get().worries.map((w) =>
      w.id === id ? { ...w, status: 'dismissed' as const } : w
    );
    set({ worries });
    await storage.saveWorries(worries);
  },

  releaseWorry: async (content) => {
    const now = new Date().toISOString();
    const worry: Worry = {
      id: generateUUID(),
      content,
      createdAt: now,
      unlockAt: now,
      status: 'dismissed',
      notificationId: 0,
      releasedAt: now,
    };

    const worries = [...get().worries, worry];
    set({ worries });
    await storage.saveWorries(worries);
  },

  snoozeWorry: async (id, durationMs) => {
    const worry = get().worries.find((w) => w.id === id);
    if (!worry) return;

    await notifications.cancelNotification(worry.notificationId);

    const newUnlockAt = new Date(Date.now() + durationMs).toISOString();
    const updatedWorry = { ...worry, unlockAt: newUnlockAt, status: 'locked' as const };
    updatedWorry.notificationId = await notifications.scheduleWorryNotification(updatedWorry);

    const worries = get().worries.map((w) => (w.id === id ? updatedWorry : w));
    set({ worries });
    await storage.saveWorries(worries);
  },

  unlockWorryNow: async (id) => {
    const worry = get().worries.find((w) => w.id === id);
    if (!worry) return;

    await notifications.cancelNotification(worry.notificationId);

    const worries = get().worries.map((w) =>
      w.id === id ? { ...w, status: 'unlocked' as const, unlockedAt: new Date().toISOString() } : w
    );
    set({ worries });
    await storage.saveWorries(worries);
  },

  deleteWorry: async (id) => {
    const worry = get().worries.find((w) => w.id === id);
    if (worry) {
      await notifications.cancelNotification(worry.notificationId);
    }
    const worries = get().worries.filter((w) => w.id !== id);
    set({ worries });
    await storage.saveWorries(worries);
  },

  lockedWorries: () => get().worries.filter((w) => w.status === 'locked'),
  unlockedWorries: () => get().worries.filter((w) => w.status === 'unlocked'),
  resolvedWorries: () => get().worries.filter((w) => w.status === 'resolved'),
  dismissedWorries: () => get().worries.filter((w) => w.status === 'dismissed' && !w.releasedAt),
  releasedWorries: () => get().worries.filter((w) => w.releasedAt !== undefined),
}));

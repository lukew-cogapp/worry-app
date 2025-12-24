import { create } from 'zustand';
import * as notifications from '../services/notifications';
import * as storage from '../services/storage';
import type { Worry } from '../types';

interface WorryStore {
  worries: Worry[];
  isLoading: boolean;

  // Actions
  loadWorries: () => Promise<void>;
  addWorry: (worry: Omit<Worry, 'id' | 'createdAt' | 'status' | 'notificationId'>) => Promise<Worry>;
  resolveWorry: (id: string) => Promise<void>;
  dismissWorry: (id: string) => Promise<void>;
  snoozeWorry: (id: string, duration: number) => Promise<void>;
  unlockWorryNow: (id: string) => Promise<void>;
  deleteWorry: (id: string) => Promise<void>;

  // Computed
  lockedWorries: () => Worry[];
  unlockedWorries: () => Worry[];
  resolvedWorries: () => Worry[];
  dismissedWorries: () => Worry[];
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

  addWorry: async (worryData) => {
    const worry: Worry = {
      ...worryData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: 'locked',
      notificationId: 0, // Will be set after scheduling
    };

    worry.notificationId = await notifications.scheduleWorryNotification(worry);

    const worries = [...get().worries, worry];
    set({ worries });
    await storage.saveWorries(worries);

    return worry;
  },

  resolveWorry: async (id) => {
    const worries = get().worries.map((w) =>
      w.id === id ? { ...w, status: 'resolved' as const, resolvedAt: new Date().toISOString() } : w
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
  dismissedWorries: () => get().worries.filter((w) => w.status === 'dismissed'),
}));

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useWorryStore } from './worryStore';

// Mock the services
vi.mock('../services/storage', () => ({
  getWorries: vi.fn(() => Promise.resolve([])),
  saveWorries: vi.fn(() => Promise.resolve()),
  getPreferences: vi.fn(() => Promise.resolve({ defaultUnlockTime: '09:00' })),
  savePreferences: vi.fn(() => Promise.resolve()),
}));

vi.mock('../services/notifications', () => ({
  scheduleWorryNotification: vi.fn(() => Promise.resolve(1)),
  cancelNotification: vi.fn(() => Promise.resolve()),
  requestPermissions: vi.fn(() => Promise.resolve()),
  registerNotificationActions: vi.fn(() => Promise.resolve()),
}));

describe('worryStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const store = useWorryStore.getState();
    store.worries = [];
    vi.clearAllMocks();
  });

  describe('addWorry', () => {
    it('should add a worry with locked status', async () => {
      const store = useWorryStore.getState();

      const worryData = {
        content: 'Test worry',
        action: 'Test action',
        unlockAt: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      };

      const worry = await store.addWorry(worryData);

      expect(worry.id).toBeDefined();
      expect(worry.content).toBe('Test worry');
      expect(worry.action).toBe('Test action');
      expect(worry.status).toBe('locked');
      expect(worry.notificationId).toBeGreaterThan(0);
      expect(useWorryStore.getState().worries).toHaveLength(1);
    });

    it('should add a worry without action', async () => {
      const store = useWorryStore.getState();

      const worryData = {
        content: 'Test worry without action',
        unlockAt: new Date(Date.now() + 86400000).toISOString(),
      };

      const worry = await store.addWorry(worryData);

      expect(worry.action).toBeUndefined();
      expect(worry.content).toBe('Test worry without action');
    });

    it('should generate unique IDs for multiple worries', async () => {
      const store = useWorryStore.getState();

      const worry1 = await store.addWorry({
        content: 'First worry',
        unlockAt: new Date().toISOString(),
      });

      const worry2 = await store.addWorry({
        content: 'Second worry',
        unlockAt: new Date().toISOString(),
      });

      expect(worry1.id).not.toBe(worry2.id);
      expect(useWorryStore.getState().worries).toHaveLength(2);
    });
  });

  describe('resolveWorry', () => {
    it('should mark a worry as resolved', async () => {
      const store = useWorryStore.getState();

      // Add a worry first
      const worry = await store.addWorry({
        content: 'Test worry',
        unlockAt: new Date().toISOString(),
      });

      // Resolve it
      await store.resolveWorry(worry.id);

      const updatedWorry = useWorryStore.getState().worries.find((w) => w.id === worry.id);
      expect(updatedWorry?.status).toBe('resolved');
      expect(updatedWorry?.resolvedAt).toBeDefined();
    });

    it('should not affect other worries', async () => {
      const store = useWorryStore.getState();

      const worry1 = await store.addWorry({
        content: 'First worry',
        unlockAt: new Date().toISOString(),
      });

      const worry2 = await store.addWorry({
        content: 'Second worry',
        unlockAt: new Date().toISOString(),
      });

      await store.resolveWorry(worry1.id);

      const updatedWorry2 = useWorryStore.getState().worries.find((w) => w.id === worry2.id);
      expect(updatedWorry2?.status).toBe('locked');
    });
  });

  describe('dismissWorry', () => {
    it('should mark a worry as dismissed', async () => {
      const store = useWorryStore.getState();

      const worry = await store.addWorry({
        content: 'Test worry',
        unlockAt: new Date().toISOString(),
      });

      await store.dismissWorry(worry.id);

      const updatedWorry = useWorryStore.getState().worries.find((w) => w.id === worry.id);
      expect(updatedWorry?.status).toBe('dismissed');
    });
  });

  describe('deleteWorry', () => {
    it('should remove a worry from the list', async () => {
      const store = useWorryStore.getState();

      const worry = await store.addWorry({
        content: 'Test worry',
        unlockAt: new Date().toISOString(),
      });

      expect(useWorryStore.getState().worries).toHaveLength(1);

      await store.deleteWorry(worry.id);

      expect(useWorryStore.getState().worries).toHaveLength(0);
    });

    it('should not affect other worries when deleting', async () => {
      const store = useWorryStore.getState();

      const worry1 = await store.addWorry({
        content: 'First worry',
        unlockAt: new Date().toISOString(),
      });

      const worry2 = await store.addWorry({
        content: 'Second worry',
        unlockAt: new Date().toISOString(),
      });

      await store.deleteWorry(worry1.id);

      const worries = useWorryStore.getState().worries;
      expect(worries).toHaveLength(1);
      expect(worries[0].id).toBe(worry2.id);
    });
  });

  describe('computed selectors', () => {
    beforeEach(async () => {
      const store = useWorryStore.getState();

      // Create worries with different statuses
      await store.addWorry({
        content: 'Locked worry',
        unlockAt: new Date(Date.now() + 86400000).toISOString(),
      });

      const unlockedWorry = await store.addWorry({
        content: 'Unlocked worry',
        unlockAt: new Date(Date.now() - 1000).toISOString(),
      });

      // Manually set one to unlocked status for testing
      store.worries = store.worries.map((w) =>
        w.id === unlockedWorry.id ? { ...w, status: 'unlocked' as const } : w
      );

      await store.resolveWorry(unlockedWorry.id);

      const dismissedWorry = await store.addWorry({
        content: 'Dismissed worry',
        unlockAt: new Date().toISOString(),
      });

      await store.dismissWorry(dismissedWorry.id);
    });

    it('lockedWorries should return only locked worries', () => {
      const store = useWorryStore.getState();
      const locked = store.lockedWorries();

      expect(locked).toHaveLength(1);
      expect(locked.every((w) => w.status === 'locked')).toBe(true);
    });

    it('resolvedWorries should return only resolved worries', () => {
      const store = useWorryStore.getState();
      const resolved = store.resolvedWorries();

      expect(resolved.every((w) => w.status === 'resolved')).toBe(true);
    });

    it('dismissedWorries should return only dismissed worries', () => {
      const store = useWorryStore.getState();
      const dismissed = store.dismissedWorries();

      expect(dismissed).toHaveLength(1);
      expect(dismissed.every((w) => w.status === 'dismissed')).toBe(true);
    });
  });
});

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
        unlockAt: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      };

      const worry = await store.addWorry(worryData);

      expect(worry.id).toBeDefined();
      expect(worry.content).toBe('Test worry');
      expect(worry.status).toBe('locked');
      expect(worry.notificationId).toBeGreaterThan(0);
      expect(useWorryStore.getState().worries).toHaveLength(1);
    });

    it('should auto-categorize based on content keywords', async () => {
      const store = useWorryStore.getState();

      // Work category
      const workWorry = await store.addWorry({
        content: 'My boss is giving me too much work',
        unlockAt: new Date().toISOString(),
      });
      expect(workWorry.category).toBe('work');

      // Health category
      const healthWorry = await store.addWorry({
        content: "I'm worried about my doctor appointment",
        unlockAt: new Date().toISOString(),
      });
      expect(healthWorry.category).toBe('health');

      // Finance category
      const financeWorry = await store.addWorry({
        content: 'I need to pay rent and budget my money',
        unlockAt: new Date().toISOString(),
      });
      expect(financeWorry.category).toBe('finance');

      // Relationships category
      const relationshipWorry = await store.addWorry({
        content: "My partner and I aren't getting along",
        unlockAt: new Date().toISOString(),
      });
      expect(relationshipWorry.category).toBe('relationships');
    });

    it('should default to personal category when no keywords match', async () => {
      const store = useWorryStore.getState();

      const worry = await store.addWorry({
        content: 'I just feel weird today',
        unlockAt: new Date().toISOString(),
      });

      expect(worry.category).toBe('personal');
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

  describe('editWorry', () => {
    it('should update worry content', async () => {
      const store = useWorryStore.getState();

      const worry = await store.addWorry({
        content: 'Original content',
        unlockAt: new Date().toISOString(),
      });

      await store.editWorry(worry.id, { content: 'Updated content' });

      const updatedWorry = useWorryStore.getState().worries.find((w) => w.id === worry.id);
      expect(updatedWorry?.content).toBe('Updated content');
    });

    it('should update worry category', async () => {
      const store = useWorryStore.getState();

      const worry = await store.addWorry({
        content: 'Test worry',
        unlockAt: new Date().toISOString(),
      });

      await store.editWorry(worry.id, { category: 'health' });

      const updatedWorry = useWorryStore.getState().worries.find((w) => w.id === worry.id);
      expect(updatedWorry?.category).toBe('health');
    });

    it('should update unlockAt and reschedule notification', async () => {
      const store = useWorryStore.getState();
      const { scheduleWorryNotification, cancelNotification } = await import(
        '../services/notifications'
      );

      const originalDate = new Date(Date.now() + 86400000).toISOString();
      const newDate = new Date(Date.now() + 172800000).toISOString(); // 2 days

      const worry = await store.addWorry({
        content: 'Test worry',
        unlockAt: originalDate,
      });

      vi.clearAllMocks();

      await store.editWorry(worry.id, { unlockAt: newDate });

      const updatedWorry = useWorryStore.getState().worries.find((w) => w.id === worry.id);
      expect(updatedWorry?.unlockAt).toBe(newDate);
      expect(cancelNotification).toHaveBeenCalledWith(worry.notificationId);
      expect(scheduleWorryNotification).toHaveBeenCalled();
    });

    it('should update multiple fields at once', async () => {
      const store = useWorryStore.getState();

      const worry = await store.addWorry({
        content: 'Original content',
        unlockAt: new Date(Date.now() + 86400000).toISOString(),
      });

      const newDate = new Date(Date.now() + 172800000).toISOString();

      await store.editWorry(worry.id, {
        content: 'New content',
        category: 'health',
        unlockAt: newDate,
      });

      const updatedWorry = useWorryStore.getState().worries.find((w) => w.id === worry.id);
      expect(updatedWorry?.content).toBe('New content');
      expect(updatedWorry?.category).toBe('health');
      expect(updatedWorry?.unlockAt).toBe(newDate);
    });

    it('should not reschedule notification if unlockAt unchanged', async () => {
      const store = useWorryStore.getState();
      const { scheduleWorryNotification, cancelNotification } = await import(
        '../services/notifications'
      );

      const worry = await store.addWorry({
        content: 'Original content',
        unlockAt: new Date().toISOString(),
      });

      vi.clearAllMocks();

      await store.editWorry(worry.id, { content: 'Updated content' });

      expect(cancelNotification).not.toHaveBeenCalled();
      expect(scheduleWorryNotification).not.toHaveBeenCalled();
    });

    it('should not affect other worries when editing', async () => {
      const store = useWorryStore.getState();

      const worry1 = await store.addWorry({
        content: 'First worry',
        unlockAt: new Date().toISOString(),
      });

      const worry2 = await store.addWorry({
        content: 'Second worry',
        unlockAt: new Date().toISOString(),
      });

      await store.editWorry(worry1.id, { content: 'Updated first worry' });

      const updatedWorry2 = useWorryStore.getState().worries.find((w) => w.id === worry2.id);
      expect(updatedWorry2?.content).toBe('Second worry');
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

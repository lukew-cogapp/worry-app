import { LocalNotifications } from '@capacitor/local-notifications';
import type { Worry } from '../types';
import { logger } from '../utils/logger';

export async function requestPermissions(): Promise<boolean> {
  const result = await LocalNotifications.requestPermissions();
  return result.display === 'granted';
}

// Java int max value (2^31 - 1) - Android requires notification IDs to be 32-bit signed integers
const JAVA_INT_MAX = 2147483647;

export async function scheduleWorryNotification(worry: Worry): Promise<number> {
  try {
    // Generate unique ID within Java int range to avoid Android errors
    const notificationId = Math.floor(Math.random() * JAVA_INT_MAX);

    await LocalNotifications.schedule({
      notifications: [
        {
          id: notificationId,
          title: 'Time to open your Worry Box 📦',
          body: worry.content.slice(0, 100),
          schedule: { at: new Date(worry.unlockAt) },
          actionTypeId: 'WORRY_UNLOCKED',
          extra: {
            worryId: worry.id,
            action: worry.action,
          },
        },
      ],
    });

    logger.log('[Notifications] Scheduled notification for worry:', worry.id);
    return notificationId;
  } catch (error) {
    logger.error('[Notifications] Failed to schedule notification:', error);
    throw new Error('Failed to schedule notification. Please try again.');
  }
}

export async function cancelNotification(notificationId: number): Promise<void> {
  try {
    await LocalNotifications.cancel({
      notifications: [{ id: notificationId }],
    });
    logger.log('[Notifications] Cancelled notification:', notificationId);
  } catch (error) {
    logger.error('[Notifications] Failed to cancel notification:', error);
    throw new Error('Failed to cancel notification. Please try again.');
  }
}

// Register action types on app init
export async function registerNotificationActions(): Promise<void> {
  try {
    await LocalNotifications.registerActionTypes({
      types: [
        {
          id: 'WORRY_UNLOCKED',
          actions: [
            { id: 'done', title: 'Close' },
            { id: 'snooze', title: 'Snooze 1 hour' },
          ],
        },
      ],
    });
    logger.log('[Notifications] Registered notification action types');
  } catch (error) {
    logger.error('[Notifications] Failed to register action types:', error);
    throw new Error('Failed to register notification actions.');
  }
}

export async function checkPendingNotifications(): Promise<void> {
  await LocalNotifications.getPending();
}

import { LocalNotifications } from '@capacitor/local-notifications';
import type { Worry } from '../types';

export async function requestPermissions(): Promise<boolean> {
  const result = await LocalNotifications.requestPermissions();
  return result.display === 'granted';
}

// Java int max value (2^31 - 1) - Android requires notification IDs to be 32-bit signed integers
const JAVA_INT_MAX = 2147483647;

export async function scheduleWorryNotification(worry: Worry): Promise<number> {
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

  return notificationId;
}

export async function cancelNotification(notificationId: number): Promise<void> {
  await LocalNotifications.cancel({
    notifications: [{ id: notificationId }],
  });
}

// Register action types on app init
export async function registerNotificationActions(): Promise<void> {
  await LocalNotifications.registerActionTypes({
    types: [
      {
        id: 'WORRY_UNLOCKED',
        actions: [
          { id: 'done', title: 'Done ✓' },
          { id: 'snooze', title: 'Snooze 1hr' },
        ],
      },
    ],
  });
}

export async function checkPendingNotifications(): Promise<void> {
  await LocalNotifications.getPending();
}

import { LocalNotifications } from '@capacitor/local-notifications';
import type { Worry } from '../types';

export async function requestPermissions(): Promise<boolean> {
  const result = await LocalNotifications.requestPermissions();
  return result.display === 'granted';
}

export async function scheduleWorryNotification(worry: Worry): Promise<number> {
  // Generate unique ID to avoid collisions
  const notificationId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

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

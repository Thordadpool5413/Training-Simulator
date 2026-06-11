import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const REMINDER_IDENTIFIER = 'daily_practice_reminder';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermissions(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Practice Reminders',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === 'granted') {
      await _schedule(18, 0);
      return;
    }
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === 'granted') {
      await _schedule(18, 0);
    }
  } catch {
    // silently ignore — notifications are optional
  }
}

export async function rescheduleDailyReminder(
  hour: number,
  minute: number,
  enabled: boolean
): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    if (!enabled) {
      await Notifications.cancelAllScheduledNotificationsAsync();
      return;
    }
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') return;
    await _schedule(hour, minute);
  } catch {}
}

async function _schedule(hour: number, minute: number): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    identifier: REMINDER_IDENTIFIER,
    content: {
      title: 'Time to practice',
      body: 'Keep your hospice communication skills sharp — 5 min today.',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export async function cancelDailyReminder(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    await Notifications.cancelScheduledNotificationAsync(REMINDER_IDENTIFIER);
  } catch {}
}

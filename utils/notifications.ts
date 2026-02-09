import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Timing, UserIdentity } from '../model/types';

const NOTIFICATIONS_KEY = 'notificationsEnabled';

// Expo Go dropped push notification support in SDK 53+
const isExpoGo = Constants.appOwnership === 'expo';

// Lazy-load expo-notifications so the import itself doesn't crash Expo Go
async function getNotificationsModule() {
  if (isExpoGo) return null;
  try {
    return await import('expo-notifications');
  } catch {
    return null;
  }
}

// Set up foreground handler once (dev build / production only)
if (!isExpoGo) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Notifications = require('expo-notifications');
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  } catch {
    // Expo Go — ignore
  }
}

export async function requestPermissions(): Promise<boolean> {
  if (isExpoGo) return false;

  try {
    const Device = await import('expo-device');
    if (!Device.isDevice) return false;

    const Notifications = await getNotificationsModule();
    if (!Notifications) return false;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('habits', {
        name: 'Habit Reminders',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === 'granted') return true;

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
}

export async function getNotificationsEnabled(): Promise<boolean> {
  const value = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
  return value !== 'false'; // enabled by default
}

export async function setNotificationsEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(NOTIFICATIONS_KEY, String(enabled));
  if (!enabled) {
    try {
      const Notifications = await getNotificationsModule();
      await Notifications?.cancelAllScheduledNotificationsAsync();
    } catch {
      // ignore
    }
  }
}

const DEFAULT_TIMING_HOURS: Record<Timing, number> = {
  [Timing.Morning]: 8,
  [Timing.Afternoon]: 13,
  [Timing.Evening]: 18,
  [Timing.Night]: 21,
  [Timing.Anytime]: 10,
};

const NOTIFICATION_TIMINGS_KEY = 'notificationTimings';

export async function getNotificationTimings(): Promise<Record<Timing, number>> {
  const saved = await AsyncStorage.getItem(NOTIFICATION_TIMINGS_KEY);
  if (saved) {
    return { ...DEFAULT_TIMING_HOURS, ...JSON.parse(saved) };
  }
  return { ...DEFAULT_TIMING_HOURS };
}

export async function setNotificationTimings(timings: Record<Timing, number>): Promise<void> {
  await AsyncStorage.setItem(NOTIFICATION_TIMINGS_KEY, JSON.stringify(timings));
}

export async function scheduleHabitNotifications(identities: UserIdentity[]): Promise<void> {
  if (isExpoGo) return;

  const enabled = await getNotificationsEnabled();
  if (!enabled) return;

  try {
    const Notifications = await getNotificationsModule();
    if (!Notifications) return;

    await Notifications.cancelAllScheduledNotificationsAsync();

    // Group incomplete habits by timing (skip already-completed ones)
    const today = new Date().toISOString().slice(0, 10);
    const groups = new Map<Timing, string[]>();
    for (const identity of identities) {
      for (const habit of identity.habits) {
        const completedToday = (habit.logs ?? []).some((l) => l.date === today);
        if (completedToday) continue;

        const timing = habit.timing ?? Timing.Anytime;
        const existing = groups.get(timing) ?? [];
        existing.push(habit.label);
        groups.set(timing, existing);
      }
    }

    const timingHours = await getNotificationTimings();

    for (const [timing, labels] of groups) {
      const hour = timingHours[timing];
      const body =
        labels.length === 1
          ? `Time for: ${labels[0]}`
          : `You have ${labels.length} habits to complete`;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${timing} Habits`,
          body,
          channelId: Platform.OS === 'android' ? 'habits' : undefined,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute: 0,
        },
      });
    }
  } catch {
    // Silently fail — notifications aren't critical
  }
}

import {
  BACKGROUND_FETCH_TASK,
  INACTIVITY_NOTIFICATION_HOURS,
} from '@/src/constants/app.constants';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { Platform } from 'react-native';
import { loadLastActiveAt } from '../utils/localStorageKey';

// ─── Configure foreground notification behavior ───────────────────────────────
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// ─── Permission request ───────────────────────────────────────────────────────
export const requestNotificationPermission =
  async (): Promise<boolean> => {
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === 'granted') return true;

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  };

// ─── Bookmark milestone notification ─────────────────────────────────────────
export const scheduleBookmarkMilestoneNotification =
  async (): Promise<void> => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎯 You\'re on a roll!',
        body: 'You\'ve bookmarked 5 courses. Ready to start learning?',
        data: { type: 'BOOKMARK_MILESTONE' },
      },
      trigger: null,
    });
  };

// ─── Inactivity notification (sent via background task) ──────────────────────
export const scheduleInactivityNotification = async (): Promise<void> => {
  // Cancel any previously scheduled inactivity reminders first
  await cancelInactivityNotification();

  await Notifications.scheduleNotificationAsync({
    identifier: 'inactivity_reminder',
    content: {
      title: '📚 Miss your courses?',
      body: 'You haven\'t visited in a while. Jump back in and keep learning!',
      data: { type: 'INACTIVITY_REMINDER' },
    },
    trigger: {
      type: 'timeInterval',
      seconds: INACTIVITY_NOTIFICATION_HOURS * 60 * 60,
      repeats: false,
    } as Notifications.TimeIntervalTriggerInput,
  });
};

export const cancelInactivityNotification = async (): Promise<void> => {
  await Notifications.cancelScheduledNotificationAsync('inactivity_reminder');
};

// ─── Background task — checks inactivity on device wake ──────────────────────
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    const lastActiveAt = await loadLastActiveAt();
    if (!lastActiveAt) return BackgroundFetch.BackgroundFetchResult.NoData;

    const hoursInactive =
      (Date.now() - lastActiveAt) / (1000 * 60 * 60);

    if (hoursInactive >= INACTIVITY_NOTIFICATION_HOURS) {
      await scheduleInactivityNotification();
    }

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export const registerBackgroundTask = async (): Promise<void> => {
  try {
    const isRegistered =
      await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
    if (isRegistered) return;

    await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 60 * 60, // check every hour
      stopOnTerminate: false,
      startOnBoot: true,
    });
  } catch {
    // Background tasks not supported in Expo Go — silently ignore
  }
};

// ─── Android channel setup ────────────────────────────────────────────────────
export const setupAndroidNotificationChannel = async (): Promise<void> => {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync('default', {
    name: 'Default',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#4F46E5',
  });
};
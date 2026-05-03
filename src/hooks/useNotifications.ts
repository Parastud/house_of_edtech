import {
  cancelInactivityNotification,
  registerBackgroundTask,
  requestNotificationPermission,
  scheduleInactivityNotification,
  setupAndroidNotificationChannel,
} from '@/src/services/notification.service';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { saveLastActiveAt } from '../utils/localStorageKey';

// Mount once in the root authenticated layout.
export const useNotifications = (): void => {
  const router = useRouter();
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    const init = async () => {
      await setupAndroidNotificationChannel();
      const granted = await requestNotificationPermission();
      if (!granted) return;

      await registerBackgroundTask();

      // Record last active time and reset inactivity timer
      await saveLastActiveAt();
      await scheduleInactivityNotification();
    };

    init();

    // Foreground notification received
    notificationListener.current =
      Notifications.addNotificationReceivedListener(() => {
        // Could update a badge counter in Redux here
      });

    // User tapped a notification
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data as {
          type?: string;
          courseId?: string;
        };

        if (data?.type === 'BOOKMARK_MILESTONE') {
          router.push('/(tabs)/bookmarks');
        }
        if (data?.type === 'INACTIVITY_REMINDER') {
          router.push('/(tabs)/courses');
        }
      });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [router]);
};

// Call this every time the app comes to foreground
export const useAppActiveTracker = (): void => {
  useEffect(() => {
    const track = async () => {
      await saveLastActiveAt();
      // Reset the inactivity 24hr window each time user opens app
      await cancelInactivityNotification();
      await scheduleInactivityNotification();
    };
    track();
  }, []);
};
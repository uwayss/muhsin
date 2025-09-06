// src/core/services/notificationService.ts
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import i18n from "../i18n";

const REMINDER_NOTIFICATION_ID = "daily-reminder";

// This must be called once to configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: false,
    shouldShowList: false,
  }),
});

/**
 * Requests notification permissions from the user.
 * @returns {Promise<boolean>} Whether permission was granted.
 */
const requestPermissions = async (): Promise<boolean> => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    // Consider linking to settings here in a real app
    return false;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return true;
};

/**
 * Schedules the daily reminder notification.
 * @param {string} time - The time for the reminder in "HH:mm" format.
 */
export const scheduleDailyReminder = async (time: string) => {
  const hasPermission = await requestPermissions();
  if (!hasPermission) {
    console.log("Notification permission not granted. Cannot schedule.");
    // Silently fail for now, but we could alert the user here.
    return;
  }

  // Cancel any existing reminder to ensure we only have one.
  await cancelAllReminders();

  const [hour, minute] = time.split(":").map(Number);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: i18n.t("notifications.reminderTitle"),
      body: i18n.t("notifications.reminderBody"),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
    identifier: REMINDER_NOTIFICATION_ID,
  });

  console.log(`Daily reminder scheduled for ${time}`);
};

/**
 * Cancels all scheduled notifications for the app.
 */
export const cancelAllReminders = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
  console.log("All scheduled reminders have been canceled.");
};

// --- Developer Functions ---

/**
 * Sends a test notification immediately.
 */
export const sendTestNotification = async () => {
  console.log("Sending test notification now.");
  await Notifications.scheduleNotificationAsync({
    content: {
      title: i18n.t("notifications.testTitle"),
      body: i18n.t("notifications.testBody"),
    },
    trigger: null, // null trigger sends it immediately
  });
};

/**
 * Schedules a test notification to be sent in 5 seconds.
 */
export const scheduleTestNotificationIn5s = async () => {
  console.log("Scheduling a test notification for 5 seconds from now.");
  await Notifications.scheduleNotificationAsync({
    content: {
      title: i18n.t("notifications.scheduledTestTitle"),
      body: i18n.t("notifications.scheduledTestBody"),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 5,
    },
  });
};

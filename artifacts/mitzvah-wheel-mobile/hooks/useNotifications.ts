import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { DEFAULT_MITZVAHS, MITZVAH_EXAMPLES } from "@/data/mitzvahs";

const NOTIF_ENABLED_KEY = "notif-daily-enabled";
const NOTIF_HOUR_KEY = "notif-daily-hour";
const NOTIF_MINUTE_KEY = "notif-daily-minute";

const NOTIF_IDENTIFIER = "mitzvah-daily";

export interface NotificationPrefs {
  enabled: boolean;
  hour: number;
  minute: number;
}

export async function loadNotificationPrefs(): Promise<NotificationPrefs> {
  const [enabled, hour, minute] = await AsyncStorage.multiGet([
    NOTIF_ENABLED_KEY,
    NOTIF_HOUR_KEY,
    NOTIF_MINUTE_KEY,
  ]);
  return {
    enabled: enabled[1] === "true",
    hour: hour[1] !== null ? parseInt(hour[1], 10) : 8,
    minute: minute[1] !== null ? parseInt(minute[1], 10) : 0,
  };
}

export async function saveNotificationPrefs(prefs: NotificationPrefs): Promise<void> {
  await AsyncStorage.multiSet([
    [NOTIF_ENABLED_KEY, prefs.enabled ? "true" : "false"],
    [NOTIF_HOUR_KEY, String(prefs.hour)],
    [NOTIF_MINUTE_KEY, String(prefs.minute)],
  ]);
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === "web") return false;
  const existing = await Notifications.getPermissionsAsync() as unknown as { granted: boolean };
  if (existing.granted) return true;
  const result = await Notifications.requestPermissionsAsync() as unknown as { granted: boolean };
  return result.granted;
}

function pickDailyMitzvah(): string {
  const keys = Object.keys(MITZVAH_EXAMPLES);
  const pool = keys.length > 0 ? keys : DEFAULT_MITZVAHS;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Cancel any existing daily notification and schedule a new repeating DAILY
 * notification with a freshly-chosen random mitzvah.  The OS delivers this at
 * `hour:minute` every day — delivery is not dependent on the app being open.
 *
 * Call this whenever:
 *  - The user enables notifications (first time or after re-enabling)
 *  - The user changes the time
 *  - The app launches (to rotate the content; the daily trigger keeps firing
 *    even if the content is "stale", but refreshing on open keeps it varied)
 */
export async function scheduleDailyNotification(hour: number, minute: number): Promise<void> {
  if (Platform.OS === "web") return;

  await Notifications.cancelScheduledNotificationAsync(NOTIF_IDENTIFIER).catch(() => undefined);

  const mitzvah = pickDailyMitzvah();
  const example = MITZVAH_EXAMPLES[mitzvah] ?? "";
  const excerpt = example.length > 80 ? example.slice(0, 77) + "…" : example;

  await Notifications.scheduleNotificationAsync({
    identifier: NOTIF_IDENTIFIER,
    content: {
      title: mitzvah,
      body: excerpt || "Tap to reflect on today's mitzvah",
      data: { mitzvah },
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export async function cancelDailyNotification(): Promise<void> {
  if (Platform.OS === "web") return;
  await Notifications.cancelScheduledNotificationAsync(NOTIF_IDENTIFIER).catch(() => undefined);
}

export function setupNotificationHandler(): void {
  if (Platform.OS === "web") return;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

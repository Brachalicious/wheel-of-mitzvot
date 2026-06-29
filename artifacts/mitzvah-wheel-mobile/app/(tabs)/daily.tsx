import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useColors } from "@/hooks/useColors";
import {
  cancelDailyNotification,
  loadNotificationPrefs,
  requestNotificationPermission,
  saveNotificationPrefs,
  scheduleDailyNotification,
} from "@/hooks/useNotifications";

const TODAY_KEY = () => {
  const d = new Date();
  return `daily-${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

const PRAYERS = [
  {
    id: "shacharit",
    name: "Shacharit",
    hebrewName: "שַׁחֲרִית",
    time: "Morning",
    icon: "sunny-outline" as const,
    description: "Morning prayer — ideally before 9:30am",
    keyPrayers: ["Modeh Ani", "Shacharit Amidah", "Aleinu"],
  },
  {
    id: "mincha",
    name: "Mincha",
    hebrewName: "מִנְחָה",
    time: "Afternoon",
    icon: "partly-sunny-outline" as const,
    description: "Afternoon prayer — after 12:30pm",
    keyPrayers: ["Mincha Amidah", "Ashrei", "Aleinu"],
  },
  {
    id: "maariv",
    name: "Maariv",
    hebrewName: "מַעֲרִיב",
    time: "Evening",
    icon: "moon-outline" as const,
    description: "Evening prayer — after nightfall",
    keyPrayers: ["Shema", "Maariv Amidah", "Aleinu"],
  },
];

function computeOmer() {
  const passover2025 = new Date(2025, 3, 14);
  const passover2026 = new Date(2026, 3, 2);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let start = passover2025;
  if (today >= passover2026) start = passover2026;
  const diff = Math.floor((today.getTime() - start.getTime()) / 86400000);
  if (diff < 0 || diff >= 49) return null;
  return diff + 1;
}

const WEEKS = ["Chesed", "Gevurah", "Tiferet", "Netzach", "Hod", "Yesod", "Malchut"];
const DAYS = ["Chesed", "Gevurah", "Tiferet", "Netzach", "Hod", "Yesod", "Malchut"];

export default function DailyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [prayerDone, setPrayerDone] = useState<Record<string, boolean>>({});
  const [tasks, setTasks] = useState<Array<{ id: string; text: string; done: boolean }>>([]);
  const [newTask, setNewTask] = useState("");

  const [notifEnabled, setNotifEnabled] = useState(false);
  const [notifHour, setNotifHour] = useState(8);
  const [notifMinute, setNotifMinute] = useState(0);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 60;

  useEffect(() => {
    const key = TODAY_KEY();
    AsyncStorage.multiGet([`${key}-prayers`, `daily-tasks`]).then(([[, prayers], [, tasksRaw]]) => {
      if (prayers) setPrayerDone(JSON.parse(prayers));
      if (tasksRaw) setTasks(JSON.parse(tasksRaw));
    });
  }, []);

  useEffect(() => {
    if (Platform.OS === "web") return;
    loadNotificationPrefs().then((prefs) => {
      setNotifEnabled(prefs.enabled);
      setNotifHour(prefs.hour);
      setNotifMinute(prefs.minute);
    });
  }, []);

  const handleNotifToggle = useCallback(async (value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNotifEnabled(value);
    const prefs = { enabled: value, hour: notifHour, minute: notifMinute };
    await saveNotificationPrefs(prefs);
    if (value) {
      const granted = await requestNotificationPermission();
      if (granted) {
        await scheduleDailyNotification(notifHour, notifMinute);
      } else {
        setNotifEnabled(false);
        await saveNotificationPrefs({ ...prefs, enabled: false });
      }
    } else {
      await cancelDailyNotification();
    }
  }, [notifHour, notifMinute]);

  const adjustHour = useCallback(async (delta: number) => {
    const newHour = (notifHour + delta + 24) % 24;
    setNotifHour(newHour);
    const prefs = { enabled: notifEnabled, hour: newHour, minute: notifMinute };
    await saveNotificationPrefs(prefs);
    if (notifEnabled) {
      await scheduleDailyNotification(newHour, notifMinute);
    }
  }, [notifHour, notifMinute, notifEnabled]);

  const adjustMinute = useCallback(async (delta: number) => {
    const newMinute = (notifMinute + delta + 60) % 60;
    setNotifMinute(newMinute);
    const prefs = { enabled: notifEnabled, hour: notifHour, minute: newMinute };
    await saveNotificationPrefs(prefs);
    if (notifEnabled) {
      await scheduleDailyNotification(notifHour, newMinute);
    }
  }, [notifHour, notifMinute, notifEnabled]);

  const togglePrayer = useCallback(async (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPrayerDone((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      AsyncStorage.setItem(`${TODAY_KEY()}-prayers`, JSON.stringify(next));
      return next;
    });
  }, []);

  const addTask = useCallback(() => {
    if (!newTask.trim()) return;
    const task = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 6),
      text: newTask.trim(),
      done: false,
    };
    setTasks((prev) => {
      const next = [...prev, task];
      AsyncStorage.setItem("daily-tasks", JSON.stringify(next));
      return next;
    });
    setNewTask("");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [newTask]);

  const toggleTask = useCallback((id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTasks((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
      AsyncStorage.setItem("daily-tasks", JSON.stringify(next));
      return next;
    });
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => {
      const next = prev.filter((t) => t.id !== id);
      AsyncStorage.setItem("daily-tasks", JSON.stringify(next));
      return next;
    });
  }, []);

  const omerDay = computeOmer();
  const omerWeek = omerDay ? Math.ceil(omerDay / 7) : null;
  const omerDayOfWeek = omerDay ? ((omerDay - 1) % 7) + 1 : null;

  const today = new Date();
  const dayOfWeek = today.toLocaleDateString("en-US", { weekday: "long" });
  const dateStr = today.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const prayerCount = PRAYERS.filter((p) => prayerDone[p.id]).length;

  const s = styles(colors);

  return (
    <ScrollView
      style={[s.container, { paddingTop: topPad }]}
      contentContainerStyle={{ paddingBottom: bottomPad }}
      showsVerticalScrollIndicator={false}
    >
      <View style={s.header}>
        <Text style={s.headerDay}>{dayOfWeek}</Text>
        <Text style={s.headerDate}>{dateStr}</Text>
        <Text style={s.headerSub}>{prayerCount} of 3 prayers completed today</Text>
      </View>

      <Text style={s.sectionTitle}>Daily Prayers</Text>
      {PRAYERS.map((p) => {
        const done = !!prayerDone[p.id];
        return (
          <TouchableOpacity
            key={p.id}
            style={[s.prayerCard, done && s.prayerCardDone]}
            onPress={() => togglePrayer(p.id)}
            activeOpacity={0.8}
          >
            <View style={[s.prayerIcon, done && s.prayerIconDone]}>
              <Ionicons name={p.icon} size={22} color={done ? "#22c55e" : colors.primary} />
            </View>
            <View style={s.prayerInfo}>
              <View style={s.prayerNameRow}>
                <Text style={[s.prayerName, done && s.prayerNameDone]}>{p.name}</Text>
                <Text style={s.prayerHebrew}>{p.hebrewName}</Text>
              </View>
              <Text style={s.prayerTime}>{p.description}</Text>
              <View style={s.keyPrayers}>
                {p.keyPrayers.map((k) => (
                  <View key={k} style={s.keyPrayerTag}>
                    <Text style={s.keyPrayerText}>{k}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={[s.checkCircle, done && s.checkCircleDone]}>
              <Ionicons
                name={done ? "checkmark" : "ellipse-outline"}
                size={done ? 20 : 24}
                color={done ? "#FFFFFF" : colors.border}
              />
            </View>
          </TouchableOpacity>
        );
      })}

      {omerDay && (
        <>
          <Text style={s.sectionTitle}>Sefirat HaOmer</Text>
          <View style={s.omerCard}>
            <View style={s.omerCount}>
              <Text style={s.omerNumber}>{omerDay}</Text>
              <Text style={s.omerLabel}>days of the Omer</Text>
            </View>
            <View style={s.omerDivider} />
            <View style={s.omerDetails}>
              <Text style={s.omerWeekLabel}>Week {omerWeek} — {WEEKS[(omerWeek ?? 1) - 1]}</Text>
              <Text style={s.omerDayLabel}>Day {omerDayOfWeek} — {DAYS[(omerDayOfWeek ?? 1) - 1]} of {WEEKS[(omerWeek ?? 1) - 1]}</Text>
              <Text style={s.omerRemain}>{49 - omerDay} days until Shavuot</Text>
            </View>
          </View>
          <View style={s.omerBar}>
            {Array.from({ length: 49 }).map((_, i) => (
              <View
                key={i}
                style={[
                  s.omerBarSegment,
                  i < omerDay && s.omerBarSegmentFilled,
                  i % 7 === 6 && { marginRight: 4 },
                ]}
              />
            ))}
          </View>
        </>
      )}

      {Platform.OS !== "web" && (
        <>
          <Text style={s.sectionTitle}>Mitzvah of the Day</Text>
          <View style={s.notifCard}>
            <View style={s.notifRow}>
              <View style={s.notifIconWrap}>
                <Ionicons name="notifications-outline" size={20} color={colors.primary} />
              </View>
              <View style={s.notifInfo}>
                <Text style={s.notifTitle}>Daily Reminder</Text>
                <Text style={s.notifDesc}>Get a mitzvah with a practical example each morning</Text>
              </View>
              <Switch
                value={notifEnabled}
                onValueChange={handleNotifToggle}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
            {notifEnabled && (
              <View style={s.notifTimeRow}>
                <Ionicons name="time-outline" size={16} color={colors.mutedForeground} />
                <Text style={s.notifTimeLabel}>Send at</Text>
                <View style={s.notifTimeControl}>
                  <TouchableOpacity onPress={() => adjustHour(-1)} style={s.notifStepBtn}>
                    <Ionicons name="chevron-down" size={16} color={colors.primary} />
                  </TouchableOpacity>
                  <Text style={s.notifTimeValue}>{String(notifHour).padStart(2, "0")}</Text>
                  <TouchableOpacity onPress={() => adjustHour(1)} style={s.notifStepBtn}>
                    <Ionicons name="chevron-up" size={16} color={colors.primary} />
                  </TouchableOpacity>
                </View>
                <Text style={s.notifTimeSep}>:</Text>
                <View style={s.notifTimeControl}>
                  <TouchableOpacity onPress={() => adjustMinute(-5)} style={s.notifStepBtn}>
                    <Ionicons name="chevron-down" size={16} color={colors.primary} />
                  </TouchableOpacity>
                  <Text style={s.notifTimeValue}>{String(notifMinute).padStart(2, "0")}</Text>
                  <TouchableOpacity onPress={() => adjustMinute(5)} style={s.notifStepBtn}>
                    <Ionicons name="chevron-up" size={16} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </>
      )}

      <Text style={s.sectionTitle}>Daily Checklist</Text>
      <View style={s.taskInputRow}>
        <TextInput
          style={s.taskInput}
          placeholder="Add a daily intention…"
          placeholderTextColor={colors.mutedForeground}
          value={newTask}
          onChangeText={setNewTask}
          onSubmitEditing={addTask}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={[s.addBtn, !newTask.trim() && s.addBtnDisabled]}
          onPress={addTask}
          disabled={!newTask.trim()}
        >
          <Ionicons name="add" size={20} color={!newTask.trim() ? colors.mutedForeground : colors.primaryForeground} />
        </TouchableOpacity>
      </View>
      {tasks.length === 0 ? (
        <View style={s.tasksEmpty}>
          <Ionicons name="checkmark-done-outline" size={28} color={colors.mutedForeground} />
          <Text style={s.tasksEmptyText}>Add intentions for the day</Text>
        </View>
      ) : (
        tasks.map((task) => (
          <View key={task.id} style={s.taskRow}>
            <TouchableOpacity onPress={() => toggleTask(task.id)} style={s.taskCheck}>
              <Ionicons
                name={task.done ? "checkmark-circle" : "ellipse-outline"}
                size={22}
                color={task.done ? "#22c55e" : colors.mutedForeground}
              />
            </TouchableOpacity>
            <Text style={[s.taskText, task.done && s.taskTextDone]} numberOfLines={2}>
              {task.text}
            </Text>
            <TouchableOpacity onPress={() => deleteTask(task.id)} style={s.taskDelete}>
              <Ionicons name="trash-outline" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.secondary,
      padding: 16,
      alignItems: "center",
    },
    headerDay: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.primary,
      fontFamily: "Inter_700Bold",
      letterSpacing: 0.5,
    },
    headerDate: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.secondaryForeground,
      fontFamily: "Inter_700Bold",
      marginTop: 2,
    },
    headerSub: {
      fontSize: 12,
      color: colors.secondaryForeground,
      opacity: 0.7,
      fontFamily: "Inter_400Regular",
      marginTop: 4,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.mutedForeground,
      letterSpacing: 1.5,
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 8,
      fontFamily: "Inter_700Bold",
      textTransform: "uppercase",
    },
    prayerCard: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 12,
      marginBottom: 8,
      padding: 14,
      backgroundColor: colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 12,
    },
    prayerCardDone: {
      borderColor: "#86efac",
      backgroundColor: "#f0fdf4",
    },
    prayerIcon: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    prayerIconDone: {
      backgroundColor: "#dcfce7",
    },
    prayerInfo: {
      flex: 1,
    },
    prayerNameRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 2,
    },
    prayerName: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
    },
    prayerNameDone: {
      color: "#15803d",
    },
    prayerHebrew: {
      fontSize: 14,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
    prayerTime: {
      fontSize: 12,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      marginBottom: 6,
    },
    keyPrayers: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 4,
    },
    keyPrayerTag: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 100,
      backgroundColor: colors.muted,
    },
    keyPrayerText: {
      fontSize: 10,
      color: colors.mutedForeground,
      fontFamily: "Inter_500Medium",
    },
    checkCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
    },
    checkCircleDone: {
      backgroundColor: "#22c55e",
    },
    omerCard: {
      flexDirection: "row",
      marginHorizontal: 12,
      marginBottom: 8,
      padding: 16,
      backgroundColor: colors.secondary,
      borderRadius: 12,
      alignItems: "center",
      gap: 16,
    },
    omerCount: {
      alignItems: "center",
    },
    omerNumber: {
      fontSize: 48,
      fontWeight: "700",
      color: colors.primary,
      fontFamily: "Inter_700Bold",
      lineHeight: 56,
    },
    omerLabel: {
      fontSize: 11,
      color: colors.secondaryForeground,
      opacity: 0.7,
      fontFamily: "Inter_400Regular",
    },
    omerDivider: {
      width: 1,
      height: 60,
      backgroundColor: colors.primary,
      opacity: 0.3,
    },
    omerDetails: {
      flex: 1,
    },
    omerWeekLabel: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.secondaryForeground,
      fontFamily: "Inter_700Bold",
      marginBottom: 2,
    },
    omerDayLabel: {
      fontSize: 13,
      color: colors.primary,
      fontFamily: "Inter_500Medium",
      marginBottom: 4,
    },
    omerRemain: {
      fontSize: 12,
      color: colors.secondaryForeground,
      opacity: 0.6,
      fontFamily: "Inter_400Regular",
    },
    omerBar: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginHorizontal: 12,
      gap: 2,
      marginBottom: 4,
    },
    omerBarSegment: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.muted,
    },
    omerBarSegmentFilled: {
      backgroundColor: colors.primary,
    },
    taskInputRow: {
      flexDirection: "row",
      marginHorizontal: 12,
      gap: 8,
      marginBottom: 8,
    },
    taskInput: {
      flex: 1,
      paddingHorizontal: 14,
      paddingVertical: 10,
      backgroundColor: colors.card,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      fontSize: 14,
      color: colors.foreground,
      fontFamily: "Inter_400Regular",
    },
    addBtn: {
      width: 42,
      height: 42,
      borderRadius: 10,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    addBtnDisabled: {
      backgroundColor: colors.muted,
    },
    tasksEmpty: {
      alignItems: "center",
      paddingVertical: 24,
      gap: 8,
    },
    tasksEmptyText: {
      fontSize: 13,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
    taskRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
      gap: 10,
    },
    taskCheck: {
      padding: 2,
    },
    taskText: {
      flex: 1,
      fontSize: 14,
      color: colors.foreground,
      fontFamily: "Inter_400Regular",
      lineHeight: 19,
    },
    taskTextDone: {
      textDecorationLine: "line-through",
      color: colors.mutedForeground,
    },
    taskDelete: {
      padding: 4,
    },
    notifCard: {
      marginHorizontal: 12,
      marginBottom: 8,
      backgroundColor: colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    notifRow: {
      flexDirection: "row",
      alignItems: "center",
      padding: 14,
      gap: 12,
    },
    notifIconWrap: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    notifInfo: {
      flex: 1,
    },
    notifTitle: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.foreground,
      fontFamily: "Inter_600SemiBold",
    },
    notifDesc: {
      fontSize: 12,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      marginTop: 2,
    },
    notifTimeRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 14,
      paddingBottom: 14,
      gap: 8,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
      paddingTop: 12,
    },
    notifTimeLabel: {
      fontSize: 13,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      marginRight: 4,
    },
    notifTimeControl: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.muted,
      borderRadius: 8,
      paddingHorizontal: 2,
      gap: 2,
    },
    notifStepBtn: {
      padding: 6,
    },
    notifTimeValue: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
      minWidth: 26,
      textAlign: "center",
    },
    notifTimeSep: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
    },
  });

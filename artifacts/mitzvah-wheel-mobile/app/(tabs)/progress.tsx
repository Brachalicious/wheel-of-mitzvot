import * as Haptics from "expo-haptics";
import React, { useMemo, useState } from "react";
import {
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useMitzvahContext } from "@/context/MitzvahContext";
import { MITZVAH_SOURCES } from "@/data/mitzvahs";
import { useColors } from "@/hooks/useColors";

const PARSHA_ORDER = [
  "Bereishit", "Noach", "Lech Lecha", "Vayeira", "Chayei Sara",
  "Toldot", "Vayetzei", "Vayishlach", "Vayeshev", "Miketz", "Vayigash", "Vayechi",
  "Shemot", "Vaera", "Bo", "Beshalach", "Yitro", "Mishpatim",
  "Terumah", "Tetzaveh", "Ki Tisa", "Vayakhel", "Pekudei",
  "Vayikra", "Tzav", "Shemini", "Tazria", "Metzora",
  "Acharei Mot", "Kedoshim", "Emor", "Behar", "Bechukotai",
  "Bamidbar", "Nasso", "Beha'alotcha", "Shelach", "Korach",
  "Chukat", "Balak", "Pinchas", "Matot", "Masei",
  "Devarim", "Vaetchanan", "Eikev", "Re'eh", "Shoftim",
  "Ki Tetzei", "Ki Tavo", "Nitzavim", "Vayelech", "Ha'azinu", "Ve'zot HaBrachah",
];

function isNegative(name: string) {
  return name.startsWith("Do not") || name.startsWith("Don't");
}

function ProgressBar({ pct, color }: { pct: number; color: string }) {
  return (
    <View style={{ height: 6, backgroundColor: "#E4DECD", borderRadius: 3, overflow: "hidden" }}>
      <View style={{ width: `${Math.min(pct, 100)}%`, height: "100%", backgroundColor: color, borderRadius: 3 }} />
    </View>
  );
}

export default function ProgressScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { mitzvahs, completed, clearCompleted } = useMitzvahContext();
  const [showAll, setShowAll] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 60;

  const stats = useMemo(() => {
    const positive = mitzvahs.filter((m) => !isNegative(m));
    const negative = mitzvahs.filter((m) => isNegative(m));
    const positiveDone = positive.filter((m) => completed.has(m)).length;
    const negativeDone = negative.filter((m) => completed.has(m)).length;
    const totalDone = completed.size;
    const pct = mitzvahs.length > 0 ? (totalDone / mitzvahs.length) * 100 : 0;

    const parshaMap: Record<string, { total: number; done: number }> = {};
    for (const [name, src] of Object.entries(MITZVAH_SOURCES)) {
      if (!mitzvahs.includes(name)) continue;
      const p = src.parsha;
      if (!parshaMap[p]) parshaMap[p] = { total: 0, done: 0 };
      parshaMap[p].total++;
      if (completed.has(name)) parshaMap[p].done++;
    }
    const parshaStats = PARSHA_ORDER.filter((p) => parshaMap[p] && parshaMap[p].done > 0)
      .map((p) => ({ parsha: p, ...parshaMap[p] }));

    const completedList = [...completed];

    return { positive, negative, positiveDone, negativeDone, totalDone, pct, parshaStats, completedList };
  }, [mitzvahs, completed]);

  const handleShare = async () => {
    const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    const text = [
      `Wheel of Mitzvot — ${today}`,
      `${stats.totalDone}/${mitzvahs.length} mitzvot (${stats.pct.toFixed(1)}%)`,
      `${stats.positiveDone} positive mitzvot performed`,
      `${stats.negativeDone} negative commandments observed`,
    ].join("\n");
    try {
      await Share.share({ message: text, title: "My Mitzvah Progress" });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // ignore
    }
  };

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const visibleCompleted = showAll ? stats.completedList : stats.completedList.slice(0, 10);

  const s = styles(colors);

  return (
    <ScrollView
      style={[s.container, { paddingTop: topPad }]}
      contentContainerStyle={{ paddingBottom: bottomPad }}
      showsVerticalScrollIndicator={false}
    >
      <View style={s.header}>
        <View>
          <Text style={s.headerDate}>{dateStr}</Text>
          <Text style={s.headerSub}>Your mitzvah journey</Text>
        </View>
        <TouchableOpacity style={s.shareBtn} onPress={handleShare}>
          <Ionicons name="share-outline" size={18} color={colors.foreground} />
        </TouchableOpacity>
      </View>

      <View style={s.summaryCard}>
        <Text style={s.summaryCount}>{stats.totalDone}</Text>
        <Text style={s.summaryLabel}>of {mitzvahs.length} mitzvot completed</Text>
        <View style={s.summaryBar}>
          <ProgressBar pct={stats.pct} color={colors.primary} />
        </View>
        <Text style={s.summaryPct}>{stats.pct.toFixed(1)}% of the 613</Text>
      </View>

      <View style={s.statsRow}>
        <View style={s.statCard}>
          <Ionicons name="trending-up" size={20} color="#3b82f6" />
          <Text style={s.statNum}>{stats.positiveDone}</Text>
          <Text style={s.statOf}>of {stats.positive.length}</Text>
          <Text style={s.statLabel}>Positive Mitzvot</Text>
          <View style={{ marginTop: 6 }}>
            <ProgressBar pct={stats.positive.length > 0 ? (stats.positiveDone / stats.positive.length) * 100 : 0} color="#3b82f6" />
          </View>
        </View>
        <View style={s.statCard}>
          <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
          <Text style={[s.statNum, { color: colors.primary }]}>{stats.negativeDone}</Text>
          <Text style={s.statOf}>of {stats.negative.length}</Text>
          <Text style={s.statLabel}>Negative Avoided</Text>
          <View style={{ marginTop: 6 }}>
            <ProgressBar pct={stats.negative.length > 0 ? (stats.negativeDone / stats.negative.length) * 100 : 0} color={colors.primary} />
          </View>
        </View>
      </View>

      {stats.parshaStats.length > 0 && (
        <>
          <Text style={s.sectionTitle}>By Parsha</Text>
          <View style={s.parshaCard}>
            {stats.parshaStats.map(({ parsha, total, done }) => (
              <View key={parsha} style={s.parshaRow}>
                <View style={s.parshaLabelRow}>
                  <Text style={s.parshaName}>{parsha}</Text>
                  <Text style={s.parshaCount}>{done}/{total}</Text>
                </View>
                <ProgressBar pct={(done / total) * 100} color={done === total ? "#22c55e" : colors.primary} />
              </View>
            ))}
          </View>
        </>
      )}

      {stats.completedList.length > 0 && (
        <>
          <Text style={s.sectionTitle}>Completed Mitzvot ({stats.totalDone})</Text>
          <View style={s.completedCard}>
            {visibleCompleted.map((m) => (
              <View key={m} style={s.completedRow}>
                <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                <Text style={s.completedText} numberOfLines={2}>{m}</Text>
              </View>
            ))}
            {stats.completedList.length > 10 && (
              <TouchableOpacity
                style={s.showMoreBtn}
                onPress={() => setShowAll(!showAll)}
              >
                <Text style={s.showMoreText}>
                  {showAll ? "Show less" : `Show ${stats.completedList.length - 10} more`}
                </Text>
                <Ionicons name={showAll ? "chevron-up" : "chevron-down"} size={14} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={s.clearBtn} onPress={() => {
            clearCompleted();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }}>
            <Ionicons name="trash-outline" size={16} color={colors.destructive} />
            <Text style={s.clearBtnText}>Clear all completions</Text>
          </TouchableOpacity>
        </>
      )}

      {stats.totalDone === 0 && (
        <View style={s.emptyState}>
          <Ionicons name="checkmark-circle-outline" size={48} color={colors.mutedForeground} />
          <Text style={s.emptyTitle}>No mitzvot completed yet</Text>
          <Text style={s.emptyText}>Spin the wheel and mark mitzvot as done to track your journey.</Text>
        </View>
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
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headerDate: {
      fontSize: 17,
      fontWeight: "700",
      color: colors.secondaryForeground,
      fontFamily: "Inter_700Bold",
    },
    headerSub: {
      fontSize: 12,
      color: colors.secondaryForeground,
      opacity: 0.7,
      fontFamily: "Inter_400Regular",
      marginTop: 2,
    },
    shareBtn: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.primary,
    },
    summaryCard: {
      margin: 12,
      padding: 20,
      backgroundColor: colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
    },
    summaryCount: {
      fontSize: 56,
      fontWeight: "700",
      color: colors.primary,
      fontFamily: "Inter_700Bold",
      lineHeight: 64,
    },
    summaryLabel: {
      fontSize: 14,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      marginBottom: 12,
    },
    summaryBar: {
      width: "100%",
      marginBottom: 6,
    },
    summaryPct: {
      fontSize: 12,
      color: colors.mutedForeground,
      fontFamily: "Inter_500Medium",
    },
    statsRow: {
      flexDirection: "row",
      gap: 10,
      paddingHorizontal: 12,
      marginBottom: 4,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 14,
      alignItems: "center",
    },
    statNum: {
      fontSize: 28,
      fontWeight: "700",
      color: "#3b82f6",
      fontFamily: "Inter_700Bold",
      marginTop: 4,
    },
    statOf: {
      fontSize: 11,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
    statLabel: {
      fontSize: 11,
      fontWeight: "600",
      color: colors.foreground,
      fontFamily: "Inter_600SemiBold",
      marginTop: 2,
      textAlign: "center",
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.mutedForeground,
      letterSpacing: 1.5,
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
      fontFamily: "Inter_700Bold",
      textTransform: "uppercase",
    },
    parshaCard: {
      marginHorizontal: 12,
      backgroundColor: colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 14,
      gap: 10,
    },
    parshaRow: {
      gap: 4,
    },
    parshaLabelRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    parshaName: {
      fontSize: 13,
      fontWeight: "500",
      color: colors.foreground,
      fontFamily: "Inter_500Medium",
    },
    parshaCount: {
      fontSize: 12,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
    completedCard: {
      marginHorizontal: 12,
      backgroundColor: colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    completedRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 10,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    completedText: {
      flex: 1,
      fontSize: 13,
      color: colors.foreground,
      fontFamily: "Inter_400Regular",
      lineHeight: 18,
    },
    showMoreBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
      padding: 12,
    },
    showMoreText: {
      fontSize: 13,
      color: colors.primary,
      fontFamily: "Inter_500Medium",
    },
    clearBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      marginHorizontal: 12,
      marginTop: 8,
      padding: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.destructive,
    },
    clearBtnText: {
      fontSize: 13,
      color: colors.destructive,
      fontFamily: "Inter_500Medium",
    },
    emptyState: {
      alignItems: "center",
      paddingTop: 60,
      paddingHorizontal: 40,
      gap: 12,
    },
    emptyTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
    },
    emptyText: {
      fontSize: 14,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      textAlign: "center",
      lineHeight: 20,
    },
  });

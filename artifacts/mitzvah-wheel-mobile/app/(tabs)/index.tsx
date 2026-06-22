import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { Linking } from "react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, G, Line, Path, Text as SvgText } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useMitzvahContext } from "@/context/MitzvahContext";
import {
  DEFAULT_MITZVAHS,
  MITZVAH_EXAMPLES,
  formatVerseRef,
  getMitzvahSource,
  getSefariaUrl,
  isApplicableToday,
} from "@/data/mitzvahs";
import { useColors } from "@/hooks/useColors";

const SEGMENT_COLORS = [
  "#1A227F", "#F7BF26", "#2335A0", "#E8A800",
  "#1E2E8A", "#D4A000", "#1A227F", "#F7BF26",
  "#2335A0", "#E8A800", "#1E2E8A", "#D4A000",
];

const WHEEL_SLOTS = 12;

function pickRandom<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(n, arr.length));
}

function WheelSvg({
  items,
  size,
  winnerIndex,
}: {
  items: string[];
  size: number;
  winnerIndex: number | null;
}) {
  const n = items.length;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;
  const innerR = r * 0.22;

  return (
    <Svg width={size} height={size}>
      {items.map((item, i) => {
        const startAngle = (i / n) * 2 * Math.PI - Math.PI / 2;
        const endAngle = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2;
        const x1 = cx + r * Math.cos(startAngle);
        const y1 = cy + r * Math.sin(startAngle);
        const x2 = cx + r * Math.cos(endAngle);
        const y2 = cy + r * Math.sin(endAngle);
        const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
        const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
        const isWinner = winnerIndex === i;

        const midAngle = (startAngle + endAngle) / 2;
        const labelR = r * 0.65;
        const lx = cx + labelR * Math.cos(midAngle);
        const ly = cy + labelR * Math.sin(midAngle);
        const labelRotation = (midAngle * 180) / Math.PI + 90;

        const shortLabel = item.length > 18 ? item.slice(0, 16) + "…" : item;

        return (
          <G key={i}>
            <Path
              d={d}
              fill={isWinner ? "#22c55e" : SEGMENT_COLORS[i % SEGMENT_COLORS.length]}
              stroke="#FDFAF4"
              strokeWidth={1.5}
            />
            <SvgText
              x={lx}
              y={ly}
              fontSize={size * 0.028}
              fill="#FDFAF4"
              textAnchor="middle"
              alignmentBaseline="middle"
              fontWeight="600"
              rotation={labelRotation}
              origin={`${lx}, ${ly}`}
            >
              {shortLabel}
            </SvgText>
          </G>
        );
      })}
      <Circle cx={cx} cy={cy} r={innerR} fill="#1A227F" stroke="#F7BF26" strokeWidth={3} />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * 2 * Math.PI;
        const sx = cx + (innerR * 0.5) * Math.cos(angle);
        const sy = cy + (innerR * 0.5) * Math.sin(angle);
        const ex = cx + (innerR * 0.9) * Math.cos(angle);
        const ey = cy + (innerR * 0.9) * Math.sin(angle);
        return (
          <Line key={i} x1={sx} y1={sy} x2={ex} y2={ey} stroke="#F7BF26" strokeWidth={1.5} />
        );
      })}
    </Svg>
  );
}

function PointerSvg({ size }: { size: number }) {
  const w = size * 0.07;
  const h = size * 0.12;
  return (
    <Svg width={w} height={h}>
      <Path
        d={`M ${w / 2} 0 L ${w} ${h} L ${w / 2} ${h * 0.75} L 0 ${h} Z`}
        fill="#F7BF26"
        stroke="#1A227F"
        strokeWidth={1.5}
      />
    </Svg>
  );
}

interface VerseData {
  he: string;
  text: string;
  heRef: string;
}

async function fetchSefaria(ref: string): Promise<VerseData | null> {
  try {
    const url = `https://www.sefaria.org/api/texts/${encodeURIComponent(ref)}?lang=bi&commentary=0`;
    const res = await fetch(url);
    const json = await res.json();
    const he = Array.isArray(json.he) ? json.he.join(" ") : (json.he ?? "");
    const text = Array.isArray(json.text) ? json.text.join(" ") : (json.text ?? "");
    return { he, text, heRef: json.heRef ?? ref };
  } catch {
    return null;
  }
}

export default function WheelScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { mitzvahs, completed, toggleCompleted } = useMitzvahContext();

  const [wheelItems, setWheelItems] = useState<string[]>(() => pickRandom(DEFAULT_MITZVAHS, WHEEL_SLOTS));
  const [spinning, setSpinning] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
  const [verse, setVerse] = useState<VerseData | null>(null);
  const [verseLoading, setVerseLoading] = useState(false);
  const [showList, setShowList] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const wheelItemsRef = useRef<string[]>(wheelItems);
  useEffect(() => {
    wheelItemsRef.current = wheelItems;
  }, [wheelItems]);

  const rotation = useSharedValue(0);

  const wheelSize = 300;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const handleWinnerSelected = useCallback((winIdx: number) => {
    const items = wheelItemsRef.current;
    const winner = items[winIdx] ?? items[0];
    if (!winner) return;
    setWinnerIndex(winIdx);
    setSelected(winner);
    setSpinning(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const src = getMitzvahSource(winner);
    if (src) {
      setVerseLoading(true);
      fetchSefaria(`${src.book} ${src.chapter}:${src.verse}`).then((data) => {
        setVerse(data);
        setVerseLoading(false);
      });
    }
  }, []);

  const spin = useCallback(() => {
    if (spinning || mitzvahs.length === 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const items = pickRandom(mitzvahs, WHEEL_SLOTS);
    wheelItemsRef.current = items;
    setWheelItems(items);
    setSelected(null);
    setVerse(null);
    setWinnerIndex(null);

    const extraSpins = 5 + Math.floor(Math.random() * 3);
    const targetSegment = Math.floor(Math.random() * WHEEL_SLOTS);
    const segmentAngle = 360 / WHEEL_SLOTS;
    const targetAngle = 360 * extraSpins + (360 - targetSegment * segmentAngle - segmentAngle / 2);
    const currentRotation = rotation.value % 360;
    const newRotation = rotation.value + targetAngle - currentRotation;

    setSpinning(true);

    const onComplete = runOnJS(handleWinnerSelected);

    rotation.value = withTiming(newRotation, {
      duration: 4500,
      easing: Easing.out(Easing.cubic),
    }, (finished) => {
      'worklet';
      if (finished) {
        const finalRotation = newRotation % 360;
        const normalizedAngle = (360 - (finalRotation % 360)) % 360;
        const winIdx = Math.floor((normalizedAngle + segmentAngle / 2) / segmentAngle) % WHEEL_SLOTS;
        onComplete(winIdx);
      }
    });
  }, [spinning, mitzvahs, rotation, handleWinnerSelected]);

  const selectMitzvah = useCallback((name: string) => {
    if (spinning) return;
    setSelected(name);
    setVerse(null);
    setShowList(false);
    Haptics.selectionAsync();

    const src = getMitzvahSource(name);
    if (src) {
      setVerseLoading(true);
      fetchSefaria(`${src.book} ${src.chapter}:${src.verse}`).then((data) => {
        setVerse(data);
        setVerseLoading(false);
      });
    }
  }, [spinning]);

  const filteredMitzvahs = useMemo(() => {
    if (!searchQuery.trim()) return mitzvahs;
    const q = searchQuery.toLowerCase();
    return mitzvahs.filter((m) => m.toLowerCase().includes(q));
  }, [mitzvahs, searchQuery]);

  const isSelectedDone = selected ? completed.has(selected) : false;
  const src = selected ? getMitzvahSource(selected) : null;
  const applicable = selected ? isApplicableToday(selected) : false;
  const example = selected ? (MITZVAH_EXAMPLES[selected] ?? null) : null;

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 60;

  const s = styles(colors);

  if (showList) {
    return (
      <View style={[s.container, { paddingTop: topPad }]}>
        <View style={s.listHeader}>
          <TouchableOpacity onPress={() => setShowList(false)} style={s.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={s.listTitle}>All Mitzvot ({mitzvahs.length})</Text>
          <View style={{ width: 36 }} />
        </View>
        <View style={s.searchBar}>
          <Ionicons name="search" size={16} color={colors.mutedForeground} style={{ marginRight: 8 }} />
          <TextInput
            style={s.searchInput}
            placeholder="Search mitzvot…"
            placeholderTextColor={colors.mutedForeground}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          ) : null}
        </View>
        <FlatList
          data={filteredMitzvahs}
          keyExtractor={(item) => item}
          scrollEnabled={!!filteredMitzvahs.length}
          contentContainerStyle={{ paddingBottom: bottomPad }}
          renderItem={({ item }) => {
            const done = completed.has(item);
            return (
              <TouchableOpacity
                style={s.mitzvahRow}
                onPress={() => selectMitzvah(item)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={done ? "checkmark-circle" : "ellipse-outline"}
                  size={18}
                  color={done ? "#22c55e" : colors.border}
                  style={{ marginRight: 10 }}
                />
                <Text style={[s.mitzvahRowText, done && s.mitzvahRowDone]} numberOfLines={2}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={s.emptyState}>
              <Ionicons name="search-outline" size={32} color={colors.mutedForeground} />
              <Text style={s.emptyText}>No results for "{searchQuery}"</Text>
            </View>
          }
        />
      </View>
    );
  }

  return (
    <View style={[s.container, { paddingTop: topPad }]}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Wheel of Mitzvot</Text>
        <Text style={s.headerSub}>613 commandments — spin or browse</Text>
      </View>

      <View style={s.wheelWrapper}>
        <View style={s.pointerWrapper}>
          <PointerSvg size={wheelSize} />
        </View>
        <Animated.View style={animatedStyle}>
          <WheelSvg items={wheelItems} size={wheelSize} winnerIndex={spinning ? null : winnerIndex} />
        </Animated.View>
      </View>

      <View style={s.controls}>
        <TouchableOpacity
          style={[s.spinBtn, spinning && s.spinBtnDisabled]}
          onPress={spin}
          disabled={spinning}
          activeOpacity={0.85}
        >
          {spinning ? (
            <ActivityIndicator color={colors.primaryForeground} size="small" />
          ) : (
            <Ionicons name="shuffle" size={20} color={colors.primaryForeground} />
          )}
          <Text style={s.spinBtnText}>{spinning ? "Spinning…" : "SPIN"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.browseBtn}
          onPress={() => setShowList(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="list" size={18} color={colors.foreground} />
        </TouchableOpacity>
      </View>

      {selected ? (
        <ScrollView
          style={s.resultScroll}
          contentContainerStyle={{ paddingBottom: bottomPad }}
          showsVerticalScrollIndicator={false}
        >
          <View style={[s.resultCard, isSelectedDone && s.resultCardDone]}>
            <View style={[s.resultBadge, isSelectedDone && s.resultBadgeDone]}>
              <Ionicons
                name={isSelectedDone ? "checkmark-circle" : "star"}
                size={14}
                color={isSelectedDone ? "#22c55e" : colors.primary}
              />
              <Text style={[s.resultBadgeText, isSelectedDone && s.resultBadgeTextDone]}>
                {isSelectedDone ? "COMPLETED" : "YOUR MITZVAH"}
              </Text>
            </View>

            <Text style={s.resultName}>{selected}</Text>

            {applicable ? (
              example ? (
                <View style={s.exampleBox}>
                  <Text style={s.exampleLabel}>HOW TO DO IT TODAY</Text>
                  <Text style={s.exampleText}>{example}</Text>
                </View>
              ) : null
            ) : (
              <View style={s.studyBox}>
                <Text style={s.studyTitle}>Honor through Torah study</Text>
                <Text style={s.studyText}>
                  This mitzvah is not currently applicable — it requires the Temple or conditions that don't exist today. The Sages teach that studying its laws is itself a fulfillment.
                </Text>
                <Text style={s.studyQuote} numberOfLines={2}>וְתַלְמוּד תּוֹרָה כְּנֶגֶד כֻּלָּם</Text>
                <Text style={s.studyQuoteEn}>"And the study of Torah is equal to them all." — Mishnah Peah 1:1</Text>
              </View>
            )}

            {verseLoading && (
              <View style={s.verseLoading}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={s.verseLoadingText}>Loading from Sefaria…</Text>
              </View>
            )}

            {verse && !verseLoading && (
              <View style={s.verseBox}>
                <View style={s.verseHe}>
                  <Text style={s.verseHeRef}>{verse.heRef}</Text>
                  <Text style={s.verseHeText}>{verse.he}</Text>
                </View>
                <View style={s.verseEn}>
                  <Text style={s.verseEnText}>{verse.text}</Text>
                </View>
              </View>
            )}

            <View style={s.resultFooter}>
              {src && (
                <Text style={s.sourceText}>
                  Parshat {src.parsha} · {formatVerseRef(src)}
                </Text>
              )}

              <TouchableOpacity
                style={s.sefariaLink}
                onPress={() => Linking.openURL(getSefariaUrl(selected))}
              >
                <Ionicons name="open-outline" size={13} color={colors.primary} />
                <Text style={s.sefariaLinkText}>
                  {src ? `Open ${formatVerseRef(src)} on Sefaria` : "Search on Sefaria"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[s.doneBtn, isSelectedDone && s.doneBtnDone]}
                onPress={() => {
                  toggleCompleted(selected);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Ionicons
                  name={isSelectedDone ? "checkmark-circle" : "checkmark-circle-outline"}
                  size={18}
                  color={isSelectedDone ? "#22c55e" : colors.mutedForeground}
                />
                <Text style={[s.doneBtnText, isSelectedDone && s.doneBtnTextDone]}>
                  {isSelectedDone ? "Done!" : "Mark as done"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={[s.emptyResult, { paddingBottom: bottomPad }]}>
          <Text style={s.emptyResultText}>Spin to receive your mitzvah</Text>
        </View>
      )}
    </View>
  );
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: colors.secondary,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.secondaryForeground,
      fontFamily: "Inter_700Bold",
    },
    headerSub: {
      fontSize: 11,
      color: colors.secondaryForeground,
      opacity: 0.7,
      fontFamily: "Inter_400Regular",
    },
    wheelWrapper: {
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 8,
      position: "relative",
    },
    pointerWrapper: {
      position: "absolute",
      top: 0,
      zIndex: 10,
      alignItems: "center",
    },
    controls: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    spinBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: colors.primary,
      paddingHorizontal: 28,
      paddingVertical: 12,
      borderRadius: 100,
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
    },
    spinBtnDisabled: {
      opacity: 0.6,
    },
    spinBtnText: {
      color: colors.primaryForeground,
      fontWeight: "700",
      fontSize: 16,
      fontFamily: "Inter_700Bold",
      letterSpacing: 1,
    },
    browseBtn: {
      backgroundColor: colors.muted,
      padding: 12,
      borderRadius: 100,
      borderWidth: 1,
      borderColor: colors.border,
    },
    resultScroll: {
      flex: 1,
    },
    resultCard: {
      margin: 12,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.primary,
      backgroundColor: colors.card,
      overflow: "hidden",
    },
    resultCardDone: {
      borderColor: "#22c55e",
    },
    resultBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.muted,
    },
    resultBadgeDone: {
      backgroundColor: "#f0fdf4",
      borderBottomColor: "#bbf7d0",
    },
    resultBadgeText: {
      fontSize: 10,
      fontWeight: "700",
      color: colors.primary,
      letterSpacing: 1.5,
      fontFamily: "Inter_700Bold",
    },
    resultBadgeTextDone: {
      color: "#15803d",
    },
    resultName: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.foreground,
      paddingHorizontal: 14,
      paddingTop: 12,
      paddingBottom: 8,
      fontFamily: "Inter_700Bold",
      lineHeight: 22,
    },
    exampleBox: {
      marginHorizontal: 14,
      marginBottom: 10,
      padding: 10,
      backgroundColor: colors.muted,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    exampleLabel: {
      fontSize: 9,
      fontWeight: "700",
      color: colors.primary,
      letterSpacing: 1.2,
      marginBottom: 4,
      fontFamily: "Inter_700Bold",
    },
    exampleText: {
      fontSize: 13,
      color: colors.foreground,
      lineHeight: 18,
      fontFamily: "Inter_400Regular",
    },
    studyBox: {
      marginHorizontal: 14,
      marginBottom: 10,
      padding: 10,
      backgroundColor: "#fffbeb",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#fde68a",
    },
    studyTitle: {
      fontSize: 12,
      fontWeight: "700",
      color: "#92400e",
      marginBottom: 4,
      fontFamily: "Inter_700Bold",
    },
    studyText: {
      fontSize: 12,
      color: "#78350f",
      lineHeight: 17,
      fontFamily: "Inter_400Regular",
      marginBottom: 6,
    },
    studyQuote: {
      fontSize: 13,
      color: "#b45309",
      textAlign: "right",
      fontFamily: "Inter_600SemiBold",
      marginBottom: 2,
    },
    studyQuoteEn: {
      fontSize: 11,
      color: "#92400e",
      fontStyle: "italic",
      fontFamily: "Inter_400Regular",
    },
    verseLoading: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 14,
      paddingBottom: 8,
    },
    verseLoadingText: {
      fontSize: 12,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
    verseBox: {
      marginHorizontal: 14,
      marginBottom: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    verseHe: {
      padding: 10,
      backgroundColor: colors.muted,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    verseHeRef: {
      fontSize: 9,
      fontWeight: "700",
      color: colors.mutedForeground,
      letterSpacing: 1,
      marginBottom: 4,
      fontFamily: "Inter_700Bold",
    },
    verseHeText: {
      fontSize: 14,
      color: colors.foreground,
      textAlign: "right",
      lineHeight: 22,
      fontFamily: "Inter_400Regular",
    },
    verseEn: {
      padding: 10,
      backgroundColor: colors.card,
    },
    verseEnText: {
      fontSize: 13,
      color: colors.foreground,
      lineHeight: 19,
      fontStyle: "italic",
      fontFamily: "Inter_400Regular",
    },
    resultFooter: {
      paddingHorizontal: 14,
      paddingBottom: 12,
      gap: 8,
    },
    sourceText: {
      fontSize: 12,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
    sefariaLink: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    sefariaLinkText: {
      fontSize: 12,
      color: colors.primary,
      textDecorationLine: "underline",
      fontFamily: "Inter_500Medium",
    },
    doneBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      alignSelf: "flex-start",
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.muted,
    },
    doneBtnDone: {
      backgroundColor: "#f0fdf4",
      borderColor: "#bbf7d0",
    },
    doneBtnText: {
      fontSize: 13,
      color: colors.mutedForeground,
      fontFamily: "Inter_500Medium",
    },
    doneBtnTextDone: {
      color: "#15803d",
    },
    emptyResult: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    emptyResultText: {
      fontSize: 14,
      color: colors.mutedForeground,
      fontStyle: "italic",
      fontFamily: "Inter_400Regular",
    },
    listHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.secondary,
    },
    backBtn: {
      padding: 4,
    },
    listTitle: {
      fontSize: 17,
      fontWeight: "700",
      color: colors.secondaryForeground,
      fontFamily: "Inter_700Bold",
    },
    searchBar: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 12,
      marginVertical: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: colors.muted,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
      color: colors.foreground,
      fontFamily: "Inter_400Regular",
      padding: 0,
    },
    mitzvahRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    mitzvahRowText: {
      flex: 1,
      fontSize: 14,
      color: colors.foreground,
      fontFamily: "Inter_400Regular",
      lineHeight: 19,
    },
    mitzvahRowDone: {
      textDecorationLine: "line-through",
      color: colors.mutedForeground,
    },
    emptyState: {
      alignItems: "center",
      paddingTop: 60,
      gap: 12,
    },
    emptyText: {
      fontSize: 14,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
  });

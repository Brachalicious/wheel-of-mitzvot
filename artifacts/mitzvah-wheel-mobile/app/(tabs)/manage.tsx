import * as Haptics from "expo-haptics";
import React, { useCallback, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useMitzvahContext } from "@/context/MitzvahContext";
import { useColors } from "@/hooks/useColors";

function SwipeableRow({
  item,
  index,
  isSelected,
  onLongPress,
  onMoveUp,
  onMoveDown,
  onDelete,
  canMoveUp,
  canMoveDown,
  colors,
  s,
}: {
  item: string;
  index: number;
  isSelected: boolean;
  onLongPress: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  colors: ReturnType<typeof useColors>;
  s: ReturnType<typeof styles>;
}) {
  const swipeRef = useRef<Swipeable>(null);

  const renderRightActions = useCallback(
    () => (
      <TouchableOpacity
        style={s.deleteAction}
        onPress={() => {
          swipeRef.current?.close();
          onDelete();
        }}
        activeOpacity={0.85}
      >
        <Ionicons name="trash" size={20} color="#fff" />
        <Text style={s.deleteActionText}>Delete</Text>
      </TouchableOpacity>
    ),
    [onDelete, s],
  );

  return (
    <Swipeable
      ref={swipeRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
      friction={2}
    >
      <Pressable
        style={[s.row, isSelected && s.rowSelected]}
        onLongPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onLongPress();
        }}
        delayLongPress={400}
        android_ripple={null}
      >
        <Ionicons
          name="reorder-three"
          size={20}
          color={isSelected ? colors.primary : colors.mutedForeground}
          style={s.dragHandle}
        />
        <Text style={[s.rowText, isSelected && s.rowTextSelected]} numberOfLines={2}>
          {item}
        </Text>
        {isSelected ? (
          <View style={s.reorderControls}>
            <TouchableOpacity
              style={[s.reorderBtn, !canMoveUp && s.reorderBtnDisabled]}
              onPress={canMoveUp ? onMoveUp : undefined}
              disabled={!canMoveUp}
              hitSlop={8}
            >
              <Ionicons
                name="chevron-up"
                size={18}
                color={canMoveUp ? colors.primary : colors.mutedForeground}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.reorderBtn, !canMoveDown && s.reorderBtnDisabled]}
              onPress={canMoveDown ? onMoveDown : undefined}
              disabled={!canMoveDown}
              hitSlop={8}
            >
              <Ionicons
                name="chevron-down"
                size={18}
                color={canMoveDown ? colors.primary : colors.mutedForeground}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={s.deselectBtn}
              onPress={onLongPress}
              hitSlop={8}
            >
              <Ionicons name="close" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={s.rowMeta}>
            <Text style={s.rowIndex}>{index + 1}</Text>
          </View>
        )}
      </Pressable>
    </Swipeable>
  );
}

export default function ManageScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { mitzvahs, addMitzvah, removeMitzvah, moveMitzvah, resetToDefaults } =
    useMitzvahContext();

  const [addingText, setAddingText] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 60;

  const s = styles(colors);

  const handleAdd = useCallback(() => {
    const trimmed = addingText.trim();
    if (!trimmed) return;
    addMitzvah(trimmed);
    setAddingText("");
    setShowAdd(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [addingText, addMitzvah]);

  const handleDelete = useCallback(
    (index: number) => {
      const name = mitzvahs[index];
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setSelectedIndex(null);
      removeMitzvah(index);
      if (mitzvahs.length <= 1) return;
      Alert.alert("Removed", `"${name}" removed from your wheel.`);
    },
    [mitzvahs, removeMitzvah],
  );

  const handleReset = useCallback(() => {
    Alert.alert(
      "Reset to Defaults",
      "This will restore all 613 mitzvot and remove any custom entries. Your completion history is kept.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            resetToDefaults();
            setSelectedIndex(null);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          },
        },
      ],
    );
  }, [resetToDefaults]);

  const handleMoveUp = useCallback(
    (index: number) => {
      if (index === 0) return;
      moveMitzvah(index, index - 1);
      setSelectedIndex(index - 1);
      Haptics.selectionAsync();
    },
    [moveMitzvah],
  );

  const handleMoveDown = useCallback(
    (index: number) => {
      if (index >= mitzvahs.length - 1) return;
      moveMitzvah(index, index + 1);
      setSelectedIndex(index + 1);
      Haptics.selectionAsync();
    },
    [moveMitzvah, mitzvahs.length],
  );

  const handleLongPress = useCallback(
    (index: number) => {
      setSelectedIndex((prev) => (prev === index ? null : index));
    },
    [],
  );

  return (
    <KeyboardAvoidingView
      style={[s.container, { paddingTop: topPad }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={topPad}
    >
      <View style={s.header}>
        <View>
          <Text style={s.headerTitle}>Manage Mitzvot</Text>
          <Text style={s.headerSub}>{mitzvahs.length} in your wheel</Text>
        </View>
        <View style={s.headerActions}>
          <TouchableOpacity style={s.resetBtn} onPress={handleReset}>
            <Ionicons name="refresh" size={15} color={colors.destructive} />
            <Text style={s.resetBtnText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.addBtn}
            onPress={() => {
              setShowAdd((v) => !v);
              setSelectedIndex(null);
            }}
          >
            <Ionicons
              name={showAdd ? "close" : "add"}
              size={20}
              color={colors.primaryForeground}
            />
          </TouchableOpacity>
        </View>
      </View>

      {showAdd && (
        <View style={s.addBar}>
          <TextInput
            style={s.addInput}
            placeholder="Enter a custom mitzvah…"
            placeholderTextColor={colors.mutedForeground}
            value={addingText}
            onChangeText={setAddingText}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleAdd}
            maxLength={120}
          />
          <TouchableOpacity
            style={[s.addConfirmBtn, !addingText.trim() && s.addConfirmBtnDisabled]}
            onPress={handleAdd}
            disabled={!addingText.trim()}
          >
            <Text style={s.addConfirmText}>Add</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={s.hint}>
        <Ionicons name="information-circle-outline" size={13} color={colors.mutedForeground} />
        <Text style={s.hintText}>
          Swipe left to delete · Long-press to reorder
        </Text>
      </View>

      <FlatList
        data={mitzvahs}
        keyExtractor={(item, i) => `${item}-${i}`}
        contentContainerStyle={{ paddingBottom: bottomPad }}
        renderItem={({ item, index }) => (
          <SwipeableRow
            key={`${item}-${index}`}
            item={item}
            index={index}
            isSelected={selectedIndex === index}
            onLongPress={() => handleLongPress(index)}
            onMoveUp={() => handleMoveUp(index)}
            onMoveDown={() => handleMoveDown(index)}
            onDelete={() => handleDelete(index)}
            canMoveUp={index > 0}
            canMoveDown={index < mitzvahs.length - 1}
            colors={colors}
            s={s}
          />
        )}
        ItemSeparatorComponent={() => <View style={s.separator} />}
        ListEmptyComponent={
          <View style={s.empty}>
            <Ionicons name="list-outline" size={40} color={colors.mutedForeground} />
            <Text style={s.emptyTitle}>No mitzvot yet</Text>
            <Text style={s.emptyText}>Tap + to add your first custom mitzvah, or reset to load all 613.</Text>
          </View>
        }
      />
    </KeyboardAvoidingView>
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
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.secondaryForeground,
      fontFamily: "Inter_700Bold",
    },
    headerSub: {
      fontSize: 11,
      color: colors.secondaryForeground,
      opacity: 0.7,
      fontFamily: "Inter_400Regular",
      marginTop: 1,
    },
    headerActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    resetBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.destructive,
    },
    resetBtnText: {
      fontSize: 13,
      color: colors.destructive,
      fontFamily: "Inter_500Medium",
    },
    addBtn: {
      backgroundColor: colors.primary,
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
    },
    addBar: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 10,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      gap: 8,
    },
    addInput: {
      flex: 1,
      fontSize: 14,
      color: colors.foreground,
      fontFamily: "Inter_400Regular",
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: colors.background,
    },
    addConfirmBtn: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 9,
      borderRadius: 8,
    },
    addConfirmBtnDisabled: {
      opacity: 0.4,
    },
    addConfirmText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.primaryForeground,
      fontFamily: "Inter_600SemiBold",
    },
    hint: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingHorizontal: 14,
      paddingVertical: 7,
      backgroundColor: colors.muted,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    hintText: {
      fontSize: 11,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      paddingVertical: 12,
      paddingHorizontal: 14,
      minHeight: 54,
    },
    rowSelected: {
      backgroundColor: colors.muted,
    },
    dragHandle: {
      marginRight: 10,
    },
    rowText: {
      flex: 1,
      fontSize: 14,
      color: colors.foreground,
      fontFamily: "Inter_400Regular",
      lineHeight: 20,
    },
    rowTextSelected: {
      color: colors.primary,
      fontFamily: "Inter_500Medium",
    },
    rowMeta: {
      marginLeft: 8,
      minWidth: 28,
      alignItems: "flex-end",
    },
    rowIndex: {
      fontSize: 11,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
    reorderControls: {
      flexDirection: "row",
      alignItems: "center",
      gap: 2,
      marginLeft: 6,
    },
    reorderBtn: {
      padding: 6,
      borderRadius: 6,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    reorderBtnDisabled: {
      opacity: 0.3,
    },
    deselectBtn: {
      padding: 6,
      borderRadius: 6,
      marginLeft: 2,
    },
    separator: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.border,
      marginLeft: 46,
    },
    deleteAction: {
      backgroundColor: "#ef4444",
      justifyContent: "center",
      alignItems: "center",
      width: 80,
      flexDirection: "column",
      gap: 2,
    },
    deleteActionText: {
      fontSize: 11,
      color: "#fff",
      fontWeight: "600",
      fontFamily: "Inter_600SemiBold",
    },
    empty: {
      alignItems: "center",
      paddingTop: 80,
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

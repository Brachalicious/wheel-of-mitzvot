import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

const BASE_URL = "https://www.sefaria.org/api";

const SIDDUR_ROOT = "Siddur Ashkenaz";

interface TocEntry {
  title: string;
  heTitle?: string;
  contents?: TocEntry[];
  refs?: string[];
}

interface TextData {
  he: string[];
  text: string[];
  ref: string;
  heRef?: string;
  next?: string;
  prev?: string;
}

async function fetchToc(): Promise<TocEntry[]> {
  const res = await fetch(`${BASE_URL}/index/${encodeURIComponent(SIDDUR_ROOT)}`);
  const json = await res.json();
  const schema = json.schema ?? json;
  if (schema.nodes) return schema.nodes as TocEntry[];
  if (json.contents) return json.contents as TocEntry[];
  return [];
}

async function fetchText(ref: string): Promise<TextData | null> {
  try {
    const res = await fetch(
      `${BASE_URL}/texts/${encodeURIComponent(ref)}?lang=bi&commentary=0&context=0`,
    );
    const json = await res.json();
    const he = Array.isArray(json.he)
      ? (json.he as string[]).flat(5).filter((s): s is string => typeof s === "string")
      : [];
    const text = Array.isArray(json.text)
      ? (json.text as string[]).flat(5).filter((s): s is string => typeof s === "string")
      : [];
    return { he, text, ref, heRef: json.heRef };
  } catch {
    return null;
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();
}

function buildPath(entry: TocEntry, prefix: string[]): string {
  const parts = [...prefix, entry.title];
  return parts.join(", ");
}

function collectLeaves(entries: TocEntry[], prefix: string[], acc: { label: string; ref: string }[]) {
  for (const e of entries) {
    const path = buildPath(e, prefix);
    if (e.contents && e.contents.length > 0) {
      collectLeaves(e.contents, [...prefix, e.title], acc);
    } else {
      acc.push({ label: path, ref: path });
    }
  }
}

export default function SiddurScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const [toc, setToc] = useState<TocEntry[]>([]);
  const [tocLoading, setTocLoading] = useState(true);
  const [tocError, setTocError] = useState<string | null>(null);
  const [path, setPath] = useState<string[]>([]);
  const [textData, setTextData] = useState<TextData | null>(null);
  const [textLoading, setTextLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ label: string; ref: string }[]>([]);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 60;

  useEffect(() => {
    fetchToc()
      .then((data) => {
        setToc(data);
        setTocLoading(false);
      })
      .catch(() => {
        setTocError("Could not load Siddur. Check your connection.");
        setTocLoading(false);
      });
  }, []);

  const currentNode = useCallback((): TocEntry[] => {
    let nodes = toc;
    for (const key of path) {
      const found = nodes.find((n) => n.title === key);
      if (!found || !found.contents) return [];
      nodes = found.contents;
    }
    return nodes;
  }, [toc, path]);

  const navigateTo = useCallback((entry: TocEntry) => {
    if (entry.contents && entry.contents.length > 0) {
      setPath((prev) => [...prev, entry.title]);
      setTextData(null);
    } else {
      const fullRef = [SIDDUR_ROOT, ...path, entry.title].join(", ");
      setTextLoading(true);
      setTextData(null);
      setPath((prev) => [...prev, entry.title]);
      fetchText(fullRef).then((data) => {
        setTextData(data);
        setTextLoading(false);
      });
    }
  }, [path]);

  const goBack = useCallback(() => {
    setPath((prev) => prev.slice(0, -1));
    setTextData(null);
    setTextLoading(false);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim() || toc.length === 0) {
      setSearchResults([]);
      return;
    }
    const acc: { label: string; ref: string }[] = [];
    collectLeaves(toc, [], acc);
    const q = searchQuery.toLowerCase();
    setSearchResults(acc.filter((e) => e.label.toLowerCase().includes(q)).slice(0, 20));
  }, [searchQuery, toc]);

  const currentChildren = currentNode();
  const isLeaf = path.length > 0 && currentChildren.length === 0;
  const fullRef = [SIDDUR_ROOT, ...path].join(", ");

  const s = styles(colors);

  return (
    <View style={[s.container, { paddingTop: topPad }]}>
      <View style={s.header}>
        {path.length > 0 ? (
          <TouchableOpacity onPress={goBack} style={s.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.secondaryForeground} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 36 }} />
        )}
        <View style={s.headerCenter}>
          <Text style={s.headerTitle} numberOfLines={1}>
            {path.length > 0 ? path[path.length - 1] : "Siddur Ashkenaz"}
          </Text>
          {path.length > 1 && (
            <Text style={s.headerPath} numberOfLines={1}>
              {path.slice(0, -1).join(" › ")}
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={() => Linking.openURL(`https://www.sefaria.org/${encodeURIComponent(fullRef).replace(/%2C%20/g, ",_")}`)}
          style={s.externalBtn}
        >
          <Ionicons name="open-outline" size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {path.length === 0 && (
        <View style={s.searchBar}>
          <Ionicons name="search" size={16} color={colors.mutedForeground} style={{ marginRight: 8 }} />
          <TextInput
            style={s.searchInput}
            placeholder="Search the Siddur…"
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
      )}

      {tocLoading && (
        <View style={s.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={s.loadingText}>Loading Siddur…</Text>
        </View>
      )}

      {tocError && (
        <View style={s.centered}>
          <Ionicons name="cloud-offline-outline" size={40} color={colors.mutedForeground} />
          <Text style={s.errorText}>{tocError}</Text>
        </View>
      )}

      {!tocLoading && !tocError && searchQuery.trim() && searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.ref}
          contentContainerStyle={{ paddingBottom: bottomPad }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={s.entryRow}
              onPress={() => {
                setSearchQuery("");
                const parts = item.label.split(", ");
                setPath(parts);
                setTextLoading(true);
                const fullRef = [SIDDUR_ROOT, ...parts].join(", ");
                fetchText(fullRef).then((data) => {
                  setTextData(data);
                  setTextLoading(false);
                });
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="document-text-outline" size={18} color={colors.primary} />
              <Text style={s.entryLabel} numberOfLines={2}>{item.label}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={s.centered}>
              <Text style={s.emptyText}>No results</Text>
            </View>
          }
        />
      )}

      {!tocLoading && !tocError && !searchQuery && !isLeaf && currentChildren.length > 0 && (
        <FlatList
          data={currentChildren}
          keyExtractor={(item) => item.title}
          contentContainerStyle={{ paddingBottom: bottomPad }}
          renderItem={({ item }) => {
            const hasChildren = item.contents && item.contents.length > 0;
            return (
              <TouchableOpacity
                style={s.entryRow}
                onPress={() => navigateTo(item)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={hasChildren ? "folder-outline" : "document-text-outline"}
                  size={18}
                  color={hasChildren ? colors.primary : colors.mutedForeground}
                />
                <View style={s.entryContent}>
                  <Text style={s.entryLabel}>{item.title}</Text>
                  {item.heTitle ? (
                    <Text style={s.entryHe}>{item.heTitle}</Text>
                  ) : null}
                </View>
                {hasChildren && (
                  <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
                )}
              </TouchableOpacity>
            );
          }}
        />
      )}

      {!tocLoading && !tocError && isLeaf && (
        <ScrollView
          contentContainerStyle={{ paddingBottom: bottomPad }}
          showsVerticalScrollIndicator={false}
        >
          {textLoading && (
            <View style={s.centered}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={s.loadingText}>Loading text…</Text>
            </View>
          )}

          {textData && !textLoading && (
            <View style={s.textContainer}>
              {textData.heRef && (
                <Text style={s.textRef}>{textData.heRef}</Text>
              )}

              {textData.he.length > 0 && (
                <View style={s.heSection}>
                  <Text style={s.heLabel}>עברית — Hebrew</Text>
                  {textData.he.map((line, i) => (
                    <Text key={i} style={s.heLine}>
                      {stripHtml(line)}
                    </Text>
                  ))}
                </View>
              )}

              {textData.text.length > 0 && (
                <View style={s.enSection}>
                  <Text style={s.enLabel}>English Translation</Text>
                  {textData.text.map((line, i) => (
                    <Text key={i} style={s.enLine}>
                      {stripHtml(line)}
                    </Text>
                  ))}
                </View>
              )}

              {(!textData.he.length && !textData.text.length) && (
                <View style={s.centered}>
                  <Ionicons name="document-outline" size={32} color={colors.mutedForeground} />
                  <Text style={s.emptyText}>No text available for this section</Text>
                </View>
              )}
            </View>
          )}

          {!textData && !textLoading && (
            <View style={s.centered}>
              <Ionicons name="cloud-offline-outline" size={32} color={colors.mutedForeground} />
              <Text style={s.emptyText}>Could not load text</Text>
            </View>
          )}
        </ScrollView>
      )}

      {!tocLoading && !tocError && path.length === 0 && !searchQuery && toc.length === 0 && (
        <View style={s.centered}>
          <Ionicons name="book-outline" size={40} color={colors.mutedForeground} />
          <Text style={s.emptyText}>No siddur content found</Text>
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
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.secondary,
      paddingHorizontal: 12,
      paddingVertical: 12,
      gap: 8,
    },
    backBtn: {
      padding: 4,
    },
    headerCenter: {
      flex: 1,
    },
    headerTitle: {
      fontSize: 17,
      fontWeight: "700",
      color: colors.secondaryForeground,
      fontFamily: "Inter_700Bold",
    },
    headerPath: {
      fontSize: 11,
      color: colors.secondaryForeground,
      opacity: 0.6,
      fontFamily: "Inter_400Regular",
      marginTop: 1,
    },
    externalBtn: {
      padding: 4,
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
    centered: {
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 60,
      gap: 12,
    },
    loadingText: {
      fontSize: 14,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
    errorText: {
      fontSize: 14,
      color: colors.destructive,
      fontFamily: "Inter_400Regular",
      textAlign: "center",
      paddingHorizontal: 24,
    },
    emptyText: {
      fontSize: 14,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
    entryRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
      gap: 12,
      backgroundColor: colors.card,
    },
    entryContent: {
      flex: 1,
    },
    entryLabel: {
      fontSize: 15,
      color: colors.foreground,
      fontFamily: "Inter_500Medium",
    },
    entryHe: {
      fontSize: 13,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      marginTop: 2,
    },
    textContainer: {
      padding: 16,
    },
    textRef: {
      fontSize: 11,
      fontWeight: "700",
      color: colors.mutedForeground,
      letterSpacing: 1,
      marginBottom: 12,
      fontFamily: "Inter_700Bold",
      textTransform: "uppercase",
    },
    heSection: {
      backgroundColor: colors.muted,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 14,
      marginBottom: 12,
    },
    heLabel: {
      fontSize: 10,
      fontWeight: "700",
      color: colors.mutedForeground,
      letterSpacing: 1.2,
      marginBottom: 8,
      fontFamily: "Inter_700Bold",
    },
    heLine: {
      fontSize: 16,
      color: colors.foreground,
      textAlign: "right",
      lineHeight: 26,
      fontFamily: "Inter_400Regular",
      marginBottom: 4,
    },
    enSection: {
      backgroundColor: colors.card,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 14,
    },
    enLabel: {
      fontSize: 10,
      fontWeight: "700",
      color: colors.mutedForeground,
      letterSpacing: 1.2,
      marginBottom: 8,
      fontFamily: "Inter_700Bold",
    },
    enLine: {
      fontSize: 14,
      color: colors.foreground,
      lineHeight: 22,
      fontStyle: "italic",
      fontFamily: "Inter_400Regular",
      marginBottom: 4,
    },
  });

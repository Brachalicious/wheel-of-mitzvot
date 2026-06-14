import raw from "./siddur-ashkenaz.json";

type SiddurNode = string[] | { [key: string]: SiddurNode };

const siddur = raw as { text: { [key: string]: SiddurNode } };

/** Walk the nested Siddur JSON by path and return text lines, or [] if not found / empty. */
export function getSiddurText(path: string[]): string[] {
  let node: SiddurNode = siddur.text as unknown as SiddurNode;
  for (const key of path) {
    if (!node || Array.isArray(node)) return [];
    node = (node as { [k: string]: SiddurNode })[key];
  }
  if (!Array.isArray(node)) return [];
  return (node as string[]).filter((s) => typeof s === "string" && s.trim().length > 5);
}

/** Strip HTML tags left from Sefaria markup. */
export function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, "").trim();
}

// ── Pre-extracted sections used in DailyPrayer ────────────────────────────────

export const SIDDUR_SECTIONS = {
  morehAni: {
    label: "Morning Blessings — Birkot HaShachar",
    sefariaRef: "Siddur Ashkenaz, Weekday, Shacharit, Preparatory Prayers, Morning Blessings",
    path: ["Weekday", "Shacharit", "Preparatory Prayers", "Morning Blessings"],
  },
  adonOlam: {
    label: "Adon Olam",
    sefariaRef: "Siddur Ashkenaz, Weekday, Shacharit, Preparatory Prayers, Adon Olam",
    path: ["Weekday", "Shacharit", "Preparatory Prayers", "Adon Olam"],
  },
  sovereigntyOfHeaven: {
    label: "Sovereignty of Heaven — before Shacharit",
    sefariaRef: "Siddur Ashkenaz, Weekday, Shacharit, Preparatory Prayers, Sovereignty of Heaven",
    path: ["Weekday", "Shacharit", "Preparatory Prayers", "Sovereignty of Heaven"],
  },
  ashrei: {
    label: "Ashrei — Psalm 145",
    sefariaRef: "Siddur Ashkenaz, Weekday, Shacharit, Pesukei Dezimra, Ashrei",
    path: ["Weekday", "Shacharit", "Pesukei Dezimra", "Ashrei"],
  },
  ahavahRabbah: {
    label: "Ahavat Olam — second blessing before Shema",
    sefariaRef: "Siddur Ashkenaz, Weekday, Shacharit, Blessings of the Shema, Second Blessing before Shema",
    path: ["Weekday", "Shacharit", "Blessings of the Shema", "Second Blessing before Shema"],
  },
  amidahPatriarchs: {
    label: "Amidah — Avot (opening blessing)",
    sefariaRef: "Siddur Ashkenaz, Weekday, Shacharit, Amidah, Patriarchs",
    path: ["Weekday", "Shacharit", "Amidah", "Patriarchs"],
  },
  amidahPeace: {
    label: "Amidah — Shalom (final blessing)",
    sefariaRef: "Siddur Ashkenaz, Weekday, Shacharit, Amidah, Peace",
    path: ["Weekday", "Shacharit", "Amidah", "Peace"],
  },
  amidahHealing: {
    label: "Amidah — Refaenu (healing blessing)",
    sefariaRef: "Siddur Ashkenaz, Weekday, Shacharit, Amidah, Healing",
    path: ["Weekday", "Shacharit", "Amidah", "Healing"],
  },
  aleinu: {
    label: "Aleinu",
    sefariaRef: "Siddur Ashkenaz, Weekday, Shacharit, Concluding Prayers, Alenu",
    path: ["Weekday", "Shacharit", "Concluding Prayers", "Alenu"],
  },
  yedidNefesh: {
    label: "Yedid Nefesh — Friday night opening",
    sefariaRef: "Siddur Ashkenaz, Shabbat, Kabbalat Shabbat, Yedid Nefesh",
    path: ["Shabbat", "Kabbalat Shabbat", "Yedid Nefesh"],
  },
  lechaDodi: {
    label: "Lecha Dodi — Kabbalat Shabbat",
    sefariaRef: "Siddur Ashkenaz, Shabbat, Kabbalat Shabbat, Lecha Dodi",
    path: ["Shabbat", "Kabbalat Shabbat", "Lecha Dodi"],
  },
  kiddush: {
    label: "Kiddush — Friday night",
    sefariaRef: "Siddur Ashkenaz, Shabbat, Shabbat Evening, Kiddush",
    path: ["Shabbat", "Shabbat Evening", "Kiddush"],
  },
  thirteen: {
    label: "13 Principles of Faith — Rambam",
    sefariaRef: "Siddur Ashkenaz, Weekday, Shacharit, Post Service, Thirteen Principles",
    path: ["Weekday", "Shacharit", "Post Service", "Thirteen Principles"],
  },
} as const;

export type SiddurSectionKey = keyof typeof SIDDUR_SECTIONS;

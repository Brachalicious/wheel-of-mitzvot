import { HDate } from "@hebcal/core";

const HEBREW_MONTH_NAMES: Record<number, string> = {
  1: "Nisan", 2: "Iyar", 3: "Sivan", 4: "Tammuz",
  5: "Av", 6: "Elul", 7: "Tishrei", 8: "Cheshvan",
  9: "Kislev", 10: "Tevet", 11: "Shevat", 12: "Adar",
  13: "Adar II",
};

const HEBREW_DAYS: Record<number, string> = {
  0: "Yom Rishon", 1: "Yom Sheni", 2: "Yom Shelishi",
  3: "Yom Revi'i", 4: "Yom Chamishi", 5: "Erev Shabbat", 6: "Shabbat",
};

export interface HebrewDateInfo {
  hebrewDay: number;
  hebrewMonth: string;
  hebrewYear: number;
  dayOfWeek: string;
  formatted: string; // "7 Nisan 5786"
  gregorianFormatted: string; // "Sunday, April 5, 2026"
  isErevShabbat: boolean;
  isShabbat: boolean;
}

export function getHebrewDate(): HebrewDateInfo {
  const now = new Date();
  const hd = new HDate(now);

  const hebrewDay = hd.getDate();
  const hebrewMonth = HEBREW_MONTH_NAMES[hd.getMonth()] ?? `Month ${hd.getMonth()}`;
  const hebrewYear = hd.getFullYear();
  const dow = now.getDay();
  const dayOfWeek = HEBREW_DAYS[dow];
  const formatted = `${hebrewDay} ${hebrewMonth} ${hebrewYear}`;

  const gregorianFormatted = now.toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return {
    hebrewDay,
    hebrewMonth,
    hebrewYear,
    dayOfWeek,
    formatted,
    gregorianFormatted,
    isErevShabbat: dow === 5,
    isShabbat: dow === 6,
  };
}

export function useHebrewDate(): HebrewDateInfo {
  return getHebrewDate();
}

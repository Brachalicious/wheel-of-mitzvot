// Omer counting hook — computes today's Omer day from the Hebrew date
// Uses month/day arithmetic: Omer starts 16 Nisan (day 1), ends 5 Sivan (day 49)
import { HDate } from "@hebcal/core";

export interface OmerInfo {
  day: number;           // 1–49
  weeks: number;         // full weeks elapsed (0–6)
  remainderDays: number; // extra days beyond full weeks (0–6)
  hebrewFormula: string; // full Omer declaration text (transliterated)
  englishSummary: string;// e.g. "Day 33 — 4 weeks and 5 days"
  isLagBaOmer: boolean;
}

// 49 formulae exactly as recited in Jewish law (Nusach Ashkenaz/Sefard)
const OMER_FORMULAE: string[] = [
  "Hayom yom echad la'omer",
  "Hayom shenei yamim la'omer",
  "Hayom shlosha yamim la'omer",
  "Hayom arba'ah yamim la'omer",
  "Hayom chamishah yamim la'omer",
  "Hayom shisha yamim la'omer",
  "Hayom shiv'ah yamim, she'hem shavua echad la'omer",
  "Hayom shmonah yamim, she'hem shavua echad v'yom echad la'omer",
  "Hayom tish'ah yamim, she'hem shavua echad u'shnei yamim la'omer",
  "Hayom asarah yamim, she'hem shavua echad u'shlosha yamim la'omer",
  "Hayom achad asar yom, she'hem shavua echad v'arba'ah yamim la'omer",
  "Hayom shneim asar yom, she'hem shavua echad v'chamishah yamim la'omer",
  "Hayom shlosha asar yom, she'hem shavua echad v'shisha yamim la'omer",
  "Hayom arba'ah asar yom, she'hem shnei shavuot la'omer",
  "Hayom chamishah asar yom, she'hem shnei shavuot v'yom echad la'omer",
  "Hayom shisha asar yom, she'hem shnei shavuot u'shnei yamim la'omer",
  "Hayom shiv'ah asar yom, she'hem shnei shavuot u'shlosha yamim la'omer",
  "Hayom shmonah asar yom, she'hem shnei shavuot v'arba'ah yamim la'omer",
  "Hayom tish'ah asar yom, she'hem shnei shavuot v'chamishah yamim la'omer",
  "Hayom esrim yom, she'hem shnei shavuot v'shisha yamim la'omer",
  "Hayom echad v'esrim yom, she'hem shlosha shavuot la'omer",
  "Hayom shnayim v'esrim yom, she'hem shlosha shavuot v'yom echad la'omer",
  "Hayom shlosha v'esrim yom, she'hem shlosha shavuot u'shnei yamim la'omer",
  "Hayom arba'ah v'esrim yom, she'hem shlosha shavuot u'shlosha yamim la'omer",
  "Hayom chamishah v'esrim yom, she'hem shlosha shavuot v'arba'ah yamim la'omer",
  "Hayom shisha v'esrim yom, she'hem shlosha shavuot v'chamishah yamim la'omer",
  "Hayom shiv'ah v'esrim yom, she'hem shlosha shavuot v'shisha yamim la'omer",
  "Hayom shmonah v'esrim yom, she'hem arba'ah shavuot la'omer",
  "Hayom tish'ah v'esrim yom, she'hem arba'ah shavuot v'yom echad la'omer",
  "Hayom shloshim yom, she'hem arba'ah shavuot u'shnei yamim la'omer",
  "Hayom echad u'shloshim yom, she'hem arba'ah shavuot u'shlosha yamim la'omer",
  "Hayom shnayim u'shloshim yom, she'hem arba'ah shavuot v'arba'ah yamim la'omer",
  "Hayom shlosha u'shloshim yom, she'hem arba'ah shavuot v'chamishah yamim la'omer",
  "Hayom arba'ah u'shloshim yom, she'hem arba'ah shavuot v'shisha yamim la'omer",
  "Hayom chamishah u'shloshim yom, she'hem chamishah shavuot la'omer",
  "Hayom shisha u'shloshim yom, she'hem chamishah shavuot v'yom echad la'omer",
  "Hayom shiv'ah u'shloshim yom, she'hem chamishah shavuot u'shnei yamim la'omer",
  "Hayom shmonah u'shloshim yom, she'hem chamishah shavuot u'shlosha yamim la'omer",
  "Hayom tish'ah u'shloshim yom, she'hem chamishah shavuot v'arba'ah yamim la'omer",
  "Hayom arba'im yom, she'hem chamishah shavuot v'chamishah yamim la'omer",
  "Hayom echad v'arba'im yom, she'hem chamishah shavuot v'shisha yamim la'omer",
  "Hayom shnayim v'arba'im yom, she'hem shisha shavuot la'omer",
  "Hayom shlosha v'arba'im yom, she'hem shisha shavuot v'yom echad la'omer",
  "Hayom arba'ah v'arba'im yom, she'hem shisha shavuot u'shnei yamim la'omer",
  "Hayom chamishah v'arba'im yom, she'hem shisha shavuot u'shlosha yamim la'omer",
  "Hayom shisha v'arba'im yom, she'hem shisha shavuot v'arba'ah yamim la'omer",
  "Hayom shiv'ah v'arba'im yom, she'hem shisha shavuot v'chamishah yamim la'omer",
  "Hayom shmonah v'arba'im yom, she'hem shisha shavuot v'shisha yamim la'omer",
  "Hayom tish'ah v'arba'im yom, she'hem shiv'ah shavuot la'omer",
];

function formatEnglishSummary(day: number, weeks: number, remainder: number): string {
  if (weeks === 0) return `Day ${day} of the Omer`;
  const wStr = weeks === 1 ? "1 week" : `${weeks} weeks`;
  if (remainder === 0) return `Day ${day} — ${wStr}`;
  const dStr = remainder === 1 ? "1 day" : `${remainder} days`;
  return `Day ${day} — ${wStr} and ${dStr}`;
}

export function getOmerDay(): OmerInfo | null {
  const hd = new HDate(new Date());
  const hMonth = hd.getMonth();  // 1=Nisan, 2=Iyar, 3=Sivan
  const hDay = hd.getDate();

  let day: number | null = null;
  if (hMonth === 1 && hDay >= 16) day = hDay - 15;
  else if (hMonth === 2) day = hDay + 15;
  else if (hMonth === 3 && hDay <= 5) day = hDay + 44;

  if (day === null || day < 1 || day > 49) return null;

  const weeks = Math.floor((day - 1) / 7);
  const remainderDays = ((day - 1) % 7) + 1;
  const adjustedRemainder = day % 7 === 0 ? 0 : day % 7;
  const w = Math.floor(day / 7);
  const r = day % 7;

  return {
    day,
    weeks: w,
    remainderDays: r,
    hebrewFormula: OMER_FORMULAE[day - 1],
    englishSummary: formatEnglishSummary(day, w, r),
    isLagBaOmer: day === 33,
  };
}

export function useOmer(): OmerInfo | null {
  return getOmerDay();
}

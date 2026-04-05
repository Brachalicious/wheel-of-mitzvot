// Sefirat HaOmer — full data for all 49 days
// Includes: Hebrew bracha, Hebrew count formula, transliteration, sefirot, growth practice
import { HDate } from "@hebcal/core";
import { OMER_PRACTICES } from "./use-omer-practices";

// ── Sefirah types ─────────────────────────────────────────────────────────────

export type Sefirah =
  | "Chesed"
  | "Gevurah"
  | "Tiferet"
  | "Netzach"
  | "Hod"
  | "Yesod"
  | "Malchut";

export interface OmerDay {
  day: number;
  weekSefirah: Sefirah;
  daySefirah: Sefirah;
  combinedName: string;           // e.g. "Chesed shebeChesed"
  combinedNameHebrew: string;     // Hebrew letters
  hebrewCount: string;            // Hebrew text of count formula
  transliteration: string;        // the phonetic Omer formula
  englishCount: string;           // English summary
  practices: string[];            // Concrete, selectable daily practice scenarios
  quote: string;                  // Inspirational quote from Jewish tradition
  quoteSource: string;            // Source of the quote
  isLagBaOmer: boolean;
  growth?: string;                // Legacy description (kept for data backwards-compat)
}

export interface OmerInfo extends OmerDay {
  /** CSS color token for the week's sefirah */
  color: string;
  /** Tailwind bg class */
  bgClass: string;
  /** Tailwind text class */
  textClass: string;
  /** Tailwind border class */
  borderClass: string;
  /** How many days remain */
  daysRemaining: number;
}

// ── Sefirah metadata ──────────────────────────────────────────────────────────

const SEFIRAH_META: Record<Sefirah, {
  hebrew: string;
  subtitle: string;
  color: string;
  bg: string;
  text: string;
  border: string;
}> = {
  Chesed:   { hebrew: "חֶסֶד",  subtitle: "Loving-kindness", color: "#3B82F6", bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-300" },
  Gevurah:  { hebrew: "גְּבוּרָה", subtitle: "Strength",        color: "#EF4444", bg: "bg-red-50",    text: "text-red-700",    border: "border-red-300" },
  Tiferet:  { hebrew: "תִּפְאֶרֶת", subtitle: "Beauty",          color: "#F59E0B", bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-300" },
  Netzach:  { hebrew: "נֶצַח",  subtitle: "Eternity",        color: "#10B981", bg: "bg-emerald-50",text: "text-emerald-700",border: "border-emerald-300" },
  Hod:      { hebrew: "הוֹד",   subtitle: "Splendor",        color: "#F97316", bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-300" },
  Yesod:    { hebrew: "יְסוֹד",  subtitle: "Foundation",      color: "#8B5CF6", bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-300" },
  Malchut:  { hebrew: "מַלְכוּת", subtitle: "Sovereignty",     color: "#6366F1", bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-300" },
};

// ── Raw 49-day data ───────────────────────────────────────────────────────────

const DAYS_RAW: Omit<OmerDay, "day" | "isLagBaOmer" | "practices" | "quote" | "quoteSource">[] = [
  // ── WEEK 1: Chesed ──────────────────────────────────────────────────────────
  {
    weekSefirah: "Chesed", daySefirah: "Chesed",
    combinedName: "Chesed shebeChesed", combinedNameHebrew: "חֶסֶד שֶׁבְּחֶסֶד",
    hebrewCount: "הַיּוֹם יוֹם אֶחָד לָעֹמֶר",
    transliteration: "Hayom yom echad la'omer",
    englishCount: "Today is one day of the Omer.",
    growth: "Pure, unconditional love. Give to someone today without any expectation of return — a stranger, a friend, anyone who crosses your path. Notice any hesitation and give anyway. This is the very root of all spiritual growth: love that needs no reason.",
  },
  {
    weekSefirah: "Chesed", daySefirah: "Gevurah",
    combinedName: "Gevurah shebeChesed", combinedNameHebrew: "גְּבוּרָה שֶׁבְּחֶסֶד",
    hebrewCount: "הַיּוֹם שְׁנֵי יָמִים לָעֹמֶר",
    transliteration: "Hayom shenei yamim la'omer",
    englishCount: "Today is two days of the Omer.",
    growth: "The strength within love. True kindness must have boundaries — love without discipline becomes smothering. Practice saying a loving 'no' today. Express care in a way that respects both the other person's autonomy and your own integrity.",
  },
  {
    weekSefirah: "Chesed", daySefirah: "Tiferet",
    combinedName: "Tiferet shebeChesed", combinedNameHebrew: "תִּפְאֶרֶת שֶׁבְּחֶסֶד",
    hebrewCount: "הַיּוֹם שְׁלֹשָׁה יָמִים לָעֹמֶר",
    transliteration: "Hayom shlosha yamim la'omer",
    englishCount: "Today is three days of the Omer.",
    growth: "Beauty within loving-kindness. When love is truthful and balanced, it becomes beautiful. Reflect on whether your acts of kindness come from genuine care or from a need to be needed. Let your giving emerge from wholeness, not want.",
  },
  {
    weekSefirah: "Chesed", daySefirah: "Netzach",
    combinedName: "Netzach shebeChesed", combinedNameHebrew: "נֶצַח שֶׁבְּחֶסֶד",
    hebrewCount: "הַיּוֹם אַרְבָּעָה יָמִים לָעֹמֶר",
    transliteration: "Hayom arba'ah yamim la'omer",
    englishCount: "Today is four days of the Omer.",
    growth: "Perseverance within love. Love that endures difficulty is more powerful than love that blazes and fades. Choose someone who tests your patience today and sustain your genuine care for them through every obstacle.",
  },
  {
    weekSefirah: "Chesed", daySefirah: "Hod",
    combinedName: "Hod shebeChesed", combinedNameHebrew: "הוֹד שֶׁבְּחֶסֶד",
    hebrewCount: "הַיּוֹם חֲמִשָּׁה יָמִים לָעֹמֶר",
    transliteration: "Hayom chamishah yamim la'omer",
    englishCount: "Today is five days of the Omer.",
    growth: "Gratitude within love. Love deepens when we notice and acknowledge what we receive. Thank someone specifically today for an act of kindness they showed you — perhaps one you overlooked at the time. Let gratitude amplify your love.",
  },
  {
    weekSefirah: "Chesed", daySefirah: "Yesod",
    combinedName: "Yesod shebeChesed", combinedNameHebrew: "יְסוֹד שֶׁבְּחֶסֶד",
    hebrewCount: "הַיּוֹם שִׁשָּׁה יָמִים לָעֹמֶר",
    transliteration: "Hayom shisha yamim la'omer",
    englishCount: "Today is six days of the Omer.",
    growth: "Foundation within love. Love that bonds rather than floats — expressed through real, consistent relationship. Reach out to someone with whom you share a deep bond and reinvest in that connection. Love is the channel through which all blessing flows.",
  },
  {
    weekSefirah: "Chesed", daySefirah: "Malchut",
    combinedName: "Malchut shebeChesed", combinedNameHebrew: "מַלְכוּת שֶׁבְּחֶסֶד",
    hebrewCount: "הַיּוֹם שִׁבְעָה יָמִים שֶׁהֵם שָׁבוּעַ אֶחָד לָעֹמֶר",
    transliteration: "Hayom shiv'ah yamim, she'hem shavua echad la'omer",
    englishCount: "Today is seven days, which is one week of the Omer.",
    growth: "Dignity within love. Love that makes the other person feel like royalty — not like a charity case. Give in a way that preserves the other person's honor and self-worth. One week of Chesed complete — how have you grown?",
  },

  // ── WEEK 2: Gevurah ─────────────────────────────────────────────────────────
  {
    weekSefirah: "Gevurah", daySefirah: "Chesed",
    combinedName: "Chesed shebeGevurah", combinedNameHebrew: "חֶסֶד שֶׁבִּגְבוּרָה",
    hebrewCount: "הַיּוֹם שְׁמוֹנָה יָמִים שֶׁהֵם שָׁבוּעַ אֶחָד וְיוֹם אֶחָד לָעֹמֶר",
    transliteration: "Hayom shmonah yamim, she'hem shavua echad v'yom echad la'omer",
    englishCount: "Today is eight days, which is one week and one day of the Omer.",
    growth: "Kindness within strength. True strength is not harsh — its purpose is to protect the ability to love. Where are you being unnecessarily rigid? Your discipline should be in service of a greater kindness, not a wall against it.",
  },
  {
    weekSefirah: "Gevurah", daySefirah: "Gevurah",
    combinedName: "Gevurah shebeGevurah", combinedNameHebrew: "גְּבוּרָה שֶׁבִּגְבוּרָה",
    hebrewCount: "הַיּוֹם תִּשְׁעָה יָמִים שֶׁהֵם שָׁבוּעַ אֶחָד וּשְׁנֵי יָמִים לָעֹמֶר",
    transliteration: "Hayom tish'ah yamim, she'hem shavua echad u'shnei yamim la'omer",
    englishCount: "Today is nine days, which is one week and two days of the Omer.",
    growth: "Pure self-mastery. Identify the one habit or pattern that has most resisted your efforts to change. Today, confront it directly — not with harshness, but with clear-eyed determination. The moment you most want to give in is precisely the moment discipline matters most.",
  },
  {
    weekSefirah: "Gevurah", daySefirah: "Tiferet",
    combinedName: "Tiferet shebeGevurah", combinedNameHebrew: "תִּפְאֶרֶת שֶׁבִּגְבוּרָה",
    hebrewCount: "הַיּוֹם עֲשָׂרָה יָמִים שֶׁהֵם שָׁבוּעַ אֶחָד וּשְׁלֹשָׁה יָמִים לָעֹמֶר",
    transliteration: "Hayom asarah yamim, she'hem shavua echad u'shlosha yamim la'omer",
    englishCount: "Today is ten days, which is one week and three days of the Omer.",
    growth: "Beauty within strength. Strength that is balanced becomes graceful — the master whose power is fully under control. Reflect on how your discipline can be expressed with less harshness and more elegance today. Firm, yet beautiful.",
  },
  {
    weekSefirah: "Gevurah", daySefirah: "Netzach",
    combinedName: "Netzach shebeGevurah", combinedNameHebrew: "נֶצַח שֶׁבִּגְבוּרָה",
    hebrewCount: "הַיּוֹם אַחַד עָשָׂר יוֹם שֶׁהֵם שָׁבוּעַ אֶחָד וְאַרְבָּעָה יָמִים לָעֹמֶר",
    transliteration: "Hayom achad asar yom, she'hem shavua echad v'arba'ah yamim la'omer",
    englishCount: "Today is eleven days, which is one week and four days of the Omer.",
    growth: "Perseverance within strength. Not a burst of willpower — sustained discipline across days, weeks, and years. Track one commitment you made at the start of the Omer. Are you still keeping it? If not, today is the day to recommit.",
  },
  {
    weekSefirah: "Gevurah", daySefirah: "Hod",
    combinedName: "Hod shebeGevurah", combinedNameHebrew: "הוֹד שֶׁבִּגְבוּרָה",
    hebrewCount: "הַיּוֹם שְׁנֵים עָשָׂר יוֹם שֶׁהֵם שָׁבוּעַ אֶחָד וַחֲמִשָּׁה יָמִים לָעֹמֶר",
    transliteration: "Hayom shneim asar yom, she'hem shavua echad v'chamishah yamim la'omer",
    englishCount: "Today is twelve days, which is one week and five days of the Omer.",
    growth: "Gratitude within strength. Acknowledge the power of your constraints. The difficulties that force discipline — poverty, illness, conflict — are the crucible in which character is forged. Give thanks today for a challenge that has made you stronger.",
  },
  {
    weekSefirah: "Gevurah", daySefirah: "Yesod",
    combinedName: "Yesod shebeGevurah", combinedNameHebrew: "יְסוֹד שֶׁבִּגְבוּרָה",
    hebrewCount: "הַיּוֹם שְׁלֹשָׁה עָשָׂר יוֹם שֶׁהֵם שָׁבוּעַ אֶחָד וְשִׁשָּׁה יָמִים לָעֹמֶר",
    transliteration: "Hayom shlosha asar yom, she'hem shavua echad v'shisha yamim la'omer",
    englishCount: "Today is thirteen days, which is one week and six days of the Omer.",
    growth: "Foundation within strength. Personal discipline becomes a foundation others can depend on. When you keep your word and maintain your commitments, you create stability for your entire community. Your self-mastery is not only for you.",
  },
  {
    weekSefirah: "Gevurah", daySefirah: "Malchut",
    combinedName: "Malchut shebeGevurah", combinedNameHebrew: "מַלְכוּת שֶׁבִּגְבוּרָה",
    hebrewCount: "הַיּוֹם אַרְבָּעָה עָשָׂר יוֹם שֶׁהֵם שְׁנֵי שָׁבוּעוֹת לָעֹמֶר",
    transliteration: "Hayom arba'ah asar yom, she'hem shnei shavuot la'omer",
    englishCount: "Today is fourteen days, which is two weeks of the Omer.",
    growth: "Sovereignty within strength. True self-mastery expresses itself quietly — with royal composure, not harshness. A real king disciplines himself first. Two weeks of the Omer: where have you grown in self-control?",
  },

  // ── WEEK 3: Tiferet ─────────────────────────────────────────────────────────
  {
    weekSefirah: "Tiferet", daySefirah: "Chesed",
    combinedName: "Chesed shebeTiferet", combinedNameHebrew: "חֶסֶד שֶׁבְּתִפְאֶרֶת",
    hebrewCount: "הַיּוֹם חֲמִשָּׁה עָשָׂר יוֹם שֶׁהֵם שְׁנֵי שָׁבוּעוֹת וְיוֹם אֶחָד לָעֹמֶר",
    transliteration: "Hayom chamishah asar yom, she'hem shnei shavuot v'yom echad la'omer",
    englishCount: "Today is fifteen days, which is two weeks and one day of the Omer.",
    growth: "Loving-kindness within beauty. Harmony that is also warm. Bring people together through acts of generous love — not to create dependency but to create balance. Let your kindness today be oriented toward building something beautiful and lasting.",
  },
  {
    weekSefirah: "Tiferet", daySefirah: "Gevurah",
    combinedName: "Gevurah shebeTiferet", combinedNameHebrew: "גְּבוּרָה שֶׁבְּתִפְאֶרֶת",
    hebrewCount: "הַיּוֹם שִׁשָּׁה עָשָׂר יוֹם שֶׁהֵם שְׁנֵי שָׁבוּעוֹת וּשְׁנֵי יָמִים לָעֹמֶר",
    transliteration: "Hayom shisha asar yom, she'hem shnei shavuot u'shnei yamim la'omer",
    englishCount: "Today is sixteen days, which is two weeks and two days of the Omer.",
    growth: "Discipline within beauty. Art requires both freedom and constraint — the form that shapes content into something meaningful. Apply discipline to something creative in your life today. The sonnet's fourteen lines do not limit the poet; they focus the poem.",
  },
  {
    weekSefirah: "Tiferet", daySefirah: "Tiferet",
    combinedName: "Tiferet shebeTiferet", combinedNameHebrew: "תִּפְאֶרֶת שֶׁבְּתִפְאֶרֶת",
    hebrewCount: "הַיּוֹם שִׁבְעָה עָשָׂר יוֹם שֶׁהֵם שְׁנֵי שָׁבוּעוֹת וּשְׁלֹשָׁה יָמִים לָעֹמֶר",
    transliteration: "Hayom shiv'ah asar yom, she'hem shnei shavuot u'shlosha yamim la'omer",
    englishCount: "Today is seventeen days, which is two weeks and three days of the Omer.",
    growth: "Harmony within harmony. The deepest truth: when everything is in its right place and contradictions are resolved into wholeness. Seek integrity today — let your inner life and outer actions align completely. Be the same person in public and in private.",
  },
  {
    weekSefirah: "Tiferet", daySefirah: "Netzach",
    combinedName: "Netzach shebeTiferet", combinedNameHebrew: "נֶצַח שֶׁבְּתִפְאֶרֶת",
    hebrewCount: "הַיּוֹם שְׁמוֹנָה עָשָׂר יוֹם שֶׁהֵם שְׁנֵי שָׁבוּעוֹת וְאַרְבָּעָה יָמִים לָעֹמֶר",
    transliteration: "Hayom shmonah asar yom, she'hem shnei shavuot v'arba'ah yamim la'omer",
    englishCount: "Today is eighteen days, which is two weeks and four days of the Omer.",
    growth: "Persistence within beauty. Great works of beauty require sustained effort. Don't abandon a relationship, project, or spiritual practice because it is not yet complete. Return to something you started and haven't finished — beauty takes time.",
  },
  {
    weekSefirah: "Tiferet", daySefirah: "Hod",
    combinedName: "Hod shebeTiferet", combinedNameHebrew: "הוֹד שֶׁבְּתִפְאֶרֶת",
    hebrewCount: "הַיּוֹם תִּשְׁעָה עָשָׂר יוֹם שֶׁהֵם שְׁנֵי שָׁבוּעוֹת וַחֲמִשָּׁה יָמִים לָעֹמֶר",
    transliteration: "Hayom tish'ah asar yom, she'hem shnei shavuot v'chamishah yamim la'omer",
    englishCount: "Today is nineteen days, which is two weeks and five days of the Omer.",
    growth: "Gratitude within beauty. Beauty is often invisible until we pause and notice it. Today, find three moments of unexpected beauty — in nature, in a face, in an act of kindness — and give thanks for them. Gratitude is the eye that sees.",
  },
  {
    weekSefirah: "Tiferet", daySefirah: "Yesod",
    combinedName: "Yesod shebeTiferet", combinedNameHebrew: "יְסוֹד שֶׁבְּתִפְאֶרֶת",
    hebrewCount: "הַיּוֹם עֶשְׂרִים יוֹם שֶׁהֵם שְׁנֵי שָׁבוּעוֹת וְשִׁשָּׁה יָמִים לָעֹמֶר",
    transliteration: "Hayom esrim yom, she'hem shnei shavuot v'shisha yamim la'omer",
    englishCount: "Today is twenty days, which is two weeks and six days of the Omer.",
    growth: "Connection within beauty. Harmony flourishes in genuine relationship. Let your authentic self be a gift to someone today — not a performance, not a mask, but a real offering of who you are. Beautiful relationships are built on truth, not image.",
  },
  {
    weekSefirah: "Tiferet", daySefirah: "Malchut",
    combinedName: "Malchut shebeTiferet", combinedNameHebrew: "מַלְכוּת שֶׁבְּתִפְאֶרֶת",
    hebrewCount: "הַיּוֹם אֶחָד וְעֶשְׂרִים יוֹם שֶׁהֵם שְׁלֹשָׁה שָׁבוּעוֹת לָעֹמֶר",
    transliteration: "Hayom echad v'esrim yom, she'hem shlosha shavuot la'omer",
    englishCount: "Today is twenty-one days, which is three weeks of the Omer.",
    growth: "Dignity within beauty. Truth expressed with grace — beauty that also commands respect. Let your speech today be beautiful: honest, balanced, well-chosen. Three weeks complete — the halfway point of refining Tiferet. Are you more whole?",
  },

  // ── WEEK 4: Netzach ─────────────────────────────────────────────────────────
  {
    weekSefirah: "Netzach", daySefirah: "Chesed",
    combinedName: "Chesed shebeNetzach", combinedNameHebrew: "חֶסֶד שֶׁבְּנֶצַח",
    hebrewCount: "הַיּוֹם שְׁנַיִם וְעֶשְׂרִים יוֹם שֶׁהֵם שְׁלֹשָׁה שָׁבוּעוֹת וְיוֹם אֶחָד לָעֹמֶר",
    transliteration: "Hayom shnayim v'esrim yom, she'hem shlosha shavuot v'yom echad la'omer",
    englishCount: "Today is twenty-two days, which is three weeks and one day of the Omer.",
    growth: "Love within perseverance. Long-term commitment is one of the highest expressions of love. Recommit today to something or someone you pledged yourself to. Love that endures is worth more than love that blazes and fades.",
  },
  {
    weekSefirah: "Netzach", daySefirah: "Gevurah",
    combinedName: "Gevurah shebeNetzach", combinedNameHebrew: "גְּבוּרָה שֶׁבְּנֶצַח",
    hebrewCount: "הַיּוֹם שְׁלֹשָׁה וְעֶשְׂרִים יוֹם שֶׁהֵם שְׁלֹשָׁה שָׁבוּעוֹת וּשְׁנֵי יָמִים לָעֹמֶר",
    transliteration: "Hayom shlosha v'esrim yom, she'hem shlosha shavuot u'shnei yamim la'omer",
    englishCount: "Today is twenty-three days, which is three weeks and two days of the Omer.",
    growth: "Discipline within perseverance. Willpower is what makes long-term commitment possible. Push through the resistance today — the moment you most want to quit is precisely when discipline is most needed. The wall you are hitting is the wall you must break through.",
  },
  {
    weekSefirah: "Netzach", daySefirah: "Tiferet",
    combinedName: "Tiferet shebeNetzach", combinedNameHebrew: "תִּפְאֶרֶת שֶׁבְּנֶצַח",
    hebrewCount: "הַיּוֹם אַרְבָּעָה וְעֶשְׂרִים יוֹם שֶׁהֵם שְׁלֹשָׁה שָׁבוּעוֹת וּשְׁלֹשָׁה יָמִים לָעֹמֶר",
    transliteration: "Hayom arba'ah v'esrim yom, she'hem shlosha shavuot u'shlosha yamim la'omer",
    englishCount: "Today is twenty-four days, which is three weeks and three days of the Omer.",
    growth: "Beauty within perseverance. Long-term effort reveals beauty that was invisible at the start. Reflect on your journey so far — not just in the Omer, but in your life. What beauty has sustained effort made possible? Let that recognition renew your commitment.",
  },
  {
    weekSefirah: "Netzach", daySefirah: "Netzach",
    combinedName: "Netzach shebeNetzach", combinedNameHebrew: "נֶצַח שֶׁבְּנֶצַח",
    hebrewCount: "הַיּוֹם חֲמִשָּׁה וְעֶשְׂרִים יוֹם שֶׁהֵם שְׁלֹשָׁה שָׁבוּעוֹת וְאַרְבָּעָה יָמִים לָעֹמֶר",
    transliteration: "Hayom chamishah v'esrim yom, she'hem shlosha shavuot v'arba'ah yamim la'omer",
    englishCount: "Today is twenty-five days, which is three weeks and four days of the Omer.",
    growth: "Pure eternal resilience. The energy of Am Yisrael — surviving, rebuilding, flourishing against every historical force that sought to extinguish us. Today embody this: whatever difficulty you face, refuse to be defeated by it. We are eternal.",
  },
  {
    weekSefirah: "Netzach", daySefirah: "Hod",
    combinedName: "Hod shebeNetzach", combinedNameHebrew: "הוֹד שֶׁבְּנֶצַח",
    hebrewCount: "הַיּוֹם שִׁשָּׁה וְעֶשְׂרִים יוֹם שֶׁהֵם שְׁלֹשָׁה שָׁבוּעוֹת וַחֲמִשָּׁה יָמִים לָעֹמֶר",
    transliteration: "Hayom shisha v'esrim yom, she'hem shlosha shavuot v'chamishah yamim la'omer",
    englishCount: "Today is twenty-six days, which is three weeks and five days of the Omer.",
    growth: "Gratitude within perseverance. Acknowledge every small victory along the way. Thank God and the people who helped you persist. Gratitude renews the will to continue when the journey is long. Notice what has gone right.",
  },
  {
    weekSefirah: "Netzach", daySefirah: "Yesod",
    combinedName: "Yesod shebeNetzach", combinedNameHebrew: "יְסוֹד שֶׁבְּנֶצַח",
    hebrewCount: "הַיּוֹם שִׁבְעָה וְעֶשְׂרִים יוֹם שֶׁהֵם שְׁלֹשָׁה שָׁבוּעוֹת וְשִׁשָּׁה יָמִים לָעֹמֶר",
    transliteration: "Hayom shiv'ah v'esrim yom, she'hem shlosha shavuot v'shisha yamim la'omer",
    englishCount: "Today is twenty-seven days, which is three weeks and six days of the Omer.",
    growth: "Connection within perseverance. Long-term relationships require sustained investment through every season. The channel of love must be regularly cleared and maintained. Invest deliberately today in a relationship that has been neglected.",
  },
  {
    weekSefirah: "Netzach", daySefirah: "Malchut",
    combinedName: "Malchut shebeNetzach", combinedNameHebrew: "מַלְכוּת שֶׁבְּנֶצַח",
    hebrewCount: "הַיּוֹם שְׁמוֹנָה וְעֶשְׂרִים יוֹם שֶׁהֵם אַרְבָּעָה שָׁבוּעוֹת לָעֹמֶר",
    transliteration: "Hayom shmonah v'esrim yom, she'hem arba'ah shavuot la'omer",
    englishCount: "Today is twenty-eight days, which is four weeks of the Omer.",
    growth: "Dignity within perseverance. To persist with grace — not grimly, but with a sense of royal purpose. You are part of an eternal story stretching from Sinai to the present moment. Carry yourself accordingly. Four weeks of growth — you are more than halfway.",
  },

  // ── WEEK 5: Hod ─────────────────────────────────────────────────────────────
  {
    weekSefirah: "Hod", daySefirah: "Chesed",
    combinedName: "Chesed shebeHod", combinedNameHebrew: "חֶסֶד שֶׁבְּהוֹד",
    hebrewCount: "הַיּוֹם תִּשְׁעָה וְעֶשְׂרִים יוֹם שֶׁהֵם אַרְבָּעָה שָׁבוּעוֹת וְיוֹם אֶחָד לָעֹמֶר",
    transliteration: "Hayom tish'ah v'esrim yom, she'hem arba'ah shavuot v'yom echad la'omer",
    englishCount: "Today is twenty-nine days, which is four weeks and one day of the Omer.",
    growth: "Loving-kindness within gratitude. A grateful heart is a generous heart. Express gratitude by giving — respond to what you have received by becoming a source of blessing for others. The best 'thank you' is to pay it forward.",
  },
  {
    weekSefirah: "Hod", daySefirah: "Gevurah",
    combinedName: "Gevurah shebeHod", combinedNameHebrew: "גְּבוּרָה שֶׁבְּהוֹד",
    hebrewCount: "הַיּוֹם שְׁלֹשִׁים יוֹם שֶׁהֵם אַרְבָּעָה שָׁבוּעוֹת וּשְׁנֵי יָמִים לָעֹמֶר",
    transliteration: "Hayom shloshim yom, she'hem arba'ah shavuot u'shnei yamim la'omer",
    englishCount: "Today is thirty days, which is four weeks and two days of the Omer.",
    growth: "Discipline within gratitude. Authentic gratitude requires the courage to acknowledge dependence and vulnerability. Pride resists saying 'thank you' because it implies you needed help. Practice the humility of genuine acknowledgment today.",
  },
  {
    weekSefirah: "Hod", daySefirah: "Tiferet",
    combinedName: "Tiferet shebeHod", combinedNameHebrew: "תִּפְאֶרֶת שֶׁבְּהוֹד",
    hebrewCount: "הַיּוֹם אֶחָד וּשְׁלֹשִׁים יוֹם שֶׁהֵם אַרְבָּעָה שָׁבוּעוֹת וּשְׁלֹשָׁה יָמִים לָעֹמֶר",
    transliteration: "Hayom echad u'shloshim yom, she'hem arba'ah shavuot u'shlosha yamim la'omer",
    englishCount: "Today is thirty-one days, which is four weeks and three days of the Omer.",
    growth: "Beauty within gratitude. Thankfulness expressed with truth and grace is beautiful. Don't just feel it — say it clearly and specifically. Write a note, speak the words, let the full depth of your gratitude be known and felt by the person who deserves it.",
  },
  {
    weekSefirah: "Hod", daySefirah: "Netzach",
    combinedName: "Netzach shebeHod", combinedNameHebrew: "נֶצַח שֶׁבְּהוֹד",
    hebrewCount: "הַיּוֹם שְׁנַיִם וּשְׁלֹשִׁים יוֹם שֶׁהֵם אַרְבָּעָה שָׁבוּעוֹת וְאַרְבָּעָה יָמִים לָעֹמֶר",
    transliteration: "Hayom shnayim u'shloshim yom, she'hem arba'ah shavuot v'arba'ah yamim la'omer",
    englishCount: "Today is thirty-two days, which is four weeks and four days of the Omer.",
    growth: "Persistence within gratitude. Make gratitude a daily practice — not just an occasional feeling when things go well. Sustain the awareness of blessing even on difficult days. Notice at least one thing to be grateful for before you sleep tonight.",
  },
  {
    weekSefirah: "Hod", daySefirah: "Hod",
    combinedName: "Hod shebeHod", combinedNameHebrew: "הוֹד שֶׁבְּהוֹד",
    hebrewCount: "הַיּוֹם שְׁלֹשָׁה וּשְׁלֹשִׁים יוֹם שֶׁהֵם אַרְבָּעָה שָׁבוּעוֹת וַחֲמִשָּׁה יָמִים לָעֹמֶר",
    transliteration: "Hayom shlosha u'shloshim yom, she'hem arba'ah shavuot v'chamishah yamim la'omer",
    englishCount: "Today is thirty-three days, which is four weeks and five days of the Omer.",
    growth: "Lag BaOmer — the yahrzeit of Rabbi Shimon bar Yochai, who revealed the inner light of Torah in the Zohar. Pure splendor. The hidden becomes visible. Light bonfires of joy; connect to the deepest flame within your own soul. The darkness of the Omer is lifting.",
  },
  {
    weekSefirah: "Hod", daySefirah: "Yesod",
    combinedName: "Yesod shebeHod", combinedNameHebrew: "יְסוֹד שֶׁבְּהוֹד",
    hebrewCount: "הַיּוֹם אַרְבָּעָה וּשְׁלֹשִׁים יוֹם שֶׁהֵם אַרְבָּעָה שָׁבוּעוֹת וְשִׁשָּׁה יָמִים לָעֹמֶר",
    transliteration: "Hayom arba'ah u'shloshim yom, she'hem arba'ah shavuot v'shisha yamim la'omer",
    englishCount: "Today is thirty-four days, which is four weeks and six days of the Omer.",
    growth: "Connection within gratitude. Gratitude expressed deepens relationship. When we acknowledge what others give us, we strengthen the bond between us. Thank the people who sustain you — perhaps someone so constant you have forgotten to notice them.",
  },
  {
    weekSefirah: "Hod", daySefirah: "Malchut",
    combinedName: "Malchut shebeHod", combinedNameHebrew: "מַלְכוּת שֶׁבְּהוֹד",
    hebrewCount: "הַיּוֹם חֲמִשָּׁה וּשְׁלֹשִׁים יוֹם שֶׁהֵם חֲמִשָּׁה שָׁבוּעוֹת לָעֹמֶר",
    transliteration: "Hayom chamishah u'shloshim yom, she'hem chamishah shavuot la'omer",
    englishCount: "Today is thirty-five days, which is five weeks of the Omer.",
    growth: "Dignity within gratitude. The humble person is simultaneously the most dignified — they acknowledge reality without pretense. Practice receiving graciously today: when someone does something kind for you, accept it fully rather than deflecting. Five weeks — Shavuot approaches.",
  },

  // ── WEEK 6: Yesod ───────────────────────────────────────────────────────────
  {
    weekSefirah: "Yesod", daySefirah: "Chesed",
    combinedName: "Chesed shebeYesod", combinedNameHebrew: "חֶסֶד שֶׁבְּיְסוֹד",
    hebrewCount: "הַיּוֹם שִׁשָּׁה וּשְׁלֹשִׁים יוֹם שֶׁהֵם חֲמִשָּׁה שָׁבוּעוֹת וְיוֹם אֶחָד לָעֹמֶר",
    transliteration: "Hayom shisha u'shloshim yom, she'hem chamishah shavuot v'yom echad la'omer",
    englishCount: "Today is thirty-six days, which is five weeks and one day of the Omer.",
    growth: "Loving-kindness within foundation. A loving bond is a foundation for all blessing. Invest in a close relationship today — not for what you get from it but for what you build together. The most lasting things are built through love.",
  },
  {
    weekSefirah: "Yesod", daySefirah: "Gevurah",
    combinedName: "Gevurah shebeYesod", combinedNameHebrew: "גְּבוּרָה שֶׁבְּיְסוֹד",
    hebrewCount: "הַיּוֹם שִׁבְעָה וּשְׁלֹשִׁים יוֹם שֶׁהֵם חֲמִשָּׁה שָׁבוּעוֹת וּשְׁנֵי יָמִים לָעֹמֶר",
    transliteration: "Hayom shiv'ah u'shloshim yom, she'hem chamishah shavuot u'shnei yamim la'omer",
    englishCount: "Today is thirty-seven days, which is five weeks and two days of the Omer.",
    growth: "Discipline within foundation. Good relationships require clear boundaries and honest communication. Address something that has been left unsaid — not from anger, but from care. The foundation of a relationship is truth spoken with love.",
  },
  {
    weekSefirah: "Yesod", daySefirah: "Tiferet",
    combinedName: "Tiferet shebeYesod", combinedNameHebrew: "תִּפְאֶרֶת שֶׁבְּיְסוֹד",
    hebrewCount: "הַיּוֹם שְׁמוֹנָה וּשְׁלֹשִׁים יוֹם שֶׁהֵם חֲמִשָּׁה שָׁבוּעוֹת וּשְׁלֹשָׁה יָמִים לָעֹמֶר",
    transliteration: "Hayom shmonah u'shloshim yom, she'hem chamishah shavuot u'shlosha yamim la'omer",
    englishCount: "Today is thirty-eight days, which is five weeks and three days of the Omer.",
    growth: "Beauty within foundation. A relationship built on truth and balance is the most beautiful foundation. Let your closest bonds be rooted in reality, not in image or performance. Authenticity is the mortar that holds the foundation together.",
  },
  {
    weekSefirah: "Yesod", daySefirah: "Netzach",
    combinedName: "Netzach shebeYesod", combinedNameHebrew: "נֶצַח שֶׁבְּיְסוֹד",
    hebrewCount: "הַיּוֹם תִּשְׁעָה וּשְׁלֹשִׁים יוֹם שֶׁהֵם חֲמִשָּׁה שָׁבוּעוֹת וְאַרְבָּעָה יָמִים לָעֹמֶר",
    transliteration: "Hayom tish'ah u'shloshim yom, she'hem chamishah shavuot v'arba'ah yamim la'omer",
    englishCount: "Today is thirty-nine days, which is five weeks and four days of the Omer.",
    growth: "Perseverance within foundation. A foundation is only as strong as its sustained maintenance. Long-term bonds require consistent investment through every season — times of closeness and times of distance. Return to a bond you have neglected.",
  },
  {
    weekSefirah: "Yesod", daySefirah: "Hod",
    combinedName: "Hod shebeYesod", combinedNameHebrew: "הוֹד שֶׁבְּיְסוֹד",
    hebrewCount: "הַיּוֹם אַרְבָּעִים יוֹם שֶׁהֵם חֲמִשָּׁה שָׁבוּעוֹת וַחֲמִשָּׁה יָמִים לָעֹמֶר",
    transliteration: "Hayom arba'im yom, she'hem chamishah shavuot v'chamishah yamim la'omer",
    englishCount: "Today is forty days, which is five weeks and five days of the Omer.",
    growth: "Gratitude within foundation. Acknowledge the people who form the foundation of your life — those whose steady, quiet presence you may have taken for granted. Express specific, concrete gratitude to one of them today.",
  },
  {
    weekSefirah: "Yesod", daySefirah: "Yesod",
    combinedName: "Yesod shebeYesod", combinedNameHebrew: "יְסוֹד שֶׁבְּיְסוֹד",
    hebrewCount: "הַיּוֹם אֶחָד וְאַרְבָּעִים יוֹם שֶׁהֵם חֲמִשָּׁה שָׁבוּעוֹת וְשִׁשָּׁה יָמִים לָעֹמֶר",
    transliteration: "Hayom echad v'arba'im yom, she'hem chamishah shavuot v'shisha yamim la'omer",
    englishCount: "Today is forty-one days, which is five weeks and six days of the Omer.",
    growth: "Pure connection. The channel between Heaven and earth at its clearest. Pray with complete focus tonight — let nothing stand between your heart and God. Yesod shebeYesod is the day of the most direct spiritual connection in the entire Omer cycle.",
  },
  {
    weekSefirah: "Yesod", daySefirah: "Malchut",
    combinedName: "Malchut shebeYesod", combinedNameHebrew: "מַלְכוּת שֶׁבְּיְסוֹד",
    hebrewCount: "הַיּוֹם שְׁנַיִם וְאַרְבָּעִים יוֹם שֶׁהֵם שִׁשָּׁה שָׁבוּעוֹת לָעֹמֶר",
    transliteration: "Hayom shnayim v'arba'im yom, she'hem shisha shavuot la'omer",
    englishCount: "Today is forty-two days, which is six weeks of the Omer.",
    growth: "Dignity within foundation. A foundation that upholds the dignity of all who stand on it. Every relationship in your life should leave the other person feeling more valued, not less. Six weeks complete — one more to go. The Torah is almost yours.",
  },

  // ── WEEK 7: Malchut ─────────────────────────────────────────────────────────
  {
    weekSefirah: "Malchut", daySefirah: "Chesed",
    combinedName: "Chesed shebeMalchut", combinedNameHebrew: "חֶסֶד שֶׁבְּמַלְכוּת",
    hebrewCount: "הַיּוֹם שְׁלֹשָׁה וְאַרְבָּעִים יוֹם שֶׁהֵם שִׁשָּׁה שָׁבוּעוֹת וְיוֹם אֶחָד לָעֹמֶר",
    transliteration: "Hayom shlosha v'arba'im yom, she'hem shisha shavuot v'yom echad la'omer",
    englishCount: "Today is forty-three days, which is six weeks and one day of the Omer.",
    growth: "Loving-kindness within sovereignty. A true leader's love for their people is the source of their authority — not power, not fear. Lead through love today. Let genuine care for others be the foundation of any influence you have.",
  },
  {
    weekSefirah: "Malchut", daySefirah: "Gevurah",
    combinedName: "Gevurah shebeMalchut", combinedNameHebrew: "גְּבוּרָה שֶׁבְּמַלְכוּת",
    hebrewCount: "הַיּוֹם אַרְבָּעָה וְאַרְבָּעִים יוֹם שֶׁהֵם שִׁשָּׁה שָׁבוּעוֹת וּשְׁנֵי יָמִים לָעֹמֶר",
    transliteration: "Hayom arba'ah v'arba'im yom, she'hem shisha shavuot u'shnei yamim la'omer",
    englishCount: "Today is forty-four days, which is six weeks and two days of the Omer.",
    growth: "Strength within sovereignty. A leader who cannot say no cannot truly protect their people. Practice principled leadership today — the quiet strength of holding a boundary not for ego but out of genuine responsibility.",
  },
  {
    weekSefirah: "Malchut", daySefirah: "Tiferet",
    combinedName: "Tiferet shebeMalchut", combinedNameHebrew: "תִּפְאֶרֶת שֶׁבְּמַלְכוּת",
    hebrewCount: "הַיּוֹם חֲמִשָּׁה וְאַרְבָּעִים יוֹם שֶׁהֵם שִׁשָּׁה שָׁבוּעוֹת וּשְׁלֹשָׁה יָמִים לָעֹמֶר",
    transliteration: "Hayom chamishah v'arba'im yom, she'hem shisha shavuot u'shlosha yamim la'omer",
    englishCount: "Today is forty-five days, which is six weeks and three days of the Omer.",
    growth: "Beauty within sovereignty. True leadership is a work of art — composure, truth, and grace combined. Let your presence and speech reflect balanced, dignified authority today. Lead by example, not by decree.",
  },
  {
    weekSefirah: "Malchut", daySefirah: "Netzach",
    combinedName: "Netzach shebeMalchut", combinedNameHebrew: "נֶצַח שֶׁבְּמַלְכוּת",
    hebrewCount: "הַיּוֹם שִׁשָּׁה וְאַרְבָּעִים יוֹם שֶׁהֵם שִׁשָּׁה שָׁבוּעוֹת וְאַרְבָּעָה יָמִים לָעֹמֶר",
    transliteration: "Hayom shisha v'arba'im yom, she'hem shisha shavuot v'arba'ah yamim la'omer",
    englishCount: "Today is forty-six days, which is six weeks and four days of the Omer.",
    growth: "Perseverance within sovereignty. The Jewish people's endurance through every exile and persecution is the ultimate expression of Netzach shebeMalchut — eternal, royal persistence. You are the continuation of that story. Stand tall.",
  },
  {
    weekSefirah: "Malchut", daySefirah: "Hod",
    combinedName: "Hod shebeMalchut", combinedNameHebrew: "הוֹד שֶׁבְּמַלְכוּת",
    hebrewCount: "הַיּוֹם שִׁבְעָה וְאַרְבָּעִים יוֹם שֶׁהֵם שִׁשָּׁה שָׁבוּעוֹת וַחֲמִשָּׁה יָמִים לָעֹמֶר",
    transliteration: "Hayom shiv'ah v'arba'im yom, she'hem shisha shavuot v'chamishah yamim la'omer",
    englishCount: "Today is forty-seven days, which is six weeks and five days of the Omer.",
    growth: "Gratitude within sovereignty. A king who acknowledges God as the true King is the greatest king. 'Not by might, not by power, but by My spirit.' Practice the sovereignty of humble gratitude today — every breath, every thought, every capability is on loan.",
  },
  {
    weekSefirah: "Malchut", daySefirah: "Yesod",
    combinedName: "Yesod shebeMalchut", combinedNameHebrew: "יְסוֹד שֶׁבְּמַלְכוּת",
    hebrewCount: "הַיּוֹם שְׁמוֹנָה וְאַרְבָּעִים יוֹם שֶׁהֵם שִׁשָּׁה שָׁבוּעוֹת וְשִׁשָּׁה יָמִים לָעֹמֶר",
    transliteration: "Hayom shmonah v'arba'im yom, she'hem shisha shavuot v'shisha yamim la'omer",
    englishCount: "Today is forty-eight days, which is six weeks and six days of the Omer.",
    growth: "The foundation of sovereignty — Torah as the channel between Heaven and earth. Tonight, prepare for Shavuot. Learn Torah into the night. You are almost at Sinai. Forty-eight days of refining yourself have prepared you to receive what you could not have received before.",
  },
  {
    weekSefirah: "Malchut", daySefirah: "Malchut",
    combinedName: "Malchut shebeMalchut", combinedNameHebrew: "מַלְכוּת שֶׁבְּמַלְכוּת",
    hebrewCount: "הַיּוֹם תִּשְׁעָה וְאַרְבָּעִים יוֹם שֶׁהֵם שִׁבְעָה שָׁבוּעוֹת לָעֹמֶר",
    transliteration: "Hayom tish'ah v'arba'im yom, she'hem shiv'ah shavuot la'omer",
    englishCount: "Today is forty-nine days, which is seven weeks of the Omer.",
    growth: "The complete expression of sovereignty. Forty-nine days of refining every sefirah within every sefirah. You now stand at the foot of Sinai — not the mountain of fire and thunder, but the mountain you have built within yourself. Tomorrow the Torah is yours. Tonight: be silent, be present, be ready.",
  },
];

// ── Inspirational quotes — one per day, from Torah, Talmud & Chasidic masters ─

const OMER_QUOTES: { quote: string; quoteSource: string }[] = [
  // Week 1 — Chesed
  { quote: "On three things the world stands: on Torah, on service, and on acts of loving-kindness.", quoteSource: "Shimon HaTzaddik · Pirkei Avot 1:2" },
  { quote: "Love your fellow as yourself — this is the great principle of the entire Torah.", quoteSource: "Rabbi Akiva · Talmud Yerushalmi, Nedarim 9:4" },
  { quote: "Many waters cannot quench love, nor can rivers drown it.", quoteSource: "Shir HaShirim 8:7" },
  { quote: "The world was created only for the sake of one whose soul is filled with love.", quoteSource: "Adapted from Talmud Sanhedrin 37a" },
  { quote: "Who is rich? One who is satisfied with his portion — and who is content finds love in every corner.", quoteSource: "Ben Zoma · Pirkei Avot 4:1" },
  { quote: "Even a single candle can push away a great darkness. One act of loving-kindness illuminates the world.", quoteSource: "Baal Shem Tov · Keter Shem Tov §8" },
  { quote: "There is no love like the love that asks nothing in return — the love of a father for his child.", quoteSource: "Adapted from Tanya, Iggeret HaKodesh §15" },

  // Week 2 — Gevurah
  { quote: "Who is mighty? One who subdues his inclination.", quoteSource: "Ben Zoma · Pirkei Avot 4:1" },
  { quote: "Be strong as a leopard, swift as an eagle, fleet as a deer, and brave as a lion to do the will of your Father in Heaven.", quoteSource: "Yehudah ben Tema · Pirkei Avot 5:20" },
  { quote: "A person should be soft as a reed, and not hard as a cedar.", quoteSource: "Talmud Ta'anit 20a" },
  { quote: "Fall seven times, stand up eight.", quoteSource: "Mishlei (Proverbs) 24:16" },
  { quote: "The strong person is not one who is never afraid. It is one who does what must be done in spite of fear.", quoteSource: "Adapted from Likutey Moharan I:16" },
  { quote: "In the place where a penitent stands, even the completely righteous cannot stand.", quoteSource: "Talmud Berakhot 34b" },
  { quote: "A king who cannot govern himself cannot govern a kingdom.", quoteSource: "Adapted from Rambam, Hilchot De'ot 1:5" },

  // Week 3 — Tiferet
  { quote: "Truth is the seal of the Holy One, Blessed be He.", quoteSource: "Talmud Shabbat 55a" },
  { quote: "A person must always let his mind and heart be at peace with all people.", quoteSource: "Talmud Berakhot 17a" },
  { quote: "Emet — truth — endures forever. A lie has no legs.", quoteSource: "Adapted from Mishlei 12:19" },
  { quote: "Do not look at the vessel but at what it contains — inner truth is the only beauty that lasts.", quoteSource: "Ben Bag Bag · Pirkei Avot 4:20" },
  { quote: "The world was created for the sake of those who speak truth.", quoteSource: "Adapted from Talmud Shabbat 55a" },
  { quote: "What is hateful to you, do not do to your neighbor. This is the entire Torah — all the rest is commentary.", quoteSource: "Hillel · Talmud Shabbat 31a" },
  { quote: "A person should always cast himself as half guilty and half innocent — live in the balance.", quoteSource: "Talmud Kiddushin 40b" },

  // Week 4 — Netzach
  { quote: "The Jewish people are compared to the stars — each one shines, and together they light the night.", quoteSource: "Adapted from Bereishit 22:17" },
  { quote: "Do not despair! Even if a sharp sword rests on a person's neck, one should not give up on mercy.", quoteSource: "Talmud Berakhot 10a" },
  { quote: "Though He slay me, yet will I trust in Him.", quoteSource: "Iyov (Job) 13:15" },
  { quote: "After you reach the heights, return to the beginning — and begin again with new eyes.", quoteSource: "Adapted from Likutey Moharan I:6" },
  { quote: "The righteous falls seven times and rises again.", quoteSource: "Mishlei (Proverbs) 24:16" },
  { quote: "A great tree withstands every storm because its roots run deep and wide.", quoteSource: "Adapted from Talmud Ta'anit 20a" },
  { quote: "You will be plentiful, you will succeed, you will go from strength to strength — for the whole earth belongs to God.", quoteSource: "Adapted from Tehillim (Psalms) 84:8" },

  // Week 5 — Hod
  { quote: "It is good to give thanks to God, and to sing to Your name, Most High.", quoteSource: "Tehillim (Psalms) 92:2" },
  { quote: "Acknowledging what you lack is the beginning of wisdom; acknowledging what you have is the beginning of joy.", quoteSource: "Adapted from Pirkei Avot 4:1" },
  { quote: "The one who gives thanks teaches themselves to see the world as it truly is — overflowing with goodness.", quoteSource: "Adapted from Tanya, Sha'ar HaYichud V'haEmunah Ch. 2" },
  { quote: "Everything God does is for the good.", quoteSource: "Nachum Ish Gamzu · Talmud Ta'anit 21a" },
  { quote: "Rabbi Shimon bar Yochai said: I have seen men of high quality and they are few. If there be a thousand, my son and I are among them.", quoteSource: "Talmud Sukkah 45b" },
  { quote: "When you open your eyes to thankfulness, you discover that even darkness has been serving you.", quoteSource: "Adapted from Rabbi Nachman of Breslov, Likutey Moharan I:195" },
  { quote: "Receive every person with a pleasant countenance — for a smile given freely is more powerful than any gift.", quoteSource: "Shammai · Pirkei Avot 1:15" },

  // Week 6 — Yesod
  { quote: "The righteous man is the foundation of the world.", quoteSource: "Mishlei (Proverbs) 10:25" },
  { quote: "Acquire a friend for yourself — it is the greatest acquisition.", quoteSource: "Adapted from Yehoshua ben Perachiah · Pirkei Avot 1:6" },
  { quote: "Two are better than one, for if one falls the other lifts his companion.", quoteSource: "Kohelet (Ecclesiastes) 4:9–10" },
  { quote: "A faithful friend is a strong shelter. He who finds one finds a treasure.", quoteSource: "Ben Sira (Ecclesiasticus) 6:14" },
  { quote: "Love your neighbor as yourself — say it to them. The world runs on words heard by a beating heart.", quoteSource: "Adapted from Vayikra (Leviticus) 19:18" },
  { quote: "All of Israel are responsible for one another.", quoteSource: "Talmud Shevuot 39a" },
  { quote: "One who saves a single soul, it is as if he saved an entire world.", quoteSource: "Talmud Sanhedrin 37a" },

  // Week 7 — Malchut
  { quote: "The heart of a king is in the hand of God; He turns it wherever He wishes.", quoteSource: "Mishlei (Proverbs) 21:1" },
  { quote: "I have set the Lord before me always — this is the great principle of the Torah and the mark of the righteous.", quoteSource: "Tehillim (Psalms) 16:8 · Rema, Orach Chaim 1:1" },
  { quote: "This is the gate of God; the righteous shall enter through it.", quoteSource: "Tehillim (Psalms) 118:20" },
  { quote: "Am Yisrael Chai — the nation of Israel lives. It lives in each of you.", quoteSource: "Traditional · Based on Yechezkel 37:14" },
  { quote: "Not by might, and not by power, but by My spirit — says the Lord of Hosts.", quoteSource: "Zechariah 4:6" },
  { quote: "Torah was given through forty-eight qualities. You have just lived forty-eight days. Tonight, you hold all of them.", quoteSource: "Pirkei Avot 6:6 · tradition of the Vilna Gaon" },
  { quote: "You stand today, all of you, before the Lord your God — to enter into His covenant. Welcome home.", quoteSource: "Devarim (Deuteronomy) 29:9" },
];

// Build the 49-day array
export const OMER_DAYS: OmerDay[] = DAYS_RAW.map((d, i) => ({
  ...d,
  day: i + 1,
  isLagBaOmer: i + 1 === 33,
  practices: OMER_PRACTICES[i + 1] ?? [],
  quote: OMER_QUOTES[i].quote,
  quoteSource: OMER_QUOTES[i].quoteSource,
}));

// ── Public API ────────────────────────────────────────────────────────────────

export function getOmerDay(): OmerInfo | null {
  const hd = new HDate(new Date());
  const hMonth = hd.getMonth();  // 1=Nisan 2=Iyar 3=Sivan
  const hDay = hd.getDate();

  let day: number | null = null;
  if (hMonth === 1 && hDay >= 16) day = hDay - 15;
  else if (hMonth === 2) day = hDay + 15;
  else if (hMonth === 3 && hDay <= 5) day = hDay + 44;

  if (day === null || day < 1 || day > 49) return null;

  const raw = OMER_DAYS[day - 1];
  const meta = SEFIRAH_META[raw.weekSefirah];

  return {
    ...raw,
    color: meta.color,
    bgClass: meta.bg,
    textClass: meta.text,
    borderClass: meta.border,
    daysRemaining: 49 - day,
  };
}

export function useOmer(): OmerInfo | null {
  return getOmerDay();
}

export { SEFIRAH_META };

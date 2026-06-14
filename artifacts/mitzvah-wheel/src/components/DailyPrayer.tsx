import { useState } from "react";
import { Check, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────────

interface Prayer {
  id: string;
  name: string;
  hebrew: string;
  time: string;
  timeDetail: string;
  duration: string;
  keyPrayers: string[];
  note: string;
  sefariaRef: string;
  men?: boolean;
  women?: boolean;
}

const PRAYERS: Prayer[] = [
  {
    id: "modeh-ani",
    name: "Modeh Ani",
    hebrew: "מוֹדֶה אֲנִי",
    time: "Upon waking",
    timeDetail: "Before anything else — before leaving bed",
    duration: "~30 sec",
    keyPrayers: ["Modeh Ani — 26 words of gratitude for the soul returned"],
    note: "Said before washing hands (Netilat Yadayim). No mention of God's name, so it can be said before washing. It sets the entire day's tone: gratitude first.",
    sefariaRef: "https://www.sefaria.org/Modeh_Ani",
  },
  {
    id: "shacharit",
    name: "Shacharit",
    hebrew: "שַׁחֲרִית",
    time: "Morning",
    timeDetail: "After sunrise — ideally by the end of the first quarter of the day (zman tefillah)",
    duration: "~20–45 min",
    keyPrayers: [
      "Netilat Yadayim — hand washing and morning blessings (Birkot HaShachar)",
      "Pesukei deZimra — passages of praise (Psalm 145/Ashrei, 150, etc.)",
      "Shema and its blessings (Yotzer Or, Ahavat Olam)",
      "Shemoneh Esreh — the Amidah (19 blessings on weekdays, 7 on Shabbat)",
      "Tachanun (weekdays, except Shabbat and Yom Tov)",
      "Torah reading on Monday/Thursday/Shabbat/Yom Tov",
      "Aleinu and Kaddish",
    ],
    note: "The cornerstone of the day. The Amidah should be prayed with a minyan when possible — 'tefillat tzibur' (communal prayer) carries special weight. Women are obligated in some daily prayer, though not in the full time-bound obligation.",
    sefariaRef: "https://www.sefaria.org/Siddur_Ashkenaz%2C_Weekday%2C_Shacharit%2C_Preparatory_Prayers%2C_Modeh_Ani",
    men: true,
    women: true,
  },
  {
    id: "musaf",
    name: "Musaf",
    hebrew: "מוּסַף",
    time: "After Shacharit",
    timeDetail: "On Shabbat, Yom Tov, Rosh Chodesh — immediately after Shacharit",
    duration: "~10–20 min",
    keyPrayers: [
      "Additional Amidah corresponding to the Musaf sacrifice in the Temple",
      "Kedushah of Musaf (on Shabbat: special expanded version)",
    ],
    note: "Replaces the additional Temple sacrifice (korban Musaf). Said only on days when a Musaf was offered — Shabbat, Yom Tov, Rosh Chodesh, Chol HaMoed.",
    sefariaRef: "https://www.sefaria.org/search?q=Musaf+Amidah&tab=text",
    men: true,
    women: true,
  },
  {
    id: "mincha",
    name: "Mincha",
    hebrew: "מִנְחָה",
    time: "Afternoon",
    timeDetail: "After midday (chatzot) — ideally mid-afternoon (mincha ketanah), before sunset",
    duration: "~5–10 min",
    keyPrayers: [
      "Ashrei (Psalm 145)",
      "Shemoneh Esreh — Amidah",
      "Tachanun (on applicable weekdays)",
      "Aleinu",
    ],
    note: "Eliyahu HaNavi's prayer at Mincha time (I Kings 18:36) was answered immediately — a sign of its special potency. The shortest of the three prayers. Often easiest to add into a busy day.",
    sefariaRef: "https://www.sefaria.org/search?q=Mincha+prayer&tab=text",
    men: true,
    women: true,
  },
  {
    id: "maariv",
    name: "Maariv / Arvit",
    hebrew: "מַעֲרִיב / עַרְבִית",
    time: "Evening",
    timeDetail: "After nightfall (tzet hakochavim — three stars visible)",
    duration: "~10–15 min",
    keyPrayers: [
      "Barchu (when davening with a minyan)",
      "Shema and its evening blessings (Maariv Aravim, Ahavat Olam)",
      "Shemoneh Esreh — Amidah",
      "Aleinu and Kaddish",
      "Kiddush Levana (once a month, when moon is visible)",
    ],
    note: "Technically optional by biblical law (the evening Amidah was originally voluntary), but universally accepted as obligatory. On Friday night: Maariv transitions into Shabbat with Lecha Dodi and Kabbalat Shabbat.",
    sefariaRef: "https://www.sefaria.org/search?q=Maariv+prayer&tab=text",
    men: true,
    women: false,
  },
  {
    id: "kriat-shema-mitah",
    name: "Kriat Shema al HaMitah",
    hebrew: "קְרִיאַת שְׁמַע עַל הַמִּטָּה",
    time: "Before sleep",
    timeDetail: "In bed, just before falling asleep",
    duration: "~2–5 min",
    keyPrayers: [
      "Shema (at minimum)",
      "Hamapil — blessing over sleep",
      "Additional Psalms (91, 128) and prayers for protection",
    ],
    note: "A protection for the night — the Talmud says sleeping without reciting Shema is dangerous. At minimum, say the first paragraph of Shema. Many recite Psalm 91 (Yoshev b'seter) as well.",
    sefariaRef: "https://www.sefaria.org/Psalms.91?lang=bi",
    men: true,
    women: true,
  },
];

// ── Storage ───────────────────────────────────────────────────────────────────

function storageKey() {
  return "mitzvah-wheel-prayers-" + new Date().toISOString().slice(0, 10);
}

function loadDone(): Set<string> {
  try {
    const raw = localStorage.getItem(storageKey());
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch { return new Set(); }
}

function saveDone(s: Set<string>) {
  try { localStorage.setItem(storageKey(), JSON.stringify([...s])); } catch { /* */ }
}

// ── Prayer row ────────────────────────────────────────────────────────────────

function PrayerRow({ prayer, done, onToggle }: { prayer: Prayer; done: boolean; onToggle: () => void }) {
  const [open, setOpen] = useState(false);

  const badgeColor = done ? "bg-green-100 border-green-300" : "bg-card border-border";

  return (
    <div className={`rounded-xl border transition-all ${done ? "border-green-300 bg-green-50/60" : "border-border bg-card"}`}>
      {/* Header row */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Checkbox */}
        <button
          onClick={onToggle}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            done ? "border-green-500 bg-green-500" : "border-gray-300 bg-white hover:border-gray-400"
          }`}
          data-testid={`prayer-check-${prayer.id}`}
        >
          {done && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
        </button>

        {/* Name + time */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className={`text-sm font-bold ${done ? "text-green-700 line-through" : "text-foreground"}`}>
              {prayer.name}
            </span>
            <span className="text-xs font-serif text-muted-foreground" dir="rtl" lang="he">
              {prayer.hebrew}
            </span>
            {prayer.men && !prayer.women && (
              <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">Men</span>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {prayer.time} · <span className="text-muted-foreground/70">{prayer.duration}</span>
          </p>
        </div>

        {/* Expand + Sefaria */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href={prayer.sefariaRef}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-[10px] text-primary flex items-center gap-0.5 hover:text-primary/80 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
          </a>
          <button onClick={() => setOpen((v) => !v)} className="text-muted-foreground hover:text-foreground transition-colors">
            {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded detail */}
      {open && (
        <div className="px-4 pb-3 space-y-2.5 border-t border-border/40">
          {/* Time detail */}
          <p className="text-[11px] text-muted-foreground pt-2.5 font-serif italic">{prayer.timeDetail}</p>

          {/* Key prayers */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">What's included</p>
            <ul className="space-y-0.5">
              {prayer.keyPrayers.map((p, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-foreground">
                  <span className="w-1 h-1 rounded-full bg-primary/50 flex-shrink-0 mt-1.5" />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* Note */}
          <div className="px-3 py-2 bg-primary/5 rounded-lg border border-primary/10">
            <p className="text-xs text-foreground leading-relaxed font-serif">{prayer.note}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function DailyPrayer() {
  const [done, setDone] = useState<Set<string>>(loadDone);
  const [showMusaf, setShowMusaf] = useState(false);

  const toggle = (id: string) => {
    setDone((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      saveDone(next);
      return next;
    });
  };

  // Show only daily prayers by default (no Musaf — it's situational)
  const daily = PRAYERS.filter((p) => p.id !== "musaf");
  const done3 = ["shacharit", "mincha", "maariv"].filter((id) => done.has(id)).length;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-foreground">Daily Prayer — תְּפִלָּה</h2>
          <p className="text-[10px] text-muted-foreground mt-0.5 font-serif">
            Shacharit · Mincha · Maariv — the three daily prayers
          </p>
        </div>
        {done3 > 0 && (
          <span className="text-xs font-bold text-green-700 bg-green-100 border border-green-300 px-2 py-0.5 rounded-full">
            {done3}/3 tefillot
          </span>
        )}
      </div>

      {/* Progress bar for the 3 main prayers */}
      {done3 > 0 && (
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all"
            style={{ width: `${(done3 / 3) * 100}%` }}
          />
        </div>
      )}

      {/* Prayer rows */}
      <div className="space-y-2">
        {daily.map((p) => (
          <PrayerRow key={p.id} prayer={p} done={done.has(p.id)} onToggle={() => toggle(p.id)} />
        ))}
      </div>

      {/* Musaf toggle */}
      <button
        onClick={() => setShowMusaf((v) => !v)}
        className="text-[10px] text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
      >
        {showMusaf ? "Hide" : "Show"} Musaf (Shabbat / Yom Tov / Rosh Chodesh)
      </button>

      {showMusaf && (
        <PrayerRow
          prayer={PRAYERS.find((p) => p.id === "musaf")!}
          done={done.has("musaf")}
          onToggle={() => toggle("musaf")}
        />
      )}

      {/* Mishnah quote */}
      <div className="px-3 py-2.5 rounded-lg bg-secondary/40 border border-border text-center space-y-0.5">
        <p className="text-xs font-bold font-serif" dir="rtl" lang="he">
          רַבִּי חֲנִינָא אוֹמֵר, הֱוֵי מִתְפַּלֵּל בִּשְׁלוֹמָהּ שֶׁל מַלְכוּת
        </p>
        <p className="text-[10px] text-muted-foreground font-serif italic">
          "Pray for the welfare of the government…" — Avot 3:2
        </p>
      </div>
    </div>
  );
}

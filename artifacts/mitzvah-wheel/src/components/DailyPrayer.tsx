import { useState } from "react";
import { Check, ExternalLink, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { useSiddur } from "@/hooks/use-siddur";
import {
  getSiddurText,
  stripHtml,
  SIDDUR_SECTIONS,
  type SiddurSectionKey,
} from "@/data/siddur";

// ── Siddur text widget ─────────────────────────────────────────────────────────
// English text loads instantly from bundled JSON.
// Hebrew loads async from Sefaria API.

function SiddurText({ sectionKeys }: { sectionKeys: SiddurSectionKey[] }) {
  const [visible, setVisible] = useState(false);
  const [selectedKey, setSelectedKey] = useState<SiddurSectionKey>(sectionKeys[0]);

  const section = SIDDUR_SECTIONS[selectedKey];
  const englishLines = getSiddurText(section.path as string[]).map(stripHtml);

  // Hebrew via API — only fetches when the widget is open
  const { data: apiData, loading: heLoading } = useSiddur(
    visible ? section.sefariaRef : null
  );

  const heLines: string[] = apiData
    ? apiData.lines.map((l) => l.he).filter(Boolean)
    : [];

  return (
    <div className="mt-2">
      <button
        onClick={() => setVisible((v) => !v)}
        className="flex items-center gap-1.5 text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors"
      >
        <BookOpen className="w-3 h-3" />
        {visible ? "Hide" : "Show"} prayer text
        <span className="text-[9px] text-muted-foreground font-normal">— Sefaria Siddur Ashkenaz</span>
      </button>

      {visible && (
        <div className="mt-1.5 rounded-lg border border-primary/20 bg-primary/5 overflow-hidden">
          {/* Section selector */}
          {sectionKeys.length > 1 && (
            <div className="px-3 pt-2 pb-1 flex gap-1.5 flex-wrap">
              {sectionKeys.map((k) => (
                <button
                  key={k}
                  onClick={() => setSelectedKey(k)}
                  className={`text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border transition-colors ${
                    k === selectedKey
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-white/60 text-muted-foreground border-border hover:border-primary/40"
                  }`}
                >
                  {SIDDUR_SECTIONS[k].label}
                </button>
              ))}
            </div>
          )}

          {/* Header row */}
          <div className="px-3 py-1.5 flex items-center justify-between border-b border-primary/10">
            <span className="text-[9px] font-bold uppercase tracking-widest text-primary/70">
              {section.label}
            </span>
            <a
              href={`https://www.sefaria.org/${section.sefariaRef.replace(/ /g, "_")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[9px] text-primary flex items-center gap-0.5 hover:text-primary/80"
            >
              <ExternalLink className="w-2.5 h-2.5" />
              Sefaria
            </a>
          </div>

          {/* Hebrew (from API) */}
          {heLines.length > 0 && (
            <div className="px-3 pt-2.5 pb-1.5 border-b border-primary/10 space-y-1">
              {heLines.map((line, i) => (
                <p key={i} className="text-sm font-serif leading-relaxed text-right" dir="rtl" lang="he">
                  {line}
                </p>
              ))}
            </div>
          )}
          {heLoading && (
            <div className="px-3 py-1.5 flex items-center gap-1.5 text-[10px] text-muted-foreground border-b border-primary/10">
              <span className="inline-block w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin flex-shrink-0" />
              Loading Hebrew…
            </div>
          )}

          {/* English (from local JSON — instant) */}
          <div className="px-3 py-2.5">
            {englishLines.length > 0 ? (
              englishLines.map((line, i) => (
                <p key={i} className="text-xs font-serif leading-relaxed italic text-foreground mb-1 last:mb-0">
                  {line}
                </p>
              ))
            ) : (
              <p className="text-[10px] text-muted-foreground italic">
                Full text available on Sefaria ↗
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Prayer data ────────────────────────────────────────────────────────────────

interface Prayer {
  id: string;
  name: string;
  hebrew: string;
  time: string;
  timeDetail: string;
  duration: string;
  keyPrayers: string[];
  note: string;
  sectionKeys: SiddurSectionKey[];
  sefariaPageUrl: string;
  menOnly?: boolean;
}

const PRAYERS: Prayer[] = [
  {
    id: "modeh-ani",
    name: "Modeh Ani",
    hebrew: "מוֹדֶה אֲנִי",
    time: "Upon waking",
    timeDetail: "Before anything else — before leaving bed, before washing hands",
    duration: "~30 sec",
    keyPrayers: ["26 words of gratitude for the soul returned"],
    note: "Said before Netilat Yadayim. No mention of God's name, so it's permitted before washing. Sets the entire day's tone — gratitude first.",
    sectionKeys: ["morehAni", "adonOlam", "sovereigntyOfHeaven"],
    sefariaPageUrl:
      "https://www.sefaria.org/Siddur_Ashkenaz,_Weekday,_Shacharit,_Preparatory_Prayers,_Modeh_Ani?lang=bi",
  },
  {
    id: "shacharit",
    name: "Shacharit",
    hebrew: "שַׁחֲרִית",
    time: "Morning",
    timeDetail: "After sunrise — ideally within the first quarter of the day (zman tefillah)",
    duration: "~20–45 min",
    keyPrayers: [
      "Netilat Yadayim + Birkot HaShachar (morning blessings)",
      "Pesukei deZimra — Baruch She'amar, Ashrei, Psalm 150",
      "Shema and its blessings (Yotzer Or, Ahavat Olam)",
      "Amidah — 19 blessings on weekdays, 7 on Shabbat",
      "Tachanun (weekdays only, except Shabbat/Yom Tov)",
      "Torah reading Mon/Thu/Shabbat/Yom Tov",
      "Aleinu and Kaddish",
    ],
    note: "The cornerstone of the day. The Amidah should be prayed with a minyan when possible. Women are obligated in some daily prayer but not in the full time-bound structure.",
    sectionKeys: ["ashrei", "amidahPatriarchs", "amidahHealing", "amidahPeace", "aleinu"],
    sefariaPageUrl:
      "https://www.sefaria.org/Siddur_Ashkenaz,_Weekday,_Shacharit,_Pesukei_Dezimra,_Ashrei?lang=bi",
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
      "Amidah — 19 blessings",
      "Tachanun (on applicable weekdays)",
      "Aleinu",
    ],
    note: "Eliyahu HaNavi's prayer at Mincha time (I Kings 18:36) was answered immediately — a sign of its potency. The shortest of the three prayers. Easiest to add into a busy day.",
    sectionKeys: ["ashrei", "amidahPatriarchs", "amidahPeace", "aleinu"],
    sefariaPageUrl:
      "https://www.sefaria.org/Siddur_Ashkenaz,_Weekday,_Minchah,_Ashrei?lang=bi",
  },
  {
    id: "maariv",
    name: "Maariv / Arvit",
    hebrew: "מַעֲרִיב / עַרְבִית",
    time: "Evening",
    timeDetail: "After nightfall — three stars visible (tzet hakochavim)",
    duration: "~10–15 min",
    keyPrayers: [
      "Barchu (with minyan)",
      "Shema and its evening blessings (Maariv Aravim, Ahavat Olam)",
      "Amidah — 19 blessings",
      "Aleinu and Kaddish",
      "Kiddush Levana once a month (when moon visible)",
    ],
    note: "Technically voluntary by biblical law but universally accepted as obligatory. On Friday night: Maariv transitions into Shabbat — Kabbalat Shabbat, Lecha Dodi, then Maariv.",
    sectionKeys: ["ahavahRabbah", "amidahPatriarchs", "aleinu", "lechaDodi", "yedidNefesh"],
    sefariaPageUrl:
      "https://www.sefaria.org/Siddur_Ashkenaz,_Weekday,_Maariv,_Blessings_of_the_Shema,_Shema?lang=bi",
    menOnly: true,
  },
  {
    id: "kriat-shema-mitah",
    name: "Kriat Shema al HaMitah",
    hebrew: "קְרִיאַת שְׁמַע עַל הַמִּטָּה",
    time: "Before sleep",
    timeDetail: "In bed, just before falling asleep",
    duration: "~2–5 min",
    keyPrayers: [
      "Shema (at minimum — the first paragraph is sufficient)",
      "Hamapil — blessing over sleep",
      "Psalm 91 (Yoshev b'seter) — protection for the night",
    ],
    note: "The Talmud (Berachot 60b) says this prayer protects during the night. At minimum, recite the first paragraph of Shema. Many add Psalm 91 and the Hamapil blessing.",
    sectionKeys: ["thirteen", "amidahPeace", "aleinu"],
    sefariaPageUrl: "https://www.sefaria.org/Psalms.91?lang=bi",
  },
];

const MUSAF: Prayer = {
  id: "musaf",
  name: "Musaf",
  hebrew: "מוּסַף",
  time: "After Shacharit",
  timeDetail: "On Shabbat, Yom Tov, Rosh Chodesh — immediately after Shacharit",
  duration: "~10–20 min",
  keyPrayers: [
    "Additional Amidah (7 blessings on Shabbat, special on Yom Tov)",
    "Kedushah of Musaf — expanded version on Shabbat",
  ],
  note: "Replaces the additional Temple sacrifice (korban Musaf). Said only on Shabbat, Yom Tov, Rosh Chodesh, and Chol HaMoed.",
  sectionKeys: ["amidahPatriarchs", "amidahPeace", "kiddush"],
  sefariaPageUrl: "https://www.sefaria.org/search?q=Musaf+Amidah&tab=text",
};

// ── Storage ───────────────────────────────────────────────────────────────────

function storageKey() {
  return "mitzvah-wheel-prayers-" + new Date().toISOString().slice(0, 10);
}
function loadDone(): Set<string> {
  try {
    const r = localStorage.getItem(storageKey());
    return r ? new Set(JSON.parse(r)) : new Set();
  } catch { return new Set(); }
}
function saveDone(s: Set<string>) {
  try { localStorage.setItem(storageKey(), JSON.stringify([...s])); } catch { /* */ }
}

// ── Prayer row ────────────────────────────────────────────────────────────────

function PrayerRow({
  prayer,
  done,
  onToggle,
}: {
  prayer: Prayer;
  done: boolean;
  onToggle: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`rounded-xl border transition-all ${
        done ? "border-green-300 bg-green-50/60" : "border-border bg-card"
      }`}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          onClick={onToggle}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            done
              ? "border-green-500 bg-green-500"
              : "border-gray-300 bg-white hover:border-gray-400"
          }`}
          data-testid={`prayer-check-${prayer.id}`}
        >
          {done && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span
              className={`text-sm font-bold ${
                done ? "text-green-700 line-through" : "text-foreground"
              }`}
            >
              {prayer.name}
            </span>
            <span
              className="text-xs font-serif text-muted-foreground"
              dir="rtl"
              lang="he"
            >
              {prayer.hebrew}
            </span>
            {prayer.menOnly && (
              <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                Men
              </span>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {prayer.time} ·{" "}
            <span className="text-muted-foreground/70">{prayer.duration}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href={prayer.sefariaPageUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-[10px] text-primary flex items-center gap-0.5 hover:text-primary/80 transition-colors"
            title="Open in Sefaria"
          >
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="text-muted-foreground hover:text-foreground"
          >
            {open ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {open && (
        <div className="px-4 pb-3.5 space-y-2.5 border-t border-border/40">
          <p className="text-[11px] text-muted-foreground pt-2.5 font-serif italic">
            {prayer.timeDetail}
          </p>

          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
              What's included
            </p>
            <ul className="space-y-0.5">
              {prayer.keyPrayers.map((p, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-foreground">
                  <span className="w-1 h-1 rounded-full bg-primary/50 flex-shrink-0 mt-1.5" />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="px-3 py-2 bg-primary/5 rounded-lg border border-primary/10">
            <p className="text-xs text-foreground leading-relaxed font-serif">{prayer.note}</p>
          </div>

          {/* Live Siddur text — English from local JSON, Hebrew from Sefaria API */}
          <SiddurText sectionKeys={prayer.sectionKeys} />
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

  const done3 = ["shacharit", "mincha", "maariv"].filter((id) => done.has(id)).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-foreground">Daily Prayer — תְּפִלָּה</h2>
          <p className="text-[10px] text-muted-foreground mt-0.5 font-serif">
            Full Siddur Ashkenaz text · Hebrew from Sefaria · English bundled
          </p>
        </div>
        {done3 > 0 && (
          <span className="text-xs font-bold text-green-700 bg-green-100 border border-green-300 px-2 py-0.5 rounded-full">
            {done3}/3
          </span>
        )}
      </div>

      {done3 > 0 && (
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all"
            style={{ width: `${(done3 / 3) * 100}%` }}
          />
        </div>
      )}

      <div className="space-y-2">
        {PRAYERS.map((p) => (
          <PrayerRow
            key={p.id}
            prayer={p}
            done={done.has(p.id)}
            onToggle={() => toggle(p.id)}
          />
        ))}
      </div>

      <button
        onClick={() => setShowMusaf((v) => !v)}
        className="text-[10px] text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
      >
        {showMusaf ? "Hide" : "Show"} Musaf (Shabbat / Yom Tov / Rosh Chodesh)
      </button>

      {showMusaf && (
        <PrayerRow
          prayer={MUSAF}
          done={done.has("musaf")}
          onToggle={() => toggle("musaf")}
        />
      )}

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

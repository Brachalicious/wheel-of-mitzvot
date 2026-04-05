import { useState } from "react";
import { useOmer, SEFIRAH_META, type OmerInfo } from "@/hooks/use-omer";
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Check } from "lucide-react";

// ── Per-day localStorage keys ─────────────────────────────────────────────────

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function countedKey() {
  return "mitzvah-wheel-omer-done-" + todayStr();
}

function practicesKey() {
  return "mitzvah-wheel-omer-practices-" + todayStr();
}

function loadOmerDone(): boolean {
  try { return localStorage.getItem(countedKey()) === "1"; } catch { return false; }
}

function saveOmerDone(v: boolean) {
  try { localStorage.setItem(countedKey(), v ? "1" : "0"); } catch { /* */ }
}

function loadSelectedPractices(): Set<number> {
  try {
    const raw = localStorage.getItem(practicesKey());
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as number[]);
  } catch { return new Set(); }
}

function saveSelectedPractices(s: Set<number>) {
  try { localStorage.setItem(practicesKey(), JSON.stringify([...s])); } catch { /* */ }
}

// ── Circular progress ring ────────────────────────────────────────────────────

function OmerRing({ day, color }: { day: number; color: string }) {
  const R = 52;
  const circ = 2 * Math.PI * R;
  const dash = (day / 49) * circ;

  return (
    <svg width="136" height="136" className="drop-shadow-lg flex-shrink-0">
      <circle cx="68" cy="68" r={R} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="10" />
      <circle
        cx="68" cy="68" r={R}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 68 68)"
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
      <text x="68" y="62" textAnchor="middle" dominantBaseline="middle"
        fontSize="26" fontWeight="800" fill={color}>
        {day}
      </text>
      <text x="68" y="80" textAnchor="middle" dominantBaseline="middle"
        fontSize="10" fill="rgba(0,0,0,0.5)" fontWeight="600" letterSpacing="1">
        OF 49
      </text>
    </svg>
  );
}

// ── Sefirah badge row ─────────────────────────────────────────────────────────

function SefirahBadge({ omer }: { omer: OmerInfo }) {
  const weekMeta = SEFIRAH_META[omer.weekSefirah];
  const dayMeta  = SEFIRAH_META[omer.daySefirah];
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
        Day {omer.day} — Week {omer.week}, Day {omer.dayOfWeek}
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${dayMeta.borderClass} ${dayMeta.textClass} ${dayMeta.bgClass}`}
        >
          {omer.daySefirah}
        </span>
        <span className="text-[10px] text-muted-foreground font-medium">within</span>
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${weekMeta.borderClass} ${weekMeta.textClass} ${weekMeta.bgClass}`}
        >
          {omer.weekSefirah}
        </span>
      </div>
      <p className={`text-base font-bold font-serif ${omer.textClass}`}>
        {omer.combinedName}
        <span className="ml-2 text-sm font-normal text-muted-foreground" dir="rtl" lang="he">
          {omer.combinedNameHebrew}
        </span>
      </p>
    </div>
  );
}

// ── Practice item — selectable checkbox row ───────────────────────────────────

function PracticeItem({
  text,
  selected,
  color,
  onToggle,
}: {
  text: string;
  selected: boolean;
  color: string;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      data-testid="omer-practice-item"
      className={`w-full text-left flex items-start gap-3 px-3 py-2.5 rounded-lg border transition-all text-sm leading-relaxed ${
        selected
          ? "bg-white/90 border-current shadow-sm"
          : "bg-white/40 border-white/50 hover:bg-white/70 hover:border-white/80"
      }`}
      style={selected ? { borderColor: color, color: "inherit" } : {}}
    >
      <span
        className="mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors"
        style={
          selected
            ? { backgroundColor: color, borderColor: color }
            : { backgroundColor: "white", borderColor: "#d1d5db" }
        }
      >
        {selected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </span>
      <span className={selected ? "text-foreground font-medium" : "text-muted-foreground"}>
        {text}
      </span>
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function OmerCounter() {
  const omer = useOmer();
  const [isDone, setIsDone]           = useState(loadOmerDone);
  const [showBracha, setShowBracha]   = useState(false);
  const [showPractices, setShowPractices] = useState(false);
  const [selected, setSelected]       = useState<Set<number>>(loadSelectedPractices);

  if (!omer) return null;

  function toggleDone() {
    const next = !isDone;
    setIsDone(next);
    saveOmerDone(next);
  }

  function togglePractice(idx: number) {
    const next = new Set(selected);
    next.has(idx) ? next.delete(idx) : next.add(idx);
    setSelected(next);
    saveSelectedPractices(next);
  }

  const selectedCount = selected.size;
  const totalCount    = omer.practices.length;

  return (
    <div className={`rounded-2xl ${omer.bgClass} border ${omer.borderClass} shadow-sm overflow-hidden`}>
      {/* Header */}
      <div
        className="px-4 py-2.5 flex items-center justify-between"
        style={{ backgroundColor: `${omer.color}22` }}
      >
        <p className={`text-xs font-bold uppercase tracking-widest ${omer.textClass}`}>
          Sefirat HaOmer
        </p>
        {omer.isLagBaOmer && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${omer.bgClass} ${omer.textClass} border ${omer.borderClass}`}>
            Lag BaOmer
          </span>
        )}
      </div>

      {/* Body */}
      <div className="px-4 py-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <OmerRing day={omer.day} color={omer.color} />

          <div className="flex-1 flex flex-col gap-3 w-full min-w-0">
            <SefirahBadge omer={omer} />

            {/* Count formula box */}
            <div className="rounded-lg border border-white/60 bg-white/80 px-4 py-3 text-center space-y-1">
              <p
                className="text-base font-bold text-foreground font-serif leading-relaxed"
                dir="rtl" lang="he"
              >
                {omer.hebrewCount}
              </p>
              <p className="text-[11px] text-muted-foreground italic font-serif">
                {omer.transliteration}
              </p>
              <p className="text-[11px] text-muted-foreground font-medium">
                {omer.englishCount}
              </p>
            </div>
          </div>
        </div>

        {/* Inspirational quote */}
        <div className="rounded-lg bg-white/75 border border-white/50 px-4 py-3 relative overflow-hidden">
          <div
            className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
            style={{ backgroundColor: omer.color }}
          />
          <p className="text-sm font-serif italic text-foreground leading-relaxed pl-2">
            "{omer.quote}"
          </p>
          <p className={`text-[10px] font-bold uppercase tracking-wider mt-1.5 pl-2 ${omer.textClass}`}>
            — {omer.quoteSource}
          </p>
        </div>

        {/* Bracha — collapsible */}
        <div>
          <button
            onClick={() => setShowBracha((v) => !v)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-bold uppercase tracking-wider transition-colors ${omer.borderClass} ${omer.textClass} bg-white/50 hover:bg-white/80`}
          >
            <span>Full Bracha (Hebrew &amp; English)</span>
            {showBracha ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showBracha && (
            <div className="mt-2 rounded-lg bg-white/90 border border-white/60 px-4 py-4 space-y-3">
              {/* Hebrew bracha */}
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Hebrew — recite after nightfall
                </p>
                <p
                  className="text-[17px] font-semibold text-foreground font-serif leading-loose text-right"
                  dir="rtl" lang="he"
                >
                  בָּרוּךְ אַתָּה יְיָ אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, אֲשֶׁר קִדְּשָׁנוּ בְּמִצְוֹתָיו וְצִוָּנוּ עַל סְפִירַת הָעֹמֶר.
                </p>
              </div>
              {/* Transliteration */}
              <div className="border-t pt-3">
                <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Transliteration
                </p>
                <p className="text-sm text-muted-foreground italic font-serif leading-relaxed">
                  Baruch Ata Adonai, Eloheinu Melech ha'olam, asher kid'shanu b'mitzvotav v'tzivanu al sefirat ha'omer.
                </p>
              </div>
              {/* English */}
              <div className="border-t pt-3">
                <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  English
                </p>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                  Blessed are You, Lord our God, King of the universe, who has sanctified us with His commandments and commanded us concerning the counting of the Omer.
                </p>
              </div>
              {/* Hebrew count after bracha */}
              <div className="border-t pt-3 text-right space-y-1" dir="rtl">
                <p className="text-base font-bold text-foreground font-serif" lang="he">
                  {omer.hebrewCount}
                </p>
                <p className="text-sm font-semibold font-serif" style={{ color: omer.color }}>
                  {omer.combinedNameHebrew} — {omer.combinedName}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Daily Practices — collapsible selectable list */}
        <div>
          <button
            onClick={() => setShowPractices((v) => !v)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-bold uppercase tracking-wider transition-colors ${omer.borderClass} ${omer.textClass} bg-white/50 hover:bg-white/80`}
            data-testid="omer-practices-toggle"
          >
            <span className="flex items-center gap-2">
              Today's Practice — {omer.combinedName}
              {selectedCount > 0 && (
                <span
                  className="inline-flex items-center justify-center w-4 h-4 rounded-full text-white text-[9px] font-black"
                  style={{ backgroundColor: omer.color }}
                >
                  {selectedCount}
                </span>
              )}
            </span>
            {showPractices ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showPractices && (
            <div className="mt-2 flex flex-col gap-2">
              <p className="text-[11px] text-muted-foreground px-1">
                Select one or more that resonate — or just read them as intention for the day.
              </p>
              {omer.practices.map((practice, i) => (
                <PracticeItem
                  key={i}
                  text={practice}
                  selected={selected.has(i)}
                  color={omer.color}
                  onToggle={() => togglePractice(i)}
                />
              ))}
              {selectedCount > 0 && (
                <p className="text-center text-[11px] mt-1 font-semibold" style={{ color: omer.color }}>
                  {selectedCount === totalCount
                    ? "All practices selected — you're all in."
                    : `${selectedCount} of ${totalCount} selected for today`}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Check-off */}
        <button
          onClick={toggleDone}
          data-testid="omer-count-done"
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border font-semibold text-sm transition-all ${
            isDone
              ? "bg-green-100 border-green-300 text-green-800"
              : `bg-white/70 ${omer.borderClass} ${omer.textClass} hover:bg-white`
          }`}
        >
          {isDone
            ? <><CheckCircle2 className="w-5 h-5 text-green-600" /> Counted — Day {omer.day} of the Omer</>
            : <><Circle className="w-5 h-5" /> Mark Omer as Counted Tonight</>
          }
        </button>

        {omer.daysRemaining > 0 && (
          <p className="text-center text-[10px] text-muted-foreground">
            {omer.daysRemaining} day{omer.daysRemaining !== 1 ? "s" : ""} until Shavuot
          </p>
        )}
        {omer.daysRemaining === 0 && (
          <p className="text-center text-[10px] font-bold" style={{ color: omer.color }}>
            Tonight — Chag Shavuot! Receive the Torah.
          </p>
        )}
      </div>
    </div>
  );
}

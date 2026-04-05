import { useState } from "react";
import { useOmer, SEFIRAH_META, type OmerInfo } from "@/hooks/use-omer";
import { CheckCircle2, Circle, ChevronDown, ChevronUp } from "lucide-react";

// ── Per-day check-off stored in localStorage ──────────────────────────────────

function todayKey() {
  return "mitzvah-wheel-omer-done-" + new Date().toISOString().slice(0, 10);
}

function loadOmerDone(): boolean {
  try { return localStorage.getItem(todayKey()) === "1"; } catch { return false; }
}

function saveOmerDone(v: boolean) {
  try { localStorage.setItem(todayKey(), v ? "1" : "0"); } catch { /* */ }
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
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeDashoffset={circ / 4}
        style={{ transition: "stroke-dasharray 1s ease" }}
      />
      <text x="68" y="63" textAnchor="middle" fontSize="34" fontWeight="800" fill={color} fontFamily="Georgia, serif">
        {day}
      </text>
      <text x="68" y="81" textAnchor="middle" fontSize="11" fontWeight="600" fill="#9CA3AF" fontFamily="sans-serif">
        of 49
      </text>
    </svg>
  );
}

// ── Sefirah badge row ─────────────────────────────────────────────────────────

function SefirahBadge({ omer }: { omer: OmerInfo }) {
  const weekMeta = SEFIRAH_META[omer.weekSefirah];
  const dayMeta  = SEFIRAH_META[omer.daySefirah];

  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <span
          className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white"
          style={{ backgroundColor: dayMeta.color }}
        >
          {omer.daySefirah} · {dayMeta.subtitle}
        </span>
        <span className="text-xs font-semibold text-muted-foreground">within</span>
        <span
          className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white"
          style={{ backgroundColor: weekMeta.color }}
        >
          {omer.weekSefirah} · {weekMeta.subtitle}
        </span>
      </div>
      <p className="text-xl font-bold mt-0.5" style={{ color: omer.color }}>
        {omer.combinedName}
      </p>
      <p className="text-base font-semibold text-muted-foreground font-serif" dir="rtl" lang="he">
        {omer.combinedNameHebrew}
      </p>
    </div>
  );
}

// ── Main OmerCounter ──────────────────────────────────────────────────────────

export function OmerCounter() {
  const omer = useOmer();
  const [isDone, setIsDone] = useState(loadOmerDone);
  const [showBracha, setShowBracha] = useState(false);
  const [showGrowth, setShowGrowth] = useState(true);

  if (!omer) return null;

  const toggleDone = () => {
    const next = !isDone;
    setIsDone(next);
    saveOmerDone(next);
  };

  const weekMeta = SEFIRAH_META[omer.weekSefirah];

  return (
    <div className={`flex-shrink-0 border-b ${omer.borderClass} overflow-hidden`}>
      {/* Color strip — week label */}
      <div
        className="w-full text-center text-[10px] font-bold tracking-[0.2em] uppercase py-1.5 text-white"
        style={{ backgroundColor: omer.color }}
      >
        Sefirat HaOmer &nbsp;·&nbsp; Week of {omer.weekSefirah} ({weekMeta.subtitle}) &nbsp;·&nbsp; {weekMeta.hebrew}
      </div>

      <div className={`${omer.bgClass} px-4 pt-4 pb-3`}>
        {/* Lag BaOmer callout */}
        {omer.isLagBaOmer && (
          <div className="mb-3 px-3 py-2 rounded-lg bg-amber-100 border border-amber-300 text-center">
            <p className="text-sm font-bold text-amber-800">Lag BaOmer — ל״ג בָּעֹמֶר</p>
            <p className="text-xs text-amber-700 mt-0.5">Yahrzeit of Rabbi Shimon bar Yochai · The Day of Hidden Light</p>
          </div>
        )}

        {/* Ring + Sefirah */}
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
        <div className="mt-3 rounded-lg bg-white/75 border border-white/50 px-4 py-3 relative overflow-hidden">
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
        <div className="mt-3">
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

        {/* Growth practice — collapsible */}
        <div className="mt-2">
          <button
            onClick={() => setShowGrowth((v) => !v)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-bold uppercase tracking-wider transition-colors ${omer.borderClass} ${omer.textClass} bg-white/50 hover:bg-white/80`}
          >
            <span>Today's Spiritual Work — {omer.combinedName}</span>
            {showGrowth ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showGrowth && (
            <div className={`mt-2 rounded-lg ${omer.bgClass} border ${omer.borderClass} px-4 py-3`}>
              <p className="text-sm text-foreground font-serif leading-relaxed">
                {omer.growth}
              </p>
            </div>
          )}
        </div>

        {/* Check-off */}
        <button
          onClick={toggleDone}
          data-testid="omer-count-done"
          className={`mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border font-semibold text-sm transition-all ${
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
          <p className="text-center text-[10px] text-muted-foreground mt-1.5">
            {omer.daysRemaining} day{omer.daysRemaining !== 1 ? "s" : ""} until Shavuot
          </p>
        )}
        {omer.daysRemaining === 0 && (
          <p className="text-center text-[10px] font-bold mt-1.5" style={{ color: omer.color }}>
            Tonight — Chag Shavuot! Receive the Torah.
          </p>
        )}
      </div>
    </div>
  );
}

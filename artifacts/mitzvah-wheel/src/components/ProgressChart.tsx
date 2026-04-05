import { useMemo, useState } from "react";
import { useMitzvahs, useCompletedMitzvahs, MITZVAH_SOURCES } from "@/hooks/use-mitzvahs";
import { useGroup, encodeProgress } from "@/hooks/use-group";
import { useHebrewDate } from "@/hooks/use-hebrew-date";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { CheckCircle2, TrendingUp, Award, Share2, Copy, Check, Users } from "lucide-react";

const PARSHA_ORDER = [
  "Noach", "Lech Lecha", "Vayishlach",
  "Bo", "Yitro", "Mishpatim", "Vayakhel",
  "Vayikra", "Acharei Mot", "Kedoshim", "Emor", "Behar",
  "Shelach", "Pinchas",
  "Vaetchanan", "Eikev", "Re'eh", "Shoftim", "Ki Tetzei", "Vayelech",
  "Tehillim / Hallel",
];

function isNegative(name: string) {
  return name.startsWith("Do not") || name.startsWith("Don't");
}

export function ProgressChart() {
  const { mitzvahs, isLoaded } = useMitzvahs();
  const { completed } = useCompletedMitzvahs();
  const { myName } = useGroup();
  const hdate = useHebrewDate();
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const positive = mitzvahs.filter((m) => !isNegative(m));
    const negative = mitzvahs.filter((m) => isNegative(m));
    const positiveDone = positive.filter((m) => completed.has(m)).length;
    const negativeDone = negative.filter((m) => completed.has(m)).length;
    const totalDone = completed.size;
    const pct = mitzvahs.length > 0 ? (totalDone / mitzvahs.length) * 100 : 0;

    const parshaMap: Record<string, { total: number; done: number }> = {};
    for (const [name, src] of Object.entries(MITZVAH_SOURCES)) {
      if (!mitzvahs.includes(name)) continue;
      const p = src.parsha;
      if (!parshaMap[p]) parshaMap[p] = { total: 0, done: 0 };
      parshaMap[p].total++;
      if (completed.has(name)) parshaMap[p].done++;
    }
    const parshaStats = PARSHA_ORDER.filter((p) => parshaMap[p]).map((p) => ({ parsha: p, ...parshaMap[p] }));

    const letterMap: Record<string, { total: number; done: number }> = {};
    for (const m of mitzvahs) {
      const key = m.replace(/^Do not |^Don't /, "");
      const letter = key[0]?.toUpperCase() ?? "#";
      if (!letterMap[letter]) letterMap[letter] = { total: 0, done: 0 };
      letterMap[letter].total++;
      if (completed.has(m)) letterMap[letter].done++;
    }
    const letterStats = Object.entries(letterMap)
      .map(([letter, v]) => ({ letter, ...v }))
      .sort((a, b) => b.done - a.done)
      .filter((l) => l.done > 0)
      .slice(0, 8);

    const topCompleted = [...completed].slice(0, 10);

    return { positive, negative, positiveDone, negativeDone, totalDone, pct, parshaStats, topCompleted, letterStats };
  }, [mitzvahs, completed]);

  const handleShare = () => {
    const name = myName || "Anonymous";
    const code = encodeProgress(name, stats.totalDone, mitzvahs.length);
    const text = [
      `Wheel of Mitzvot — ${hdate.formatted}`,
      `${name}: ${stats.totalDone}/${mitzvahs.length} mitzvot (${stats.pct.toFixed(1)}%)`,
      `${stats.positiveDone} positive mitzvot performed`,
      `${stats.negativeDone} negative commandments observed`,
      ``,
      `Share code: ${code}`,
    ].join("\n");

    if (navigator.share) {
      navigator.share({ title: "My Mitzvah Progress", text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!isLoaded) return (
    <div className="flex items-center justify-center h-full text-muted-foreground text-sm">Loading…</div>
  );

  const { totalDone, pct, positiveDone, negativeDone, positive, negative, parshaStats, topCompleted, letterStats } = stats;

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">

        {/* Hebrew date banner */}
        <div className="rounded-lg bg-secondary/50 border border-border px-3 py-2 flex items-center justify-between">
          <div>
            <p className={`text-xs font-bold ${hdate.isShabbat ? "text-purple-600" : "text-primary"}`}>
              {hdate.dayOfWeek}
            </p>
            <p className="text-sm font-semibold text-foreground">{hdate.formatted}</p>
            <p className="text-xs text-muted-foreground">{hdate.gregorianFormatted}</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 text-xs"
            onClick={handleShare}
          >
            {copied
              ? <><Check className="w-3.5 h-3.5 text-green-600" /> Copied!</>
              : navigator.share
                ? <><Share2 className="w-3.5 h-3.5" /> Share</>
                : <><Copy className="w-3.5 h-3.5" /> Copy Progress</>
            }
          </Button>
        </div>

        {/* Big summary */}
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <div className="text-5xl font-bold text-primary">{totalDone}</div>
          <div className="text-sm text-muted-foreground mt-1">of {mitzvahs.length} mitzvot completed</div>
          <div className="mt-3 h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-primary via-blue-400 to-green-400"
              style={{ width: `${Math.max(pct, totalDone > 0 ? 0.5 : 0)}%` }}
            />
          </div>
          <div className="text-xs text-muted-foreground mt-1">{pct.toFixed(1)}% of the 613</div>
          {myName && (
            <div className="mt-2 text-xs text-muted-foreground">
              Tracking as <span className="font-semibold text-primary">{myName}</span>
              {" · "}
              <button
                className="underline underline-offset-2 hover:text-foreground transition-colors"
                onClick={handleShare}
              >
                share with group
              </button>
            </div>
          )}
          {!myName && (
            <div className="mt-2 text-xs text-muted-foreground">
              Go to <span className="font-medium text-primary">Group</span> tab to set your name and share with friends
            </div>
          )}
        </div>

        {/* Positive vs Negative */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border bg-card p-3 text-center">
            <TrendingUp className="w-4 h-4 text-blue-500 mx-auto mb-1" />
            <div className="text-2xl font-bold text-blue-600">{positiveDone}</div>
            <div className="text-xs text-muted-foreground">of {positive.length}</div>
            <div className="text-xs font-medium text-foreground mt-0.5">Positive Mitzvot</div>
            <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${positive.length > 0 ? (positiveDone / positive.length) * 100 : 0}%` }}
              />
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-3 text-center">
            <Award className="w-4 h-4 text-amber-500 mx-auto mb-1" />
            <div className="text-2xl font-bold text-amber-600">{negativeDone}</div>
            <div className="text-xs text-muted-foreground">of {negative.length}</div>
            <div className="text-xs font-medium text-foreground mt-0.5">Negative Avoided</div>
            <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all"
                style={{ width: `${negative.length > 0 ? (negativeDone / negative.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* By Parsha */}
        {parshaStats.length > 0 && (
          <div className="rounded-lg border border-border bg-card p-3">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">By Parsha</h3>
            <div className="space-y-2">
              {parshaStats.map(({ parsha, total, done }) => (
                <div key={parsha}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-medium text-foreground">{parsha}</span>
                    <span className="text-xs text-muted-foreground">{done}/{total}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(done / total) * 100}%`,
                        background: done === total ? "#22c55e" : done > 0 ? "hsl(var(--primary))" : "transparent",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top letters */}
        {letterStats.length > 0 && (
          <div className="rounded-lg border border-border bg-card p-3">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">Most Completed (by letter)</h3>
            <div className="grid grid-cols-4 gap-2">
              {letterStats.map(({ letter, total, done }) => (
                <div key={letter} className="flex flex-col items-center bg-muted/40 rounded-lg p-2">
                  <span className="text-base font-bold text-primary">{letter}</span>
                  <span className="text-xs font-semibold text-green-600">{done}</span>
                  <span className="text-[10px] text-muted-foreground">/{total}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed list */}
        {topCompleted.length > 0 && (
          <div className="rounded-lg border border-border bg-card p-3">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Completed Mitzvot</h3>
            <div className="space-y-1">
              {topCompleted.map((m) => (
                <div key={m} className="flex items-center gap-2 py-1 border-b border-border/40 last:border-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                  <span className="text-xs text-foreground leading-snug">{m}</span>
                </div>
              ))}
              {completed.size > 10 && (
                <p className="text-xs text-muted-foreground pt-1">…and {completed.size - 10} more</p>
              )}
            </div>
          </div>
        )}

        {totalDone === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm font-serif italic">No mitzvot marked done yet.</p>
            <p className="text-xs mt-1">Spin the wheel or browse the list and mark mitzvot as done.</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

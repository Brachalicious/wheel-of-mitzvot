import { useState } from "react";
import { useDailyChecklist, DailyItem } from "@/hooks/use-daily-checklist";
import { useHebrewDate } from "@/hooks/use-hebrew-date";
import { useOmer } from "@/hooks/use-omer";
import { useShmiras } from "@/hooks/use-shmiras-halashon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, Circle, Plus, Trash2, RotateCcw, BookOpen, HandMetal, Heart, Coins, Star } from "lucide-react";

const CATEGORY_META: Record<DailyItem["category"], { label: string; color: string; Icon: React.ElementType }> = {
  prayer:    { label: "Prayer",    color: "text-blue-600",   Icon: Star },
  blessing:  { label: "Blessing",  color: "text-purple-600", Icon: BookOpen },
  learning:  { label: "Learning",  color: "text-amber-600",  Icon: BookOpen },
  physical:  { label: "Physical",  color: "text-green-600",  Icon: HandMetal },
  tzedakah:  { label: "Tzedakah", color: "text-rose-600",   Icon: Coins },
};

export function DailyChecklist() {
  const { items, done, toggle, addItem, removeItem, resetDay } = useDailyChecklist();
  const hdate = useHebrewDate();
  const omer = useOmer();
  const shl = useShmiras();
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  // Only include the Omer item when we are actually in the Omer period
  const visibleItems = items.filter((i) => {
    if (i.id === "count-omer") return omer !== null;
    return true;
  });

  const doneCount = visibleItems.filter((i) => done.has(i.id)).length;
  const total = visibleItems.length;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      addItem(newName.trim(), newDesc.trim() || "");
      setNewName("");
      setNewDesc("");
      setShowAdd(false);
    }
  };

  /** Returns the effective description for items whose content changes daily */
  function effectiveDescription(item: DailyItem): string {
    if (item.id === "shmiras-halashon") {
      return shl.description;
    }
    if (item.id === "count-omer" && omer) {
      return `${omer.hebrewFormula} — ${omer.englishSummary}. Recite after nightfall with a blessing.`;
    }
    return item.description;
  }

  /** Returns the effective name (e.g. add Omer day number to the item name) */
  function effectiveName(item: DailyItem): string {
    if (item.id === "count-omer" && omer) {
      return `Count the Omer — Day ${omer.day}${omer.isLagBaOmer ? " (Lag BaOmer!)" : ""}`;
    }
    if (item.id === "shmiras-halashon") {
      return shl.title;
    }
    return item.name;
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Day header with Hebrew date */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-border bg-secondary/40">
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-xs font-bold uppercase tracking-wider ${hdate.isShabbat ? "text-purple-600" : hdate.isErevShabbat ? "text-amber-600" : "text-primary"}`}>
              {hdate.dayOfWeek}
            </p>
            <p className="text-sm font-semibold text-foreground">{hdate.formatted}</p>
            <p className="text-xs text-muted-foreground">{hdate.gregorianFormatted}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-2xl font-bold text-primary">{doneCount}</span>
              <span className="text-sm text-muted-foreground">/{total}</span>
              <p className="text-xs text-muted-foreground">{pct}% complete</p>
            </div>
            <button
              onClick={resetDay}
              title="Reset today's checklist"
              className="text-muted-foreground hover:text-destructive transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              hdate.isShabbat
                ? "bg-gradient-to-r from-purple-400 to-purple-600"
                : "bg-gradient-to-r from-primary to-green-500"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Omer banner — only shown during the Omer period */}
      {omer && (
        <div
          className={`flex-shrink-0 px-4 py-3 border-b border-border flex items-center justify-between gap-3 cursor-pointer transition-colors ${
            done.has("count-omer")
              ? "bg-green-50 border-b-green-200"
              : omer.isLagBaOmer
                ? "bg-amber-50"
                : "bg-indigo-50"
          }`}
          onClick={() => toggle("count-omer")}
          data-testid="omer-banner"
        >
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${omer.isLagBaOmer ? "text-amber-700" : "text-indigo-700"}`}>
              {omer.isLagBaOmer ? "Lag BaOmer — Day 33" : `Sefirat HaOmer — Day ${omer.day} of 49`}
            </p>
            <p className="text-sm font-semibold text-foreground font-serif italic">
              {omer.hebrewFormula}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{omer.englishSummary} · Count after nightfall with a blessing</p>
          </div>
          <div className="flex-shrink-0">
            {done.has("count-omer")
              ? <CheckCircle2 className="w-6 h-6 text-green-600" />
              : <Circle className={`w-6 h-6 ${omer.isLagBaOmer ? "text-amber-400" : "text-indigo-400"}`} />
            }
          </div>
        </div>
      )}

      {/* Checklist items */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-3 space-y-1.5">
          {visibleItems.map((item) => {
            const isDone = done.has(item.id);
            const meta = CATEGORY_META[item.category];
            const name = effectiveName(item);
            const desc = effectiveDescription(item);
            const isOmerItem = item.id === "count-omer"; // rendered in banner above, skip here
            const isShl = item.id === "shmiras-halashon";

            if (isOmerItem) return null; // already shown in the banner above

            return (
              <div
                key={item.id}
                onClick={() => toggle(item.id)}
                className={`group flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  isDone
                    ? "bg-green-50 border-green-200"
                    : isShl
                      ? "bg-amber-50/60 border-amber-200 hover:border-amber-400"
                      : "bg-card border-border hover:border-primary/30 hover:bg-primary/3"
                }`}
                data-testid={`daily-item-${item.id}`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {isDone
                    ? <CheckCircle2 className="w-5 h-5 text-green-600" />
                    : <Circle className={`w-5 h-5 transition-colors ${isShl ? "text-amber-400 group-hover:text-amber-600" : "text-muted-foreground group-hover:text-primary"}`} />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-sm font-semibold leading-tight ${isDone ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {name}
                    </span>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-muted ${meta.color}`}>
                      {meta.label}
                    </span>
                    {isShl && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                        Chofetz Chaim
                      </span>
                    )}
                  </div>
                  {desc && (
                    <p className="text-xs text-muted-foreground mt-0.5 leading-snug font-serif">
                      {desc}
                    </p>
                  )}
                  {isShl && (
                    <p className="text-[10px] text-amber-600 mt-1 font-medium">
                      Sefer Chafetz Chaim / Sefer Shmirat HaLashon — Portion {shl.portionNumber} of 120
                    </p>
                  )}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                  className={`flex-shrink-0 mt-0.5 transition-opacity text-muted-foreground hover:text-destructive ${
                    item.isCustom ? "opacity-0 group-hover:opacity-100" : "opacity-0 group-hover:opacity-40"
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}

          {showAdd ? (
            <form onSubmit={handleAdd} className="p-3 border border-primary/30 rounded-lg bg-primary/5 space-y-2">
              <Input
                autoFocus
                placeholder="Mitzvah name (e.g. Count the Omer)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="h-8 text-sm"
              />
              <Input
                placeholder="Description (optional)"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="h-8 text-sm"
              />
              <div className="flex gap-2">
                <Button type="submit" size="sm" className="h-8 flex-1" disabled={!newName.trim()}>
                  Add
                </Button>
                <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => setShowAdd(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowAdd(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-muted-foreground/30 rounded-lg text-xs text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add a custom mitzvah to today's checklist
            </button>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

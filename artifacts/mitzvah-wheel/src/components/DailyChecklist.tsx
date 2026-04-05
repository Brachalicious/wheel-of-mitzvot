import { useState } from "react";
import { useDailyChecklist, DailyItem } from "@/hooks/use-daily-checklist";
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

function todayFormatted() {
  return new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function hebrewDay() {
  // Days of the week in Hebrew (Sunday=0)
  const days = ["Yom Rishon", "Yom Sheni", "Yom Shelishi", "Yom Revi'i", "Yom Chamishi", "Erev Shabbat", "Shabbat"];
  return days[new Date().getDay()];
}

export function DailyChecklist() {
  const { items, done, toggle, addItem, removeItem, resetDay } = useDailyChecklist();
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const doneCount = items.filter((i) => done.has(i.id)).length;
  const total = items.length;
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

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Day header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-border bg-secondary/40">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-wider">{hebrewDay()}</p>
            <p className="text-xs text-muted-foreground">{todayFormatted()}</p>
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
            className="h-full bg-gradient-to-r from-primary to-green-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Checklist items */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-3 space-y-1.5">
          {items.map((item) => {
            const isDone = done.has(item.id);
            const meta = CATEGORY_META[item.category];
            return (
              <div
                key={item.id}
                onClick={() => toggle(item.id)}
                className={`group flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  isDone
                    ? "bg-green-50 border-green-200"
                    : "bg-card border-border hover:border-primary/30 hover:bg-primary/3"
                }`}
                data-testid={`daily-item-${item.id}`}
              >
                {/* Checkbox */}
                <div className="flex-shrink-0 mt-0.5">
                  {isDone
                    ? <CheckCircle2 className="w-5 h-5 text-green-600" />
                    : <Circle className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  }
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold leading-tight ${isDone ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {item.name}
                    </span>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-muted ${meta.color}`}>
                      {meta.label}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 leading-snug font-serif">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Remove button (custom items only on hover) */}
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

          {/* Add custom item */}
          {showAdd ? (
            <form onSubmit={handleAdd} className="p-3 border border-primary/30 rounded-lg bg-primary/5 space-y-2">
              <Input
                autoFocus
                placeholder="Mitzvah name (e.g. Omer count)"
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
              Add a custom mitzvah
            </button>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

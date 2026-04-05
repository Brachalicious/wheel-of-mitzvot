import { useState, useCallback, useMemo } from "react";
import { useMitzvahs, MITZVAH_EXAMPLES } from "@/hooks/use-mitzvahs";
import { Wheel } from "@/components/Wheel";
import { Confetti } from "@/components/Confetti";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Plus, RotateCcw, Star, Shuffle } from "lucide-react";

const WHEEL_SLOT_COUNT = 48;

function pickRandom(arr: string[], n: number): string[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(n, arr.length));
}

interface SelectedMitzvah {
  name: string;
  example: string | null;
}

export default function Home() {
  const { mitzvahs, isLoaded, addMitzvah, removeMitzvah, resetToDefaults } = useMitzvahs();
  const [spinning, setSpinning] = useState(false);
  const [selected, setSelected] = useState<SelectedMitzvah | null>(null);
  const [newMitzvah, setNewMitzvah] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [wheelItems, setWheelItems] = useState<string[] | null>(null);

  const selectMitzvah = (name: string, withConfetti = false) => {
    setSelected({ name, example: MITZVAH_EXAMPLES[name] ?? null });
    if (withConfetti) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  };

  const handleSpin = () => {
    if (spinning || mitzvahs.length === 0) return;
    setSelected(null);
    setShowConfetti(false);
    setWheelItems(pickRandom(mitzvahs, WHEEL_SLOT_COUNT));
    setSpinning(true);
  };

  const handleSpinComplete = useCallback((winner: string) => {
    selectMitzvah(winner, true);
  }, []);

  const handleChoose = (name: string) => {
    if (spinning) return;
    setSelected(null);
    setShowConfetti(false);
    setTimeout(() => selectMitzvah(name, true), 80);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMitzvah.trim()) {
      addMitzvah(newMitzvah);
      setNewMitzvah("");
    }
  };

  // Group mitzvahs alphabetically
  const grouped = useMemo(() => {
    const sorted = [...mitzvahs].sort((a, b) =>
      a.replace(/^Do not |^Don't /, "").localeCompare(b.replace(/^Do not |^Don't /, ""))
    );
    const map: Record<string, string[]> = {};
    for (const m of sorted) {
      const firstWord = m.replace(/^Do not |^Don't /, "");
      const letter = firstWord[0]?.toUpperCase() ?? "#";
      if (!map[letter]) map[letter] = [];
      map[letter].push(m);
    }
    return map;
  }, [mitzvahs]);

  const letters = Object.keys(grouped).sort();

  if (!isLoaded) return (
    <div className="h-screen flex items-center justify-center">Loading...</div>
  );

  const displayItems = wheelItems ?? pickRandom(mitzvahs, WHEEL_SLOT_COUNT);

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-background">
      <Confetti active={showConfetti} />

      {/* Compact Header */}
      <header className="flex-shrink-0 py-3 px-6 text-center bg-secondary shadow-md flex items-center justify-center gap-3">
        <Star className="w-6 h-6 text-primary fill-primary flex-shrink-0" />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary leading-tight">
            Mitzvah Wheel
          </h1>
          <p className="text-xs md:text-sm text-secondary-foreground/80 font-serif">
            All 613 mitzvot — spin the wheel or choose from the list
          </p>
        </div>
        <Star className="w-6 h-6 text-primary fill-primary flex-shrink-0" />
      </header>

      {/* Main layout — never overflows */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-0">

        {/* LEFT: Wheel + Spin + Result */}
        <div className="flex flex-col items-center justify-start p-4 gap-3 min-h-0 overflow-hidden border-r border-border">

          {/* Wheel — fills available height */}
          <div
            className="flex-shrink-0 w-full"
            style={{ maxWidth: 'min(100%, calc(100vh - 200px))', maxHeight: 'calc(100vh - 240px)' }}
          >
            <Wheel
              items={displayItems}
              spinning={spinning}
              setSpinning={setSpinning}
              onSpinComplete={handleSpinComplete}
            />
          </div>

          {/* Spin Button */}
          <Button
            size="lg"
            className="flex-shrink-0 w-full max-w-[280px] h-12 text-lg font-bold rounded-full shadow-lg hover:brightness-110 transition-all"
            onClick={handleSpin}
            disabled={spinning || mitzvahs.length === 0}
            data-testid="spin-button"
          >
            <Shuffle className="w-5 h-5 mr-2" />
            SPIN THE WHEEL
          </Button>

          {/* Result Card */}
          {selected && (
            <div className="flex-shrink-0 w-full max-w-lg animate-in fade-in slide-in-from-bottom-2 duration-500">
              <Card className="border-2 border-primary shadow-md bg-card overflow-hidden">
                <div className="bg-primary/10 py-1.5 text-center border-b border-primary/20">
                  <span className="text-xs font-bold text-primary tracking-widest uppercase">Your Mitzvah</span>
                </div>
                <CardContent className="pt-4 pb-5 text-center relative px-6">
                  <h2
                    className="text-lg md:text-xl font-bold text-foreground leading-snug"
                    data-testid="result-display"
                  >
                    {selected.name}
                  </h2>
                  {selected.example && (
                    <div className="mt-3 px-3 py-3 bg-primary/5 border border-primary/15 rounded-xl text-left">
                      <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">How to do it today</p>
                      <p className="text-sm text-foreground leading-relaxed font-serif italic">
                        {selected.example}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* RIGHT: Alphabetical collapsible list */}
        <div className="flex flex-col min-h-0 overflow-hidden">

          {/* Add input */}
          <div className="flex-shrink-0 p-4 border-b border-border bg-muted/30">
            <form onSubmit={handleAdd} className="flex gap-2">
              <Input
                placeholder="Add your own mitzvah..."
                value={newMitzvah}
                onChange={(e) => setNewMitzvah(e.target.value)}
                className="flex-1 h-9 text-sm"
                data-testid="mitzvah-input"
              />
              <Button type="submit" className="h-9 px-4 text-sm" disabled={!newMitzvah.trim() || spinning} data-testid="add-mitzvah-button">
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9 flex-shrink-0" onClick={resetToDefaults} disabled={spinning} data-testid="reset-defaults-button" title="Reset to all 613">
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-1.5">
              {mitzvahs.length} mitzvot in pool — click any to select it
            </p>
          </div>

          {/* Scrollable accordion */}
          <ScrollArea className="flex-1" data-testid="mitzvah-list">
            <div className="p-3">
              <Accordion type="multiple" className="w-full space-y-1">
                {letters.map((letter) => (
                  <AccordionItem
                    key={letter}
                    value={letter}
                    className="border border-border rounded-lg overflow-hidden"
                  >
                    <AccordionTrigger className="px-4 py-2.5 hover:no-underline hover:bg-primary/5 text-sm font-bold text-primary">
                      <span className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          {letter}
                        </span>
                        <span className="text-muted-foreground font-normal text-xs">
                          {grouped[letter].length} mitzvot
                        </span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-0">
                      <div className="divide-y divide-border/50">
                        {grouped[letter].map((m, idx) => {
                          const originalIdx = mitzvahs.indexOf(m);
                          const isActive = selected?.name === m;
                          return (
                            <div
                              key={`${letter}-${idx}`}
                              className={`group flex items-center justify-between px-4 py-2 cursor-pointer transition-colors ${
                                isActive ? 'bg-primary/10' : 'hover:bg-muted/60'
                              }`}
                              onClick={() => handleChoose(m)}
                              data-testid={`mitzvah-item-${originalIdx}`}
                            >
                              <span className={`text-xs leading-snug flex-1 pr-2 ${isActive ? 'font-semibold text-primary' : 'text-foreground'}`}>
                                {isActive && <Star className="w-2.5 h-2.5 inline mr-1 fill-primary text-primary" />}
                                {m}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => { e.stopPropagation(); if (originalIdx >= 0) removeMitzvah(originalIdx); }}
                                disabled={spinning}
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

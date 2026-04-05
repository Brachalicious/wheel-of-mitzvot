import { useState, useCallback } from "react";
import { useMitzvahs, MITZVAH_EXAMPLES } from "@/hooks/use-mitzvahs";
import { Wheel } from "@/components/Wheel";
import { Confetti } from "@/components/Confetti";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Plus, RotateCcw, Star, Shuffle, Hand } from "lucide-react";

const WHEEL_SLOT_COUNT = 12;

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
    setSelected({
      name,
      example: MITZVAH_EXAMPLES[name] ?? null,
    });
    if (withConfetti) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  };

  const handleSpin = () => {
    if (spinning || mitzvahs.length === 0) return;
    setSelected(null);
    setShowConfetti(false);
    const selection = pickRandom(mitzvahs, WHEEL_SLOT_COUNT);
    setWheelItems(selection);
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

  if (!isLoaded) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const displayItems = wheelItems ?? pickRandom(mitzvahs, WHEEL_SLOT_COUNT);

  return (
    <div className="min-h-screen pb-12 flex flex-col">
      <Confetti active={showConfetti} />

      {/* Header */}
      <header className="w-full py-8 text-center bg-secondary text-secondary-foreground shadow-md">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary flex items-center justify-center gap-4">
            <Star className="w-8 h-8 md:w-10 md:h-10 fill-primary" />
            Mitzvah Wheel
            <Star className="w-8 h-8 md:w-10 md:h-10 fill-primary" />
          </h1>
          <p className="mt-3 text-lg md:text-xl font-medium max-w-2xl mx-auto px-4 opacity-90 font-serif">
            Spin the wheel, choose your mitzvah, and bring light to the world.
          </p>
        </div>
      </header>

      <main className="flex-1 container max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

        {/* Left Column: Wheel + Result */}
        <div className="lg:col-span-7 flex flex-col items-center justify-start space-y-6">

          <div className="bg-white/50 p-4 rounded-[2rem] shadow-2xl border border-white/60 w-full backdrop-blur-sm">
            <Wheel
              items={displayItems}
              spinning={spinning}
              setSpinning={setSpinning}
              onSpinComplete={handleSpinComplete}
            />
          </div>

          <Button
            size="lg"
            className="w-full max-w-[300px] h-16 text-2xl font-bold rounded-full shadow-[0_8px_0_hsl(var(--primary-foreground)),0_15px_20px_rgba(0,0,0,0.3)] transition-all active:translate-y-[8px] active:shadow-[0_0px_0_hsl(var(--primary-foreground)),0_5px_10px_rgba(0,0,0,0.3)] hover:brightness-110"
            onClick={handleSpin}
            disabled={spinning || mitzvahs.length === 0}
            data-testid="spin-button"
          >
            <Shuffle className="w-6 h-6 mr-2" />
            SPIN THE WHEEL
          </Button>

          <p className="text-sm text-muted-foreground text-center max-w-[400px]">
            Each spin randomly selects {WHEEL_SLOT_COUNT} from your {mitzvahs.length} mitzvot.
            Or choose one directly from the list.
          </p>

          {/* Result / Example Card */}
          <div
            className={`w-full max-w-[500px] transition-all duration-700 transform ${
              selected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
          >
            <Card className="border-2 border-primary shadow-lg bg-card overflow-hidden">
              <div className="bg-primary/10 py-2 text-center border-b border-primary/20">
                <span className="text-sm font-bold text-primary tracking-widest uppercase">Your Mitzvah</span>
              </div>
              <CardContent className="pt-6 pb-8 text-center relative">
                <div className="absolute top-4 left-4 text-4xl text-primary/20 font-serif leading-none">"</div>
                <div className="absolute bottom-4 right-4 text-4xl text-primary/20 font-serif leading-none">"</div>

                <h2
                  className="text-2xl md:text-3xl font-bold text-foreground leading-tight px-6 mb-4"
                  data-testid="result-display"
                >
                  {selected?.name}
                </h2>

                {selected?.example && (
                  <div className="mt-4 mx-2 px-4 py-4 bg-primary/5 border border-primary/15 rounded-xl text-left">
                    <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">How to do it today</p>
                    <p className="text-sm md:text-base text-foreground leading-relaxed font-serif italic">
                      {selected.example}
                    </p>
                  </div>
                )}

                {selected && !selected.example && (
                  <p className="text-sm text-muted-foreground mt-4 italic px-6">
                    You added this mitzvah. Find a meaningful way to make it part of your day.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column: Full Mitzvah List */}
        <div className="lg:col-span-5">
          <Card className="shadow-lg border-muted h-full flex flex-col" style={{ maxHeight: '820px' }}>
            <CardHeader className="bg-muted/50 border-b border-border pb-5">
              <CardTitle className="text-2xl font-serif text-secondary">Mitzvah List</CardTitle>
              <CardDescription className="text-base">
                {mitzvahs.length} mitzvot in your pool — click any to select it, or spin for a surprise.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0 flex-1 flex flex-col min-h-0">
              {/* Add new */}
              <div className="p-5 border-b border-border bg-white">
                <form onSubmit={handleAdd} className="flex gap-2">
                  <Input
                    placeholder="Add your own mitzvah..."
                    value={newMitzvah}
                    onChange={(e) => setNewMitzvah(e.target.value)}
                    className="flex-1 text-base h-11"
                    data-testid="mitzvah-input"
                  />
                  <Button
                    type="submit"
                    className="h-11 px-5 font-semibold"
                    disabled={!newMitzvah.trim() || spinning}
                    data-testid="add-mitzvah-button"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </form>
              </div>

              {/* Scrollable list */}
              <ScrollArea className="flex-1 px-3 py-2" data-testid="mitzvah-list">
                <div className="space-y-1 py-1">
                  {mitzvahs.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground italic">
                      No mitzvot in the list. Add one or reset to defaults.
                    </div>
                  ) : (
                    mitzvahs.map((m, i) => {
                      const isActive = selected?.name === m;
                      return (
                        <div
                          key={`${i}-${m}`}
                          className={`group flex items-center justify-between py-2.5 px-3 rounded-xl border transition-all cursor-pointer ${
                            isActive
                              ? 'border-primary bg-primary/10 shadow-sm'
                              : 'border-transparent hover:border-primary/25 hover:bg-primary/5'
                          }`}
                          onClick={() => handleChoose(m)}
                          data-testid={`mitzvah-item-${i}`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {isActive ? (
                              <Star className="w-3.5 h-3.5 text-primary fill-primary flex-shrink-0" />
                            ) : (
                              <Hand className="w-3.5 h-3.5 text-muted-foreground/40 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                            <span className={`text-sm font-medium leading-snug truncate ${isActive ? 'text-primary' : 'text-foreground'}`}>
                              {m}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => { e.stopPropagation(); removeMitzvah(i); }}
                            disabled={spinning}
                            className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-1"
                            title="Remove mitzvah"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      );
                    })
                  )}
                </div>
              </ScrollArea>

              {/* Reset */}
              <div className="p-4 border-t border-border bg-muted/30">
                <Button
                  variant="outline"
                  className="w-full text-secondary hover:text-secondary-foreground hover:bg-secondary transition-colors"
                  onClick={resetToDefaults}
                  disabled={spinning}
                  data-testid="reset-defaults-button"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset to Default List
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

      </main>
    </div>
  );
}

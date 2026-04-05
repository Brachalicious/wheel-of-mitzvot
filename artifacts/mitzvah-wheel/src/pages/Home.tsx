import { useState } from "react";
import { useMitzvahs } from "@/hooks/use-mitzvahs";
import { Wheel } from "@/components/Wheel";
import { Confetti } from "@/components/Confetti";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Plus, RotateCcw, Star } from "lucide-react";

export default function Home() {
  const { mitzvahs, isLoaded, addMitzvah, removeMitzvah, resetToDefaults } = useMitzvahs();
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [newMitzvah, setNewMitzvah] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  const handleSpin = () => {
    if (spinning || mitzvahs.length === 0) return;
    setResult(null);
    setShowConfetti(false);
    setSpinning(true);
  };

  const handleSpinComplete = (winner: string) => {
    setResult(winner);
    setShowConfetti(true);
    
    // Hide confetti after a few seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 4000);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMitzvah.trim()) {
      addMitzvah(newMitzvah);
      setNewMitzvah("");
    }
  };

  if (!isLoaded) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen pb-12 flex flex-col">
      <Confetti active={showConfetti} />
      
      {/* Header */}
      <header className="w-full py-8 text-center bg-secondary text-secondary-foreground shadow-md relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10 flex justify-center items-center pointer-events-none">
           <svg width="200" height="200" viewBox="0 0 100 100" className="star-of-david text-white fill-current"></svg>
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary flex items-center justify-center gap-4">
            <Star className="w-8 h-8 md:w-10 md:h-10 fill-primary" />
            Mitzvah Wheel
            <Star className="w-8 h-8 md:w-10 md:h-10 fill-primary" />
          </h1>
          <p className="mt-3 text-lg md:text-xl font-medium max-w-2xl mx-auto px-4 opacity-90 font-serif">
            Spin the wheel, discover a good deed, and bring light to the world.
          </p>
        </div>
      </header>

      <main className="flex-1 container max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column: The Wheel */}
        <div className="lg:col-span-7 flex flex-col items-center justify-start space-y-8">
          
          <div className="bg-white/50 p-6 md:p-8 rounded-[2rem] shadow-xl border border-primary/20 w-full max-w-[500px] backdrop-blur-sm">
            <Wheel 
              items={mitzvahs} 
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
            SPIN THE WHEEL
          </Button>

          {/* Result Display */}
          <div 
            className={`w-full max-w-[500px] transition-all duration-700 transform ${
              result ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
          >
            <Card className="border-2 border-primary shadow-lg bg-card overflow-hidden">
              <div className="bg-primary/10 py-2 text-center border-b border-primary/20">
                <span className="text-sm font-bold text-primary tracking-widest uppercase">Your Mitzvah</span>
              </div>
              <CardContent className="pt-8 pb-10 text-center relative">
                {/* Decorative quotes */}
                <div className="absolute top-4 left-4 text-4xl text-primary/20 font-serif">"</div>
                <div className="absolute bottom-4 right-4 text-4xl text-primary/20 font-serif">"</div>
                
                <h2 
                  className="text-3xl md:text-4xl font-bold text-foreground leading-tight px-6"
                  data-testid="result-display"
                >
                  {result}
                </h2>
              </CardContent>
            </Card>
          </div>

        </div>

        {/* Right Column: Editor */}
        <div className="lg:col-span-5">
          <Card className="shadow-lg border-muted h-full flex flex-col max-h-[800px]">
            <CardHeader className="bg-muted/50 border-b border-border pb-6">
              <CardTitle className="text-2xl font-serif text-secondary">Customize Mitzvahs</CardTitle>
              <CardDescription className="text-base">
                Add your own meaningful actions to the wheel.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-0 flex-1 flex flex-col min-h-0">
              <div className="p-6 border-b border-border bg-white">
                <form onSubmit={handleAdd} className="flex gap-2">
                  <Input
                    placeholder="Enter a new mitzvah..."
                    value={newMitzvah}
                    onChange={(e) => setNewMitzvah(e.target.value)}
                    className="flex-1 text-base h-11"
                    data-testid="mitzvah-input"
                  />
                  <Button 
                    type="submit" 
                    className="h-11 px-6 font-semibold"
                    disabled={!newMitzvah.trim() || spinning}
                    data-testid="add-mitzvah-button"
                  >
                    <Plus className="w-5 h-5 mr-1" /> Add
                  </Button>
                </form>
              </div>

              <ScrollArea className="flex-1 p-6" data-testid="mitzvah-list">
                <div className="space-y-3">
                  {mitzvahs.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground italic">
                      No mitzvahs in the list. Add one or reset to defaults.
                    </div>
                  ) : (
                    mitzvahs.map((m, i) => (
                      <div 
                        key={`${i}-${m}`} 
                        className="group flex items-center justify-between p-3 md:p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors"
                      >
                        <span className="font-medium text-foreground pr-4">{m}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeMitzvah(i)}
                          disabled={spinning}
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity flex-shrink-0"
                          title="Remove mitzvah"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>

              <div className="p-6 border-t border-border bg-muted/30">
                <Button 
                  variant="outline" 
                  className="w-full text-secondary hover:text-secondary-foreground hover:bg-secondary transition-colors"
                  onClick={resetToDefaults}
                  disabled={spinning}
                  data-testid="reset-defaults-button"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Restore Default List
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

      </main>
    </div>
  );
}

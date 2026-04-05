import { useState } from "react";
import { useGroup, encodeProgress, decodeProgress } from "@/hooks/use-group";
import { useCompletedMitzvahs } from "@/hooks/use-mitzvahs";
import { useMitzvahs } from "@/hooks/use-mitzvahs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy, Copy, Check, Users, Trash2, UserPlus, Share2, Medal } from "lucide-react";

function medal(rank: number) {
  if (rank === 1) return <Medal className="w-4 h-4 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-4 h-4 text-slate-400" />;
  if (rank === 3) return <Medal className="w-4 h-4 text-amber-700" />;
  return <span className="w-4 h-4 flex items-center justify-center text-xs text-muted-foreground font-bold">{rank}</span>;
}

export function GroupTab() {
  const { mitzvahs } = useMitzvahs();
  const { completed } = useCompletedMitzvahs();
  const { myName, setMyName, members, addMember, removeMember, clearGroup } = useGroup();

  const [nameInput, setNameInput] = useState(myName);
  const [codeInput, setCodeInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState("");

  const myCompleted = completed.size;
  const myTotal = mitzvahs.length;
  const myCode = myName.trim()
    ? encodeProgress(myName.trim(), myCompleted, myTotal)
    : null;

  const handleSaveName = () => {
    const trimmed = nameInput.trim();
    if (trimmed) setMyName(trimmed);
  };

  const handleCopyCode = () => {
    if (!myCode) return;
    const shareText = `Wheel of Mitzvot — ${myName}: ${myCompleted}/${myTotal} mitzvot completed\nCode: ${myCode}`;
    if (navigator.share) {
      navigator.share({ title: "My Mitzvah Progress", text: shareText }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleImport = () => {
    setImportError("");
    setImportSuccess("");
    const member = decodeProgress(codeInput.trim());
    if (!member) {
      setImportError("Invalid code — make sure you copied it exactly.");
      return;
    }
    if (member.name === myName) {
      setImportError("That's your own code!");
      return;
    }
    addMember(member);
    setCodeInput("");
    setImportSuccess(`Added ${member.name} to your group!`);
    setTimeout(() => setImportSuccess(""), 3000);
  };

  // Build leaderboard: me + all members, sorted by completed desc
  const leaderboard = [
    { id: "me", name: myName || "You", completed: myCompleted, total: myTotal, date: new Date().toISOString().slice(0, 10), isMe: true },
    ...members,
  ].sort((a, b) => b.completed - a.completed || b.total - a.total);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-2 mb-1">
          <Users className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-bold text-foreground">Group Challenge</h2>
        </div>
        <p className="text-xs text-muted-foreground font-serif">
          Share your progress code with friends. Paste theirs to build a leaderboard.
        </p>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 space-y-4">

          {/* Set your name */}
          <div className="rounded-lg border border-border bg-card p-3">
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Your Name</p>
            <div className="flex gap-2">
              <Input
                placeholder="Enter your name…"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="h-8 text-sm flex-1"
                onKeyDown={(e) => { if (e.key === "Enter") handleSaveName(); }}
              />
              <Button size="sm" className="h-8" onClick={handleSaveName} disabled={!nameInput.trim()}>
                Save
              </Button>
            </div>
          </div>

          {/* Your progress code */}
          {myName ? (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
              <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Your Progress Code</p>
              <p className="text-xs text-muted-foreground mb-2 font-serif">
                Share this with your group — they paste it to add you to their leaderboard.
              </p>
              <div className="flex items-center gap-2 bg-background border border-border rounded px-2 py-1.5 mb-2">
                <code className="text-[10px] text-foreground flex-1 break-all leading-relaxed select-all">
                  {myCode}
                </code>
              </div>
              <Button
                size="sm"
                className="h-8 w-full"
                onClick={handleCopyCode}
                variant={copied ? "outline" : "default"}
              >
                {copied
                  ? <><Check className="w-3.5 h-3.5 mr-1.5 text-green-600" /> Copied!</>
                  : navigator.share
                    ? <><Share2 className="w-3.5 h-3.5 mr-1.5" /> Share My Progress</>
                    : <><Copy className="w-3.5 h-3.5 mr-1.5" /> Copy Code</>
                }
              </Button>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-muted-foreground/30 p-4 text-center">
              <p className="text-xs text-muted-foreground font-serif italic">Set your name above to generate your shareable code.</p>
            </div>
          )}

          {/* Add a friend */}
          <div className="rounded-lg border border-border bg-card p-3">
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
              <UserPlus className="w-3.5 h-3.5 inline mr-1" />
              Add a Friend
            </p>
            <div className="flex gap-2 mb-1">
              <Input
                placeholder="Paste friend's code here…"
                value={codeInput}
                onChange={(e) => { setCodeInput(e.target.value); setImportError(""); setImportSuccess(""); }}
                className="h-8 text-sm flex-1 font-mono text-xs"
              />
              <Button size="sm" className="h-8" onClick={handleImport} disabled={!codeInput.trim()}>
                Add
              </Button>
            </div>
            {importError && <p className="text-xs text-destructive mt-1">{importError}</p>}
            {importSuccess && <p className="text-xs text-green-600 font-medium mt-1">{importSuccess}</p>}
          </div>

          {/* Leaderboard */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
              <div className="flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-yellow-500" />
                <span className="text-xs font-bold text-foreground uppercase tracking-wider">Leaderboard</span>
              </div>
              {members.length > 0 && (
                <button
                  onClick={clearGroup}
                  className="text-[10px] text-muted-foreground hover:text-destructive transition-colors"
                >
                  Clear friends
                </button>
              )}
            </div>

            {leaderboard.length === 0 || (leaderboard.length === 1 && !myName) ? (
              <div className="py-8 text-center text-muted-foreground">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs font-serif italic">No group members yet.</p>
                <p className="text-xs mt-1">Set your name and share your code to start competing.</p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {leaderboard.map((member, i) => {
                  const rank = i + 1;
                  const pct = member.total > 0 ? (member.completed / member.total) * 100 : 0;
                  return (
                    <div
                      key={member.id}
                      className={`flex items-center gap-3 px-3 py-2.5 ${member.isMe ? "bg-primary/5" : ""}`}
                    >
                      <div className="flex-shrink-0">{medal(rank)}</div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-sm font-semibold truncate ${member.isMe ? "text-primary" : "text-foreground"}`}>
                            {member.name}
                          </span>
                          {member.isMe && (
                            <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">you</span>
                          )}
                        </div>
                        <div className="mt-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${member.isMe ? "bg-primary" : "bg-amber-400"}`}
                            style={{ width: `${Math.max(pct, member.completed > 0 ? 1 : 0)}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex-shrink-0 text-right">
                        <div className="text-sm font-bold text-foreground">{member.completed}</div>
                        <div className="text-[10px] text-muted-foreground">mitzvot</div>
                      </div>

                      {!member.isMe && (
                        <button
                          onClick={() => removeMember(member.id)}
                          className="flex-shrink-0 opacity-0 hover:opacity-100 text-muted-foreground hover:text-destructive transition-all group-hover:opacity-100"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <p className="text-[10px] text-muted-foreground text-center font-serif italic">
            All data stays on your device. Codes are just your progress snapshot — no account needed.
          </p>
        </div>
      </ScrollArea>
    </div>
  );
}

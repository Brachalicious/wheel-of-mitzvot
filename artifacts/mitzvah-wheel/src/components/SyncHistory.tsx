import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, SkipForward, RefreshCw, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SyncEntry {
  timestamp: string;
  status: "success" | "failure" | "skipped";
  message: string;
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatAbsolute(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STATUS_CONFIG = {
  success: {
    icon: CheckCircle2,
    label: "Success",
    color: "text-green-600",
    bg: "bg-green-50 border-green-200",
    dot: "bg-green-500",
  },
  failure: {
    icon: XCircle,
    label: "Failed",
    color: "text-red-600",
    bg: "bg-red-50 border-red-200",
    dot: "bg-red-500",
  },
  skipped: {
    icon: SkipForward,
    label: "Skipped",
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
    dot: "bg-amber-400",
  },
};

export function SyncHistory() {
  const [entries, setEntries] = useState<SyncEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setTick] = useState(0);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}api/sync-history`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { entries: SyncEntry[] };
      setEntries(data.entries);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchHistory();
    const interval = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(interval);
  }, []);

  const successCount = entries.filter((e) => e.status === "success").length;
  const failureCount = entries.filter((e) => e.status === "failure").length;

  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Github className="w-3.5 h-3.5 text-primary" />
          <h3 className="text-xs font-bold text-primary uppercase tracking-wider">GitHub Sync History</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => void fetchHistory()}
          disabled={loading}
          title="Refresh"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {error && (
        <p className="text-xs text-red-500 py-2">{error}</p>
      )}

      {!error && entries.length === 0 && !loading && (
        <p className="text-xs text-muted-foreground py-2 text-center font-serif italic">
          No sync runs recorded yet. Runs are logged after each merge.
        </p>
      )}

      {entries.length > 0 && (
        <>
          {/* Summary pills */}
          <div className="flex gap-2 mb-3">
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
              {successCount} succeeded
            </span>
            {failureCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                {failureCount} failed
              </span>
            )}
          </div>

          {/* Entry list */}
          <div className="space-y-1.5">
            {entries.map((entry, i) => {
              const cfg = STATUS_CONFIG[entry.status];
              const Icon = cfg.icon;
              return (
                <div
                  key={i}
                  className={`flex items-start gap-2 rounded-md border px-2.5 py-1.5 ${cfg.bg}`}
                >
                  <Icon className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${cfg.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wide ${cfg.color}`}>
                        {cfg.label}
                      </span>
                      <span
                        className="text-[10px] text-muted-foreground flex-shrink-0"
                        title={formatAbsolute(entry.timestamp)}
                      >
                        {formatRelative(entry.timestamp)}
                      </span>
                    </div>
                    <p className="text-[11px] text-foreground/80 leading-snug mt-0.5 truncate">
                      {entry.message}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

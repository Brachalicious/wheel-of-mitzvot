import { useState, useMemo } from "react";
import { ChevronRight, ChevronLeft, BookOpen, ExternalLink, Search, X } from "lucide-react";
import { getSiddurText, stripHtml } from "@/data/siddur";
import { useSiddur } from "@/hooks/use-siddur";
import raw from "@/data/siddur-ashkenaz.json";

// ── Types ─────────────────────────────────────────────────────────────────────

type SiddurNode = string[] | Record<string, SiddurNode>;
const SIDDUR = raw.text as Record<string, SiddurNode>;

// Walk the tree by path array
function getNode(path: string[]): SiddurNode | null {
  let node: SiddurNode = SIDDUR;
  for (const key of path) {
    if (Array.isArray(node) || !node[key]) return null;
    node = (node as Record<string, SiddurNode>)[key];
  }
  return node;
}

// Return child keys of an object node
function childKeys(node: SiddurNode): string[] {
  if (Array.isArray(node)) return [];
  return Object.keys(node as Record<string, SiddurNode>);
}

// Is this node a leaf (array of text)?
function isLeaf(node: SiddurNode): boolean {
  return Array.isArray(node);
}

// Does this node or any descendant have non-empty text?
function hasText(node: SiddurNode): boolean {
  if (Array.isArray(node)) return node.some((s) => typeof s === "string" && s.trim().length > 5);
  return Object.values(node as Record<string, SiddurNode>).some(hasText);
}

// Build a searchable index of all leaf paths with text
interface SearchEntry { path: string[]; label: string; snippet: string }
function buildIndex(node: SiddurNode, path: string[], acc: SearchEntry[]) {
  if (Array.isArray(node)) {
    const lines = (node as string[]).filter((s) => typeof s === "string" && s.trim().length > 5);
    if (lines.length > 0) {
      acc.push({ path, label: path.slice(-1)[0], snippet: stripHtml(lines[0]).slice(0, 100) });
    }
    return;
  }
  for (const [k, v] of Object.entries(node as Record<string, SiddurNode>)) {
    buildIndex(v, [...path, k], acc);
  }
}
const SEARCH_INDEX: SearchEntry[] = [];
buildIndex(SIDDUR, [], SEARCH_INDEX);

// ── Siddur text display ───────────────────────────────────────────────────────

function SiddurLeaf({ path }: { path: string[] }) {
  const englishLines = getSiddurText(path).map(stripHtml).filter(Boolean);
  const sefariaRef = "Siddur Ashkenaz, " + path.join(", ");
  const { data, loading } = useSiddur(sefariaRef);
  const heLines = data?.lines.map((l) => l.he).filter(Boolean) ?? [];

  return (
    <div className="space-y-3">
      {/* Hebrew */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 overflow-hidden">
        <div className="px-3 py-1.5 border-b border-primary/10 flex items-center justify-between">
          <span className="text-[9px] font-bold uppercase tracking-widest text-primary/70">עברית — Hebrew</span>
          <a
            href={`https://www.sefaria.org/${sefariaRef.replace(/ /g, "_")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] text-primary flex items-center gap-0.5 hover:text-primary/80"
          >
            <ExternalLink className="w-2.5 h-2.5" /> Sefaria
          </a>
        </div>
        <div className="px-3 py-2.5">
          {loading && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-block w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              Loading Hebrew…
            </div>
          )}
          {heLines.length > 0 ? (
            heLines.map((line, i) => (
              <p key={i} className="text-sm font-serif leading-loose mb-1 last:mb-0 text-right" dir="rtl" lang="he">
                {line}
              </p>
            ))
          ) : !loading ? (
            <p className="text-[10px] text-muted-foreground italic">
              Hebrew text available on Sefaria ↗
            </p>
          ) : null}
        </div>
      </div>

      {/* English */}
      {englishLines.length > 0 && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-3 py-1.5 border-b border-border/60">
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">English Translation</span>
          </div>
          <div className="px-3 py-2.5 space-y-2">
            {englishLines.map((line, i) => (
              <p key={i} className="text-xs font-serif leading-relaxed italic text-foreground">
                {line}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Category grid ─────────────────────────────────────────────────────────────

const SECTION_EMOJI: Record<string, string> = {
  Weekday: "☀️", Shabbat: "🕯️", Festivals: "🎉", Berachot: "🍇", Kaddish: "✡️",
  Shacharit: "🌅", Minchah: "🌤️", Maariv: "🌙",
  "Preparatory Prayers": "🙏", "Pesukei Dezimra": "📖", "Blessings of the Shema": "📜",
  Amidah: "🤲", "Concluding Prayers": "🌟", "Kabbalat Shabbat": "🕯️",
  "Shabbat Evening": "✨", "Torah Reading": "📕",
};

function CategoryCard({
  label, hasData, onClick,
}: { label: string; hasData: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl border p-3 flex items-center gap-3 transition-all hover:shadow-sm active:scale-[0.98] ${
        hasData ? "border-primary/30 bg-primary/5 hover:bg-primary/10" : "border-border bg-card hover:bg-muted/40"
      }`}
    >
      <span className="text-xl flex-shrink-0">{SECTION_EMOJI[label] ?? "📄"}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{label}</p>
        {hasData && (
          <p className="text-[9px] text-primary font-bold uppercase tracking-wide mt-0.5">
            Has English text
          </p>
        )}
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
    </button>
  );
}

// ── Search results ────────────────────────────────────────────────────────────

function SearchResults({ query, onSelect }: { query: string; onSelect: (path: string[]) => void }) {
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return SEARCH_INDEX.filter(
      (e) =>
        e.label.toLowerCase().includes(q) ||
        e.snippet.toLowerCase().includes(q) ||
        e.path.some((p) => p.toLowerCase().includes(q))
    ).slice(0, 20);
  }, [query]);

  if (!query.trim()) return null;
  if (results.length === 0)
    return <p className="text-xs text-muted-foreground text-center py-4 italic">No results found</p>;

  return (
    <div className="space-y-1.5">
      <p className="text-[10px] text-muted-foreground font-medium">{results.length} result{results.length !== 1 ? "s" : ""}</p>
      {results.map((e, i) => (
        <button
          key={i}
          onClick={() => onSelect(e.path)}
          className="w-full text-left rounded-lg border border-border bg-card p-2.5 hover:bg-muted/40 transition-colors"
        >
          <div className="flex items-center gap-1.5 mb-0.5">
            {e.path.map((p, j) => (
              <span key={j} className="flex items-center gap-1">
                {j > 0 && <ChevronRight className="w-2.5 h-2.5 text-muted-foreground/50" />}
                <span className={`text-[10px] ${j === e.path.length - 1 ? "font-bold text-foreground" : "text-muted-foreground"}`}>
                  {p}
                </span>
              </span>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground italic truncate">{e.snippet}</p>
        </button>
      ))}
    </div>
  );
}

// ── Main Siddur Browser ───────────────────────────────────────────────────────

export function SiddurBrowser() {
  const [path, setPath] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  const node = getNode(path);
  const leaf = node ? isLeaf(node) : false;
  const keys = node && !leaf ? childKeys(node) : [];

  const navigate = (key: string) => { setPath((p) => [...p, key]); setQuery(""); };
  const back = () => setPath((p) => p.slice(0, -1));
  const goTo = (i: number) => setPath((p) => p.slice(0, i + 1));
  const jumpTo = (targetPath: string[]) => { setPath(targetPath); setQuery(""); };

  const searching = query.trim().length > 0;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-primary" />
            Siddur — סִדּוּר
          </h2>
          <p className="text-[10px] text-muted-foreground mt-0.5 font-serif">
            Siddur Ashkenaz · Sefaria Community Translation
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search prayers… (Ashrei, Kiddush, Aleinu…)"
          className="w-full pl-8 pr-8 py-2 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Search results */}
      {searching && <SearchResults query={query} onSelect={jumpTo} />}

      {/* Breadcrumb */}
      {!searching && path.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap">
          <button
            onClick={() => setPath([])}
            className="text-[10px] text-primary hover:text-primary/80 font-semibold"
          >
            Siddur
          </button>
          {path.map((p, i) => (
            <span key={i} className="flex items-center gap-1">
              <ChevronRight className="w-3 h-3 text-muted-foreground/50" />
              <button
                onClick={() => i < path.length - 1 ? goTo(i) : undefined}
                className={`text-[10px] ${
                  i === path.length - 1
                    ? "text-foreground font-bold"
                    : "text-primary hover:text-primary/80 font-semibold"
                }`}
              >
                {p}
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Back button */}
      {!searching && path.length > 0 && (
        <button
          onClick={back}
          className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Back
        </button>
      )}

      {/* Content */}
      {!searching && (
        <>
          {leaf ? (
            <SiddurLeaf path={path} />
          ) : (
            <div className="space-y-2">
              {keys.map((key) => {
                const child = (node as Record<string, SiddurNode>)[key];
                return (
                  <CategoryCard
                    key={key}
                    label={key}
                    hasData={hasText(child)}
                    onClick={() => navigate(key)}
                  />
                );
              })}
              {keys.length === 0 && (
                <p className="text-xs text-muted-foreground italic text-center py-4">
                  No sections found
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

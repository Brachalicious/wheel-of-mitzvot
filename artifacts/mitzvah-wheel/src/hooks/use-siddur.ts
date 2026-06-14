import { useState, useEffect, useRef } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SiddurSection {
  ref: string;
  heRef: string;
  lines: Array<{ he: string; en: string }>;
}

// ── Cache ─────────────────────────────────────────────────────────────────────

const CACHE = new Map<string, SiddurSection>();

function stripHtml(s: unknown): string {
  if (typeof s !== "string") return "";
  return s.replace(/<[^>]+>/g, "").trim();
}

// Sefaria uses underscores for spaces in the URL path
function toUrl(ref: string): string {
  return encodeURIComponent(ref.replace(/ /g, "_").replace(/,_/g, ",_"));
}

async function fetchSiddur(ref: string): Promise<SiddurSection> {
  const url = `https://www.sefaria.org/api/texts/${toUrl(ref)}?commentary=0&context=0`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Sefaria ${res.status}`);
  const d = await res.json();

  const heRaw: unknown = d.he;
  const enRaw: unknown = d.text;

  const heArr: string[] = Array.isArray(heRaw)
    ? (heRaw as unknown[]).map((x) => stripHtml(String(x ?? "")))
    : [stripHtml(String(heRaw ?? ""))];
  const enArr: string[] = Array.isArray(enRaw)
    ? (enRaw as unknown[]).map((x) => stripHtml(String(x ?? "")))
    : [stripHtml(String(enRaw ?? ""))];

  const lines = heArr.map((he, i) => ({ he, en: enArr[i] ?? "" })).filter((l) => l.he);

  return { ref: d.ref ?? ref, heRef: d.heRef ?? ref, lines };
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useSiddur(ref: string | null): {
  data: SiddurSection | null;
  loading: boolean;
  error: string | null;
} {
  const [data, setData] = useState<SiddurSection | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abort = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!ref) { setData(null); setLoading(false); setError(null); return; }

    if (CACHE.has(ref)) {
      setData(CACHE.get(ref)!); setLoading(false); setError(null);
      return;
    }

    abort.current?.abort();
    abort.current = new AbortController();
    setLoading(true); setError(null); setData(null);

    fetchSiddur(ref)
      .then((s) => { CACHE.set(ref, s); setData(s); setLoading(false); })
      .catch((e) => {
        if ((e as Error).name !== "AbortError") {
          setError("Could not load prayer text");
          setLoading(false);
        }
      });

    return () => { abort.current?.abort(); };
  }, [ref]);

  return { data, loading, error };
}

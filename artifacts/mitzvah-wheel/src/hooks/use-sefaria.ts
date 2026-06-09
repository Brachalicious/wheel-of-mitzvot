import { useState, useEffect, useRef } from "react";
import type { MitzvahSource } from "./use-mitzvahs";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SefariaVerse {
  ref: string;
  heRef: string;
  text: string;
  he: string;
}

export interface SefariaCommentary {
  author: string;        // "Rashi", "Ibn Ezra", etc.
  ref: string;
  text: string;
  he: string;
}

export interface SefariaResult {
  verse: SefariaVerse | null;
  commentary: SefariaCommentary | null;
  loading: boolean;
  error: string | null;
}

// ── Module-level cache (survives re-renders, cleared on page reload) ──────────

const VERSE_CACHE = new Map<string, SefariaVerse>();
const COMMENT_CACHE = new Map<string, SefariaCommentary | null>();

const BASE = "https://www.sefaria.org/api";
const NOTABLE = ["Rashi", "Ramban", "Ibn Ezra", "Sforno", "Sefer HaChinuch", "Chizkuni"];

// Strip HTML tags Sefaria occasionally includes in English text
function stripHtml(s: string): string {
  return typeof s === "string" ? s.replace(/<[^>]+>/g, "").trim() : "";
}

// Build the canonical Sefaria ref string from our stored source
function toSefariaRef(src: MitzvahSource): string {
  return `${src.book}.${src.chapter}.${src.verse}`;
}

async function fetchVerse(sefariaRef: string): Promise<SefariaVerse> {
  const url = `${BASE}/texts/${encodeURIComponent(sefariaRef)}?commentary=0&context=0`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Sefaria texts API ${res.status}`);
  const d = await res.json();
  const text = Array.isArray(d.text) ? d.text.join(" ") : (d.text ?? "");
  const he   = Array.isArray(d.he)   ? d.he.join(" ")   : (d.he   ?? "");
  return { ref: d.ref ?? sefariaRef, heRef: d.heRef ?? sefariaRef, text: stripHtml(text), he: stripHtml(he) };
}

async function fetchBestCommentary(sefariaRef: string): Promise<SefariaCommentary | null> {
  const url = `${BASE}/related/${encodeURIComponent(sefariaRef)}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) return null;
  const d = await res.json();

  // Find the first link from a notable commentator that has an English translation
  const links: Array<{ collectiveTitle?: { en?: string }; sourceRef?: string; sourceHasEn?: boolean }> = d.links ?? [];
  const match = links.find(
    (l) => l.sourceHasEn && NOTABLE.includes(l.collectiveTitle?.en ?? "")
  );
  if (!match?.sourceRef) return null;

  const author = match.collectiveTitle?.en ?? "Commentary";
  const cUrl   = `${BASE}/texts/${encodeURIComponent(match.sourceRef)}?commentary=0&context=0`;
  const cRes   = await fetch(cUrl, { headers: { Accept: "application/json" } });
  if (!cRes.ok) return null;
  const cd = await cRes.json();

  const cText = Array.isArray(cd.text) ? cd.text.join(" ") : (cd.text ?? "");
  const cHe   = Array.isArray(cd.he)   ? cd.he.join(" ")   : (cd.he   ?? "");
  if (!cText) return null;
  return { author, ref: cd.ref ?? match.sourceRef, text: stripHtml(cText), he: stripHtml(cHe) };
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useSefaria(src: MitzvahSource | null): SefariaResult {
  const [verse,       setVerse]       = useState<SefariaVerse | null>(null);
  const [commentary,  setCommentary]  = useState<SefariaCommentary | null>(null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!src) {
      setVerse(null); setCommentary(null); setLoading(false); setError(null);
      return;
    }

    const sefariaRef = toSefariaRef(src);

    // If fully cached, serve immediately
    if (VERSE_CACHE.has(sefariaRef) && COMMENT_CACHE.has(sefariaRef)) {
      setVerse(VERSE_CACHE.get(sefariaRef)!);
      setCommentary(COMMENT_CACHE.get(sefariaRef) ?? null);
      setLoading(false); setError(null);
      return;
    }

    // Abort any in-flight request for a previous selection
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setLoading(true); setError(null); setVerse(null); setCommentary(null);

    // Fetch verse and related-commentary refs in parallel
    Promise.all([
      VERSE_CACHE.has(sefariaRef)
        ? Promise.resolve(VERSE_CACHE.get(sefariaRef)!)
        : fetchVerse(sefariaRef),
      COMMENT_CACHE.has(sefariaRef)
        ? Promise.resolve(COMMENT_CACHE.get(sefariaRef) ?? null)
        : fetchBestCommentary(sefariaRef),
    ])
      .then(([v, c]) => {
        VERSE_CACHE.set(sefariaRef, v);
        COMMENT_CACHE.set(sefariaRef, c);
        setVerse(v);
        setCommentary(c);
        setLoading(false);
      })
      .catch((err) => {
        if ((err as Error).name !== "AbortError") {
          setError("Could not load Sefaria data");
          setLoading(false);
        }
      });

    return () => { abortRef.current?.abort(); };
  }, [src ? toSefariaRef(src) : null]);

  return { verse, commentary, loading, error };
}

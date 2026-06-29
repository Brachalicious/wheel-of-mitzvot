import { useState, useEffect, useCallback } from "react";
import { Flame, MapPin, Search, RefreshCw, X, Clock } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────

interface ShabbatItem {
  category: "candles" | "havdalah" | "parashat" | "holiday";
  title: string;
  date?: string;
  hebrew?: string;
  subcat?: string;
}

interface ShabbatData {
  candles: Date | null;
  havdalah: Date | null;
  parasha: string;
  parashaHebrew: string;
  location: string;
  fetchedAt: number;
}

interface GeoResult {
  geonameid: number;
  name: string;
  asciiname?: string;
  country: string;
  admin1?: string;
  tzid?: string;
}

const STORAGE_KEY = "mitzvah-wheel-candle-location";
const CACHE_KEY   = "mitzvah-wheel-shabbat-cache";

function fmtTime(d: Date): string {
  const rounded = new Date(Math.round(d.getTime() / 60_000) * 60_000);
  return rounded.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}

function countdown(target: Date): string {
  const diffMs = target.getTime() - Date.now();
  if (diffMs <= 0) return "now";
  const h = Math.floor(diffMs / 3_600_000);
  const m = Math.floor((diffMs % 3_600_000) / 60_000);
  if (h > 48) {
    const d = Math.round(h / 24);
    return `in ${d} day${d !== 1 ? "s" : ""}`;
  }
  if (h > 0) return `in ${h}h ${m}m`;
  return `in ${m}m`;
}

async function fetchShabbatByCoords(lat: number, lng: number): Promise<ShabbatData> {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const url = `https://www.hebcal.com/shabbat?cfg=json&latitude=${lat}&longitude=${lng}&tzid=${encodeURIComponent(tz)}&m=50&b=18&M=on&lg=s`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("HebCal API error");
  const json = await res.json();
  return parseHebcal(json);
}

async function fetchShabbatByGeoId(geonameid: number, tzid?: string): Promise<ShabbatData> {
  const tz = tzid || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const url = `https://www.hebcal.com/shabbat?cfg=json&geonameid=${geonameid}&tzid=${encodeURIComponent(tz)}&m=50&b=18&M=on&lg=s`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("HebCal API error");
  const json = await res.json();
  return parseHebcal(json);
}

function parseHebcal(json: { title?: string; items?: ShabbatItem[] }): ShabbatData {
  const items: ShabbatItem[] = json.items ?? [];
  let candles: Date | null = null;
  let havdalah: Date | null = null;
  let parasha = "";
  let parashaHebrew = "";

  for (const it of items) {
    if (it.category === "candles" && it.date && !candles) {
      candles = new Date(it.date);
    } else if (it.category === "havdalah" && it.date && !havdalah) {
      havdalah = new Date(it.date);
    } else if (it.category === "parashat" && !parasha) {
      parasha = it.title.replace(/^Parashat\s+/, "");
      parashaHebrew = it.hebrew ?? "";
    } else if (it.category === "holiday" && it.subcat === "shabbat" && !parasha) {
      parasha = it.title;
      parashaHebrew = it.hebrew ?? "";
    }
  }

  const location = (json.title ?? "").replace(/^Shabbat\s+times\s+for\s+/i, "");
  return { candles, havdalah, parasha, parashaHebrew, location, fetchedAt: Date.now() };
}

// ── Hook ───────────────────────────────────────────────────────────────────────

function useShabbatTimes() {
  const [data, setData] = useState<ShabbatData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [geoQuery, setGeoQuery] = useState("");
  const [geoResults, setGeoResults] = useState<GeoResult[]>([]);
  const [geoSearching, setGeoSearching] = useState(false);
  const [savedLoc, setSavedLoc] = useState<{ type: "coords"; lat: number; lng: number } | { type: "geo"; id: number; name: string; tzid?: string } | null>(null);

  const load = useCallback(async (
    loc: { type: "coords"; lat: number; lng: number } | { type: "geo"; id: number; name: string; tzid?: string }
  ) => {
    setLoading(true);
    setError(null);
    try {
      let result: ShabbatData;
      if (loc.type === "coords") {
        result = await fetchShabbatByCoords(loc.lat, loc.lng);
      } else {
        result = await fetchShabbatByGeoId(loc.id, loc.tzid);
        if (!result.location) result = { ...result, location: loc.name };
      }
      setData(result);
      localStorage.setItem(CACHE_KEY, JSON.stringify({ ...result, candles: result.candles?.toISOString(), havdalah: result.havdalah?.toISOString() }));
      setSavedLoc(loc);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
    } catch {
      setError("Could not load Shabbat times. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not available — search for your city below.");
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { type: "coords" as const, lat: pos.coords.latitude, lng: pos.coords.longitude };
        load(loc);
      },
      () => {
        setLoading(false);
        setError("Location access denied — search for your city below.");
      },
      { timeout: 10_000 }
    );
  }, [load]);

  const searchCity = useCallback(async (q: string) => {
    if (q.length < 2) return;
    setGeoSearching(true);
    try {
      const res = await fetch(`https://www.hebcal.com/geo/?q=${encodeURIComponent(q)}&cfg=json`);
      const json = await res.json();
      setGeoResults((json.features ?? json.items ?? json ?? []).slice(0, 8).map((f: { properties?: GeoResult } & GeoResult) => f.properties ?? f));
    } catch {
      setGeoResults([]);
    } finally {
      setGeoSearching(false);
    }
  }, []);

  const selectCity = useCallback((r: GeoResult) => {
    const loc = { type: "geo" as const, id: r.geonameid, name: `${r.name}${r.admin1 ? ", " + r.admin1 : ""}, ${r.country}`, tzid: r.tzid };
    setGeoQuery("");
    setGeoResults([]);
    load(loc);
  }, [load]);

  const clearLocation = useCallback(() => {
    setData(null);
    setSavedLoc(null);
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CACHE_KEY);
  }, []);

  // Bootstrap from cache / saved location
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const cache = localStorage.getItem(CACHE_KEY);

    if (cache) {
      try {
        const c = JSON.parse(cache);
        const parsed: ShabbatData = {
          ...c,
          candles:  c.candles  ? new Date(c.candles)  : null,
          havdalah: c.havdalah ? new Date(c.havdalah) : null,
        };
        // Stale after 12 hours OR if havdalah has passed
        const stale = Date.now() - (c.fetchedAt ?? 0) > 12 * 3_600_000
          || (parsed.havdalah && parsed.havdalah < new Date());
        setData(parsed);
        if (!stale) return;
      } catch { /* */ }
    }

    if (saved) {
      try {
        const loc = JSON.parse(saved);
        setSavedLoc(loc);
        load(loc);
      } catch { /* */ }
    } else {
      detectLocation();
    }
  }, []);

  return { data, loading, error, geoQuery, setGeoQuery, geoResults, geoSearching, searchCity, selectCity, clearLocation, detectLocation, savedLoc, load };
}

// ── Full card (Reminders tab) ──────────────────────────────────────────────────

export function CandleLighting() {
  const {
    data, loading, error,
    geoQuery, setGeoQuery, geoResults, geoSearching, searchCity, selectCity,
    clearLocation, detectLocation,
  } = useShabbatTimes();

  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  const now = new Date();
  const isShabbat = data?.candles && data?.havdalah && now >= data.candles && now <= data.havdalah;
  const candlesSoon = data?.candles && !isShabbat && data.candles > now && data.candles.getTime() - now.getTime() < 3_600_000;

  return (
    <div className={`rounded-xl border overflow-hidden ${isShabbat ? "border-purple-300 bg-purple-50/60" : candlesSoon ? "border-amber-300 bg-amber-50/60" : "border-blue-200 bg-blue-50/40"}`}>
      {/* Header */}
      <div className={`px-3 py-2.5 border-b flex items-center justify-between ${isShabbat ? "border-purple-200 bg-purple-100/60" : candlesSoon ? "border-amber-200 bg-amber-100/60" : "border-blue-100"}`}>
        <div className="flex items-center gap-1.5">
          <Flame className={`w-3.5 h-3.5 ${isShabbat ? "text-purple-600" : candlesSoon ? "text-amber-600" : "text-blue-600"}`} />
          <span className={`text-xs font-bold ${isShabbat ? "text-purple-800" : candlesSoon ? "text-amber-800" : "text-blue-800"}`}>
            {isShabbat ? "✡ Shabbat Shalom!" : "Shabbat Candle Lighting"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {data && (
            <button onClick={clearLocation} className="text-muted-foreground hover:text-foreground p-0.5 rounded" title="Change location">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          {!loading && !data && (
            <button onClick={detectLocation} className="text-muted-foreground hover:text-foreground p-0.5 rounded" title="Detect location">
              <MapPin className="w-3.5 h-3.5" />
            </button>
          )}
          {loading && <RefreshCw className="w-3.5 h-3.5 text-muted-foreground animate-spin" />}
        </div>
      </div>

      <div className="p-3 space-y-3">

        {/* Error */}
        {error && (
          <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 leading-relaxed">
            {error}
          </p>
        )}

        {/* Shabbat data */}
        {data && (
          <div className="space-y-2">
            {/* Location */}
            {data.location && (
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{data.location}</span>
                <button onClick={clearLocation} className="underline hover:no-underline ml-1 flex-shrink-0">Change</button>
              </div>
            )}

            {/* Parasha */}
            {data.parasha && (
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/80 border border-blue-100">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Parasha</span>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">{data.parasha}</p>
                  {data.parashaHebrew && (
                    <p className="text-xs text-muted-foreground font-serif" dir="rtl" lang="he">{data.parashaHebrew}</p>
                  )}
                </div>
              </div>
            )}

            {/* Times grid */}
            <div className="grid grid-cols-2 gap-2">
              {/* Candle lighting */}
              <div className={`rounded-lg border p-2.5 ${isShabbat ? "bg-purple-100/60 border-purple-200" : candlesSoon ? "bg-amber-100/60 border-amber-300 ring-1 ring-amber-400" : "bg-white/80 border-blue-100"}`}>
                <div className="flex items-center gap-1 mb-1">
                  <Flame className={`w-3 h-3 ${candlesSoon ? "text-amber-600 animate-pulse" : "text-blue-500"}`} />
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">Candle Lighting</span>
                </div>
                {data.candles ? (
                  <>
                    <p className="text-base font-bold text-foreground leading-tight">{fmtTime(data.candles)}</p>
                    <p className="text-[10px] text-muted-foreground">{fmtDate(data.candles)}</p>
                    {!isShabbat && data.candles > now && (
                      <p className={`text-[10px] font-bold mt-0.5 flex items-center gap-0.5 ${candlesSoon ? "text-amber-700" : "text-blue-600"}`}>
                        <Clock className="w-2.5 h-2.5" />
                        {countdown(data.candles)}
                      </p>
                    )}
                    {isShabbat && <p className="text-[10px] text-purple-700 font-bold mt-0.5">Shabbat in progress</p>}
                  </>
                ) : (
                  <p className="text-xs text-muted-foreground italic">Not available</p>
                )}
              </div>

              {/* Havdalah */}
              <div className={`rounded-lg border p-2.5 ${isShabbat ? "bg-purple-100/60 border-purple-200" : "bg-white/80 border-blue-100"}`}>
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-xs">✨</span>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">Havdalah</span>
                </div>
                {data.havdalah ? (
                  <>
                    <p className="text-base font-bold text-foreground leading-tight">{fmtTime(data.havdalah)}</p>
                    <p className="text-[10px] text-muted-foreground">{fmtDate(data.havdalah)}</p>
                    {isShabbat && data.havdalah > now && (
                      <p className="text-[10px] font-bold mt-0.5 flex items-center gap-0.5 text-purple-700">
                        <Clock className="w-2.5 h-2.5" />
                        {countdown(data.havdalah)}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-xs text-muted-foreground italic">Not available</p>
                )}
              </div>
            </div>

            {/* Shabbat blessing */}
            {isShabbat && (
              <div className="px-3 py-2 rounded-lg bg-purple-100/80 border border-purple-200 text-center">
                <p className="text-sm font-bold text-purple-800 font-serif" dir="rtl" lang="he">שַׁבָּת שָׁלוֹם</p>
                <p className="text-[10px] text-purple-700 italic mt-0.5">May your Shabbat be peaceful and joyful</p>
              </div>
            )}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && !data && (
          <div className="space-y-2">
            {[80, 120, 60].map((w, i) => (
              <div key={i} className="h-4 rounded bg-muted/60 animate-pulse" style={{ width: `${w}%` }} />
            ))}
          </div>
        )}

        {/* City search */}
        <div className="space-y-1.5">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search city (e.g. Jerusalem, Brooklyn…)"
                value={geoQuery}
                onChange={(e) => {
                  setGeoQuery(e.target.value);
                  if (e.target.value.length >= 2) searchCity(e.target.value);
                  else setGeoQuery(e.target.value);
                }}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-border rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <button
              onClick={detectLocation}
              title="Use my location"
              className="px-2.5 py-1.5 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <MapPin className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Geo results */}
          {geoResults.length > 0 && (
            <div className="rounded-lg border border-border bg-background shadow-md overflow-hidden max-h-48 overflow-y-auto">
              {geoSearching && (
                <div className="px-3 py-1.5 text-[10px] text-muted-foreground animate-pulse">Searching…</div>
              )}
              {geoResults.map((r) => (
                <button
                  key={r.geonameid}
                  onClick={() => selectCity(r)}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-primary/5 border-b border-border/50 last:border-0 transition-colors"
                >
                  <span className="font-semibold">{r.name}</span>
                  {r.admin1 && <span className="text-muted-foreground">, {r.admin1}</span>}
                  <span className="text-muted-foreground ml-1 text-[10px]">{r.country}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="text-[9px] text-muted-foreground text-center">
          Times from{" "}
          <a href="https://www.hebcal.com" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
            HebCal.com
          </a>
          {" "}· 18 min before sunset · Havdalah at 50 min after
        </p>
      </div>
    </div>
  );
}

// ── Compact header badge ───────────────────────────────────────────────────────

export function CandleLightingBadge() {
  const [data, setData] = useState<ShabbatData | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    // Load from cache only — don't trigger geolocation in header
    const cache = localStorage.getItem(CACHE_KEY);
    if (!cache) return;
    try {
      const c = JSON.parse(cache);
      setData({
        ...c,
        candles:  c.candles  ? new Date(c.candles)  : null,
        havdalah: c.havdalah ? new Date(c.havdalah) : null,
      });
    } catch { /* */ }
  }, [tick]);

  if (!data?.candles) return null;

  const now = new Date();
  const isShabbat  = data.havdalah && now >= data.candles && now <= data.havdalah;
  const upcoming   = !isShabbat && data.candles > now;
  const diffMs     = data.candles.getTime() - now.getTime();
  const withinDay  = diffMs < 24 * 3_600_000 && diffMs > 0;

  if (!isShabbat && !withinDay) return null;

  return (
    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
      isShabbat ? "bg-purple-800/30 text-purple-200" : "bg-amber-500/20 text-amber-300"
    }`}>
      <Flame className="w-2.5 h-2.5 flex-shrink-0" />
      {isShabbat
        ? `Havdalah ${fmtTime(data.havdalah!)}`
        : `Candles ${fmtTime(data.candles)} (${countdown(data.candles)})`}
    </div>
  );
}

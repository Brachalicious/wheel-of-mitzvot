// Reminders — stored in localStorage, checked every 30 s while app is open
// Fires browser Notifications + Web Audio alarm when a reminder's time arrives

import { useState, useEffect, useRef, useCallback } from "react";

export interface Reminder {
  id: string;
  label: string;
  time: string;       // "HH:MM" 24-hour
  days: number[];     // 0=Sun … 6=Sat; empty array = every day
  enabled: boolean;
}

const STORAGE_KEY  = "mitzvah-wheel-reminders";
const FIRED_KEY    = "mitzvah-wheel-reminders-fired"; // tracks last-fired per id

// ── Persist helpers ──────────────────────────────────────────────────────────

function load(): Reminder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Reminder[]) : [];
  } catch { return []; }
}

function save(reminders: Reminder[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders)); } catch { /* */ }
}

function loadFired(): Record<string, string> {
  try {
    const raw = localStorage.getItem(FIRED_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch { return {}; }
}

function saveFired(fired: Record<string, string>) {
  try { localStorage.setItem(FIRED_KEY, JSON.stringify(fired)); } catch { /* */ }
}

// ── Bell sound via Web Audio API ─────────────────────────────────────────────

export function playAlarmSound() {
  try {
    const ctx  = new AudioContext();
    const gain = ctx.createGain();
    gain.connect(ctx.destination);

    const freqs = [880, 1100, 1320];
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.connect(gain);
      osc.type = "sine";
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.18;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.35, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.4);
      osc.start(t);
      osc.stop(t + 1.4);
    });
  } catch { /* AudioContext blocked */ }
}

// ── Main hook ────────────────────────────────────────────────────────────────

export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>(load);
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );

  // Persist whenever state changes
  useEffect(() => { save(reminders); }, [reminders]);

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if (typeof Notification === "undefined") return;
    const result = await Notification.requestPermission();
    setPermission(result);
  }, []);

  // CRUD
  const addReminder = useCallback((r: Omit<Reminder, "id">) => {
    setReminders((prev) => [
      ...prev,
      { ...r, id: crypto.randomUUID() },
    ]);
  }, []);

  const updateReminder = useCallback((id: string, patch: Partial<Reminder>) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch } : r))
    );
  }, []);

  const removeReminder = useCallback((id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const toggleReminder = useCallback((id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  }, []);

  // ── Polling — check every 30 s ────────────────────────────────────────────
  const remindersRef = useRef(reminders);
  useEffect(() => { remindersRef.current = reminders; }, [reminders]);

  useEffect(() => {
    const check = () => {
      const now  = new Date();
      const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const day  = now.getDay();
      // Key for "fired today" = "YYYY-MM-DD:id"
      const datePrefix = now.toISOString().slice(0, 10);
      const fired = loadFired();

      remindersRef.current.forEach((r) => {
        if (!r.enabled) return;
        if (r.time !== hhmm) return;
        if (r.days.length > 0 && !r.days.includes(day)) return;

        const firedKey = `${datePrefix}:${r.id}`;
        if (fired[firedKey]) return; // already fired this minute today

        // Mark fired
        fired[firedKey] = hhmm;
        saveFired(fired);

        // Play sound
        playAlarmSound();

        // Browser notification
        if (typeof Notification !== "undefined" && Notification.permission === "granted") {
          new Notification("Wheel of Mitzvot", {
            body: r.label || "Time for your mitzvah reminder!",
            icon: "/favicon.ico",
            tag: r.id,
          });
        }
      });
    };

    check(); // run immediately on mount
    const interval = setInterval(check, 30_000);
    return () => clearInterval(interval);
  }, []);

  return {
    reminders,
    permission,
    requestPermission,
    addReminder,
    updateReminder,
    removeReminder,
    toggleReminder,
  };
}

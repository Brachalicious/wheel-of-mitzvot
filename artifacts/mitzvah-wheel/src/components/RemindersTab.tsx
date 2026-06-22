import { useState, useEffect } from "react";
import {
  Bell, BellOff, BellRing, Plus, Trash2,
  Calendar, User, ChevronDown, ChevronUp,
  Check, Volume2, ExternalLink, Pencil, X,
} from "lucide-react";
import { useReminders, playAlarmSound, type Reminder } from "@/hooks/use-reminders";

// ── Gender-tailored daily mitzvot ─────────────────────────────────────────────

interface DailyMitzvah {
  id: string;
  label: string;
  hebrew: string;
  description: string;
  time: string;
  gender: "both" | "men" | "women";
}

const DAILY_MITZVOT: DailyMitzvah[] = [
  // Both
  { id: "netilat", label: "Netilat Yadayim", hebrew: "נְטִילַת יָדַיִם", description: "Wash hands upon waking, before bread, after bathroom", time: "Morning", gender: "both" },
  { id: "shacharit-both", label: "Morning Prayer", hebrew: "שַׁחֲרִית", description: "At minimum: Shema + one blessing. Full Shacharit recommended.", time: "Morning", gender: "both" },
  { id: "birkot", label: "Birkot HaShachar", hebrew: "בִּרְכּוֹת הַשַּׁחַר", description: "Morning blessings — said after washing hands", time: "Morning", gender: "both" },
  { id: "tzedakah", label: "Tzedakah", hebrew: "צְדָקָה", description: "Give charity — even a small coin counts", time: "Any time", gender: "both" },
  { id: "mezuzah", label: "Touch the Mezuzah", hebrew: "מְזוּזָה", description: "Touch and kiss the mezuzah when entering your home", time: "Any time", gender: "both" },
  { id: "chesed", label: "Act of Kindness", hebrew: "חֶסֶד", description: "Do one act of kindness for another person today", time: "Any time", gender: "both" },
  { id: "shema-bed", label: "Kriat Shema (bedtime)", hebrew: "קְרִיאַת שְׁמַע עַל הַמִּטָּה", description: "Recite Shema before sleep for spiritual protection", time: "Night", gender: "both" },
  { id: "torah", label: "Torah Study", hebrew: "תַּלְמוּד תּוֹרָה", description: "Learn at least one halacha or parsha passage today", time: "Any time", gender: "both" },
  { id: "shmiras", label: "Shmiras HaLashon", hebrew: "שְׁמִירַת הַלָּשׁוֹן", description: "Guard your speech — avoid gossip and hurtful words", time: "All day", gender: "both" },
  // Men only
  { id: "tefillin", label: "Tefillin", hebrew: "תְּפִלִּין", description: "Put on Tefillin before Shacharit — weekdays only", time: "Morning", gender: "men" },
  { id: "tzitzit", label: "Tzitzit / Tallit", hebrew: "צִיצִית / טַלִּית", description: "Wear tzitzit throughout the day", time: "Morning", gender: "men" },
  { id: "shacharit-men", label: "Full Shacharit", hebrew: "שַׁחֲרִית", description: "Complete morning service including Amidah, Tachanun on weekdays", time: "Morning", gender: "men" },
  { id: "mincha-men", label: "Mincha", hebrew: "מִנְחָה", description: "Afternoon prayer — Amidah + Ashrei", time: "Afternoon", gender: "men" },
  { id: "maariv", label: "Maariv", hebrew: "מַעֲרִיב", description: "Evening prayer after nightfall", time: "Evening", gender: "men" },
  { id: "kriat-shema-men", label: "Kriat Shema (morning)", hebrew: "קְרִיאַת שְׁמַע שֶׁל שַׁחֲרִית", description: "Recite Shema with its blessings during Shacharit", time: "Morning", gender: "men" },
  // Women only
  { id: "shacharit-women", label: "Tefillah (at least once)", hebrew: "תְּפִלָּה", description: "Women are obligated in daily prayer — at minimum Shacharit or one heartfelt request", time: "Morning", gender: "women" },
  { id: "candle-check", label: "Shabbat Candle Reminder", hebrew: "נֵרוֹת שַׁבָּת", description: "Check candle-lighting time for this Friday", time: "Any time", gender: "women" },
  { id: "challah", label: "Hafrashat Challah", hebrew: "הַפְרָשַׁת חַלָּה", description: "Separate challah when baking bread (if baking today)", time: "When baking", gender: "women" },
  { id: "family-purity", label: "Family Purity (Taharas HaMishpacha)", hebrew: "טַהֲרַת הַמִּשְׁפָּחָה", description: "Follow the laws of niddah and mikveh", time: "Ongoing", gender: "women" },
  { id: "mincha-women", label: "Mincha", hebrew: "מִנְחָה", description: "Afternoon prayer — recommended for women too", time: "Afternoon", gender: "women" },
];

// ── localStorage helpers ──────────────────────────────────────────────────────

const GENDER_KEY = "mitzvah-wheel-gender";
const PROFILE_KEY = "mitzvah-wheel-profile-name";
const DONE_PREFIX = "mitzvah-wheel-daily-done-";

function todayKey() { return new Date().toISOString().slice(0, 10); }
function loadDone(): Set<string> {
  try {
    const raw = localStorage.getItem(DONE_PREFIX + todayKey());
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch { return new Set(); }
}
function saveDoneSet(s: Set<string>) {
  try { localStorage.setItem(DONE_PREFIX + todayKey(), JSON.stringify([...s])); } catch { /* */ }
}

// ── Google Calendar URL builder ───────────────────────────────────────────────

function buildGoogleCalUrl(label: string, time: string, recur: boolean) {
  const now = new Date();
  const [hh, mm] = time.split(":").map(Number);
  const start = new Date(now);
  start.setHours(hh, mm, 0, 0);
  if (start <= now) start.setDate(start.getDate() + 1);

  const end = new Date(start);
  end.setMinutes(end.getMinutes() + 15);

  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: label,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: "Set by Wheel of Mitzvot",
  });
  if (recur) params.set("recur", "RRULE:FREQ=DAILY");

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// ── Reminder row ─────────────────────────────────────────────────────────────

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function ReminderRow({
  reminder, onToggle, onRemove, onUpdate,
}: {
  reminder: Reminder;
  onToggle: () => void;
  onRemove: () => void;
  onUpdate: (patch: Partial<Reminder>) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(reminder.label);

  const toggleDay = (d: number) => {
    const days = reminder.days.includes(d)
      ? reminder.days.filter((x) => x !== d)
      : [...reminder.days, d].sort();
    onUpdate({ days });
  };

  const commitLabel = () => {
    onUpdate({ label });
    setEditing(false);
  };

  const gcalUrl = buildGoogleCalUrl(reminder.label, reminder.time, true);

  return (
    <div className={`rounded-xl border transition-all ${reminder.enabled ? "border-primary/40 bg-primary/5" : "border-border bg-muted/20"}`}>
      <div className="flex items-center gap-2.5 px-3 py-3">
        {/* Enable toggle */}
        <button
          onClick={onToggle}
          className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors shadow-sm ${reminder.enabled ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
        >
          {reminder.enabled ? <BellRing className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
        </button>

        {/* Label + time */}
        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="flex items-center gap-1">
              <input
                className="flex-1 text-sm font-medium border border-primary/40 rounded-lg px-2 py-1 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && commitLabel()}
                autoFocus
              />
              <button onClick={commitLabel} className="text-primary hover:text-primary/80"><Check className="w-4 h-4" /></button>
              <button onClick={() => { setLabel(reminder.label); setEditing(false); }} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <p className={`text-sm font-semibold truncate ${reminder.enabled ? "text-foreground" : "text-muted-foreground"}`}>
                {reminder.label || "Tap to name this reminder"}
              </p>
              <button onClick={() => setEditing(true)} className="text-muted-foreground/50 hover:text-muted-foreground flex-shrink-0">
                <Pencil className="w-3 h-3" />
              </button>
            </div>
          )}
          <div className="flex items-center gap-2 mt-0.5">
            <input
              type="time"
              value={reminder.time}
              onChange={(e) => onUpdate({ time: e.target.value })}
              className="text-xs text-primary font-mono bg-transparent border-none outline-none cursor-pointer font-bold"
            />
            <span className="text-[10px] text-muted-foreground">
              {reminder.days.length === 0 ? "Every day" : reminder.days.map((d) => DAY_LABELS[d]).join(", ")}
            </span>
          </div>
        </div>

        {/* Google Calendar */}
        <a
          href={gcalUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Add to Google Calendar"
          className="flex-shrink-0 text-muted-foreground hover:text-blue-600 transition-colors"
        >
          <Calendar className="w-4 h-4" />
        </a>

        {/* Delete */}
        <button onClick={onRemove} className="flex-shrink-0 text-muted-foreground hover:text-destructive transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Day-of-week chips */}
      <div className="px-3 pb-3 flex items-center gap-1 flex-wrap">
        {DAY_LABELS.map((day, i) => (
          <button
            key={i}
            onClick={() => toggleDay(i)}
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
              reminder.days.length === 0
                ? "bg-primary/15 text-primary"
                : reminder.days.includes(i)
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {day}
          </button>
        ))}
        {reminder.days.length === 0 && (
          <span className="text-[10px] text-muted-foreground ml-1">Every day</span>
        )}
      </div>
    </div>
  );
}

// ── Preset reminders ─────────────────────────────────────────────────────────

const PRESETS_MEN = [
  { label: "Tefillin & Shacharit", time: "07:00", days: [0,1,2,3,4] },
  { label: "Mincha reminder", time: "14:30", days: [] },
  { label: "Maariv / Arvit", time: "19:30", days: [] },
  { label: "Count the Omer (after nightfall)", time: "20:30", days: [] },
  { label: "Daily Torah study", time: "21:00", days: [] },
  { label: "Erev Shabbat candle lighting", time: "17:30", days: [5] },
  { label: "Havdalah / Motzei Shabbat", time: "21:00", days: [6] },
  { label: "Kriat Shema al HaMitah", time: "22:30", days: [] },
];

const PRESETS_WOMEN = [
  { label: "Morning prayer & blessings", time: "08:00", days: [] },
  { label: "Mincha (afternoon prayer)", time: "14:30", days: [] },
  { label: "Erev Shabbat candle lighting", time: "17:30", days: [5] },
  { label: "Havdalah / Motzei Shabbat", time: "21:00", days: [6] },
  { label: "Count the Omer (after nightfall)", time: "20:30", days: [] },
  { label: "Daily Torah or Mussar study", time: "21:00", days: [] },
  { label: "Kriat Shema al HaMitah", time: "22:30", days: [] },
  { label: "Shmiras HaLashon learning", time: "09:00", days: [] },
];

// ── Main component ────────────────────────────────────────────────────────────

export function RemindersTab() {
  const [gender, setGender] = useState<"men" | "women" | null>(() => {
    const g = localStorage.getItem(GENDER_KEY);
    return g === "men" || g === "women" ? g : null;
  });
  const [profileName, setProfileName] = useState(() => localStorage.getItem(PROFILE_KEY) ?? "");
  const [editingProfile, setEditingProfile] = useState(false);
  const [tempName, setTempName] = useState("");
  const [done, setDone] = useState<Set<string>>(loadDone);
  const [showPresets, setShowPresets] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newTime, setNewTime] = useState(() => {
    const n = new Date(); return `${String(n.getHours()).padStart(2,"0")}:${String(n.getMinutes()).padStart(2,"0")}`;
  });

  const { reminders, permission, requestPermission, addReminder, updateReminder, removeReminder, toggleReminder } = useReminders();

  useEffect(() => {
    if (gender) localStorage.setItem(GENDER_KEY, gender);
  }, [gender]);

  useEffect(() => {
    if (profileName) localStorage.setItem(PROFILE_KEY, profileName);
  }, [profileName]);

  const toggleDone = (id: string) => {
    setDone((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      saveDoneSet(next);
      return next;
    });
  };

  const todayMitzvot = DAILY_MITZVOT.filter(
    (m) => m.gender === "both" || m.gender === gender
  );

  const presets = gender === "women" ? PRESETS_WOMEN : PRESETS_MEN;
  const activeCount = reminders.filter((r) => r.enabled).length;
  const doneCount = done.size;
  const totalToday = todayMitzvot.length;

  const handleAddCustom = () => {
    if (!newLabel.trim()) return;
    addReminder({ label: newLabel.trim(), time: newTime, days: [], enabled: true });
    setNewLabel("");
    setShowCustomForm(false);
  };

  const handlePreset = (p: typeof PRESETS_MEN[0]) => {
    addReminder({ ...p, enabled: true });
    setShowPresets(false);
  };

  const saveProfile = () => {
    if (tempName.trim()) setProfileName(tempName.trim());
    setEditingProfile(false);
  };

  // ── Gender picker screen ──────────────────────────────────────────────────

  if (!gender) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-8 p-6">
        <div className="text-center space-y-2">
          <Bell className="w-10 h-10 text-primary mx-auto" />
          <h2 className="text-xl font-bold text-foreground">Set Up Reminders</h2>
          <p className="text-sm text-muted-foreground font-serif max-w-xs">
            Choose your gender to see your daily mitzvot checklist and recommended reminders.
          </p>
        </div>

        <div className="flex gap-4 w-full max-w-xs">
          <button
            onClick={() => setGender("men")}
            className="flex-1 flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary transition-all active:scale-[0.97]"
          >
            <span className="text-4xl">👨</span>
            <span className="text-sm font-bold text-foreground">Man</span>
            <span className="text-[11px] text-muted-foreground text-center leading-tight">
              Tefillin, Tzitzit,<br />3× daily prayer
            </span>
          </button>
          <button
            onClick={() => setGender("women")}
            className="flex-1 flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary transition-all active:scale-[0.97]"
          >
            <span className="text-4xl">👩</span>
            <span className="text-sm font-bold text-foreground">Woman</span>
            <span className="text-[11px] text-muted-foreground text-center leading-tight">
              Candle lighting,<br />Family purity, Prayer
            </span>
          </button>
        </div>

        <p className="text-[10px] text-muted-foreground text-center max-w-xs">
          This is saved locally on your device. You can change it anytime from the Reminders tab.
        </p>
      </div>
    );
  }

  // ── Main tab ──────────────────────────────────────────────────────────────

  return (
    <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="p-4 space-y-4 max-w-2xl mx-auto">

        {/* Profile banner */}
        <div className="rounded-xl border border-border bg-card px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            {editingProfile ? (
              <div className="flex items-center gap-2">
                <input
                  className="flex-1 text-sm border border-border rounded-lg px-2 py-1 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Your name…"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveProfile()}
                  autoFocus
                />
                <button onClick={saveProfile} className="text-primary font-semibold text-sm">Save</button>
                <button onClick={() => setEditingProfile(false)} className="text-muted-foreground text-sm">Cancel</button>
              </div>
            ) : (
              <>
                <p className="text-sm font-semibold text-foreground">
                  {profileName || "Add your name"}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {gender === "men" ? "👨 Men's mitzvot" : "👩 Women's mitzvot"} · saved locally
                </p>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {!editingProfile && (
              <button
                onClick={() => { setTempName(profileName); setEditingProfile(true); }}
                className="text-[11px] text-primary font-semibold hover:text-primary/80"
              >
                {profileName ? "Edit" : "Set name"}
              </button>
            )}
            <button
              onClick={() => setGender(null)}
              className="text-[10px] text-muted-foreground hover:text-foreground underline underline-offset-1"
            >
              Switch
            </button>
          </div>
        </div>

        {/* ── Daily Mitzvot Checklist ──────────────────────────────────────── */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Check className="w-4 h-4 text-green-600" />
                Today's Mitzvot
              </h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {doneCount}/{totalToday} completed · resets at midnight
              </p>
            </div>
            {doneCount > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${(doneCount / totalToday) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-green-600">{Math.round((doneCount / totalToday) * 100)}%</span>
              </div>
            )}
          </div>

          {/* Group by time */}
          {(["Morning", "Afternoon", "Evening", "Night", "All day", "Any time", "Ongoing", "When baking"] as const).map((timeLabel) => {
            const items = todayMitzvot.filter((m) => m.time === timeLabel);
            if (items.length === 0) return null;
            return (
              <div key={timeLabel}>
                <div className="px-4 py-1.5 bg-muted/30 border-b border-border">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{timeLabel}</p>
                </div>
                <div className="divide-y divide-border/40">
                  {items.map((m) => {
                    const isDone = done.has(m.id);
                    return (
                      <button
                        key={m.id}
                        onClick={() => toggleDone(m.id)}
                        className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/20 active:scale-[0.99] ${isDone ? "bg-green-50/60" : ""}`}
                      >
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-colors ${isDone ? "border-green-500 bg-green-500" : "border-gray-300"}`}>
                          {isDone && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className={`text-sm font-semibold ${isDone ? "line-through text-green-700" : "text-foreground"}`}>
                              {m.label}
                            </span>
                            <span className="text-xs font-serif text-muted-foreground" dir="rtl" lang="he">
                              {m.hebrew}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed font-serif">
                            {m.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Reminders & Alarms ───────────────────────────────────────────── */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 overflow-hidden">
          <div className="px-4 py-3 border-b border-amber-200 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-amber-600" />
                Reminders &amp; Alarms
              </h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {activeCount > 0 ? `${activeCount} active · notifies with sound` : "No active reminders yet"}
              </p>
            </div>
            <button
              onClick={playAlarmSound}
              title="Test alarm sound"
              className="flex items-center gap-1 text-[11px] text-amber-700 hover:text-amber-900 font-medium"
            >
              <Volume2 className="w-3.5 h-3.5" /> Test sound
            </button>
          </div>

          <div className="p-4 space-y-3">
            {/* Notification permission */}
            {permission !== "granted" && (
              <div className="rounded-xl bg-amber-100 border border-amber-300 px-3 py-3 flex items-start gap-2">
                <Bell className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-amber-800">
                    {permission === "denied"
                      ? "Notifications blocked — enable in your browser/phone settings to get alarms"
                      : "Allow notifications to receive sound alarms on your phone or browser"}
                  </p>
                  {permission !== "denied" && (
                    <button
                      onClick={requestPermission}
                      className="mt-2 px-3 py-1.5 bg-amber-600 text-white text-xs font-bold rounded-lg hover:bg-amber-700 transition-colors"
                    >
                      Enable notifications
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Reminders list */}
            {reminders.length > 0 && (
              <div className="space-y-2">
                {reminders.map((r) => (
                  <ReminderRow
                    key={r.id}
                    reminder={r}
                    onToggle={() => toggleReminder(r.id)}
                    onRemove={() => removeReminder(r.id)}
                    onUpdate={(patch) => updateReminder(r.id, patch)}
                  />
                ))}
              </div>
            )}

            {/* Add custom reminder form */}
            {showCustomForm ? (
              <div className="rounded-xl border border-primary/30 bg-white p-3 space-y-3">
                <p className="text-xs font-bold text-primary uppercase tracking-widest">New Reminder</p>
                <input
                  className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="What do you want to be reminded about?"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddCustom()}
                  autoFocus
                />
                <div className="flex items-center gap-3">
                  <label className="text-xs font-semibold text-muted-foreground">Time:</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="text-sm font-mono border border-border rounded-lg px-2 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddCustom}
                    disabled={!newLabel.trim()}
                    className="flex-1 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:bg-primary/90 disabled:opacity-40 transition-colors"
                  >
                    Add Reminder
                  </button>
                  <button
                    onClick={() => setShowCustomForm(false)}
                    className="px-4 py-2 bg-muted text-muted-foreground text-xs font-semibold rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCustomForm(true)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-amber-300 bg-white/80 text-xs font-semibold text-amber-800 hover:bg-white transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Write your own reminder
                </button>
                <button
                  onClick={() => setShowPresets((v) => !v)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-amber-300 bg-white/80 text-xs font-semibold text-amber-800 hover:bg-white transition-colors"
                >
                  <BellRing className="w-3.5 h-3.5" />
                  {showPresets ? "Hide presets" : "Common presets"}
                  {showPresets ? <ChevronUp className="w-3 h-3 ml-auto" /> : <ChevronDown className="w-3 h-3 ml-auto" />}
                </button>
              </div>
            )}

            {/* Presets list */}
            {showPresets && (
              <div className="rounded-xl border border-amber-200 bg-white divide-y divide-amber-100 overflow-hidden">
                {presets.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handlePreset(p)}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-amber-50 transition-colors"
                  >
                    <span className="text-sm text-foreground font-medium">{p.label}</span>
                    <span className="text-xs text-muted-foreground font-mono ml-3 flex-shrink-0">
                      {p.time}{p.days.length > 0 && ` · ${p.days.map((d) => DAY_LABELS[d]).join(", ")}`}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Google Calendar info */}
            <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-blue-50 border border-blue-100">
              <Calendar className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-blue-700 leading-relaxed">
                Each reminder has a <span className="font-bold">📅</span> button — tap it to add a recurring event directly to <span className="font-bold">Google Calendar</span>.
              </p>
            </div>
          </div>
        </div>

        {/* ── Shmiras HaLashon daily reading ──────────────────────────────── */}
        <div className="rounded-xl border border-border bg-card px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-foreground">Daily Reminder: Shmiras HaLashon</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 font-serif">
                "Guard your tongue from evil and your lips from speaking deceit" — Psalms 34:14
              </p>
            </div>
            <a
              href="https://www.sefaria.org/Chofetz_Chaim"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-primary flex items-center gap-0.5 flex-shrink-0 ml-2 hover:text-primary/80"
            >
              <ExternalLink className="w-3 h-3" /> Sefaria
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

import { useState } from "react";
import { useReminders, playAlarmSound, type Reminder } from "@/hooks/use-reminders";
import { Bell, BellOff, BellRing, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const PRESETS = [
  { label: "Morning Shacharit", time: "07:00", days: [] },
  { label: "Count the Omer (after nightfall)", time: "20:30", days: [] },
  { label: "Daily Shmiras HaLashon learning", time: "09:00", days: [] },
  { label: "Mincha reminder", time: "14:00", days: [0, 1, 2, 3, 4, 6] },
  { label: "Maariv / Arvit", time: "19:30", days: [] },
  { label: "Erev Shabbat candle lighting reminder", time: "17:30", days: [5] },
  { label: "Havdalah / Motzei Shabbat", time: "21:00", days: [6] },
];

// ── Single reminder row ───────────────────────────────────────────────────────

function ReminderRow({
  reminder,
  onToggle,
  onRemove,
  onUpdate,
}: {
  reminder: Reminder;
  onToggle: () => void;
  onRemove: () => void;
  onUpdate: (patch: Partial<Reminder>) => void;
}) {
  const [editing, setEditing] = useState(false);

  const toggleDay = (d: number) => {
    const days = reminder.days.includes(d)
      ? reminder.days.filter((x) => x !== d)
      : [...reminder.days, d].sort();
    onUpdate({ days });
  };

  return (
    <div
      className={`rounded-lg border transition-colors ${
        reminder.enabled
          ? "border-primary/40 bg-primary/5"
          : "border-border bg-muted/30"
      }`}
    >
      {/* Main row */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        {/* Toggle */}
        <button
          onClick={onToggle}
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            reminder.enabled
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          }`}
          title={reminder.enabled ? "Disable" : "Enable"}
          data-testid="reminder-toggle"
        >
          {reminder.enabled
            ? <BellRing className="w-4 h-4" />
            : <BellOff className="w-4 h-4" />
          }
        </button>

        {/* Label + time */}
        <div className="flex-1 min-w-0">
          {editing ? (
            <input
              className="w-full text-sm font-medium border border-border rounded px-2 py-0.5 bg-background"
              value={reminder.label}
              onChange={(e) => onUpdate({ label: e.target.value })}
              onBlur={() => setEditing(false)}
              autoFocus
            />
          ) : (
            <p
              className={`text-sm font-medium truncate cursor-text ${
                reminder.enabled ? "text-foreground" : "text-muted-foreground"
              }`}
              onClick={() => setEditing(true)}
            >
              {reminder.label || "Tap to add label"}
            </p>
          )}
          <div className="flex items-center gap-2 mt-0.5">
            <input
              type="time"
              value={reminder.time}
              onChange={(e) => onUpdate({ time: e.target.value })}
              className="text-xs text-muted-foreground bg-transparent border-none outline-none cursor-pointer"
            />
            <span className="text-[10px] text-muted-foreground">
              {reminder.days.length === 0
                ? "Every day"
                : reminder.days.map((d) => DAY_LABELS[d]).join(", ")}
            </span>
          </div>
        </div>

        {/* Day picker toggle */}
        <button
          onClick={() => setEditing((v) => !v)}
          className="text-muted-foreground hover:text-foreground transition-colors"
          title="Edit days"
        >
          <ChevronDown className="w-4 h-4" />
        </button>

        {/* Delete */}
        <button
          onClick={onRemove}
          className="flex-shrink-0 text-muted-foreground hover:text-destructive transition-colors"
          title="Delete reminder"
          data-testid="reminder-delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Day-of-week picker (always shown below) */}
      <div className="px-3 pb-2.5 flex items-center gap-1 flex-wrap">
        {DAY_LABELS.map((label, i) => (
          <button
            key={i}
            onClick={() => toggleDay(i)}
            className={`w-8 h-6 rounded text-[10px] font-bold transition-colors ${
              reminder.days.length === 0
                ? "bg-primary/20 text-primary"
                : reminder.days.includes(i)
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
            title={reminder.days.length === 0 ? "Fires every day (click to restrict)" : label}
          >
            {label}
          </button>
        ))}
        <span className="text-[10px] text-muted-foreground ml-1">
          {reminder.days.length === 0 ? "Every day" : ""}
        </span>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function Reminders() {
  const {
    reminders, permission,
    requestPermission,
    addReminder, updateReminder, removeReminder, toggleReminder,
  } = useReminders();

  const [open, setOpen]           = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  const handleAddBlank = () => {
    const now  = new Date();
    const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes() + 5).padStart(2, "0")}`;
    addReminder({ label: "New reminder", time: hhmm, days: [], enabled: true });
  };

  const handlePreset = (p: typeof PRESETS[0]) => {
    addReminder({ ...p, enabled: true });
    setShowPresets(false);
  };

  const activeCount = reminders.filter((r) => r.enabled).length;

  return (
    <div className="rounded-2xl bg-amber-50 border border-amber-200 shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/30 transition-colors"
        data-testid="reminders-toggle"
      >
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-600" />
          <div className="text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
              Reminders &amp; Alarms
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {activeCount > 0
                ? `${activeCount} active reminder${activeCount !== 1 ? "s" : ""}`
                : "No active reminders"}
            </p>
          </div>
        </div>
        {open
          ? <ChevronUp  className="w-4 h-4 text-amber-500 flex-shrink-0" />
          : <ChevronDown className="w-4 h-4 text-amber-500 flex-shrink-0" />
        }
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3">

          {/* Notification permission banner */}
          {permission !== "granted" && (
            <div className="rounded-lg bg-amber-100 border border-amber-300 px-3 py-2.5 flex items-start gap-2">
              <Bell className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-amber-800">
                  {permission === "denied"
                    ? "Notifications blocked — enable them in browser settings to receive alarms"
                    : "Allow notifications to receive reminder alarms"}
                </p>
                {permission !== "denied" && (
                  <button
                    onClick={requestPermission}
                    className="mt-1.5 text-xs font-bold text-amber-700 underline underline-offset-2 hover:text-amber-900"
                  >
                    Enable notifications
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Reminders list */}
          {reminders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-2">
              No reminders yet — add one below or choose a preset.
            </p>
          ) : (
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

          {/* Add buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleAddBlank}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-amber-300 bg-white/60 text-xs font-semibold text-amber-800 hover:bg-white transition-colors"
              data-testid="add-reminder"
            >
              <Plus className="w-3.5 h-3.5" /> Custom reminder
            </button>
            <button
              onClick={() => setShowPresets((v) => !v)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-amber-300 bg-white/60 text-xs font-semibold text-amber-800 hover:bg-white transition-colors"
            >
              <Bell className="w-3.5 h-3.5" /> Add from presets
            </button>
          </div>

          {/* Presets list */}
          {showPresets && (
            <div className="rounded-lg border border-amber-200 bg-white/80 divide-y divide-amber-100">
              {PRESETS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handlePreset(p)}
                  className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-amber-50 transition-colors"
                >
                  <span className="text-sm text-foreground">{p.label}</span>
                  <span className="text-xs text-muted-foreground font-mono ml-3 flex-shrink-0">
                    {p.time}
                    {p.days.length > 0 && ` · ${p.days.map((d) => DAY_LABELS[d]).join(", ")}`}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Test alarm */}
          <button
            onClick={playAlarmSound}
            className="w-full text-center text-[11px] text-muted-foreground hover:text-foreground transition-colors py-1"
          >
            Test alarm sound
          </button>
        </div>
      )}
    </div>
  );
}

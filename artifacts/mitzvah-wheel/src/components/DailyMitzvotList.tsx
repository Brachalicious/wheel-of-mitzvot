import { useState } from "react";
import { ChevronDown, ChevronUp, Check } from "lucide-react";

// ── Data ─────────────────────────────────────────────────────────────────────

interface DailyMitzvah {
  name: string;
  hebrew?: string;
  source: string;
  note?: string;
}

interface Section {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  badgeColor: string;
  mitzvot: DailyMitzvah[];
}

const SECTIONS: Section[] = [
  {
    id: "everyone",
    title: "Everyone",
    subtitle: "Men and Women — every day",
    color: "#1d4ed8",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-800",
    badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
    mitzvot: [
      {
        name: "Morning Blessings (Birchot HaShachar)",
        hebrew: "בִּרְכוֹת הַשַּׁחַר",
        source: "Talmud Berakhot 60b",
        note: "Recite upon waking: modeh ani, blessings over bodily functions, Torah, etc.",
      },
      {
        name: "Recite Shema — morning (Kriat Shema)",
        hebrew: "קְרִיאַת שְׁמַע שַׁחֲרִית",
        source: "Devarim 6:7 · Berakhot 1:1–2",
        note: "Must be recited before the end of the third halachic hour of the day.",
      },
      {
        name: "Recite Shema — evening",
        hebrew: "קְרִיאַת שְׁמַע עַרְבִית",
        source: "Devarim 6:7 · Berakhot 1:1",
        note: "Recited after nightfall (tzet hakochavim), before midnight.",
      },
      {
        name: "Shacharit — Morning Prayer",
        hebrew: "תְּפִילַּת שַׁחֲרִית",
        source: "Talmud Berakhot 26b · Rambam, Tefillah 1:1",
        note: "Women: obligated in at least one daily prayer; may fulfill with Shacharit.",
      },
      {
        name: "Mincha — Afternoon Prayer",
        hebrew: "תְּפִילַּת מִנְחָה",
        source: "Talmud Berakhot 26b",
        note: "From half an hour after midday until sunset.",
      },
      {
        name: "Torah Study — at least some each day",
        hebrew: "תַּלְמוּד תּוֹרָה",
        source: "Devarim 6:7 · Kiddushin 29b · Shulchan Aruch YD 246",
        note: "A positive commandment for all. Even one verse or one halacha fulfills the minimum.",
      },
      {
        name: "Birkat HaMazon — Grace After Meals",
        hebrew: "בִּרְכַּת הַמָּזוֹן",
        source: "Devarim 8:10 · Berakhot 35a",
        note: "Biblical obligation after eating bread. Rabbinic obligation after other foods.",
      },
      {
        name: "Blessings before and after eating (Brachos)",
        hebrew: "בְּרָכוֹת עַל אֳכָלִים",
        source: "Talmud Berakhot 35a · OC 167",
        note: "Blessing before any food or drink; after-blessing (bracha acharona) as applicable.",
      },
      {
        name: "Love God — Ahavat Hashem",
        hebrew: "אַהֲבַת ה׳",
        source: "Devarim 6:5 · Sefer HaMitzvot, Positive #3",
        note: "Cultivate love for God through reflection, Torah, and acts of lovingkindness.",
      },
      {
        name: "Fear/Awe of God — Yirat Hashem",
        hebrew: "יִרְאַת ה׳",
        source: "Devarim 6:13 · Sefer HaMitzvot, Positive #4",
        note: "Maintain awareness that you stand before God in all actions.",
      },
      {
        name: "Do not take God's name in vain",
        hebrew: "לֹא תִשָּׂא אֶת שֵׁם ה׳ לַשָּׁוְא",
        source: "Shemot 20:7",
        note: "Includes careless oaths, empty blessings, and mentioning God's name unnecessarily.",
      },
      {
        name: "Honor Father and Mother",
        hebrew: "כַּבֵּד אֶת אָבִיךָ וְאֶת אִמֶּךָ",
        source: "Shemot 20:12 · Kiddushin 31a–b",
        note: "Show honor through speech, deference, and care, every day of their lives.",
      },
      {
        name: "Love your neighbor as yourself",
        hebrew: "וְאָהַבְתָּ לְרֵעֲךָ כָּמוֹךָ",
        source: "Vayikra 19:18 · Shabbat 31a",
        note: "Rabbi Akiva: this is the great principle of the Torah.",
      },
      {
        name: "Guard your speech — Shmiras HaLashon",
        hebrew: "שְׁמִירַת הַלָּשׁוֹן",
        source: "Vayikra 19:16 · Chofetz Chaim",
        note: "Do not speak lashon hara, rechilut, or motzi shem ra about any person.",
      },
      {
        name: "Do not hate your brother in your heart",
        hebrew: "לֹא תִשְׂנָא אֶת אָחִיךָ בִּלְבָבֶךָ",
        source: "Vayikra 19:17",
        note: "Harboring unexpressed hatred is itself a Torah prohibition.",
      },
      {
        name: "Do not bear a grudge",
        hebrew: "לֹא תִטֹּר",
        source: "Vayikra 19:18",
        note: "Do not keep score of past wrongs against you.",
      },
      {
        name: "Do not take revenge",
        hebrew: "לֹא תִקֹּם",
        source: "Vayikra 19:18",
        note: "Even verbally, do not act in retaliation for how someone treated you.",
      },
      {
        name: "Mezuzah — kiss/touch when passing",
        hebrew: "מְזוּזָה",
        source: "Devarim 6:9 · Menachot 33b",
        note: "A daily reminder that God's presence guards your home.",
      },
      {
        name: "Give charity — Tzedakah",
        hebrew: "צְדָקָה",
        source: "Devarim 15:8 · Shulchan Aruch YD 248",
        note: "A daily mitzvah obligation; even a small amount each day is praiseworthy.",
      },
      {
        name: "Rebuke your neighbor — Tochacha",
        hebrew: "תּוֹכֵחָה",
        source: "Vayikra 19:17",
        note: "Gently correct someone you see sinning, when it will be received.",
      },
      {
        name: "Walk in God's ways — Imitatio Dei",
        hebrew: "וְהָלַכְתָּ בִּדְרָכָיו",
        source: "Devarim 28:9 · Sotah 14a",
        note: "Be gracious, merciful, compassionate — as God is described in the Torah.",
      },
    ],
  },

  {
    id: "men",
    title: "Men",
    subtitle: "Time-bound positive mitzvot obligatory for men",
    color: "#1e40af",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    textColor: "text-indigo-800",
    badgeColor: "bg-indigo-100 text-indigo-700 border-indigo-200",
    mitzvot: [
      {
        name: "Tefillin — head and arm",
        hebrew: "תְּפִלִּין",
        source: "Shemot 13:9 · Menachot 34b · OC 25",
        note: "Worn during Shacharit (not on Shabbat or Yom Tov). Place arm-tefillin first, head-tefillin second.",
      },
      {
        name: "Tzitzit — wear a four-cornered garment",
        hebrew: "צִיצִית",
        source: "Bamidbar 15:38–40 · Menachot 41a · OC 8",
        note: "The mitzvah is to wear tzitzit. Customary to wear a tallit katan throughout the day.",
      },
      {
        name: "Maariv — Evening Prayer",
        hebrew: "תְּפִילַּת מַעֲרִיב",
        source: "Talmud Berakhot 26b · OC 235",
        note: "Technically rabbinic for men; women are generally exempt. Recited after nightfall.",
      },
      {
        name: "Prayer with a minyan (10 men)",
        hebrew: "תְּפִילָּה בְּצִיבּוּר",
        source: "Berakhot 6a · SA OC 90:9",
        note: "A higher level of tefillah. Strong obligation to seek a minyan whenever possible.",
      },
      {
        name: "Sefirat HaOmer — Count the Omer",
        hebrew: "סְפִירַת הָעֹמֶר",
        source: "Vayikra 23:15 · Menachot 65b",
        note: "Biblical for men during the 49 days between Pesach and Shavuot. Women: customary.",
      },
      {
        name: "Kiddush — Shabbat and Yom Tov sanctification",
        hebrew: "קִדּוּשׁ",
        source: "Shemot 20:8 · Pesachim 106a",
        note: "Biblically obligatory for men. Women are also obligated (Rashi); many poskim agree.",
      },
      {
        name: "Full Torah study obligation (three sedarim)",
        hebrew: "תַּלְמוּד תּוֹרָה — שְׁלֹשָׁה סְדָרִים",
        source: "Kiddushin 29b · SA YD 246:1",
        note: "Men must set fixed times morning and night. Goal: divide day into Torah, work, and other.",
      },
    ],
  },

  {
    id: "women",
    title: "Women",
    subtitle: "Mitzvot with specific or heightened obligation for women",
    color: "#9d174d",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    textColor: "text-rose-800",
    badgeColor: "bg-rose-100 text-rose-700 border-rose-200",
    mitzvot: [
      {
        name: "Shabbat candle lighting",
        hebrew: "הַדְלָקַת נֵרוֹת שַׁבָּת",
        source: "Shabbat 2:6 (Mishnah) · SA OC 263",
        note: "Primary obligation falls on women. Recite the bracha and light before sunset on Friday.",
      },
      {
        name: "Challah separation (Hafrashat Challah)",
        hebrew: "הַפְרָשַׁת חַלָּה",
        source: "Bamidbar 15:20 · SA YD 322",
        note: "Separate a portion of dough when baking. One of the three primary women's mitzvot.",
      },
      {
        name: "Taharat HaMishpacha — Family Purity",
        hebrew: "טָהֳרַת הַמִּשְׁפָּחָה",
        source: "Vayikra 15:19–28 · SA YD 183–200",
        note: "Observe the laws of niddah and immerse in the mikveh after the proper count.",
      },
      {
        name: "Daily prayer — at least Shacharit",
        hebrew: "תְּפִילָּה לְנָשִׁים",
        source: "Rambam, Tefillah 1:1–2 · SA OC 106",
        note: "Women are obligated in tefillah (Rambam). Opinion: one prayer daily fulfills the obligation.",
      },
      {
        name: "Niddah count — seven clean days",
        hebrew: "שִׁבְעָה נְקִיִּים",
        source: "Vayikra 15:28 · SA YD 196",
        note: "Count seven clean days after menstruation before immersion in the mikveh.",
      },
      {
        name: "Kiddush on Shabbat",
        hebrew: "קִדּוּשׁ",
        source: "Shemot 20:8 · Berakhot 20b",
        note: "Women are obligated in Kiddush (Talmud Berakhot 20b — they observed Shabbat at Sinai too).",
      },
      {
        name: "Avoid melacha on Shabbat",
        hebrew: "שְׁבִיתָה בְּשַׁבָּת",
        source: "Shemot 20:10",
        note: "The 39 prohibited labors apply equally to women. Women have an additional custom of not doing certain tasks post-candle lighting.",
      },
      {
        name: "Teach children Torah and mitzvot",
        hebrew: "חִנּוּךְ הַבָּנִים",
        source: "Devarim 6:7 · Kiddushin 29a",
        note: "Mothers carry the primary duty of Torah transmission in the home (Rashi, Bereishit 18:19).",
      },
      {
        name: "Tzniut — modest conduct",
        hebrew: "צְנִיעוּת",
        source: "Michah 6:8 · SA EH 115 · Mishneh Torah, De'ot 5",
        note: "Not only dress but conduct, speech, and dignified bearing in all settings.",
      },
    ],
  },
];

// ── Storage ───────────────────────────────────────────────────────────────────

function storageKey() {
  return "mitzvah-wheel-daily-mitzvot-" + new Date().toISOString().slice(0, 10);
}

function loadDone(): Set<string> {
  try {
    const raw = localStorage.getItem(storageKey());
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch { return new Set(); }
}

function saveDone(s: Set<string>) {
  try { localStorage.setItem(storageKey(), JSON.stringify([...s])); } catch { /* */ }
}

// ── Mitzvah row ───────────────────────────────────────────────────────────────

function MitzvahRow({
  mitzvah,
  done,
  color,
  onToggle,
}: {
  mitzvah: DailyMitzvah;
  done: boolean;
  color: string;
  onToggle: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`rounded-lg border transition-all ${
        done ? "border-green-300 bg-green-50" : "border-white/60 bg-white/60"
      }`}
    >
      <div className="flex items-start gap-2 px-3 py-2.5">
        {/* Checkbox */}
        <button
          onClick={onToggle}
          className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            done ? "border-green-500 bg-green-500" : "border-gray-300 bg-white"
          }`}
          data-testid="daily-mitzvah-check"
        >
          {done && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1">
            <div>
              <p className={`text-sm font-semibold leading-snug ${done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                {mitzvah.name}
              </p>
              {mitzvah.hebrew && (
                <p className="text-[11px] text-muted-foreground font-serif mt-0.5" dir="rtl" lang="he">
                  {mitzvah.hebrew}
                </p>
              )}
            </div>
            {mitzvah.note && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors mt-0.5"
              >
                {expanded
                  ? <ChevronUp className="w-3.5 h-3.5" />
                  : <ChevronDown className="w-3.5 h-3.5" />
                }
              </button>
            )}
          </div>

          <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">
            {mitzvah.source}
          </p>

          {expanded && mitzvah.note && (
            <p className="text-xs text-foreground mt-1.5 leading-relaxed border-t border-current/10 pt-1.5">
              {mitzvah.note}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

function MitzvahSection({
  section,
  done,
  onToggle,
}: {
  section: Section;
  done: Set<string>;
  onToggle: (id: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const completedCount = section.mitzvot.filter((m) =>
    done.has(`${section.id}:${m.name}`)
  ).length;

  return (
    <div className={`rounded-xl border ${section.borderColor} ${section.bgColor} overflow-hidden`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:brightness-95 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: section.color }} />
          <div className="text-left">
            <p className={`text-xs font-bold uppercase tracking-widest ${section.textColor}`}>
              {section.title}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{section.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {completedCount > 0 && (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${section.badgeColor}`}
            >
              {completedCount}/{section.mitzvot.length}
            </span>
          )}
          {open
            ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
            : <ChevronDown className="w-4 h-4 text-muted-foreground" />
          }
        </div>
      </button>

      {open && (
        <div className="px-3 pb-3 space-y-2">
          {section.mitzvot.map((m) => {
            const key = `${section.id}:${m.name}`;
            return (
              <MitzvahRow
                key={key}
                mitzvah={m}
                done={done.has(key)}
                color={section.color}
                onToggle={() => onToggle(key)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function DailyMitzvotList() {
  const [done, setDone] = useState<Set<string>>(loadDone);

  const toggle = (key: string) => {
    setDone((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      saveDone(next);
      return next;
    });
  };

  const totalMitzvot  = SECTIONS.reduce((sum, s) => sum + s.mitzvot.length, 0);
  const totalDone     = done.size;
  const pct           = Math.round((totalDone / totalMitzvot) * 100);

  return (
    <div className="space-y-3">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-foreground">
          Daily Mitzvot
        </h2>
        {totalDone > 0 && (
          <span className="text-xs text-muted-foreground font-medium">
            {totalDone} of {totalMitzvot} done ({pct}%)
          </span>
        )}
      </div>

      {/* Progress bar */}
      {totalDone > 0 && (
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-green-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}

      {/* Sections */}
      {SECTIONS.map((s) => (
        <MitzvahSection key={s.id} section={s} done={done} onToggle={toggle} />
      ))}

      <p className="text-[10px] text-muted-foreground text-center pt-1">
        Checkboxes reset daily · Tap any mitzvah for notes and source
      </p>
    </div>
  );
}

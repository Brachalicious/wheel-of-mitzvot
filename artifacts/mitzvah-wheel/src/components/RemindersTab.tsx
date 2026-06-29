import { useState, useEffect } from "react";
import {
  Bell, BellOff, BellRing, Plus, Trash2,
  Calendar, User, ChevronDown, ChevronUp,
  Check, Volume2, ExternalLink, Pencil, X,
  Link, DollarSign, TrendingUp, Heart,
} from "lucide-react";
import { useReminders, playAlarmSound, type Reminder } from "@/hooks/use-reminders";
import { CandleLighting } from "@/components/CandleLighting";

// ── Types ─────────────────────────────────────────────────────────────────────

interface MitzvahLink { label: string; url: string }

interface DailyMitzvah {
  id: string;
  label: string;
  hebrew: string;
  description: string;
  time: string;
  gender: "both" | "men" | "women";
  links?: MitzvahLink[];
}

interface DonationEntry {
  id: string;
  date: string;
  amount: number;
  currency: string;
  org: string;
  note: string;
}

interface IncomeEntry {
  id: string;
  date: string;
  amount: number;
  currency: string;
  source: string;
}

// ── Daily Mitzvot data ────────────────────────────────────────────────────────

const DAILY_MITZVOT: DailyMitzvah[] = [
  {
    id: "netilat", label: "Netilat Yadayim", hebrew: "נְטִילַת יָדַיִם",
    description: "Wash hands upon waking, before bread, after bathroom",
    time: "Morning", gender: "both",
    links: [
      { label: "How-to guide (Chabad)", url: "https://www.chabad.org/library/article_cdo/aid/682956/jewish/Washing-Hands.htm" },
      { label: "Laws of hand-washing (OU)", url: "https://www.ou.org/holidays/shabbat/netilat_yadayim/" },
    ],
  },
  {
    id: "shacharit-both", label: "Morning Prayer", hebrew: "שַׁחֲרִית",
    description: "At minimum: Shema + one blessing. Full Shacharit recommended.",
    time: "Morning", gender: "both",
    links: [
      { label: "Siddur (Sefaria)", url: "https://www.sefaria.org/Siddur_Ashkenaz,_Weekday,_Shacharit" },
      { label: "Prayer guide (Chabad)", url: "https://www.chabad.org/library/article_cdo/aid/682760/jewish/The-Morning-Prayer.htm" },
    ],
  },
  {
    id: "birkot", label: "Birkot HaShachar", hebrew: "בִּרְכּוֹת הַשַּׁחַר",
    description: "Morning blessings — said after washing hands",
    time: "Morning", gender: "both",
    links: [
      { label: "Full text (Sefaria)", url: "https://www.sefaria.org/Siddur_Ashkenaz,_Weekday,_Shacharit,_Preparatory_Prayers,_Morning_Blessings" },
    ],
  },
  {
    id: "tzedakah", label: "Tzedakah", hebrew: "צְדָקָה",
    description: "Give charity — even a small coin counts. Track your giving below.",
    time: "Any time", gender: "both",
    links: [
      { label: "Charidy — Jewish crowdfunding", url: "https://charidy.com" },
      { label: "Jewish Federations of NA", url: "https://www.jewishfederations.org" },
      { label: "Keren Ami — local giving", url: "https://www.kerenami.org" },
      { label: "Kupat Ha'ir — Bnei Brak", url: "https://www.kupat.org" },
      { label: "Tzedakah laws (Sefaria)", url: "https://www.sefaria.org/Shulchan_Arukh,_Yoreh_De'ah.247" },
    ],
  },
  {
    id: "mezuzah", label: "Touch the Mezuzah", hebrew: "מְזוּזָה",
    description: "Touch and kiss the mezuzah when entering your home",
    time: "Any time", gender: "both",
    links: [
      { label: "Mezuzah laws (Chabad)", url: "https://www.chabad.org/library/article_cdo/aid/256915/jewish/Mezuzah.htm" },
    ],
  },
  {
    id: "chesed", label: "Act of Kindness", hebrew: "חֶסֶד",
    description: "Do one act of kindness for another person today",
    time: "Any time", gender: "both",
  },
  {
    id: "shema-bed", label: "Kriat Shema (bedtime)", hebrew: "קְרִיאַת שְׁמַע עַל הַמִּטָּה",
    description: "Recite Shema before sleep for spiritual protection",
    time: "Night", gender: "both",
    links: [
      { label: "Text (Sefaria)", url: "https://www.sefaria.org/Siddur_Ashkenaz,_Weekday,_Kriat_Shema_Before_Sleep" },
    ],
  },
  {
    id: "torah", label: "Torah Study", hebrew: "תַּלְמוּד תּוֹרָה",
    description: "Learn at least one halacha or parsha passage today",
    time: "Any time", gender: "both",
    links: [
      { label: "Sefaria — free library", url: "https://www.sefaria.org" },
      { label: "Daf Yomi (OU)", url: "https://www.ou.org/torah/daf-yomi/" },
      { label: "Chabad daily study", url: "https://www.chabad.org/dailystudy/" },
      { label: "929 — daily Tanakh", url: "https://929.org.il/en" },
    ],
  },
  {
    id: "shmiras", label: "Shmiras HaLashon", hebrew: "שְׁמִירַת הַלָּשׁוֹן",
    description: "Guard your speech — avoid gossip and hurtful words",
    time: "All day", gender: "both",
    links: [
      { label: "Daily Chofetz Chaim lesson", url: "https://www.chofetzchaimusa.org" },
      { label: "Laws of speech (Sefaria)", url: "https://www.sefaria.org/Chofetz_Chaim" },
    ],
  },
  // Men only
  {
    id: "tefillin", label: "Tefillin", hebrew: "תְּפִלִּין",
    description: "Put on Tefillin before Shacharit — weekdays only (not Shabbat or Yom Tov)",
    time: "Morning", gender: "men",
    links: [
      { label: "How to put on Tefillin (Chabad)", url: "https://www.chabad.org/library/article_cdo/aid/144025/jewish/How-to-Put-on-Tefillin.htm" },
      { label: "Video tutorial (Chabad)", url: "https://www.chabad.org/multimedia/video_cdo/aid/1484510/jewish/How-To-Put-On-Tefillin.htm" },
      { label: "Buy Tefillin (Judaica World)", url: "https://www.judaicaworld.com/tefillin/" },
      { label: "Tefillin laws (Sefaria)", url: "https://www.sefaria.org/Shulchan_Arukh,_Orach_Chayyim.25" },
    ],
  },
  {
    id: "tzitzit", label: "Tzitzit / Tallit", hebrew: "צִיצִית / טַלִּית",
    description: "Wear tzitzit throughout the day",
    time: "Morning", gender: "men",
    links: [
      { label: "Tzitzit guide (Chabad)", url: "https://www.chabad.org/library/article_cdo/aid/530104/jewish/Tzitzit.htm" },
      { label: "Tallit laws (Sefaria)", url: "https://www.sefaria.org/Shulchan_Arukh,_Orach_Chayyim.8" },
    ],
  },
  {
    id: "shacharit-men", label: "Full Shacharit", hebrew: "שַׁחֲרִית",
    description: "Complete morning service including Amidah, Tachanun on weekdays",
    time: "Morning", gender: "men",
    links: [
      { label: "Siddur Ashkenaz (Sefaria)", url: "https://www.sefaria.org/Siddur_Ashkenaz,_Weekday,_Shacharit" },
    ],
  },
  {
    id: "mincha-men", label: "Mincha", hebrew: "מִנְחָה",
    description: "Afternoon prayer — Amidah + Ashrei",
    time: "Afternoon", gender: "men",
    links: [
      { label: "Mincha text (Sefaria)", url: "https://www.sefaria.org/Siddur_Ashkenaz,_Weekday,_Minchah" },
    ],
  },
  {
    id: "maariv", label: "Maariv", hebrew: "מַעֲרִיב",
    description: "Evening prayer after nightfall",
    time: "Evening", gender: "men",
    links: [
      { label: "Maariv text (Sefaria)", url: "https://www.sefaria.org/Siddur_Ashkenaz,_Weekday,_Maariv" },
    ],
  },
  {
    id: "kriat-shema-men", label: "Kriat Shema (morning)", hebrew: "קְרִיאַת שְׁמַע שֶׁל שַׁחֲרִית",
    description: "Recite Shema with its blessings during Shacharit",
    time: "Morning", gender: "men",
  },
  // Women only
  {
    id: "shacharit-women", label: "Tefillah (at least once)", hebrew: "תְּפִלָּה",
    description: "Women are obligated in daily prayer — at minimum Shacharit or one heartfelt request",
    time: "Morning", gender: "women",
    links: [
      { label: "Women's prayer guide (Chabad)", url: "https://www.chabad.org/library/article_cdo/aid/704563/jewish/Womens-Prayer.htm" },
    ],
  },
  {
    id: "candle-check", label: "Shabbat Candle Reminder", hebrew: "נֵרוֹת שַׁבָּת",
    description: "Check candle-lighting time for this Friday",
    time: "Any time", gender: "women",
    links: [
      { label: "Find candle-lighting time (Chabad)", url: "https://www.chabad.org/calendar/candlelighting.htm" },
      { label: "Candle lighting laws (Sefaria)", url: "https://www.sefaria.org/Shulchan_Arukh,_Orach_Chayyim.263" },
    ],
  },
  {
    id: "challah", label: "Hafrashat Challah", hebrew: "הַפְרָשַׁת חַלָּה",
    description: "Separate challah when baking bread (if baking today)",
    time: "When baking", gender: "women",
    links: [
      { label: "Challah guide (Chabad)", url: "https://www.chabad.org/library/article_cdo/aid/483636/jewish/Taking-Challah.htm" },
    ],
  },
  {
    id: "family-purity", label: "Family Purity (Taharas HaMishpacha)", hebrew: "טַהֲרַת הַמִּשְׁפָּחָה",
    description: "Follow the laws of niddah and mikveh",
    time: "Ongoing", gender: "women",
    links: [
      { label: "Mikveh finder", url: "https://www.mikveh.org" },
      { label: "Taharas HaMishpacha (Chabad)", url: "https://www.chabad.org/library/article_cdo/aid/481218/jewish/Family-Purity.htm" },
    ],
  },
  {
    id: "mincha-women", label: "Mincha", hebrew: "מִנְחָה",
    description: "Afternoon prayer — recommended for women too",
    time: "Afternoon", gender: "women",
    links: [
      { label: "Mincha text (Sefaria)", url: "https://www.sefaria.org/Siddur_Ashkenaz,_Weekday,_Minchah" },
    ],
  },
];

// ── localStorage keys & helpers ───────────────────────────────────────────────

const GENDER_KEY        = "mitzvah-wheel-gender";
const PROFILE_KEY       = "mitzvah-wheel-profile-name";
const DONE_PREFIX       = "mitzvah-wheel-daily-done-";
const CUSTOM_LINKS_KEY  = "mitzvah-wheel-custom-links";
const DONATIONS_KEY     = "mitzvah-wheel-donations";
const INCOME_KEY        = "mitzvah-wheel-income";

function todayKey() { return new Date().toISOString().slice(0, 10); }

function loadDone(): Set<string> {
  try { const r = localStorage.getItem(DONE_PREFIX + todayKey()); return r ? new Set(JSON.parse(r)) : new Set(); }
  catch { return new Set(); }
}
function saveDoneSet(s: Set<string>) {
  try { localStorage.setItem(DONE_PREFIX + todayKey(), JSON.stringify([...s])); } catch { /* */ }
}

function loadCustomLinks(): Record<string, MitzvahLink[]> {
  try { const r = localStorage.getItem(CUSTOM_LINKS_KEY); return r ? JSON.parse(r) : {}; }
  catch { return {}; }
}
function saveCustomLinks(m: Record<string, MitzvahLink[]>) {
  try { localStorage.setItem(CUSTOM_LINKS_KEY, JSON.stringify(m)); } catch { /* */ }
}

function loadDonations(): DonationEntry[] {
  try { const r = localStorage.getItem(DONATIONS_KEY); return r ? JSON.parse(r) : []; }
  catch { return []; }
}
function saveDonations(d: DonationEntry[]) {
  try { localStorage.setItem(DONATIONS_KEY, JSON.stringify(d)); } catch { /* */ }
}

function loadIncome(): IncomeEntry[] {
  try { const r = localStorage.getItem(INCOME_KEY); return r ? JSON.parse(r) : []; }
  catch { return []; }
}
function saveIncome(e: IncomeEntry[]) {
  try { localStorage.setItem(INCOME_KEY, JSON.stringify(e)); } catch { /* */ }
}

// ── Google Calendar URL ───────────────────────────────────────────────────────

function buildGoogleCalUrl(label: string, time: string) {
  const now = new Date();
  const [hh, mm] = time.split(":").map(Number);
  const start = new Date(now);
  start.setHours(hh, mm, 0, 0);
  if (start <= now) start.setDate(start.getDate() + 1);
  const end = new Date(start);
  end.setMinutes(end.getMinutes() + 15);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const p = new URLSearchParams({ action: "TEMPLATE", text: label, dates: `${fmt(start)}/${fmt(end)}`, details: "Set by Wheel of Mitzvot" });
  p.set("recur", "RRULE:FREQ=DAILY");
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

// ── Tzedakah + Maaser Tracker ────────────────────────────────────────────────

function fmt$(n: number) { return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

function TzedakahTracker() {
  const [donations, setDonations] = useState<DonationEntry[]>(loadDonations);
  const [income, setIncome] = useState<IncomeEntry[]>(loadIncome);
  const [view, setView] = useState<"summary" | "donations" | "income">("summary");

  // Donation form
  const [dAmt, setDAmt] = useState("");
  const [dOrg, setDOrg] = useState("");
  const [dNote, setDNote] = useState("");
  const [dDate, setDDate] = useState(todayKey());
  const [dCurrency, setDCurrency] = useState("USD");
  const [showDForm, setShowDForm] = useState(false);

  // Income form
  const [iAmt, setIAmt] = useState("");
  const [iSrc, setISrc] = useState("");
  const [iDate, setIDate] = useState(todayKey());
  const [iCurrency, setICurrency] = useState("USD");
  const [showIForm, setShowIForm] = useState(false);

  useEffect(() => { saveDonations(donations); }, [donations]);
  useEffect(() => { saveIncome(income); }, [income]);

  const totalIncome   = income.reduce((s, e) => s + e.amount, 0);
  const maaserDue     = totalIncome * 0.1;
  const totalDonated  = donations.reduce((s, d) => s + d.amount, 0);
  const maaserBalance = maaserDue - totalDonated;

  const addDonation = () => {
    const amt = parseFloat(dAmt);
    if (!amt || amt <= 0) return;
    const next = [{ id: crypto.randomUUID(), date: dDate, amount: amt, currency: dCurrency, org: dOrg.trim() || "Unspecified", note: dNote.trim() }, ...donations];
    setDonations(next);
    setDAmt(""); setDOrg(""); setDNote(""); setShowDForm(false);
  };

  const addIncome = () => {
    const amt = parseFloat(iAmt);
    if (!amt || amt <= 0) return;
    const next = [{ id: crypto.randomUUID(), date: iDate, amount: amt, currency: iCurrency, source: iSrc.trim() || "Income" }, ...income];
    setIncome(next);
    setIAmt(""); setISrc(""); setShowIForm(false);
  };

  const removeDonation = (id: string) => setDonations((p) => p.filter((d) => d.id !== id));
  const removeIncome   = (id: string) => setIncome((p) => p.filter((e) => e.id !== id));

  return (
    <div className="mt-2 rounded-xl border border-green-200 bg-green-50/60 overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-green-200 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-green-600" />
          <span className="text-xs font-bold text-green-800">Tzedakah &amp; Maaser Tracker</span>
        </div>
        <div className="flex gap-1">
          {(["summary","donations","income"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)}
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors capitalize ${view === v ? "bg-green-600 text-white" : "text-green-700 hover:bg-green-100"}`}>
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3 space-y-3">

        {/* ── Summary ── */}
        {view === "summary" && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-white border border-green-200 p-2.5 text-center">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-bold">Total Income logged</p>
                <p className="text-base font-bold text-foreground mt-0.5">${fmt$(totalIncome)}</p>
              </div>
              <div className="rounded-lg bg-white border border-green-200 p-2.5 text-center">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-bold">Maaser due (10%)</p>
                <p className="text-base font-bold text-green-700 mt-0.5">${fmt$(maaserDue)}</p>
              </div>
              <div className="rounded-lg bg-white border border-green-200 p-2.5 text-center">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-bold">Total donated</p>
                <p className="text-base font-bold text-foreground mt-0.5">${fmt$(totalDonated)}</p>
              </div>
              <div className={`rounded-lg border p-2.5 text-center ${maaserBalance <= 0 ? "bg-green-100 border-green-300" : "bg-amber-50 border-amber-200"}`}>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-bold">
                  {maaserBalance <= 0 ? "Maaser fulfilled ✓" : "Still owed"}
                </p>
                <p className={`text-base font-bold mt-0.5 ${maaserBalance <= 0 ? "text-green-700" : "text-amber-700"}`}>
                  {maaserBalance <= 0 ? `+$${fmt$(-maaserBalance)}` : `$${fmt$(maaserBalance)}`}
                </p>
              </div>
            </div>

            {totalIncome > 0 && (
              <div className="rounded-lg bg-white border border-green-200 p-2 space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
                  <span>Maaser progress</span>
                  <span>{maaserDue > 0 ? Math.min(100, Math.round((totalDonated / maaserDue) * 100)) : 0}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${maaserDue > 0 ? Math.min(100, (totalDonated / maaserDue) * 100) : 0}%` }}
                  />
                </div>
              </div>
            )}

            <p className="text-[10px] text-green-700 italic leading-relaxed font-serif text-center">
              "Aser t'aser" — Tithe, and you will become wealthy (Devarim 14:22, interpreted by Chazal as God's promise to the generous)
            </p>

            <div className="flex gap-2">
              <button onClick={() => { setView("donations"); setShowDForm(true); }}
                className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-green-600 text-white text-xs font-bold hover:bg-green-700 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Log donation
              </button>
              <button onClick={() => { setView("income"); setShowIForm(true); }}
                className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg border border-green-300 bg-white text-xs font-bold text-green-700 hover:bg-green-50 transition-colors">
                <TrendingUp className="w-3.5 h-3.5" /> Log income
              </button>
            </div>
          </div>
        )}

        {/* ── Donations ── */}
        {view === "donations" && (
          <div className="space-y-2">
            {showDForm ? (
              <div className="rounded-xl border border-green-300 bg-white p-3 space-y-2">
                <p className="text-xs font-bold text-green-800">New Donation</p>
                <div className="flex gap-2">
                  <select value={dCurrency} onChange={(e) => setDCurrency(e.target.value)}
                    className="text-sm border border-border rounded-lg px-2 py-1.5 bg-background focus:outline-none w-20">
                    {["USD","ILS","GBP","EUR","CAD","AUD"].map((c) => <option key={c}>{c}</option>)}
                  </select>
                  <input type="number" min="0" step="0.01" placeholder="Amount" value={dAmt} onChange={(e) => setDAmt(e.target.value)}
                    className="flex-1 text-sm border border-border rounded-lg px-3 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-primary" autoFocus />
                </div>
                <input placeholder="Organization / recipient" value={dOrg} onChange={(e) => setDOrg(e.target.value)}
                  className="w-full text-sm border border-border rounded-lg px-3 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-primary" />
                <input placeholder="Note (optional)" value={dNote} onChange={(e) => setDNote(e.target.value)}
                  className="w-full text-sm border border-border rounded-lg px-3 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-primary" />
                <input type="date" value={dDate} onChange={(e) => setDDate(e.target.value)}
                  className="w-full text-sm border border-border rounded-lg px-3 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-primary" />
                <div className="flex gap-2">
                  <button onClick={addDonation} disabled={!dAmt || parseFloat(dAmt) <= 0}
                    className="flex-1 py-2 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 disabled:opacity-40 transition-colors">
                    Save Donation
                  </button>
                  <button onClick={() => setShowDForm(false)}
                    className="px-4 py-2 border border-border text-xs font-semibold rounded-lg hover:bg-muted transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowDForm(true)}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-green-300 bg-white text-xs font-semibold text-green-700 hover:bg-green-50 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Log a donation
              </button>
            )}

            {donations.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-3 italic">No donations logged yet</p>
            ) : (
              <div className="space-y-1.5">
                {donations.map((d) => (
                  <div key={d.id} className="flex items-start gap-2 px-3 py-2 rounded-lg bg-white border border-green-100">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-bold text-green-700">{d.currency} {fmt$(d.amount)}</span>
                        <span className="text-xs text-foreground font-medium truncate">{d.org}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-muted-foreground">{d.date}</span>
                        {d.note && <span className="text-[10px] text-muted-foreground italic truncate">{d.note}</span>}
                      </div>
                    </div>
                    <button onClick={() => removeDonation(d.id)} className="text-muted-foreground hover:text-destructive flex-shrink-0 mt-0.5">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <p className="text-xs text-right text-green-700 font-bold pr-1">Total: ${fmt$(totalDonated)}</p>
              </div>
            )}
          </div>
        )}

        {/* ── Income ── */}
        {view === "income" && (
          <div className="space-y-2">
            {showIForm ? (
              <div className="rounded-xl border border-green-300 bg-white p-3 space-y-2">
                <p className="text-xs font-bold text-green-800">Log Income</p>
                <div className="flex gap-2">
                  <select value={iCurrency} onChange={(e) => setICurrency(e.target.value)}
                    className="text-sm border border-border rounded-lg px-2 py-1.5 bg-background focus:outline-none w-20">
                    {["USD","ILS","GBP","EUR","CAD","AUD"].map((c) => <option key={c}>{c}</option>)}
                  </select>
                  <input type="number" min="0" step="0.01" placeholder="Amount" value={iAmt} onChange={(e) => setIAmt(e.target.value)}
                    className="flex-1 text-sm border border-border rounded-lg px-3 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-primary" autoFocus />
                </div>
                <input placeholder="Source (salary, freelance, gift…)" value={iSrc} onChange={(e) => setISrc(e.target.value)}
                  className="w-full text-sm border border-border rounded-lg px-3 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-primary" />
                <input type="date" value={iDate} onChange={(e) => setIDate(e.target.value)}
                  className="w-full text-sm border border-border rounded-lg px-3 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-primary" />
                <div className="flex gap-2">
                  <button onClick={addIncome} disabled={!iAmt || parseFloat(iAmt) <= 0}
                    className="flex-1 py-2 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 disabled:opacity-40 transition-colors">
                    Save Income
                  </button>
                  <button onClick={() => setShowIForm(false)}
                    className="px-4 py-2 border border-border text-xs font-semibold rounded-lg hover:bg-muted transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowIForm(true)}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-green-300 bg-white text-xs font-semibold text-green-700 hover:bg-green-50 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Log income
              </button>
            )}

            {income.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-3 italic">No income logged yet — add income to calculate maaser due</p>
            ) : (
              <div className="space-y-1.5">
                {income.map((e) => (
                  <div key={e.id} className="flex items-start gap-2 px-3 py-2 rounded-lg bg-white border border-green-100">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-bold text-foreground">{e.currency} {fmt$(e.amount)}</span>
                        <span className="text-xs text-muted-foreground truncate">{e.source}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{e.date}</span>
                    </div>
                    <button onClick={() => removeIncome(e.id)} className="text-muted-foreground hover:text-destructive flex-shrink-0 mt-0.5">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <div className="flex justify-between text-xs font-bold pr-1 pt-1">
                  <span className="text-muted-foreground">Total income: ${fmt$(totalIncome)}</span>
                  <span className="text-green-700">Maaser due: ${fmt$(maaserDue)}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Mitzvah row ───────────────────────────────────────────────────────────────

function MitzvahRow({
  mitzvah, isDone, onToggle, customLinks, onSaveCustomLinks,
}: {
  mitzvah: DailyMitzvah;
  isDone: boolean;
  onToggle: () => void;
  customLinks: MitzvahLink[];
  onSaveCustomLinks: (links: MitzvahLink[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [addingLink, setAddingLink] = useState(false);
  const [linkLabel, setLinkLabel] = useState("");
  const [linkUrl, setLinkUrl]   = useState("");

  const allLinks = [...(mitzvah.links ?? []), ...customLinks];

  const saveNewLink = () => {
    if (!linkUrl.trim()) return;
    const url = linkUrl.trim().startsWith("http") ? linkUrl.trim() : `https://${linkUrl.trim()}`;
    onSaveCustomLinks([...customLinks, { label: linkLabel.trim() || url, url }]);
    setLinkLabel(""); setLinkUrl(""); setAddingLink(false);
  };

  const removeCustomLink = (i: number) => {
    onSaveCustomLinks(customLinks.filter((_, idx) => idx !== i));
  };

  return (
    <div className={`border-b border-border/40 last:border-0 transition-colors ${isDone ? "bg-green-50/60" : ""}`}>
      {/* Main row */}
      <div className="flex items-start gap-3 px-4 py-3">
        <button
          onClick={onToggle}
          className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-colors ${isDone ? "border-green-500 bg-green-500" : "border-gray-300 hover:border-primary/60"}`}
        >
          {isDone && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className={`text-sm font-semibold ${isDone ? "line-through text-green-700" : "text-foreground"}`}>
              {mitzvah.label}
            </span>
            <span className="text-xs font-serif text-muted-foreground" dir="rtl" lang="he">{mitzvah.hebrew}</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed font-serif">{mitzvah.description}</p>
        </div>
        {/* Expand toggle (only if has links or is tzedakah) */}
        {(allLinks.length > 0 || mitzvah.id === "tzedakah") && (
          <button onClick={() => setOpen((v) => !v)} className="flex-shrink-0 text-muted-foreground hover:text-foreground mt-0.5">
            {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Expanded panel */}
      {open && (
        <div className="px-4 pb-3 space-y-2.5">
          {/* Links */}
          {allLinks.length > 0 && (
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Resources</p>
              <div className="flex flex-wrap gap-1.5">
                {(mitzvah.links ?? []).map((l, i) => (
                  <a key={i} href={l.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/8 border border-primary/20 text-[11px] text-primary font-medium hover:bg-primary/15 transition-colors">
                    <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
                    {l.label}
                  </a>
                ))}
                {customLinks.map((l, i) => (
                  <div key={i} className="flex items-center gap-0.5 pl-2.5 pr-1 py-1 rounded-full bg-secondary border border-border text-[11px] text-foreground font-medium">
                    <a href={l.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary">
                      <Link className="w-2.5 h-2.5 flex-shrink-0" />
                      {l.label}
                    </a>
                    <button onClick={() => removeCustomLink(i)} className="ml-1 text-muted-foreground hover:text-destructive">
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add custom link */}
          {addingLink ? (
            <div className="rounded-lg border border-border bg-background p-2.5 space-y-2">
              <input placeholder="Label (e.g. My shul's charity)"
                value={linkLabel} onChange={(e) => setLinkLabel(e.target.value)}
                className="w-full text-xs border border-border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary" />
              <input placeholder="URL (e.g. myshul.org/donate)"
                value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveNewLink()}
                className="w-full text-xs border border-border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary" autoFocus />
              <div className="flex gap-2">
                <button onClick={saveNewLink} disabled={!linkUrl.trim()}
                  className="flex-1 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:bg-primary/90 disabled:opacity-40 transition-colors">
                  Add link
                </button>
                <button onClick={() => setAddingLink(false)}
                  className="px-3 py-1.5 border border-border text-xs rounded-lg hover:bg-muted transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setAddingLink(true)}
              className="flex items-center gap-1 text-[11px] text-primary font-semibold hover:text-primary/80 transition-colors">
              <Plus className="w-3 h-3" /> Add your own link
            </button>
          )}

          {/* Tzedakah tracker — only for tzedakah row */}
          {mitzvah.id === "tzedakah" && <TzedakahTracker />}
        </div>
      )}
    </div>
  );
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

  const commitLabel = () => { onUpdate({ label }); setEditing(false); };
  const toggleDay = (d: number) => {
    const days = reminder.days.includes(d) ? reminder.days.filter((x) => x !== d) : [...reminder.days, d].sort();
    onUpdate({ days });
  };
  const gcalUrl = buildGoogleCalUrl(reminder.label, reminder.time);

  return (
    <div className={`rounded-xl border transition-all ${reminder.enabled ? "border-primary/40 bg-primary/5" : "border-border bg-muted/20"}`}>
      <div className="flex items-center gap-2.5 px-3 py-3">
        <button onClick={onToggle}
          className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors shadow-sm ${reminder.enabled ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
          {reminder.enabled ? <BellRing className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
        </button>
        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="flex items-center gap-1">
              <input className="flex-1 text-sm font-medium border border-primary/40 rounded-lg px-2 py-1 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                value={label} onChange={(e) => setLabel(e.target.value)} onKeyDown={(e) => e.key === "Enter" && commitLabel()} autoFocus />
              <button onClick={commitLabel} className="text-primary"><Check className="w-4 h-4" /></button>
              <button onClick={() => { setLabel(reminder.label); setEditing(false); }} className="text-muted-foreground"><X className="w-4 h-4" /></button>
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
            <input type="time" value={reminder.time} onChange={(e) => onUpdate({ time: e.target.value })}
              className="text-xs text-primary font-mono bg-transparent border-none outline-none cursor-pointer font-bold" />
            <span className="text-[10px] text-muted-foreground">
              {reminder.days.length === 0 ? "Every day" : reminder.days.map((d) => DAY_LABELS[d]).join(", ")}
            </span>
          </div>
        </div>
        <a href={gcalUrl} target="_blank" rel="noopener noreferrer" title="Add to Google Calendar"
          className="flex-shrink-0 text-muted-foreground hover:text-blue-600 transition-colors">
          <Calendar className="w-4 h-4" />
        </a>
        <button onClick={onRemove} className="flex-shrink-0 text-muted-foreground hover:text-destructive transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="px-3 pb-3 flex items-center gap-1 flex-wrap">
        {DAY_LABELS.map((day, i) => (
          <button key={i} onClick={() => toggleDay(i)}
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
              reminder.days.length === 0 ? "bg-primary/15 text-primary"
              : reminder.days.includes(i) ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
            {day}
          </button>
        ))}
        {reminder.days.length === 0 && <span className="text-[10px] text-muted-foreground ml-1">Every day</span>}
      </div>
    </div>
  );
}

const PRESETS_MEN = [
  { label: "Tefillin & Shacharit", time: "07:00", days: [0,1,2,3,4] },
  { label: "Mincha reminder", time: "14:30", days: [] as number[] },
  { label: "Maariv / Arvit", time: "19:30", days: [] as number[] },
  { label: "Count the Omer (after nightfall)", time: "20:30", days: [] as number[] },
  { label: "Daily Torah study", time: "21:00", days: [] as number[] },
  { label: "Erev Shabbat candle lighting", time: "17:30", days: [5] },
  { label: "Havdalah / Motzei Shabbat", time: "21:00", days: [6] },
  { label: "Kriat Shema al HaMitah", time: "22:30", days: [] as number[] },
];
const PRESETS_WOMEN = [
  { label: "Morning prayer & blessings", time: "08:00", days: [] as number[] },
  { label: "Mincha (afternoon prayer)", time: "14:30", days: [] as number[] },
  { label: "Erev Shabbat candle lighting", time: "17:30", days: [5] },
  { label: "Havdalah / Motzei Shabbat", time: "21:00", days: [6] },
  { label: "Count the Omer (after nightfall)", time: "20:30", days: [] as number[] },
  { label: "Daily Torah or Mussar study", time: "21:00", days: [] as number[] },
  { label: "Kriat Shema al HaMitah", time: "22:30", days: [] as number[] },
  { label: "Shmiras HaLashon learning", time: "09:00", days: [] as number[] },
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
  const [customLinksMap, setCustomLinksMap] = useState<Record<string, MitzvahLink[]>>(loadCustomLinks);
  const [showPresets, setShowPresets] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newTime, setNewTime] = useState(() => {
    const n = new Date(); return `${String(n.getHours()).padStart(2,"0")}:${String(n.getMinutes()).padStart(2,"0")}`;
  });

  const { reminders, permission, requestPermission, addReminder, updateReminder, removeReminder, toggleReminder } = useReminders();

  useEffect(() => { if (gender) localStorage.setItem(GENDER_KEY, gender); }, [gender]);
  useEffect(() => { if (profileName) localStorage.setItem(PROFILE_KEY, profileName); }, [profileName]);

  const toggleDone = (id: string) => {
    setDone((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      saveDoneSet(next);
      return next;
    });
  };

  const updateCustomLinks = (mitzvahId: string, links: MitzvahLink[]) => {
    const next = { ...customLinksMap, [mitzvahId]: links };
    setCustomLinksMap(next);
    saveCustomLinks(next);
  };

  const todayMitzvot = DAILY_MITZVOT.filter((m) => m.gender === "both" || m.gender === gender);
  const presets = gender === "women" ? PRESETS_WOMEN : PRESETS_MEN;
  const activeCount = reminders.filter((r) => r.enabled).length;
  const doneCount = done.size;

  const handleAddCustomReminder = () => {
    if (!newLabel.trim()) return;
    addReminder({ label: newLabel.trim(), time: newTime, days: [], enabled: true });
    setNewLabel(""); setShowCustomForm(false);
  };

  const saveProfile = () => { if (tempName.trim()) setProfileName(tempName.trim()); setEditingProfile(false); };

  // ── Gender picker ─────────────────────────────────────────────────────────

  if (!gender) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-8 p-6">
        <div className="text-center space-y-2">
          <Bell className="w-10 h-10 text-primary mx-auto" />
          <h2 className="text-xl font-bold text-foreground">Set Up Your Reminders</h2>
          <p className="text-sm text-muted-foreground font-serif max-w-xs">
            Choose your gender to see your personalised daily mitzvot checklist and recommended presets.
          </p>
        </div>
        <div className="flex gap-4 w-full max-w-xs">
          {([["men","👨","Tefillin, Tzitzit,\n3× daily prayer"],["women","👩","Candle lighting,\nFamily purity, Prayer"]] as const).map(([g, emoji, desc]) => (
            <button key={g} onClick={() => setGender(g as "men"|"women")}
              className="flex-1 flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary transition-all active:scale-[0.97]">
              <span className="text-4xl">{emoji}</span>
              <span className="text-sm font-bold text-foreground capitalize">{g === "men" ? "Man" : "Woman"}</span>
              <span className="text-[11px] text-muted-foreground text-center leading-tight whitespace-pre-line">{desc}</span>
            </button>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground text-center max-w-xs">Saved locally on your device. Change anytime.</p>
      </div>
    );
  }

  // ── Main view ─────────────────────────────────────────────────────────────

  const timeGroups = ["Morning","Afternoon","Evening","Night","All day","Any time","Ongoing","When baking"] as const;

  return (
    <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="p-4 space-y-4 max-w-2xl mx-auto">

        {/* Profile */}
        <div className="rounded-xl border border-border bg-card px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            {editingProfile ? (
              <div className="flex items-center gap-2">
                <input className="flex-1 text-sm border border-border rounded-lg px-2 py-1 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Your name…" value={tempName} onChange={(e) => setTempName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveProfile()} autoFocus />
                <button onClick={saveProfile} className="text-primary font-semibold text-sm">Save</button>
                <button onClick={() => setEditingProfile(false)} className="text-muted-foreground text-sm">Cancel</button>
              </div>
            ) : (
              <>
                <p className="text-sm font-semibold text-foreground">{profileName || "Add your name"}</p>
                <p className="text-[11px] text-muted-foreground">{gender === "men" ? "👨 Men's mitzvot" : "👩 Women's mitzvot"} · saved locally</p>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {!editingProfile && (
              <button onClick={() => { setTempName(profileName); setEditingProfile(true); }}
                className="text-[11px] text-primary font-semibold hover:text-primary/80">
                {profileName ? "Edit" : "Set name"}
              </button>
            )}
            <button onClick={() => setGender(null)} className="text-[10px] text-muted-foreground hover:text-foreground underline underline-offset-1">Switch</button>
          </div>
        </div>

        {/* Daily Mitzvot Checklist */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Check className="w-4 h-4 text-green-600" />
                Today's Mitzvot
              </h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">{doneCount}/{todayMitzvot.length} completed · tap ▾ for links &amp; tracker · resets midnight</p>
            </div>
            {doneCount > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${(doneCount / todayMitzvot.length) * 100}%` }} />
                </div>
                <span className="text-xs font-bold text-green-600">{Math.round((doneCount / todayMitzvot.length) * 100)}%</span>
              </div>
            )}
          </div>

          {timeGroups.map((timeLabel) => {
            const items = todayMitzvot.filter((m) => m.time === timeLabel);
            if (items.length === 0) return null;
            return (
              <div key={timeLabel}>
                <div className="px-4 py-1.5 bg-muted/30 border-y border-border/40">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{timeLabel}</p>
                </div>
                {items.map((m) => (
                  <MitzvahRow
                    key={m.id}
                    mitzvah={m}
                    isDone={done.has(m.id)}
                    onToggle={() => toggleDone(m.id)}
                    customLinks={customLinksMap[m.id] ?? []}
                    onSaveCustomLinks={(links) => updateCustomLinks(m.id, links)}
                  />
                ))}
              </div>
            );
          })}
        </div>

        {/* Reminders & Alarms */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 overflow-hidden">
          <div className="px-4 py-3 border-b border-amber-200 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-amber-600" />
                Reminders &amp; Alarms
              </h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {activeCount > 0 ? `${activeCount} active · notifies with sound · 📅 adds to Google Calendar` : "No active reminders yet"}
              </p>
            </div>
            <button onClick={playAlarmSound} title="Test alarm sound"
              className="flex items-center gap-1 text-[11px] text-amber-700 hover:text-amber-900 font-medium">
              <Volume2 className="w-3.5 h-3.5" /> Test sound
            </button>
          </div>

          <div className="p-4 space-y-3">
            {permission !== "granted" && (
              <div className="rounded-xl bg-amber-100 border border-amber-300 px-3 py-3 flex items-start gap-2">
                <Bell className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-amber-800">
                    {permission === "denied"
                      ? "Notifications blocked — enable in your browser/phone settings"
                      : "Allow notifications to receive sound alarms on your phone"}
                  </p>
                  {permission !== "denied" && (
                    <button onClick={requestPermission}
                      className="mt-2 px-3 py-1.5 bg-amber-600 text-white text-xs font-bold rounded-lg hover:bg-amber-700 transition-colors">
                      Enable notifications
                    </button>
                  )}
                </div>
              </div>
            )}

            {reminders.length > 0 && (
              <div className="space-y-2">
                {reminders.map((r) => (
                  <ReminderRow key={r.id} reminder={r}
                    onToggle={() => toggleReminder(r.id)}
                    onRemove={() => removeReminder(r.id)}
                    onUpdate={(patch) => updateReminder(r.id, patch)} />
                ))}
              </div>
            )}

            {showCustomForm ? (
              <div className="rounded-xl border border-primary/30 bg-white p-3 space-y-3">
                <p className="text-xs font-bold text-primary uppercase tracking-widest">New Reminder</p>
                <input className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="What do you want to be reminded about?"
                  value={newLabel} onChange={(e) => setNewLabel(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddCustomReminder()} autoFocus />
                <div className="flex items-center gap-3">
                  <label className="text-xs font-semibold text-muted-foreground">Time:</label>
                  <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)}
                    className="text-sm font-mono border border-border rounded-lg px-2 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div className="flex gap-2">
                  <button onClick={handleAddCustomReminder} disabled={!newLabel.trim()}
                    className="flex-1 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:bg-primary/90 disabled:opacity-40 transition-colors">
                    Add Reminder
                  </button>
                  <button onClick={() => setShowCustomForm(false)}
                    className="px-4 py-2 bg-muted text-muted-foreground text-xs font-semibold rounded-lg hover:bg-muted/80 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setShowCustomForm(true)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-amber-300 bg-white/80 text-xs font-semibold text-amber-800 hover:bg-white transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Write your own reminder
                </button>
                <button onClick={() => setShowPresets((v) => !v)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-amber-300 bg-white/80 text-xs font-semibold text-amber-800 hover:bg-white transition-colors">
                  <BellRing className="w-3.5 h-3.5" />
                  {showPresets ? "Hide" : "Common presets"}
                  {showPresets ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>
            )}

            {showPresets && (
              <div className="rounded-xl border border-amber-200 bg-white divide-y divide-amber-100 overflow-hidden">
                {presets.map((p, i) => (
                  <button key={i} onClick={() => { addReminder({ ...p, enabled: true }); setShowPresets(false); }}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-amber-50 transition-colors">
                    <span className="text-sm text-foreground font-medium">{p.label}</span>
                    <span className="text-xs text-muted-foreground font-mono ml-3 flex-shrink-0">
                      {p.time}{p.days.length > 0 && ` · ${p.days.map((d) => DAY_LABELS[d]).join(", ")}`}
                    </span>
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-blue-50 border border-blue-100">
              <Calendar className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-blue-700 leading-relaxed">
                Each reminder has a <span className="font-bold">📅</span> button — tap it to add a recurring event to <span className="font-bold">Google Calendar</span>.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

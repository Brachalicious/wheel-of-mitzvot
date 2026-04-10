import { useState } from "react";
import { ChevronDown, ChevronUp, Check, ExternalLink } from "lucide-react";

// ── Data based on the Chafetz Chaim's Sefer HaMitzvos HaKatzar ───────────────
// Source: Rabbi Moshe Goldberger, "77 Mitzvos for Today" (Torah.org)
// https://torah.org/series/mitzvah/

interface DailyMitzvah {
  num: number | string;
  name: string;
  hebrew?: string;
  note?: string;
  applicability?: string; // e.g. "Kohanim only", "Men", "Women", "Married couples"
}

interface Section {
  id: string;
  title: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  mitzvot: DailyMitzvah[];
}

const SECTIONS: Section[] = [
  {
    id: "basics",
    title: "The Basics",
    color: "#1d4ed8",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-800",
    mitzvot: [
      { num: 1, name: "Belief in Hashem", hebrew: "אֱמוּנָה", note: "Know and believe that God exists, that He created and sustains all existence." },
      { num: 2, name: "Understanding Hashem's Oneness", hebrew: "יִחוּד ה׳", note: "Internalize that God is completely One — not just numerically one, but uniquely and absolutely singular." },
      { num: 3, name: "Love of Hashem", hebrew: "אַהֲבַת ה׳", note: "Develop a genuine love for God through Torah study, tefillah, and reflection on His kindness." },
      { num: 4, name: "Fear of Hashem", hebrew: "יִרְאַת ה׳", note: "Maintain constant awareness that you stand before the King. Not dread — awe and reverence." },
      { num: 5, name: "Sanctifying Hashem's Name — Kiddush Hashem", hebrew: "קִדּוּשׁ ה׳", note: "Act in ways that cause others to recognize and honor God. Your conduct is a sanctification or desecration of His name." },
      { num: 6, name: "Emulating Hashem's Ways — Imitatio Dei", hebrew: "וְהָלַכְתָּ בִּדְרָכָיו", note: "Be gracious, compassionate, and patient — as God is described. 'Just as He is merciful, you be merciful' (Shabbat 133b)." },
      { num: 7, name: "Daily Prayer — Tefillah", hebrew: "תְּפִלָּה", note: "Pray every day. At minimum: one full Amidah daily. Full obligation: Shacharit, Mincha, Maariv." },
    ],
  },
  {
    id: "uniform",
    title: "Uniform and Identification",
    color: "#0369a1",
    bgColor: "bg-sky-50",
    borderColor: "border-sky-200",
    textColor: "text-sky-800",
    mitzvot: [
      { num: 8, name: "Tefillin on the Arm", hebrew: "תְּפִלִּין שֶׁל יָד", note: "Wear arm-tefillin during Shacharit on weekdays. Placed on the left arm opposite the heart.", applicability: "Men" },
      { num: 9, name: "Tefillin on the Head", hebrew: "תְּפִלִּין שֶׁל רֹאשׁ", note: "Wear head-tefillin during Shacharit on weekdays. Placed above the hairline, centered.", applicability: "Men" },
      { num: 10, name: "Tzitzit", hebrew: "צִיצִית", note: "Wear a four-cornered garment with tzitzit. The mitzvah is to wear it; the tallit katan fulfills this throughout the day.", applicability: "Men" },
      { num: 11, name: "Kriat Shema", hebrew: "קְרִיאַת שְׁמַע", note: "Recite Shema morning and evening — declaring God's unity twice daily. The foundation of Jewish faith." },
      { num: 12, name: "Mezuzah", hebrew: "מְזוּזָה", note: "Affix a mezuzah on the right doorpost of your home and rooms. Touch it when passing as a reminder of God's presence." },
    ],
  },
  {
    id: "food",
    title: "Food-Related Mitzvot",
    color: "#047857",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-800",
    mitzvot: [
      { num: 13, name: "Birkat HaMazon — Blessings after a Meal", hebrew: "בִּרְכַּת הַמָּזוֹן", note: "Recite Grace after Meals after eating bread. A biblical obligation (Devarim 8:10)." },
      { num: 14, name: "Eating Kosher", hebrew: "כַּשְׁרוּת", note: "Observe the laws of kashrut in everything you eat and drink. What enters the body affects the soul." },
      { num: 15, name: "Covering the Blood after Shechitah", hebrew: "כִּסּוּי הַדָּם", note: "Cover the blood of birds and non-domesticated animals after slaughter.", applicability: "When slaughtering" },
      { num: 16, name: "Sending Away the Mother Bird — Shiluach HaKen", hebrew: "שִׁלּוּחַ הַקֵּן", note: "Before taking eggs or chicks from a nest, send away the mother bird (Devarim 22:6–7).", applicability: "When taking from a nest" },
    ],
  },
  {
    id: "learning",
    title: "Learning and Teaching",
    color: "#6d28d9",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
    textColor: "text-violet-800",
    mitzvot: [
      { num: 17, name: "Learning and Teaching Torah", hebrew: "תַּלְמוּד תּוֹרָה", note: "Study Torah every day — even one verse, one halacha. Teach it to others whenever possible. The greatest of all mitzvot." },
      { num: 18, name: "Writing and Buying Sefarim", hebrew: "כְּתִיבַת סֵפֶר תּוֹרָה", note: "Own Torah books. Originally: write a Sefer Torah. Today: owning sefarim that enable Torah study fulfills this." },
      { num: 19, name: "Associating with Torah Scholars", hebrew: "הֲדָבְקוּת בַּחֲכָמִים", note: "Seek out Torah scholars and spend time with them. Their example and atmosphere elevate you." },
      { num: 20, name: "Honoring Sages and the Elderly", hebrew: "הַדְרַת פְּנֵי זָקֵן", note: "Stand before a Torah sage or elderly person. Give them honor and deference (Vayikra 19:32)." },
      { num: 21, name: "Respecting Holy Places", hebrew: "מוֹרָא מִקְדָּשׁ", note: "Behave with reverence in a shul or beit midrash. Today these are our mikdash me'at — miniature sanctuaries." },
    ],
  },
  {
    id: "fellow",
    title: "Mitzvot Relating to our Fellow Man",
    color: "#b45309",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-800",
    mitzvot: [
      { num: 22, name: "Loving Every Jew — Ahavat Yisrael", hebrew: "אַהֲבַת יִשְׂרָאֵל", note: "Love every fellow Jew as yourself. Rabbi Akiva: this is the great principle of the Torah (Shabbat 31a)." },
      { num: 23, name: "Loving Converts — Ahavat Ger", hebrew: "אַהֲבַת הַגֵּר", note: "Show special warmth and love to converts — the Torah commands this 36 times." },
      { num: 24, name: "Giving Charity — Tzedakah", hebrew: "צְדָקָה", note: "Give tzedakah every day. Even a small amount fulfills the mitzvah. 10% (maaser) is the standard." },
      { num: 25, name: "Giving Loans", hebrew: "הַלְוָאָה", note: "Lend money to a fellow Jew in need without interest. A higher level than tzedakah according to Rambam." },
      { num: 26, name: "Returning a Security Daily", hebrew: "הֲשָׁבַת הָעֲבוֹט", note: "Return a poor person's collateral (e.g. a blanket) each evening for their use." },
      { num: 27, name: "Shemittah — Loan Cancellation", hebrew: "שְׁמִטַּת כְּסָפִים", note: "Cancel loans at the end of the seventh year (Shemittah). Use a Pruzbul to preserve the loan before Shemittah.", applicability: "When applicable" },
      { num: 28, name: "Keeping One's Word", hebrew: "קִיּוּם הַדָּבָר", note: "Honor your commitments. Your word is sacred — if you say you will do something, do it." },
      { num: 29, name: "Nullifying a Vow — Hatarat Nedarim", hebrew: "הַתָּרַת נְדָרִים", note: "Vows and oaths are serious. Perform hatarat nedarim (before Rosh Hashanah and throughout the year) to nullify improper ones." },
      { num: 30, name: "Safety and Prevention — Maakeh", hebrew: "מַעֲקֶה", note: "Build a railing on a roof or staircase. Broadly: remove hazards from your property and life." },
      { num: 31, name: "Rights and Obligations of an Employee", hebrew: "דִּינֵי שָׂכִיר", note: "Know and fulfill the halachic obligations between employer and employee — both directions." },
      { num: 32, name: "Timely Payment to Employees", hebrew: "בְּיוֹמוֹ תִתֵּן שְׂכָרוֹ", note: "Pay workers on time — the same day or night they complete their work (Devarim 24:15)." },
      { num: 33, name: "Laws of Commerce — Emet beMishkal", hebrew: "אֱמֶת בְּמִשְׁקָל", note: "Use accurate weights and measures. Conduct business with complete honesty and fair dealing." },
      { num: 34, name: "Returning Stolen Items — Hashavat Gezelah", hebrew: "הַשָׁבַת גְּזֵלָה", note: "Return anything taken wrongfully. Includes overcharging, time theft, and subtle forms of dishonest gain." },
      { num: 35, name: "Returning a Lost Object — Hashavat Aveidah", hebrew: "הַשָׁבַת אֲבֵידָה", note: "Return lost objects to their owner. Actively look for who it belongs to." },
      { num: "36–37", name: "Helping Unload and Reload — Perikah and Te'inah", hebrew: "פְּרִיקָה וּטְעִינָה", note: "Help a person whose animal has collapsed under its load, and help reload it. Today: help someone whose car broke down." },
      { num: 38, name: "Giving Rebuke — Tochacha", hebrew: "תּוֹכֵחָה", note: "Gently rebuke someone you see sinning — when they will receive it. Silence makes you complicit." },
      { num: 39, name: "Remembering Amalek's Attack", hebrew: "זְכִירַת מַה שֶּׁעָשָׂה עֲמָלֵק", note: "Remember that Amalek ambushed the weak and stragglers leaving Egypt. A daily mitzvah of memory and vigilance." },
      { num: 40, name: "Destroying Amalek", hebrew: "מְחִיַּת עֲמָלֵק", note: "The obligation to eradicate Amalek. Today: destroy the inner Amalek — the doubter and the cynic within.", applicability: "Primarily conceptual today" },
    ],
  },
  {
    id: "family",
    title: "Family-Related Mitzvot",
    color: "#be185d",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    textColor: "text-pink-800",
    mitzvot: [
      { num: 41, name: "Honoring Your Father and Mother — Kibud Av vaEm", hebrew: "כִּבּוּד אָב וָאֵם", note: "Provide for parents' needs, speak of them with honor, do not contradict or embarrass them." },
      { num: 42, name: "Revering Your Father and Mother — Morah Av vaEm", hebrew: "מוֹרָא אָב וָאֵם", note: "Do not sit in their designated seat, do not interrupt them, stand when they enter the room." },
      { num: 43, name: "Getting Married and Having Children — Pru uRevu", hebrew: "פְּרוּ וּרְבוּ", note: "Marry and have children. The first mitzvah in the Torah. Build a Jewish home and family." },
      { num: 44, name: "Performing Kiddushin — Jewish Marriage", hebrew: "קִדּוּשִׁין", note: "Conduct marriage according to halacha with kiddushin and chuppah." },
      { num: 45, name: "Circumcision — Brit Milah", hebrew: "בְּרִית מִילָה", note: "Circumcise male children on the eighth day. A covenant with God that marks every Jewish male.", applicability: "Fathers / Males" },
      { num: "46–47", name: "Yibum and Chalitzah", hebrew: "יִבּוּם וַחֲלִיצָה", note: "If a married man dies childless, his brother has a levirate obligation. Today: chalitzah (release ceremony) is performed.", applicability: "When applicable" },
      { num: 48, name: "Laws of Inheritance", hebrew: "דִּינֵי יְרוּשָׁה", note: "Follow halachic inheritance law. Torah determines the order and distribution of an estate." },
    ],
  },
  {
    id: "kohanim",
    title: "Mitzvot Related to Kohanim",
    color: "#065f46",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-200",
    textColor: "text-teal-800",
    mitzvot: [
      { num: 49, name: "Honoring Kohanim", hebrew: "כִּבּוּד כֹּהֵן", note: "Give a Kohein precedence at the Torah reading, at the table, and in other honors.", applicability: "All — toward Kohanim" },
      { num: "50–51", name: "Giving a Kohein Meat Portions and Wool Shearings", hebrew: "מַתְּנוֹת כְּהוּנָה", note: "Separate portions of slaughtered animals and wool for the Kohein. Today: observed when applicable.", applicability: "When slaughtering / shearing" },
      { num: 52, name: "Giving a Kohein Firstborn Animals — Bechor Beheimah", hebrew: "בְּכוֹר בְּהֵמָה", note: "The firstborn of kosher animals belongs to the Kohein.", applicability: "Animal owners" },
      { num: 53, name: "Redemption of a Firstborn Son — Pidyon HaBen", hebrew: "פִּדְיוֹן הַבֵּן", note: "Redeem a firstborn son from a Kohein thirty days after birth for five silver shekalim.", applicability: "Applicable families" },
      { num: 54, name: "Redemption of a Firstborn Donkey — Pidyon Peter Chamor", hebrew: "פִּדְיוֹן פֶּטֶר חֲמוֹר", note: "Redeem a firstborn donkey by giving a lamb to a Kohein.", applicability: "When applicable" },
      { num: 55, name: "Breaking a Donkey's Neck — Arifat Chamor", hebrew: "עֲרִיפַת חֲמוֹר", note: "If one does not redeem the firstborn donkey, break its neck. Shows the severity of the redemption obligation.", applicability: "When applicable" },
      { num: 56, name: "Separating Challah from Dough — Hafrashat Challah", hebrew: "הַפְרָשַׁת חַלָּה", note: "Separate a portion of dough and give it to a Kohein (today: set it aside and burn it). One of the three primary women's mitzvot.", applicability: "When baking" },
      { num: 57, name: "The Priestly Blessing — Birkat Kohanim", hebrew: "בִּרְכַּת כֹּהֲנִים", note: "Kohanim bless the congregation daily (in Israel) or on Yom Tov (in Diaspora) with the three-part blessing.", applicability: "Kohanim" },
      { num: 58, name: "Burial of a Kohein's Relatives", hebrew: "טֻמְאַת כֹּהֵן לְקְרוֹבָיו", note: "A Kohein may become tamei to bury his seven closest relatives. He is commanded to do so.", applicability: "Kohanim" },
    ],
  },
  {
    id: "days",
    title: "Special Days",
    color: "#7c3aed",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-800",
    mitzvot: [
      { num: 59, name: "Sanctifying Shabbat — Kiddush", hebrew: "קִדּוּשׁ שַׁבָּת", note: "Recite Kiddush over wine on Friday night and Shabbat morning. 'Remember the Shabbat day to sanctify it' (Shemot 20:8)." },
      { num: 60, name: "Resting on Shabbat — Menucha", hebrew: "שְׁבִיתָה בְּשַׁבָּת", note: "Refrain from the 39 prohibited labors. Shabbat is not merely not-working; it is an active state of holiness and rest." },
      { num: 61, name: "Rejoicing on Holidays — Simchat Yom Tov", hebrew: "שִׂמְחַת יוֹם טוֹב", note: "Experience genuine joy on each Yom Tov. For men: meat and wine. For women: new clothing and jewelry." },
      { num: 62, name: "Clearing Away Chametz — Bedikat Chametz", hebrew: "בִּדִיקַת חָמֵץ", note: "Search for and destroy chametz before Pesach. Sell what cannot be destroyed to a non-Jew.", applicability: "Before Pesach" },
      { num: 63, name: "Eating Matzah on the First Night of Pesach", hebrew: "אֲכִילַת מַצָּה", note: "Eat at least an olive-sized amount of matzah at the Seder. A biblical obligation on the first night.", applicability: "Pesach" },
      { num: 64, name: "Telling the Story of the Exodus — Sippur Yetziat Mitzrayim", hebrew: "סִפּוּר יְצִיאַת מִצְרַיִם", note: "Retell the Exodus story at the Seder with enthusiasm and in a way that brings it alive. The more, the better.", applicability: "Pesach Seder" },
      { num: 65, name: "Resting on the First Day of Pesach", hebrew: "שְׁבִיתָה בְּפֶסַח", note: "Refrain from melacha on the first day (and last day) of Pesach, as on Yom Tov.", applicability: "Pesach" },
      { num: 66, name: "Counting the Omer — Sefirat HaOmer", hebrew: "סְפִירַת הָעֹמֶר", note: "Count the 49 days from the second night of Pesach to Shavuot. Each day and each week. A tool for personal refinement.", applicability: "Men obligated; women customary" },
      { num: 67, name: "Resting on the Seventh Day of Pesach", hebrew: "שְׁבִיתַת שְׁבִיעִי שֶׁל פֶּסַח", note: "Observe the final day of Pesach as Yom Tov — no melacha, festive meals.", applicability: "Pesach" },
      { num: 69, name: "Rosh Hashanah — New Year", hebrew: "רֹאשׁ הַשָּׁנָה", note: "Observe Rosh Hashanah as Yom Tov: rest, prayer, and awareness that you stand in judgment before God.", applicability: "Rosh Hashanah" },
      { num: 70, name: "Listening to the Shofar", hebrew: "שְׁמִיעַת קוֹל שׁוֹפָר", note: "Hear the shofar blown on Rosh Hashanah — 100 blasts. A call to awaken and return.", applicability: "Rosh Hashanah" },
      { num: 71, name: "Resting on Yom Kippur", hebrew: "שְׁבִיתָה בְּיוֹם כִּפּוּר", note: "Refrain from melacha on Yom Kippur, as on Shabbat.", applicability: "Yom Kippur" },
      { num: 72, name: "Fasting on Yom Kippur — Inui Nefesh", hebrew: "עִינּוּי נֶפֶשׁ", note: "Afflict yourself on Yom Kippur: no eating, drinking, bathing, anointing, shoes, or marital relations.", applicability: "Yom Kippur" },
      { num: 73, name: "Repentance — Teshuvah", hebrew: "תְּשׁוּבָה", note: "Return to God whenever you have sinned. Confess verbally (viduy), feel remorse, and commit to change. A mitzvah every day." },
      { num: 74, name: "Resting on Sukkot — Shevitat Sukkot", hebrew: "שְׁבִיתָה בְּסוּכּוֹת", note: "Observe Sukkot as Yom Tov: no melacha on the first day (and Shemini Atzeret).", applicability: "Sukkot" },
      { num: 75, name: "Living in the Sukkah", hebrew: "יְשִׁיבָה בַּסֻּכָּה", note: "Dwell in the sukkah for all seven days: eat, drink, and sleep there. 'In sukkot you shall dwell' (Vayikra 23:42).", applicability: "Sukkot" },
      { num: 76, name: "Taking the Four Species — Arba Minim", hebrew: "נְטִילַת אַרְבַּע מִינִים", note: "Take the lulav, etrog, hadassim, and aravot each day of Sukkot and wave them.", applicability: "Sukkot" },
      { num: 77, name: "Resting on Shemini Atzeret", hebrew: "שְׁבִיתָה בִּשְׁמִינִי עֲצֶרֶת", note: "Observe Shemini Atzeret/Simchat Torah as Yom Tov. Rejoice with the Torah.", applicability: "Shemini Atzeret" },
    ],
  },
];

// ── Storage ───────────────────────────────────────────────────────────────────

function storageKey() {
  return "mitzvah-wheel-77-mitzvot-" + new Date().toISOString().slice(0, 10);
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
    <div className={`rounded-lg border transition-all ${done ? "border-green-300 bg-green-50" : "border-white/70 bg-white/60"}`}>
      <div className="flex items-start gap-2.5 px-3 py-2.5">
        {/* Checkbox */}
        <button
          onClick={onToggle}
          className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            done ? "border-green-500 bg-green-500" : "border-gray-300 bg-white hover:border-gray-400"
          }`}
          data-testid="daily-mitzvah-check"
        >
          {done && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-1">
            {/* Number badge */}
            <span
              className="flex-shrink-0 text-[9px] font-black mt-0.5 px-1 py-0.5 rounded"
              style={{ backgroundColor: `${color}22`, color }}
            >
              {mitzvah.num}
            </span>

            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold leading-snug ${done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                {mitzvah.name}
              </p>
              {mitzvah.hebrew && (
                <p className="text-[11px] text-muted-foreground font-serif mt-0.5" dir="rtl" lang="he">
                  {mitzvah.hebrew}
                </p>
              )}
              {mitzvah.applicability && (
                <span className="inline-block text-[9px] font-bold uppercase tracking-wide mt-0.5 px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                  {mitzvah.applicability}
                </span>
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

          {expanded && mitzvah.note && (
            <p className="text-xs text-foreground mt-1.5 leading-relaxed border-t border-current/10 pt-1.5 ml-5">
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
  const [open, setOpen] = useState(false);
  const completedCount = section.mitzvot.filter((m) => done.has(`${section.id}:${m.num}`)).length;

  return (
    <div className={`rounded-xl border ${section.borderColor} ${section.bgColor} overflow-hidden`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:brightness-95 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: section.color }} />
          <p className={`text-xs font-bold uppercase tracking-wider ${section.textColor}`}>
            {section.title}
          </p>
          <span className="text-[10px] text-muted-foreground">
            {section.mitzvot.length} mitzvot
          </span>
        </div>
        <div className="flex items-center gap-2">
          {completedCount > 0 && (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
              style={{ backgroundColor: `${section.color}18`, color: section.color, borderColor: `${section.color}40` }}
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
        <div className="px-3 pb-3 space-y-1.5">
          {section.mitzvot.map((m) => {
            const key = `${section.id}:${m.num}`;
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

  const totalMitzvot = SECTIONS.reduce((sum, s) => sum + s.mitzvot.length, 0);
  const totalDone    = done.size;
  const pct          = totalMitzvot > 0 ? Math.round((totalDone / totalMitzvot) * 100) : 0;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-foreground">
            77 Mitzvot Applicable Today
          </h2>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Based on the Chafetz Chaim's Sefer HaMitzvos HaKatzar · Rabbi Moshe Goldberger
          </p>
        </div>
        <a
          href="https://torah.org/series/mitzvah/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80 underline underline-offset-2"
        >
          <ExternalLink className="w-3 h-3" />
          Torah.org
        </a>
      </div>

      {/* Progress */}
      {totalDone > 0 && (
        <div className="space-y-1">
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-green-500 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground text-right">
            {totalDone} of {totalMitzvot} marked · {pct}%
          </p>
        </div>
      )}

      {/* Sections */}
      {SECTIONS.map((s) => (
        <MitzvahSection key={s.id} section={s} done={done} onToggle={toggle} />
      ))}

      <p className="text-[10px] text-muted-foreground text-center pt-1">
        Tap any mitzvah for details · Checkboxes reset daily
      </p>
    </div>
  );
}

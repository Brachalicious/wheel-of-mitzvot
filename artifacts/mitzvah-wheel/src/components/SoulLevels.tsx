import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

// ── Soul level data ───────────────────────────────────────────────────────────

interface SoulLevel {
  id: string;
  hebrew: string;
  transliteration: string;
  meaning: string;
  seat: string;
  description: string;
  inMitzvah: string;
  howToEngage: string[];
  againstYetzer: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  isOpponent?: boolean;
}

const SOUL_LEVELS: SoulLevel[] = [
  {
    id: "behema",
    hebrew: "נֶפֶשׁ הַבְּהֵמִית",
    transliteration: "Nefesh HaBehemit",
    meaning: "The Animal Soul",
    seat: "Left chamber of the heart",
    description:
      "This is not evil — it is the life-force animating the physical body. It houses instinct, appetite, ego, and survival. The Tanya teaches that it is driven by seven impure counterparts to the divine middot: pride, anger, desire, envy, laziness, gluttony, and miserliness. The yetzer hara (evil inclination) operates primarily through this soul. Its goal is self-preservation and self-gratification — not malice, but blindness.",
    inMitzvah:
      "The Nefesh HaBehemit is the friction in every mitzvah. It is the voice that says 'later,' 'you're tired,' 'what's the point,' or 'just this once.' Without it, there would be no struggle — and no growth.",
    howToEngage: [
      "Don't try to kill it — redirect it. The Baal Shem Tov taught that the animal soul's energy, converted, becomes the fuel for passionate avodah",
      "When you feel resistance before a mitzvah, name it: 'That's my nefesh habehemit.' Naming it separates you from it",
      "Use its drives: use the appetite for taste to appreciate Shabbat food; use the love of comfort to love the comfort of Torah",
      "The Tanya: 'Beinoni' — the average person — is not someone who has no animal soul thoughts. It is someone who does not act on them",
    ],
    againstYetzer:
      "The yetzer hara IS the nefesh habehemit in its unconverted state. You don't defeat it by fighting — you defeat it by turning it toward God. When its energy is redirected, it becomes your greatest asset.",
    color: "#dc2626",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-700",
    isOpponent: true,
  },
  {
    id: "nefesh",
    hebrew: "נֶפֶשׁ",
    transliteration: "Nefesh",
    meaning: "The Vital Soul — Action",
    seat: "The blood and limbs — the organs of action",
    description:
      "The lowest of the five levels of the divine soul, but the first to act. Nefesh is the soul as expressed through the body — through hands, feet, speech, and habit. It is divine vitality incarnated into physical movement. The Torah says 'ki ha'dam hu ha'nefesh' — the blood is the nefesh — because it pulses through every action.",
    inMitzvah:
      "Every physical act of a mitzvah is the Nefesh at work: the hand dropping a coin into a tzedakah box, the arm wrapping tefillin, the feet walking to shul, the mouth forming the words of a blessing. This is the first level to engage — because without action, no other level can follow.",
    howToEngage: [
      "Slow down the physical act. Feel the tefillin strap tightening on your arm. Hold the lulav deliberately",
      "Make the action complete — don't rush through it. The Nefesh is trained by habit, so make each act a full one",
      "'Just do it.' When motivation fails, the Nefesh doesn't need to feel inspired — it just needs to move",
      "Use the body: bow fully at 'Barchu,' stand at 'Aleinu,' close your eyes at 'Echad.' Physical commitment awakens the other levels",
    ],
    againstYetzer:
      "The yetzer hara attacks through inertia — 'don't start.' The Nefesh defeats it with momentum: once the body begins moving toward a mitzvah, the yetzer hara loses its grip. Start the action, even imperfectly.",
    color: "#b45309",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-800",
  },
  {
    id: "ruach",
    hebrew: "רוּחַ",
    transliteration: "Ruach",
    meaning: "The Spirit — Emotion",
    seat: "The heart — the seat of feeling",
    description:
      "Ruach means 'wind' and 'spirit' — it is the breath between body and mind. This is the level of the divine soul that feels: love of God (ahavat Hashem), fear and awe (yirat Hashem), joy, longing, compassion, and all seven divine middot. The Arizal taught that the Ruach is the bridge — it takes the body's action (Nefesh) and infuses it with the heart's meaning.",
    inMitzvah:
      "The Shema is not only words — it is love. Havdalah is not only flame and wine — it is longing. The Ruach is what transforms a religious behavior into avodah shebalev — service of the heart. When you pause before a mitzvah and feel something, that is your Ruach awakening.",
    howToEngage: [
      "Before each mitzvah, pause for three seconds. Ask: what do I feel right now toward God? Even a flicker counts",
      "Cultivate ahavah: think of one thing God has given you before you begin. Let gratitude warm the action",
      "Practice yirah: before a mitzvah, remember who you are standing before — the Ein Sof. Let that produce even a moment of awe",
      "Sing, hum, or say the words with melody — music is the language of the Ruach",
    ],
    againstYetzer:
      "The yetzer hara works through cold — apathy, boredom, 'I don't feel like it.' The Ruach fights it with warmth. Even a small spark of love for God, consciously cultivated, is enough to melt the resistance of the animal soul.",
    color: "#0369a1",
    bgColor: "bg-sky-50",
    borderColor: "border-sky-200",
    textColor: "text-sky-800",
  },
  {
    id: "neshamah",
    hebrew: "נְשָׁמָה",
    transliteration: "Neshamah",
    meaning: "The Divine Breath — Intellect",
    seat: "The mind — understanding and wisdom",
    description:
      "Neshamah literally means 'breath of God' — drawn from the verse 'vayipach b'apav nishmat chayim' — 'He breathed into his nostrils the breath of life.' This is the intellectual dimension of the divine soul: Chochmah (wisdom, flash of insight), Binah (understanding, deep analysis), and Da'at (deep knowing, connection). The Neshamah is the 'lamp of God' (Mishlei 20:27) — it seeks to know.",
    inMitzvah:
      "Understanding a mitzvah at the level of the Neshamah means asking: what does this reveal about God? What does it ask of me as a human being? How does it connect to Torah's inner logic? When you study the halacha of what you are about to do, or the Kabbalistic reason, you are engaging the Neshamah.",
    howToEngage: [
      "Before a mitzvah: learn one halacha or one Mishnah about it. Even two minutes of study lights the Neshamah",
      "Ask 'why?' — not as doubt, but as curiosity. Why does this mitzvah have this form? What is God saying through it?",
      "Learn the inner dimension (pnimiyut): what does tefillin say about the relationship between thought, heart, and action? What does Shabbat say about creation?",
      "Study the Rambam's ta'amei hamitzvot — the reasons for the commandments — for any mitzvah you are performing",
    ],
    againstYetzer:
      "The Tanya teaches: the yetzer hara is overcome through Binah — understanding. When the Neshamah clearly sees what is true, what is real, and what matters, it floods the lower levels with light. Ignorance is the yetzer hara's oxygen; understanding starves it.",
    color: "#6d28d9",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
    textColor: "text-violet-800",
  },
  {
    id: "chayah",
    hebrew: "חַיָּה",
    transliteration: "Chayah",
    meaning: "The Living Soul — Supra-conscious Connection",
    seat: "Surrounding the body (Makif karov — the near surrounding light)",
    description:
      "Chayah transcends individual identity. While the Neshamah operates within the individual, the Chayah connects you to something larger: Klal Yisrael, past generations, future generations, and the cosmic mission of the Jewish people. It is the level at which you know — without reasoning — that you are part of something eternal. The Arizal taught that only rare individuals consciously access the Chayah; most people feel it as a sudden clarity or as the sense that their actions matter beyond themselves.",
    inMitzvah:
      "When you perform a mitzvah and feel: 'I am doing this with every Jew who has ever lived and every Jew who will ever live' — that is the Chayah. The mitzvah becomes a link in the chain of the covenant, not just a personal observance. Kiddush on Friday night carries the weight of every Jewish table across history.",
    howToEngage: [
      "Before a mitzvah, say or think: 'I am doing this as part of the covenant of Sinai, with all of Klal Yisrael'",
      "Learn about someone who gave their life or sacrificed greatly to do this same mitzvah. Let their story enter your action",
      "Think of someone you are doing this for — a parent, a child, a community — beyond yourself",
      "Connect the mitzvah to the tikkun olam it performs: how does this specific act repair something in the spiritual world?",
    ],
    againstYetzer:
      "The yetzer hara attacks the individual — it makes you feel small, isolated, unimportant: 'who are you? why bother?' The Chayah dissolves this by placing you within something too vast to be diminished. You are part of an eternal people. What you do echoes forward and backward through time.",
    color: "#047857",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-800",
  },
  {
    id: "yechidah",
    hebrew: "יְחִידָה",
    transliteration: "Yechidah",
    meaning: "The Singular Soul — Essence",
    seat: "Beyond location — the root of roots, completely unified with Ein Sof",
    description:
      "Yechidah means 'singular' or 'unique' — it is the deepest point of the soul, where the distinction between the person and God dissolves entirely. The Tanya teaches that the Yechidah is the 'chelek Eloka mima'al mamash' — a literally actual part of God above. It is the tzelem Elohim in its most essential form. Most people access it only in flashes — in prayer moments of total surrender, in acts of self-sacrifice, in the deepest Yom Kippur moments. The great tzaddikim live from it continuously.",
    inMitzvah:
      "When a mitzvah is performed from the Yechidah, it is no longer about obligation or love or even awe — it is pure unity. The person and the mitzvah and God are one. This is what the Zohar calls 'deveikut' — cleaving. The Baal Shem Tov taught that every Jew can touch this even briefly in any mitzvah — in a moment of total presence, total surrender, total 'here I am.'",
    howToEngage: [
      "Before a mitzvah: one moment of silence. Not thought, not feeling — just presence. 'Hineni.' I am here",
      "Say the mitzvah's blessing with full intent on the word 'Echad' — One. Let that oneness be yours",
      "At the moment of performing the act, release the 'I.' You are not doing it. God is doing it through you",
      "Practice mesirut nefesh — small self-surrender in each mitzvah. 'I am giving up my comfort/time/money/pride for this.' That is a doorway to the Yechidah",
    ],
    againstYetzer:
      "The yetzer hara cannot reach the Yechidah. At this level, there is no 'other' — no 'me' separate from God to be tempted. When you touch the Yechidah, even for a moment, the yetzer hara simply disappears: there is no one left for it to speak to. This is why the Baal Shem Tov taught that complete deveikut is the ultimate weapon.",
    color: "#92400e",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-300",
    textColor: "text-yellow-800",
  },
];

// ── Individual level card ─────────────────────────────────────────────────────

function LevelCard({ level }: { level: SoulLevel }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`rounded-xl border ${level.borderColor} ${level.bgColor} overflow-hidden`}>
      {/* Header — always visible */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:brightness-95 transition-all"
        data-testid={`soul-level-${level.id}`}
      >
        {/* Color indicator */}
        <div
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: level.color }}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span
              className="font-bold text-sm tracking-tight"
              style={{ color: level.color }}
            >
              {level.transliteration}
            </span>
            {level.isOpponent && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-100 border border-red-200 px-1.5 py-0.5 rounded-full">
                The Opponent
              </span>
            )}
            <span
              className="text-[11px] font-semibold text-muted-foreground"
              dir="rtl" lang="he"
            >
              {level.hebrew}
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-medium mt-0.5">
            {level.meaning}
          </p>
        </div>

        {open
          ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        }
      </button>

      {/* Expanded content */}
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-current/10">

          {/* Seat */}
          <div className="pt-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Seat in the Person
            </p>
            <p className="text-xs font-semibold" style={{ color: level.color }}>
              {level.seat}
            </p>
          </div>

          {/* Description */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
              What it is
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {level.description}
            </p>
          </div>

          {/* Role in mitzvah */}
          <div className={`rounded-lg border ${level.borderColor} px-3 py-2.5`}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Role in Mitzvot
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {level.inMitzvah}
            </p>
          </div>

          {/* How to engage — bullet list */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              How to Engage It Today
            </p>
            <ul className="space-y-1.5">
              {level.howToEngage.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <span
                    className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: level.color }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Against yetzer hara */}
          <div
            className="rounded-lg px-3 py-2.5 border-l-4"
            style={{
              backgroundColor: `${level.color}11`,
              borderLeftColor: level.color,
            }}
          >
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: level.color }}>
              Against the Yetzer Hara
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {level.againstYetzer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function SoulLevels() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl bg-gradient-to-b from-violet-50 to-amber-50 border border-violet-200 shadow-sm overflow-hidden">
      {/* Section header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/30 transition-colors"
        data-testid="soul-levels-toggle"
      >
        <div className="text-left">
          <p className="text-xs font-bold uppercase tracking-widest text-violet-700">
            The Five Levels of the Soul
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Nefesh · Ruach · Neshamah · Chayah · Yechidah — and the Nefesh HaBehemit
          </p>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-violet-500 flex-shrink-0" />
          : <ChevronDown className="w-4 h-4 text-violet-500 flex-shrink-0" />
        }
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3">
          {/* Intro */}
          <div className="rounded-lg bg-white/80 border border-violet-100 px-4 py-3">
            <p className="text-sm text-foreground leading-relaxed">
              Every mitzvah is an opportunity to activate all five levels simultaneously — the complete person standing before God. The{" "}
              <span className="font-semibold">Nefesh HaBehemit</span> (animal soul) creates the friction; overcoming it draws all five levels into alignment. As the Baal Shem Tov taught: the goal is not to destroy the animal soul but to transform it — to turn its raw energy into fuel for deveikut.
            </p>
          </div>

          {/* Stack from bottom (behema) to top (yechidah) */}
          <div className="space-y-2">
            {/* Show Nefesh HaBehema first as "the opponent" */}
            <LevelCard level={SOUL_LEVELS[0]} />

            {/* Divider */}
            <div className="flex items-center gap-2 py-1">
              <div className="flex-1 h-px bg-violet-200" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-violet-400">
                The Five Levels of the Divine Soul
              </p>
              <div className="flex-1 h-px bg-violet-200" />
            </div>

            {/* Nefesh through Yechidah */}
            {SOUL_LEVELS.slice(1).map((level) => (
              <LevelCard key={level.id} level={level} />
            ))}
          </div>

          {/* Closing teaching */}
          <div
            className="rounded-lg px-4 py-3 border-l-4 border-violet-400 bg-white/70"
          >
            <p className="text-sm text-foreground font-serif italic leading-relaxed">
              "The purpose of creation is that the Holy One, blessed be He, desired to have a dwelling place in the lower worlds — and it is through the mitzvot that the Yechidah builds that dwelling, one act at a time."
            </p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-violet-600 mt-1.5">
              — Tanya, Likutei Amarim Chapter 36
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

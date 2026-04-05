import { useState, useEffect } from 'react';

export const DEFAULT_MITZVAHS = [
  // Interpersonal
  "Honor your parents",
  "Love your neighbor as yourself",
  "Welcome guests into your home",
  "Visit someone who is sick",
  "Comfort a mourner",
  "Return a lost object",
  "Speak only kind words",
  "Judge others favorably",
  "Do not gossip (shmirat halashon)",
  "Apologize to someone you wronged",
  "Forgive someone who hurt you",
  "Help an elderly person",
  "Smile at a stranger",
  "Listen fully before responding",
  "Celebrate with someone joyfully",
  "Check in on a lonely neighbor",

  // Giving & Justice
  "Give tzedakah (charity)",
  "Feed someone who is hungry",
  "Donate clothing or goods",
  "Volunteer your time",
  "Pay workers fairly and on time",
  "Leave tips for service workers",
  "Support a local small business",
  "Advocate for someone vulnerable",

  // Torah & Prayer
  "Study Torah for at least 15 minutes",
  "Pray Shacharit (morning prayer)",
  "Pray Mincha (afternoon prayer)",
  "Pray Maariv (evening prayer)",
  "Recite the Shema",
  "Say a blessing before eating",
  "Say a blessing after eating",
  "Learn a halacha (Jewish law)",
  "Teach someone else something you learned",
  "Read a chapter of Psalms (Tehillim)",

  // Shabbat & Holidays
  "Light Shabbat candles",
  "Make Kiddush on Shabbat",
  "Rest and disconnect on Shabbat",
  "Wish someone Shabbat Shalom",
  "Prepare food for Shabbat",
  "Say Sefiras HaOmer",

  // Environment & Creation
  "Protect the environment (bal tashchit)",
  "Don't waste food",
  "Recycle something today",
  "Plant something or tend a garden",
  "Take a walk and appreciate creation",

  // Personal Growth
  "Start your day with gratitude",
  "Do something kind anonymously",
  "Keep your word and honor a promise",
  "Control your anger today",
  "Avoid speaking ill of others",
  "Set aside time for reflection",
  "Write in a gratitude journal",

  // Community
  "Attend a synagogue service",
  "Support your Jewish community",
  "Participate in a communal meal",
  "Welcome a newcomer to your community",
  "Honor a Torah scholar",
];

export const MITZVAH_EXAMPLES: Record<string, string> = {
  "Honor your parents":
    "Call or text a parent today just to say you're thinking of them. Ask how they're doing and truly listen — not to respond, but to understand.",
  "Love your neighbor as yourself":
    "Before reacting to someone today, pause and ask: how would I want to be treated in their place? Let that answer guide your next move.",
  "Welcome guests into your home":
    "Invite a friend, neighbor, or new acquaintance for a meal or coffee. Even a simple gathering honors the mitzvah of hachnasat orchim.",
  "Visit someone who is sick":
    "Reach out to someone who is ill or recovering — a phone call, a text, or a visit in person. Let them know they are not forgotten.",
  "Comfort a mourner":
    "If you know someone in mourning, be present with them. You don't need to find the right words — your company and silence are the gift.",
  "Return a lost object":
    "If you find something someone has misplaced — a wallet, keys, or phone — take the extra step to return it. Don't walk past it.",
  "Speak only kind words":
    "Before saying something critical today, ask: is it true, is it necessary, and is it kind? Aim for all three before you speak.",
  "Judge others favorably":
    "When someone does something that bothers you, take a moment to think of a charitable explanation before assuming the worst about their intentions.",
  "Do not gossip (shmirat halashon)":
    "If you catch yourself about to repeat something negative about someone, stop and redirect the conversation to something uplifting or simply change the subject.",
  "Apologize to someone you wronged":
    "Think of one person you may have hurt — even unintentionally — and reach out with a genuine apology today. A sincere 'I'm sorry' can heal a great deal.",
  "Forgive someone who hurt you":
    "Choose one person who has wronged you and take a small mental step toward releasing the resentment. Forgiveness is a gift you give yourself as much as them.",
  "Help an elderly person":
    "Offer to carry groceries, hold a door, run an errand, or simply sit and keep company with an elderly neighbor or relative who could use the connection.",
  "Smile at a stranger":
    "Today, make eye contact and offer a genuine smile to someone you don't know — a cashier, a neighbor on the street, or someone in the elevator.",
  "Listen fully before responding":
    "In your next conversation, put down your phone and give the person your complete attention. Let them finish before you begin formulating your reply.",
  "Celebrate with someone joyfully":
    "Reach out to congratulate someone on a milestone — a promotion, a birthday, a new baby — and make them feel truly seen and celebrated.",
  "Check in on a lonely neighbor":
    "Knock on the door of a neighbor you haven't seen in a while, or leave them a short note. A small gesture can mean everything to someone who feels isolated.",
  "Give tzedakah (charity)":
    "Set aside a small amount today — even a few coins in a tzedakah box. Giving consistently, in any amount, builds a habit of generosity that shapes character.",
  "Feed someone who is hungry":
    "Buy an extra meal or snack for someone who appears to be struggling, or donate food to a local pantry. Meeting a physical need is a profound act of love.",
  "Donate clothing or goods":
    "Go through your closet or home for items you no longer use and bring them to a shelter, thrift store, or community collection. What you don't need, someone else needs greatly.",
  "Volunteer your time":
    "Sign up for even one hour of service — at a food bank, school, or community center. Your time is one of the most precious things you can offer another person.",
  "Pay workers fairly and on time":
    "If you employ or hire anyone, ensure they are paid promptly and fully. Express genuine gratitude for their work — acknowledgment is as important as compensation.",
  "Leave tips for service workers":
    "Be generous with those who serve you — restaurant staff, delivery drivers, parking attendants. Thank them by name when you can. Dignity costs nothing extra.",
  "Support a local small business":
    "Choose a local shop, restaurant, or artisan over a large chain today. Your purchase supports a family and sustains the fabric of your community.",
  "Advocate for someone vulnerable":
    "Speak up for someone being treated unfairly — in your workplace, neighborhood, or in a conversation where injustice goes unchallenged. Your voice matters.",
  "Study Torah for at least 15 minutes":
    "Open a parsha, a Daf Yomi page, or a short halacha and read it slowly with intention. Apps like Sefaria or Chabad.org make Torah accessible anywhere.",
  "Pray Shacharit (morning prayer)":
    "Begin your day with intention — even an abbreviated Shacharit focuses the mind on gratitude and purpose before the noise of the day begins.",
  "Pray Mincha (afternoon prayer)":
    "Pause in the middle of your day — even just 5 minutes — to recite Mincha. It's a powerful reminder that the day belongs to something beyond your to-do list.",
  "Pray Maariv (evening prayer)":
    "Close the day the way you opened it — with intention. Maariv is a chance to bring the day's experiences into a larger spiritual context before sleep.",
  "Recite the Shema":
    "Say the Shema when you wake and before sleep. These 25 words are among the most profound in all of Jewish tradition — slow down and mean them.",
  "Say a blessing before eating":
    "Before your next meal or snack, pause for just a moment to recite the appropriate bracha. It transforms eating from routine into an act of conscious gratitude.",
  "Say a blessing after eating":
    "After a bread meal, recite Birkat Hamazon. After other foods, say the appropriate after-blessing. Gratitude bookends the act of eating and reminds us where abundance comes from.",
  "Learn a halacha (Jewish law)":
    "Look up one Jewish law you're curious or uncertain about — using the Kitzur Shulchan Aruch, Sefaria, or a daily halacha email. Knowledge leads to better practice.",
  "Teach someone else something you learned":
    "Share one Torah idea or halacha with a family member, friend, or colleague today. Teaching deepens your own understanding and spreads light into the world.",
  "Read a chapter of Psalms (Tehillim)":
    "Open Tehillim to any psalm and read it slowly. Psalms 23, 27, or 121 are beloved starting points — they can be said for the sick, in gratitude, or simply for comfort.",
  "Light Shabbat candles":
    "Light candles 18 minutes before sunset on Friday. Cover your eyes, recite the bracha, and let this moment of light sanctify the transition into Shabbat.",
  "Make Kiddush on Shabbat":
    "Gather your household for Kiddush over wine or grape juice. Let the words of sanctification be spoken slowly before the Shabbat meal begins.",
  "Rest and disconnect on Shabbat":
    "Choose one thing to truly put down this Shabbat — your phone, your emails, your worries. Let the day be genuinely restful, not just technically observed.",
  "Wish someone Shabbat Shalom":
    "Greet people with 'Shabbat Shalom' on Friday afternoon or Saturday — it's a small act that connects you to community and radiates warmth wherever you are.",
  "Prepare food for Shabbat":
    "Cook or prepare something special for Shabbat — even one dish made with intentionality elevates the day. If possible, involve children in the preparation.",
  "Say Sefiras HaOmer":
    "Count the Omer tonight after nightfall with the blessing. These 49 days between Pesach and Shavuot are a spiritual journey — reflect on one middah (character trait) you want to work on this week.",
  "Protect the environment (bal tashchit)":
    "Be intentional about waste today — turn off lights you're not using, bring a reusable bag to the store, or repair something instead of throwing it away.",
  "Don't waste food":
    "Plan your meals before shopping, use up leftovers creatively, and compost what cannot be eaten. The Torah's prohibition on needless destruction begins at your kitchen table.",
  "Recycle something today":
    "Sort your trash with care. If your area lacks recycling, find a local drop-off for electronics, batteries, or paper. Every deliberate act counts.",
  "Plant something or tend a garden":
    "Plant an herb, a flower, or a small tree — or simply water something already growing. Tending the earth is an act of partnership with the Creator.",
  "Take a walk and appreciate creation":
    "Step outside for 10 minutes and look at the sky, trees, or any natural beauty around you. Notice something you normally walk past without seeing.",
  "Start your day with gratitude":
    "Before getting out of bed, name three specific things you're grateful for. Specificity makes gratitude real — 'my warm coffee' lands deeper than 'my life.'",
  "Do something kind anonymously":
    "Perform one act of kindness today where no one knows it came from you — leave an encouraging note, pay for someone's coffee ahead, or donate without recognition.",
  "Keep your word and honor a promise":
    "Think of any commitment you've made recently that remains unfinished — a call, an email, a favor — and take care of it today. Your word is your integrity.",
  "Control your anger today":
    "When something frustrates you today, take three slow breaths before responding. Pause long enough to choose your words rather than let your reaction choose them for you.",
  "Avoid speaking ill of others":
    "If you catch yourself about to criticize someone who isn't in the room, stop and find something positive to say instead — or simply change the subject.",
  "Set aside time for reflection":
    "Spend 10 quiet minutes today — without a screen — reviewing your day, your relationships, and whether your actions matched the person you want to be.",
  "Write in a gratitude journal":
    "Write down 3-5 things that brought you joy or meaning today. Over time, this practice rewires how you see the world and trains the eye toward blessing.",
  "Attend a synagogue service":
    "Join your community for davening at least once this week. The energy of communal prayer is different from praying alone, and your presence genuinely matters.",
  "Support your Jewish community":
    "Contribute to your synagogue, school, or Jewish organization — through dues, a donation, or simply showing up when volunteers are needed.",
  "Participate in a communal meal":
    "Join a Shabbat meal, a shul kiddush, or a community dinner. Shared eating builds the bonds of trust and belonging that sustain communities over generations.",
  "Welcome a newcomer to your community":
    "If you see a new face at shul or a community event, introduce yourself, learn their name, and make them feel that they have found a place where they belong.",
  "Honor a Torah scholar":
    "When you encounter a rabbi, teacher, or Torah scholar, offer genuine respect — listen attentively, thank them for their contribution, and speak of them with esteem.",
};

const STORAGE_KEY = "mitzvah-wheel-list";
const STORAGE_VERSION_KEY = "mitzvah-wheel-version";
const CURRENT_VERSION = "3";

export function useMitzvahs() {
  const [mitzvahs, setMitzvahs] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && storedVersion === CURRENT_VERSION) {
      try {
        setMitzvahs(JSON.parse(stored));
      } catch (e) {
        setMitzvahs(DEFAULT_MITZVAHS);
      }
    } else {
      localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
      setMitzvahs(DEFAULT_MITZVAHS);
    }
    setIsLoaded(true);
  }, []);

  const save = (newList: string[]) => {
    setMitzvahs(newList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
  };

  const addMitzvah = (mitzvah: string) => {
    if (!mitzvah.trim()) return;
    save([...mitzvahs, mitzvah.trim()]);
  };

  const removeMitzvah = (index: number) => {
    const newList = [...mitzvahs];
    newList.splice(index, 1);
    if (newList.length === 0) newList.push("Do a good deed");
    save(newList);
  };

  const resetToDefaults = () => {
    save(DEFAULT_MITZVAHS);
  };

  return { mitzvahs, isLoaded, addMitzvah, removeMitzvah, resetToDefaults };
}

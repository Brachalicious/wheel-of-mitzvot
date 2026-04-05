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

const STORAGE_KEY = "mitzvah-wheel-list";
const STORAGE_VERSION_KEY = "mitzvah-wheel-version";
const CURRENT_VERSION = "2";

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
      // Version mismatch or first load — use new defaults
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
    if (newList.length === 0) {
      newList.push("Do a good deed");
    }
    save(newList);
  };

  const resetToDefaults = () => {
    save(DEFAULT_MITZVAHS);
  };

  return {
    mitzvahs,
    isLoaded,
    addMitzvah,
    removeMitzvah,
    resetToDefaults
  };
}

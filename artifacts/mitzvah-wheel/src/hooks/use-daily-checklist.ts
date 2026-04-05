import { useState, useEffect } from "react";

export interface DailyItem {
  id: string;
  name: string;
  description: string;
  category: "prayer" | "blessing" | "learning" | "physical" | "tzedakah";
  isCustom?: boolean;
}

const DEFAULT_DAILY: DailyItem[] = [
  {
    id: "modeh-ani",
    name: "Modeh Ani",
    description: "Recite Modeh Ani upon waking, before getting out of bed",
    category: "prayer",
  },
  {
    id: "negel-vasser",
    name: "Negel Vasser",
    description: "Wash hands with a cup upon waking — alternate 3× per hand — before touching your face or eyes",
    category: "physical",
  },
  {
    id: "birchat-hashachar",
    name: "Birchot HaShachar",
    description: "Recite the morning blessings (Elohai Neshamah, Birkot HaTorah, etc.)",
    category: "prayer",
  },
  {
    id: "tefillin",
    name: "Tefillin",
    description: "Put on tefillin (arm then head) before Shacharit on weekday mornings",
    category: "physical",
  },
  {
    id: "shema-morning",
    name: "Shema — Morning",
    description: "Recite Shema (with Barchu and blessings) during Shacharit — must be said before the 3rd halachic hour",
    category: "prayer",
  },
  {
    id: "shacharit",
    name: "Shacharit",
    description: "Complete the morning prayer service including Amidah",
    category: "prayer",
  },
  {
    id: "learn-torah",
    name: "Learn Torah",
    description: "Study Torah today — at minimum one halacha, one parsha pasuk, or one Daf Yomi page",
    category: "learning",
  },
  {
    id: "tzedakah",
    name: "Give Tzedakah",
    description: "Give to someone in need today — even a small amount fulfills the mitzvah",
    category: "tzedakah",
  },
  {
    id: "birkat-hamazon",
    name: "Birkat Hamazon",
    description: "Recite grace after eating bread",
    category: "blessing",
  },
  {
    id: "mincha",
    name: "Mincha",
    description: "Recite the afternoon prayer service — must begin before sunset",
    category: "prayer",
  },
  {
    id: "shema-evening",
    name: "Shema — Evening",
    description: "Recite Shema during Maariv — must be said after nightfall (tzait hakochavim)",
    category: "prayer",
  },
  {
    id: "maariv",
    name: "Maariv",
    description: "Complete the evening prayer service including evening Amidah",
    category: "prayer",
  },
  {
    id: "shmiras-halashon",
    name: "Shmiras HaLashon — Daily Portion",
    description: "Learn today's daily portion from the Sefer Chafetz Chaim or Sefer Shmirat HaLashon.",
    category: "learning",
  },
  {
    id: "count-omer",
    name: "Count the Omer",
    description: "Count today's Omer after nightfall with a blessing.",
    category: "blessing",
  },
];

const ITEMS_KEY = "mitzvah-wheel-daily-items";
const DONE_PREFIX = "mitzvah-wheel-daily-done-";

function todayKey() {
  return DONE_PREFIX + new Date().toISOString().slice(0, 10);
}

function loadItems(): DailyItem[] {
  try {
    const stored = localStorage.getItem(ITEMS_KEY);
    if (!stored) return DEFAULT_DAILY;
    const parsed: DailyItem[] = JSON.parse(stored);
    // merge: keep defaults that haven't been removed, append custom
    const defaultIds = new Set(DEFAULT_DAILY.map((d) => d.id));
    const storedIds = new Set(parsed.map((p) => p.id));
    const defaults = DEFAULT_DAILY.filter((d) => storedIds.has(d.id));
    const customs = parsed.filter((p) => !defaultIds.has(p.id));
    return [...defaults, ...customs];
  } catch {
    return DEFAULT_DAILY;
  }
}

function saveItems(items: DailyItem[]) {
  localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
}

function loadDone(): Set<string> {
  try {
    const stored = localStorage.getItem(todayKey());
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

function saveDone(done: Set<string>) {
  localStorage.setItem(todayKey(), JSON.stringify([...done]));
}

export function useDailyChecklist() {
  const [items, setItems] = useState<DailyItem[]>(loadItems);
  const [done, setDone] = useState<Set<string>>(loadDone);

  useEffect(() => { saveItems(items); }, [items]);
  useEffect(() => { saveDone(done); }, [done]);

  const toggle = (id: string) => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const addItem = (name: string, description: string) => {
    const id = `custom-${Date.now()}`;
    setItems((prev) => [...prev, { id, name, description, category: "learning", isCustom: true }]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setDone((prev) => { const next = new Set(prev); next.delete(id); return next; });
  };

  const resetDay = () => setDone(new Set());

  return { items, done, toggle, addItem, removeItem, resetDay };
}

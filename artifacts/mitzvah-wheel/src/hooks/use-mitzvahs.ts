import { useState, useEffect } from 'react';

export const DEFAULT_MITZVAHS = [
  "Honor your parents",
  "Give tzedakah (charity)",
  "Visit the sick",
  "Welcome guests (hachnasat orchim)",
  "Study Torah",
  "Shabbat candles",
  "Feed the hungry",
  "Comfort the mourner",
  "Protect the environment (bal tashchit)",
  "Pray with kavvanah",
  "Love your neighbor",
  "Return lost objects",
  "Say blessings (brachot)",
  "Speak kindly",
  "Rest on Shabbat"
];

const STORAGE_KEY = "mitzvah-wheel-list";

export function useMitzvahs() {
  const [mitzvahs, setMitzvahs] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setMitzvahs(JSON.parse(stored));
      } catch (e) {
        setMitzvahs(DEFAULT_MITZVAHS);
      }
    } else {
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
    // Don't allow empty wheel
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

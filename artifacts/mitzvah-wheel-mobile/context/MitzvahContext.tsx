import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { DEFAULT_MITZVAHS } from "@/data/mitzvahs";

const STORAGE_KEY = "mitzvah-wheel-mobile-list";
const STORAGE_VERSION_KEY = "mitzvah-wheel-mobile-version";
const COMPLETED_KEY = "mitzvah-wheel-mobile-completed";
const CURRENT_VERSION = "1";

interface MitzvahContextValue {
  mitzvahs: string[];
  isLoaded: boolean;
  addMitzvah: (name: string) => void;
  removeMitzvah: (index: number) => void;
  moveMitzvah: (fromIndex: number, toIndex: number) => void;
  resetToDefaults: () => void;

  completed: Set<string>;
  toggleCompleted: (name: string) => void;
  clearCompleted: () => void;
}

const MitzvahContext = createContext<MitzvahContextValue | null>(null);

export function MitzvahProvider({ children }: { children: React.ReactNode }) {
  const [mitzvahs, setMitzvahs] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function load() {
      try {
        const [storedVersion, stored, storedCompleted] = await Promise.all([
          AsyncStorage.getItem(STORAGE_VERSION_KEY),
          AsyncStorage.getItem(STORAGE_KEY),
          AsyncStorage.getItem(COMPLETED_KEY),
        ]);

        if (stored && storedVersion === CURRENT_VERSION) {
          setMitzvahs(JSON.parse(stored));
        } else {
          await AsyncStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
          setMitzvahs(DEFAULT_MITZVAHS);
        }

        if (storedCompleted) {
          setCompleted(new Set(JSON.parse(storedCompleted)));
        }
      } catch {
        setMitzvahs(DEFAULT_MITZVAHS);
      } finally {
        setIsLoaded(true);
      }
    }
    load();
  }, []);

  const save = useCallback(async (newList: string[]) => {
    setMitzvahs(newList);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
  }, []);

  const addMitzvah = useCallback((name: string) => {
    if (!name.trim()) return;
    setMitzvahs((prev) => {
      const newList = [...prev, name.trim()];
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
      return newList;
    });
  }, []);

  const removeMitzvah = useCallback((index: number) => {
    setMitzvahs((prev) => {
      const newList = [...prev];
      newList.splice(index, 1);
      if (newList.length === 0) newList.push("Do a good deed");
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
      return newList;
    });
  }, []);

  const moveMitzvah = useCallback((fromIndex: number, toIndex: number) => {
    setMitzvahs((prev) => {
      if (toIndex < 0 || toIndex >= prev.length) return prev;
      const newList = [...prev];
      const [item] = newList.splice(fromIndex, 1);
      newList.splice(toIndex, 0, item);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
      return newList;
    });
  }, []);

  const resetToDefaults = useCallback(async () => {
    await save(DEFAULT_MITZVAHS);
  }, [save]);

  const toggleCompleted = useCallback((name: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      AsyncStorage.setItem(COMPLETED_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  const clearCompleted = useCallback(async () => {
    setCompleted(new Set());
    await AsyncStorage.removeItem(COMPLETED_KEY);
  }, []);

  return (
    <MitzvahContext.Provider value={{
      mitzvahs, isLoaded, addMitzvah, removeMitzvah, moveMitzvah, resetToDefaults,
      completed, toggleCompleted, clearCompleted,
    }}>
      {children}
    </MitzvahContext.Provider>
  );
}

export function useMitzvahContext() {
  const ctx = useContext(MitzvahContext);
  if (!ctx) throw new Error("useMitzvahContext must be used within MitzvahProvider");
  return ctx;
}

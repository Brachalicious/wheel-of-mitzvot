import { useState, useEffect } from "react";

export interface GroupMember {
  id: string;
  name: string;
  completed: number;
  total: number;
  date: string;
  isMe?: boolean;
}

const MY_NAME_KEY = "mitzvah-wheel-my-name";
const GROUP_KEY = "mitzvah-wheel-group";

function loadName(): string {
  return localStorage.getItem(MY_NAME_KEY) ?? "";
}

function loadMembers(): GroupMember[] {
  try {
    const s = localStorage.getItem(GROUP_KEY);
    return s ? JSON.parse(s) : [];
  } catch { return []; }
}

export function encodeProgress(name: string, completed: number, total: number): string {
  const obj = { n: name, c: completed, t: total, d: new Date().toISOString().slice(0, 10) };
  return btoa(unescape(encodeURIComponent(JSON.stringify(obj))));
}

export function decodeProgress(code: string): GroupMember | null {
  try {
    const obj = JSON.parse(decodeURIComponent(escape(atob(code.trim()))));
    if (!obj.n || typeof obj.c !== "number" || typeof obj.t !== "number") return null;
    return { id: `${obj.n}-${obj.d}`, name: obj.n, completed: obj.c, total: obj.t, date: obj.d };
  } catch { return null; }
}

export function useGroup() {
  const [myName, setMyNameState] = useState<string>(loadName);
  const [members, setMembers] = useState<GroupMember[]>(loadMembers);

  useEffect(() => { localStorage.setItem(MY_NAME_KEY, myName); }, [myName]);
  useEffect(() => { localStorage.setItem(GROUP_KEY, JSON.stringify(members)); }, [members]);

  const setMyName = (name: string) => setMyNameState(name);

  const addMember = (member: GroupMember) => {
    setMembers((prev) => {
      const filtered = prev.filter((m) => m.id !== member.id && m.name !== member.name);
      return [...filtered, member];
    });
  };

  const removeMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const clearGroup = () => setMembers([]);

  return { myName, setMyName, members, addMember, removeMember, clearGroup };
}

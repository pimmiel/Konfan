import { create } from "zustand";
import type { MoodEntry, MoodKey } from "@/types";
import { load, save, STORAGE_KEYS } from "@/lib/storage";
import { poemForMood } from "@/lib/poems";

interface MoodState {
  entries: MoodEntry[];
  /** Records tonight's mood, picks a matching poem, returns the entry. */
  checkIn: (mood: MoodKey) => MoodEntry;
  /** Records a mood-less visit (still counts for streak). */
  visitIn: () => MoodEntry;
  attachReflection: (entryId: string, reflection: string) => void;
  /** consecutive-day streak, for the moon-phase indicator */
  streak: () => number;
}

const persist = (entries: MoodEntry[]) => save(STORAGE_KEYS.moods, entries);

export const useMoodStore = create<MoodState>((set, get) => ({
  entries: load<MoodEntry[]>(STORAGE_KEYS.moods, []),

  checkIn: (mood) => {
    const poem = poemForMood(mood);
    const entry: MoodEntry = {
      id: crypto.randomUUID(),
      mood,
      poemId: poem.id,
      createdAt: Date.now(),
    };
    const entries = [entry, ...get().entries];
    persist(entries);
    set({ entries });
    return entry;
  },

  visitIn: () => {
    const entry: MoodEntry = { id: crypto.randomUUID(), createdAt: Date.now() };
    const entries = [entry, ...get().entries];
    persist(entries);
    set({ entries });
    return entry;
  },

  attachReflection: (entryId, reflection) => {
    const entries = get().entries.map((e) =>
      e.id === entryId ? { ...e, reflection } : e
    );
    persist(entries);
    set({ entries });
  },

  streak: () => {
    const days = new Set(
      get().entries.map((e) => new Date(e.createdAt).toDateString())
    );
    let count = 0;
    const cursor = new Date();
    // count back from today while each day has an entry
    while (days.has(cursor.toDateString())) {
      count += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return count;
  },
}));

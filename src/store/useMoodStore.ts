import { create } from "zustand";
import type { MoodEntry, MoodKey } from "@/types";
import { load, save, STORAGE_KEYS } from "@/lib/storage";
import { nightKey, tonightKey } from "@/lib/night";

export interface KeepTonightInput {
  mood?: MoodKey;
  poemId?: string;
  reflection?: string;
}

interface MoodState {
  entries: MoodEntry[];
  /** Upsert: creates tonight's entry on first call, updates it on subsequent calls. */
  keepTonight: (input: KeepTonightInput) => MoodEntry;
  attachReflection: (entryId: string, reflection: string) => void;
  streak: () => number;
}

const persist = (entries: MoodEntry[]) => save(STORAGE_KEYS.moods, entries);

/** Merge duplicate entries per night, keeping the latest createdAt and
 *  any non-empty fields from any version of that night. */
function normalizeEntries(raw: MoodEntry[]): MoodEntry[] {
  const nights = new Map<string, MoodEntry>();
  // Process oldest-first so the newest pass wins on createdAt / truthy fields
  const sorted = [...raw].sort((a, b) => a.createdAt - b.createdAt);
  for (const entry of sorted) {
    const key = nightKey(entry.createdAt);
    const prev = nights.get(key);
    if (prev) {
      nights.set(key, {
        ...prev,
        ...entry,
        id: prev.id,                                    // stable id = first entry
        createdAt: entry.createdAt,                     // newest timestamp
        mood: entry.mood ?? prev.mood,
        poemId: entry.poemId ?? prev.poemId,
        reflection: entry.reflection ?? prev.reflection,
      });
    } else {
      nights.set(key, entry);
    }
  }
  return [...nights.values()].sort((a, b) => b.createdAt - a.createdAt);
}

export const useMoodStore = create<MoodState>((set, get) => ({
  entries: normalizeEntries(load<MoodEntry[]>(STORAGE_KEYS.moods, [])),

  keepTonight: (input) => {
    const key = tonightKey();
    const existing = get().entries.find((e) => nightKey(e.createdAt) === key);

    if (existing) {
      const updated: MoodEntry = {
        ...existing,
        mood: input.mood ?? existing.mood,
        poemId: input.poemId ?? existing.poemId,
        // Preserve existing reflection if the new one is blank (user cleared field on edit)
        reflection: input.reflection?.trim() || existing.reflection,
      };
      const entries = get().entries.map((e) =>
        e.id === existing.id ? updated : e
      );
      persist(entries);
      set({ entries });
      return updated;
    }

    const entry: MoodEntry = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      mood: input.mood,
      poemId: input.poemId,
      reflection: input.reflection?.trim() || undefined,
    };
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
    const nights = new Set(get().entries.map((e) => nightKey(e.createdAt)));
    let count = 0;
    let cursor = Date.now();
    while (nights.has(nightKey(cursor))) {
      count++;
      cursor -= 24 * 3_600_000;
    }
    return count;
  },
}));

import { create } from "zustand";
import type { Passage, MoodKey } from "@/types";
import { load, save, STORAGE_KEYS } from "@/lib/storage";

interface PassageState {
  passages: Passage[];
  add: (input: Omit<Passage, "id" | "createdAt">) => Passage;
  remove: (id: string) => void;
  removeByBook: (bookId: string) => void;
  byBook: (bookId: string) => Passage[];
  forResurfacing: () => Passage | null;
}

const persist = (passages: Passage[]) => save(STORAGE_KEYS.passages, passages);

export const usePassageStore = create<PassageState>((set, get) => ({
  passages: load<Passage[]>(STORAGE_KEYS.passages, []),

  add: (input) => {
    const passage: Passage = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    const passages = [passage, ...get().passages];
    persist(passages);
    set({ passages });
    return passage;
  },

  remove: (id) => {
    const passages = get().passages.filter((p) => p.id !== id);
    persist(passages);
    set({ passages });
  },

  removeByBook: (bookId) => {
    const passages = get().passages.filter((p) => p.bookId !== bookId);
    persist(passages);
    set({ passages });
  },

  byBook: (bookId) =>
    get()
      .passages.filter((p) => p.bookId === bookId)
      .sort((a, b) => b.createdAt - a.createdAt),

  forResurfacing: () => {
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

    const eligible = get().passages.filter((p) => p.createdAt < sevenDaysAgo);
    if (eligible.length === 0) return null;

    eligible.sort((a, b) => (a.lastSeenAt ?? 0) - (b.lastSeenAt ?? 0));
    const passage = eligible[0];

    const passages = get().passages.map((p) =>
      p.id === passage.id ? { ...p, lastSeenAt: now } : p
    );
    persist(passages);
    set({ passages });

    return passage;
  },
}));

// Re-export type for convenience
export type { MoodKey };

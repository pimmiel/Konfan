// Tiny type-safe localStorage wrapper. Zustand's persist middleware could
// replace this, but keeping it explicit makes the data layer easy to explain.

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full / unavailable — fail quietly, app still works in-session
  }
}

export const STORAGE_KEYS = {
  books: "konfan.books",
  moods: "konfan.moodEntries",
  theme: "konfan.bedtime",
  passages: "konfan.passages",
  activeBook: "konfan.activeBook",
} as const;

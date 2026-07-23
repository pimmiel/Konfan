// Core domain models for Kònfăn.
// Keep these as the single source of truth; UI props derive from them.

export type MoodKey =
  | "calm"
  | "tender"
  | "weary"
  | "hopeful"
  | "restless";

export interface Mood {
  key: MoodKey;
  labelTh: string;
  labelEn: string;
  /** Emoji/glyph shown on the picker petal */
  glyph: string;
  /** Ambient tint applied to the room when chosen (CSS color) */
  tint: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  /** Cover image URL (Open Library) or undefined -> render a woven placeholder */
  coverUrl?: string;
  currentPage: number;
  totalPages?: number;
  status: "reading" | "finished";
  addedAt: number; // epoch ms
}

export interface Poem {
  id: string;
  /** Lines are kept as an array so we can stagger-reveal them */
  lines: string[];
  attribution: string; // e.g. "— บทกวีต้นฉบับ" (all bundled poems are original)
  moods: MoodKey[];
  lang: "th" | "en";
}

export interface MoodEntry {
  id: string;
  mood: MoodKey;
  poemId: string;
  /** AI-written reflection (v2). Undefined until the API is wired up. */
  reflection?: string;
  createdAt: number;
}

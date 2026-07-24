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
  closingFeeling?: string;
}

export interface Passage {
  id: string;
  bookId: string;
  text: string;
  note?: string;
  page?: number;
  mood?: MoodKey;
  createdAt: number;
  lastSeenAt?: number;
}

export interface Poem {
  id: string;
  /** Lines are kept as an array so we can stagger-reveal them */
  lines: string[];
  attribution: string; // e.g. "— บทกวีต้นฉบับ" (all bundled poems are original)
  moods: MoodKey[];
  lang: "th" | "en";
  /** ID of the translation pair shown below the divider on PoemCard */
  pairedWith?: string;
}

export interface MoodEntry {
  id: string;
  /** Absent when the user kept tonight without selecting a mood (visit-only entry) */
  mood?: MoodKey;
  /** Absent for visit-only entries */
  poemId?: string;
  reflection?: string;
  createdAt: number;
}

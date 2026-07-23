import type { Mood, Poem, MoodKey } from "@/types";

// The five moods. Tints are intentionally low-saturation so the room
// only *warms* toward a feeling rather than shouting a color.
export const MOODS: Mood[] = [
  { key: "calm",     labelTh: "สงบ",       labelEn: "Calm",     glyph: "🌙", tint: "#8B9D83" },
  { key: "tender",   labelTh: "อ่อนโยน",   labelEn: "Tender",   glyph: "🌸", tint: "#C99BA0" },
  { key: "weary",    labelTh: "เหนื่อยล้า", labelEn: "Weary",    glyph: "🍂", tint: "#C4842F" },
  { key: "hopeful",  labelTh: "มีหวัง",    labelEn: "Hopeful",  glyph: "🕯️", tint: "#E0A458" },
  { key: "restless", labelTh: "ใจไม่นิ่ง",  labelEn: "Restless", glyph: "🌾", tint: "#6E5C6B" },
];

// IMPORTANT: every poem below is ORIGINAL, written for this project, so the
// app ships without any licensing concerns. Replace/expand freely, but keep
// bundled text original. (Do NOT paste poems by living poets into this file.)
export const POEMS: Poem[] = [
  {
    id: "p-calm-1",
    lines: ["วางวันไว้ตรงธรณีประตู", "ค่ำคืนไม่ต้องการอะไรจากเธอ", "นอกจากลมหายใจช้าๆ"],
    attribution: "— บทกวีต้นฉบับ",
    moods: ["calm", "weary"],
    lang: "th",
  },
  {
    id: "p-calm-2",
    lines: ["Let the lamp keep the dark company.", "You have carried enough today.", "Set it by the door."],
    attribution: "— original",
    moods: ["calm", "weary"],
    lang: "en",
  },
  {
    id: "p-tender-1",
    lines: ["ใจดีกับตัวเองสักหน่อย", "อย่างที่เธอใจดีกับหน้าหนังสือ", "ที่พับมุมไว้รอวันพรุ่งนี้"],
    attribution: "— บทกวีต้นฉบับ",
    moods: ["tender", "hopeful"],
    lang: "th",
  },
  {
    id: "p-tender-2",
    lines: ["Be as gentle with yourself", "as you are with a dog-eared page—", "kept, not judged, for tomorrow."],
    attribution: "— original",
    moods: ["tender"],
    lang: "en",
  },
  {
    id: "p-weary-1",
    lines: ["เหนื่อยก็พักได้", "ดวงดาวยังหมุนต่อ", "โดยไม่ต้องให้เธอช่วยถือ"],
    attribution: "— บทกวีต้นฉบับ",
    moods: ["weary", "restless"],
    lang: "th",
  },
  {
    id: "p-hopeful-1",
    lines: ["พรุ่งนี้เป็นหน้ากระดาษเปล่า", "ยังไม่มีใครเขียนอะไรลงไป", "แม้แต่ความกลัวของเธอ"],
    attribution: "— บทกวีต้นฉบับ",
    moods: ["hopeful", "restless"],
    lang: "th",
  },
  {
    id: "p-hopeful-2",
    lines: ["Tomorrow is an unwritten page.", "Nothing is on it yet—", "not even your worry."],
    attribution: "— original",
    moods: ["hopeful"],
    lang: "en",
  },
  {
    id: "p-restless-1",
    lines: ["ความคิดยังวิ่งอยู่ก็ปล่อยมันวิ่ง", "เธอไม่ต้องวิ่งตาม", "แค่มองมันจากริมเตียง"],
    attribution: "— บทกวีต้นฉบับ",
    moods: ["restless"],
    lang: "th",
  },
];

const rand = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

/** Pick a poem that fits the mood. Falls back to any poem if none tagged. */
export function poemForMood(mood: MoodKey): Poem {
  const matches = POEMS.filter((p) => p.moods.includes(mood));
  return matches.length ? rand(matches) : rand(POEMS);
}

export function moodByKey(key: MoodKey): Mood {
  return MOODS.find((m) => m.key === key)!;
}

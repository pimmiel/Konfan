import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MoodPicker } from "@/components/mood/MoodPicker";
import { PoemCard } from "@/components/mood/PoemCard";
import { MoonStreak } from "@/components/mood/MoonStreak";
import { ReflectionCard } from "@/components/reflection/ReflectionCard";
import { ResurfacingCard } from "@/components/passages/ResurfacingCard";
import { Display, Eyebrow } from "@/components/ui/Typography";
import { useMoodStore } from "@/store/useMoodStore";
import { useBookStore } from "@/store/useBookStore";
import { POEMS, moodByKey } from "@/lib/poems";
import type { MoodKey } from "@/types";

const EASE = [0.22, 1, 0.36, 1] as const;

const TEXTAREA = [
  "w-full resize-none bg-transparent border border-line rounded-card px-4 py-3",
  "text-ink placeholder:text-muted font-sans text-base",
  "focus:outline-none focus:ring-2 focus:ring-honey focus:border-honey",
  "transition-colors duration-300 ease-calm",
].join(" ");

export function TonightView() {
  const [mood, setMood] = useState<MoodKey | undefined>();
  const [poemId, setPoemId] = useState<string | undefined>();
  const [entryId, setEntryId] = useState<string | undefined>();

  // Passage state — lifted here so it feeds into ReflectionCard on save
  const [passageOpen, setPassageOpen] = useState(true);
  const [passageText, setPassageText] = useState("");
  const [passagePage, setPassagePage] = useState("");
  const [passageNote, setPassageNote] = useState("");

  const checkIn = useMoodStore((s) => s.checkIn);
  const streak = useMoodStore((s) => s.streak)();

  const books = useBookStore((s) => s.books);
  const activeBookId = useBookStore((s) => s.activeBookId);
  const setActiveBook = useBookStore((s) => s.setActiveBook);

  const readingBooks = books.filter((b) => b.status === "reading");
  const activeBook = readingBooks.find((b) => b.id === activeBookId) ?? readingBooks[0];

  const cycleBook = () => {
    if (readingBooks.length < 2 || !activeBook) return;
    const idx = readingBooks.findIndex((b) => b.id === activeBook.id);
    const next = readingBooks[(idx + 1) % readingBooks.length];
    setActiveBook(next.id);
  };

  const onSelect = (m: MoodKey) => {
    const entry = checkIn(m);
    setMood(m);
    setPoemId(entry.poemId);
    setEntryId(entry.id);
  };

  const poem = poemId ? POEMS.find((p) => p.id === poemId) : undefined;
  const tint = mood ? moodByKey(mood).tint : undefined;

  const passageData =
    passageOpen && passageText.trim() && activeBook
      ? {
          bookId: activeBook.id,
          text: passageText.trim(),
          page: passagePage ? parseInt(passagePage, 10) : undefined,
          note: passageNote.trim() || undefined,
          mood,
        }
      : undefined;

  return (
    <>
      {/* ambient tint that warms the room toward the chosen mood */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 transition-opacity duration-1000 ease-calm"
        style={{
          background: tint
            ? `radial-gradient(80% 60% at 50% 0%, ${tint}22, transparent 70%)`
            : "transparent",
          opacity: tint ? 1 : 0,
        }}
      />

      <main className="relative z-10 max-w-2xl mx-auto px-6 pt-8 pb-24 flex flex-col items-center gap-10 text-center">
        <MoonStreak streak={streak} />

        <div className="space-y-3">
          <Eyebrow>คืนนี้</Eyebrow>
          <Display>ปิดวันด้วยลมหายใจช้าๆ</Display>
          <p className="font-display italic text-muted text-base">Close the day with a slow breath</p>
        </div>

        {/* Passage section — comes first, only when reading a book */}
        {activeBook && (
          <div className="w-full max-w-md flex flex-col gap-3 text-left">
            <Eyebrow className="text-center">
              คืนนี้มีประโยคไหนอยู่กับเธอไหม · Did a line stay with you tonight?
            </Eyebrow>

            <AnimatePresence>
              {passageOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ ease: EASE, duration: 0.35 }}
                  className="flex flex-col gap-3 overflow-hidden"
                >
                  {/* Book label */}
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-xs text-muted">จาก ·</span>
                    <button
                      onClick={cycleBook}
                      className={
                        "font-sans text-xs text-honey truncate max-w-[220px] " +
                        (readingBooks.length > 1
                          ? "underline underline-offset-2 hover:opacity-80"
                          : "cursor-default")
                      }
                      disabled={readingBooks.length < 2}
                      title={readingBooks.length > 1 ? "แตะเพื่อเปลี่ยนเล่ม" : undefined}
                    >
                      {activeBook.title}
                    </button>
                  </div>

                  <textarea
                    value={passageText}
                    onChange={(e) => setPassageText(e.target.value)}
                    rows={3}
                    placeholder="พิมพ์ประโยคที่อยากเก็บ…"
                    className={TEXTAREA}
                  />

                  <div className="flex gap-3">
                    <input
                      type="number"
                      value={passagePage}
                      onChange={(e) => setPassagePage(e.target.value)}
                      placeholder="หน้า (ไม่บังคับ)"
                      className={
                        "w-32 bg-transparent border border-line rounded-card px-3 py-2 " +
                        "font-sans text-sm text-ink placeholder:text-muted " +
                        "focus:outline-none focus:ring-2 focus:ring-honey focus:border-honey " +
                        "transition-colors duration-300 ease-calm"
                      }
                    />
                  </div>

                  <textarea
                    value={passageNote}
                    onChange={(e) => setPassageNote(e.target.value)}
                    rows={2}
                    placeholder="ทำไมมันโดน · why it stayed with you (ไม่บังคับ)"
                    className={TEXTAREA}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-center">
              <button
                onClick={() => setPassageOpen((o) => !o)}
                className="font-sans text-xs text-muted hover:text-ink transition-colors duration-300 ease-calm"
              >
                {passageOpen
                  ? "ไม่มีคืนนี้ · Not tonight"
                  : "+ เพิ่มประโยค · Add a line"}
              </button>
            </div>
          </div>
        )}

        <MoodPicker
          selected={mood}
          onSelect={onSelect}
          eyebrow="แล้วใจเธอคืนนี้เป็นยังไง · and how does tonight feel?"
        />

        <AnimatePresence mode="wait">
          {poem && (
            <motion.div
              key={poem.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ ease: [0.22, 1, 0.36, 1] }}
            >
              <PoemCard poem={poem} />
            </motion.div>
          )}
        </AnimatePresence>

        <ResurfacingCard />

        <AnimatePresence>
          {entryId && poem && (
            <motion.div
              key={`reflection-${entryId}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-md"
            >
              <ReflectionCard
                entryId={entryId}
                mood={mood}
                passageData={passageData}
                passageBookTitle={activeBook?.title}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}

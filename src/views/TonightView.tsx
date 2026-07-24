import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MoodPicker } from "@/components/mood/MoodPicker";
import { PoemCard } from "@/components/mood/PoemCard";
import { MoonStreak } from "@/components/mood/MoonStreak";
import { ResurfacingCard } from "@/components/passages/ResurfacingCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Display, Eyebrow } from "@/components/ui/Typography";
import { useMoodStore } from "@/store/useMoodStore";
import { usePassageStore } from "@/store/usePassageStore";
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
  // Mood + poem state
  const [mood, setMood] = useState<MoodKey | undefined>();
  const [poemId, setPoemId] = useState<string | undefined>();
  const [entryId, setEntryId] = useState<string | undefined>();

  // Passage state
  const [passageOpen, setPassageOpen] = useState(true);
  const [passageText, setPassageText] = useState("");
  const [passagePage, setPassagePage] = useState("");
  const [passageNote, setPassageNote] = useState("");

  // Reflection + save state
  const [reflection, setReflection] = useState("");
  const [kept, setKept] = useState(false);
  const [savedBookTitle, setSavedBookTitle] = useState<string | undefined>();

  const checkIn = useMoodStore((s) => s.checkIn);
  const visitIn = useMoodStore((s) => s.visitIn);
  const attachReflection = useMoodStore((s) => s.attachReflection);
  const addPassage = usePassageStore((s) => s.add);
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

  // Selecting a mood creates the entry immediately (needed for poemId)
  const onSelect = (m: MoodKey) => {
    if (kept) return;
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

  const handleKeep = () => {
    // Use existing mood entry, or create a bare visit entry for the streak
    const eid = entryId ?? visitIn().id;

    if (reflection.trim()) {
      attachReflection(eid, reflection.trim());
    }

    if (passageData) {
      addPassage(passageData);
      setSavedBookTitle(activeBook?.title);
    }

    setKept(true);
  };

  return (
    <>
      {/* Ambient tint toward chosen mood */}
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

        {/* 1. Greeting + กำลังอ่าน */}
        <div className="space-y-3">
          <Eyebrow>คืนนี้</Eyebrow>
          <Display>ปิดวันด้วยลมหายใจช้าๆ</Display>
          <p className="font-display italic text-muted text-base">Close the day with a slow breath</p>
          {activeBook && (
            <div className="flex items-center justify-center gap-2 pt-1">
              <Eyebrow>กำลังอ่าน</Eyebrow>
              <span className="font-sans text-sm text-honey truncate max-w-xs">
                {activeBook.title}
              </span>
            </div>
          )}
        </div>

        {/* 2. Passage section — ตัวเอก (only when reading a book) */}
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
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-xs text-muted">จาก ·</span>
                    <button
                      onClick={cycleBook}
                      disabled={readingBooks.length < 2}
                      className={
                        "font-sans text-xs text-honey truncate max-w-[220px] " +
                        (readingBooks.length > 1
                          ? "underline underline-offset-2 hover:opacity-80"
                          : "cursor-default")
                      }
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
                    disabled={kept}
                  />

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
                    disabled={kept}
                  />

                  <textarea
                    value={passageNote}
                    onChange={(e) => setPassageNote(e.target.value)}
                    rows={2}
                    placeholder="ทำไมมันโดน · why it stayed with you (ไม่บังคับ)"
                    className={TEXTAREA}
                    disabled={kept}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {!kept && (
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
            )}
          </div>
        )}

        {/* 3. Mood picker — ตัวประกอบ */}
        {!kept && (
          <MoodPicker
            selected={mood}
            onSelect={onSelect}
            eyebrow="แล้วใจเธอคืนนี้เป็นยังไง · and how does tonight feel?"
          />
        )}

        {/* 4. Poem */}
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

        {/* Resurfacing */}
        <ResurfacingCard />

        {/* 5. Reflection + save — always visible, nothing required */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          <Card className="border-dashed shadow-none">
            <AnimatePresence mode="wait">
              {kept ? (
                <motion.div
                  key="kept"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ease: EASE, duration: 0.5 }}
                  className="text-center space-y-2"
                >
                  <p className="font-display italic text-sage text-lg">
                    เก็บไว้แล้ว ราตรีสวัสดิ์นะ
                  </p>
                  <p className="font-sans text-sm text-muted">Kept. Sleep softly.</p>
                  {savedBookTitle && (
                    <p className="font-sans text-xs text-honey pt-1">
                      เก็บ 1 ประโยคจาก {savedBookTitle} ไว้แล้ว · Saved a line from {savedBookTitle}
                    </p>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ ease: EASE, duration: 0.3 }}
                  className="flex flex-col gap-4"
                >
                  <textarea
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    rows={3}
                    placeholder="วันนี้ฉันรู้สึก… · today I felt…"
                    className={TEXTAREA}
                  />
                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm" onClick={handleKeep}>
                      เก็บค่ำคืนนี้ · Keep tonight
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </main>
    </>
  );
}

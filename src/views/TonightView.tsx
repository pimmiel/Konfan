import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Moon } from "lucide-react";
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
import { POEMS, moodByKey, poemForMood } from "@/lib/poems";
import { nightKey, tonightKey } from "@/lib/night";
import type { MoodKey } from "@/types";

const EASE = [0.22, 1, 0.36, 1] as const;

const TEXTAREA = [
  "w-full resize-none bg-transparent border border-line rounded-card px-4 py-3",
  "text-ink placeholder:text-muted font-sans text-base",
  "focus:outline-none focus:ring-2 focus:ring-honey focus:border-honey",
  "transition-colors duration-300 ease-calm",
].join(" ");

interface TonightViewProps {
  onKept?: () => void;
}

export function TonightView({ onKept }: TonightViewProps) {
  // ── Store access ───────────────────────────────────────────────────────────
  const entries   = useMoodStore((s) => s.entries);
  const keepTonight = useMoodStore((s) => s.keepTonight);
  const streak    = useMoodStore((s) => s.streak)();
  const addPassage = usePassageStore((s) => s.add);
  const passages  = usePassageStore((s) => s.passages);

  const books        = useBookStore((s) => s.books);
  const activeBookId = useBookStore((s) => s.activeBookId);
  const setActiveBook = useBookStore((s) => s.setActiveBook);

  // ── Derived from store ─────────────────────────────────────────────────────
  const tonightEntry = useMemo(
    () => entries.find((e) => nightKey(e.createdAt) === tonightKey()),
    [entries]
  );

  const hasPassageTonight = useMemo(
    () => passages.some((p) => nightKey(p.createdAt) === tonightKey()),
    [passages]
  );

  const readingBooks = books.filter((b) => b.status === "reading");
  const activeBook   =
    readingBooks.find((b) => b.id === activeBookId) ?? readingBooks[0];

  // ── Local UI state ─────────────────────────────────────────────────────────
  const [phase, setPhase]           = useState<"form" | "closed">(
    tonightEntry ? "closed" : "form"
  );
  const [mood, setMood]             = useState<MoodKey | undefined>(
    tonightEntry?.mood
  );
  const [poemId, setPoemId]         = useState<string | undefined>(
    tonightEntry?.poemId
  );
  const [passageOpen, setPassageOpen] = useState(true);
  const [passageText, setPassageText] = useState("");
  const [passagePage, setPassagePage] = useState("");
  const [passageNote, setPassageNote] = useState("");
  const [reflection, setReflection]   = useState(tonightEntry?.reflection ?? "");
  const [passageKept, setPassageKept] = useState(hasPassageTonight);
  const [savedBookTitle, setSavedBookTitle] = useState<string | undefined>();

  // ── Helpers ────────────────────────────────────────────────────────────────
  const cycleBook = () => {
    if (readingBooks.length < 2 || !activeBook) return;
    const idx  = readingBooks.findIndex((b) => b.id === activeBook.id);
    const next = readingBooks[(idx + 1) % readingBooks.length];
    setActiveBook(next.id);
  };

  // Selecting a mood only updates local state — no store write until "keep"
  const onSelect = (m: MoodKey) => {
    if (phase === "closed") return;
    const poem = poemForMood(m);
    setMood(m);
    setPoemId(poem.id);
  };

  const passageData =
    passageOpen && passageText.trim() && activeBook && !passageKept
      ? {
          bookId: activeBook.id,
          text: passageText.trim(),
          page: passagePage ? parseInt(passagePage, 10) : undefined,
          note: passageNote.trim() || undefined,
          mood,
        }
      : undefined;

  const handleKeep = () => {
    keepTonight({ mood, poemId, reflection });

    if (passageData) {
      addPassage(passageData);
      setSavedBookTitle(activeBook?.title);
      setPassageKept(true);
    }

    setPhase("closed");
    onKept?.();
  };

  const handleEdit = () => {
    // Prefill form with tonight's saved values
    setMood(tonightEntry?.mood);
    setPoemId(tonightEntry?.poemId);
    setReflection(tonightEntry?.reflection ?? "");
    // Passage fields stay empty — passage already in library
    setPassageText("");
    setPassagePage("");
    setPassageNote("");
    setPhase("form");
  };

  // ── Derived display values ─────────────────────────────────────────────────
  const poem = poemId ? POEMS.find((p) => p.id === poemId) : undefined;
  const displayMood = phase === "closed" ? tonightEntry?.mood : mood;
  const tint = displayMood ? moodByKey(displayMood).tint : undefined;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Ambient mood tint */}
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

        {/* 1. Greeting */}
        <div className="space-y-3">
          <Eyebrow>คืนนี้</Eyebrow>
          <Display>ปิดวันด้วยลมหายใจช้าๆ</Display>
          <p className="font-display italic text-muted text-base">
            Close the day with a slow breath
          </p>
          {activeBook && (
            <div className="flex items-center justify-center gap-2 pt-1">
              <Eyebrow>กำลังอ่าน</Eyebrow>
              <span className="font-sans text-sm text-honey truncate max-w-xs">
                {activeBook.title}
              </span>
            </div>
          )}
        </div>

        {/* 2–5: Form or closed state */}
        {phase === "form" ? (
          <>
            {/* 2. Passage section */}
            {activeBook && !passageKept && (
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
                      />

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

            {/* 3. Mood picker */}
            <MoodPicker
              selected={mood}
              onSelect={onSelect}
              eyebrow="แล้วใจเธอคืนนี้เป็นยังไง · and how does tonight feel?"
            />

            {/* 4. Poem */}
            <AnimatePresence mode="wait">
              {poem && (
                <motion.div
                  key={poem.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ ease: EASE }}
                >
                  <PoemCard poem={poem} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Resurfacing */}
            <ResurfacingCard />

            {/* 5. Reflection + save */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, ease: EASE }}
              className="w-full max-w-md"
            >
              <Card className="border-dashed shadow-none">
                <div className="flex flex-col gap-4">
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
                </div>
              </Card>
            </motion.div>
          </>
        ) : (
          <>
            {/* Closed-tonight summary */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ease: EASE, duration: 0.5 }}
              className="w-full max-w-md"
            >
              <Card className="border-dashed shadow-none">
                <div className="flex flex-col items-center gap-4 text-center">
                  {/* Header */}
                  <div className="flex flex-col items-center gap-1.5">
                    <Moon size={18} strokeWidth={1.5} className="text-muted" aria-hidden />
                    <p className="font-display italic text-ink text-lg">
                      คืนนี้เธอปิดวันไปแล้ว
                    </p>
                    <p className="font-sans text-xs text-muted">
                      You've closed today
                    </p>
                  </div>

                  {/* Mood */}
                  {tonightEntry?.mood && (
                    <p className="font-sans text-sm text-ink">
                      {moodByKey(tonightEntry.mood).glyph}{" "}
                      {moodByKey(tonightEntry.mood).labelTh}
                    </p>
                  )}

                  {/* Reflection snippet */}
                  {tonightEntry?.reflection && (
                    <p className="font-sans text-sm text-muted italic">
                      "{tonightEntry.reflection}"
                    </p>
                  )}

                  {/* Saved passage indicator */}
                  {savedBookTitle && (
                    <p className="font-sans text-xs text-honey">
                      เก็บประโยคจาก {savedBookTitle} ไว้แล้ว ·{" "}
                      Saved a line from {savedBookTitle}
                    </p>
                  )}

                  {/* Edit button — quiet, unobtrusive */}
                  <button
                    onClick={handleEdit}
                    className="font-sans text-xs text-muted/60 hover:text-muted transition-colors duration-300 ease-calm"
                  >
                    แก้ไขค่ำคืนนี้ · Edit tonight
                  </button>
                </div>
              </Card>
            </motion.div>

            {/* Resurfacing still visible in closed state */}
            <ResurfacingCard />
          </>
        )}
      </main>
    </>
  );
}

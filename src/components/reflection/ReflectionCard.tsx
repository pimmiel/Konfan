import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useMoodStore } from "@/store/useMoodStore";
import { useBookStore } from "@/store/useBookStore";
import { usePassageStore } from "@/store/usePassageStore";
import type { MoodKey } from "@/types";

interface ReflectionCardProps {
  entryId: string;
  mood?: MoodKey;
  onKept?: () => void;
}

const TEXTAREA = [
  "w-full resize-none bg-transparent border border-line rounded-card px-4 py-3",
  "text-ink placeholder:text-muted font-sans text-base",
  "focus:outline-none focus:ring-2 focus:ring-honey focus:border-honey",
  "transition-colors duration-300 ease-calm",
].join(" ");

const EASE = [0.22, 1, 0.36, 1] as const;

export function ReflectionCard({ entryId, mood, onKept }: ReflectionCardProps) {
  const [reflection, setReflection] = useState("");
  const [passageOpen, setPassageOpen] = useState(false);
  const [passageText, setPassageText] = useState("");
  const [passagePage, setPassagePage] = useState("");
  const [passageNote, setPassageNote] = useState("");
  const [kept, setKept] = useState(false);
  const [savedTitle, setSavedTitle] = useState<string | undefined>();

  const attachReflection = useMoodStore((s) => s.attachReflection);
  const addPassage = usePassageStore((s) => s.add);

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

  const handleKeep = () => {
    if (!reflection.trim()) return;

    attachReflection(entryId, reflection.trim());

    let title: string | undefined;
    if (passageOpen && passageText.trim() && activeBook) {
      addPassage({
        bookId: activeBook.id,
        text: passageText.trim(),
        note: passageNote.trim() || undefined,
        page: passagePage ? parseInt(passagePage, 10) : undefined,
        mood,
      });
      title = activeBook.title;
    }

    setSavedTitle(title);
    setKept(true);
    onKept?.();
  };

  return (
    <Card className="max-w-md w-full border-dashed shadow-none">
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
            {savedTitle && (
              <p className="font-sans text-xs text-honey pt-1">
                เก็บ 1 ประโยคจาก {savedTitle} ไว้แล้ว · Saved a line from {savedTitle}
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
            {/* ความรู้สึกวันนี้ */}
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              rows={3}
              placeholder="วันนี้ฉันรู้สึก… · today I felt…"
              className={TEXTAREA}
            />

            {/* Section เก็บประโยค — โผล่เฉพาะถ้ามี activeBook */}
            {activeBook && (
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setPassageOpen((o) => !o)}
                  className="flex items-center gap-1.5 font-sans text-sm text-muted hover:text-honey transition-colors duration-300 ease-calm text-left"
                >
                  <span aria-hidden>{passageOpen ? "−" : "+"}</span>
                  <span>
                    {passageOpen
                      ? "ยกเลิกเก็บประโยค · Cancel"
                      : "เก็บประโยคจากเล่มนี้ · Save a line from this book"}
                  </span>
                </button>

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
                            "font-sans text-xs text-honey truncate max-w-[200px] " +
                            (readingBooks.length > 1
                              ? "underline underline-offset-2 hover:text-honey-deep"
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
              </div>
            )}

            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleKeep}
                disabled={!reflection.trim()}
              >
                เก็บค่ำคืนนี้ · Keep tonight
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

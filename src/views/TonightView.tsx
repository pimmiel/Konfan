import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MoodPicker } from "@/components/mood/MoodPicker";
import { PoemCard } from "@/components/mood/PoemCard";
import { Display, Eyebrow } from "@/components/ui/Typography";
import { useMoodStore } from "@/store/useMoodStore";
import { useBookStore } from "@/store/useBookStore";
import { POEMS, moodByKey } from "@/lib/poems";
import type { MoodKey } from "@/types";

export function TonightView() {
  const [mood, setMood] = useState<MoodKey | undefined>();
  const [poemId, setPoemId] = useState<string | undefined>();
  const checkIn = useMoodStore((s) => s.checkIn);
  const currentBook = useBookStore((s) => s.books.find((b) => b.status === "reading"));

  const onSelect = (m: MoodKey) => {
    setMood(m);
    const entry = checkIn(m);
    setPoemId(entry.poemId);
  };

  const poem = poemId ? POEMS.find((p) => p.id === poemId) : undefined;
  const tint = mood ? moodByKey(mood).tint : undefined;

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
        <div className="space-y-3">
          <Eyebrow>คืนนี้</Eyebrow>
          <Display>ปิดวันด้วยลมหายใจช้าๆ</Display>
          {currentBook && (
            <div className="flex items-center justify-center gap-2 pt-1">
              <Eyebrow>กำลังอ่าน</Eyebrow>
              <span className="font-sans text-sm text-honey truncate max-w-xs">
                {currentBook.title}
              </span>
            </div>
          )}
        </div>

        <MoodPicker selected={mood} onSelect={onSelect} />

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
      </main>
    </>
  );
}

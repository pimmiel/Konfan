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

export function TonightView() {
  const [mood, setMood] = useState<MoodKey | undefined>();
  const [poemId, setPoemId] = useState<string | undefined>();
  const [entryId, setEntryId] = useState<string | undefined>();
  const checkIn = useMoodStore((s) => s.checkIn);
  const streak = useMoodStore((s) => s.streak)();
  const currentBook = useBookStore((s) => s.books.find((b) => b.status === "reading"));

  const onSelect = (m: MoodKey) => {
    const entry = checkIn(m);
    setMood(m);
    setPoemId(entry.poemId);
    setEntryId(entry.id);
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
        <MoonStreak streak={streak} />

        <div className="space-y-3">
          <Eyebrow>คืนนี้</Eyebrow>
          <Display>ปิดวันด้วยลมหายใจช้าๆ</Display>
          <p className="font-display italic text-muted text-base">Close the day with a slow breath</p>
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
              <ReflectionCard entryId={entryId} mood={mood} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useMoodStore } from "@/store/useMoodStore";
import { usePassageStore } from "@/store/usePassageStore";
import type { MoodKey } from "@/types";

interface PassageData {
  bookId: string;
  text: string;
  page?: number;
  note?: string;
  mood?: MoodKey;
}

interface ReflectionCardProps {
  entryId: string;
  mood?: MoodKey;
  passageData?: PassageData;
  passageBookTitle?: string;
  onKept?: () => void;
}

const TEXTAREA = [
  "w-full resize-none bg-transparent border border-line rounded-card px-4 py-3",
  "text-ink placeholder:text-muted font-sans text-base",
  "focus:outline-none focus:ring-2 focus:ring-honey focus:border-honey",
  "transition-colors duration-300 ease-calm",
].join(" ");

const EASE = [0.22, 1, 0.36, 1] as const;

export function ReflectionCard({ entryId, passageData, passageBookTitle, onKept }: ReflectionCardProps) {
  const [reflection, setReflection] = useState("");
  const [kept, setKept] = useState(false);
  const [savedTitle, setSavedTitle] = useState<string | undefined>();

  const attachReflection = useMoodStore((s) => s.attachReflection);
  const addPassage = usePassageStore((s) => s.add);

  const handleKeep = () => {
    if (!reflection.trim()) return;

    attachReflection(entryId, reflection.trim());

    if (passageData) {
      addPassage(passageData);
      setSavedTitle(passageBookTitle);
    }

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
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              rows={3}
              placeholder="วันนี้ฉันรู้สึก… · today I felt…"
              className={TEXTAREA}
            />

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

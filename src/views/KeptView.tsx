import { useMemo } from "react";
import { motion } from "framer-motion";
import { Display, Eyebrow } from "@/components/ui/Typography";
import { usePassageStore } from "@/store/usePassageStore";
import { useBookStore } from "@/store/useBookStore";
import { relativeTime } from "@/lib/relativeTime";
import { DEMO_PASSAGES } from "@/lib/demoPassages";

const EASE = [0.22, 1, 0.36, 1] as const;

export function KeptView() {
  const passages = usePassageStore((s) => s.passages);
  const books = useBookStore((s) => s.books);

  const bookMap = useMemo(
    () => new Map(books.map((b) => [b.id, b])),
    [books]
  );

  const sorted = useMemo(
    () => [...passages].sort((a, b) => b.createdAt - a.createdAt),
    [passages]
  );

  return (
    <div className="relative z-10 max-w-2xl mx-auto px-6 pt-8 pb-24">
      <div className="mb-8 space-y-2">
        <Display>คำที่เก็บไว้</Display>
        <Eyebrow>Kept lines</Eyebrow>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col">
          {DEMO_PASSAGES.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, ease: EASE }}
              className="flex flex-col gap-1.5 border-b border-line/60 py-5 last:border-0"
            >
              <Eyebrow>ตัวอย่าง · a glimpse</Eyebrow>
              <p className="font-display text-lg text-ink leading-relaxed">
                {p.text}
              </p>
              {p.note && (
                <p className="font-sans text-sm text-muted italic">{p.note}</p>
              )}
              <p className="font-sans text-xs text-muted">
                — จาก {p.bookTitle}
                <span className="italic ml-1">{p.author}</span>
              </p>
            </motion.div>
          ))}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: DEMO_PASSAGES.length * 0.08 + 0.1, ease: EASE }}
            className="font-sans text-xs text-muted/60 italic text-center pt-6"
          >
            นี่คือตัวอย่าง — เมื่อเธอเก็บประโยคของตัวเอง มันจะมาแทนที่
            <br />
            A glimpse — your own lines will replace these
          </motion.p>
        </div>
      ) : (
        <ol className="flex flex-col">
          {sorted.map((p, i) => {
            const book = bookMap.get(p.bookId);
            return (
              <motion.li
                key={p.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, ease: EASE }}
                className="flex flex-col gap-1.5 border-b border-line/60 py-5 last:border-0"
              >
                <p className="font-display text-lg text-ink leading-relaxed">
                  {p.text}
                </p>
                {p.note && (
                  <p className="font-sans text-sm text-muted italic">{p.note}</p>
                )}
                <p className="font-sans text-xs text-muted">
                  {book && `— จาก ${book.title} `}
                  <span className="opacity-60">{relativeTime(p.createdAt)}</span>
                </p>
              </motion.li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

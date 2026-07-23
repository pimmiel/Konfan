import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Body } from "@/components/ui/Typography";
import { ReadingProgress } from "@/components/books/ReadingProgress";
import { useBookStore } from "@/store/useBookStore";
import type { Book } from "@/types";

interface BookCardProps {
  book: Book;
  index?: number;
}

export function BookCard({ book, index = 0 }: BookCardProps) {
  const { updateProgress, finish, remove } = useBookStore();
  const [draft, setDraft] = useState(String(book.currentPage));

  const commitProgress = () => {
    const parsed = parseInt(draft, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      updateProgress(book.id, parsed);
    } else {
      setDraft(String(book.currentPage));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="w-full">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-display text-xl text-ink leading-tight truncate">
                {book.title}
              </p>
              {book.author && (
                <Body className="text-sm text-muted mt-0.5">{book.author}</Body>
              )}
            </div>

            {book.status === "finished" ? (
              <span className="shrink-0 font-sans text-xs text-honey bg-honey/15 rounded-pill px-3 py-1">
                ✓ อ่านจบแล้ว
              </span>
            ) : null}
          </div>

          {book.status === "reading" && (
            <>
              <ReadingProgress
                currentPage={book.currentPage}
                totalPages={book.totalPages}
              />

              <div className="flex items-center gap-3 flex-wrap">
                <div className="w-28">
                  <Input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onBlur={commitProgress}
                    onKeyDown={handleKeyDown}
                    type="number"
                    placeholder="หน้าปัจจุบัน"
                    className="py-1.5 text-sm"
                    aria-label="อัพเดทหน้าปัจจุบัน"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => finish(book.id)}
                >
                  อ่านจบแล้ว
                </Button>
                <Button
                  variant="quiet"
                  size="sm"
                  onClick={() => remove(book.id)}
                  aria-label={`ลบ ${book.title}`}
                >
                  ลบ
                </Button>
              </div>
            </>
          )}

          {book.status === "finished" && (
            <div className="flex justify-end">
              <Button
                variant="quiet"
                size="sm"
                onClick={() => remove(book.id)}
                aria-label={`ลบ ${book.title}`}
              >
                ลบ
              </Button>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

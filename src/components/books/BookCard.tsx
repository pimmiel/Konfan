import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Body } from "@/components/ui/Typography";
import { ReadingProgress } from "@/components/books/ReadingProgress";
import { BookDetail } from "@/components/books/BookDetail";
import { ClosingCeremonyModal } from "@/components/books/ClosingCeremonyModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useBookStore } from "@/store/useBookStore";
import { usePassageStore } from "@/store/usePassageStore";
import type { Book } from "@/types";

interface BookCardProps {
  book: Book;
  index?: number;
}

export function BookCard({ book, index = 0 }: BookCardProps) {
  const { updateProgress, finish, remove } = useBookStore();
  const passageCount = usePassageStore((s) => s.byBook(book.id).length);
  const [draft, setDraft] = useState(String(book.currentPage));
  const [showDetail, setShowDetail] = useState(false);
  const [showCeremony, setShowCeremony] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const commitProgress = () => {
    const parsed = parseInt(draft, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      updateProgress(book.id, parsed);
    } else {
      setDraft(String(book.currentPage));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") (e.target as HTMLInputElement).blur();
  };

  const handleConfirmFinish = (feeling: string) => {
    finish(book.id, feeling);
    setShowCeremony(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card className="w-full">
          <div className="flex flex-col gap-3">
            {/* Title row */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-display text-xl text-ink leading-tight truncate">
                  {book.title}
                </p>
                {book.author && (
                  <Body className="text-sm text-muted mt-0.5">{book.author}</Body>
                )}
                {book.closingFeeling && (
                  <p className="font-sans text-xs text-sage mt-0.5 italic">
                    {book.closingFeeling}
                  </p>
                )}
              </div>
              {book.status === "finished" && (
                <span className="shrink-0 font-sans text-xs text-honey bg-honey/15 rounded-pill px-3 py-1">
                  ✓ อ่านจบแล้ว
                </span>
              )}
            </div>

            {/* Reading controls */}
            {book.status === "reading" && (
              <>
                <ReadingProgress
                  currentPage={book.currentPage}
                  totalPages={book.totalPages}
                />

                {/* Passage count */}
                {passageCount > 0 && (
                  <button
                    onClick={() => setShowDetail(true)}
                    className="flex items-center gap-1.5 font-sans text-xs text-muted hover:text-honey transition-colors duration-300 ease-calm text-left"
                  >
                    <span aria-hidden>📓</span>
                    <span>เก็บไว้ {passageCount} ประโยค · {passageCount} lines kept</span>
                  </button>
                )}

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
                    onClick={() => setShowCeremony(true)}
                  >
                    อ่านจบแล้ว
                  </Button>
                  <Button
                    variant="quiet"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(true)}
                    aria-label={`ลบ ${book.title}`}
                  >
                    ลบ
                  </Button>
                </div>
              </>
            )}

            {/* Finished controls */}
            {book.status === "finished" && (
              <div className="flex items-center justify-between gap-3">
                {passageCount > 0 && (
                  <button
                    onClick={() => setShowDetail(true)}
                    className="flex items-center gap-1.5 font-sans text-xs text-muted hover:text-honey transition-colors duration-300 ease-calm"
                  >
                    <span aria-hidden>📓</span>
                    <span>{passageCount} ประโยค · {passageCount} lines</span>
                  </button>
                )}
                <div className="flex-1" />
                <Button
                  variant="quiet"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(true)}
                  aria-label={`ลบ ${book.title}`}
                >
                  ลบ
                </Button>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {showDetail && (
          <BookDetail book={book} onClose={() => setShowDetail(false)} />
        )}
        {showCeremony && (
          <ClosingCeremonyModal
            book={book}
            onClose={() => setShowCeremony(false)}
            onConfirm={handleConfirmFinish}
          />
        )}
        {showDeleteConfirm && (
          <ConfirmDialog
            title={`ลบ "${book.title}" ไหม?`}
            warning={
              passageCount > 0
                ? `ประโยคที่เก็บจากเล่มนี้ ${passageCount} ประโยคจะหายไปด้วย`
                : undefined
            }
            onConfirm={() => {
              remove(book.id);
              setShowDeleteConfirm(false);
            }}
            onClose={() => setShowDeleteConfirm(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

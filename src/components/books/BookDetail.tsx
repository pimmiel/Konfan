import { motion } from "framer-motion";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Eyebrow, Body } from "@/components/ui/Typography";
import { usePassageStore } from "@/store/usePassageStore";
import { relativeTime } from "@/lib/relativeTime";
import type { Book } from "@/types";

interface BookDetailProps {
  book: Book;
  onClose: () => void;
}

export function BookDetail({ book, onClose }: BookDetailProps) {
  const passages = usePassageStore((s) => s.byBook(book.id));
  const remove = usePassageStore((s) => s.remove);

  return (
    <Modal onClose={onClose} className="max-w-lg max-h-[80vh] overflow-y-auto">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="space-y-0.5">
          <p className="font-display text-2xl text-ink leading-tight">{book.title}</p>
          {book.author && (
            <p className="font-sans text-sm text-muted">{book.author}</p>
          )}
          {book.status === "reading" && book.totalPages && (
            <p className="font-sans text-xs text-muted pt-1">
              หน้า {book.currentPage} / {book.totalPages}
            </p>
          )}
        </div>

        {/* Passages */}
        {passages.length === 0 ? (
          <Body className="text-muted italic text-center py-4">
            ยังไม่ได้เก็บประโยคจากเล่มนี้เลย · No lines kept yet
          </Body>
        ) : (
          <ol className="flex flex-col gap-5">
            {passages.map((p, i) => (
              <motion.li
                key={p.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-1.5 border-b border-line pb-5 last:border-0 last:pb-0"
              >
                <p className="font-display text-lg text-ink leading-relaxed">
                  {p.text}
                </p>
                {p.note && (
                  <p className="font-sans text-sm text-muted italic">{p.note}</p>
                )}
                <div className="flex items-center justify-between gap-2 pt-0.5">
                  <span className="font-sans text-xs text-muted">
                    {p.page ? `หน้า ${p.page} · ` : ""}
                    {relativeTime(p.createdAt)}
                  </span>
                  <Button
                    variant="quiet"
                    size="sm"
                    onClick={() => remove(p.id)}
                    aria-label="ลบประโยคนี้"
                    className="text-xs"
                  >
                    ลบ
                  </Button>
                </div>
              </motion.li>
            ))}
          </ol>
        )}

        <div className="flex justify-end pt-2 border-t border-line">
          <Eyebrow>{passages.length} ประโยค · {passages.length} lines</Eyebrow>
        </div>
      </div>
    </Modal>
  );
}

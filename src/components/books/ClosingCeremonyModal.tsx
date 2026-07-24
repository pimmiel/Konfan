import { useState } from "react";
import { motion } from "framer-motion";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Typography";
import { usePassageStore } from "@/store/usePassageStore";
import type { Book } from "@/types";

interface ClosingCeremonyModalProps {
  book: Book;
  onClose: () => void;
  onConfirm: (feeling: string) => void;
}

const FEELINGS = [
  { th: "อบอุ่น", en: "warm" },
  { th: "สั่นสะเทือน", en: "moved" },
  { th: "สงบ", en: "calm" },
  { th: "จุดประกาย", en: "sparked" },
  { th: "เศร้าอย่างงดงาม", en: "beautifully sad" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export function ClosingCeremonyModal({ book, onClose, onConfirm }: ClosingCeremonyModalProps) {
  const [feeling, setFeeling] = useState("");
  const passages = usePassageStore((s) => s.byBook(book.id));

  return (
    <Modal onClose={onClose} className="max-w-lg max-h-[85vh] overflow-y-auto">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <p className="font-display text-2xl text-ink">{book.title}</p>
          <Eyebrow>สิ่งที่เล่มนี้ทิ้งไว้ · What this book left with you</Eyebrow>
        </div>

        {/* Passages stagger */}
        {passages.length === 0 ? (
          <p className="font-display italic text-muted text-center py-4 leading-relaxed">
            เล่มนี้อ่านจบเงียบๆ ก็ไม่เป็นไรนะ
            <br />
            <span className="text-sm">Some books we finish quietly</span>
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {passages.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.2, ease: EASE }}
                className="space-y-1"
              >
                <p className="font-display text-lg text-ink leading-relaxed">
                  {p.text}
                </p>
                {p.note && (
                  <p className="font-sans text-sm text-muted italic">{p.note}</p>
                )}
              </motion.div>
            ))}
          </div>
        )}

        <hr className="border-line" />

        {/* Feeling picker */}
        <div className="flex flex-col gap-3">
          <Eyebrow>ความรู้สึกตอนปิดเล่ม · A closing feeling</Eyebrow>
          <div className="flex flex-wrap gap-2">
            {FEELINGS.map((f) => {
              const active = feeling === f.en;
              return (
                <button
                  key={f.en}
                  onClick={() => setFeeling(f.en)}
                  className={
                    "font-sans text-sm rounded-pill px-4 py-2 border transition-all duration-300 ease-calm " +
                    (active
                      ? "bg-honey text-plum-deep border-honey shadow-glow"
                      : "border-line text-ink hover:border-sage hover:bg-sage/10")
                  }
                >
                  {f.th} · {f.en}
                </button>
              );
            })}
          </div>
        </div>

        {/* Confirm */}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="quiet" size="sm" onClick={onClose}>
            ยกเลิก
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onConfirm(feeling)}
            disabled={!feeling}
          >
            เก็บขึ้นชั้นความทรงจำ · Place on the memory shelf
          </Button>
        </div>
      </div>
    </Modal>
  );
}

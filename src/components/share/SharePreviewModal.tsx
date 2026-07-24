import { motion, AnimatePresence } from "framer-motion";
import { ShareCard } from "./ShareCard";
import type { Passage, Book } from "@/types";

interface SharePreviewModalProps {
  passage: Passage;
  book: Book;
  onClose: () => void;
}

// Card renders at 1080 × 1920; we scale it down to fit the preview
const CARD_W = 1080;
const PREVIEW_W = 268; // preview width inside the modal

export function SharePreviewModal({ passage, book, onClose }: SharePreviewModalProps) {
  const scale = PREVIEW_W / CARD_W;
  const previewH = Math.round(1920 * scale);

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-plum-deep/80 backdrop-blur-sm p-6"
        onClick={onClose}
      >
        <motion.div
          key="card"
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.35 }}
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col items-center gap-5"
        >
          {/* Scaled preview */}
          <div
            style={{
              width: PREVIEW_W,
              height: previewH,
              overflow: "hidden",
              borderRadius: 10,
              flexShrink: 0,
              boxShadow: "0 0 60px -12px rgba(224, 164, 88, 0.30), 0 24px 48px -16px rgba(0,0,0,0.6)",
            }}
          >
            <div
              style={{
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                width: CARD_W,
              }}
            >
              <ShareCard passage={passage} book={book} />
            </div>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="font-sans text-sm text-plum-soft hover:text-paper transition-colors duration-300 ease-calm"
          >
            ปิด · Close
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
